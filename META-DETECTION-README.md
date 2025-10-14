# Meta-Detection System

A playful, privacy-respecting visitor insight system that detects browser information and creates delightful moments for visitors.

## Overview

The meta-detection system analyzes freely-available browser information to provide personalized, contextual messages without any tracking or data collection. All detection runs **client-side only** and uses localStorage purely for return visitor detection.

## Features

### Basic Detection
- ✅ **Time of Day** - Morning/afternoon/evening/night based on user's local time
- ✅ **Timezone** - User's timezone with offset
- ✅ **Browser Type** - Chrome, Firefox, Safari, Arc, Edge, Opera, Brave
- ✅ **Operating System** - Windows, macOS, Linux, Android, iOS
- ✅ **Device Type** - Mobile, tablet, desktop
- ✅ **Screen Resolution** - Width, height, DPI ratio
- ✅ **Special Monitors**:
  - Ultrawide monitors (3440x1440, 2560x1080)
  - Vertical/rotated monitors (portrait orientation)
  - High-DPI displays (Retina, 2x+)
  - 4K+ displays
- ✅ **Color Scheme Preference** - Dark mode vs light mode
- ✅ **Language Settings** - Primary language and all languages
- ✅ **Connection Type** - WiFi, cellular, ethernet (where available)
- ✅ **Battery Level** - Current battery percentage and charging status
- ✅ **Refresh Rate** - 60Hz vs 120Hz+ detection
- ✅ **Accessibility Preferences** - Reduced motion, high contrast, reduced transparency

### Advanced Inferences
- ✅ **VPN/Expat Detection** - Timezone ≠ IP location
- ✅ **Return Visitor Detection** - Time since last visit
- ✅ **Device Switching** - Visited on phone yesterday, desktop today
- ✅ **Touch Capability on Desktop** - Surface/touchscreen laptop detection
- ✅ **AdBlock Detection** - Privacy-respecting check
- ✅ **Incognito Mode Hints** - Probabilistic detection (not 100% reliable)

### Display Strategy
1. **Toast Notifications** - Slide-up notifications at bottom of screen
2. **Console Messages** - Developer-friendly insights in console
3. **Adaptive UI** - Automatic UI adjustments based on preferences

## Files

```
meta-detection.js       # Main detection module
style.css              # Toast notification styles + adaptive UI classes
index.html             # Script integration
META-DETECTION-README.md # This file
```

## Configuration

Edit the `CONFIG` object in `meta-detection.js`:

```javascript
const CONFIG = {
  enableToasts: true,              // Show toast notifications
  enableConsoleMessages: true,     // Log insights to console
  enableAdaptiveUI: true,          // Apply UI adaptations
  toastDuration: 6000,             // Toast display time (6 seconds)
  toastCooldown: 300000,           // 5 minutes between toasts
  storageKey: 'visitor-insights',  // localStorage key
  maxToastsPerSession: 3           // Max toasts per page load
};
```

## Usage

The system auto-runs 1 second after page load. You can also manually trigger it:

```javascript
// Run detection manually
window.MetaDetection.run();

// Get all detection data
const data = window.MetaDetection.getData();

// Show a specific insight (by index)
window.MetaDetection.showInsight(0); // Show top-priority insight

// Access configuration
window.MetaDetection.config.enableToasts = false;
```

## Example Messages

### Time-Based
- "It's 2:00 there—dedication or insomnia? Either way, respect 🦉"
- "Early bird at 6:00! ☀️ Coffee ready?"

### Location/VPN
- "London IP but Tokyo timezone? VPN user or expat? 🌏"

### Browser/OS
- "Firefox user? A person of culture! 🦊"
- "Linux user? I see you, fellow penguin! 🐧"

### Hardware
- "Nice ultrawide! Gaming or multitasking? 🖥️"
- "Vertical monitor? Developer or coder? 📝"
- "120Hz+ display detected. Buttery smooth! 🧈"
- "Touchscreen laptop? Living the hybrid life! 👆💻"

### Privacy
- "Ad blocker detected? Cool. Here's the content anyway ✌️"
- "Private mode? Your secrets are safe here 🤫"

### Return Visitors
- "Back so soon? I like the enthusiasm! 🎉"
- "Visit #5! You're practically family now 💚"
- "Welcome from your 📱! (previously visited from mobile)"

### Battery
- "Battery at 15%! Find a charger? 🔋"

