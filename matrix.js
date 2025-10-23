// ============================================
// MATRIX RAIN BACKGROUND
// ============================================

(function() {
  'use strict';

  // ============================================
  // MATRIX STATE
  // ============================================
  let matrix = {
    canvas: null,
    ctx: null,
    enabled: false,
    chars: '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
    columns: 0,
    drops: [],
    animationFrame: null,
    intervalId: null,
    isVisible: true,
    isTabActive: true,
    currentFPS: 20 // Normal FPS
  };

  // ============================================
  // CREATE CANVAS
  // ============================================
  function createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.className = 'matrix-canvas';

    // Insert as first child of body (behind everything)
    document.body.insertBefore(canvas, document.body.firstChild);

    matrix.canvas = canvas;
    matrix.ctx = canvas.getContext('2d');

    resizeCanvas();

    return canvas;
  }

  // ============================================
  // RESIZE CANVAS
  // ============================================
  function resizeCanvas() {
    if (!matrix.canvas) return;

    matrix.canvas.width = window.innerWidth;
    matrix.canvas.height = window.innerHeight;

    // Recalculate columns
    matrix.columns = Math.floor(matrix.canvas.width / 20);
    matrix.drops = Array(matrix.columns).fill(1);
  }

  // ============================================
  // ENABLE MATRIX RAIN
  // ============================================
  function enableMatrix() {
    if (matrix.enabled) return;

    matrix.enabled = true;

    if (!matrix.canvas) {
      createCanvas();
    }

    matrix.canvas.style.display = 'block';

    // Start animation
    startAnimation();
  }

  // ============================================
  // DISABLE MATRIX RAIN
  // ============================================
  function disableMatrix() {
    if (!matrix.enabled) return;

    matrix.enabled = false;

    if (matrix.canvas) {
      matrix.canvas.style.display = 'none';
    }

    if (matrix.intervalId) {
      clearInterval(matrix.intervalId);
    }
  }

  // ============================================
  // ANIMATION
  // ============================================
  function startAnimation() {
    updateAnimationSpeed();
  }

  function updateAnimationSpeed() {
    // Clear existing interval
    if (matrix.intervalId) {
      clearInterval(matrix.intervalId);
      matrix.intervalId = null;
    }

    // Don't start if not enabled
    if (!matrix.enabled) return;

    // Pause completely if not visible
    if (!matrix.isVisible) {
      console.log('[Matrix] Paused - not visible');
      return;
    }

    // Determine FPS based on tab visibility
    let fps = 20; // Normal FPS
    let interval = 50; // 50ms = 20 FPS

    if (!matrix.isTabActive) {
      fps = 5; // Reduced FPS when tab is backgrounded
      interval = 200; // 200ms = 5 FPS
      console.log('[Matrix] Reduced FPS - tab in background');
    }

    matrix.currentFPS = fps;
    matrix.intervalId = setInterval(drawMatrix, interval);
  }

  function drawMatrix() {
    if (!matrix.enabled || !matrix.ctx || !matrix.isVisible) return;

    // Semi-transparent black for fade effect
    matrix.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    matrix.ctx.fillRect(0, 0, matrix.canvas.width, matrix.canvas.height);

    // Get current accent color from CSS
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

    // Draw characters
    matrix.ctx.fillStyle = accentColor;
    matrix.ctx.font = '15px monospace';

    matrix.drops.forEach((y, i) => {
      // Random character
      const char = matrix.chars[Math.floor(Math.random() * matrix.chars.length)];

      // Draw character
      matrix.ctx.fillText(char, i * 20, y * 20);

      // Reset drop to top randomly
      if (y * 20 > matrix.canvas.height && Math.random() > 0.975) {
        matrix.drops[i] = 0;
      }

      // Increment drop
      matrix.drops[i]++;
    });
  }

  // ============================================
  // EXPORT FUNCTIONS
  // ============================================
  window.MatrixRain = {
    enable: enableMatrix,
    disable: disableMatrix,
    isEnabled: () => matrix.enabled
  };

  // ============================================
  // LOAD SAVED STATE
  // ============================================
  window.addEventListener('DOMContentLoaded', () => {
    const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');
    if (settings.matrixRain) {
      enableMatrix();
    }

    // Settings toggle handler
    const matrixToggle = document.getElementById('enable-matrix');
    if (matrixToggle) {
      matrixToggle.checked = settings.matrixRain || false;
      matrixToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          enableMatrix();
        } else {
          disableMatrix();
        }

        // Save to settings
        settings.matrixRain = e.target.checked;
        localStorage.setItem('dashboard-settings', JSON.stringify(settings));
      });
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (matrix.enabled) {
      resizeCanvas();
    }
  });

  // Update when accent color changes
  window.addEventListener('accentChanged', () => {
    // Matrix will automatically pick up the new color on next draw
  });

  // ============================================
  // VISIBILITY OPTIMIZATIONS
  // ============================================

  // Intersection Observer to detect when canvas is visible
  function setupVisibilityObserver() {
    if (!('IntersectionObserver' in window)) {
      console.log('[Matrix] IntersectionObserver not supported, skipping visibility optimization');
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasVisible = matrix.isVisible;
        matrix.isVisible = entry.isIntersecting;

        // Only update animation if visibility changed
        if (wasVisible !== matrix.isVisible) {
          console.log(`[Matrix] Visibility changed: ${matrix.isVisible}`);
          updateAnimationSpeed();
        }
      });
    }, {
      threshold: 0.1 // Consider visible if at least 10% is in viewport
    });

    if (matrix.canvas) {
      observer.observe(matrix.canvas);
    }
  }

  // Page Visibility API to detect tab backgrounding
  function setupTabVisibilityHandler() {
    if (typeof document.hidden === 'undefined') {
      console.log('[Matrix] Page Visibility API not supported, skipping tab backgrounding optimization');
      return;
    }

    document.addEventListener('visibilitychange', () => {
      const wasActive = matrix.isTabActive;
      matrix.isTabActive = !document.hidden;

      // Only update animation if tab visibility changed
      if (wasActive !== matrix.isTabActive) {
        console.log(`[Matrix] Tab visibility changed: ${matrix.isTabActive ? 'active' : 'backgrounded'}`);
        updateAnimationSpeed();
      }
    });
  }

  // Initialize visibility optimizations when matrix is first enabled
  let visibilitySetup = false;
  const originalEnableMatrix = enableMatrix;
  enableMatrix = function() {
    originalEnableMatrix();

    if (!visibilitySetup) {
      setupVisibilityObserver();
      setupTabVisibilityHandler();
      visibilitySetup = true;
    }
  };

})();
