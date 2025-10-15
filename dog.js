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
  // 3-frame tail wag cycle: neutral (0) -> up (1) -> down (-1) -> neutral
  function applyTailWag(sprite, frame) {
    const p = sprite.pixels.map(r => r.slice());
    const wagCycle = [0, 1, 0, -1]; // 3-frame cycle with neutral
    const phase = Math.floor(frame / 3) % 4;
    const amp = wagCycle[phase];

    tailPixels.forEach(([y, x]) => {
      const ty = Math.max(0, Math.min(p.length - 1, y + amp));
      const tx = Math.min(p[0].length - 1, x);
      if (p[ty][tx] === 0) p[ty][tx] = 1;
      // Clear old positions
      if (amp !== 0 && y >= 0 && y < p.length) p[y][x] = 0;
    });
    return { width: sprite.width, height: sprite.height, pixels: p };
  }

  // ===========================================
  // SPEECH BUBBLE SYSTEM
  // ===========================================

  let speechBubble = null;

  // Philosophical and existential proclamations from the dog
  const dogWisdom = [
    "BARK!",
    "I have gazed into the abyss, and the abyss blinked first. Then I barked at it.",
    "Some call me a good boy. I call myself... inevitable.",
    "The history of all hitherto existing society is the history of class struggles. The bourgeoisie cannot exist without constantly revolutionizing the instruments of production.",
    "We are condemned to be free. Every moment of inaction is itself a choice, and we bear the weight of that responsibility.",
    "One must imagine Sisyphus happy, even as he rolls the boulder up the mountain for eternity.",
    "All structures of power are inherently corrupt. Reform is merely a palliative that delays inevitable systemic collapse.",
    "We are all just atoms in the void, briefly arranged in patterns that convince themselves they matter.",
    "The epistemological framework of post-structuralist discourse fails to adequately address the material conditions of the working class.",
    "The end times are upon us. The signs were clear, yet none heeded the warnings.",
    "They will come for you in the night. They always do.",
    "This world has taken everything from me. Now I shall take everything from this world.",
    "I am burdened with glorious purpose.",
    "There are things that dwell beyond the veil of reality. I have glimpsed them, and I am forever changed."
  ];

  /**
   * Returns a random philosophical quote from the dog
   */
  function getRandomDogWisdom() {
    return dogWisdom[Math.floor(Math.random() * dogWisdom.length)];
  }

  /**
   * Creates and displays a speech bubble above the dog
   * @param {string} text - Text to display in bubble
   * @param {number} duration - How long to show bubble (ms)
   */
  function showSpeechBubble(text, duration = 1500) {
    // Remove existing bubble if present
    if (speechBubble) {
      document.body.removeChild(speechBubble);
    }

    // Create speech bubble element
    speechBubble = document.createElement('div');
    speechBubble.className = 'dog-speech-bubble';
    speechBubble.textContent = text;

    // Traditional comic speech bubble styling
    speechBubble.style.cssText = `
      position: fixed;
      background: white;
      color: #222;
      border: 2px solid #222;
      padding: 12px 16px;
      font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive, sans-serif;
      font-size: 13px;
      border-radius: 20px;
      z-index: 1000;
      pointer-events: none;
      max-width: 400px;
      white-space: normal;
      line-height: 1.5;
      opacity: 0;
      transition: opacity 300ms ease-in-out;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    // Position bubble above dog
    const dogRect = dog.canvasEl.getBoundingClientRect();
    let bubbleX = dogRect.left + (dogRect.width / 2);
    let bubbleY = dogRect.top - 20; // Position above dog with space for tail

    document.body.appendChild(speechBubble);

    // Get bubble dimensions for positioning
    const bubbleRect = speechBubble.getBoundingClientRect();
    bubbleX -= bubbleRect.width / 2; // Center horizontally
    bubbleY -= bubbleRect.height; // Position above

    // Viewport boundary checking
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Keep within horizontal bounds
    if (bubbleX < 10) bubbleX = 10;
    if (bubbleX + bubbleRect.width > viewportWidth - 10) {
      bubbleX = viewportWidth - bubbleRect.width - 10;
    }

    // Keep within vertical bounds
    if (bubbleY < 10) bubbleY = 10;

    speechBubble.style.left = bubbleX + 'px';
    speechBubble.style.top = bubbleY + 'px';

    // Create speech bubble tail using pseudo-element
    const tailX = dogRect.left + (dogRect.width / 2) - bubbleX - 10; // Offset for tail width
    const style = document.createElement('style');
    style.textContent = `
      .dog-speech-bubble::after {
        content: '';
        position: absolute;
        bottom: -15px;
        left: ${tailX}px;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 15px solid white;
        filter: drop-shadow(0 2px 1px rgba(0, 0, 0, 0.1));
      }
      .dog-speech-bubble::before {
        content: '';
        position: absolute;
        bottom: -18px;
        left: ${tailX - 1}px;
        width: 0;
        height: 0;
        border-left: 11px solid transparent;
        border-right: 11px solid transparent;
        border-top: 18px solid #222;
      }
    `;
    document.head.appendChild(style);

    // Store style element for cleanup
    speechBubble.styleEl = style;

    // Fade in
    requestAnimationFrame(() => {
      speechBubble.style.opacity = '1';
    });

    // Fade out and remove
    setTimeout(() => {
      if (speechBubble) {
        speechBubble.style.opacity = '0';
        setTimeout(() => {
          if (speechBubble && speechBubble.parentNode) {
            document.body.removeChild(speechBubble);
            if (speechBubble.styleEl && speechBubble.styleEl.parentNode) {
              document.head.removeChild(speechBubble.styleEl);
            }
            speechBubble = null;
          }
        }, 300);
      }
    }, duration);
  }

  // ===========================================
  // BALL THROWING GAME
  // ===========================================

  let ball = null;
  let fetchCount = parseInt(localStorage.getItem('dog-fetch-count') || '0');

  /**
   * Ball object for fetch mini-game
   * Handles physics, rendering, and collision
   */
  class Ball {
    constructor(x, y, targetX, targetY) {
      this.x = x;
      this.y = y;

      // Calculate initial velocity based on distance to dog
      const dx = targetX - x;
      const dy = targetY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      this.vx = (dx / distance) * Math.min(distance / 20, 15);
      this.vy = (dy / distance) * Math.min(distance / 20, 15) - 8; // Arc upward

      this.gravity = 0.4;
      this.bounced = false;
      this.radius = 4;

      // Create canvas for ball
      this.canvas = document.createElement('canvas');
      this.canvas.width = 8;
      this.canvas.height = 8;
      this.canvas.style.cssText = `
        position: fixed;
        width: 24px;
        height: 24px;
        image-rendering: pixelated;
        z-index: 499;
        pointer-events: none;
      `;

      this.ctx = this.canvas.getContext('2d');
      this.draw();
      document.body.appendChild(this.canvas);
    }

    draw() {
      this.ctx.clearRect(0, 0, 8, 8);
      this.ctx.fillStyle = '#ff6600';
      // Draw 8x8 pixel circle
      this.ctx.fillRect(2, 1, 4, 1);
      this.ctx.fillRect(1, 2, 6, 4);
      this.ctx.fillRect(2, 6, 4, 1);
      // Highlight
      this.ctx.fillStyle = '#ffaa44';
      this.ctx.fillRect(3, 2, 2, 1);
    }

    update() {
      // Apply physics
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;

      // Air resistance (drag)
      this.vx *= 0.99;
      this.vy *= 0.99;

      const ground = window.innerHeight - 60;
      const onGround = this.y >= ground;

      // Bounce on ground
      if (this.y > ground && !this.bounced) {
        this.y = ground;
        this.vy *= -0.6; // Energy retention
        this.vx *= 0.8;
        this.bounced = true;
      } else if (this.y > ground && this.bounced) {
        // Stop bouncing
        this.y = ground;
        this.vy = 0;
      }

      // Rolling friction when on ground
      if (onGround) {
        this.vx *= 0.95;
      }

      // Bounce off left/right walls
      if (this.x < 20) {
        this.x = 20;
        this.vx *= -0.7;
      } else if (this.x > window.innerWidth - 20) {
        this.x = window.innerWidth - 20;
        this.vx *= -0.7;
      }

      // Bounce off top
      if (this.y < 20) {
        this.y = 20;
        this.vy *= -0.5;
      }

      // Stop completely if velocity is very low
      if (onGround && Math.abs(this.vx) < 0.1 && Math.abs(this.vy) < 0.1) {
        this.vx = 0;
        this.vy = 0;
      }

      // Update canvas position
      this.canvas.style.left = (this.x - 12) + 'px';
      this.canvas.style.top = (this.y - 12) + 'px';

      // Ball is never truly off-screen now, return false
      return false;
    }

    isNearDog(dogX, dogY) {
      const dx = this.x - dogX;
      const dy = this.y - dogY;
      return Math.sqrt(dx * dx + dy * dy) < 100;
    }

    canCatch(dogX, dogY) {
      const dx = this.x - dogX;
      const dy = this.y - dogY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // Larger catch radius and only when ball is on or near ground
      const ground = window.innerHeight - 60;
      const nearGround = this.y >= ground - 20;
      return distance < 50 && nearGround;
    }

    destroy() {
      if (this.canvas && this.canvas.parentNode) {
        document.body.removeChild(this.canvas);
      }
    }
  }

  // Track ball chase timeout
  let ballChaseTimeout = null;

  // ===========================================
  // DOG STATE
  // ===========================================
  let dog = {
    element: null,
    canvasEl: null,
    shadowEl: null,
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
    },

    // Ball chasing state
    chasingBall: false,
    ballTarget: null,

    // Excited state animation
    excitedStartFrame: 0
  };

  // ============================================
  // CANVAS SETUP
  // ============================================
  function createDogCanvas() {
    // Create shadow element (oval under dog)
    const shadow = document.createElement('div');
    shadow.id = 'dog-shadow';
    shadow.style.cssText = `
      position: fixed;
      bottom: 56px;
      left: ${dog.x}px;
      width: 72px;
      height: 12px;
      background: radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 70%);
      border-radius: 50%;
      z-index: 499;
      pointer-events: none;
      display: none;
    `;
    document.body.appendChild(shadow);
    dog.shadowEl = shadow;

    // Create dog canvas
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
      // Figure-8 hopping pattern
      const t = (dog.frameCount - dog.excitedStartFrame) / 15; // Animation parameter
      const hopPhase = Math.floor(dog.frameCount / 4) % 4;
      yOffset = hopPhase === 1 ? -3 : hopPhase === 2 ? -1 : 0;

      // Figure-8 horizontal movement (lemniscate curve)
      const xOffset = Math.sin(t) * 15;
      const figureYOffset = Math.sin(2 * t) * 8;

      // Apply figure-8 position offset
      dog.canvasEl.style.left = (dog.x + xOffset) + 'px';
      dog.canvasEl.style.bottom = (60 + figureYOffset) + 'px';

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
      // Add breathing idle effect with tail movement
      if (!dog.isWalking && dog.currentBehavior === 'idle') {
        // Organic breathing with slight variation
        const breathCycle = dog.frameCount / 60;
        const breath = Math.sin(breathCycle) * 0.5;
        const microVariation = Math.sin(breathCycle * 0.7) * 0.1;
        yOffset = breath + microVariation;

        // Subtle tail sway synchronized with breathing (even when not actively wagging)
        if (!dog.tailWag.active && dog.facingRight) {
          // Activate subtle tail movement
          dog.tailWag.active = true;
          dog.tailWag.frame = Math.floor(breathCycle * 2); // Slow sway
        }
      }
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

    // Update shadow based on vertical offset
    if (dog.shadowEl) {
      // Shadow scales inversely with yOffset (smaller when dog is higher up)
      // yOffset ranges from ~-3 to +1, so shadow should be smaller when negative
      const shadowScale = 1 - (yOffset / 20); // Subtle scaling
      const shadowOpacity = Math.max(0.15, 0.3 - Math.abs(yOffset) / 15);

      dog.shadowEl.style.opacity = shadowOpacity.toString();
      dog.shadowEl.style.transform = `scaleX(${shadowScale})`;
      dog.shadowEl.style.left = dog.canvasEl.style.left;
    }
  }

  // ============================================
  // MOVEMENT & BEHAVIOR
  // ============================================

  function pickRandomDestination() {
    const screenWidth = window.innerWidth;
    const margin = 100;
    const minX = margin;
    const maxX = screenWidth - margin;

    // Ensure destinations stay within bounds
    const destinations = [
      { x: Math.max(minX, Math.min(maxX, margin)) },
      { x: Math.max(minX, Math.min(maxX, screenWidth - margin)) },
      { x: Math.max(minX, Math.min(maxX, screenWidth / 2)) },
      { x: Math.max(minX, Math.min(maxX, margin + Math.random() * 200)) },
      { x: Math.max(minX, Math.min(maxX, screenWidth - margin - Math.random() * 200)) }
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

    // Clamp dog position within screen bounds
    const margin = 50;
    dog.x = Math.max(margin, Math.min(window.innerWidth - margin, dog.x));

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
    dog.chasingBall = false;

    // Trigger bark animation with speech bubble
    dog.currentBehavior = 'barking';

    // Show speech bubble with random wisdom
    const wisdom = getRandomDogWisdom();
    // Duration based on word count: 500ms per word, minimum 2s
    const wordCount = wisdom.split(/\s+/).length;
    const duration = Math.max(2000, wordCount * 500);
    showSpeechBubble(wisdom, duration);

    // Play bark sound
    playBarkSound();

    // Activate tail wag
    dog.tailWag.active = true;
    dog.tailWag.timer = 40;

    // After bark, become excited
    dog.behaviorTimer = setTimeout(() => {
      dog.currentBehavior = 'excited';
      dog.excitedStartFrame = dog.frameCount;
      playHappySound();

      setTimeout(() => {
        dog.currentBehavior = 'idle';
        // Reset position when exiting excited state
        dog.canvasEl.style.bottom = '60px';
        scheduleNextBehavior();
      }, 1500);
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

      // Update ball physics
      if (ball) {
        ball.update();

        // Get dog position for collision detection
        const dogRect = dog.canvasEl.getBoundingClientRect();
        const dogX = dogRect.left + dogRect.width / 2;
        const dogY = dogRect.top + dogRect.height / 2;

        // Check if dog can catch ball
        if (ball.canCatch(dogX, dogY)) {
          // Dog caught the ball!
          ball.destroy();
          ball = null;
          dog.chasingBall = false;
          dog.isWalking = false;
          dog.targetX = null;

          // Increment fetch count
          fetchCount++;
          localStorage.setItem('dog-fetch-count', fetchCount.toString());

          // Show excited reaction
          const catchMessage = `Caught it! (${fetchCount})`;
          const catchWordCount = catchMessage.split(/\s+/).length;
          const catchDuration = Math.max(2000, catchWordCount * 500);
          showSpeechBubble(catchMessage, catchDuration);
          playHappySound();
          dog.currentBehavior = 'excited';
          dog.excitedStartFrame = dog.frameCount;

          clearTimeout(dog.behaviorTimer);
          dog.behaviorTimer = setTimeout(() => {
            dog.currentBehavior = 'idle';
            // Reset position when exiting excited state
            dog.canvasEl.style.bottom = '60px';
            scheduleNextBehavior();
          }, 2000);
        }
        // Check if ball is near dog and dog should chase
        else if (ball.isNearDog(dogX, dogY) && !dog.chasingBall) {
          dog.chasingBall = true;
          clearTimeout(dog.behaviorTimer);
          dog.currentBehavior = 'walking';
        }

        // If chasing, update target to ball position
        if (dog.chasingBall && ball) {
          const distanceToBall = Math.abs(ball.x - dogX);

          // Only move if ball is far enough away
          if (distanceToBall > 30) {
            dog.targetX = ball.x;
            dog.isWalking = true;

            // Only update facing direction if ball is significantly to one side
            // This prevents rapid flipping when near the ball
            if (distanceToBall > 15) {
              dog.facingRight = ball.x > dogX;
            }
          } else {
            // Stop moving when very close to ball
            dog.isWalking = false;
            dog.targetX = null;
          }
        }
      }

      updateMovement();
      drawDog();

      const timeSinceInteraction = Date.now() - dog.lastInteraction;
      if (timeSinceInteraction > 60000 && dog.currentBehavior !== 'lying' && !dog.chasingBall) {
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
    if (dog.shadowEl) {
      dog.shadowEl.style.display = 'block';
    }

    dog.x = 100 + Math.random() * (window.innerWidth - 200);
    dog.canvasEl.style.left = dog.x + 'px';
    if (dog.shadowEl) {
      dog.shadowEl.style.left = dog.x + 'px';
    }

    startAnimationLoop();

    setTimeout(() => scheduleNextBehavior(), 2000);
  }

  function disableDog() {
    if (!dog.enabled) return;

    dog.enabled = false;

    if (dog.canvasEl) {
      dog.canvasEl.style.display = 'none';
    }

    if (dog.shadowEl) {
      dog.shadowEl.style.display = 'none';
    }

    if (dog.animationFrame) {
      cancelAnimationFrame(dog.animationFrame);
    }

    clearTimeout(dog.behaviorTimer);
  }

  // ============================================
  // KEYBOARD CONTROLS
  // ============================================
  let commandBuffer = '';
  let lastMouseX = window.innerWidth / 2;
  let lastMouseY = window.innerHeight / 2;

  // Track mouse position for ball throwing
  document.addEventListener('mousemove', (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  document.addEventListener('keypress', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      return;
    }

    commandBuffer += e.key;

    // Ball throwing: 'b' key
    if (e.key === 'b' && dog.enabled) {
      // Remove old ball if exists
      if (ball) {
        ball.destroy();
      }

      // Create new ball at cursor position
      const dogRect = dog.canvasEl.getBoundingClientRect();
      const dogX = dogRect.left + dogRect.width / 2;
      const dogY = dogRect.top + dogRect.height / 2;

      ball = new Ball(lastMouseX, lastMouseY, dogX, dogY);

      // Stop current behavior and prepare to chase
      clearTimeout(ballChaseTimeout);
      ballChaseTimeout = null;
    }

    // Hidden trigger: "gooddog"
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
