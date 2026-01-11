/**
 * Reading Progress Indicator
 * Updates the progress bar based on scroll position
 */

(function() {
  'use strict';

  // Get the progress bar element
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) {
    console.warn('Reading progress bar element not found');
    return;
  }

  // Function to calculate and update scroll progress
  function updateScrollProgress() {
    // Get the scrollable container
    // For the main page, it's .main-content, for papers it's the body/document
    const scrollContainer = document.querySelector('.main-content') || document.documentElement;

    // Calculate scroll percentage
    const scrollTop = scrollContainer.scrollTop || window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight || document.documentElement.scrollHeight;
    const clientHeight = scrollContainer.clientHeight || window.innerHeight || document.documentElement.clientHeight;

    // Calculate the maximum scrollable distance
    const maxScroll = scrollHeight - clientHeight;

    // Calculate percentage (0-100)
    const scrollPercentage = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

    // Update the progress bar width
    progressBar.style.width = scrollPercentage + '%';

    // Optional: Add a class when fully scrolled
    if (scrollPercentage >= 99) {
      progressBar.classList.add('complete');
    } else {
      progressBar.classList.remove('complete');
    }
  }

  // Throttle function to limit how often updateScrollProgress runs
  // This improves performance on scroll
  let ticking = false;
  function throttledUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateScrollProgress();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Listen for scroll events on multiple sources
  window.addEventListener('scroll', throttledUpdate, { passive: true });

  // Also listen on the main content container if it exists
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.addEventListener('scroll', throttledUpdate, { passive: true });
  }

  // Listen for resize events (viewport changes)
  window.addEventListener('resize', throttledUpdate, { passive: true });

  // Initial calculation on page load
  window.addEventListener('load', updateScrollProgress);

  // Also run immediately in case load event already fired
  updateScrollProgress();

  // For single-page apps or dynamic content, listen for DOM changes
  if ('MutationObserver' in window) {
    const observer = new MutationObserver(function(mutations) {
      // Recalculate after DOM changes (debounced)
      clearTimeout(observer.timeout);
      observer.timeout = setTimeout(updateScrollProgress, 100);
    });

    // Observe changes to body or main content
    const observeTarget = document.querySelector('.main-content') || document.body;
    observer.observe(observeTarget, {
      childList: true,
      subtree: true
    });
  }

  // Debug mode (uncomment to see progress values in console)
  // window.addEventListener('scroll', function() {
  //   console.log('Scroll progress:', progressBar.style.width);
  // }, { passive: true });

})();
