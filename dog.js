// ============================================
// CUTE PIXEL ART DOG COMPANION
// Based on Undertale's Annoying Dog
// ============================================

(function() {
  'use strict';

  // ============================================
  // SPRITE GENERATION FROM VERIFIED BASE (24×20)
  // ============================================

  // Color palette
  const COLORS = {
    0: null,            // transparent
    1: '#FFFFFF',       // white (body)
    2: '#000000',       // black outline
    3: '#FFB6C1'        // pink tongue
  };

  function deepCopyPixels(p) {
    return p.map(row => row.slice());
  }

  function mirrorSprite(sprite) {
    const pixels = sprite.pixels.map(row => [...row].reverse());
    return { width: sprite.width, height: sprite.height, pixels };
  }

  // Find contiguous bottom-leg column ranges once (robust to small changes)
  function detectLegRanges(basePixels) {
    const h = basePixels.length, w = basePixels[0].length;
    const bottomRows = 4;                       // sample last few rows
    const sums = new Array(w).fill(0);
    for (let y = h - bottomRows; y < h; y++) {
      for (let x = 0; x < w; x++) sums[x] += basePixels[y][x];
    }
    const ranges = [];
    let start = null, prev = null;
    for (let x = 0; x < w; x++) {
      if (sums[x] > 0) {
        if (start === null) start = prev = x;
        else if (x === prev + 1) prev = x;
        else { ranges.push([start, prev]); start = prev = x; }
      } else if (start !== null) {
        ranges.push([start, prev]); start = prev = null;
      }
    }
    if (start !== null) ranges.push([start, prev]);
    return ranges;
  }

  // Lift a leg group by 1px: move its lowest white pixel up by 1
  function liftLegGroup(pixels, x0, x1) {
    const h = pixels.length;
    for (let x = x0; x <= x1; x++) {
      // find the bottom-most 1 in this column
      for (let y = h - 1; y >= 1; y--) {
        if (pixels[y][x] === 1 && pixels[y - 1][x] === 0) {
          pixels[y][x] = 0;
          pixels[y - 1][x] = 1;
          break;
        }
      }
    }
  }

  // Make two walk frames by alternately lifting leg pairs 1&3 vs 2&4
  function makeWalkFrames(base, legRanges) {
    const walk1 = deepCopyPixels(base.pixels);
    const walk2 = deepCopyPixels(base.pixels);
    if (legRanges.length >= 4) {
      // 0 & 2 lift in frame1; 1 & 3 lift in frame2
      liftLegGroup(walk1, legRanges[0][0], legRanges[0][1]);
      liftLegGroup(walk1, legRanges[2][0], legRanges[2][1]);
      liftLegGroup(walk2, legRanges[1][0], legRanges[1][1]);
      liftLegGroup(walk2, legRanges[3][0], legRanges[3][1]);
    } else {
      // Fallback: alternate even/odd leg clusters
      legRanges.forEach((r, i) => {
        if (i % 2 === 0) liftLegGroup(walk1, r[0], r[1]);
        else             liftLegGroup(walk2, r[0], r[1]);
      });
    }
    return [
      { width: base.width, height: base.height, pixels: walk1 },
      { width: base.width, height: base.height, pixels: walk2 }
    ];
  }

  // Tiny mouth toggle near the snout for bark frames.
  function makeBarkFrames(base, facing = 'right') {
    const closed = deepCopyPixels(base.pixels);
    const open   = deepCopyPixels(base.pixels);
    const w = base.width, h = base.height;

    // heuristic mouth patch location (front/top quadrant)
    const patchY = Math.max(3, Math.floor(h * 0.35));
    const patchX = facing === 'right' ? Math.floor(w * 0.42) : Math.floor(w * 0.58);

    // Ensure we place the mouth into the white area (so it shows)
    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 2; dx++) {
        const y = patchY + dy, x = patchX + dx;
        if (y >= 0 && y < h && x >= 0 && x < w && open[y][x] === 1) {
          open[y][x] = 0;             // open mouth = hole in white
        }
      }
    }
    // closed == unchanged base
    return [
      { width: base.width, height: base.height, pixels: closed },
      { width: base.width, height: base.height, pixels: open }
    ];
  }

  // Sit: trim a little height from the front legs
  function makeSitFrame(base, legRanges) {
    const sit = deepCopyPixels(base.pixels);
    // Raise the two front-leg groups slightly
    const toRaise = legRanges.length >= 2 ? [legRanges[0], legRanges[1]] : legRanges;
    toRaise.forEach(r => liftLegGroup(sit, r[0], r[1]));
    return { width: base.width, height: base.height, pixels: sit };
  }

  // Lie: shift the top two rows down ~2 px and flatten feet
  function makeLieFrames(base) {
    const lie1 = deepCopyPixels(base.pixels);
    const lie2 = deepCopyPixels(base.pixels);
    const h = base.height, w = base.width;

    // Vertical squash: move the top 3 rows down by 1/2 pixels (discrete version)
    for (let y = 1; y < h; y++) for (let x = 0; x < w; x++) {
      if (lie1[y - 1][x] === 1 && lie1[y][x] === 0) {
        lie1[y][x] = 1; lie1[y - 1][x] = 0;
      }
    }
    // Breath alt: do a second pass one row further
    for (let y = 1; y < h; y++) for (let x = 0; x < w; x++) {
      if (lie2[y - 1][x] === 1 && lie2[y][x] === 0 && Math.random() < 0.5) {
        lie2[y][x] = 1; lie2[y - 1][x] = 0;
      }
    }
    return [
      { width: base.width, height: base.height, pixels: lie1 },
      { width: base.width, height: base.height, pixels: lie2 }
    ];
  }

  // ---------- Base sprite from your reference (24×20) ----------
  // 0 = transparent, 1 = white. (No black outline needed.)
  const baseStandRight = {
    width: 24,
    height: 20,
    pixels: [
      [0,1,1,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,1,1,0,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
      [1,1,1,0,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1],
      [1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],
      [1,0,0,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1],
      [1,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1],
      [1,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1],
      [1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0]
    ]
  };

  // Build the whole suite
  const legRanges = detectLegRanges(baseStandRight.pixels);
  const [walk1R, walk2R] = makeWalkFrames(baseStandRight, legRanges);
  const [barkClosedR, barkOpenR] = makeBarkFrames(baseStandRight, 'right');
  const [lie1R, lie2R] = makeLieFrames(baseStandRight);
  const sitR = makeSitFrame(baseStandRight, legRanges);

  const baseStandLeft  = mirrorSprite(baseStandRight);
  const [walk1L, walk2L] = [mirrorSprite(walk1R), mirrorSprite(walk2R)];
  const [barkClosedL, barkOpenL] = [mirrorSprite(barkClosedR), mirrorSprite(barkOpenR)];
  const [lie1L, lie2L] = [mirrorSprite(lie1R), mirrorSprite(lie2R)];
  const sitL = mirrorSprite(sitR);

  // Export object in the same shape your code expects
  const dogSprites = {
    standRight: baseStandRight,
    standLeft:  baseStandLeft,
    walk1Right: walk1R,
    walk2Right: walk2R,
    walk1Left:  walk1L,
    walk2Left:  walk2L,
    barkClosedRight: barkClosedR,
    barkOpenRight:   barkOpenR,
    barkClosedLeft:  barkClosedL,
    barkOpenLeft:    barkOpenL,
    sitRight:  sitR,
    sitLeft:   sitL,
    lie1Right: lie1R,
    lie2Right: lie2R,
    lie1Left:  lie1L,
    lie2Left:  lie2L
  };

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
      const breath = Math.floor(dog.frameCount / 60) % 2;
      sprite = dog.facingRight
        ? (breath ? dogSprites.lie1Right : dogSprites.lie2Right)
        : (breath ? dogSprites.lie1Left  : dogSprites.lie2Left);
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
      // Add subtle walk bounce
      const frame = Math.floor(dog.walkFrame / 8) % 2;
      const bounce = Math.sin(dog.walkFrame / 8) * 1.2; // small up/down bob
      yOffset = bounce;
      sprite = dog.facingRight
        ? (frame ? dogSprites.walk1Right : dogSprites.walk2Right)
        : (frame ? dogSprites.walk1Left  : dogSprites.walk2Left);
      dog.walkFrame++;
    } else {
      sprite = dog.facingRight ? dogSprites.standRight : dogSprites.standLeft;
    }

    // Match canvas to sprite, keep your 3× CSS scaling
    canvas.width = sprite.width;
    canvas.height = sprite.height;
    canvas.style.width = sprite.width * 3 + 'px';
    canvas.style.height = sprite.height * 3 + 'px';

    if (yOffset) { ctx.save(); ctx.translate(0, yOffset); }

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

    if (yOffset) ctx.restore();
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
