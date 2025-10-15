// ============================================
// CUTE PIXEL ART DOG COMPANION
// Based on Undertale's Annoying Dog
// ============================================

(function() {
  'use strict';

  // ======================================================
  // CLEAN, HAND-DEFINED SPRITE SET (24×20, no floatiness)
  // ======================================================

  // Color palette
  const COLORS = {
    0: null,            // transparent
    1: '#FFFFFF',       // white (body)
    2: '#000000',       // black outline
    3: '#FFB6C1'        // pink tongue
  };

  function deepCopy(p) { return p.map(r => r.slice()); }

  // Verified base from improved clean reference (white=1, transparent=0)
  const base24x20 = [
    [0,1,1,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,0,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,0,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1],
    [1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],
    [1,0,0,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,1,1,1,0],
    [0,1,1,1,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,1,1,1,0],
    [0,1,1,1,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,1,1,1,0],
    [0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0]
  ];

  // Define core poses
  const stand = { width: 24, height: 20, pixels: base24x20 };

  // Fix leg groups: four clean legs (matches improved base sprite)
  const LEG_GROUPS = [
    [1,3],   // front-left (3px wide)
    [7,8],   // back-left (2px wide)
    [15,16], // back-right (2px wide)
    [20,22]  // front-right (3px wide)
  ];

  // Safer offset function (clear before draw)
  function offsetLegsClean(base, shiftPattern) {
    const p = deepCopy(base.pixels);
    const h = p.length;

    LEG_GROUPS.forEach(([x0, x1], i) => {
      const dy = shiftPattern[i];
      for (let x = x0; x <= x1; x++) {
        // find lowest white pixel
        let bottom = null;
        for (let y = h - 1; y >= 0; y--) {
          if (p[y][x] === 1) { bottom = y; break; }
        }
        if (bottom != null) {
          p[bottom][x] = 0;                     // clear old
          const ny = Math.min(h - 1, bottom + dy);
          if (ny >= 0 && ny < h) p[ny][x] = 1;  // set new
        }
      }
    });
    return { width: 24, height: 20, pixels: p };
  }

  // Proper walk cycle (4 phases, clear gait)
  const walk1 = offsetLegsClean(stand, [-1, 0, +1, 0]);
  const walk2 = offsetLegsClean(stand, [0, +1, 0, -1]);
  const walk3 = offsetLegsClean(stand, [+1, 0, -1, 0]);
  const walk4 = offsetLegsClean(stand, [0, -1, 0, +1]);

  // Bark frames: toggle 2 pixels for mouth near snout
  function makeBark(base) {
    const closed = deepCopy(base.pixels);
    const open = deepCopy(base.pixels);
    const mouthY = 5, mouthX = 2;
    open[mouthY+1][mouthX+15] = 0;
    open[mouthY+2][mouthX+15] = 0;
    return [
      { width: 24, height: 20, pixels: closed },
      { width: 24, height: 20, pixels: open }
    ];
  }
  const [barkClosed, barkOpen] = makeBark(stand);

  // Sit and lie frames for completeness
  const sit = offsetLegsClean(stand, [0,1,0,1]);
  const lie = offsetLegsClean(stand, [2,2,2,2]);

  // Mirror for left-facing
  function mirror(sprite){return{width:sprite.width,height:sprite.height,pixels:sprite.pixels.map(r=>r.slice().reverse())}}

  // Final sprite map
  const dogSprites = {
    standRight: stand,
    standLeft: mirror(stand),
    walk1Right: walk1,
    walk2Right: walk2,
    walk3Right: walk3,
    walk4Right: walk4,
    walk1Left: mirror(walk1),
    walk2Left: mirror(walk2),
    walk3Left: mirror(walk3),
    walk4Left: mirror(walk4),
    barkClosedRight: barkClosed,
    barkOpenRight: barkOpen,
    barkClosedLeft: mirror(barkClosed),
    barkOpenLeft: mirror(barkOpen),
    sitRight: sit,
    sitLeft: mirror(sit),
    lieRight: lie,
    lieLeft: mirror(lie)
  };

  // ===========================================
  // TAIL WAG SYSTEM
  // ===========================================

  // Tail pixels (relative to top-left of sprite)
  const tailPixels = [
    [3, 2], [2, 3] // small up-curl on right-facing dog
  ];

  // Applies wag displacement to sprite pixels in-place
  function applyTailWag(sprite, frame) {
    const p = sprite.pixels.map(r => r.slice());
    const amp = frame % 2 === 0 ? 0 : 1; // wag amplitude
    tailPixels.forEach(([y, x]) => {
      const ty = Math.max(0, Math.min(p.length - 1, y + amp));
      const tx = Math.min(p[0].length - 1, x);
      if (p[ty][tx] === 0) p[ty][tx] = 1;
      if (amp && ty > 0) p[ty - 1][tx] = 0; // remove old
    });
    return { width: sprite.width, height: sprite.height, pixels: p };
  }

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
    frameCount: 0,

    tailWag: {
      active: false,
      timer: 0,
      frame: 0,
      lastToggle: 0
    }
  };

  // ============================================
  // CANVAS SETUP
  // ============================================
  function createDogCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'dog-canvas';
    canvas.width = 24;  // Initial size (24x20), will be dynamically adjusted
    canvas.height = 20;
    canvas.style.position = 'fixed';
    canvas.style.bottom = '60px';
    canvas.style.left = dog.x + 'px';
    canvas.style.width = '72px';   // Initial display at 3x size
    canvas.style.height = '60px';
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
  // DRAW LOGIC (keeps your state machine intact)
  // ============================================
  function drawDog() {
    if (!dog.ctx) return;

    const ctx = dog.ctx;
    const canvas = dog.canvasEl;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let sprite;
    let yOffset = 0;

    if (dog.currentBehavior === 'sitting') {
      sprite = dog.facingRight ? dogSprites.sitRight : dogSprites.sitLeft;
    } else if (dog.currentBehavior === 'lying') {
      sprite = dog.facingRight ? dogSprites.lieRight : dogSprites.lieLeft;
    } else if (dog.currentBehavior === 'barking') {
      const bark = Math.floor(dog.frameCount / 8) % 2;
      sprite = dog.facingRight
        ? (bark ? dogSprites.barkOpenRight : dogSprites.barkClosedRight)
        : (bark ? dogSprites.barkOpenLeft  : dogSprites.barkClosedLeft);
    } else if (dog.currentBehavior === 'excited') {
      const hop = Math.floor(dog.frameCount / 4) % 4;
      yOffset = hop === 1 ? -3 : hop === 2 ? -1 : 0;
      sprite = dog.facingRight ? dogSprites.standRight : dogSprites.standLeft;
    } else if (dog.isWalking) {
      const f = Math.floor(dog.walkFrame / 6) % 4;  // four-phase gait
      const bounce = [0, -1, 0, +1][f];             // small vertical bob
      yOffset = bounce;
      const rightFrames = [dogSprites.walk1Right, dogSprites.walk2Right, dogSprites.walk3Right, dogSprites.walk4Right];
      const leftFrames = [dogSprites.walk1Left, dogSprites.walk2Left, dogSprites.walk3Left, dogSprites.walk4Left];
      sprite = dog.facingRight ? rightFrames[f] : leftFrames[f];
      dog.walkFrame++;
    } else {
      sprite = dog.facingRight ? dogSprites.standRight : dogSprites.standLeft;
    }

    // Tail wag behavior
    if (!dog.tailWag.active) {
      // idle: random wag chance
      if (!dog.isWalking && Math.random() < 0.002) {
        dog.tailWag.active = true;
        dog.tailWag.timer = 20 + Math.floor(Math.random() * 20);
      }
    } else {
      // active wag
      dog.tailWag.frame++;
      dog.tailWag.timer--;
      if (dog.tailWag.timer <= 0) {
        dog.tailWag.active = false;
        dog.tailWag.frame = 0;
      }
    }

    // wag always active while walking
    if (dog.isWalking) dog.tailWag.active = true;

    // apply wag transform
    if (dog.tailWag.active && dog.facingRight) {
      sprite = applyTailWag(sprite, dog.tailWag.frame);
    }

    // Match canvas to sprite, keep your 3× CSS scaling
    const margin = 4; // pixels of breathing room
    canvas.width  = sprite.width;
    canvas.height = sprite.height + margin * 2;
    canvas.style.width = sprite.width * 3 + 'px';
    canvas.style.height = (sprite.height + margin * 2) * 3 + 'px';

    ctx.save();
    ctx.translate(0, margin + yOffset); // center + apply offset

    const px = sprite.pixels;
    for (let y = 0; y < sprite.height; y++) {
      for (let x = 0; x < sprite.width; x++) {
        if (px[y][x] === 1) {
          ctx.fillStyle = COLORS[1];
          ctx.fillRect(x, y, 1, 1);
        } else if (px[y][x] === 2) {
          ctx.fillStyle = COLORS[2];
          ctx.fillRect(x, y, 1, 1);
        } else if (px[y][x] === 3) {
          ctx.fillStyle = COLORS[3];
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    ctx.restore();
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

    // Toggle tail wag on click
    dog.tailWag.active = !dog.tailWag.active;
    dog.tailWag.timer = dog.tailWag.active ? 9999 : 0;

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
