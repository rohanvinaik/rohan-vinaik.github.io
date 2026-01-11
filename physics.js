// ============================================
// PHYSICS TROPHY SYSTEM
// ============================================

(function() {
  'use strict';

  // ============================================
  // TROPHY STATE
  // ============================================
  let trophy = {
    element: null,
    enabled: false,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    vx: 0, // velocity x
    vy: 0, // velocity y
    gravity: 0.5,
    bounce: 0.7,
    friction: 0.99,
    size: 40,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: Date.now(),
    interactionCount: 0,
    animationFrame: null
  };

  // ============================================
  // CREATE TROPHY ELEMENT
  // ============================================
  function createTrophy() {
    const trophyEl = document.createElement('div');
    trophyEl.id = 'physics-trophy';
    trophyEl.className = 'physics-trophy';
    trophyEl.textContent = '🏆';
    trophyEl.style.fontSize = `${trophy.size}px`;
    document.body.appendChild(trophyEl);
    trophy.element = trophyEl;

    // Set initial position
    updateTrophyPosition();

    // Event listeners
    trophyEl.addEventListener('mousedown', onMouseDown);
    trophyEl.addEventListener('dblclick', resetTrophy);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return trophyEl;
  }

  // ============================================
  // ENABLE TROPHY
  // ============================================
  function enableTrophy() {
    if (trophy.enabled) return;

    trophy.enabled = true;

    if (!trophy.element) {
      createTrophy();
    }

    trophy.element.style.display = 'block';

    // Start physics loop
    startPhysicsLoop();
  }

  // ============================================
  // DISABLE TROPHY
  // ============================================
  function disableTrophy() {
    if (!trophy.enabled) return;

    trophy.enabled = false;

    if (trophy.element) {
      trophy.element.style.display = 'none';
    }

    if (trophy.animationFrame) {
      cancelAnimationFrame(trophy.animationFrame);
    }
  }

  // ============================================
  // PHYSICS LOOP
  // ============================================
  function startPhysicsLoop() {
    function update() {
      if (!trophy.enabled) return;

      if (!trophy.isDragging) {
        // Apply gravity
        trophy.vy += trophy.gravity;

        // Apply velocity
        trophy.x += trophy.vx;
        trophy.y += trophy.vy;

        // Apply friction
        trophy.vx *= trophy.friction;

        // Bounce off bottom
        if (trophy.y >= window.innerHeight - trophy.size) {
          trophy.y = window.innerHeight - trophy.size;
          trophy.vy *= -trophy.bounce;
          trophy.vx *= trophy.friction;

          // Stop bouncing if velocity is very low
          if (Math.abs(trophy.vy) < 0.5) {
            trophy.vy = 0;
          }

          playBounceSound();
        }

        // Bounce off left
        if (trophy.x <= 0) {
          trophy.x = 0;
          trophy.vx *= -trophy.bounce;
          playBounceSound();
        }

        // Bounce off right
        if (trophy.x >= window.innerWidth - trophy.size) {
          trophy.x = window.innerWidth - trophy.size;
          trophy.vx *= -trophy.bounce;
          playBounceSound();
        }

        // Trophy can go off top of screen
        // But we'll reset it if it goes too far
        if (trophy.y < -200) {
          resetTrophy();
        }

        updateTrophyPosition();
      }

      trophy.animationFrame = requestAnimationFrame(update);
    }

    update();
  }

  // ============================================
  // UPDATE TROPHY POSITION
  // ============================================
  function updateTrophyPosition() {
    if (trophy.element) {
      trophy.element.style.left = `${trophy.x}px`;
      trophy.element.style.top = `${trophy.y}px`;
    }
  }

  // ============================================
  // MOUSE HANDLERS
  // ============================================
  function onMouseDown(e) {
    e.preventDefault();
    trophy.isDragging = true;

    trophy.dragStartX = e.clientX - trophy.x;
    trophy.dragStartY = e.clientY - trophy.y;

    trophy.lastX = e.clientX;
    trophy.lastY = e.clientY;
    trophy.lastTime = Date.now();

    trophy.element.style.cursor = 'grabbing';

    // Increment interaction count
    trophy.interactionCount++;
    if (window.AchievementSystem) {
      window.AchievementSystem.incrementTrophy();
    }
  }

  function onMouseMove(e) {
    if (!trophy.isDragging) return;

    e.preventDefault();

    const now = Date.now();
    const dt = Math.max(1, now - trophy.lastTime);

    // Update position
    trophy.x = e.clientX - trophy.dragStartX;
    trophy.y = e.clientY - trophy.dragStartY;

    // Calculate velocity based on drag speed
    const dx = e.clientX - trophy.lastX;
    const dy = e.clientY - trophy.lastY;

    trophy.vx = dx / dt * 16; // Scale for 60fps
    trophy.vy = dy / dt * 16;

    trophy.lastX = e.clientX;
    trophy.lastY = e.clientY;
    trophy.lastTime = now;

    updateTrophyPosition();
  }

  function onMouseUp(e) {
    if (!trophy.isDragging) return;

    trophy.isDragging = false;
    trophy.element.style.cursor = 'grab';

    // Velocity is already calculated in onMouseMove
    // Physics loop will take over
  }

  // ============================================
  // RESET TROPHY
  // ============================================
  function resetTrophy() {
    trophy.x = window.innerWidth / 2;
    trophy.y = window.innerHeight / 2;
    trophy.vx = 0;
    trophy.vy = 0;
    updateTrophyPosition();
  }

  // ============================================
  // SOUND EFFECTS
  // ============================================
  function playBounceSound() {
    const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');
    if (settings.volume && settings.volume > 0) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Bounce sound: quick low frequency
        oscillator.frequency.value = 100;
        oscillator.type = 'sine';
        gainNode.gain.value = settings.volume / 400;

        oscillator.start();
        setTimeout(() => oscillator.stop(), 50);
      } catch (e) {
        // Fail silently
      }
    }
  }

  // ============================================
  // HIDDEN TRIGGER: "trophy"
  // ============================================
  let commandBuffer = '';
  document.addEventListener('keypress', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      return;
    }

    commandBuffer += e.key;

    if (commandBuffer.endsWith('trophy')) {
      if (!trophy.enabled) {
        enableTrophy();
      } else {
        // Give trophy a random kick
        trophy.vx = (Math.random() - 0.5) * 20;
        trophy.vy = -Math.random() * 15;
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
  window.PhysicsTrophy = {
    enable: enableTrophy,
    disable: disableTrophy,
    isEnabled: () => trophy.enabled,
    reset: resetTrophy
  };

  // ============================================
  // LOAD SAVED STATE
  // ============================================

  // Export disable function for funMode toggle
  window.disableTrophy = disableTrophy;

  window.addEventListener('DOMContentLoaded', () => {
    const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');

    // Only enable if funMode is on AND trophy is enabled
    const funModeEnabled = settings.funMode === true;
    const shouldEnable = funModeEnabled && settings.physicsTrophy;

    if (shouldEnable) {
      enableTrophy();
    }

    // Settings toggle handler
    const trophyToggle = document.getElementById('enable-trophy');
    if (trophyToggle) {
      trophyToggle.checked = shouldEnable || false;
      trophyToggle.addEventListener('change', (e) => {
        // Check if funMode is enabled before allowing toggle
        const currentSettings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');
        if (!currentSettings.funMode) {
          e.target.checked = false;
          return;
        }

        if (e.target.checked) {
          enableTrophy();
        } else {
          disableTrophy();
        }

        // Save to settings
        currentSettings.physicsTrophy = e.target.checked;
        localStorage.setItem('dashboard-settings', JSON.stringify(currentSettings));
      });
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    // Keep trophy on screen
    if (trophy.enabled) {
      trophy.x = Math.max(0, Math.min(window.innerWidth - trophy.size, trophy.x));
      trophy.y = Math.max(0, Math.min(window.innerHeight - trophy.size, trophy.y));
      updateTrophyPosition();
    }
  });

})();
