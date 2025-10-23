/**
 * Reading Progress & Bookmarks System
 * Track reading progress and bookmark papers/projects
 */

(function() {
  'use strict';

  // ============================================
  // STORAGE KEYS
  // ============================================
  const STORAGE_KEYS = {
    bookmarks: 'rohan-bookmarks',
    readingProgress: 'rohan-reading-progress',
    lastVisited: 'rohan-last-visited',
    preferences: 'rohan-preferences'
  };

  // ============================================
  // STATE
  // ============================================
  let bookmarks = [];
  let readingProgress = {};
  let lastVisited = {};

  // ============================================
  // STORAGE FUNCTIONS
  // ============================================
  function loadFromStorage() {
    try {
      bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEYS.bookmarks) || '[]');
      readingProgress = JSON.parse(localStorage.getItem(STORAGE_KEYS.readingProgress) || '{}');
      lastVisited = JSON.parse(localStorage.getItem(STORAGE_KEYS.lastVisited) || '{}');

      console.log(`[ReadingProgress] Loaded ${bookmarks.length} bookmarks`);
    } catch (err) {
      console.error('[ReadingProgress] Failed to load from storage:', err);
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
      localStorage.setItem(STORAGE_KEYS.readingProgress, JSON.stringify(readingProgress));
      localStorage.setItem(STORAGE_KEYS.lastVisited, JSON.stringify(lastVisited));
    } catch (err) {
      console.error('[ReadingProgress] Failed to save to storage:', err);
    }
  }

  // ============================================
  // BOOKMARK FUNCTIONS
  // ============================================
  function isBookmarked(id) {
    return bookmarks.some(b => b.id === id);
  }

  function addBookmark(item) {
    if (isBookmarked(item.id)) return;

    bookmarks.push({
      id: item.id,
      title: item.title,
      type: item.type,
      url: item.url,
      timestamp: Date.now()
    });

    saveToStorage();

    if (window.Toast) {
      Toast.success('Bookmarked!', 1500);
    }

    updateUI();
  }

  function removeBookmark(id) {
    bookmarks = bookmarks.filter(b => b.id !== id);
    saveToStorage();

    if (window.Toast) {
      Toast.info('Bookmark removed', 1500);
    }

    updateUI();
  }

  function toggleBookmark(item) {
    if (isBookmarked(item.id)) {
      removeBookmark(item.id);
    } else {
      addBookmark(item);
    }
  }

  // ============================================
  // READING PROGRESS
  // ============================================
  function trackReadingProgress(id, progress) {
    readingProgress[id] = {
      progress: Math.round(progress),
      timestamp: Date.now()
    };

    saveToStorage();
  }

  function getReadingProgress(id) {
    return readingProgress[id]?.progress || 0;
  }

  function trackLastVisited(id, title, type) {
    lastVisited[id] = {
      title,
      type,
      timestamp: Date.now()
    };

    saveToStorage();
  }

  function getRecentlyVisited(limit = 5) {
    return Object.entries(lastVisited)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // ============================================
  // UI FUNCTIONS
  // ============================================
  function addBookmarkButtons() {
    // Add to papers
    document.querySelectorAll('.list-item').forEach(item => {
      const actionsEl = item.querySelector('.list-actions');
      if (!actionsEl || actionsEl.querySelector('.bookmark-btn')) return;

      const titleEl = item.querySelector('.list-title');
      const linkEl = item.querySelector('.list-actions a');

      if (!titleEl) return;

      const id = `paper-${titleEl.textContent.trim().replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
      const itemData = {
        id,
        title: titleEl.textContent.trim(),
        type: 'paper',
        url: linkEl?.href
      };

      const bookmarkBtn = document.createElement('button');
      bookmarkBtn.className = 'bookmark-btn';
      bookmarkBtn.innerHTML = isBookmarked(id) ? '★' : '☆';
      bookmarkBtn.title = isBookmarked(id) ? 'Remove bookmark' : 'Bookmark this';

      bookmarkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(itemData);
        bookmarkBtn.innerHTML = isBookmarked(id) ? '★' : '☆';
        bookmarkBtn.title = isBookmarked(id) ? 'Remove bookmark' : 'Bookmark this';
      });

      // Track visit on click
      linkEl?.addEventListener('click', () => {
        trackLastVisited(id, itemData.title, itemData.type);
      });

      actionsEl.appendChild(document.createTextNode(' · '));
      actionsEl.appendChild(bookmarkBtn);
    });

    // Add to projects
    document.querySelectorAll('.item').forEach(item => {
      const actionsEl = item.querySelector('.item-actions');
      if (!actionsEl || actionsEl.querySelector('.bookmark-btn')) return;

      const titleEl = item.querySelector('.item-title');
      const linkEl = item.querySelector('.item-actions a');

      if (!titleEl) return;

      const id = `project-${titleEl.textContent.trim().replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
      const itemData = {
        id,
        title: titleEl.textContent.trim(),
        type: 'project',
        url: linkEl?.href
      };

      const bookmarkBtn = document.createElement('button');
      bookmarkBtn.className = 'bookmark-btn';
      bookmarkBtn.innerHTML = isBookmarked(id) ? '★' : '☆';
      bookmarkBtn.title = isBookmarked(id) ? 'Remove bookmark' : 'Bookmark this';

      bookmarkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(itemData);
        bookmarkBtn.innerHTML = isBookmarked(id) ? '★' : '☆';
        bookmarkBtn.title = isBookmarked(id) ? 'Remove bookmark' : 'Bookmark this';
      });

      linkEl?.addEventListener('click', () => {
        trackLastVisited(id, itemData.title, itemData.type);
      });

      actionsEl.appendChild(document.createTextNode(' · '));
      actionsEl.appendChild(bookmarkBtn);
    });
  }

  function updateUI() {
    // Update all bookmark button states
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
      const id = btn.closest('.list-item, .item')?.querySelector('.list-title, .item-title')
        ?.textContent.trim().replace(/[^a-z0-9]/gi, '-').toLowerCase();
      const type = btn.closest('.list-item') ? 'paper' : 'project';
      const fullId = `${type}-${id}`;

      btn.innerHTML = isBookmarked(fullId) ? '★' : '☆';
      btn.title = isBookmarked(fullId) ? 'Remove bookmark' : 'Bookmark this';
    });
  }

  // ============================================
  // CONTINUE WHERE YOU LEFT OFF
  // ============================================
  function showContinuePrompt() {
    const recent = getRecentlyVisited(1)[0];

    if (recent && (Date.now() - recent.timestamp) < 86400000) { // Within 24 hours
      if (window.Toast) {
        Toast.info(`Continue: ${recent.title}`, 5000);
      }
    }
  }

  // ============================================
  // SCROLL TRACKING FOR PAPERS
  // ============================================
  function trackScrollProgress() {
    // Only track on individual paper pages
    if (!window.location.pathname.includes('/papers/')) return;

    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / docHeight) * 100;

    const pageId = window.location.pathname;
    trackReadingProgress(pageId, progress);
  }

  // ============================================
  // PUBLIC API
  // ============================================
  window.ReadingProgress = {
    bookmark: addBookmark,
    unbookmark: removeBookmark,
    isBookmarked,
    getBookmarks: () => bookmarks,
    getRecentlyVisited,
    trackProgress: trackReadingProgress,
    getProgress: getReadingProgress
  };

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    loadFromStorage();
    addBookmarkButtons();

    // Watch for dynamically added content
    const observer = new MutationObserver(() => {
      addBookmarkButtons();
    });

    const contentAreas = document.querySelectorAll('.paper-list, .project-list, .section-content');
    contentAreas.forEach(area => {
      observer.observe(area, {
        childList: true,
        subtree: true
      });
    });

    // Track scroll progress on paper pages
    if (window.location.pathname.includes('/papers/')) {
      let scrollTimeout;
      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(trackScrollProgress, 500);
      }, { passive: true });
    }

    // Show continue prompt
    setTimeout(showContinuePrompt, 2000);

    console.log('[ReadingProgress] System initialized');
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
const readingProgressStyles = document.createElement('style');
readingProgressStyles.textContent = `
/* Bookmark Button */
.bookmark-btn {
  background: transparent;
  border: 1px solid var(--border, #333);
  color: var(--accent, #00ff00);
  font-size: 1rem;
  padding: 2px 8px;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s ease;
  line-height: 1;
}

.bookmark-btn:hover {
  border-color: var(--accent, #00ff00);
  background: rgba(0, 255, 0, 0.1);
  transform: scale(1.1);
}

.bookmark-btn:active {
  transform: scale(0.95);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .bookmark-btn {
    font-size: 0.9rem;
    padding: 2px 6px;
  }
}
`;

document.head.appendChild(readingProgressStyles);
