/**
 * Error Boundary & Toast Notification System
 * Gracefully handles errors with user-friendly notifications
 * Provides better resilience and professional error UX
 */

(function() {
  'use strict';

  // ============================================
  // STATE
  // ============================================
  const state = {
    toasts: [],
    maxToasts: 3,
    seenErrors: new Set(), // Prevent duplicate error toasts
    errorCooldown: 5000 // ms - don't show same error more than once per 5s
  };

  // ============================================
  // TOAST NOTIFICATION
  // ============================================
  const Toast = {
    /**
     * Show a toast notification
     * @param {string} message - The message to display
     * @param {string} type - Type: 'error', 'warning', 'info', 'success'
     * @param {number} duration - Duration in ms (0 = permanent)
     */
    show(message, type = 'info', duration = 5000) {
      // Create toast container if it doesn't exist
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
      }

      // Limit number of toasts
      if (state.toasts.length >= state.maxToasts) {
        const oldestToast = state.toasts.shift();
        if (oldestToast && oldestToast.element.parentNode) {
          oldestToast.element.remove();
        }
      }

      // Create toast element
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
        <div class="toast-icon">${getIcon(type)}</div>
        <div class="toast-message">${escapeHtml(message)}</div>
        <button class="toast-close" onclick="this.closest('.toast').remove()">×</button>
      `;

      container.appendChild(toast);

      // Track toast
      const toastObj = { element: toast, type, message };
      state.toasts.push(toastObj);

      // Animate in
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
      });

      // Auto-dismiss
      if (duration > 0) {
        setTimeout(() => {
          dismissToast(toast);
        }, duration);
      }

      return toast;
    },

    error(message, duration = 7000) {
      return this.show(message, 'error', duration);
    },

    warning(message, duration = 5000) {
      return this.show(message, 'warning', duration);
    },

    info(message, duration = 4000) {
      return this.show(message, 'info', duration);
    },

    success(message, duration = 4000) {
      return this.show(message, 'success', duration);
    },

    dismissAll() {
      const container = document.getElementById('toast-container');
      if (container) {
        state.toasts.forEach(toast => {
          if (toast.element.parentNode) {
            dismissToast(toast.element);
          }
        });
        state.toasts = [];
      }
    }
  };

  function dismissToast(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(400px)';

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }

      // Remove from tracking
      state.toasts = state.toasts.filter(t => t.element !== toast);
    }, 300);
  }

  function getIcon(type) {
    const icons = {
      error: '✖',
      warning: '⚠',
      info: 'ℹ',
      success: '✓'
    };
    return icons[type] || icons.info;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================
  // ERROR HANDLING
  // ============================================
  const ErrorHandler = {
    /**
     * Handle an error gracefully
     */
    handle(error, context = '') {
      const errorKey = `${error.message}:${error.filename || ''}:${error.lineno || ''}`;

      // Check if we've seen this error recently
      if (state.seenErrors.has(errorKey)) {
        console.warn('[ErrorHandler] Suppressing duplicate error:', errorKey);
        return;
      }

      // Mark as seen
      state.seenErrors.add(errorKey);

      // Remove from seen after cooldown
      setTimeout(() => {
        state.seenErrors.delete(errorKey);
      }, state.errorCooldown);

      // Log to console for developers
      console.error('[ErrorHandler]', context, error);

      // Show user-friendly toast
      const message = this.getUserFriendlyMessage(error, context);
      Toast.error(message);

      // Optional: Send to analytics/logging service
      this.logError(error, context);

      // Prevent default browser error handling
      return true;
    },

    getUserFriendlyMessage(error, context) {
      const errorType = error.name || 'Error';
      const errorMessage = error.message || 'An unknown error occurred';

      // Map technical errors to user-friendly messages
      const friendlyMessages = {
        'NetworkError': 'Network connection issue. Please check your internet connection.',
        'TypeError': 'Something unexpected happened. The page may not work correctly.',
        'ReferenceError': 'A required component failed to load. Try refreshing the page.',
        'SyntaxError': 'Page configuration error. Please contact support.',
        'SecurityError': 'Security restriction encountered. Some features may not work.',
        'QuotaExceededError': 'Storage limit reached. Try clearing your browser cache.'
      };

      // Check for specific error patterns
      if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        return 'Network error: Unable to load content. Please check your connection.';
      }

      if (errorMessage.includes('localStorage') || errorMessage.includes('storage')) {
        return 'Storage error: Browser storage may be full. Try clearing cache.';
      }

      // Use friendly message if available
      const friendly = friendlyMessages[errorType];
      if (friendly) {
        return friendly;
      }

      // Default message with context
      if (context) {
        return `Error in ${context}: ${errorMessage}`;
      }

      return `Error: ${errorMessage}`;
    },

    logError(error, context) {
      // Prepare error data
      const errorData = {
        message: error.message,
        stack: error.stack,
        context: context,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      // Log to console (could be sent to external service)
      console.log('[ErrorHandler] Error logged:', errorData);

      // Optional: Send to analytics/error tracking service
      // Example: window.gtag && window.gtag('event', 'exception', { description: errorData.message });
    }
  };

  // ============================================
  // GLOBAL ERROR HANDLERS
  // ============================================

  // Catch unhandled JavaScript errors
  window.addEventListener('error', (event) => {
    ErrorHandler.handle({
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    }, 'Global');

    return true; // Prevent default error handling
  });

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    ErrorHandler.handle({
      message: event.reason?.message || event.reason || 'Unhandled promise rejection',
      stack: event.reason?.stack
    }, 'Promise');

    event.preventDefault(); // Prevent default rejection handling
  });

  // ============================================
  // SAFE FUNCTION WRAPPER
  // ============================================
  function safeCall(fn, context = 'Function') {
    return function(...args) {
      try {
        return fn.apply(this, args);
      } catch (error) {
        ErrorHandler.handle(error, context);
        return null;
      }
    };
  }

  // ============================================
  // EXPORTS
  // ============================================
  window.ErrorHandler = ErrorHandler;
  window.Toast = Toast;
  window.safeCall = safeCall;

  console.log('[ErrorHandler] Initialized - Global error handling active');

})();

// ============================================
// TOAST STYLES
// ============================================
const toastStyles = document.createElement('style');
toastStyles.textContent = `
/* Toast Container */
.toast-container {
  position: fixed;
  top: 60px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

/* Toast Base */
.toast {
  min-width: 300px;
  max-width: 500px;
  background: var(--bg-secondary, #1a1a1a);
  border: 2px solid var(--border, #333);
  border-radius: 4px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  opacity: 0;
  transform: translateX(400px);
  transition: all 0.3s ease;
  pointer-events: auto;
}

/* Toast Types */
.toast-error {
  border-color: #ff0000;
  background: rgba(255, 0, 0, 0.05);
}

.toast-warning {
  border-color: #ffaa00;
  background: rgba(255, 170, 0, 0.05);
}

.toast-info {
  border-color: var(--accent, #00ff00);
  background: rgba(0, 255, 0, 0.05);
}

.toast-success {
  border-color: #00ff00;
  background: rgba(0, 255, 0, 0.05);
}

/* Toast Icon */
.toast-icon {
  font-size: 1.2rem;
  font-weight: bold;
  flex-shrink: 0;
}

.toast-error .toast-icon {
  color: #ff0000;
}

.toast-warning .toast-icon {
  color: #ffaa00;
}

.toast-info .toast-icon {
  color: var(--accent, #00ff00);
}

.toast-success .toast-icon {
  color: #00ff00;
}

/* Toast Message */
.toast-message {
  flex: 1;
  color: var(--text-primary, #e0e0e0);
  line-height: 1.4;
  word-break: break-word;
}

/* Toast Close Button */
.toast-close {
  background: none;
  border: none;
  color: var(--text-secondary, #808080);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, transform 0.2s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  color: var(--text-primary, #e0e0e0);
  transform: rotate(90deg);
}

/* Responsive */
@media (max-width: 768px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }

  .toast {
    min-width: auto;
    max-width: none;
    font-size: 0.75rem;
    padding: 10px 12px;
  }

  .toast-icon {
    font-size: 1rem;
  }

  .toast-close {
    font-size: 1.25rem;
    width: 20px;
    height: 20px;
  }
}

/* Animation for stacking */
.toast:not(:last-child) {
  margin-bottom: 4px;
}
`;

document.head.appendChild(toastStyles);
