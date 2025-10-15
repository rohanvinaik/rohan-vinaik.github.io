// ============================================
// INTERACTIVE TERMINAL COMMAND BAR
// Full-featured terminal interface for site navigation
// ============================================

(function() {
  'use strict';

  // ============================================
  // TRANSLATION HELPER
  // ============================================
  function t(key) {
    if (!window.terminal || !window.terminal.translations) {
      return key; // Fallback if translations not loaded
    }
    const lang = window.terminal.getCurrentLanguage ? window.terminal.getCurrentLanguage() : 'standard';
    const translations = window.terminal.translations[lang] || window.terminal.translations.standard;
    return translations[key] || key;
  }

  // ============================================
  // COMMAND NAME MAPPING
  // ============================================
  // Map translated command names back to their canonical keys
  function getCanonicalCommand(input) {
    if (!window.terminal || !window.terminal.translations) {
      return input;
    }
    const lang = window.terminal.getCurrentLanguage ? window.terminal.getCurrentLanguage() : 'standard';
    const translations = window.terminal.translations[lang] || window.terminal.translations.standard;

    // Command mapping
    const commandMap = {
      'term-help': 'help',
      'term-cd': 'cd',
      'term-pwd': 'pwd',
      'term-ls': 'ls',
      'term-whoami': 'whoami',
      'term-about': 'about',
      'term-cat': 'cat',
      'term-date': 'date',
      'term-uptime': 'uptime',
      'term-clear': 'clear',
      'term-history': 'history',
      'term-echo': 'echo',
      'term-tree': 'tree',
      'term-grep': 'grep',
      'term-wc': 'wc',
      'term-fortune': 'fortune',
      'term-theme': 'theme',
      'term-cowsay': 'cowsay',
      'term-ll': 'll',
      'term-h': 'h'
    };

    // Check if input matches any translated command
    for (const [key, canonical] of Object.entries(commandMap)) {
      if (translations[key] === input) {
        return canonical;
      }
    }

    return input; // Return original if no translation match
  }

  // ============================================
  // STATE
  // ============================================
  const state = {
    currentSection: 'home',
    commandHistory: [],
    historyIndex: -1,
    isVisible: true, // Visible by default
    startTime: Date.now(),
    projects: [
      'BEHAVIORAL_HOLOGRAPHY',
      'GENOMEVAULT',
      'FDSC',
      'KIMAIYA',
      'CONSTRAINT_THEORY',
      'BIOCOMPUTING',
      'REV',
      'HBT',
      'AUDHD',
      'TAILCHASING',
      'VINTAGEOPTICS'
    ]
  };

  // ============================================
  // SECTION METADATA
  // ============================================
  const sections = {
    home: 'Main landing page with research overview',
    projects: 'Research projects and implementations',
    papers: 'Published papers and white papers',
    about: 'Background and career path',
    contact: 'Contact information and availability',
    skills: 'Technical capabilities and expertise',
    timeline: 'Research timeline and milestones',
    tools: 'Tools and utilities developed'
  };

  // ============================================
  // COMMAND DEFINITIONS
  // ============================================
  const commands = {
    help: {
      description: 'Show all available commands',
      usage: 'help [command]',
      execute: (args) => {
        if (args.length > 0) {
          const cmd = args[0].toLowerCase();
          if (commands[cmd]) {
            return formatCommandHelp(cmd, commands[cmd]);
          }
          return `<span class="error">Unknown command: ${cmd}</span>\nType 'help' to see all available commands.`;
        }
        return formatHelpMessage();
      }
    },

    cd: {
      description: 'Change directory (navigate to section)',
      usage: 'cd <section> | cd ..',
      execute: (args) => {
        if (args.length === 0) {
          return `${t('term-current-section')} ${state.currentSection}\n${t('term-usage')}: ${t('term-cd')} <section> | ${t('term-cd')} ..`;
        }

        const target = args[0].toLowerCase();

        if (target === '..') {
          if (state.currentSection !== 'home') {
            navigateToSection('home');
            return `<span class="success">${t('term-success-navigated')} home</span>`;
          }
          return t('term-already-home');
        }

        if (sections[target]) {
          navigateToSection(target);
          return `<span class="success">${t('term-success-navigated')} ${target}</span>`;
        }

        return `<span class="error">${t('term-error-section-not-found')}: ${target}</span>\n${t('term-available-sections')} ${Object.keys(sections).join(', ')}`;
      }
    },

    pwd: {
      description: 'Print current section',
      usage: 'pwd',
      execute: () => {
        return `/rohan-vinaik.github.io/${state.currentSection}`;
      }
    },

    ls: {
      description: 'List available sections',
      usage: 'ls [-l]',
      execute: (args) => {
        const longFormat = args.includes('-l') || args.includes('--long');

        if (longFormat) {
          let output = `\n<span class="info">${t('term-available-sections')}</span>\n`;
          output += '<span class="separator">══════════════════════════════════════════════════════════</span>\n';
          for (const [name, desc] of Object.entries(sections)) {
            output += `<span class="section-name">${name.padEnd(16)}</span> ${desc}\n`;
          }
          output += '<span class="separator">══════════════════════════════════════════════════════════</span>';
          return output;
        }

        return Object.keys(sections).join('    ');
      }
    },

    whoami: {
      description: 'Display info about Rohan',
      usage: 'whoami',
      execute: () => {
        return `
<span class="info">ROHAN VINAIK</span>
<span class="separator">────────────────────────────────────────</span>
<span class="text-primary">Independent Researcher</span>
<span class="text-secondary">AI Security · Systems Architecture · Computational Science</span>

<span class="label">Focus:</span> Formal frameworks for complex systems
<span class="label">Approach:</span> Rigorous theory → practical implementation
<span class="label">Domains:</span> AI verification, genomics, distributed systems

<span class="label">Current Projects:</span>
  • REV - Black-box LLM fingerprinting (15-20x speedup)
  • HBT - Hyperdimensional behavioral verification (95.8%)
  • AUDHD - 7 genetic subtypes from 18K+ cases

<span class="success">Available for PhD programs and research collaborations</span>`;
      }
    },

    about: {
      description: 'Jump to about section',
      usage: 'about',
      execute: () => {
        navigateToSection('about');
        return `<span class="success">Navigated to about section</span>`;
      }
    },

    cat: {
      description: 'Display section summary',
      usage: 'cat <section>',
      execute: (args) => {
        if (args.length === 0) {
          return `Usage: cat <section>\nAvailable sections: ${Object.keys(sections).join(', ')}`;
        }

        const section = args[0].toLowerCase();

        if (!sections[section]) {
          return `<span class="error">Section not found: ${section}</span>`;
        }

        return getSectionSummary(section);
      }
    },

    date: {
      description: 'Show current date/time',
      usage: 'date',
      execute: () => {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        const timeStr = now.toLocaleTimeString('en-US', {
          hour12: false,
          timeZone: 'America/New_York'
        });
        return `${dateStr} ${timeStr} EST`;
      }
    },

    uptime: {
      description: 'Show time since page loaded',
      usage: 'uptime',
      execute: () => {
        const elapsed = Date.now() - state.startTime;
        const seconds = Math.floor(elapsed / 1000) % 60;
        const minutes = Math.floor(elapsed / 60000) % 60;
        const hours = Math.floor(elapsed / 3600000);

        let uptimeStr = 'up ';
        if (hours > 0) uptimeStr += `${hours}h `;
        if (minutes > 0) uptimeStr += `${minutes}m `;
        uptimeStr += `${seconds}s`;

        return uptimeStr;
      }
    },

    clear: {
      description: 'Clear terminal output',
      usage: 'clear',
      execute: () => {
        const output = document.getElementById('terminal-output');
        if (output) {
          output.innerHTML = '';
        }
        return null; // Don't print anything
      }
    },

    history: {
      description: 'Show command history',
      usage: 'history',
      execute: () => {
        if (state.commandHistory.length === 0) {
          return t('term-no-history');
        }
        return state.commandHistory.map((cmd, i) =>
          `  ${(i + 1).toString().padStart(3)} ${cmd}`
        ).join('\n');
      }
    },

    echo: {
      description: 'Echo text back',
      usage: 'echo <text>',
      execute: (args) => {
        return args.join(' ') || '';
      }
    },

    tree: {
      description: 'Show site structure as ASCII tree',
      usage: 'tree',
      execute: () => {
        let tree = '\n<span class="info">rohan-vinaik.github.io/</span>\n';
        tree += '├── home/\n';
        tree += '├── projects/\n';
        state.projects.forEach((proj, i) => {
          const isLast = i === state.projects.length - 1;
          tree += `│   ${isLast ? '└──' : '├──'} ${proj}\n`;
        });
        tree += '├── papers/\n';
        tree += '│   ├── pot_neurips2025.pdf\n';
        tree += '│   ├── Shaking_the_Black_Box.pdf\n';
        tree += '│   ├── COEC_Thesis.pdf\n';
        tree += '│   └── GenomeVault_Manuscript.pdf\n';
        tree += '├── about/\n';
        tree += '├── contact/\n';
        tree += '├── skills/\n';
        tree += '├── timeline/\n';
        tree += '└── tools/';
        return tree;
      }
    },

    grep: {
      description: 'Search across sections for keyword',
      usage: 'grep <keyword>',
      execute: (args) => {
        if (args.length === 0) {
          return `${t('term-usage')}: ${t('term-grep')} <keyword>`;
        }

        const keyword = args.join(' ').toLowerCase();
        const results = [];

        // Search in section descriptions
        for (const [section, desc] of Object.entries(sections)) {
          if (desc.toLowerCase().includes(keyword) || section.includes(keyword)) {
            results.push(`<span class="section-name">${section}:</span> ${desc}`);
          }
        }

        // Search in projects
        const matchingProjects = state.projects.filter(p =>
          p.toLowerCase().includes(keyword)
        );
        if (matchingProjects.length > 0) {
          results.push(`<span class="section-name">projects:</span> ${matchingProjects.join(', ')}`);
        }

        if (results.length === 0) {
          return `<span class="error">${t('term-no-matches')} ${keyword}</span>`;
        }

        return `\n<span class="info">${t('term-search-results')} "${keyword}":</span>\n` + results.join('\n');
      }
    },

    wc: {
      description: 'Word count stats across sections',
      usage: 'wc',
      execute: () => {
        const contentSections = document.querySelectorAll('.content-section');
        let totalWords = 0;
        let totalChars = 0;
        const sectionCounts = [];

        contentSections.forEach(section => {
          const text = section.textContent || '';
          const words = text.trim().split(/\s+/).length;
          const chars = text.length;
          totalWords += words;
          totalChars += chars;

          const sectionId = section.id.replace('section-', '');
          sectionCounts.push(`${sectionId.padEnd(12)} ${words.toString().padStart(6)} words`);
        });

        return `\n<span class="info">Word Count Statistics:</span>\n<span class="separator">────────────────────────────────</span>\n${sectionCounts.join('\n')}\n<span class="separator">────────────────────────────────</span>\n<span class="label">Total:</span> ${totalWords} words, ${totalChars} characters`;
      }
    },

    fortune: {
      description: 'Random inspirational quote',
      usage: 'fortune',
      execute: () => {
        const fortunes = [
          t('term-fortune-1'),
          t('term-fortune-2'),
          t('term-fortune-3'),
          t('term-fortune-4'),
          t('term-fortune-5'),
          t('term-fortune-6'),
          t('term-fortune-7'),
          t('term-fortune-8'),
          t('term-fortune-9'),
          t('term-fortune-10')
        ];
        const quote = fortunes[Math.floor(Math.random() * fortunes.length)];
        return `\n${quote}\n`;
      }
    },

    theme: {
      description: 'Cycle through color themes',
      usage: 'theme',
      execute: () => {
        const themeBtn = document.getElementById('theme-cycle-btn');
        if (themeBtn) {
          themeBtn.click();
          return `<span class="success">${t('term-theme-cycled')}</span>`;
        }
        return `<span class="error">${t('term-theme-unavailable')}</span>`;
      }
    },

    cowsay: {
      description: 'Fun ASCII art command',
      usage: 'cowsay <text>',
      execute: (args) => {
        const text = args.join(' ') || 'Moo!';
        const textLen = text.length;
        const border = '_'.repeat(textLen + 2);

        return `
 ${border}
< ${text} >
 ${'-'.repeat(textLen + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
      }
    },

    // Command aliases
    ll: {
      description: 'Alias for ls -l',
      usage: 'll',
      execute: () => commands.ls.execute(['-l'])
    },

    h: {
      description: 'Alias for help',
      usage: 'h',
      execute: () => commands.help.execute([])
    },

    '?': {
      description: 'Alias for help',
      usage: '?',
      execute: () => commands.help.execute([])
    }
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  function formatHelpMessage() {
    let output = `\n<span class="info">${t('term-help-header')}</span>\n`;
    output += '<span class="separator">══════════════════════════════════════════════════════════</span>\n';
    output += `<span class="label">${t('term-nav-label')}</span>\n`;
    output += `  ${t('term-cd')} <section>      ${t('term-cd-desc')}\n`;
    output += `  ${t('term-cd')} ..             Return to home\n`;
    output += `  ${t('term-pwd')}               ${t('term-pwd-desc')}\n`;
    output += `  ${t('term-ls')} [-l]           ${t('term-ls-desc')}\n\n`;
    output += `<span class="label">${t('term-info-label')}</span>\n`;
    output += `  ${t('term-help')}              ${t('term-help-desc')}\n`;
    output += `  ${t('term-whoami')}            ${t('term-whoami-desc')}\n`;
    output += `  ${t('term-about')}             ${t('term-about-desc')}\n`;
    output += `  ${t('term-cat')} <section>     ${t('term-cat-desc')}\n`;
    output += `  ${t('term-date')}              ${t('term-date-desc')}\n`;
    output += `  ${t('term-uptime')}            ${t('term-uptime-desc')}\n\n`;
    output += `<span class="label">${t('term-utils-label')}</span>\n`;
    output += `  ${t('term-clear')}             ${t('term-clear-desc')}\n`;
    output += `  ${t('term-history')}           ${t('term-history-desc')}\n`;
    output += `  ${t('term-echo')} <text>       ${t('term-echo-desc')}\n`;
    output += `  ${t('term-tree')}              ${t('term-tree-desc')}\n`;
    output += `  ${t('term-grep')} <keyword>    ${t('term-grep-desc')}\n`;
    output += `  ${t('term-wc')}                ${t('term-wc-desc')}\n`;
    output += `  ${t('term-theme')}             ${t('term-theme-desc')}\n`;
    output += `  ${t('term-fortune')}           ${t('term-fortune-desc')}\n`;
    output += `  ${t('term-cowsay')} <text>     ${t('term-cowsay-desc')}\n\n`;
    output += `<span class="label">${t('term-aliases-label')}</span>\n`;
    output += `  ${t('term-ll')}                ${t('term-ll-desc')}\n`;
    output += `  ${t('term-h')}, ?              ${t('term-h-desc')}\n\n`;
    output += `<span class="label">${t('term-shortcuts-label')}</span>\n`;
    output += `  Ctrl+\`            ${t('term-shortcut-toggle')}\n`;
    output += `  Ctrl+L            ${t('term-shortcut-clear')}\n`;
    output += `  Ctrl+C            ${t('term-shortcut-cancel')}\n`;
    output += `  Esc               ${t('term-shortcut-blur')}\n`;
    output += `  Up/Down           ${t('term-shortcut-history')}\n`;
    output += `  Tab               ${t('term-shortcut-complete')}\n\n`;
    output += '<span class="separator">══════════════════════════════════════════════════════════</span>\n';
    output += `<span class="hint">Type any command for more details. Use TAB for completion.</span>`;
    return output;
  }

  function formatCommandHelp(cmd, cmdInfo) {
    return `\n<span class="label">Command:</span> ${cmd}\n<span class="label">Usage:</span> ${cmdInfo.usage}\n<span class="label">Description:</span> ${cmdInfo.description}\n`;
  }

  function getSectionSummary(section) {
    const summaries = {
      home: 'Landing page featuring current research projects (REV, HBT, AUDHD), research approach, and interactive features.',
      projects: '11 major research projects including Behavioral Holography, GenomeVault, FDSC, KIMAIYA, and more.',
      papers: 'Published research papers: PoT Verifier (NeurIPS 2025), Shaking the Black Box, COEC Framework, GenomeVault, and more.',
      about: 'Background: experimental foundations (2015-2021), applied experience at Stemcellerant, independent research (2021-present), current focus on COEC framework.',
      contact: 'Email: hello@rohanv.me | GitHub: github.com/rohanvinaik | Response time: 24-48 hours | Looking for PhD programs and research collaborations.',
      skills: 'Systems architecture, formal methods, mathematical foundations (PDEs, stochastic processes), programming (Python, R, Julia), domain expertise in AI security, genomics, biology.',
      timeline: 'Research milestones from 2025-01-20 to 2025-10-12, including PoT Verifier v2.0 release, GenomeVault submission, COEC framework publication.',
      tools: 'Developed tools: hdc_toolkit (Python), pot_verify (Rust), constraint_viz (JavaScript), genome_compress (Julia).'
    };

    return `\n<span class="info">${section.toUpperCase()}</span>\n<span class="separator">────────────────────────────────────────</span>\n${summaries[section] || 'No summary available.'}\n`;
  }

  function navigateToSection(sectionName) {
    state.currentSection = sectionName;

    // Use existing switchSection function if available
    if (window.terminal && typeof window.terminal.switchSection === 'function') {
      window.terminal.switchSection(sectionName);
    } else {
      // Fallback navigation
      const sections = document.querySelectorAll('.content-section');
      sections.forEach(s => s.classList.remove('active'));

      const target = document.getElementById(`section-${sectionName}`);
      if (target) {
        target.classList.add('active');
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

      // Update header path
      const currentPath = document.getElementById('current-path');
      if (currentPath) {
        currentPath.textContent = sectionName;
      }

      // Update terminal path
      const terminalPath = document.getElementById('terminal-path');
      if (terminalPath) {
        terminalPath.textContent = sectionName;
      }
    }
  }

  function executeCommand(input) {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Parse command and arguments
    const parts = trimmed.split(/\s+/);
    const inputCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Map translated command to canonical command
    const cmd = getCanonicalCommand(inputCmd);

    // Check if command exists
    if (commands[cmd]) {
      try {
        return commands[cmd].execute(args);
      } catch (error) {
        return `<span class="error">Error executing ${cmd}: ${error.message}</span>`;
      }
    }

    return `<span class="error">${t('term-error-not-found')}</span>\n${t('term-usage')}: '${t('term-help')}' ${t('term-help-desc')}`;
  }

  function appendOutput(command, output) {
    const outputEl = document.getElementById('terminal-output');
    if (!outputEl) return;

    // Create command line with translated prompt
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line terminal-command';
    cmdLine.innerHTML = `<span class="terminal-prompt">${t('term-prompt-user')}:~/<span class="path">${state.currentSection}</span>$</span> <span class="cmd-text">${escapeHtml(command)}</span>`;
    outputEl.appendChild(cmdLine);

    // Create output line (if any)
    if (output !== null && output !== undefined) {
      const outputLine = document.createElement('div');
      outputLine.className = 'terminal-line terminal-result';
      outputLine.innerHTML = output;
      outputEl.appendChild(outputLine);
    }

    // Auto-scroll to bottom
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function handleTabCompletion(input) {
    const parts = input.trim().split(/\s+/);
    const cmdPart = parts[0];

    // Complete command names
    if (parts.length === 1) {
      const matches = Object.keys(commands).filter(cmd =>
        cmd.startsWith(cmdPart.toLowerCase())
      );

      if (matches.length === 1) {
        return matches[0];
      } else if (matches.length > 1) {
        appendOutput(input, `\nPossible completions:\n  ${matches.join('  ')}`);
        return input;
      }
    }

    // Complete section names for cd, cat commands
    if (['cd', 'cat'].includes(cmdPart.toLowerCase()) && parts.length === 2) {
      const sectionPart = parts[1];
      const matches = Object.keys(sections).filter(sec =>
        sec.startsWith(sectionPart.toLowerCase())
      );

      if (matches.length === 1) {
        return `${cmdPart} ${matches[0]}`;
      } else if (matches.length > 1) {
        appendOutput(input, `\nPossible sections:\n  ${matches.join('  ')}`);
        return input;
      }
    }

    return input;
  }

  // ============================================
  // TERMINAL BAR INITIALIZATION
  // ============================================
  function initTerminalBar() {
    const terminalBar = document.getElementById('terminal-bar');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    if (!terminalBar || !terminalInput) {
      console.error('[Terminal Bar] Required elements not found');
      return;
    }

    // Show terminal by default if state.isVisible is true
    if (state.isVisible) {
      terminalBar.classList.add('visible');
    }

    // Show welcome message
    setTimeout(() => {
      appendOutput('', `<span class="info">${t('term-welcome')}</span>`);
    }, 500);

    // Handle input submission
    terminalInput.addEventListener('keydown', (e) => {
      // Enter key - execute command
      if (e.key === 'Enter') {
        const input = terminalInput.value;
        if (input.trim()) {
          state.commandHistory.push(input);
          state.historyIndex = state.commandHistory.length;

          const output = executeCommand(input);
          appendOutput(input, output);
        }
        terminalInput.value = '';
      }

      // Up arrow - previous command
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (state.historyIndex > 0) {
          state.historyIndex--;
          terminalInput.value = state.commandHistory[state.historyIndex] || '';
        }
      }

      // Down arrow - next command
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (state.historyIndex < state.commandHistory.length - 1) {
          state.historyIndex++;
          terminalInput.value = state.commandHistory[state.historyIndex] || '';
        } else {
          state.historyIndex = state.commandHistory.length;
          terminalInput.value = '';
        }
      }

      // Tab - auto-complete
      else if (e.key === 'Tab') {
        e.preventDefault();
        const completed = handleTabCompletion(terminalInput.value);
        terminalInput.value = completed;
      }

      // Ctrl+C - clear input
      else if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        terminalInput.value = '';
        appendOutput('^C', null);
      }

      // Ctrl+L - clear screen
      else if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        terminalOutput.innerHTML = '';
      }

      // Escape - blur input
      else if (e.key === 'Escape') {
        terminalInput.blur();
      }
    });

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl+` - toggle terminal (check both key and code for compatibility)
      if (e.ctrlKey && (e.key === '`' || e.code === 'Backquote')) {
        e.preventDefault();
        toggleTerminal();
      }

      // Don't handle shortcuts if typing in another input
      if (e.target.tagName === 'INPUT' && e.target.id !== 'terminal-input') {
        return;
      }
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      // Ctrl+L - clear screen (global)
      if (e.ctrlKey && e.key === 'l' && state.isVisible) {
        e.preventDefault();
        terminalOutput.innerHTML = '';
        terminalInput.focus();
      }
    });

    // Focus input when clicking terminal bar
    terminalBar.addEventListener('click', (e) => {
      if (e.target !== terminalInput && !e.target.closest('.terminal-output')) {
        terminalInput.focus();
      }
    });

    console.log('[Terminal Bar] Initialized successfully');
  }

  function toggleTerminal() {
    const terminalBar = document.getElementById('terminal-bar');
    if (!terminalBar) return;

    state.isVisible = !state.isVisible;

    if (state.isVisible) {
      terminalBar.classList.add('visible');
      const terminalInput = document.getElementById('terminal-input');
      if (terminalInput) {
        setTimeout(() => terminalInput.focus(), 100);
      }
    } else {
      terminalBar.classList.remove('visible');
    }
  }

  // ============================================
  // EXPORT TO GLOBAL SCOPE
  // ============================================
  window.TerminalBar = {
    toggle: toggleTerminal,
    execute: executeCommand,
    navigate: navigateToSection,
    isVisible: () => state.isVisible
  };

  // ============================================
  // INITIALIZE ON DOM READY
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTerminalBar);
  } else {
    initTerminalBar();
  }

  console.log('[Terminal Bar] Module loaded');

})();
