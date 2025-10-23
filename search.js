/**
 * Advanced Search System
 * Full-text fuzzy search across papers, projects, skills
 * Triggered with '/' keyboard shortcut
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const config = {
    fuseOptions: {
      threshold: 0.4, // Lower = more strict, Higher = more fuzzy
      ignoreLocation: true,
      keys: [
        { name: 'title', weight: 2.0 },
        { name: 'description', weight: 1.5 },
        { name: 'tags', weight: 1.3 },
        { name: 'content', weight: 1.0 },
        { name: 'type', weight: 0.8 }
      ]
    },
    maxResults: 20
  };

  // ============================================
  // STATE
  // ============================================
  let searchIndex = [];
  let fuse = null;
  let searchOverlay = null;
  let searchInput = null;
  let resultsContainer = null;
  let selectedIndex = 0;

  // ============================================
  // BUILD SEARCH INDEX
  // ============================================
  function buildSearchIndex() {
    const index = [];

    // Index Papers
    document.querySelectorAll('.list-item').forEach(item => {
      const titleEl = item.querySelector('.list-title');
      const metaEl = item.querySelector('.list-meta');
      const linkEl = item.querySelector('.list-actions a');

      if (titleEl) {
        const tags = [];
        // Extract tags from project mapping if available
        const title = titleEl.textContent.trim();

        index.push({
          title: title,
          description: metaEl?.textContent.trim() || '',
          tags: tags,
          content: titleEl.textContent,
          type: 'paper',
          link: linkEl?.href || '#papers',
          element: item
        });
      }
    });

    // Index Projects
    document.querySelectorAll('.item').forEach(item => {
      const titleEl = item.querySelector('.item-title');
      const descEl = item.querySelector('.item-desc');
      const tagsEl = item.querySelector('.item-tags');
      const linkEl = item.querySelector('.item-actions a');

      if (titleEl) {
        const tags = tagsEl?.textContent.split('·').map(t => t.trim()) || [];

        index.push({
          title: titleEl.textContent.trim(),
          description: descEl?.textContent.trim() || '',
          tags: tags,
          content: `${titleEl.textContent} ${descEl?.textContent || ''}`,
          type: 'project',
          link: linkEl?.href || '#projects',
          element: item
        });
      }
    });

    // Index Skills
    document.querySelectorAll('.skill-item').forEach(item => {
      const nameEl = item.querySelector('.skill-name');
      const levelEl = item.querySelector('.skill-level');

      if (nameEl) {
        index.push({
          title: nameEl.textContent.trim(),
          description: `Skill level: ${levelEl?.textContent.trim() || 'N/A'}`,
          tags: ['skill'],
          content: nameEl.textContent,
          type: 'skill',
          link: '#skills',
          element: item
        });
      }
    });

    // Index Achievements
    document.querySelectorAll('.achievement-item').forEach(item => {
      const titleEl = item.querySelector('.achievement-title');
      const descEl = item.querySelector('.achievement-desc');

      if (titleEl) {
        index.push({
          title: titleEl.textContent.trim(),
          description: descEl?.textContent.trim() || '',
          tags: ['achievement'],
          content: `${titleEl.textContent} ${descEl?.textContent || ''}`,
          type: 'achievement',
          link: '#achievements',
          element: item
        });
      }
    });

    console.log(`[Search] Indexed ${index.length} items`);
    return index;
  }

  // ============================================
  // CREATE SEARCH UI
  // ============================================
  function createSearchUI() {
    // Create overlay
    searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    searchOverlay.innerHTML = `
      <div class="search-container">
        <div class="search-header">
          <input type="text" class="search-input" placeholder="Search papers, projects, skills... (ESC to close)" autofocus>
          <button class="search-close" aria-label="Close search">×</button>
        </div>
        <div class="search-results"></div>
        <div class="search-footer">
          <span class="search-hint"><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span class="search-hint"><kbd>Enter</kbd> Select</span>
          <span class="search-hint"><kbd>ESC</kbd> Close</span>
        </div>
      </div>
    `;

    document.body.appendChild(searchOverlay);

    // Get references
    searchInput = searchOverlay.querySelector('.search-input');
    resultsContainer = searchOverlay.querySelector('.search-results');
    const closeBtn = searchOverlay.querySelector('.search-close');

    // Event listeners
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('keydown', handleKeyNavigation);
    closeBtn.addEventListener('click', closeSearch);
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) closeSearch();
    });

    console.log('[Search] UI created');
  }

  // ============================================
  // SEARCH LOGIC
  // ============================================
  function handleSearch(e) {
    const query = e.target.value.trim();

    if (!query) {
      resultsContainer.innerHTML = '<div class="search-empty">Type to search...</div>';
      return;
    }

    const results = fuse.search(query, { limit: config.maxResults });

    if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="search-empty">No results found</div>';
      return;
    }

    selectedIndex = 0;
    renderResults(results);
  }

  function renderResults(results) {
    resultsContainer.innerHTML = results.map((result, index) => {
      const item = result.item;
      const typeIcon = getTypeIcon(item.type);
      const tags = item.tags.slice(0, 3).map(tag =>
        `<span class="result-tag">${tag}</span>`
      ).join('');

      return `
        <div class="search-result ${index === selectedIndex ? 'selected' : ''}" data-index="${index}" data-link="${item.link}">
          <div class="result-icon">${typeIcon}</div>
          <div class="result-content">
            <div class="result-title">${highlightMatch(item.title, searchInput.value)}</div>
            <div class="result-description">${truncate(item.description, 100)}</div>
            ${tags ? `<div class="result-tags">${tags}</div>` : ''}
          </div>
          <div class="result-type">${item.type}</div>
        </div>
      `;
    }).join('');

    // Add click handlers
    resultsContainer.querySelectorAll('.search-result').forEach(result => {
      result.addEventListener('click', () => {
        const link = result.dataset.link;
        navigateToResult(link);
      });
    });
  }

  function getTypeIcon(type) {
    const icons = {
      paper: '📄',
      project: '🚀',
      skill: '⚡',
      achievement: '🏆'
    };
    return icons[type] || '📌';
  }

  function highlightMatch(text, query) {
    if (!query) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  function truncate(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================
  function handleKeyNavigation(e) {
    const results = resultsContainer.querySelectorAll('.search-result');

    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
        updateSelection();
        break;

      case 'ArrowUp':
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        updateSelection();
        break;

      case 'Enter':
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected) {
          navigateToResult(selected.dataset.link);
        }
        break;

      case 'Escape':
        e.preventDefault();
        closeSearch();
        break;
    }
  }

  function updateSelection() {
    const results = resultsContainer.querySelectorAll('.search-result');
    results.forEach((result, index) => {
      if (index === selectedIndex) {
        result.classList.add('selected');
        result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        result.classList.remove('selected');
      }
    });
  }

  function navigateToResult(link) {
    closeSearch();

    // If internal anchor
    if (link.startsWith('#')) {
      const section = link.substring(1);
      const navItem = document.querySelector(`.nav-item[data-section="${section}"]`);
      if (navItem) {
        navItem.click();
      }
    } else {
      // External link
      window.open(link, '_blank');
    }
  }

  // ============================================
  // OPEN/CLOSE SEARCH
  // ============================================
  function openSearch() {
    if (!searchOverlay) return;

    searchOverlay.classList.add('active');
    searchInput.value = '';
    searchInput.focus();
    resultsContainer.innerHTML = '<div class="search-empty">Type to search...</div>';
    selectedIndex = 0;

    console.log('[Search] Opened');
  }

  function closeSearch() {
    if (!searchOverlay) return;

    searchOverlay.classList.remove('active');
    searchInput.value = '';

    console.log('[Search] Closed');
  }

  // ============================================
  // KEYBOARD SHORTCUT
  // ============================================
  function initKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
      // Trigger search with '/' key
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Don't trigger when typing in inputs
        if (e.target.matches('input, textarea')) return;

        e.preventDefault();
        openSearch();
      }

      // Close with ESC when search is open
      if (e.key === 'Escape' && searchOverlay?.classList.contains('active')) {
        e.preventDefault();
        closeSearch();
      }
    });

    console.log('[Search] Keyboard shortcuts initialized (press / to search)');
  }

  // ============================================
  // LOAD FUSE.JS
  // ============================================
  function loadFuse() {
    return new Promise((resolve, reject) => {
      // Check if Fuse is already loaded
      if (window.Fuse) {
        resolve(window.Fuse);
        return;
      }

      // Load from CDN
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js';
      script.onload = () => {
        console.log('[Search] Fuse.js loaded');
        resolve(window.Fuse);
      };
      script.onerror = () => {
        console.error('[Search] Failed to load Fuse.js');
        reject(new Error('Failed to load Fuse.js'));
      };
      document.head.appendChild(script);
    });
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  async function init() {
    try {
      // Load Fuse.js
      const Fuse = await loadFuse();

      // Build search index
      searchIndex = buildSearchIndex();

      // Initialize Fuse
      fuse = new Fuse(searchIndex, config.fuseOptions);

      // Create UI
      createSearchUI();

      // Initialize keyboard shortcuts
      initKeyboardShortcut();

      console.log('[Search] System initialized');

      // Show notification
      if (window.Toast) {
        Toast.info('Press / to search', 2000);
      }
    } catch (error) {
      console.error('[Search] Initialization failed:', error);
    }
  }

  // ============================================
  // PUBLIC API
  // ============================================
  window.Search = {
    open: openSearch,
    close: closeSearch,
    rebuild: () => {
      searchIndex = buildSearchIndex();
      fuse = new window.Fuse(searchIndex, config.fuseOptions);
      console.log('[Search] Index rebuilt');
    }
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
const searchStyles = document.createElement('style');
searchStyles.textContent = `
/* Search Overlay */
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: none;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
  animation: fadeIn 0.2s ease;
}

