// ============================================
// REALISTIC PIXEL DOG COMPANION
// Low-res sprite with natural pet behavior
// ============================================

(function() {
  'use strict';

  // ============================================
  // LOW-RES PIXEL DOG SPRITES (using block characters for pixel art)
  // ============================================
  const dogSprites = {
    // Standing/idle (facing right)
    standRight: `
██████
█░░░░█
██░░██
 ████
 █  █
`,
    // Standing (facing left)
    standLeft: `
██████
█░░░░█
██░░██
 ████
 █  █
`,
    // Walking cycle frame 1
    walk1Right: `
██████
█░░░░█
██░░██
 ████
█   █
`,
    // Walking cycle frame 2
    walk2Right: `
██████
█░░░░█
██░░██
 ████
 █ █
`,
    // Sitting
    sit: `
██████
█░░░░█
██████
 ████
`,
    // Lying down
    lie: `
██████████
█░░░░░░░█
██████████
`,
    // Barking
    bark: `
██████
█o░o░█ !
██░░██
 ████
 █  █
`,
  };

  // ============================================
  // DOG STATE
  // ============================================
  let dog = {
    element: null,
    canvasEl: null,
    ctx: null,
    enabled: false,

    // Position (in pixels)
    x: 200,
    y: window.innerHeight - 120,

    // Movement
    targetX: null,
    targetY: null,
    walkSpeed: 2,  // pixels per frame
    isWalking: false,
    facingRight: true,
    walkFrame: 0,

    // Behavior state
    currentBehavior: 'idle',  // idle, walking, sitting, lying, barking
    behaviorTimer: null,
    lastInteraction: Date.now(),

    // Animation
    animationFrame: null,
    frameCount: 0
  };

  // ============================================
  // CANVAS SETUP
  // ============================================
  function createDogCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'dog-canvas';
    canvas.width = 60;  // Small canvas for low-res look
    canvas.height = 60;
    canvas.style.position = 'fixed';
    canvas.style.bottom = '60px';
    canvas.style.left = dog.x + 'px';
    canvas.style.imageRendering = 'pixelated';  // Keep it crispy
    canvas.style.imageRendering = '-moz-crisp-edges';
    canvas.style.imageRendering = 'crisp-edges';
    canvas.style.zIndex = '500';
    canvas.style.cursor = 'pointer';
    canvas.style.display = 'none';

    // Click handler for petting
    canvas.addEventListener('click', petDog);

    document.body.appendChild(canvas);
    dog.canvasEl = canvas;
    dog.ctx = canvas.getContext('2d');
  }

  // ============================================
  // DRAW PIXEL DOG
  // ============================================
  function drawDog() {
    if (!dog.ctx) return;

    // Clear canvas
    dog.ctx.clearRect(0, 0, dog.canvasEl.width, dog.canvasEl.height);

    // Select sprite based on behavior
    let sprite;
    if (dog.currentBehavior === 'sitting') {
      sprite = dogSprites.sit;
    } else if (dog.currentBehavior === 'lying') {
      sprite = dogSprites.lie;
    } else if (dog.currentBehavior === 'barking') {
      sprite = dogSprites.bark;
    } else if (dog.isWalking) {
      // Alternate walking frames
      sprite = (Math.floor(dog.walkFrame / 10) % 2 === 0)
        ? dogSprites.walk1Right
        : dogSprites.walk2Right;
      dog.walkFrame++;
    } else {
      sprite = dog.facingRight ? dogSprites.standRight : dogSprites.standLeft;
    }

    // Draw pixel art sprite
    dog.ctx.fillStyle = '#00ff00';  // Green pixels
    dog.ctx.font = '8px monospace';

    const lines = sprite.trim().split('\n');
    lines.forEach((line, y) => {
      for (let x = 0; x < line.length; x++) {
        if (line[x] === '█') {
          dog.ctx.fillRect(x * 6, y * 6, 6, 6);
        } else if (line[x] === '░') {
          dog.ctx.fillStyle = '#006600';
          dog.ctx.fillRect(x * 6, y * 6, 6, 6);
          dog.ctx.fillStyle = '#00ff00';
        } else if (line[x] === 'o') {
          dog.ctx.fillStyle = '#ffff00';
          dog.ctx.fillRect(x * 6, y * 6, 6, 6);
          dog.ctx.fillStyle = '#00ff00';
        }
      }
    });
  }

  // ============================================
  // MOVEMENT & BEHAVIOR
  // ============================================

  function pickRandomDestination() {
    const screenWidth = window.innerWidth;
    const margin = 100;

    // Pick corners, edges, or random spots
    const destinations = [
      { x: margin, name: 'left corner' },
      { x: screenWidth - margin, name: 'right corner' },
      { x: screenWidth / 2, name: 'center' },
      { x: margin + Math.random() * 200, name: 'left side' },
      { x: screenWidth - margin - Math.random() * 200, name: 'right side' }
    ];

    const dest = destinations[Math.floor(Math.random() * destinations.length)];
    dog.targetX = dest.x;
    dog.isWalking = true;
    dog.currentBehavior = 'walking';

    // Face the direction we're walking
    if (dest.x > dog.x) {
      dog.facingRight = true;
    } else {
      dog.facingRight = false;
    }
  }

  function updateMovement() {
    if (!dog.isWalking || dog.targetX === null) return;

    const distance = Math.abs(dog.targetX - dog.x);

    // Reached destination
    if (distance < dog.walkSpeed) {
      dog.x = dog.targetX;
      dog.isWalking = false;
      dog.targetX = null;
      dog.walkFrame = 0;

      // Decide what to do after arriving
      scheduleNextBehavior();
      return;
    }

    // Walk toward target
    if (dog.targetX > dog.x) {
      dog.x += dog.walkSpeed;
      dog.facingRight = true;
    } else {
      dog.x -= dog.walkSpeed;
      dog.facingRight = false;
    }

    // Update canvas position
    dog.canvasEl.style.left = dog.x + 'px';
  }

  function scheduleNextBehavior() {
    // After reaching destination, randomly decide what to do
    const behaviors = [
      { action: 'sit', duration: 5000, weight: 3 },
      { action: 'lie', duration: 8000, weight: 2 },
      { action: 'stand', duration: 3000, weight: 4 },
      { action: 'walk', duration: 0, weight: 3 },
      { action: 'bark', duration: 2000, weight: 1 }
    ];

    // Weighted random selection
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
    // Cancel current behavior
    clearTimeout(dog.behaviorTimer);
    dog.isWalking = false;
    dog.targetX = null;

    // Happy dance
    const happyFrames = 10;
    let frame = 0;

    const happyInterval = setInterval(() => {
      dog.currentBehavior = frame % 2 === 0 ? 'barking' : 'idle';
      frame++;

      if (frame >= happyFrames) {
        clearInterval(happyInterval);
        dog.currentBehavior = 'idle';
        scheduleNextBehavior();
      }
    }, 200);

    // Achievement tracking
    if (window.AchievementSystem) {
      window.AchievementSystem.incrementDog();
    }

    // Play happy sound
    playHappySound();

    dog.lastInteraction = Date.now();
  }

  // ============================================
  // MAIN ANIMATION LOOP
  // ============================================
  function startAnimationLoop() {
    function animate() {
      if (!dog.enabled) return;

      dog.frameCount++;

      // Update movement
      updateMovement();

      // Draw dog
      drawDog();

      // Check for inactivity (fall asleep after 60 seconds)
      const timeSinceInteraction = Date.now() - dog.lastInteraction;
      if (timeSinceInteraction > 60000 && dog.currentBehavior !== 'lying') {
        executeBehavior('lie', 30000);  // Sleep for 30 seconds
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

    // Create canvas if needed
    if (!dog.canvasEl) {
      createDogCanvas();
    }

    dog.canvasEl.style.display = 'block';

    // Start at random position
    dog.x = 100 + Math.random() * (window.innerWidth - 200);
    dog.canvasEl.style.left = dog.x + 'px';

    // Start animation
    startAnimationLoop();

    // Start first behavior
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

    // Settings toggle handler
    const dogToggle = document.getElementById('enable-dog');
    if (dogToggle) {
      dogToggle.checked = settings.asciiDog || false;
      dogToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          enableDog();
        } else {
          disableDog();
        }

        // Save to settings
        settings.asciiDog = e.target.checked;
        localStorage.setItem('dashboard-settings', JSON.stringify(settings));
      });
    }
  });

})();
