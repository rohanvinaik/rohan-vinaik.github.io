// ============================================
// DASHBOARD INTERACTION SCRIPT
// ============================================

(function() {
  'use strict';

  // ============================================
  // TRANSLATIONS
  // ============================================
  const translations = {
    standard: {
      role: 'INDEPENDENT RESEARCHER',
      focus: 'AI SECURITY & CRYPTOGRAPHY',
      location: 'CALIFORNIA, USA',
      status: 'AVAILABLE',
      'nav-home': 'home',
      'nav-projects': 'projects',
      'nav-papers': 'papers',
      'nav-about': 'about',
      'nav-contact': 'contact',
      'section-title-home': 'ROHAN VINAIK',
      'section-title-projects': 'PROJECTS',
      'section-title-papers': 'RESEARCH PAPERS',
      'section-title-about': 'ABOUT',
      'section-title-contact': 'CONTACT',
      'home-intro': 'Independent researcher developing Constraint-Oriented Emergent Computation (COEC) — a cross-domain framework connecting AI security, cryptography, scientific computing, and systems biology.',
      'projects-intro': 'Current research initiatives and technical implementations.',
      'papers-intro': 'Published research and technical documentation.',
      'about-intro': 'Background and research interests.',
      'contact-cta': 'Open to collaboration on research initiatives.',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      email: 'Email'
    },
    newspeak: {
      role: 'THOUGHTWORKER',
      focus: 'THOUGHTSEC & SECRETMATH',
      location: 'AIRSTRIP ONE',
      status: 'PLUSREADY',
      'nav-home': 'home',
      'nav-projects': 'works',
      'nav-papers': 'thinkdocs',
      'nav-about': 'personfile',
      'nav-contact': 'reachout',
      'section-title-home': 'ROHAN VINAIK',
      'section-title-projects': 'WORKS',
      'section-title-papers': 'THINKDOCS',
      'section-title-about': 'PERSONFILE',
      'section-title-contact': 'REACHOUT',
      'home-intro': 'Thoughtworker developing Constraint-Oriented Emergent Computation (COEC) — plusgood framework connecting thoughtsec, secretmath, and biocompute.',
      'projects-intro': 'Current works and technical implementations.',
      'papers-intro': 'Published thinkdocs and technical documentation.',
      'about-intro': 'Background and research interests.',
      'contact-cta': 'Open to collaboration on research works.',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      email: 'Telegram'
    },
    emo: {
      role: 'misunderstood thinker :(',
      focus: 'protecting against the void',
      location: 'somewhere lonely',
      status: 'online but... whatever',
      'nav-home': 'home',
      'nav-projects': 'things i made alone',
      'nav-papers': 'thoughts no1 reads',
      'nav-about': 'my story (it\'s complicated)',
      'nav-contact': 'message me (if u care)',
      'section-title-home': 'ROHAN VINAIK',
      'section-title-projects': 'things i made alone',
      'section-title-papers': 'thoughts no1 reads',
      'section-title-about': 'my story',
      'section-title-contact': 'reach out maybe',
      'home-intro': 'trying to make sense of everything through Constraint-Oriented Emergent Computation... nobody really understands what i\'m doing but that\'s fine i guess',
      'projects-intro': 'stuff i\'ve been working on when i can\'t sleep.',
      'papers-intro': 'things i\'ve written that probably don\'t matter.',
      'about-intro': 'who even am i anymore.',
      'contact-cta': 'if you want to talk about research or whatever... i\'m around.',
      github: 'GitHub (barely active)',
      linkedin: 'LinkedIn (fake smile)',
      email: 'Email (i\'ll respond eventually)'
    },
    corporate: {
      role: 'INNOVATION CATALYST',
      focus: 'AI RISK MITIGATION SOLUTIONS',
      location: 'SILICON VALLEY ECOSYSTEM',
      status: 'CURRENTLY RESOURCED',
      'nav-home': 'home',
      'nav-projects': 'KEY INITIATIVES',
      'nav-papers': 'THOUGHT LEADERSHIP',
      'nav-about': 'EXECUTIVE SUMMARY',
      'nav-contact': 'STRATEGIC PARTNERSHIPS',
      'section-title-home': 'ROHAN VINAIK',
      'section-title-projects': 'KEY INITIATIVES',
      'section-title-papers': 'THOUGHT LEADERSHIP',
      'section-title-about': 'EXECUTIVE SUMMARY',
      'section-title-contact': 'STRATEGIC PARTNERSHIPS',
      'home-intro': 'Driving innovation in Constraint-Oriented Emergent Computation (COEC) — a synergistic framework leveraging AI security, cryptographic excellence, and computational biology to deliver transformative outcomes.',
      'projects-intro': 'Strategic initiatives delivering measurable impact.',
      'papers-intro': 'Industry-leading thought leadership and technical documentation.',
      'about-intro': 'Professional background and core competencies.',
      'contact-cta': 'Seeking strategic partnerships to unlock synergies.',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      email: 'Email'
    }
  };

  // ============================================
  // SETTINGS STATE
  // ============================================
  let settings = {
    volume: 80,
    accent: 'green',
    background: 'black',
    language: 'standard'
  };

  // ============================================
  // LOAD SETTINGS FROM LOCALSTORAGE
  // ============================================
  function loadSettings() {
    const saved = localStorage.getItem('dashboard-settings');
    if (saved) {
      try {
        settings = { ...settings, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
    applySettings();
  }

  // ============================================
  // SAVE SETTINGS TO LOCALSTORAGE
  // ============================================
  function saveSettings() {
    localStorage.setItem('dashboard-settings', JSON.stringify(settings));
  }

  // ============================================
  // APPLY SETTINGS
  // ============================================
  function applySettings() {
    // Apply accent color
    const root = document.documentElement;
    const accentColors = {
      green: '#00ff00',
      amber: '#ffb000',
      cyan: '#00ffff'
    };
    root.style.setProperty('--accent', accentColors[settings.accent] || accentColors.green);

    // Apply background color
    const bgColors = {
      black: '#0a0a0a',
      gray: '#1a1a1a',
      navy: '#0a0a1a'
    };
    root.style.setProperty('--bg-primary', bgColors[settings.background] || bgColors.black);

    // Apply translations
    applyTranslations();

    // Update UI controls
    updateSettingsUI();
  }

  // ============================================
  // APPLY TRANSLATIONS
  // ============================================
  function applyTranslations() {
    const lang = settings.language;
    const t = translations[lang] || translations.standard;

    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      if (t[key]) {
        el.textContent = t[key];
      }
    });
  }

  // ============================================
  // UPDATE SETTINGS UI
  // ============================================
  function updateSettingsUI() {
    // Volume slider
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');
    if (volumeSlider && volumeValue) {
      volumeSlider.value = settings.volume;
      volumeValue.textContent = settings.volume + '%';
    }

    // Accent color radio buttons
    const accentRadios = document.querySelectorAll('input[name="accent"]');
    accentRadios.forEach(radio => {
      radio.checked = radio.value === settings.accent;
    });

    // Background color radio buttons
    const bgRadios = document.querySelectorAll('input[name="background"]');
    bgRadios.forEach(radio => {
      radio.checked = radio.value === settings.background;
    });

    // Language select
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.value = settings.language;
    }

    // Update theme button in control bar
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
      themeBtn.classList.toggle('active', settings.accent !== 'green');
    }
  }

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
  async function updateDeployTime() {
    const deployEl = document.getElementById('deploy-time');
    if (!deployEl) return;

    try {
      // Fetch latest commit from GitHub API
      const response = await fetch('https://api.github.com/repos/rohanvinaik/rohan-vinaik.github.io/commits/main');
      const data = await response.json();

      if (data.commit && data.commit.committer && data.commit.committer.date) {
        const commitDate = new Date(data.commit.committer.date);

        // Convert to Boston time (America/New_York timezone)
        const bostonTimeString = commitDate.toLocaleString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });

        // Format as YYYY-MM-DD HH:MM EST/EDT
        const [datePart, timePart] = bostonTimeString.split(', ');
        const [month, day, year] = datePart.split('/');
        const formattedDate = `${year}-${month}-${day}`;

        // Determine if EST or EDT
        const isDST = isDaylightSavingTime(commitDate);
        const timezone = isDST ? 'EDT' : 'EST';

        deployEl.textContent = `${formattedDate} ${timePart} ${timezone}`;
      } else {
        // Fallback to current date if API fails
        const now = new Date();
        const dateString = now.toISOString().split('T')[0];
        deployEl.textContent = dateString;
      }
    } catch (error) {
      console.error('Failed to fetch deploy time:', error);
      // Fallback to current date
      const now = new Date();
      const dateString = now.toISOString().split('T')[0];
      deployEl.textContent = dateString;
    }
  }

  // ============================================
  // CHECK IF DAYLIGHT SAVING TIME
  // ============================================
  function isDaylightSavingTime(date) {
    const year = date.getFullYear();
    // DST starts on second Sunday in March
    const marchSecondSunday = new Date(year, 2, 1); // March 1
    marchSecondSunday.setDate(1 + (7 - marchSecondSunday.getDay()) % 7 + 7); // Second Sunday

    // DST ends on first Sunday in November
    const novemberFirstSunday = new Date(year, 10, 1); // November 1
    novemberFirstSunday.setDate(1 + (7 - novemberFirstSunday.getDay()) % 7); // First Sunday

    return date >= marchSecondSunday && date < novemberFirstSunday;
  }

  // ============================================
  // SETTINGS MODAL
  // ============================================
  function initSettingsModal() {
    const overlay = document.getElementById('settings-overlay');
    const openBtn = document.getElementById('settings-btn');
    const closeHeaderBtn = document.querySelector('.settings-close');
    const closeFooterBtn = document.getElementById('close-btn');
    const applyBtn = document.getElementById('apply-btn');
    const resetBtn = document.getElementById('reset-btn');

    if (!overlay || !openBtn) return;

    // Open modal
    openBtn.addEventListener('click', () => {
      overlay.classList.add('active');
      updateSettingsUI();
    });

    // Close modal (header X button)
    if (closeHeaderBtn) {
      closeHeaderBtn.addEventListener('click', () => {
        saveSettings();
        overlay.classList.remove('active');
      });
    }

    // Close modal (footer CLOSE button)
    if (closeFooterBtn) {
      closeFooterBtn.addEventListener('click', () => {
        saveSettings();
        overlay.classList.remove('active');
      });
    }

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
      }
    });

    // Volume slider
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');
    if (volumeSlider && volumeValue) {
      volumeSlider.addEventListener('input', (e) => {
        settings.volume = parseInt(e.target.value);
        volumeValue.textContent = settings.volume + '%';
      });
    }

    // Accent color radio buttons
    const accentRadios = document.querySelectorAll('input[name="accent"]');
    accentRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          settings.accent = e.target.value;
          applySettings();
        }
      });
    });

    // Background color radio buttons
    const bgRadios = document.querySelectorAll('input[name="background"]');
    bgRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          settings.background = e.target.value;
          applySettings();
        }
      });
    });

    // Language select
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.addEventListener('change', (e) => {
        settings.language = e.target.value;
        applySettings();
      });
    }

    // Apply button
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        saveSettings();
        overlay.classList.remove('active');
      });
    }

    // Reset button
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        settings = {
          volume: 80,
          accent: 'green',
          background: 'black',
          language: 'standard'
        };
        applySettings();
        saveSettings();
      });
    }
  }

  // ============================================
  // THEME TOGGLE (CONTROL BAR)
  // ============================================
  function initThemeToggle() {
    const themeBtn = document.getElementById('theme-btn');
    if (!themeBtn) return;

    themeBtn.addEventListener('click', () => {
      // Cycle through accent colors: green -> amber -> cyan -> green
      const accentCycle = ['green', 'amber', 'cyan'];
      const currentIndex = accentCycle.indexOf(settings.accent);
      const nextIndex = (currentIndex + 1) % accentCycle.length;
      settings.accent = accentCycle[nextIndex];

      applySettings();
      saveSettings();
    });
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

    // Update nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      if (item.dataset.section === sectionName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update output header
    const outputTitle = document.getElementById('output-title');
    if (outputTitle) {
      const titleMap = {
        home: 'HOME.TXT',
        projects: 'PROJECTS.TXT',
        'research-graph': 'RESEARCH_GRAPH.TXT',
        papers: 'PAPERS.TXT',
        about: 'ABOUT.TXT',
        contact: 'CONTACT.TXT',
        skills: 'SKILLS.TXT',
        timeline: 'TIMELINE.TXT',
        tools: 'TOOLS.TXT'
      };
      outputTitle.textContent = titleMap[sectionName] || 'HOME.TXT';
    }

    // Scroll to top smoothly
    const outputContent = document.querySelector('.output-content');
    if (outputContent) {
      outputContent.scrollTop = 0;
    }
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================
  function init() {
    // Load saved settings
    loadSettings();

    // Update clock immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);

    // Update year
    updateYear();

    // Update deploy time
    updateDeployTime();

    // Initialize settings modal
    initSettingsModal();

    // Initialize theme toggle
    initThemeToggle();

    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        if (section) {
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
    if (initialHash && ['home', 'projects', 'research-graph', 'papers', 'about', 'contact', 'skills', 'timeline', 'tools'].includes(initialHash)) {
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
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
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
    const root = document.documentElement;
    const originalAccent = getComputedStyle(root).getPropertyValue('--accent');
    root.style.setProperty('--accent', '#ff00ff');

    setTimeout(() => {
      root.style.setProperty('--accent', originalAccent);
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
