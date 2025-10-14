// ============================================
// ACHIEVEMENT SYSTEM
// ============================================

(function() {
  'use strict';

  // ============================================
  // ACHIEVEMENT DEFINITIONS
  // ============================================
  const achievementDefs = {
    nightmareMode: {
      name: 'NIGHT MODE NIGHTMARE',
      emoji: '🌑',
      description: 'Who hurt you? Seriously, black text on black? Are you a hacker in a movie?',
      hasButtons: true,
      effect: 'flashlight'
    },
    contrarian: {
      name: 'THE CONTRARIAN',
      emoji: '🤔',
      description: 'Can\'t decide? That\'s okay. We\'ve been watching you click for 30 seconds straight.'
    },
    volume11: {
      name: 'VOLUME TO 11',
      emoji: '🎸',
      description: 'This one goes to eleven. Unfortunately there\'s no sound yet. But the spirit is there.'
    },
    rainbowMode: {
      name: 'RAINBOW MODE',
      emoji: '🌈',
      description: 'Rave mode activated! Your monitor thanks you for the workout.'
    },
    konami: {
      name: 'SECRET KONAMI CODE',
      emoji: '👾',
      description: 'You\'re old. Welcome to the club.',
      effect: 'crt'
    },
    newspeak: {
      name: 'NEWSPEAK CERTIFIED',
      emoji: '📖',
      description: 'Doubleplusgood! Big Brother is watching. And... proud?'
    },
    emoPhase: {
      name: 'EMO PHASE',
      emoji: '🖤',
      description: 'it\'s not a phase mom (but it is tho). enjoy the angst.'
    },
    corporate: {
      name: 'CORPORATE DRONE',
      emoji: '💼',
      description: 'Synergy maximized! Let\'s circle back and touch base on this paradigm shift.'
    },
    petDog: {
      name: 'PET THE DOG',
      emoji: '🐕',
      description: 'Good human! The dog appreciates your dedication. +1 happiness.',
      counter: true
    },
    trophyCollector: {
      name: 'TROPHY COLLECTOR',
      emoji: '🏆',
      description: 'Newton would be proud. Or confused. Probably both.',
      counter: true
    }
  };

  // ============================================
  // ACHIEVEMENT STATE
  // ============================================
  let achievements = {
    nightmareMode: false,
    contrarian: false,
    volume11: false,
    rainbowMode: false,
    konami: false,
    newspeak: false,
    emoPhase: false,
    corporate: false,
    petDog: { unlocked: false, count: 0 },
    trophyCollector: { unlocked: false, count: 0 }
  };

  // Queue for stacking multiple achievements
  let achievementQueue = [];
  let isShowingAchievement = false;

  // Tracking for various achievements
  let settingsChanges = [];
  let accentChanges = [];

  // ============================================
  // LOAD ACHIEVEMENTS
  // ============================================
  function loadAchievements() {
    const saved = localStorage.getItem('achievements');
    if (saved) {
      try {
        achievements = { ...achievements, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to load achievements:', e);
      }
    }
  }

  // ============================================
  // SAVE ACHIEVEMENTS
  // ============================================
  function saveAchievements() {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }

  // ============================================
  // UNLOCK ACHIEVEMENT
  // ============================================
  function unlockAchievement(achievementId, force = false) {
    const achievement = achievements[achievementId];

    // Check if already unlocked
    if (achievement === true || (achievement && achievement.unlocked)) {
      if (!force) return;
    }

    // Mark as unlocked
    if (achievementDefs[achievementId].counter) {
      achievements[achievementId].unlocked = true;
    } else {
      achievements[achievementId] = true;
    }

    saveAchievements();

    // Add to queue and show
    achievementQueue.push(achievementId);
    if (!isShowingAchievement) {
      showNextAchievement();
    }

    // Apply special effects
    const def = achievementDefs[achievementId];
    if (def.effect === 'flashlight') {
      enableFlashlightCursor();
    } else if (def.effect === 'crt') {
      enableCRTEffect();
    }
  }

  // ============================================
  // SHOW ACHIEVEMENT POPUP
  // ============================================
  function showNextAchievement() {
    if (achievementQueue.length === 0) {
      isShowingAchievement = false;
      return;
    }

    isShowingAchievement = true;
    const achievementId = achievementQueue.shift();
    const def = achievementDefs[achievementId];

    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `
      <div class="achievement-header">
        🏆 ACHIEVEMENT UNLOCKED!
      </div>
      <div class="achievement-content">
        <div class="achievement-emoji">${def.emoji}</div>
        <div class="achievement-name">${def.name}</div>
        <div class="achievement-description">${def.description}</div>
        ${def.hasButtons ? `
          <div class="achievement-buttons">
            <button class="achievement-btn" data-action="undo">Undo This</button>
            <button class="achievement-btn primary" data-action="keep">Keep It</button>
          </div>
        ` : ''}
      </div>
    `;

    // Position based on existing popups
    const existingPopups = document.querySelectorAll('.achievement-popup');
    const topOffset = 20 + (existingPopups.length * 270); // Stack vertically
    popup.style.top = `${topOffset}px`;

    document.body.appendChild(popup);

    // Trigger animation
    setTimeout(() => popup.classList.add('show'), 10);

    // Play sound if volume > 0
    playAchievementSound();

    // Button handlers
    if (def.hasButtons) {
      popup.querySelector('[data-action="undo"]')?.addEventListener('click', () => {
        if (achievementId === 'nightmareMode') {
          disableFlashlightCursor();
          // Reset to safe colors
          const event = new CustomEvent('resetColors');
          window.dispatchEvent(event);
        }
        dismissPopup(popup);
      });

      popup.querySelector('[data-action="keep"]')?.addEventListener('click', () => {
        dismissPopup(popup);
      });
    }

    // Auto-dismiss after 5 seconds (unless hovered)
    let dismissTimer = setTimeout(() => {
      if (!popup.matches(':hover')) {
        dismissPopup(popup);
      }
    }, 5000);

    // Cancel timer on hover, restart on leave
    popup.addEventListener('mouseenter', () => clearTimeout(dismissTimer));
    popup.addEventListener('mouseleave', () => {
      dismissTimer = setTimeout(() => dismissPopup(popup), 3000);
    });
  }

  // ============================================
  // DISMISS POPUP
  // ============================================
  function dismissPopup(popup) {
    popup.classList.remove('show');
    setTimeout(() => {
      popup.remove();
      showNextAchievement();
    }, 300);
  }

  // ============================================
  // FLASHLIGHT CURSOR EFFECT
  // ============================================
  let flashlightEnabled = false;
  let mouseX = 0;
  let mouseY = 0;

  function enableFlashlightCursor() {
    if (flashlightEnabled) return;
    flashlightEnabled = true;

    document.body.classList.add('flashlight-cursor');

    // Track mouse position
    document.addEventListener('mousemove', updateFlashlightPosition);
  }

  function disableFlashlightCursor() {
    flashlightEnabled = false;
    document.body.classList.remove('flashlight-cursor');
    document.removeEventListener('mousemove', updateFlashlightPosition);
  }

  function updateFlashlightPosition(e) {
    mouseX = (e.clientX / window.innerWidth) * 100;
    mouseY = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', `${mouseX}%`);
    document.documentElement.style.setProperty('--mouse-y', `${mouseY}%`);
  }

  // ============================================
  // CRT SCANLINE EFFECT
  // ============================================
  function enableCRTEffect() {
    const overlay = document.createElement('div');
    overlay.className = 'crt-overlay';
    document.body.appendChild(overlay);

    // Change accent to magenta temporarily
    const root = document.documentElement;
    const originalAccent = getComputedStyle(root).getPropertyValue('--accent');
    root.style.setProperty('--accent', '#ff00ff');

    // Remove after 10 seconds
    setTimeout(() => {
      overlay.remove();
      root.style.setProperty('--accent', originalAccent);
    }, 10000);
  }

  // ============================================
  // PLAY ACHIEVEMENT SOUND
  // ============================================
  function playAchievementSound() {
    const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');
    if (settings.volume && settings.volume > 0) {
      // Create simple beep sound using Web Audio API
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = settings.volume / 200; // Quiet beep

        oscillator.start();
        setTimeout(() => oscillator.stop(), 200);
      } catch (e) {
        // Fail silently if audio not supported
      }
    }
  }

  // ============================================
  // ACHIEVEMENT TRACKERS
  // ============================================

  // Track settings changes for "The Contrarian"
  window.addEventListener('settingsChanged', () => {
    const now = Date.now();
    settingsChanges.push(now);

    // Keep only changes in last 30 seconds
    settingsChanges = settingsChanges.filter(time => now - time < 30000);

    // Check if 10+ changes in 30 seconds
    if (settingsChanges.length >= 10) {
      unlockAchievement('contrarian');
      settingsChanges = []; // Reset
    }
  });

  // Track accent changes for "Rainbow Mode"
  window.addEventListener('accentChanged', () => {
    const now = Date.now();
    accentChanges.push(now);

    // Keep only changes in last 5 seconds
    accentChanges = accentChanges.filter(time => now - time < 5000);

    // Check if 3+ changes in 5 seconds
    if (accentChanges.length >= 3) {
      unlockAchievement('rainbowMode');
      accentChanges = []; // Reset
    }
  });

  // Check for Newspeak Certified (after 60 seconds)
  let newspeakTimer = null;
  window.addEventListener('languageChanged', (e) => {
    clearTimeout(newspeakTimer);

    if (e.detail === 'newspeak') {
      newspeakTimer = setTimeout(() => {
        unlockAchievement('newspeak');
      }, 60000);
    }
  });

  // ============================================
  // SHOW ACHIEVEMENTS MODAL
  // ============================================
  function showAchievementsModal() {
    const overlay = document.createElement('div');
    overlay.className = 'achievements-overlay';

    const totalAchievements = Object.keys(achievementDefs).length;
    let unlockedCount = 0;

    // Count unlocked achievements
    Object.keys(achievements).forEach(key => {
      if (achievements[key] === true || (achievements[key] && achievements[key].unlocked)) {
        unlockedCount++;
      }
    });

    let achievementsList = '';
    Object.keys(achievementDefs).forEach(key => {
      const def = achievementDefs[key];
      const unlocked = achievements[key] === true || (achievements[key] && achievements[key].unlocked);
      const icon = unlocked ? '✅' : '⬜';

      let extraInfo = '';
      if (def.counter && achievements[key]) {
        extraInfo = ` (${achievements[key].count}/${key === 'petDog' ? 10 : 20})`;
      }

      achievementsList += `
        <div class="achievement-item ${unlocked ? 'unlocked' : 'locked'}">
          <span class="achievement-icon">${icon}</span>
          <span class="achievement-text">${def.emoji} ${def.name}${extraInfo}</span>
        </div>
      `;
    });

    overlay.innerHTML = `
      <div class="achievements-modal">
        <div class="achievements-header">
          <span class="achievements-title">🏆 YOUR ACHIEVEMENTS (${unlockedCount}/${totalAchievements})</span>
          <button class="achievements-close">[×]</button>
        </div>
        <div class="achievements-list">
          ${achievementsList}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('active'), 10);

    // Close handlers
    overlay.querySelector('.achievements-close').addEventListener('click', () => {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
      }
    });
  }

  // ============================================
  // COUNTER INCREMENT
  // ============================================
  function incrementCounter(achievementId, threshold) {
    if (!achievements[achievementId].unlocked) {
      achievements[achievementId].count++;
      saveAchievements();

      if (achievements[achievementId].count >= threshold) {
        unlockAchievement(achievementId);
      }
    }
  }

  // ============================================
  // EXPORT FUNCTIONS
  // ============================================
  window.AchievementSystem = {
    unlock: unlockAchievement,
    showModal: showAchievementsModal,
    incrementDog: () => incrementCounter('petDog', 10),
    incrementTrophy: () => incrementCounter('trophyCollector', 20),
    checkNightmare: (bg, textColor) => {
      // Trigger if both background and text are very dark
      if (bg === 'black' && textColor === 'dark') {
        unlockAchievement('nightmareMode');
      }
    },
    checkVolume: (volume) => {
      if (volume >= 100) {
        unlockAchievement('volume11');
      }
    },
    checkLanguage: (language) => {
      if (language === 'emo') {
        unlockAchievement('emoPhase');
      } else if (language === 'corporate') {
        unlockAchievement('corporate');
      }
    }
  };

  // ============================================
  // INITIALIZE
  // ============================================
  loadAchievements();

  // Expose show modal function
  window.addEventListener('DOMContentLoaded', () => {
    const achievementsBtn = document.getElementById('view-achievements');
    if (achievementsBtn) {
      achievementsBtn.addEventListener('click', showAchievementsModal);
    }
  });

})();
