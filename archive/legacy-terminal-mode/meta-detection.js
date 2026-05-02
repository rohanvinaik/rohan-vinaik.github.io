// ============================================
// META-DETECTION & VISITOR INSIGHTS
// Playful, privacy-respecting browser detection
// ============================================

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    enableToasts: true,
    enableConsoleMessages: true,
    enableAdaptiveUI: true,
    toastDuration: 6000, // 6 seconds
    toastCooldown: 300000, // 5 minutes between toasts
    storageKey: 'visitor-insights',
    maxToastsPerSession: 3
  };

  // ============================================
  // STATE
  // ============================================
  let visitorData = {
    detections: {},
    insights: [],
    toastCount: 0,
    lastToastTime: 0
  };

  // ============================================
  // DETECTION FUNCTIONS
  // ============================================

  /**
   * Detect time of day based on local time
   */
  function detectTimeOfDay() {
    const hour = new Date().getHours();
    let period, emoji;

    if (hour >= 5 && hour < 12) {
      period = 'morning';
      emoji = '☀️';
    } else if (hour >= 12 && hour < 17) {
      period = 'afternoon';
      emoji = '🌤️';
    } else if (hour >= 17 && hour < 21) {
      period = 'evening';
      emoji = '🌆';
    } else {
      period = 'night';
      emoji = '🌙';
    }

    return { period, hour, emoji };
  }

  /**
   * Detect timezone
   */
  function detectTimezone() {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const offset = new Date().getTimezoneOffset() / -60;
      return { timezone, offset };
    } catch (e) {
      return { timezone: 'Unknown', offset: 0 };
    }
  }

  /**
   * Detect browser type with playful identification
   */
  function detectBrowser() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let version = '';
    let comment = '';

    if (ua.includes('Firefox')) {
      browser = 'Firefox';
      comment = 'A person of culture! 🦊';
    } else if (ua.includes('Arc')) {
      browser = 'Arc';
      comment = 'Living in the future! 🚀';
    } else if (ua.includes('Edg')) {
      browser = 'Edge';
      comment = 'Microsoft fan or corporate machine? 💼';
    } else if (ua.includes('Chrome') && ua.includes('Safari')) {
      browser = 'Chrome';
      comment = 'Classic choice! 🔵';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      browser = 'Safari';
      comment = 'Apple ecosystem? 🍎';
    } else if (ua.includes('Opera') || ua.includes('OPR')) {
      browser = 'Opera';
      comment = 'A rare sighting! 🎭';
    } else if (ua.includes('Brave')) {
      browser = 'Brave';
      comment = 'Privacy warrior! 🛡️';
    }

    return { browser, comment };
  }

  /**
   * Detect operating system
   */
  function detectOS() {
    const ua = navigator.userAgent;
    const platform = navigator.platform;
    let os = 'Unknown';
    let emoji = '💻';

    if (ua.includes('Win')) {
      os = 'Windows';
      emoji = '🪟';
    } else if (ua.includes('Mac')) {
      os = 'macOS';
      emoji = '🍎';
    } else if (ua.includes('Linux')) {
      os = 'Linux';
      emoji = '🐧';
    } else if (ua.includes('Android')) {
      os = 'Android';
      emoji = '🤖';
    } else if (ua.includes('iOS') || platform.includes('iPhone') || platform.includes('iPad')) {
      os = 'iOS';
      emoji = '📱';
    }

    return { os, emoji };
  }

  /**
   * Detect device type
   */
  function detectDevice() {
    const width = window.innerWidth;
    const ua = navigator.userAgent;
    let type = 'desktop';
    let emoji = '💻';

    if (ua.includes('Mobile') || width < 768) {
      type = 'mobile';
      emoji = '📱';
    } else if (width >= 768 && width < 1024) {
      type = 'tablet';
      emoji = '📱';
    }

    return { type, emoji };
  }

  /**
   * Detect screen resolution and special monitors
   */
  function detectScreen() {
    const width = window.screen.width;
    const height = window.screen.height;
    const ratio = window.devicePixelRatio || 1;
    const orientation = width > height ? 'landscape' : 'portrait';

    let special = null;
    let comment = '';

    // Ultrawide detection
    if ((width >= 3440 && height <= 1440) || (width >= 2560 && width / height > 2)) {
      special = 'ultrawide';
      comment = 'Nice ultrawide! Gaming or multitasking? 🖥️';
    }
    // Vertical/rotated monitor
    else if (orientation === 'portrait' && width >= 1080) {
      special = 'vertical';
      comment = 'Vertical monitor? Developer or coder? 📝';
    }
    // High DPI (Retina, etc.)
    else if (ratio >= 2) {
      special = 'hidpi';
      comment = 'Crispy display! 🤩';
    }
    // Standard high-res
    else if (width >= 2560) {
      special = 'highres';
      comment = '4K vibes! ✨';
    }

    return { width, height, ratio, orientation, special, comment };
  }

  /**
   * Detect color scheme preference
   */
  function detectColorScheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    let scheme = 'unknown';
    if (prefersDark) scheme = 'dark';
    if (prefersLight) scheme = 'light';

    return { scheme, prefersDark };
  }

  /**
   * Detect language settings
   */
  function detectLanguage() {
    const language = navigator.language || navigator.userLanguage;
    const languages = navigator.languages || [language];

    return { primary: language, all: languages };
  }

  /**
   * Detect connection type
   */
  function detectConnection() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (!connection) return { type: 'unknown', effectiveType: 'unknown' };

    return {
      type: connection.type || 'unknown',
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }

  /**
   * Detect battery level
   */
  async function detectBattery() {
    if (!navigator.getBattery) return null;

    try {
      const battery = await navigator.getBattery();
      return {
        level: Math.round(battery.level * 100),
        charging: battery.charging
      };
    } catch (e) {
      return null;
    }
  }

  /**
   * Detect refresh rate (approximation)
   */
  function detectRefreshRate() {
    return new Promise((resolve) => {
      let lastTime = performance.now();
      let frames = 0;
      const maxFrames = 60;

      function measure() {
        const currentTime = performance.now();
        frames++;

        if (frames >= maxFrames) {
          const avgFrameTime = (currentTime - lastTime) / frames;
          const fps = Math.round(1000 / avgFrameTime);
          const refreshRate = fps > 100 ? '120Hz+' : '60Hz';
          resolve({ fps, refreshRate });
        } else {
          requestAnimationFrame(measure);
        }
      }

      requestAnimationFrame(measure);
    });
  }

  /**
   * Detect accessibility preferences
   */
  function detectAccessibility() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const highContrast = window.matchMedia('(prefers-contrast: high)').matches;
    const reducedTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)').matches;

    return { reducedMotion, highContrast, reducedTransparency };
  }

  /**
   * Detect touch capability
   */
  function detectTouch() {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const device = detectDevice().type;

    // Touch on desktop = touchscreen laptop/Surface
    const touchDesktop = hasTouch && device === 'desktop';

    return { hasTouch, touchDesktop };
  }

  /**
   * Detect AdBlock
   */
  function detectAdBlock() {
    return new Promise((resolve) => {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox ad-placement ad-banner';
      testAd.style.position = 'absolute';
      testAd.style.width = '1px';
      testAd.style.height = '1px';
      testAd.style.opacity = '0';
      testAd.style.pointerEvents = 'none';

      document.body.appendChild(testAd);

      setTimeout(() => {
        const blocked = testAd.offsetHeight === 0;
        document.body.removeChild(testAd);
        resolve(blocked);
      }, 100);
    });
  }

  /**
   * Detect incognito/private mode (hints only)
   */
  async function detectIncognito() {
    // This is not 100% reliable but provides hints
    let hints = [];

    // Check localStorage quota
    try {
      const test = 'incognito-test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
    } catch (e) {
      hints.push('localStorage-restricted');
    }

    // Check if storage estimation is limited
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        if (estimate.quota < 120000000) { // Less than ~120MB
          hints.push('limited-quota');
        }
      } catch (e) {
        hints.push('storage-api-blocked');
      }
    }

    return hints.length > 0 ? { likely: true, hints } : { likely: false, hints: [] };
  }

  /**
   * Detect return visitor
   */
  function detectReturnVisitor() {
    const stored = localStorage.getItem(CONFIG.storageKey);
    const now = Date.now();

    if (!stored) {
      // First visit
      const data = {
        firstVisit: now,
        lastVisit: now,
        visitCount: 1,
        devices: [detectDevice().type]
      };
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));
      return { isReturn: false, visitCount: 1 };
    }

    try {
      const data = JSON.parse(stored);
      const timeSinceLastVisit = now - data.lastVisit;
      const daysSince = Math.floor(timeSinceLastVisit / (1000 * 60 * 60 * 24));
      const hoursSince = Math.floor(timeSinceLastVisit / (1000 * 60 * 60));

      // Update data
      data.lastVisit = now;
      data.visitCount = (data.visitCount || 1) + 1;

      const currentDevice = detectDevice().type;
      if (!data.devices) data.devices = [];
      if (!data.devices.includes(currentDevice)) {
        data.devices.push(currentDevice);
      }

      localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));

      return {
        isReturn: true,
        visitCount: data.visitCount,
        daysSince,
        hoursSince,
        devices: data.devices,
        firstVisit: data.firstVisit
      };
    } catch (e) {
      return { isReturn: false, visitCount: 1 };
    }
  }

  /**
   * Fetch IP geolocation data
   */
  async function fetchIPLocation() {
    try {
      const response = await fetch('https://ipapi.co/json/', { timeout: 3000 });
      if (!response.ok) throw new Error('IP API failed');

      const data = await response.json();
      return {
        country: data.country_name,
        countryCode: data.country_code,
        city: data.city,
        region: data.region,
        timezone: data.timezone,
        latitude: data.latitude,
        longitude: data.longitude
      };
    } catch (e) {
      console.log('IP geolocation unavailable (this is fine)');
      return null;
    }
  }

  // ============================================
  // INSIGHT GENERATION
  // ============================================

  /**
   * Generate playful insights from detection data
   */
  function generateInsights(data) {
    const insights = [];

    // Time-based insights
    const timeData = data.timeOfDay;
    if (timeData.hour >= 1 && timeData.hour < 5) {
      insights.push({
        type: 'time',
        message: `It's ${timeData.hour}:00 there—dedication or insomnia? Either way, respect 🦉`,
        priority: 'high'
      });
    } else if (timeData.period === 'morning' && timeData.hour < 7) {
      insights.push({
        type: 'time',
        message: `Early bird at ${timeData.hour}:00! ☀️ Coffee ready?`,
        priority: 'medium'
      });
    }

    // VPN/Expat detection
    if (data.ipLocation && data.timezone) {
      const ipTz = data.ipLocation.timezone;
      const localTz = data.timezone.timezone;

      if (ipTz && localTz && ipTz !== localTz) {
        insights.push({
          type: 'location',
          message: `${data.ipLocation.city} IP but ${localTz} timezone? VPN user or expat? 🌏`,
          priority: 'high'
        });
      }
    }

    // Browser insights
    if (data.browser && data.browser.comment) {
      insights.push({
        type: 'browser',
        message: `${data.browser.browser} user? ${data.browser.comment}`,
        priority: 'low'
      });
    }

    // Screen insights
    if (data.screen && data.screen.comment) {
      insights.push({
        type: 'screen',
        message: data.screen.comment,
        priority: 'medium'
      });
    }

    // Touch desktop
    if (data.touch && data.touch.touchDesktop) {
      insights.push({
        type: 'device',
        message: 'Touchscreen laptop? Living the hybrid life! 👆💻',
        priority: 'medium'
      });
    }

    // AdBlock detection
    if (data.adBlock) {
      insights.push({
        type: 'privacy',
        message: "Ad blocker detected? Cool. Here's the content anyway ✌️",
        priority: 'low'
      });
    }

    // Incognito hints
    if (data.incognito && data.incognito.likely) {
      insights.push({
        type: 'privacy',
        message: 'Private mode? Your secrets are safe here 🤫',
        priority: 'low'
      });
    }

    // Return visitor
    if (data.returnVisitor && data.returnVisitor.isReturn) {
      const rv = data.returnVisitor;
      if (rv.daysSince === 0 && rv.hoursSince < 1) {
        insights.push({
          type: 'visitor',
          message: 'Back so soon? I like the enthusiasm! 🎉',
          priority: 'high'
        });
      } else if (rv.daysSince === 0) {
        insights.push({
          type: 'visitor',
          message: `Welcome back! ${rv.hoursSince}h since your last visit ⏰`,
          priority: 'medium'
        });
      } else if (rv.daysSince < 7) {
        insights.push({
          type: 'visitor',
          message: `Hey again! It's been ${rv.daysSince} day${rv.daysSince > 1 ? 's' : ''} 👋`,
          priority: 'medium'
        });
      } else if (rv.visitCount >= 5) {
        insights.push({
          type: 'visitor',
          message: `Visit #${rv.visitCount}! You're practically family now 💚`,
          priority: 'high'
        });
      }

      // Device switching
      if (rv.devices && rv.devices.length > 1) {
        const otherDevices = rv.devices.filter(d => d !== data.device.type);
        if (otherDevices.length > 0) {
          insights.push({
            type: 'device',
            message: `Welcome from your ${data.device.emoji}! (previously visited from ${otherDevices[0]})`,
            priority: 'medium'
          });
        }
      }
    }

    // Battery low warning
    if (data.battery && data.battery.level < 20 && !data.battery.charging) {
      insights.push({
        type: 'battery',
        message: `Battery at ${data.battery.level}%! Find a charger? 🔋`,
        priority: 'high'
      });
    }

    // High refresh rate
    if (data.refreshRate && data.refreshRate.refreshRate === '120Hz+') {
      insights.push({
        type: 'screen',
        message: `${data.refreshRate.refreshRate} display detected. Buttery smooth! 🧈`,
        priority: 'low'
      });
    }

    // Accessibility preferences
    if (data.accessibility && data.accessibility.reducedMotion) {
      insights.push({
        type: 'accessibility',
        message: 'Reduced motion enabled—animations toned down for comfort 🌊',
        priority: 'low'
      });
    }

    // Linux user
    if (data.os && data.os.os === 'Linux') {
      insights.push({
        type: 'os',
        message: 'Linux user? I see you, fellow penguin! 🐧',
        priority: 'medium'
      });
    }

    return insights;
  }

  // ============================================
  // UI FUNCTIONS
  // ============================================

  /**
   * Show toast notification
   */
  function showToast(message, duration = CONFIG.toastDuration) {
    if (!CONFIG.enableToasts) return;

    // Rate limiting
    const now = Date.now();
    if (now - visitorData.lastToastTime < CONFIG.toastCooldown) {
      console.log('Toast rate limited:', message);
      return;
    }

    if (visitorData.toastCount >= CONFIG.maxToastsPerSession) {
      console.log('Max toasts reached for session');
      return;
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'meta-toast';
    toast.textContent = message;

    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);

    visitorData.lastToastTime = now;
    visitorData.toastCount++;
  }

  /**
   * Log console messages for developers
   */
  function logConsoleEasterEggs(data) {
    if (!CONFIG.enableConsoleMessages) return;

    console.log('%c┌─────────────────────────────────────────────┐', 'color: #00ff00; font-family: monospace;');
    console.log('%c│  👀 VISITOR INSIGHTS (for curious devs)    │', 'color: #00ff00; font-family: monospace;');
    console.log('%c├─────────────────────────────────────────────┤', 'color: #00ff00; font-family: monospace;');

    if (data.browser) {
      console.log(`%c│  Browser: ${data.browser.browser.padEnd(32)}│`, 'color: #e0e0e0; font-family: monospace;');
    }
    if (data.os) {
      console.log(`%c│  OS: ${data.os.os.padEnd(37)}│`, 'color: #e0e0e0; font-family: monospace;');
    }
    if (data.screen) {
      console.log(`%c│  Screen: ${data.screen.width}x${data.screen.height} @${data.screen.ratio}x${' '.repeat(Math.max(0, 19 - `${data.screen.width}x${data.screen.height} @${data.screen.ratio}x`.length))}│`, 'color: #e0e0e0; font-family: monospace;');
    }
    if (data.timezone) {
      console.log(`%c│  Timezone: ${data.timezone.timezone.padEnd(30)}│`, 'color: #e0e0e0; font-family: monospace;');
    }
    if (data.returnVisitor && data.returnVisitor.isReturn) {
      console.log(`%c│  Visit #${data.returnVisitor.visitCount.toString().padEnd(35)}│`, 'color: #ffff00; font-family: monospace;');
    }

    console.log('%c├─────────────────────────────────────────────┤', 'color: #00ff00; font-family: monospace;');
    console.log('%c│  All data is local-only. No tracking! 🔒   │', 'color: #00ff00; font-family: monospace;');
    console.log('%c└─────────────────────────────────────────────┘', 'color: #00ff00; font-family: monospace;');

    // Fun easter egg for developers
    if (data.browser && data.browser.browser === 'Firefox') {
      console.log('%c🦊 Firefox Developer Tools are amazing!', 'color: #ff6611; font-size: 14px; font-weight: bold;');
    }
  }

  /**
   * Apply adaptive UI changes
   */
  function applyAdaptiveUI(data) {
    if (!CONFIG.enableAdaptiveUI) return;

    // Larger touch targets for mobile
    if (data.device && data.device.type === 'mobile') {
      document.body.classList.add('mobile-device');
    }

    // Respect reduced motion
    if (data.accessibility && data.accessibility.reducedMotion) {
      document.body.classList.add('reduced-motion');
    }

    // Dark mode at night (if user hasn't set preference)
    if (data.timeOfDay && (data.timeOfDay.period === 'night' || data.timeOfDay.hour < 6)) {
      // This could toggle your theme if you want
      // For now, just log it
      console.log('Night time detected - perfect for dark mode! 🌙');
    }
  }

  // ============================================
  // MAIN DETECTION ROUTINE
  // ============================================

  async function runDetection() {
    console.log('🔍 Running visitor insights detection...');

    // Collect all detection data
    visitorData.detections = {
      timeOfDay: detectTimeOfDay(),
      timezone: detectTimezone(),
      browser: detectBrowser(),
      os: detectOS(),
      device: detectDevice(),
      screen: detectScreen(),
      colorScheme: detectColorScheme(),
      language: detectLanguage(),
      connection: detectConnection(),
      accessibility: detectAccessibility(),
      touch: detectTouch(),
      returnVisitor: detectReturnVisitor()
    };

    // Async detections
    visitorData.detections.battery = await detectBattery();
    visitorData.detections.refreshRate = await detectRefreshRate();
    visitorData.detections.adBlock = await detectAdBlock();
    visitorData.detections.incognito = await detectIncognito();
    visitorData.detections.ipLocation = await fetchIPLocation();

    // Generate insights
    visitorData.insights = generateInsights(visitorData.detections);

    // Sort insights by priority
    visitorData.insights.sort((a, b) => {
      const priority = { high: 3, medium: 2, low: 1 };
      return priority[b.priority] - priority[a.priority];
    });

    // Log to console
    logConsoleEasterEggs(visitorData.detections);

    // Apply adaptive UI
    applyAdaptiveUI(visitorData.detections);

    // Show top insight as toast
    if (visitorData.insights.length > 0) {
      const topInsight = visitorData.insights[0];
      showToast(topInsight.message);
    }

    console.log('✅ Detection complete. Insights:', visitorData.insights);
  }

  // ============================================
  // EXPORT API
  // ============================================
  window.MetaDetection = {
    run: runDetection,
    getData: () => visitorData,
    showInsight: (index = 0) => {
      if (visitorData.insights[index]) {
        showToast(visitorData.insights[index].message);
      }
    },
    config: CONFIG
  };

  // ============================================
  // AUTO-RUN ON LOAD
  // ============================================
  window.addEventListener('DOMContentLoaded', () => {
    // Wait a bit before running to not block page load
    setTimeout(runDetection, 1000);
  });

})();
