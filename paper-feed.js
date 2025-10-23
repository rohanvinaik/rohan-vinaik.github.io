/**
 * Paper Feed System
 * Fetches and displays research papers from Cloudflare Worker
 */

class PaperFeed {
  constructor() {
    // IMPORTANT: Replace with your actual Cloudflare Worker URL
    this.apiEndpoint = 'https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev/api/papers';
    this.refreshEndpoint = 'https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev/api/refresh';

    this.initialized = false;
    this.currentFilter = 'all';
    this.currentCount = 5;

    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
    } else {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    // Filter change
    const topicFilter = document.getElementById('topic-filter');
    if (topicFilter) {
      topicFilter.addEventListener('change', (e) => {
        this.currentFilter = e.target.value;
        this.loadPapers();
      });
    }

    // Count change
    const countSelect = document.getElementById('count-select');
    if (countSelect) {
      countSelect.addEventListener('change', (e) => {
        this.currentCount = parseInt(e.target.value);
        this.loadPapers();
      });
    }

    // Refresh button
    const refreshBtn = document.getElementById('refresh-papers');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refresh());
    }

    // Load papers when section becomes active
    this.observeSectionActivation();
  }

  observeSectionActivation() {
    const section = document.getElementById('section-paper-feed');
    if (!section) return;

    // Use MutationObserver to detect when section becomes active
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (section.classList.contains('active') && !this.initialized) {
            this.initialized = true;
            this.loadPapers();
          }
        }
      });
    });

    observer.observe(section, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Also check if already active
    if (section.classList.contains('active') && !this.initialized) {
      this.initialized = true;
      this.loadPapers();
    }
  }

  async loadPapers() {
    const container = document.getElementById('papers-container');
    if (!container) return;

    // Show loading state
    this.showLoading(container);

    try {
      const url = `${this.apiEndpoint}?filter=${this.currentFilter}&count=${this.currentCount}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        this.showError(container, data.error);
        return;
      }

      // Update metadata
      this.updateMetadata(data.updated, data.total);

      // Display papers
      this.displayPapers(data.papers, container);

      // Hide status
      this.hideStatus();

    } catch (error) {
      console.error('Failed to load papers:', error);
      this.showError(container, `Failed to load papers: ${error.message}`);
      this.showStatus(`Error: ${error.message}`, 'error');
    }
  }

  async refresh() {
    const btn = document.getElementById('refresh-papers');
    if (!btn) return;

    const originalText = btn.textContent;
    btn.textContent = '⏳ REFRESHING...';
    btn.disabled = true;

    this.showStatus('Refreshing paper feed from APIs...', 'info');

    try {
      const response = await fetch(this.refreshEndpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Wait a moment, then reload papers
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.loadPapers();

      btn.textContent = '✓ REFRESHED';
      this.showStatus('Successfully refreshed paper feed!', 'success');

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        this.hideStatus();
      }, 2000);

    } catch (error) {
      console.error('Failed to refresh papers:', error);
      btn.textContent = '✗ FAILED';
      this.showStatus(`Refresh failed: ${error.message}`, 'error');

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2000);
    }
  }

  showLoading(container) {
    container.innerHTML = `
      <div class="loading-state" style="text-align: center; padding: 40px; color: var(--text-secondary); font-size: 0.85rem;">
        <div style="margin-bottom: 12px;">⏳ Loading papers...</div>
        <div style="font-size: 0.75rem;">Filter: ${this.currentFilter === 'all' ? 'All Topics' : this.getFilterLabel(this.currentFilter)}</div>
      </div>
    `;
  }

  showError(container, message) {
    container.innerHTML = `
      <div class="error-state" style="text-align: center; padding: 40px; color: var(--text-secondary); font-size: 0.85rem; border: 1px solid var(--border); background: var(--code-bg);">
        <div style="margin-bottom: 12px; color: #ff4444;">✗ Error</div>
        <div style="font-size: 0.75rem;">${this.escapeHtml(message)}</div>
        <div style="margin-top: 16px; font-size: 0.75rem;">
          <button onclick="window.paperFeed.loadPapers()" style="background: var(--accent); color: var(--bg); border: none; padding: 8px 16px; font-family: 'JetBrains Mono', monospace; cursor: pointer;">
            TRY AGAIN
          </button>
        </div>
      </div>
    `;
  }

  displayPapers(papers, container) {
    if (!papers || papers.length === 0) {
      container.innerHTML = `
        <div class="info-state" style="text-align: center; padding: 40px; color: var(--text-secondary); font-size: 0.85rem; border: 1px solid var(--border); background: var(--code-bg);">
          <div style="margin-bottom: 12px;">📭 No papers found</div>
          <div style="font-size: 0.75rem;">Try a different filter or refresh the feed</div>
        </div>
      `;
      return;
    }

    const papersHtml = papers.map(paper => this.renderPaper(paper)).join('');
    container.innerHTML = papersHtml;
  }

  renderPaper(paper) {
    const publishedDate = new Date(paper.published);
    const daysAgo = Math.floor((Date.now() - publishedDate) / (1000 * 60 * 60 * 24));
    const dateStr = daysAgo === 0 ? 'Today' :
                    daysAgo === 1 ? 'Yesterday' :
                    daysAgo < 7 ? `${daysAgo} days ago` :
                    publishedDate.toLocaleDateString();

    const authorStr = paper.authors && paper.authors.length > 0
      ? paper.authors.slice(0, 3).join(', ') + (paper.authors.length > 3 ? ' et al.' : '')
      : 'Unknown';

    const scoreIndicator = paper.score >= 15 ? '★★★ ' :
                          paper.score >= 10 ? '★★ ' :
                          paper.score >= 5 ? '★ ' : '';

    return `
      <div class="list-item" style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--border);">
        <div class="list-title" style="font-size: 0.9rem; margin-bottom: 8px; line-height: 1.4;">
          ${scoreIndicator}${this.escapeHtml(paper.title)}
        </div>
        <div class="list-meta" style="font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 8px;">
          [${paper.source.toUpperCase()}] · ${dateStr} · ${this.escapeHtml(authorStr)}
        </div>
        <div class="list-desc" style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.6;">
          ${this.escapeHtml(paper.abstract)}
        </div>
        ${this.renderTopics(paper.topics)}
        <div class="list-actions" style="font-size: 0.75rem; margin-top: 8px;">
          <a href="${this.escapeHtml(paper.url)}" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: none; border-bottom: 1px dotted var(--accent);">> read paper</a>
          ${paper.pdf_url ? `<span style="color: var(--text-secondary); margin: 0 8px;">|</span><a href="${this.escapeHtml(paper.pdf_url)}" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: none; border-bottom: 1px dotted var(--accent);">> pdf</a>` : ''}
          ${paper.score ? `<span style="color: var(--text-secondary); margin: 0 8px;">|</span><span style="color: var(--text-secondary);">relevance: ${paper.score}</span>` : ''}
        </div>
      </div>
    `;
  }

  renderTopics(topics) {
    if (!topics || topics.length === 0) return '';

    const topicsHtml = topics.slice(0, 5).map(topic =>
      `<span class="tag" style="background: var(--code-bg); padding: 3px 8px; border: 1px solid var(--border); font-size: 0.65rem; color: var(--accent); margin-right: 6px; display: inline-block; margin-bottom: 4px;">${this.escapeHtml(topic)}</span>`
    ).join('');

    return `<div class="list-tags" style="margin-bottom: 8px;">${topicsHtml}</div>`;
  }

  updateMetadata(updated, total) {
    const lastUpdatedEl = document.getElementById('last-updated');
    const totalPapersEl = document.getElementById('total-papers');

    if (lastUpdatedEl && updated) {
      const date = new Date(updated);
      lastUpdatedEl.textContent = date.toLocaleString();
    }

    if (totalPapersEl && total !== undefined) {
      totalPapersEl.textContent = total;
    }
  }

  showStatus(message, type = 'info') {
    const statusEl = document.getElementById('feed-status');
    const messageEl = document.getElementById('status-message');

    if (statusEl && messageEl) {
      messageEl.textContent = message;
      statusEl.style.display = 'block';

      // Color based on type
      if (type === 'error') {
        statusEl.style.borderColor = '#ff4444';
        statusEl.style.color = '#ff4444';
      } else if (type === 'success') {
        statusEl.style.borderColor = 'var(--accent)';
        statusEl.style.color = 'var(--accent)';
      } else {
        statusEl.style.borderColor = 'var(--border)';
        statusEl.style.color = 'var(--text-secondary)';
      }
    }
  }

  hideStatus() {
    const statusEl = document.getElementById('feed-status');
    if (statusEl) {
      setTimeout(() => {
        statusEl.style.display = 'none';
      }, 3000);
    }
  }

  getFilterLabel(filter) {
    const labels = {
      'hdc': 'Hyperdimensional Computing',
      'genomics': 'Genomics & Privacy',
      'ai-security': 'AI Security & Verification',
      'tda': 'Topological Data Analysis',
      'theory': 'Theoretical Foundations',
      'bio-computing': 'Biological Computing'
    };
    return labels[filter] || filter;
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize paper feed when script loads
// Store instance globally for access from error buttons
window.paperFeed = new PaperFeed();
