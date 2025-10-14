// ============================================
// ASCII DOG COMPANION
// ============================================

(function() {
  'use strict';

  // ============================================
  // DOG STATES
  // ============================================
  const dogStates = {
    standing: `     /\\_/\\
    ( o.o )
     > ^ <
    /|   |\\
   (_|   |_)`,

    sitting: `     /\\_/\\
    ( o.o )
     > ^ <
    /     \\
   (       )`,

    sleeping: `     /\\_/\\
    ( -.- )
     > ^ <   ZZZ`,

    barking: `     /\\_/\\
    ( O.O )
     > ^ <   WOOF!
    /|   |\\
   (_|   |_)`,

    happy: `     /\\_/\\
    ( ^.^ )
     > ^ <   ♥
    /|   |\\
   (_|   |_)`
  };

  // ============================================
  // DOG STATE
  // ============================================
  let dog = {
    element: null,
    enabled: false,
    currentState: 'standing',
    targetX: window.innerWidth / 2,
    currentX: window.innerWidth / 2,
    lastMouseMove: Date.now(),
    petCount: 0,
    animationFrame: null
  };

  // ============================================
  // CREATE DOG ELEMENT
  // ============================================
  function createDog() {
    const dogEl = document.createElement('div');
    dogEl.id = 'ascii-dog';
    dogEl.className = 'ascii-dog';
    dogEl.innerHTML = `<pre>${dogStates.standing}</pre>`;
    document.body.appendChild(dogEl);
    dog.element = dogEl;

    // Click handler for petting
    dogEl.addEventListener('click', petDog);

    return dogEl;
  }

  // ============================================
  // ENABLE DOG
  // ============================================
  function enableDog() {
    if (dog.enabled) return;

    dog.enabled = true;

    if (!dog.element) {
      createDog();
    }

    dog.element.style.display = 'block';

    // Start tracking mouse
    document.addEventListener('mousemove', onMouseMove);

    // Start animation loop
    startAnimationLoop();

    // Start random behaviors
    startRandomBehaviors();
  }

  // ============================================
  // DISABLE DOG
  // ============================================
  function disableDog() {
    if (!dog.enabled) return;

    dog.enabled = false;

    if (dog.element) {
      dog.element.style.display = 'none';
    }

    document.removeEventListener('mousemove', onMouseMove);

    if (dog.animationFrame) {
      cancelAnimationFrame(dog.animationFrame);
    }

    clearAllTimers();
  }

  // ============================================
  // MOUSE TRACKING
  // ============================================
  function onMouseMove(e) {
    dog.targetX = e.clientX;
    dog.lastMouseMove = Date.now();

    // Wake up if sleeping
    if (dog.currentState === 'sleeping') {
      setState('standing');
    }
  }

  // ============================================
  // ANIMATION LOOP
  // ============================================
  function startAnimationLoop() {
    function animate() {
      if (!dog.enabled) return;

      // Smooth easing toward target
      const ease = 0.1;
      dog.currentX += (dog.targetX - dog.currentX) * ease;

      // Keep dog on screen (accounting for width ~60px)
      const dogWidth = 60;
      const minX = dogWidth / 2;
      const maxX = window.innerWidth - dogWidth / 2;
      dog.currentX = Math.max(minX, Math.min(maxX, dog.currentX));

      // Update position
      if (dog.element) {
        dog.element.style.left = `${dog.currentX - dogWidth / 2}px`;
      }

      // Check for sleep (no mouse movement for 60 seconds)
      const timeSinceMove = Date.now() - dog.lastMouseMove;
      if (timeSinceMove > 60000 && dog.currentState === 'standing') {
        setState('sleeping');
      }

      dog.animationFrame = requestAnimationFrame(animate);
    }

    animate();
  }

  // ============================================
  // RANDOM BEHAVIORS
  // ============================================
  let behaviorTimers = [];

  function startRandomBehaviors() {
    // Random barking (every 20-40 seconds)
    function scheduleBark() {
      const timer = setTimeout(() => {
        if (dog.enabled && dog.currentState === 'standing') {
          bark();
        }
        scheduleBark();
      }, 20000 + Math.random() * 20000);
      behaviorTimers.push(timer);
    }

    // Random sitting (every 30-60 seconds)
    function scheduleSit() {
      const timer = setTimeout(() => {
        if (dog.enabled && dog.currentState === 'standing') {
          sit();
        }
        scheduleSit();
      }, 30000 + Math.random() * 30000);
      behaviorTimers.push(timer);
    }

    scheduleBark();
    scheduleSit();
  }

  function clearAllTimers() {
    behaviorTimers.forEach(timer => clearTimeout(timer));
    behaviorTimers = [];
  }

  // ============================================
  // DOG BEHAVIORS
  // ============================================
  function setState(state) {
    dog.currentState = state;
    if (dog.element) {
      dog.element.querySelector('pre').textContent = dogStates[state];
    }
  }

  function bark() {
    setState('barking');
    playBarkSound();

    // Return to standing after 2 seconds
    setTimeout(() => {
      if (dog.enabled) {
        setState('standing');
      }
    }, 2000);
  }

  function sit() {
    setState('sitting');

    // Stand back up after 10-20 seconds
    setTimeout(() => {
      if (dog.enabled && dog.currentState === 'sitting') {
        setState('standing');
      }
    }, 10000 + Math.random() * 10000);
  }

  function petDog() {
    // Show happy state
    setState('happy');

    // Increment achievement counter
    if (window.AchievementSystem) {
      window.AchievementSystem.incrementDog();
    }

    // Play happy sound
    playHappySound();

    // Return to standing after 2 seconds
    setTimeout(() => {
      if (dog.enabled) {
        setState('standing');
      }
    }, 2000);
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

        // Bark sound: quick frequency sweep
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

        // Happy sound: ascending notes
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
        // Happy dance: rapid state changes
        const states = ['happy', 'standing', 'happy', 'standing', 'happy'];
        let i = 0;
        const interval = setInterval(() => {
          setState(states[i]);
          i++;
          if (i >= states.length) {
            clearInterval(interval);
            setState('standing');
          }
        }, 300);
      } else {
        // Enable dog if not already enabled
        enableDog();
        setTimeout(() => petDog(), 500);
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
