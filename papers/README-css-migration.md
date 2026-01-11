# Paper CSS Migration Guide

## Overview
This directory now has a shared `paper-base.css` stylesheet that contains common styles for all paper pages.

## Completed Migrations
- `GenomeVault_Paper.html` - Fully migrated
- `pot_neurips2025.html` - Migrated with paper-specific overrides

## Migration Steps for Remaining Papers

For each paper HTML file:

1. **Replace the `<head>` section** with:
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Paper Title] - Rohan Vinaik</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="paper-base.css">
  <script>
    // Apply theme from localStorage
    (function() {
      const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');
      if (settings.themeMode === 'clinical') {
        document.documentElement.setAttribute('data-theme', 'clinical');
      }
    })();
  </script>
</head>
```

2. **If paper has unique styles**, keep them in a minimal `<style>` block after the script tag.

3. **Test** that the paper renders correctly in both Terminal and Clinical modes.

## Benefits
- **Single source of truth**: Change styles once, applies to all papers
- **Theme support**: Papers automatically support Clinical (light) mode
- **Smaller files**: ~200 lines removed per file
- **Easier maintenance**: No need to update 52 files for style changes

## Files to Migrate (50 remaining)
Run this command to list papers still using inline styles:
```bash
grep -l "<style>" papers/*.html | grep -v paper-base
```
