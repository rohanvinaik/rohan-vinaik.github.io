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
    intervalId: null
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
    matrix.intervalId = setInterval(drawMatrix, 50);
  }

  function drawMatrix() {
    if (!matrix.enabled || !matrix.ctx) return;

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

})();