.search-overlay.active {
  display: flex;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Search Container */
.search-container {
  width: 90%;
  max-width: 700px;
  background: var(--bg-primary, #1a1a1a);
  border: 1px solid var(--accent, #00ff00);
  border-radius: 4px;
  box-shadow: 0 8px 32px rgba(0, 255, 0, 0.2);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Search Header */
.search-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--border, #333);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text, #e0e0e0);
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-secondary, #808080);
}

.search-close {
  background: transparent;
  border: 1px solid var(--border, #333);
  color: var(--text-secondary, #808080);
  font-size: 1.5rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s ease;
}

.search-close:hover {
  background: var(--accent, #00ff00);
  color: var(--bg-primary, #0a0a0a);
  border-color: var(--accent, #00ff00);
}

/* Search Results */
.search-results {
  max-height: 60vh;
  overflow-y: auto;
  padding: 8px;
}

.search-result {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 1px solid transparent;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: 4px;
}

.search-result:hover,
.search-result.selected {
  background: rgba(0, 255, 0, 0.05);
  border-color: var(--accent, #00ff00);
}

.result-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  color: var(--text, #e0e0e0);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.result-title mark {
  background: var(--accent, #00ff00);
  color: var(--bg-primary, #0a0a0a);
  padding: 0 2px;
}

.result-description {
  color: var(--text-secondary, #808080);
  font-size: 0.75rem;
  line-height: 1.4;
  margin-bottom: 6px;
}

.result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.result-tag {
  background: rgba(0, 255, 0, 0.1);
  color: var(--accent, #00ff00);
  padding: 2px 8px;
  font-size: 0.65rem;
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 2px;
}

.result-type {
  color: var(--text-secondary, #808080);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  align-self: center;
}

.search-empty {
  text-align: center;
  color: var(--text-secondary, #808080);
  padding: 40px 20px;
  font-size: 0.85rem;
}

/* Search Footer */
.search-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 12px 16px;
  border-top: 1px solid var(--border, #333);
  background: rgba(0, 0, 0, 0.3);
}

.search-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  color: var(--text-secondary, #808080);
}

.search-hint kbd {
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid var(--accent, #00ff00);
  padding: 2px 8px;
  border-radius: 2px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--accent, #00ff00);
}

/* Scrollbar for results */
.search-results::-webkit-scrollbar {
  width: 8px;
}

.search-results::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.search-results::-webkit-scrollbar-thumb {
  background: var(--accent, #00ff00);
  border-radius: 4px;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 255, 0, 0.8);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .search-overlay {
    padding-top: 5vh;
  }

  .search-container {
    width: 95%;
  }

  .search-header {
    padding: 12px;
  }

  .search-input {
    font-size: 0.9rem;
  }

  .search-results {
    max-height: 50vh;
  }

  .search-result {
    padding: 10px;
  }

  .result-icon {
    font-size: 1.2rem;
  }

  .result-title {
    font-size: 0.85rem;
  }

  .result-description {
    font-size: 0.7rem;
  }

  .search-footer {
    flex-wrap: wrap;
    gap: 10px;
  }

  .search-hint {
    font-size: 0.65rem;
  }
}
`;

document.head.appendChild(searchStyles);
