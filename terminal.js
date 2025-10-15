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
      focus: 'COMPUTATIONAL BIOLOGY · HDC · THEORY',
      available: 'AVAILABLE',
      'nav-home': 'home',
      'nav-papers': 'papers',
      'nav-about': 'about',
      'nav-contact': 'contact',
      'nav-skills': 'skills',
      'nav-timeline': 'timeline',
      'nav-tools': 'tools',
      'hero-subtitle': 'Computational Biology · Hyperdimensional Computing · Mathematical Frameworks',
      'hero-intro': 'I develop novel computational approaches for biological discovery by bringing unconventional methods—hyperdimensional computing, topological data analysis, constraint-oriented frameworks—to biological systems. My work bridges experimental biochemistry experience with advanced mathematical theory to reveal how biological systems compute, evolve, and function.',
      'currently-working': 'CURRENTLY WORKING ON',
      'graph-intro': 'Interactive visualization of project dependencies and shared technologies. Click nodes to highlight connections, use filters (☰) to explore domains. Navigate: two-finger scroll to pan, pinch to zoom, or use buttons/drag.',
      'footer-status': 'Available for PhD programs and research collaborations',
      'footer-meta': 'Reproducible research · Open source',
      'about-approach-header': 'THE APPROACH',
      'about-approach': 'I bring unconventional computational frameworks to biological problems. Where traditional bioinformatics uses standard statistical methods, I apply hyperdimensional computing for genomic encoding, topological data analysis for cellular state spaces, and constraint-oriented models for emergent biological phenomena. Whether it\'s encoding DNA sequences as hypervectors (GenomeVault), analyzing iPSC differentiation trajectories with TDA (Kimaiya), or modeling cellular computation (Biocomputing), I develop mathematical frameworks that reveal biological mechanism and generate experimentally testable predictions.',
      'about-theory-header': 'FROM IMPLEMENTATION TO THEORY',
      'about-theory': 'My path has been unconventional but deliberate. I started with hands-on technical work—building systems, running experiments, seeing where theory breaks against reality. This gave me intuition for which problems matter and which solutions will scale. Now I focus on developing the underlying frameworks: mathematical structures that don\'t just solve one problem, but reveal principles that transfer across domains.',
      'about-path-header': 'MY PATH',
      'timeline-experimental': 'Biophysics research at McGill and Drexel (DNA dynamics, drug delivery). Learned that biological systems follow physical principles—thermodynamics, kinetics, stochastic processes.',
      'timeline-applied': 'Led biomanufacturing at Stemcellerant. Cellular therapeutics taught me about stochasticity, robustness, and the gap between theory and implementation at scale.',
      'timeline-independent': 'Developed constraint-oriented frameworks applicable across domains. Built verified implementations in AI security (Behavioral Holography), genomics (GenomeVault), and distributed computing (FDSC). Each project demonstrates theory → practice with reproducible results.',
      'timeline-current': 'Building mathematical frameworks for biological discovery using hyperdimensional computing, topological data analysis, and constraint-oriented modeling (COEC framework). Developing computational tools that bridge theory and experiment—from iPSC differentiation (Kimaiya) to genomic privacy (GenomeVault) to cellular computation (Biocomputing). Applying to PhD programs in computational/systems biology to extend this experimental-computational integration.',
      'contact-looking-header': '> Looking for:',
      'contact-looking-1': '  ▸ PhD programs in computational biology / systems biology / biophysics',
      'contact-looking-2': '  ▸ Research collaborations on computational approaches to biological discovery',
      'contact-looking-3': '  ▸ Research scientist roles at computational biology companies or institutes',
      'contact-interests-header': '> Interests:',
      'contact-interests-1': '  ▸ Hyperdimensional computing for genomics and biological data',
      'contact-interests-2': '  ▸ Topological analysis of cellular state spaces and differentiation',
      'contact-interests-3': '  ▸ Multi-scale modeling of biological systems (molecular → cellular)',
      'contact-interests-4': '  ▸ Theory-guided machine learning for biological prediction'
    },
    newspeak: {
      role: 'THOUGHTWORKER',
      focus: 'LIFEMATH · VECTORTHINK · THEORYWORK',
      available: 'PLUSREADY',
      'nav-home': 'home',
      'nav-papers': 'thinkdocs',
      'nav-about': 'personfile',
      'nav-contact': 'reachout',
      'nav-skills': 'capabilities',
      'nav-timeline': 'worklog',
      'nav-tools': 'utilities',
      'hero-subtitle': 'Lifemath · Vectorthink · Theoryframes',
      'hero-intro': 'Develop newthink compmath for lifesystems. Use vectorthink, shapemaths, limitframes for biodata. Work connects labthink with bigmath to show how lifesystems compute.',
      'currently-working': 'CURRENT WORKTHREADS',
      'graph-intro': 'Visual map of workthreads and shared tech. Click nodes for connections, use filter menu for domains. Navigate with gestures.',
      'footer-status': 'Plusready for doubleplus smartschool and thinkwork partnerships',
      'footer-meta': 'Replicable thinkwork · Public access',
      'about-approach-header': 'THE WORKMETHOD',
      'about-approach': 'Bring newmath frameworks to lifesystems. Traditional biocompute uses oldthink statmethods. Use vectorthink for genedata, shapemaths for cellstates, limitframes for lifephenomena. Build mathframes that show biofunction and make testable predictions.',
      'about-theory-header': 'FROM BUILDWORK TO THEORYWORK',
      'about-theory': 'Path was nonstandard but purposeful. Started with handwork—building systems, running tests, seeing where theory breaks reality. This gave intuition for real problems. Now focus on bigframes: mathstructures that reveal principles across domains.',
      'about-path-header': 'WORKHISTORY',
      'timeline-experimental': 'Biophysthink research (molecule motion, drugwork). Learned lifesystems follow physprinciples—heatwork, speedmath, randomthink.',
      'timeline-applied': 'Led cellmaking work. Celltherapy taught about chaos, strength, gap between theory and bigscale reality.',
      'timeline-independent': 'Built limitframe theory for all domains. Made verified systems in thoughtsec, genemath, network compute. Each work shows theory → practice with checkable results.',
      'timeline-current': 'Building mathframes for lifedata discovery using vectorthink, shapemaths, limitmodels. Building comptools that bridge theory and labwork. Applying to doubleplus smartschool programs in lifemaths.',
      'contact-looking-header': '> Seeking:',
      'contact-looking-1': '  ▸ Doubleplus smartschool in lifemaths / systemsbio / biophysthink',
      'contact-looking-2': '  ▸ Thinkwork partnerships on compmath for lifediscovery',
      'contact-looking-3': '  ▸ Thoughtworker roles at lifemaths organizations',
      'contact-interests-header': '> Focusareas:',
      'contact-interests-1': '  ▸ Vectorthink for genedata and biodata',
      'contact-interests-2': '  ▸ Shapemaths for cellstate analysis',
      'contact-interests-3': '  ▸ Multiscale models of lifesystems',
      'contact-interests-4': '  ▸ Theory-guided machinelearn for bioprediction'
    },
    emo: {
      role: 'misunderstood researcher :(',
      focus: 'trying to understand life... through math i guess',
      available: 'online but does it even matter',
      'nav-home': 'home',
      'nav-papers': 'words nobody reads',
      'nav-about': 'my story (complicated)',
      'nav-contact': 'reach out maybe',
      'nav-skills': 'things i know',
      'nav-timeline': 'what i\'ve done',
      'nav-tools': 'stuff i built',
      'hero-subtitle': 'math for biology... hoping someone cares',
      'hero-intro': 'i try to understand biological systems through weird math nobody else uses. hypervectors, topology stuff, weird frameworks... probably doesn\'t matter but at least i\'m trying. maybe one day someone will get it.',
      'currently-working': 'projects i\'m working on alone',
      'graph-intro': 'made this graph to show how everything connects... not sure anyone will look at it but whatever. click things if you want.',
      'footer-status': 'hoping someone notices... looking for phd programs or collaborations',
      'footer-meta': 'trying to be reproducible · sharing everything anyway',
      'about-approach-header': 'what i\'m trying to do',
      'about-approach': 'i guess i bring weird math to biology problems. normal people use standard statistics but i\'m over here with hypervectors and topology because... i don\'t know, it feels right? encoding DNA with hypervectors, analyzing cell states with weird geometry... probably nobody cares but these frameworks actually predict stuff. at least there\'s that.',
      'about-theory-header': 'how i got here (it\'s messy)',
      'about-theory': 'my path makes no sense honestly. started building things, running experiments, watching everything break. figured out what matters the hard way. now i just make frameworks that probably nobody will use. but they\'re elegant at least... mathematical beauty in the void.',
      'about-path-header': 'the journey (oof)',
      'timeline-experimental': 'spent years on DNA stuff at McGill and Drexel. learned that biology follows physics laws—thermodynamics, kinetics, randomness. felt meaningful at the time.',
      'timeline-applied': 'led cell manufacturing at a startup. taught me about chaos and how theory dies when you scale up. kind of broke me but whatever.',
      'timeline-independent': 'been working alone on frameworks nobody asked for. AI security, genomics, distributed computing... each one works but does anyone care? each project shows theory can work in practice. small victories i guess.',
      'timeline-current': 'building math frameworks for biology. hypervectors, topology, constraint models... hoping it matters. making tools that connect theory to experiments. applying to phd programs... maybe someone will want me.',
      'contact-looking-header': '> looking for (if anyone\'s interested):',
      'contact-looking-1': '  ▸ phd programs that might accept me (computational biology stuff)',
      'contact-looking-2': '  ▸ people who want to collaborate on weird computational approaches',
      'contact-looking-3': '  ▸ research roles where my strange methods might be useful',
      'contact-interests-header': '> things i care about:',
      'contact-interests-1': '  ▸ using hypervectors for genomics (nobody else does this)',
      'contact-interests-2': '  ▸ topology for understanding cell states and differentiation',
      'contact-interests-3': '  ▸ modeling biological systems at multiple scales',
      'contact-interests-4': '  ▸ theory-guided machine learning (probably won\'t work but trying anyway)'
    },
    corporate: {
      role: 'INNOVATION CATALYST',
      focus: 'COMPUTATIONAL BIOLOGY SOLUTIONS · NEXT-GEN FRAMEWORKS',
      available: 'ACTIVELY ENGAGED',
      'nav-home': 'home',
      'nav-papers': 'THOUGHT LEADERSHIP',
      'nav-about': 'EXECUTIVE PROFILE',
      'nav-contact': 'STRATEGIC PARTNERSHIPS',
      'nav-skills': 'CORE COMPETENCIES',
      'nav-timeline': 'MILESTONES',
      'nav-tools': 'SOLUTION PORTFOLIO',
      'hero-subtitle': 'Computational Biology · Hyperdimensional Computing · Mathematical Innovation',
      'hero-intro': 'Driving transformative innovation in computational biology through best-in-class mathematical frameworks. Leveraging hyperdimensional computing, topological data analysis, and constraint-oriented methodologies to unlock value in biological systems. Delivering synergistic solutions that bridge experimental biochemistry with cutting-edge mathematical theory to drive biological discovery at scale.',
      'currently-working': 'STRATEGIC INITIATIVES IN PROGRESS',
      'graph-intro': 'Interactive visualization dashboard showcasing project dependencies and technology synergies. Leverage node interactions to explore strategic connections. Utilize intuitive navigation for seamless discovery experience.',
      'footer-status': 'Actively seeking PhD opportunities and strategic research partnerships to maximize impact',
      'footer-meta': 'Best-in-class reproducible research · Open innovation',
      'about-approach-header': 'VALUE PROPOSITION',
      'about-approach': 'Delivering next-generation computational frameworks to biological challenges. Where traditional bioinformatics leverages conventional methodologies, our approach drives innovation through hyperdimensional computing for genomic encoding, topological data analysis for cellular state spaces, and constraint-oriented models for emergent biological phenomena. Whether architecting DNA sequence encoding solutions, optimizing iPSC differentiation trajectories, or modeling cellular computation, we deliver mathematical frameworks that unlock biological mechanisms and generate actionable, experimentally-validated insights.',
      'about-theory-header': 'FROM EXECUTION TO STRATEGIC VISION',
      'about-theory': 'My journey reflects a strategic pivot from tactical execution to visionary framework development. Initial phase focused on hands-on technical delivery—building scalable systems, executing experiments, validating theory against real-world implementation. This provided critical insights into market pain points and scalable solutions. Current focus centers on developing foundational frameworks: mathematical structures that don\'t just solve point solutions, but reveal cross-domain principles that drive transformative value.',
      'about-path-header': 'CAREER TRAJECTORY',
      'timeline-experimental': 'Biophysics research at tier-1 institutions (McGill, Drexel). Deep-dived into DNA dynamics and drug delivery optimization. Established foundational understanding of physical principles—thermodynamics, kinetics, stochastic modeling—driving biological systems.',
      'timeline-applied': 'Led biomanufacturing operations at emerging biotech. Cellular therapeutics experience delivered key insights on stochasticity management, robustness engineering, and bridging the theory-to-scale gap in production environments.',
      'timeline-independent': 'Architected constraint-oriented frameworks with proven cross-domain applicability. Delivered verified implementations across AI security (Behavioral Holography), genomics (GenomeVault), and distributed computing (FDSC). Each initiative demonstrates measurable theory-to-practice value with reproducible, industry-leading results.',
      'timeline-current': 'Building best-in-class mathematical frameworks for biological discovery leveraging hyperdimensional computing, topological data analysis, and constraint-oriented modeling (COEC framework). Developing computational solutions that synergize theory and experimental validation—from iPSC differentiation platforms to genomic privacy architectures to cellular computation models. Pursuing PhD opportunities in computational/systems biology to scale this experimental-computational integration and drive maximum research impact.',
      'contact-looking-header': '> Strategic Opportunities:',
      'contact-looking-1': '  ▸ PhD programs offering cutting-edge computational biology / systems biology / biophysics research',
      'contact-looking-2': '  ▸ Research collaborations focused on innovative computational approaches to biological discovery',
      'contact-looking-3': '  ▸ Research scientist positions at industry-leading computational biology organizations',
      'contact-interests-header': '> Core Focus Areas:',
      'contact-interests-1': '  ▸ Hyperdimensional computing solutions for genomics and biological big data',
      'contact-interests-2': '  ▸ Topological analysis methodologies for cellular state space optimization',
      'contact-interests-3': '  ▸ Multi-scale modeling frameworks for biological systems (molecular to cellular)',
      'contact-interests-4': '  ▸ Theory-guided machine learning architectures for biological prediction'
    }
  };

  // ============================================
  // SETTINGS STATE
  // ============================================
  let settings = {
    volume: 80,
    accent: 'green',
    background: 'gray',
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
          background: 'gray',
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
