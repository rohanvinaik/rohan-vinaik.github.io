// ============================================
// EASTER EGGS & HIDDEN TRIGGERS
// ============================================

(function() {
  'use strict';

  let commandBuffer = '';
  let logoClickCount = 0;
  let logoClickTimer = null;

  // ============================================
  // ENHANCED KONAMI CODE
  // ============================================
  let konamiCode = [];
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
      activateKonamiCode();
    }
  });

  function activateKonamiCode() {
    // Unlock achievement
    if (window.AchievementSystem) {
      window.AchievementSystem.unlock('konami');
    }

    // CRT effect is handled by achievement system
    console.log('%c> KONAMI CODE ACTIVATED', 'color: #ff00ff; font-size: 20px; font-weight: bold;');
    console.log('%c> System colors temporarily modified...', 'color: #ff00ff;');
  }

  // ============================================
  // LOGO CLICK EASTER EGG
  // ============================================
  function initLogoClicker() {
    // Find the logo/header element
    const logo = document.querySelector('.prompt-user'); // The "rohan@personal" text

    if (logo) {
      logo.addEventListener('click', (e) => {
        logoClickCount++;

        // Reset counter after 2 seconds of inactivity
        clearTimeout(logoClickTimer);
        logoClickTimer = setTimeout(() => {
          logoClickCount = 0;
        }, 2000);

        // Trigger on 10 clicks
        if (logoClickCount >= 10) {
          showCheatCodePrompt();
          logoClickCount = 0;
        }
      });
    }
  }

  function showCheatCodePrompt() {
    const confirmed = confirm('🎮 CHEAT CODE DETECTED!\n\nDo you want to unlock all achievements?\n\n(This is cheating, but we won\'t tell anyone...)');

    if (confirmed) {
      unlockAllAchievements();
    }
  }

  function unlockAllAchievements() {
    if (!window.AchievementSystem) return;

    const achievements = [
      'nightmareMode',
      'contrarian',
      'volume11',
      'rainbowMode',
      'konami',
      'newspeak',
      'emoPhase',
      'corporate',
      'petDog',
      'trophyCollector'
    ];

    achievements.forEach(achievement => {
      window.AchievementSystem.unlock(achievement, true);
    });

    console.log('%c> ALL ACHIEVEMENTS UNLOCKED!', 'color: #00ff00; font-size: 16px; font-weight: bold;');
  }

  // ============================================
  // DEVELOPER MODE
  // ============================================
  function initDeveloperMode() {
    const settingsBtn = document.getElementById('settings-btn');

    if (settingsBtn) {
      settingsBtn.addEventListener('click', (e) => {
        // Shift + Ctrl + Click
        if (e.shiftKey && e.ctrlKey) {
          e.preventDefault();
          e.stopPropagation();
          showDeveloperMode();
        }
      });
    }
  }

  function showDeveloperMode() {
    const overlay = document.createElement('div');
    overlay.className = 'developer-overlay';
    overlay.innerHTML = `
      <div class="developer-modal">
        <div class="developer-header">
          <span>🛠️ DEVELOPER MODE</span>
          <button class="developer-close">[×]</button>
        </div>
        <div class="developer-content">
          <h3>DEVELOPER OPTIONS</h3>

          <div class="developer-section">
            <h4>Achievements</h4>
            <button id="dev-unlock-all">Unlock All Achievements</button>
            <button id="dev-reset-achievements">Reset All Achievements</button>
          </div>

          <div class="developer-section">
            <h4>Fun Features</h4>
            <button id="dev-enable-all">Enable All Features</button>
            <button id="dev-disable-all">Disable All Features</button>
          </div>

          <div class="developer-section">
            <h4>Easter Eggs</h4>
            <button id="dev-trigger-konami">Trigger Konami Code</button>
            <button id="dev-spawn-dog">Spawn ASCII Dog</button>
            <button id="dev-spawn-trophy">Spawn Physics Trophy</button>
          </div>

          <div class="developer-section">
            <h4>System</h4>
            <button id="dev-clear-storage">Clear All localStorage</button>
            <button id="dev-export-data">Export Settings</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('active'), 10);

    // Close handler
    overlay.querySelector('.developer-close').addEventListener('click', () => {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    });

    // Button handlers
    document.getElementById('dev-unlock-all')?.addEventListener('click', () => {
      unlockAllAchievements();
      alert('All achievements unlocked!');
    });

    document.getElementById('dev-reset-achievements')?.addEventListener('click', () => {
      if (confirm('Reset all achievements?')) {
        localStorage.removeItem('achievements');
        alert('Achievements reset! Reload page to see changes.');
      }
    });

    document.getElementById('dev-enable-all')?.addEventListener('click', () => {
      if (window.ASCIIDog) window.ASCIIDog.enable();
      if (window.PhysicsTrophy) window.PhysicsTrophy.enable();
      if (window.MatrixRain) window.MatrixRain.enable();
      alert('All features enabled!');
    });

    document.getElementById('dev-disable-all')?.addEventListener('click', () => {
      if (window.ASCIIDog) window.ASCIIDog.disable();
      if (window.PhysicsTrophy) window.PhysicsTrophy.disable();
      if (window.MatrixRain) window.MatrixRain.disable();
      alert('All features disabled!');
    });

    document.getElementById('dev-trigger-konami')?.addEventListener('click', () => {
      activateKonamiCode();
    });

    document.getElementById('dev-spawn-dog')?.addEventListener('click', () => {
      if (window.ASCIIDog) {
        window.ASCIIDog.enable();
      }
    });

    document.getElementById('dev-spawn-trophy')?.addEventListener('click', () => {
      if (window.PhysicsTrophy) {
        window.PhysicsTrophy.enable();
      }
    });

    document.getElementById('dev-clear-storage')?.addEventListener('click', () => {
      if (confirm('Clear ALL localStorage data? This will reset everything!')) {
        localStorage.clear();
        alert('Storage cleared! Reloading page...');
        location.reload();
      }
    });

    document.getElementById('dev-export-data')?.addEventListener('click', () => {
      const data = {
        settings: JSON.parse(localStorage.getItem('dashboard-settings') || '{}'),
        achievements: JSON.parse(localStorage.getItem('achievements') || '{}')
      };
      console.log('Export Data:', data);
      alert('Data exported to console!');
    });
  }

  // ============================================
  // COMMAND LISTENER
  // ============================================
  document.addEventListener('keypress', (e) => {
    // Don't trigger if typing in input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      return;
    }

    commandBuffer += e.key;

    // Check for sudoku command
    if (commandBuffer.includes('sudoku')) {
      commandBuffer = '';
      window.location.href = 'sudoku.html';
      return;
    }

    // Clear buffer if too long
    if (commandBuffer.length > 20) {
      commandBuffer = '';
    }
  });

  // ============================================
  // CONSOLE WELCOME MESSAGE
  // ============================================
  function showConsoleWelcome() {
    console.log('%c┌───────────────────────────────────────────────────┐', 'color: #00ff00; font-family: monospace;');
    console.log('%c│  🎮 HIDDEN FEATURES DETECTED                      │', 'color: #00ff00; font-family: monospace;');
    console.log('%c├───────────────────────────────────────────────────┤', 'color: #00ff00; font-family: monospace;');
    console.log('%c│  Try these easter eggs:                           │', 'color: #e0e0e0; font-family: monospace;');
    console.log('%c│                                                   │', 'color: #808080; font-family: monospace;');
    console.log('%c│  • Type "gooddog" - Make the dog happy           │', 'color: #808080; font-family: monospace;');
    console.log('%c│  • Type "trophy" - Spawn the physics trophy      │', 'color: #808080; font-family: monospace;');
    console.log('%c│  • Type "sudoku" - Play a puzzle game            │', 'color: #808080; font-family: monospace;');
    console.log('%c│  • Click logo 10x fast - Unlock cheat mode       │', 'color: #808080; font-family: monospace;');
    console.log('%c│  • Shift+Ctrl+Click settings - Developer mode     │', 'color: #808080; font-family: monospace;');
    console.log('%c│  • Konami code - You know what to do             │', 'color: #808080; font-family: monospace;');
    console.log('%c│                                                   │', 'color: #808080; font-family: monospace;');
    console.log('%c│  Happy exploring! 🚀                              │', 'color: #00ff00; font-family: monospace;');
    console.log('%c└───────────────────────────────────────────────────┘', 'color: #00ff00; font-family: monospace;');
  }

  // ============================================
  // INITIALIZE
  // ============================================
  window.addEventListener('DOMContentLoaded', () => {
    initLogoClicker();
    initDeveloperMode();
    showConsoleWelcome();
  });

})();
