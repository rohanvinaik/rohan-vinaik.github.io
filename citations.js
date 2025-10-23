/**
 * Citation Export System
 * Export papers in BibTeX, RIS, APA, MLA formats
 */

(function() {
  'use strict';

  // ============================================
  // CITATION GENERATORS
  // ============================================

  /**
   * Generate BibTeX citation
   */
  function generateBibTeX(paper) {
    const year = paper.year || new Date().getFullYear();
    const key = `${paper.author?.split(' ').pop()?.toLowerCase() || 'vinaik'}${year}${paper.title.split(' ')[0].toLowerCase()}`;

    return `@article{${key},
  title={${paper.title}},
  author={${paper.author || 'Vinaik, Rohan'}},
  year={${year}},
  ${paper.journal ? `journal={${paper.journal}},` : ''}
  ${paper.volume ? `volume={${paper.volume}},` : ''}
  ${paper.pages ? `pages={${paper.pages}},` : ''}
  ${paper.doi ? `doi={${paper.doi}},` : ''}
  url={${paper.url || window.location.href}}
}`;
  }

  /**
   * Generate RIS citation
   */
  function generateRIS(paper) {
    const year = paper.year || new Date().getFullYear();

    return `TY  - JOUR
TI  - ${paper.title}
AU  - ${paper.author || 'Vinaik, Rohan'}
PY  - ${year}
${paper.journal ? `JO  - ${paper.journal}` : ''}
${paper.volume ? `VL  - ${paper.volume}` : ''}
${paper.pages ? `SP  - ${paper.pages}` : ''}
${paper.doi ? `DO  - ${paper.doi}` : ''}
UR  - ${paper.url || window.location.href}
ER  -`;
  }

  /**
   * Generate APA citation
   */
  function generateAPA(paper) {
    const year = paper.year || new Date().getFullYear();
    const author = paper.author || 'Vinaik, R.';

    let citation = `${author} (${year}). ${paper.title}.`;

    if (paper.journal) {
      citation += ` <em>${paper.journal}</em>`;
      if (paper.volume) citation += `, ${paper.volume}`;
      if (paper.pages) citation += `, ${paper.pages}`;
      citation += '.';
    }

    if (paper.doi) {
      citation += ` https://doi.org/${paper.doi}`;
    } else if (paper.url) {
      citation += ` ${paper.url}`;
    }

    return citation;
  }

  /**
   * Generate MLA citation
   */
  function generateMLA(paper) {
    const year = paper.year || new Date().getFullYear();
    const author = paper.author || 'Vinaik, Rohan';

    let citation = `${author}. "${paper.title}."`;

    if (paper.journal) {
      citation += ` <em>${paper.journal}</em>`;
      if (paper.volume) citation += `, vol. ${paper.volume}`;
      if (paper.issue) citation += `, no. ${paper.issue}`;
      citation += `, ${year}`;
      if (paper.pages) citation += `, pp. ${paper.pages}`;
      citation += '.';
    } else {
      citation += ` ${year}.`;
    }

    if (paper.url) {
      citation += ` ${paper.url}.`;
    }

    return citation;
  }

  /**
   * Generate plain text citation
   */
  function generatePlainText(paper) {
    const year = paper.year || new Date().getFullYear();
    const author = paper.author || 'Rohan Vinaik';

    return `${author}. "${paper.title}." ${year}. ${paper.url || window.location.href}`;
  }

  // ============================================
  // COPY TO CLIPBOARD
  // ============================================
  function copyToClipboard(text) {
    return navigator.clipboard.writeText(text).then(() => {
      if (window.Toast) {
        Toast.success('Citation copied to clipboard!', 2000);
      }
      return true;
    }).catch(err => {
      console.error('[Citations] Copy failed:', err);
      if (window.Toast) {
        Toast.error('Failed to copy citation');
      }
      return false;
    });
  }

  // ============================================
  // DOWNLOAD FILE
  // ============================================
  function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (window.Toast) {
      Toast.success(`Downloaded ${filename}`, 2000);
    }
  }

  // ============================================
  // ADD CITATION BUTTONS
  // ============================================
  function addCitationButtons() {
    // Find all papers
    const paperItems = document.querySelectorAll('.list-item');

    paperItems.forEach(item => {
      const titleEl = item.querySelector('.list-title');
      const actionsEl = item.querySelector('.list-actions');

      if (!titleEl || !actionsEl) return;
      if (actionsEl.querySelector('.cite-btn')) return; // Already added

      const title = titleEl.textContent.trim();
      const linkEl = item.querySelector('.list-actions a');
      const url = linkEl?.href;

      // Extract paper metadata from DOM
      const metaEl = item.querySelector('.list-meta');
      const metaText = metaEl?.textContent || '';
      const yearMatch = metaText.match(/\d{4}/);
      const year = yearMatch ? yearMatch[0] : new Date().getFullYear();

      const paper = {
        title,
        author: 'Vinaik, Rohan',
        year,
        url
      };

      // Create cite button
      const citeBtn = document.createElement('button');
      citeBtn.className = 'cite-btn';
      citeBtn.innerHTML = '📋 cite';
      citeBtn.title = 'Export citation';

      // Create citation menu
      const citeMenu = document.createElement('div');
      citeMenu.className = 'cite-menu';
      citeMenu.innerHTML = `
        <button class="cite-option" data-format="bibtex">BibTeX</button>
        <button class="cite-option" data-format="ris">RIS</button>
        <button class="cite-option" data-format="apa">APA</button>
        <button class="cite-option" data-format="mla">MLA</button>
        <button class="cite-option" data-format="plain">Plain Text</button>
      `;

      // Toggle menu on button click
      citeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();

        // Close other menus
        document.querySelectorAll('.cite-menu.active').forEach(menu => {
          if (menu !== citeMenu) menu.classList.remove('active');
        });

        citeMenu.classList.toggle('active');
      });

      // Handle format selection
      citeMenu.querySelectorAll('.cite-option').forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();

          const format = option.dataset.format;
          handleCitationExport(paper, format);

          citeMenu.classList.remove('active');
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', () => {
        citeMenu.classList.remove('active');
      });

      // Add to DOM
      const citeWrapper = document.createElement('span');
      citeWrapper.className = 'cite-wrapper';
      citeWrapper.appendChild(citeBtn);
      citeWrapper.appendChild(citeMenu);

      actionsEl.appendChild(document.createTextNode(' · '));
      actionsEl.appendChild(citeWrapper);
    });

    console.log(`[Citations] Added citation buttons to ${paperItems.length} papers`);
  }

  // ============================================
  // HANDLE CITATION EXPORT
  // ============================================
  function handleCitationExport(paper, format) {
    let citation;
    let filename;
    let mimeType;

    switch(format) {
      case 'bibtex':
        citation = generateBibTeX(paper);
        filename = `${paper.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.bib`;
        mimeType = 'application/x-bibtex';
        break;

      case 'ris':
        citation = generateRIS(paper);
        filename = `${paper.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ris`;
        mimeType = 'application/x-research-info-systems';
        break;

      case 'apa':
        citation = generateAPA(paper);
        copyToClipboard(citation);
        return; // Don't download, just copy

      case 'mla':
        citation = generateMLA(paper);
        copyToClipboard(citation);
        return; // Don't download, just copy

      case 'plain':
        citation = generatePlainText(paper);
        copyToClipboard(citation);
        return; // Don't download, just copy

      default:
        console.error('[Citations] Unknown format:', format);
        return;
    }

    // For BibTeX and RIS, offer both copy and download
    copyToClipboard(citation).then(success => {
      if (success) {
        // Also offer download
        setTimeout(() => {
          if (confirm('Download citation file?')) {
            downloadFile(citation, filename, mimeType);
          }
        }, 500);
      }
    });
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    // Add citation buttons to existing papers
    addCitationButtons();

    // Watch for dynamically added papers
    const observer = new MutationObserver(() => {
      addCitationButtons();
    });

    const papersSection = document.querySelector('#papers, .paper-list');
    if (papersSection) {
      observer.observe(papersSection, {
        childList: true,
        subtree: true
      });
    }

    console.log('[Citations] System initialized');
  }

  // ============================================
  // PUBLIC API
  // ============================================
  window.Citations = {
    bibtex: generateBibTeX,
    ris: generateRIS,
    apa: generateAPA,
    mla: generateMLA,
    export: handleCitationExport
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
const citationStyles = document.createElement('style');
citationStyles.textContent = `
/* Citation Wrapper */
.cite-wrapper {
  position: relative;
  display: inline-block;
}

/* Citation Button */
.cite-btn {
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

.cite-btn:hover {
  border-color: var(--accent, #00ff00);
  color: var(--accent, #00ff00);
  background: rgba(0, 255, 0, 0.05);
}

/* Citation Menu */
.cite-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: var(--bg-primary, #1a1a1a);
  border: 1px solid var(--accent, #00ff00);
  border-radius: 2px;
  box-shadow: 0 4px 12px rgba(0, 255, 0, 0.2);
  z-index: 1000;
  min-width: 120px;
  display: none;
  flex-direction: column;
}

.cite-menu.active {
  display: flex;
}

.cite-option {
  background: transparent;
  border: none;
  color: var(--text, #e0e0e0);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;
  border-bottom: 1px solid var(--border, #333);
}

.cite-option:last-child {
  border-bottom: none;
}

.cite-option:hover {
  background: rgba(0, 255, 0, 0.1);
  color: var(--accent, #00ff00);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .cite-btn {
    font-size: 0.65rem;
    padding: 3px 6px;
  }

  .cite-menu {
    right: 0;
    left: auto;
  }

  .cite-option {
    font-size: 0.7rem;
    padding: 6px 10px;
  }
}
`;

document.head.appendChild(citationStyles);
