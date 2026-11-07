'use strict';
try {
  const prefs = JSON.parse(localStorage.getItem('rohan-console') || '{}');
  const clinical = prefs.theme === 'clinical';
  document.documentElement.dataset.theme = clinical ? 'clinical' : 'terminal';
  const colors = clinical
    ? {cyan:'#006d83',green:'#246a2a',amber:'#875400'}
    : {cyan:'#00ffff',green:'#00ff00',amber:'#ffb000'};
  const color = colors[prefs.accent] || colors.cyan;
  for (const key of ['biology','ai','theory','link']) {
    document.documentElement.style.setProperty('--accent-' + key, color);
  }
} catch {}
