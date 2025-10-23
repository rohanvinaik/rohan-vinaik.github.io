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
      this.storageKey = 'rohan-site-visits-v2'; // Changed to reset counter
      this.ownerIPKey = 'rohan-site-owner-ip';
      this.init();
    }

    async init() {
      // Check if this is the owner
      const isOwner = await this.checkIfOwner();

      if (isOwner) {
        console.log('[SiteStats] Owner detected - visit not counted');
      }

      const visits = this.getVisits();

      // Only increment if not owner
      if (!isOwner) {
        this.incrementVisits();
      }

      this.display(isOwner ? visits : visits + 1); // Display the new count
    }

    async checkIfOwner() {
      try {
        // Get stored owner IP (set on first page load)
        let ownerIP = localStorage.getItem(this.ownerIPKey);

        // If no owner IP stored, store current IP as owner
        if (!ownerIP) {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          ownerIP = data.ip;
          localStorage.setItem(this.ownerIPKey, ownerIP);
          console.log(`[SiteStats] Owner IP stored: ${ownerIP}`);
          return true; // First visitor is the owner
        }

        // Check if current IP matches owner IP
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const currentIP = data.ip;

        return currentIP === ownerIP;
      } catch (error) {
        console.warn('[SiteStats] Failed to check IP:', error);
        return false; // Count visit if IP check fails
      }
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
        <span class="counter-label">visits:</span>
        <span class="counter-digits">${this.formatNumber(count)}</span>
      `;

      // Add after links section (more subtle placement)
      const linksSection = document.querySelector('.links-section');
      if (linksSection) {
        // Insert after the links section
        linksSection.parentNode.insertBefore(counter, linksSection.nextSibling);
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
  // FPS COUNTER (Hidden by Default)
  // ============================================
  class FPSCounter {
    constructor() {
      this.fps = 0;
      this.frames = 0;
      this.lastTime = performance.now();
      this.element = null;
      this.animationFrame = null;
      this.visible = false;
      this.create();
      this.update();
    }

    create() {
      this.element = document.createElement('div');
      this.element.className = 'fps-counter';
      this.element.innerHTML = `
        <div class="fps-value">FPS: <span class="fps-number">--</span></div>
        <div class="fps-hint">Shift+F to toggle</div>
      `;
      document.body.appendChild(this.element);
      console.log('[SiteStats] FPS counter created (hidden)');
    }

    update() {
      this.frames++;
      const currentTime = performance.now();
      const elapsed = currentTime - this.lastTime;

      if (elapsed >= 1000) {
        this.fps = Math.round((this.frames * 1000) / elapsed);

        const fpsNumber = this.element.querySelector('.fps-number');
        if (fpsNumber) {
          fpsNumber.textContent = this.fps;

          // Color code based on performance
          if (this.fps >= 60) {
            fpsNumber.style.color = '#00ff00'; // Green - excellent
          } else if (this.fps >= 45) {
            fpsNumber.style.color = '#ffff00'; // Yellow - good
          } else if (this.fps >= 30) {
            fpsNumber.style.color = '#ff9900'; // Orange - acceptable
          } else {
            fpsNumber.style.color = '#ff0000'; // Red - poor
          }
        }

        this.frames = 0;
        this.lastTime = currentTime;
      }

      this.animationFrame = requestAnimationFrame(() => this.update());
    }

    toggle() {
      this.visible = !this.visible;
      this.element.style.display = this.visible ? 'block' : 'none';
      console.log(`[SiteStats] FPS counter ${this.visible ? 'shown' : 'hidden'}`);

      if (this.visible) {
        Toast?.info('FPS counter enabled (Shift+F to hide)', 3000);
      }
    }

    show() {
      this.visible = true;
      this.element.style.display = 'block';
    }

    hide() {
      this.visible = false;
      this.element.style.display = 'none';
    }

    destroy() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
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
    fpsCounter: null,

    init() {
      // Initialize visitor counter
      this.visitorCounter = new VisitorCounter();

      // Initialize reading time estimator
      this.readingTimeEstimator = new ReadingTimeEstimator();

      // Initialize session timer
      this.sessionTimer = new SessionTimer();

      // Initialize FPS counter (hidden by default)
      this.fpsCounter = new FPSCounter();

      // Add keyboard shortcut for FPS counter (Shift+F)
      this.initKeyboardShortcuts();

      console.log('[SiteStats] All features initialized (Shift+F for FPS counter)');
    },

    initKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // Shift+F to toggle FPS counter
        if (e.shiftKey && e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey) {
          // Don't trigger when typing in inputs
          if (e.target.matches('input, textarea')) return;

          e.preventDefault();
          if (this.fpsCounter) {
            this.fpsCounter.toggle();
          }
        }
      });
    },

    destroy() {
      if (this.sessionTimer) {
        this.sessionTimer.destroy();
      }
      if (this.fpsCounter) {
        this.fpsCounter.destroy();
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
/* Visitor Counter (Subtle styling under Links section) */
.visitor-counter {
  margin-top: calc(var(--grid-unit, 6px) * 2);
  padding: calc(var(--grid-unit, 6px) * 1.5) calc(var(--grid-unit, 6px) * 2);
  border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.05));
  font-size: 0.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: calc(var(--grid-unit, 6px));
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.visitor-counter:hover {
  opacity: 1;
}

.counter-label {
  color: var(--text-secondary, #808080);
  letter-spacing: 0.03em;
  font-size: 0.6rem;
}

.counter-digits {
  display: flex;
  gap: 1px;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-weight: 600;
}

.digit {
  display: inline-block;
  background: rgba(0, 255, 0, 0.02);
  border: 1px solid rgba(0, 255, 0, 0.15);
  padding: 1px 3px;
  color: var(--accent, #00ff00);
  opacity: 0.7;
  min-width: 8px;
  text-align: center;
  font-size: 0.6rem;
  line-height: 1;
  transition: all 0.2s ease;
}

.digit:hover {
  background: rgba(0, 255, 0, 0.05);
  border-color: rgba(0, 255, 0, 0.3);
  opacity: 1;
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

/* FPS Counter (Hidden by Default) */
.fps-counter {
  position: fixed;
  top: 40px;
  right: 12px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid var(--accent, #00ff00);
  padding: 8px 12px;
  font-family: 'JetBrains Mono', monospace;
  z-index: 9999;
  display: none;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 255, 0, 0.2);
  min-width: 100px;
}

.fps-value {
  font-size: 0.75rem;
  color: var(--text-secondary, #808080);
  margin-bottom: 4px;
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.fps-number {
  font-size: 0.9rem;
  font-weight: 700;
  color: #00ff00;
  transition: color 0.3s ease;
  min-width: 24px;
  text-align: right;
}

.fps-hint {
  font-size: 0.55rem;
  color: var(--text-secondary, #808080);
  opacity: 0.6;
  margin-top: 2px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 4px;
}

@media (max-width: 768px) {
  .fps-counter {
    top: 35px;
    right: 8px;
    padding: 6px 10px;
  }

  .fps-value {
    font-size: 0.7rem;
  }

  .fps-number {
    font-size: 0.85rem;
  }

  .fps-hint {
    font-size: 0.5rem;
  }
}
`;

document.head.appendChild(siteStatsStyles);
