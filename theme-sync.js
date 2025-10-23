/**
 * Theme Sync for Paper Pages
 * Syncs color scheme from main website to individual paper pages
 */

(function() {
  'use strict';

  // Default settings (matches main site defaults)
  const defaults = {
    accent: 'cyan', // Blue/teal default
    background: 'black'
  };

  // Color mappings (must match terminal.js)
  const accentColors = {
    green: '#00ff00',
    amber: '#ffaa00',
    cyan: '#00ffff'
  };

  const backgroundColors = {
    black: '#0a0a0a',
    gray: '#1a1a1a',
    navy: '#0a1628'
  };

  /**
   * Load settings from localStorage
   */
  function loadSettings() {
    try {
      const saved = localStorage.getItem('dashboard-settings');
      if (saved) {
        const settings = JSON.parse(saved);
        return {
          accent: settings.accent || defaults.accent,
          background: settings.background || defaults.background
        };
      }
    } catch (err) {
      console.warn('[ThemeSync] Failed to load settings:', err);
    }
    return defaults;
  }

  /**
   * Apply theme to page
   */
  function applyTheme() {
    const settings = loadSettings();
    const root = document.documentElement;

    // Apply accent color
    const accentColor = accentColors[settings.accent] || accentColors.cyan;
    root.style.setProperty('--accent', accentColor);

    // Apply background color
    const bgColor = backgroundColors[settings.background] || backgroundColors.black;
    root.style.setProperty('--bg', bgColor);

    console.log(`[ThemeSync] Applied theme: accent=${settings.accent}, background=${settings.background}`);
  }

  // Apply theme immediately
  applyTheme();

  // Re-apply if settings change in another tab
  window.addEventListener('storage', (e) => {
    if (e.key === 'dashboard-settings') {
      applyTheme();
      console.log('[ThemeSync] Settings updated from another tab');
    }
  });

  // Export API
  window.ThemeSync = {
    apply: applyTheme,
    get: loadSettings
  };

})();
