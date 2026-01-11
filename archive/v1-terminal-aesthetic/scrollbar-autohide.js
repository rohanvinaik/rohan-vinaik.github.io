/**
 * Auto-hide Scrollbar Handler
 * Shows scrollbar while scrolling, hides after inactivity
 */

(function() {
  'use strict';

  let scrollTimeout;
  const HIDE_DELAY = 1000; // Hide scrollbar 1s after scrolling stops

  function showScrollbar() {
    document.documentElement.classList.add('is-scrolling');

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      document.documentElement.classList.remove('is-scrolling');
    }, HIDE_DELAY);
  }

  // Listen for scroll events
  window.addEventListener('scroll', showScrollbar, { passive: true });

  // Also listen on elements with overflow
  document.addEventListener('scroll', showScrollbar, { capture: true, passive: true });

  console.log('[ScrollbarAutoHide] Initialized');
})();
