/**
 * Web Share API Integration
 * Native sharing for papers, projects, and pages
 */

(function() {
  'use strict';

  // Check if Web Share API is supported
  const isSupported = 'share' in navigator;

  // ============================================
  // SHARE FUNCTIONS
  // ============================================

  /**
   * Share current page
   */
  async function sharePage() {
    const shareData = {
      title: document.title,
      text: document.querySelector('meta[name="description"]')?.content || 'Check out my research portfolio',
      url: window.location.href
    };

    return share(shareData);
  }

  /**
   * Share a specific paper
   */
  async function sharePaper(paper) {
    const shareData = {
      title: paper.title,
      text: `Research paper: ${paper.title}`,
      url: paper.url || window.location.href
    };

    return share(shareData);
  }

  /**
   * Share a project
   */
  async function shareProject(project) {
    const shareData = {
      title: project.title,
      text: project.description || `Project: ${project.title}`,
      url: project.url || window.location.href
    };

    return share(shareData);
  }

  /**
   * Generic share function
   */
  async function share(shareData) {
    if (!isSupported) {
      // Fallback to copying URL
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(shareData.url);
          if (window.Toast) {
            Toast.info('Link copied to clipboard', 2000);
          }
          return true;
        } catch (err) {
          console.error('[WebShare] Fallback copy failed:', err);
          if (window.Toast) {
            Toast.error('Failed to copy link');
          }
          return false;
        }
      }
      return false;
    }

    try {
      await navigator.share(shareData);
      console.log('[WebShare] Shared successfully');
      return true;
    } catch (err) {
      if (err.name === 'AbortError') {
        // User cancelled, not an error
        console.log('[WebShare] Share cancelled');
      } else {
        console.error('[WebShare] Share failed:', err);
        if (window.Toast) {
          Toast.error('Share failed');
        }
      }
      return false;
    }
  }

  // ============================================
  // ADD SHARE BUTTONS
  // ============================================
  function addShareButtons() {
    // Add share buttons to papers
    document.querySelectorAll('.list-item').forEach(item => {
      const actionsEl = item.querySelector('.list-actions');
      if (!actionsEl || actionsEl.querySelector('.share-btn')) return;

      const titleEl = item.querySelector('.list-title');
      const linkEl = item.querySelector('.list-actions a');

      if (!titleEl) return;

      const paper = {
        title: titleEl.textContent.trim(),
        url: linkEl?.href
      };

      const shareBtn = document.createElement('button');
      shareBtn.className = 'share-btn';
      shareBtn.innerHTML = '📤 share';
      shareBtn.title = 'Share this paper';

      shareBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        sharePaper(paper);
      });

      actionsEl.appendChild(document.createTextNode(' · '));
      actionsEl.appendChild(shareBtn);
    });

    // Add share buttons to projects
    document.querySelectorAll('.item').forEach(item => {
      const actionsEl = item.querySelector('.item-actions');
      if (!actionsEl || actionsEl.querySelector('.share-btn')) return;

      const titleEl = item.querySelector('.item-title');
      const descEl = item.querySelector('.item-desc');
      const linkEl = item.querySelector('.item-actions a');

      if (!titleEl) return;

      const project = {
        title: titleEl.textContent.trim(),
        description: descEl?.textContent.trim(),
        url: linkEl?.href
      };

      const shareBtn = document.createElement('button');
      shareBtn.className = 'share-btn';
      shareBtn.innerHTML = '📤 share';
      shareBtn.title = 'Share this project';

      shareBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        shareProject(project);
      });

      actionsEl.appendChild(document.createTextNode(' · '));
      actionsEl.appendChild(shareBtn);
    });

    console.log(`[WebShare] Share buttons added (API ${isSupported ? 'supported' : 'not supported - using fallback'})`);
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    // Add share buttons
    addShareButtons();

    // Watch for dynamically added content
    const observer = new MutationObserver(() => {
      addShareButtons();
    });

    const contentAreas = document.querySelectorAll('.paper-list, .project-list, .section-content');
    contentAreas.forEach(area => {
      observer.observe(area, {
        childList: true,
        subtree: true
      });
    });

    console.log('[WebShare] System initialized');
  }

  // ============================================
  // PUBLIC API
  // ============================================
  window.WebShare = {
    page: sharePage,
    paper: sharePaper,
    project: shareProject,
    isSupported
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
const webShareStyles = document.createElement('style');
webShareStyles.textContent = `
/* Share Button */
.share-btn {
  background: transparent;
  border: 1px solid var(--border, #333);
  color: var(--text-secondary, #808080);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s ease;
}

.share-btn:hover {
  border-color: var(--accent, #00ff00);
  color: var(--accent, #00ff00);
  background: rgba(0, 255, 0, 0.05);
}

.share-btn:active {
  transform: scale(0.95);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .share-btn {
    font-size: 0.65rem;
    padding: 3px 6px;
  }
}
`;

document.head.appendChild(webShareStyles);
