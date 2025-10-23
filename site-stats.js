/**
 * Site Statistics & Retro Features
 * Visitor counter, reading time estimator, session duration tracker
 */

(function() {
  'use strict';

  // ============================================
  // RETRO VISITOR COUNTER
  // ============================================
  class VisitorCounter {
    constructor() {
      this.storageKey = 'rohan-site-visits';
      this.init();
    }

    init() {
      const visits = this.getVisits();
      this.incrementVisits();
      this.display(visits + 1); // Display the new count
    }

    getVisits() {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? parseInt(stored) : 0;
    }

    incrementVisits() {
      const visits = this.getVisits() + 1;
      localStorage.setItem(this.storageKey, visits);
    }

    display(count) {
      const counter = document.createElement('div');
      counter.className = 'visitor-counter';
      counter.innerHTML = `
        <span class="counter-label">SITE_VISITS:</span>
        <span class="counter-digits">${this.formatNumber(count)}</span>
      `;

      // Add to status section
      const statusSection = document.querySelector('.status-section');
      if (statusSection) {
        statusSection.appendChild(counter);
        console.log(`[SiteStats] Visitor counter initialized: ${count} visits`);
      }
    }

    formatNumber(num) {
      // Retro digital display style with individual digit boxes
      return num.toString().padStart(6, '0').split('').map(d =>
        `<span class="digit">${d}</span>`
      ).join('');
    }
  }

  // ============================================
  // READING TIME ESTIMATOR
  // ============================================
  class ReadingTimeEstimator {
    constructor() {
      this.wordsPerMinute = 200; // Average reading speed
      this.init();
    }

    init() {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.addReadingTimes());
      } else {
        this.addReadingTimes();
      }
    }

    addReadingTimes() {
      const items = document.querySelectorAll('.list-item');
      let addedCount = 0;

      items.forEach(item => {
        const title = item.querySelector('.list-title');
        if (!title) return;

        // Estimate based on typical paper length
        const titleLength = title.textContent.length;
        const estimatedWords = this.estimateWordCount(titleLength);
        const readingTime = Math.ceil(estimatedWords / this.wordsPerMinute);

        const timeIndicator = this.createTimeIndicator(readingTime);

        const metaSection = item.querySelector('.list-meta');
        if (metaSection && !metaSection.querySelector('.reading-time')) {
          metaSection.innerHTML += ` · ${timeIndicator}`;
          addedCount++;
        }
      });

      if (addedCount > 0) {
        console.log(`[SiteStats] Added reading times to ${addedCount} papers`);
      }
    }

    estimateWordCount(titleLength) {
      // Heuristic: longer titles often indicate more detailed papers
      if (titleLength > 100) return 5000;      // Long/detailed title
      if (titleLength > 60) return 4000;       // Medium detailed
      if (titleLength > 40) return 3500;       // Standard paper
      return 3000;                              // Short/concise
    }

    createTimeIndicator(minutes) {
      return `<span class="reading-time"><span class="reading-icon">📖</span> ${minutes} min</span>`;
    }
  }

  // ============================================
  // SESSION DURATION TRACKER
  // ============================================
  class SessionTimer {
    constructor() {
      this.startTime = Date.now();
      this.element = null;
      this.updateInterval = null;
      this.init();
    }

    init() {
      // Wait for DOM
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.create());
      } else {
        this.create();
      }
    }

    create() {
      this.element = document.createElement('span');
      this.element.className = 'session-timer';

      const systemInfo = document.querySelector('.system-info');
      if (systemInfo) {
        // Add separator before timer
        const separator = document.createElement('span');
        separator.className = 'separator';
        separator.textContent = '|';
        systemInfo.appendChild(separator);

        systemInfo.appendChild(this.element);
        this.startUpdating();
        console.log('[SiteStats] Session timer initialized');
      }
    }

    startUpdating() {
      // Update immediately
      this.update();

      // Then update every second
      this.updateInterval = setInterval(() => this.update(), 1000);

      // Clean up on page unload
      window.addEventListener('beforeunload', () => {
        if (this.updateInterval) {
          clearInterval(this.updateInterval);
        }
      });
    }

    update() {
      if (!this.element) return;

      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const seconds = elapsed % 60;

      // Format: session: 0:05:23 or session: 1:23:45
      let timeString;
      if (hours > 0) {
        timeString = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }

      this.element.textContent = `session: ${timeString}`;
    }

    destroy() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }
    }
  }

  // ============================================
  // INITIALIZE ALL FEATURES
  // ============================================
  window.SiteStats = {
    visitorCounter: null,
    readingTimeEstimator: null,
    sessionTimer: null,

    init() {
      // Initialize visitor counter
      this.visitorCounter = new VisitorCounter();

      // Initialize reading time estimator
      this.readingTimeEstimator = new ReadingTimeEstimator();

      // Initialize session timer
      this.sessionTimer = new SessionTimer();

      console.log('[SiteStats] All features initialized');
    },

    destroy() {
      if (this.sessionTimer) {
        this.sessionTimer.destroy();
      }
    }
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.SiteStats.init());
  } else {
    window.SiteStats.init();
  }

})();

// ============================================
// STYLES
// ============================================
const siteStatsStyles = document.createElement('style');
siteStatsStyles.textContent = `
/* Visitor Counter */
.visitor-counter {
  margin-top: calc(var(--grid-unit, 6px) * 2);
  padding-top: calc(var(--grid-unit, 6px) * 1.5);
  border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  font-size: 0.65rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: calc(var(--grid-unit, 6px));
}

.counter-label {
  color: var(--text-secondary, #808080);
  letter-spacing: 0.05em;
}

.counter-digits {
  display: flex;
  gap: 2px;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-weight: 700;
}

.digit {
  display: inline-block;
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid rgba(0, 255, 0, 0.3);
  padding: 2px 4px;
  color: var(--accent, #00ff00);
  min-width: 10px;
  text-align: center;
  font-size: 0.7rem;
  line-height: 1;
  transition: all 0.2s ease;
}

.digit:hover {
  background: rgba(0, 255, 0, 0.1);
  border-color: rgba(0, 255, 0, 0.5);
  box-shadow: 0 0 4px rgba(0, 255, 0, 0.3);
}

/* Reading Time Indicator */
.reading-time {
  color: var(--text-secondary, #808080);
  font-size: 0.6rem;
  white-space: nowrap;
}

.reading-icon {
  font-size: 0.75em;
  opacity: 0.8;
}

/* Session Timer */
.session-timer {
  color: var(--text-secondary, #808080);
  font-size: 0.7rem;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.02em;
  user-select: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .visitor-counter {
    font-size: 0.6rem;
  }

  .digit {
    padding: 1px 3px;
    font-size: 0.65rem;
    min-width: 8px;
  }

  .reading-time {
    font-size: 0.55rem;
  }

  .session-timer {
    font-size: 0.65rem;
  }
}

/* Animation for visitor counter digits (optional polish) */
@keyframes digitPop {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.digit.updated {
  animation: digitPop 0.3s ease;
}
`;

document.head.appendChild(siteStatsStyles);
