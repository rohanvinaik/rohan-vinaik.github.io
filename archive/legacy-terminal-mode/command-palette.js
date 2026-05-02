/**
 * Command Palette - Power User Interface
 * Cmd+K / Ctrl+K fuzzy finder for quick navigation
 * Terminal-inspired command interface
 */

(function() {
  'use strict';

  // ============================================
  // COMMAND REGISTRY
  // ============================================
  const commands = {
    // Navigation commands
    'goto:home': { icon: '🏠', label: 'Go to Home', action: () => navigateToSection('home') },
    'goto:about': { icon: '👤', label: 'Go to About', action: () => navigateToSection('about') },
    'goto:papers': { icon: '📄', label: 'Go to Papers', action: () => navigateToSection('papers') },
    'goto:projects': { icon: '🚀', label: 'Go to Projects', action: () => navigateToSection('projects') },
    'goto:skills': { icon: '⚡', label: 'Go to Skills', action: () => navigateToSection('skills') },
    'goto:contact': { icon: '📧', label: 'Go to Contact', action: () => navigateToSection('contact') },
    'goto:research': { icon: '🔬', label: 'Go to Research Graph', action: () => navigateToSection('research') },

    // Paper prefixes
    'p:': { icon: '📄', label: 'Search Papers', prefix: true },
    'project:': { icon: '🚀', label: 'Search Projects', prefix: true },
    'skill:': { icon: '⚡', label: 'Search Skills', prefix: true },

    // Actions
    'search': { icon: '🔍', label: 'Open Search', action: () => window.Search?.open() },
    'settings': { icon: '⚙️', label: 'Open Settings', action: () => openSettings() },
    'theme:dark': { icon: '🌙', label: 'Dark Theme', action: () => setTheme('dark') },
    'theme:light': { icon: '☀️', label: 'Light Theme', action: () => setTheme('light') },
    'theme:toggle': { icon: '🎨', label: 'Toggle Theme', action: () => toggleTheme() },

    // Easter eggs
    'dog': { icon: '🐕', label: 'Toggle Dog', action: () => toggleDog() },
    'matrix': { icon: '💚', label: 'Toggle Matrix Rain', action: () => toggleMatrix() },
    'fps': { icon: '📊', label: 'Toggle FPS Counter', action: () => window.SiteStats?.fpsCounter?.toggle() },

    // Utilities
    'clear': { icon: '🧹', label: 'Clear Browser Cache', action: () => clearCache() },
    'reload': { icon: '🔄', label: 'Reload Page', action: () => location.reload() },
    'copy:url': { icon: '🔗', label: 'Copy Page URL', action: () => copyToClipboard(location.href) },
    'share': { icon: '📤', label: 'Share Page', action: () => sharePage() }
  };

  // ============================================
  // STATE
  // ============================================
  let paletteOverlay = null;
  let paletteInput = null;
  let resultsContainer = null;
  let selectedIndex = 0;
  let currentResults = [];
  let contentIndex = [];

  // ============================================
  // BUILD CONTENT INDEX
  // ============================================
  function buildContentIndex() {
    const index = [];

    // Index Papers
    document.querySelectorAll('.list-item').forEach(item => {
      const titleEl = item.querySelector('.list-title');
      if (titleEl) {
        const title = titleEl.textContent.trim();
        index.push({
          type: 'paper',
          icon: '📄',
          label: title,
          searchText: `p:${title}`,
          action: () => {
            navigateToSection('papers');
            setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
          }
        });
      }
    });

    // Index Projects
    document.querySelectorAll('.item').forEach(item => {
      const titleEl = item.querySelector('.item-title');
      if (titleEl) {
        const title = titleEl.textContent.trim();
        index.push({
          type: 'project',
          icon: '🚀',
          label: title,
          searchText: `project:${title}`,
          action: () => {
            navigateToSection('projects');
            setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
          }
        });
      }
    });

    // Index Skills
    document.querySelectorAll('.skill-item').forEach(item => {
      const nameEl = item.querySelector('.skill-name');
      if (nameEl) {
        const name = nameEl.textContent.trim();
        index.push({
          type: 'skill',
          icon: '⚡',
          label: name,
          searchText: `skill:${name}`,
          action: () => {
            navigateToSection('skills');
            setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
          }
        });
      }
    });

    console.log(`[CommandPalette] Indexed ${index.length} content items`);
    return index;
  }

  // ============================================
  // CREATE PALETTE UI
  // ============================================
  function createPaletteUI() {
    paletteOverlay = document.createElement('div');
    paletteOverlay.className = 'command-palette-overlay';
    paletteOverlay.innerHTML = `
      <div class="command-palette">
        <div class="palette-header">
          <span class="palette-prompt">></span>
          <input type="text" class="palette-input" placeholder="Type a command... (Ctrl+K)" autofocus>
          <kbd class="palette-shortcut">ESC</kbd>
        </div>
        <div class="palette-results"></div>
        <div class="palette-footer">
          <span class="palette-hint">💡 Try: <code>p: genomics</code>, <code>goto:papers</code>, <code>theme:dark</code></span>
        </div>
      </div>
    `;

    document.body.appendChild(paletteOverlay);

    paletteInput = paletteOverlay.querySelector('.palette-input');
    resultsContainer = paletteOverlay.querySelector('.palette-results');

    // Event listeners
    paletteInput.addEventListener('input', handleInput);
    paletteInput.addEventListener('keydown', handleKeyNavigation);
    paletteOverlay.addEventListener('click', (e) => {
      if (e.target === paletteOverlay) closePalette();
    });

    console.log('[CommandPalette] UI created');
  }

  // ============================================
  // INPUT HANDLING
  // ============================================
  function handleInput(e) {
    const query = e.target.value.trim().toLowerCase();

    if (!query) {
      showDefaultCommands();
      return;
    }

    // Check for prefix commands (p:, project:, skill:)
    const prefix = Object.keys(commands).find(key =>
      commands[key].prefix && query.startsWith(key)
    );

    if (prefix) {
      const searchTerm = query.substring(prefix.length).trim();
      showPrefixResults(prefix, searchTerm);
    } else {
      showMatchingCommands(query);
    }
  }

  function showDefaultCommands() {
    const defaultCommands = [
      'goto:papers', 'goto:projects', 'goto:skills',
      'search', 'theme:toggle', 'matrix', 'dog'
    ];

    currentResults = defaultCommands.map(key => ({
      key,
      ...commands[key]
    }));

    renderResults();
  }

  function showPrefixResults(prefix, searchTerm) {
    const prefixType = prefix.replace(':', '');

    currentResults = contentIndex
      .filter(item => item.type === prefixType)
      .filter(item => !searchTerm || item.label.toLowerCase().includes(searchTerm))
      .slice(0, 10);

    renderResults();
  }

  function showMatchingCommands(query) {
    currentResults = Object.entries(commands)
      .filter(([key, cmd]) => !cmd.prefix)
      .filter(([key, cmd]) =>
        key.includes(query) ||
        cmd.label.toLowerCase().includes(query)
      )
      .map(([key, cmd]) => ({ key, ...cmd }))
      .slice(0, 10);

    // Also search content
    const contentResults = contentIndex
      .filter(item => item.label.toLowerCase().includes(query))
      .slice(0, 5);

    currentResults = [...currentResults, ...contentResults];
    renderResults();
  }

  function renderResults() {
    if (currentResults.length === 0) {
      resultsContainer.innerHTML = '<div class="palette-empty">No commands found</div>';
      return;
    }

    selectedIndex = 0;
    resultsContainer.innerHTML = currentResults.map((result, index) => `
      <div class="palette-result ${index === selectedIndex ? 'selected' : ''}" data-index="${index}">
        <span class="result-icon">${result.icon}</span>
        <span class="result-label">${result.label}</span>
        ${result.key ? `<kbd class="result-key">${result.key}</kbd>` : ''}
      </div>
    `).join('');

    // Add click handlers
    resultsContainer.querySelectorAll('.palette-result').forEach((el, index) => {
      el.addEventListener('click', () => executeCommand(index));
    });
  }

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================
  function handleKeyNavigation(e) {
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, currentResults.length - 1);
        updateSelection();
        break;

      case 'ArrowUp':
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        updateSelection();
        break;

      case 'Enter':
        e.preventDefault();
        executeCommand(selectedIndex);
        break;

      case 'Escape':
        e.preventDefault();
        closePalette();
        break;
    }
  }

  function updateSelection() {
    const results = resultsContainer.querySelectorAll('.palette-result');
    results.forEach((el, index) => {
      if (index === selectedIndex) {
        el.classList.add('selected');
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        el.classList.remove('selected');
      }
    });
  }

  function executeCommand(index) {
    const result = currentResults[index];
    if (!result) return;

    closePalette();

    if (result.action) {
      result.action();
    }
  }

  // ============================================
  // COMMAND ACTIONS
  // ============================================
  function navigateToSection(section) {
    const navItem = document.querySelector(`.nav-item[data-section="${section}"]`);
    if (navItem) {
      navItem.click();
    }
  }

  function openSettings() {
    const settingsBtn = document.querySelector('[data-action="settings"]');
    if (settingsBtn) settingsBtn.click();
  }

  function setTheme(theme) {
    const themeSelect = document.getElementById('color-scheme');
    if (themeSelect) {
      themeSelect.value = theme;
      themeSelect.dispatchEvent(new Event('change'));
    }
  }

  function toggleTheme() {
    const themeSelect = document.getElementById('color-scheme');
    if (themeSelect) {
      const current = themeSelect.value;
      themeSelect.value = current === 'dark' ? 'light' : 'dark';
      themeSelect.dispatchEvent(new Event('change'));
    }
  }

  function toggleDog() {
    if (window.Dog) {
      window.Dog.toggle();
    }
  }

  function toggleMatrix() {
    if (window.MatrixRain) {
      if (window.MatrixRain.isEnabled()) {
        window.MatrixRain.disable();
      } else {
        window.MatrixRain.enable();
      }
    }
  }

  function clearCache() {
    if (confirm('Clear browser cache and reload?')) {
      caches.keys().then(names => {
        return Promise.all(names.map(name => caches.delete(name)));
      }).then(() => {
        location.reload();
      });
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      if (window.Toast) {
        Toast.success('Copied to clipboard!');
      }
    });
  }

  function sharePage() {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: location.href
      }).catch(err => console.log('Share cancelled'));
    } else {
      copyToClipboard(location.href);
    }
  }

  // ============================================
  // OPEN/CLOSE PALETTE
  // ============================================
  function openPalette() {
    if (!paletteOverlay) return;

    paletteOverlay.classList.add('active');
    paletteInput.value = '';
    paletteInput.focus();
    showDefaultCommands();

    console.log('[CommandPalette] Opened');
  }

  function closePalette() {
    if (!paletteOverlay) return;

    paletteOverlay.classList.remove('active');
    paletteInput.value = '';

    console.log('[CommandPalette] Closed');
  }

  // ============================================
  // KEYBOARD SHORTCUT
  // ============================================
  function initKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openPalette();
      }
    });

    console.log('[CommandPalette] Keyboard shortcuts initialized (Cmd/Ctrl+K)');
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    // Build content index
    contentIndex = buildContentIndex();

    // Create UI
    createPaletteUI();

    // Initialize keyboard shortcuts
    initKeyboardShortcut();

    console.log('[CommandPalette] System initialized');
  }

  // ============================================
  // PUBLIC API
  // ============================================
  window.CommandPalette = {
    open: openPalette,
    close: closePalette
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

// ============================================
// STYLES
// ============================================
const paletteStyles = document.createElement('style');
paletteStyles.textContent = `
/* Command Palette Overlay */
.command-palette-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(12px);
  z-index: 10001;
  display: none;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
  animation: fadeIn 0.15s ease;
}

.command-palette-overlay.active {
  display: flex;
}

/* Command Palette Container */
.command-palette {
  width: 90%;
  max-width: 600px;
  background: var(--bg-primary, #1a1a1a);
  border: 2px solid var(--accent, #00ff00);
  border-radius: 4px;
  box-shadow: 0 8px 32px rgba(0, 255, 0, 0.3);
  animation: slideDown 0.2s ease;
}

/* Palette Header */
.palette-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--border, #333);
}

.palette-prompt {
  color: var(--accent, #00ff00);
  font-weight: 700;
  font-size: 1.2rem;
}

.palette-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text, #e0e0e0);
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  outline: none;
}

.palette-input::placeholder {
  color: var(--text-secondary, #808080);
}

.palette-shortcut {
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid var(--accent, #00ff00);
  padding: 4px 12px;
  border-radius: 2px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--accent, #00ff00);
}

/* Palette Results */
.palette-results {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
}

.palette-result {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid transparent;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.1s ease;
  margin-bottom: 4px;
}

.palette-result:hover,
.palette-result.selected {
  background: rgba(0, 255, 0, 0.1);
  border-color: var(--accent, #00ff00);
}

.result-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.result-label {
  flex: 1;
  color: var(--text, #e0e0e0);
  font-size: 0.9rem;
}

.result-key {
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid rgba(0, 255, 0, 0.3);
  padding: 2px 8px;
  border-radius: 2px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-secondary, #808080);
}

.palette-empty {
  text-align: center;
  color: var(--text-secondary, #808080);
  padding: 40px 20px;
  font-size: 0.85rem;
}

/* Palette Footer */
.palette-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--border, #333);
  background: rgba(0, 0, 0, 0.3);
}

.palette-hint {
  color: var(--text-secondary, #808080);
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.palette-hint code {
  background: rgba(0, 255, 0, 0.1);
  padding: 2px 6px;
  border-radius: 2px;
  color: var(--accent, #00ff00);
  font-family: 'JetBrains Mono', monospace;
}

/* Scrollbar */
.palette-results::-webkit-scrollbar {
  width: 8px;
}

.palette-results::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.palette-results::-webkit-scrollbar-thumb {
  background: var(--accent, #00ff00);
  border-radius: 4px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .command-palette-overlay {
    padding-top: 10vh;
  }

  .command-palette {
    width: 95%;
  }

  .palette-header {
    padding: 12px;
  }

  .palette-input {
    font-size: 0.9rem;
  }

  .palette-results {
    max-height: 50vh;
  }

  .result-label {
    font-size: 0.85rem;
  }
}
`;

document.head.appendChild(paletteStyles);
