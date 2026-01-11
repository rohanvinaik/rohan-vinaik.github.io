/**
 * Mobile Touch Optimizations
 * Provides better touch targets, feedback, and gestures for mobile devices
 *
 * Features:
 * - Touch feedback animations
 * - Swipe navigation
 * - Improved tap highlighting
 * - Better touch target sizing
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const config = {
    minSwipeDistance: 50, // Minimum swipe distance in pixels
    maxSwipeTime: 300, // Maximum time for a swipe in ms
    rippleColor: 'rgba(0, 255, 0, 0.3)',
    feedbackDuration: 300 // ms
  };

  // Touch tracking
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  // ============================================
  // TOUCH FEEDBACK
  // ============================================

  /**
   * Add ripple effect on touch
   */
  function addRippleEffect(element, x, y) {
    // Check if element allows ripple
    if (element.classList.contains('no-ripple')) return;

    const ripple = document.createElement('span');
    ripple.className = 'touch-ripple';

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const rippleX = x - rect.left - size / 2;
    const rippleY = y - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${rippleX}px`;
    ripple.style.top = `${rippleY}px`;

    element.appendChild(ripple);

    // Remove after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, config.feedbackDuration);
  }

  /**
   * Add visual feedback to interactive elements
   */
  function initializeTouchFeedback() {
    // Target elements that should have touch feedback
    const interactiveSelectors = [
      'button',
      'a',
      '.nav-item',
      '.filter-tag',
      '.list-item',
      '.item',
      '.skill-item',
      '.project-item',
      '[role="button"]',
      '[onclick]'
    ];

    const interactiveElements = document.querySelectorAll(interactiveSelectors.join(', '));

    interactiveElements.forEach(element => {
      // Skip if already initialized
      if (element.dataset.touchFeedback === 'initialized') return;

      // Mark as initialized
      element.dataset.touchFeedback = 'initialized';

      // Ensure element has position for ripple
      const position = window.getComputedStyle(element).position;
      if (position === 'static') {
        element.style.position = 'relative';
      }

      // Add overflow hidden for ripple containment
      element.style.overflow = 'hidden';

      // Add touch feedback
      element.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        addRippleEffect(this, touch.clientX, touch.clientY);

        // Add active class
        this.classList.add('touch-active');
      }, { passive: true });

      element.addEventListener('touchend', function() {
        // Remove active class after delay
        setTimeout(() => {
          this.classList.remove('touch-active');
        }, config.feedbackDuration);
      }, { passive: true });

      element.addEventListener('touchcancel', function() {
        this.classList.remove('touch-active');
      }, { passive: true });
    });

    console.log(`[Touch] Initialized feedback for ${interactiveElements.length} elements`);
  }

  // ============================================
  // SWIPE GESTURES
  // ============================================

  /**
   * Initialize swipe navigation
   */
  function initializeSwipeNavigation() {
    // Only on main content area
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    mainContent.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = Date.now();
    }, { passive: true });

    mainContent.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0];
      const touchEndX = touch.clientX;
      const touchEndY = touch.clientY;
      const touchEndTime = Date.now();

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const deltaTime = touchEndTime - touchStartTime;

      // Check if it's a swipe (fast horizontal movement)
      if (Math.abs(deltaX) > config.minSwipeDistance &&
          Math.abs(deltaY) < Math.abs(deltaX) / 2 && // More horizontal than vertical
          deltaTime < config.maxSwipeTime) {

        if (deltaX > 0) {
          handleSwipeRight();
        } else {
          handleSwipeLeft();
        }
      }
    }, { passive: true });
  }

  function handleSwipeRight() {
    // Navigate to previous section
    const activeNav = document.querySelector('.nav-item.active');
    if (!activeNav) return;

    const prevNav = activeNav.previousElementSibling;
    if (prevNav && prevNav.classList.contains('nav-item')) {
      prevNav.click();
      console.log('[Touch] Swiped right - previous section');
    }
  }

  function handleSwipeLeft() {
    // Navigate to next section
    const activeNav = document.querySelector('.nav-item.active');
    if (!activeNav) return;

    const nextNav = activeNav.nextElementSibling;
    if (nextNav && nextNav.classList.contains('nav-item')) {
      nextNav.click();
      console.log('[Touch] Swiped left - next section');
    }
  }

  // ============================================
  // TOUCH TARGET SIZING
  // ============================================

  /**
   * Ensure all interactive elements meet minimum touch target size (44x44px)
   */
  function enforceTouchTargetSize() {
    const minSize = 44; // px - Apple and Material Design guideline

    const interactiveElements = document.querySelectorAll('button, a, input[type="button"], input[type="submit"], .clickable');

    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect();

      // Skip if already large enough
      if (rect.width >= minSize && rect.height >= minSize) return;

      // Add padding to increase touch target
      const currentPadding = parseInt(window.getComputedStyle(element).padding) || 0;

      if (rect.height < minSize) {
        const paddingNeeded = Math.ceil((minSize - rect.height) / 2);
        element.style.paddingTop = element.style.paddingBottom = `${paddingNeeded + currentPadding}px`;
      }

      if (rect.width < minSize) {
        const paddingNeeded = Math.ceil((minSize - rect.width) / 2);
        element.style.paddingLeft = element.style.paddingRight = `${paddingNeeded + currentPadding}px`;
      }
    });

    console.log('[Touch] Enforced minimum touch target size');
  }

  // ============================================
  // SCROLL MOMENTUM
  // ============================================

  /**
   * Enable smooth scroll momentum on iOS
   */
  function enableScrollMomentum() {
    const scrollableElements = document.querySelectorAll('.main-content, .section-content, .paper-list, .filter-tags');

    scrollableElements.forEach(element => {
      element.style.webkitOverflowScrolling = 'touch';
    });
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function init() {
    // Only run on touch devices
    if (!('ontouchstart' in window)) {
      console.log('[Touch] Not a touch device, skipping mobile optimizations');
      return;
    }

    console.log('[Touch] Initializing mobile touch optimizations');

    // Initialize features
    initializeTouchFeedback();
    initializeSwipeNavigation();
    enforceTouchTargetSize();
    enableScrollMomentum();

    // Re-initialize touch feedback for dynamically added elements
    const observer = new MutationObserver(() => {
      initializeTouchFeedback();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('[Touch] Mobile optimizations active');
  }

  // ============================================
  // EXPORTS
  // ============================================
  window.MobileTouch = {
    init: init,
    addRipple: addRippleEffect
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

// ============================================
// TOUCH STYLES
// ============================================
const touchStyles = document.createElement('style');
touchStyles.textContent = `
/* Touch Ripple Effect */
.touch-ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(0, 255, 0, 0.3);
  transform: scale(0);
  animation: ripple 0.3s ease-out;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* Touch Active State */
.touch-active {
  opacity: 0.7 !important;
  transform: scale(0.98);
  transition: all 0.1s ease;
}

/* Improved Tap Highlighting */
* {
  -webkit-tap-highlight-color: rgba(0, 255, 0, 0.2);
  tap-highlight-color: rgba(0, 255, 0, 0.2);
}

/* Remove tap highlight for non-interactive elements */
.no-highlight,
.main-content,
.section,
div:not([role]),
span:not([role]),
p {
  -webkit-tap-highlight-color: transparent;
  tap-highlight-color: transparent;
}

/* Touch-friendly scrollbars on mobile */
@media (max-width: 768px) {
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 0, 0.3);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:active {
    background: rgba(0, 255, 0, 0.5);
  }
}

