/**
 * Keyboard Shortcuts System
 * Provides fast navigation for power users
 */

(function() {
  'use strict';

  // Shortcut mappings
  const shortcuts = {
    'h': { section: 'home', description: 'Home' },
    'a': { section: 'about', description: 'About' },
    'c': { section: 'contact', description: 'Contact' },
    't': { section: 'timeline', description: 'Timeline' },
    'r': { section: 'research-graph', description: 'Research Graph' },
    'p': { section: 'papers', description: 'Papers' },
    's': { section: 'skills', description: 'Skills' },
    'w': { section: 'reference', description: 'Reference/Wiki' },
    'u': { section: 'tools', description: 'Tools' },
    'f': { section: 'paper-feed', description: 'Paper Feed' },
    '/': { action: 'toggle-terminal', description: 'Toggle Terminal' },
    '?': { action: 'show-shortcuts', description: 'Show Shortcuts' },
    'Escape': { action: 'close-modal', description: 'Close Modal' }
  };

  // Track if shortcuts modal is showing
  let shortcutsModalOpen = false;

  // Handle keyboard events
  document.addEventListener('keydown', (e) => {
    // Don't trigger when typing in inputs or modals
    if (e.target.matches('input, textarea')) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const shortcut = shortcuts[e.key];
    if (!shortcut) return;

    e.preventDefault();

    if (shortcut.section) {
      navigateToSection(shortcut.section);
    } else if (shortcut.action === 'toggle-terminal') {
      toggleTerminal();
    } else if (shortcut.action === 'show-shortcuts') {
      showShortcutsModal();
    } else if (shortcut.action === 'close-modal') {
      closeShortcutsModal();
    }
  });

  /**
   * Navigate to a specific section
   */
  function navigateToSection(sectionName) {
    const navItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (navItem) {
      navItem.click();
      console.log(`Keyboard shortcut: Navigated to ${sectionName}`);
    }
  }

  /**
   * Toggle terminal visibility
   */
  function toggleTerminal() {
    const terminalOverlay = document.getElementById('terminal-overlay');
    if (terminalOverlay) {
      const isVisible = terminalOverlay.classList.contains('active');
      if (isVisible) {
        terminalOverlay.classList.remove('active');
      } else {
        terminalOverlay.classList.add('active');
        // Focus terminal input
        const terminalInput = document.getElementById('terminal-input');
        if (terminalInput) {
          setTimeout(() => terminalInput.focus(), 100);
        }
      }
    }
  }

  /**
   * Show keyboard shortcuts modal
   */
  function showShortcutsModal() {
    if (shortcutsModalOpen) return;

    const modal = document.createElement('div');
    modal.id = 'shortcuts-modal';
    modal.className = 'shortcuts-modal';
    modal.innerHTML = `
      <div class="shortcuts-content">
        <div class="shortcuts-header">
          <h3>⌨️ KEYBOARD SHORTCUTS</h3>
          <button class="shortcuts-close" onclick="this.closest('.shortcuts-modal').remove()">&times;</button>
        </div>

        <div class="shortcuts-section">
          <h4>Navigation</h4>
          <div class="shortcuts-grid">
            <div class="shortcut-item">
              <kbd>H</kbd>
              <span>Home</span>
            </div>
            <div class="shortcut-item">
              <kbd>A</kbd>
              <span>About</span>
            </div>
            <div class="shortcut-item">
              <kbd>C</kbd>
              <span>Contact</span>
            </div>
            <div class="shortcut-item">
              <kbd>T</kbd>
              <span>Timeline</span>
            </div>
            <div class="shortcut-item">
              <kbd>R</kbd>
              <span>Research Graph</span>
            </div>
            <div class="shortcut-item">
              <kbd>P</kbd>
              <span>Papers</span>
            </div>
            <div class="shortcut-item">
              <kbd>S</kbd>
              <span>Skills</span>
            </div>
            <div class="shortcut-item">
              <kbd>W</kbd>
              <span>Reference/Wiki</span>
            </div>
            <div class="shortcut-item">
              <kbd>U</kbd>
              <span>Tools</span>
            </div>
            <div class="shortcut-item">
              <kbd>F</kbd>
              <span>Paper Feed</span>
            </div>
          </div>
        </div>

        <div class="shortcuts-section">
          <h4>Actions</h4>
          <div class="shortcuts-grid">
            <div class="shortcut-item">
              <kbd>/</kbd>
              <span>Toggle Terminal</span>
            </div>
            <div class="shortcut-item">
              <kbd>?</kbd>
              <span>Show Shortcuts</span>
            </div>
            <div class="shortcut-item">
              <kbd>Esc</kbd>
              <span>Close Modal</span>
            </div>
          </div>
        </div>

        <div class="shortcuts-footer">
          Press <kbd>?</kbd> at any time to see these shortcuts
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    shortcutsModalOpen = true;

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeShortcutsModal();
      }
    });

    // Animate in
    requestAnimationFrame(() => {
      modal.style.opacity = '1';
      modal.querySelector('.shortcuts-content').style.transform = 'scale(1)';
    });
  }

  /**
   * Close keyboard shortcuts modal
   */
  function closeShortcutsModal() {
    const modal = document.getElementById('shortcuts-modal');
    if (!modal) return;

    modal.style.opacity = '0';
    modal.querySelector('.shortcuts-content').style.transform = 'scale(0.95)';

    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
      shortcutsModalOpen = false;
    }, 300);
  }

  // Show shortcuts hint on first visit
  function showShortcutsHint() {
    const hasSeenHint = localStorage.getItem('keyboard-shortcuts-hint-shown');
    if (hasSeenHint) return;

    setTimeout(() => {
      const hint = document.createElement('div');
      hint.className = 'shortcuts-hint';
      hint.innerHTML = `
        <div class="shortcuts-hint-content">
          💡 Press <kbd>?</kbd> to see keyboard shortcuts
          <button onclick="this.closest('.shortcuts-hint').remove()">&times;</button>
        </div>
      `;
      document.body.appendChild(hint);

      localStorage.setItem('keyboard-shortcuts-hint-shown', 'true');

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        if (hint.parentNode) {
          hint.style.opacity = '0';
          setTimeout(() => hint.remove(), 300);
        }
      }, 5000);
    }, 2000);
  }

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showShortcutsHint);
  } else {
    showShortcutsHint();
  }

  // Export for debugging
  window.KeyboardShortcuts = {
    show: showShortcutsModal,
    shortcuts: shortcuts
  };

})();

// Add keyboard shortcuts styles
const shortcutsStyles = document.createElement('style');
shortcutsStyles.textContent = `
/* Shortcuts Modal */
.shortcuts-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(8px);
}

.shortcuts-content {
  background: var(--bg-secondary, #1a1a1a);
  border: 2px solid var(--accent, #00ffff);
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 4px;
  transform: scale(0.95);
  transition: transform 0.3s ease;
  box-shadow: 0 20px 60px rgba(0, 255, 255, 0.3);
}

.shortcuts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
}

.shortcuts-header h3 {
  color: var(--accent, #00ffff);
  margin: 0;
  font-size: 1.3rem;
  letter-spacing: 0.05em;
}

.shortcuts-close {
  background: none;
  border: none;
  color: var(--text-secondary, #808080);
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, transform 0.2s ease;
  line-height: 1;
}

.shortcuts-close:hover {
  color: var(--accent, #00ffff);
  transform: rotate(90deg);
}

.shortcuts-section {
  margin-bottom: 2rem;
}

.shortcuts-section h4 {
  color: var(--text-primary, #e0e0e0);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.8;
}

.shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-secondary, #808080);
}

kbd {
  display: inline-block;
  padding: 6px 10px;
  background: var(--bg-primary, #0a0a0a);
  border: 1px solid var(--accent, #00ffff);
  border-radius: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  color: var(--accent, #00ffff);
  font-size: 0.75rem;
  min-width: 32px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 255, 255, 0.2);
}

.shortcuts-footer {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-secondary, #808080);
}

/* Shortcuts Hint */
.shortcuts-hint {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--bg-secondary, #1a1a1a);
  border: 1px solid var(--accent, #00ffff);
  padding: 1rem 1.5rem;
  border-radius: 4px;
  z-index: 9999;
  opacity: 1;
  transition: opacity 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 255, 255, 0.3);
}

.shortcuts-hint-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-primary, #e0e0e0);
}

.shortcuts-hint-content button {
  background: none;
  border: none;
  color: var(--text-secondary, #808080);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  transition: color 0.2s ease;
}

.shortcuts-hint-content button:hover {
  color: var(--accent, #00ffff);
}

/* Responsive */
@media (max-width: 768px) {
  .shortcuts-content {
    padding: 1.5rem;
    width: 95%;
  }

  .shortcuts-grid {
    grid-template-columns: 1fr;
  }

  .shortcuts-hint {
    bottom: 10px;
    right: 10px;
    left: 10px;
    padding: 0.75rem 1rem;
  }

  .shortcuts-hint-content {
    font-size: 0.75rem;
  }
}

/* Smooth scrollbar for modal */
.shortcuts-content::-webkit-scrollbar {
  width: 8px;
}

.shortcuts-content::-webkit-scrollbar-track {
  background: var(--bg-primary, #0a0a0a);
}

.shortcuts-content::-webkit-scrollbar-thumb {
  background: var(--accent, #00ffff);
  border-radius: 4px;
}

.shortcuts-content::-webkit-scrollbar-thumb:hover {
  background: var(--accent-dim, #00aaaa);
}
`;

document.head.appendChild(shortcutsStyles);
