/**
 * Loading Indicator Component
 * Provides visual feedback during heavy operations
 */

const LoadingIndicator = {
  overlay: null,

  /**
   * Show loading overlay with message
   * @param {string} message - Loading message to display
   */
  show(message = 'Loading...') {
    // Don't create duplicate overlays
    if (this.overlay) return;

    this.overlay = document.createElement('div');
    this.overlay.id = 'loading-overlay';
    this.overlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner">
          <span>▓</span><span>▒</span><span>░</span>
        </div>
        <div class="loading-text">${message}</div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    // Trigger animation
    requestAnimationFrame(() => {
      this.overlay.style.opacity = '1';
    });
  },

  /**
   * Hide loading overlay with fade out
   */
  hide() {
    if (!this.overlay) return;

    this.overlay.style.opacity = '0';

    setTimeout(() => {
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }
      this.overlay = null;
    }, 300);
  },

  /**
   * Update loading message without recreating overlay
   * @param {string} message - New message
   */
  updateMessage(message) {
    if (!this.overlay) return;

    const textElement = this.overlay.querySelector('.loading-text');
    if (textElement) {
      textElement.textContent = message;
    }
  }
};

// Add loading indicator styles
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
#loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 10, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);
}

.loading-content {
  text-align: center;
  user-select: none;
}

.loading-spinner {
  font-size: 2.5rem;
  color: var(--accent, #00ffff);
  margin-bottom: 1.5rem;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.2em;
}

.loading-spinner span {
  display: inline-block;
  animation: loadingPulse 1.2s ease-in-out infinite;
}

.loading-spinner span:nth-child(1) {
  animation-delay: 0s;
}

.loading-spinner span:nth-child(2) {
  animation-delay: 0.15s;
}

.loading-spinner span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes loadingPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  50% {
    opacity: 0.3;
    transform: scale(0.9) translateY(-5px);
  }
}

.loading-text {
  color: var(--text-secondary, #808080);
  font-size: 0.9rem;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.05em;
}

/* Responsive */
@media (max-width: 768px) {
  .loading-spinner {
    font-size: 2rem;
  }

  .loading-text {
    font-size: 0.8rem;
  }
}
`;

document.head.appendChild(loadingStyles);

// Export for global use
if (typeof window !== 'undefined') {
  window.LoadingIndicator = LoadingIndicator;
}