/* Larger touch targets for navigation on mobile */
@media (max-width: 768px) {
  .nav-item {
    min-height: 44px !important;
    padding: 12px 16px !important;
  }

  button,
  a.button,
  .btn {
    min-height: 44px !important;
    min-width: 44px !important;
    padding: 12px 16px !important;
  }

  .filter-tag {
    min-height: 44px !important;
    padding: 8px 16px !important;
  }

  /* Increase spacing between clickable elements */
  .list-item,
  .item,
  .skill-item {
    margin-bottom: 12px !important;
  }
}

/* Prevent zoom on double-tap for buttons */
button,
a,
.nav-item,
.filter-tag {
  touch-action: manipulation;
}

/* Smooth scrolling momentum */
.main-content,
.section-content,
.paper-list,
.filter-tags {
  -webkit-overflow-scrolling: touch;
}

/* Better touch feedback for links */
a:active,
button:active,
.nav-item:active {
  opacity: 0.7;
}

/* Prevent text selection on repeated taps */
.nav-item,
.filter-tag,
button,
.btn {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Visual indicator for swipe navigation */
@media (max-width: 768px) {
  .main-content {
    position: relative;
  }

  .main-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--accent, #00ff00), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .main-content.swiping::before {
    opacity: 0.5;
  }
}
`;

document.head.appendChild(touchStyles);
