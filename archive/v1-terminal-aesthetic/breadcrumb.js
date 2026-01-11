/**
 * Breadcrumb Navigation
 * Terminal-style path showing current location
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const config = {
    username: 'rohan',
    hostname: 'personal',
    homeDir: '~',
    sections: {
      home: '',
      about: 'about',
      papers: 'papers',
      projects: 'projects',
      skills: 'skills',
      contact: 'contact',
      research: 'research/graph'
    }
  };

  // ============================================
  // STATE
  // ============================================
  let breadcrumbEl = null;
  let currentSection = 'home';
  let currentSubPath = '';

  // ============================================
  // CREATE BREADCRUMB UI
  // ============================================
  function createBreadcrumb() {
    breadcrumbEl = document.createElement('div');
    breadcrumbEl.className = 'breadcrumb-nav';
    breadcrumbEl.innerHTML = `
      <span class="breadcrumb-user">${config.username}@${config.hostname}</span>
      <span class="breadcrumb-separator">:</span>
      <span class="breadcrumb-path"></span>
      <span class="breadcrumb-cursor">_</span>
    `;

    // Insert after terminal header or at top of main content
    const terminalHeader = document.querySelector('.terminal-header');
    if (terminalHeader) {
      terminalHeader.after(breadcrumbEl);
    } else {
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.prepend(breadcrumbEl);
      }
    }

    updateBreadcrumb();
    console.log('[Breadcrumb] UI created');
  }

  // ============================================
  // UPDATE BREADCRUMB
  // ============================================
  function updateBreadcrumb() {
    // Update terminal-header's #current-path instead of breadcrumb bar
    const currentPathEl = document.getElementById('current-path');
    if (!currentPathEl) return;

    const sectionPath = config.sections[currentSection] || 'home';
    const fullPath = currentSubPath ? `${sectionPath}/${currentSubPath}` : sectionPath;

    currentPathEl.textContent = fullPath;
  }

  function animateCursor() {
    // No longer needed - terminal-header doesn't have animated cursor
  }

  // ============================================
  // SECTION DETECTION
  // ============================================
  function detectCurrentSection() {
    // Check active nav item
    const activeNav = document.querySelector('.nav-item.active');
    if (activeNav) {
      const section = activeNav.dataset.section;
      if (section && section !== currentSection) {
        currentSection = section;
        currentSubPath = '';
        updateBreadcrumb();
      }
    }
  }

  // ============================================
  // SUB-PATH DETECTION
  // ============================================
  function updateSubPath(subPath) {
    if (subPath !== currentSubPath) {
      currentSubPath = subPath;
      updateBreadcrumb();
    }
  }

  // ============================================
  // OBSERVERS
  // ============================================
  function setupObservers() {
    // Watch for navigation changes
    const observer = new MutationObserver(() => {
      detectCurrentSection();
    });

    // Observe navigation changes
    const navContainer = document.querySelector('.nav-bar');
    if (navContainer) {
      observer.observe(navContainer, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class']
      });
    }

    // Watch for section changes via URL hash
    window.addEventListener('hashchange', () => {
      detectCurrentSection();
    });

    // Watch for filter changes (papers section)
    window.addEventListener('filterChanged', (e) => {
      if (currentSection === 'papers' && e.detail?.tag) {
        updateSubPath(`filter/${e.detail.tag}`);
      } else {
        updateSubPath('');
      }
    });

    console.log('[Breadcrumb] Observers setup');
  }

  // ============================================
  // PUBLIC API
  // ============================================
  window.Breadcrumb = {
    setPath: (section, subPath = '') => {
      currentSection = section;
      currentSubPath = subPath;
      updateBreadcrumb();
    },
    setSubPath: updateSubPath
  };

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    // Breadcrumb visual bar disabled - terminal-header already shows path
    // createBreadcrumb();
    setupObservers();
    detectCurrentSection();

    console.log('[Breadcrumb] System initialized (visual bar disabled)');
  }

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
const breadcrumbStyles = document.createElement('style');
breadcrumbStyles.textContent = `
/* Breadcrumb Navigation */
.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid var(--border, #333);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  user-select: none;
}

.breadcrumb-user {
  color: var(--accent, #00ff00);
  font-weight: 600;
}

.breadcrumb-separator {
  color: var(--text-secondary, #808080);
}

.breadcrumb-path {
  color: var(--text, #e0e0e0);
  font-weight: 500;
}

.breadcrumb-cursor {
  color: var(--accent, #00ff00);
  animation: cursorBlink 1s step-start infinite;
  font-weight: 700;
}

.breadcrumb-cursor.blink {
  animation: cursorBlink 1s step-start 3;
}

@keyframes cursorBlink {
  50% {
    opacity: 0;
  }
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .breadcrumb-nav {
    font-size: 0.7rem;
    padding: 6px 12px;
  }

  .breadcrumb-user {
    display: none;
  }

  .breadcrumb-separator {
    display: none;
  }
}
`;

document.head.appendChild(breadcrumbStyles);