### Accessibility
- "Reduced motion enabled—animations toned down for comfort 🌊"

## Customizing Messages

Edit the `generateInsights()` function in `meta-detection.js`:

```javascript
function generateInsights(data) {
  const insights = [];

  // Add your custom insight
  if (data.browser && data.browser.browser === 'Arc') {
    insights.push({
      type: 'browser',
      message: 'Arc browser? Living in 2030! 🚀',
      priority: 'medium'
    });
  }

  // More insights...
  return insights;
}
```

### Priority Levels
- `high` - Shown first (late night browsing, VPN detection, return visitors)
- `medium` - Shown second (browser choice, hardware, device switching)
- `low` - Shown last (standard detections)

## Adding New Detections

1. Create a detection function:
```javascript
function detectMyFeature() {
  // Your detection logic
  return { feature: 'value' };
}
```

2. Add to main detection routine:
```javascript
visitorData.detections = {
  // ... existing detections
  myFeature: detectMyFeature()
};
```

3. Generate insights in `generateInsights()`:
```javascript
if (data.myFeature) {
  insights.push({
    type: 'custom',
    message: 'Custom message here!',
    priority: 'medium'
  });
}
```

## Privacy

✅ **No Tracking** - All detection is client-side only
✅ **No Analytics** - No data sent to any server
✅ **No Cookies** - Uses localStorage only for return visitor detection
✅ **No Fingerprinting** - Data is never transmitted
✅ **Respectful** - Messages are playful, not creepy
✅ **Transparent** - All code is visible and commented

## Console Easter Eggs

Open the browser console to see:
- Formatted visitor insights table
- Browser, OS, screen details
- Timezone and visit count
- Special messages for developers

Example:
```
┌─────────────────────────────────────────────┐
│  👀 VISITOR INSIGHTS (for curious devs)    │
├─────────────────────────────────────────────┤
│  Browser: Firefox                           │
│  OS: macOS                                  │
│  Screen: 3840x1080 @2x                      │
│  Timezone: America/New_York                 │
│  Visit #5                                   │
├─────────────────────────────────────────────┤
│  All data is local-only. No tracking! 🔒   │
└─────────────────────────────────────────────┘
🦊 Firefox Developer Tools are amazing!
```

## Adaptive UI Features

### Mobile Device
Automatically applies `.mobile-device` class to body, which:
- Increases touch target size (min 44px)
- Adjusts padding on interactive elements

### Reduced Motion
Respects `prefers-reduced-motion` preference:
- Disables all animations
- Removes transitions
- Applies `.reduced-motion` class

### Dark Mode Detection
Detects `prefers-color-scheme` preference (logged to console, ready for theme switching)

## Rate Limiting

To prevent spam:
- **Toast Cooldown**: 5 minutes between toasts
- **Max Toasts**: 3 per page load
- **Session Storage**: Tracks shown insights

## Troubleshooting

### Toasts not appearing
- Check `CONFIG.enableToasts = true`
- Check console for rate limiting messages
- Verify CSS is loaded (`.meta-toast` styles)

### Console messages missing
- Check `CONFIG.enableConsoleMessages = true`
- Open browser console (F12)

### IP geolocation not working
- Normal! IP API may fail or be blocked
- System gracefully degrades without it
- VPN detection simply won't trigger

### Detections seem wrong
- Some detections are probabilistic (incognito mode)
- User agent parsing can vary
- Battery API requires HTTPS

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Arc (latest)
- ⚠️ IE11 - Not supported

## API Reference

### `window.MetaDetection.run()`
Runs the full detection routine. Auto-runs on page load.

### `window.MetaDetection.getData()`
Returns object with:
- `detections` - All detection data
- `insights` - Generated insights array
- `toastCount` - Toasts shown this session
- `lastToastTime` - Timestamp of last toast

### `window.MetaDetection.showInsight(index)`
Show a specific insight as toast notification.

Parameters:
- `index` (number) - Index in insights array (0-based)

### `window.MetaDetection.config`
Access/modify configuration object.

## Future Enhancements

Possible additions:
- WebGL capability detection
- Audio context support
- Gamepad API detection
- Web workers available
- Service worker support
- WebAssembly support
- Clipboard API access
- Notification permission status
- Geolocation permission status
- Time zone vs location language mismatch

## Credits

Built for rohanvinaik.github.io
Privacy-first, playful, and performant.

---

**Have fun with it!** 🎉
