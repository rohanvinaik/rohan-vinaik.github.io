// ============================================
// TERMINAL INTERACTION SCRIPT
// ============================================

(function() {
  'use strict';

  // ============================================
  // CLOCK UPDATER
  // ============================================
  function updateClock() {
    const now = new Date();
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds} UTC`;

    const clockEl = document.getElementById('clock');
    if (clockEl) {
      clockEl.textContent = timeString;
    }
  }

  // ============================================
  // YEAR UPDATER
  // ============================================
  function updateYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // ============================================
  // DEPLOY TIME UPDATER
  // ============================================
  function updateDeployTime() {
    const deployEl = document.getElementById('deploy-time');
    if (deployEl) {
      const now = new Date();
      const dateString = now.toISOString().split('T')[0];
      deployEl.textContent = dateString;
    }
  }

  // ============================================
  // THEME TOGGLE
  // ============================================
  function initThemeToggle() {
    const themeBtn = document.getElementById('theme-btn');
    if (!themeBtn) return;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('terminal-theme');
    if (savedTheme === 'amber') {
      setTheme('amber');
      themeBtn.classList.add('active');
    }

    themeBtn.addEventListener('click', () => {
      const currentTheme = localStorage.getItem('terminal-theme') || 'green';
      const newTheme = currentTheme === 'green' ? 'amber' : 'green';
      setTheme(newTheme);
      themeBtn.classList.toggle('active');
    });
  }

  function setTheme(theme) {
    const root = document.documentElement;
    if (theme === 'amber') {
      root.style.setProperty('--accent', '#ffb000');
      root.style.setProperty('--accent-dim', '#cc8800');
      localStorage.setItem('terminal-theme', 'amber');
    } else {
      root.style.setProperty('--accent', '#00ff00');
      root.style.setProperty('--accent-dim', '#00aa00');
      localStorage.setItem('terminal-theme', 'green');
    }
  }

  // ============================================
  // SECTION NAVIGATION
  // ============================================
  function switchSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));

    // Show target section
    const targetSection = document.getElementById(`section-${sectionName}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      if (link.dataset.section === sectionName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update header path and command
    const pathEl = document.getElementById('current-path');
    const cmdEl = document.getElementById('header-cmd');
    const contentHeaderEl = document.getElementById('content-header');

    if (pathEl) pathEl.textContent = sectionName;

    const sectionFileMap = {
      home: { file: 'home.txt', cmd: 'cat home.txt' },
      projects: { file: 'projects.txt', cmd: 'cat projects.txt' },
      papers: { file: 'papers.txt', cmd: 'cat papers.txt' },
      about: { file: 'about.txt', cmd: 'cat about.txt' },
      contact: { file: 'contact.txt', cmd: 'cat contact.txt' }
    };

    const sectionData = sectionFileMap[sectionName] || { file: 'home.txt', cmd: 'cat home.txt' };
    if (cmdEl) cmdEl.textContent = sectionData.cmd;
    if (contentHeaderEl) contentHeaderEl.textContent = sectionData.file.toUpperCase();

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================
  function init() {
    // Update clock immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);

    // Update year
    updateYear();

    // Update deploy time
    updateDeployTime();

    // Initialize theme toggle
    initThemeToggle();

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link, .terminal-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const section = link.dataset.section;
        if (section) {
          e.preventDefault();
          switchSection(section);

          // Update URL hash
          history.pushState(null, '', `#${section}`);
        }
      });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      const hash = window.location.hash.slice(1) || 'home';
      switchSection(hash);
    });

    // Handle initial hash
    const initialHash = window.location.hash.slice(1);
    if (initialHash && ['home', 'projects', 'papers', 'about', 'contact'].includes(initialHash)) {
      switchSection(initialHash);
    } else {
      switchSection('home');
    }

    // ============================================
    // EASTER EGG: KONAMI CODE
    // ============================================
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
      konamiCode.push(e.key);
      konamiCode = konamiCode.slice(-10);

      if (konamiCode.join(',') === konamiSequence.join(',')) {
        showEasterEgg();
      }
    });

    // ============================================
    // EASTER EGG: HELP COMMAND
    // ============================================
    let commandBuffer = '';
    document.addEventListener('keypress', (e) => {
      // Don't trigger if typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      commandBuffer += e.key;

      if (commandBuffer.endsWith('help')) {
        showHelpCommand();
        commandBuffer = '';
      }

      if (commandBuffer.endsWith('whoami')) {
        showWhoAmI();
        commandBuffer = '';
      }

      // Clear buffer if it gets too long
      if (commandBuffer.length > 20) {
        commandBuffer = '';
      }
    });
  }

  // ============================================
  // EASTER EGG FUNCTIONS
  // ============================================
  function showEasterEgg() {
    const originalAccent = getComputedStyle(document.documentElement).getPropertyValue('--accent');
    document.documentElement.style.setProperty('--accent', '#ff00ff');

    setTimeout(() => {
      document.documentElement.style.setProperty('--accent', originalAccent);
    }, 3000);

    console.log('%c> KONAMI CODE ACTIVATED', 'color: #ff00ff; font-size: 20px; font-weight: bold;');
    console.log('%c> System colors temporarily modified...', 'color: #ff00ff;');
  }

  function showHelpCommand() {
    console.clear();
    console.log('%c┌────────────────────────────────────────┐', 'color: #00ff00; font-family: monospace;');
    console.log('%c│         AVAILABLE COMMANDS             │', 'color: #00ff00; font-family: monospace;');
    console.log('%c├────────────────────────────────────────┤', 'color: #00ff00; font-family: monospace;');
    console.log('%c│ help         Show this help message   │', 'color: #00ff00; font-family: monospace;');
    console.log('%c│ whoami       Display bio information  │', 'color: #00ff00; font-family: monospace;');
    console.log('%c│ ls           List available sections  │', 'color: #00ff00; font-family: monospace;');
    console.log('%c│ konami       Try the konami code      │', 'color: #00ff00; font-family: monospace;');
    console.log('%c└────────────────────────────────────────┘', 'color: #00ff00; font-family: monospace;');
    console.log('');
    console.log('%c> Type commands anywhere on the page', 'color: #808080;');
  }

  function showWhoAmI() {
    console.clear();
    console.log('%c> whoami', 'color: #00ff00; font-family: monospace;');
    console.log('');
    console.log('%cROHAN VINAIK', 'color: #e0e0e0; font-family: monospace; font-weight: bold;');
    console.log('%c────────────', 'color: #808080; font-family: monospace;');
    console.log('%cIndependent researcher developing Constraint-Oriented', 'color: #808080; font-family: monospace;');
    console.log('%cEmergent Computation (COEC) — a cross-domain framework', 'color: #808080; font-family: monospace;');
    console.log('%cconnecting AI security, cryptography, scientific', 'color: #808080; font-family: monospace;');
    console.log('%ccomputing, and systems biology.', 'color: #808080; font-family: monospace;');
    console.log('');
    console.log('%cFocus: behavioral holography, privacy-preserving', 'color: #808080; font-family: monospace;');
    console.log('%cgenomics, hyperdimensional computing, biocomputation.', 'color: #808080; font-family: monospace;');
    console.log('');
    console.log('%c> Clean theory. Practical builds.', 'color: #00ff00; font-family: monospace;');
  }

  // ============================================
  // INITIALIZE ON DOM READY
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Log welcome message
  console.log('%c┌─────────────────────────────────────────────┐', 'color: #00ff00; font-family: monospace;');
  console.log('%c│  rohan@personal:~$ cat welcome.txt         │', 'color: #00ff00; font-family: monospace;');
  console.log('%c├─────────────────────────────────────────────┤', 'color: #00ff00; font-family: monospace;');
  console.log('%c│  Welcome to the terminal interface!        │', 'color: #e0e0e0; font-family: monospace;');
  console.log('%c│  Type "help" for available commands        │', 'color: #808080; font-family: monospace;');
  console.log('%c└─────────────────────────────────────────────┘', 'color: #00ff00; font-family: monospace;');

})();
