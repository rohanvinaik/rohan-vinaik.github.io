// ============================================
// CUTE PIXEL ART DOG COMPANION
// Based on Undertale's Annoying Dog
// ============================================

(function() {
  'use strict';

  // ============================================
  // CLEAN SPRITE + DRAW LOGIC REBUILD
  // ============================================

  // Color palette
  const COLORS = {
    0: null,            // transparent
    1: '#FFFFFF',       // white (body)
    2: '#000000',       // black outline
    3: '#FFB6C1'        // pink tongue
  };

  // ======================================================
  // UNDERTALE-STYLE SPRITES (16×16, minimal, hand-defined)
  // ======================================================
  const dogSprites = (() => {
    const W = 16, H = 16;

    const base = [
      "................",
      "...#####.........",
      "..#######........",
      ".##########......",
      ".###########.....",
      "#############....",
      "#############....",
      "#############....",
      "#############....",
      ".###.....###.....",
      ".###.....###.....",
      ".###.....###.....",
      ".###.....###.....",
      "................",
      "................",
      "................"
    ];

    const walk1 = [
      "................",
      "...#####.........",
      "..#######........",
      ".##########......",
      ".###########.....",
      "#############....",
      "#############....",
      "#############....",
      "#############....",
      ".###.....###.....",
      ".###......###....",
      ".###......###....",
      ".###.....###.....",
      "................",
      "................",
      "................"
    ];

    const walk2 = [
      "................",
      "...#####.........",
      "..#######........",
      ".##########......",
      ".###########.....",
      "#############....",
      "#############....",
      "#############....",
      "#############....",
      ".###......###....",
      ".###.....###.....",
      ".###.....###.....",
      ".###......###....",
      "................",
      "................",
      "................"
    ];

    const barkClosed = [...base];
    const barkOpen = barkClosed.map((r, i) =>
      i === 4 ? r.replace("#####", "##..#") : r
    );

    const sit = [
      "................",
      "...#####.........",
      "..#######........",
      ".##########......",
      ".###########.....",
      "###########......",
      "###########......",
      "###########......",
      "..#########......",
      "..#########......",
      "...#######.......",
      "...#######.......",
      "................",
      "................",
      "................",
      "................"
    ];

    const lie = [
      "................",
      "................",
      "....########....",
      "...##########...",
      "..############..",
      ".#############..",
      ".#############..",
      ".#############..",
      "....#######.....",
      "....#######.....",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................"
    ];

    const mirror = arr => arr.map(r => [...r].reverse().join(''));

    function encode(shape) {
      return shape.map(row => [...row].map(c => (c === '#' ? 1 : 0)));
    }

    return {
      standRight: { width: W, height: H, pixels: encode(base) },
      standLeft:  { width: W, height: H, pixels: encode(mirror(base)) },
      walk1:      { width: W, height: H, pixels: encode(walk1) },
      walk2:      { width: W, height: H, pixels: encode(walk2) },
      barkClosed: { width: W, height: H, pixels: encode(barkClosed) },
      barkOpen:   { width: W, height: H, pixels: encode(barkOpen) },
      sit:        { width: W, height: H, pixels: encode(sit) },
      lie1:       { width: W, height: H, pixels: encode(lie) },
      lie2:       { width: W, height: H, pixels: encode(lie) }
    };
  })();

  // ============================================
  // DOG STATE
  // ============================================
  let dog = {
    element: null,
    canvasEl: null,
    ctx: null,
    enabled: false,

    x: 200,
    y: window.innerHeight - 120,

    targetX: null,
    targetY: null,
    walkSpeed: 2,
    isWalking: false,
    facingRight: true,
    walkFrame: 0,

    currentBehavior: 'idle',
    behaviorTimer: null,
    lastInteraction: Date.now(),

    animationFrame: null,
    frameCount: 0
  };

  // ============================================
  // CANVAS SETUP
  // ============================================
  function createDogCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'dog-canvas';
    canvas.width = 16;  // Initial size, will be dynamically adjusted
    canvas.height = 16;
    canvas.style.position = 'fixed';
    canvas.style.bottom = '60px';
    canvas.style.left = dog.x + 'px';
    canvas.style.width = '48px';   // Initial display at 3x size
    canvas.style.height = '48px';
    canvas.style.imageRendering = 'pixelated';
    canvas.style.imageRendering = '-moz-crisp-edges';
    canvas.style.imageRendering = 'crisp-edges';
    canvas.style.zIndex = '500';
    canvas.style.cursor = 'pointer';
    canvas.style.display = 'none';

    canvas.addEventListener('click', petDog);

    document.body.appendChild(canvas);
    dog.canvasEl = canvas;
    dog.ctx = canvas.getContext('2d');
  }

  // ============================================
  // DRAW PIXEL DOG - Rebuilt Animation Logic
  // ============================================
  function drawDog() {
    if (!dog.ctx) return;

    const ctx = dog.ctx;
    const canvas = dog.canvasEl;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let sprite;
    let yOffset = 0;

    switch (dog.currentBehavior) {
      case 'sitting':
        sprite = dogSprites.sit;
        break;

      case 'lying':
        sprite = (Math.floor(dog.frameCount / 60) % 2 === 0)
          ? dogSprites.lie1
          : dogSprites.lie2;
        break;

      case 'barking':
        sprite = (Math.floor(dog.frameCount / 8) % 2 === 0)
          ? dogSprites.barkClosed
          : dogSprites.barkOpen;
        break;

      case 'excited':
        const hop = Math.floor(dog.frameCount / 4) % 4;
        yOffset = hop === 1 ? -3 : hop === 2 ? -1 : 0;
        sprite = dog.facingRight ? dogSprites.standRight : dogSprites.standLeft;
        break;

      default:
        if (dog.isWalking) {
          const f = Math.floor(dog.walkFrame / 8) % 2;
          sprite = dog.facingRight
            ? (f ? dogSprites.walk1 : dogSprites.walk2)
            : (f ? dogSprites.walk2 : dogSprites.walk1);
          dog.walkFrame++;
        } else {
          sprite = dog.facingRight ? dogSprites.standRight : dogSprites.standLeft;
        }
        break;
    }

    // Resize canvas dynamically for sprite
    canvas.width = sprite.width;
    canvas.height = sprite.height;
    canvas.style.width = sprite.width * 3 + 'px';
    canvas.style.height = sprite.height * 3 + 'px';

    if (yOffset !== 0) ctx.save(), ctx.translate(0, yOffset);

    const px = sprite.pixels;
    for (let y = 0; y < sprite.height; y++) {
      for (let x = 0; x < sprite.width; x++) {
        const colorIndex = px[y][x];
        if (!colorIndex) continue;
        ctx.fillStyle = COLORS[colorIndex];
        ctx.fillRect(x, y, 1, 1);
      }
    }

    if (yOffset !== 0) ctx.restore();
  }

  // ============================================
  // MOVEMENT & BEHAVIOR
  // ============================================

  function pickRandomDestination() {
    const screenWidth = window.innerWidth;
    const margin = 100;

    const destinations = [
      { x: margin },
      { x: screenWidth - margin },
      { x: screenWidth / 2 },
      { x: margin + Math.random() * 200 },
      { x: screenWidth - margin - Math.random() * 200 }
    ];

    const dest = destinations[Math.floor(Math.random() * destinations.length)];
    dog.targetX = dest.x;
    dog.isWalking = true;
    dog.currentBehavior = 'walking';

    if (dest.x > dog.x) {
      dog.facingRight = true;
    } else {
      dog.facingRight = false;
    }
  }

  function updateMovement() {
    if (!dog.isWalking || dog.targetX === null) return;

    const distance = Math.abs(dog.targetX - dog.x);

    if (distance < dog.walkSpeed) {
      dog.x = dog.targetX;
      dog.isWalking = false;
      dog.targetX = null;
      dog.walkFrame = 0;

      scheduleNextBehavior();
      return;
    }

    if (dog.targetX > dog.x) {
      dog.x += dog.walkSpeed;
      dog.facingRight = true;
    } else {
      dog.x -= dog.walkSpeed;
      dog.facingRight = false;
    }

    dog.canvasEl.style.left = dog.x + 'px';
  }

  function scheduleNextBehavior() {
    const behaviors = [
      { action: 'sit', duration: 5000, weight: 3 },
      { action: 'lie', duration: 8000, weight: 2 },
      { action: 'stand', duration: 3000, weight: 4 },
      { action: 'walk', duration: 0, weight: 3 },
      { action: 'bark', duration: 2000, weight: 1 }
    ];

    const totalWeight = behaviors.reduce((sum, b) => sum + b.weight, 0);
    let random = Math.random() * totalWeight;

    for (const behavior of behaviors) {
      random -= behavior.weight;
      if (random <= 0) {
        executeBehavior(behavior.action, behavior.duration);
        break;
      }
    }
  }

  function executeBehavior(action, duration) {
    clearTimeout(dog.behaviorTimer);

    switch (action) {
      case 'sit':
        dog.currentBehavior = 'sitting';
        dog.behaviorTimer = setTimeout(() => {
          dog.currentBehavior = 'idle';
          scheduleNextBehavior();
        }, duration);
        break;

      case 'lie':
        dog.currentBehavior = 'lying';
        dog.behaviorTimer = setTimeout(() => {
          dog.currentBehavior = 'idle';
          scheduleNextBehavior();
        }, duration);
        break;

      case 'stand':
        dog.currentBehavior = 'idle';
        dog.behaviorTimer = setTimeout(() => {
          scheduleNextBehavior();
        }, duration);
        break;

      case 'walk':
        pickRandomDestination();
        break;

      case 'bark':
        dog.currentBehavior = 'barking';
        playBarkSound();
        dog.behaviorTimer = setTimeout(() => {
          dog.currentBehavior = 'idle';
          scheduleNextBehavior();
        }, duration);
        break;
    }
  }

  // ============================================
  // PET INTERACTION
  // ============================================
  function petDog() {
    clearTimeout(dog.behaviorTimer);
    dog.isWalking = false;
    dog.targetX = null;

    dog.currentBehavior = 'excited';

    playHappySound();

    dog.behaviorTimer = setTimeout(() => {
      dog.currentBehavior = 'idle';
      scheduleNextBehavior();
    }, 1500);

    if (window.AchievementSystem) {
      window.AchievementSystem.incrementDog();
    }

    dog.lastInteraction = Date.now();
  }

  // ============================================
  // MAIN ANIMATION LOOP
  // ============================================
  function startAnimationLoop() {
    function animate() {
      if (!dog.enabled) return;

      dog.frameCount++;
      updateMovement();
      drawDog();

      const timeSinceInteraction = Date.now() - dog.lastInteraction;
      if (timeSinceInteraction > 60000 && dog.currentBehavior !== 'lying') {
        executeBehavior('lie', 30000);
      }

      dog.animationFrame = requestAnimationFrame(animate);
    }

    animate();
  }

  // ============================================
  // SOUND EFFECTS
  // ============================================
  function playBarkSound() {
    const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');
    if (settings.volume && settings.volume > 0) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 400;
        oscillator.type = 'square';
        gainNode.gain.value = settings.volume / 300;

        oscillator.start();
        setTimeout(() => {
          oscillator.frequency.value = 200;
        }, 50);
        setTimeout(() => oscillator.stop(), 150);
      } catch (e) {
        // Fail silently
      }
    }
  }

  function playHappySound() {
    const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');
    if (settings.volume && settings.volume > 0) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 400;
        oscillator.type = 'sine';
        gainNode.gain.value = settings.volume / 400;

        oscillator.start();
        setTimeout(() => { oscillator.frequency.value = 500; }, 100);
        setTimeout(() => { oscillator.frequency.value = 600; }, 200);
        setTimeout(() => oscillator.stop(), 300);
      } catch (e) {
        // Fail silently
      }
    }
  }

  // ============================================
  // ENABLE/DISABLE DOG
  // ============================================
  function enableDog() {
    if (dog.enabled) return;

    dog.enabled = true;

    if (!dog.canvasEl) {
      createDogCanvas();
    }

    dog.canvasEl.style.display = 'block';

    dog.x = 100 + Math.random() * (window.innerWidth - 200);
    dog.canvasEl.style.left = dog.x + 'px';

    startAnimationLoop();

    setTimeout(() => scheduleNextBehavior(), 2000);
  }

  function disableDog() {
    if (!dog.enabled) return;

    dog.enabled = false;

    if (dog.canvasEl) {
      dog.canvasEl.style.display = 'none';
    }

    if (dog.animationFrame) {
      cancelAnimationFrame(dog.animationFrame);
    }

    clearTimeout(dog.behaviorTimer);
  }

  // ============================================
  // HIDDEN TRIGGER: "gooddog"
  // ============================================
  let commandBuffer = '';
  document.addEventListener('keypress', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      return;
    }

    commandBuffer += e.key;

    if (commandBuffer.endsWith('gooddog')) {
      if (dog.enabled) {
        petDog();
      } else {
        enableDog();
        setTimeout(() => petDog(), 1000);
      }
      commandBuffer = '';
    }

    if (commandBuffer.length > 20) {
      commandBuffer = '';
    }
  });

  // ============================================
  // EXPORT FUNCTIONS
  // ============================================
  window.ASCIIDog = {
    enable: enableDog,
    disable: disableDog,
    isEnabled: () => dog.enabled
  };

  // ============================================
  // LOAD SAVED STATE
  // ============================================
  window.addEventListener('DOMContentLoaded', () => {
    const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');
    if (settings.asciiDog) {
      enableDog();
    }

    const dogToggle = document.getElementById('enable-dog');
    if (dogToggle) {
      dogToggle.checked = settings.asciiDog || false;
      dogToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          enableDog();
        } else {
          disableDog();
        }

        settings.asciiDog = e.target.checked;
        localStorage.setItem('dashboard-settings', JSON.stringify(settings));
      });
    }
  });

})();
