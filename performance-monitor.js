/**
 * Performance Monitoring System
 * Tracks Core Web Vitals and provides performance insights
 *
 * Core Web Vitals:
 * - LCP (Largest Contentful Paint): Loading performance
 * - FID (First Input Delay): Interactivity
 * - CLS (Cumulative Layout Shift): Visual stability
 *
 * Additional Metrics:
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 * - Navigation Timing
 * - Resource Loading
 */

(function() {
  'use strict';

  // ============================================
  // STATE
  // ============================================
  const metrics = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    navigationTiming: {},
    resources: []
  };

  const thresholds = {
    lcp: { good: 2500, needsImprovement: 4000 }, // ms
    fid: { good: 100, needsImprovement: 300 }, // ms
    cls: { good: 0.1, needsImprovement: 0.25 }, // score
    fcp: { good: 1800, needsImprovement: 3000 }, // ms
    ttfb: { good: 800, needsImprovement: 1800 } // ms
  };

  // ============================================
  // CORE WEB VITALS
  // ============================================

  /**
   * Largest Contentful Paint (LCP)
   * Measures loading performance
   */
  function observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        metrics.lcp = Math.round(lastEntry.renderTime || lastEntry.loadTime);
        console.log(`[Performance] LCP: ${metrics.lcp}ms`, getRating('lcp', metrics.lcp));
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.warn('[Performance] LCP observation failed:', e);
    }
  }

  /**
   * First Input Delay (FID)
   * Measures interactivity
   */
  function observeFID() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach(entry => {
          if (entry.name === 'first-input') {
            metrics.fid = Math.round(entry.processingStart - entry.startTime);
            console.log(`[Performance] FID: ${metrics.fid}ms`, getRating('fid', metrics.fid));
          }
        });
      });

      observer.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.warn('[Performance] FID observation failed:', e);
    }
  }

  /**
   * Cumulative Layout Shift (CLS)
   * Measures visual stability
   */
  function observeCLS() {
    if (!('PerformanceObserver' in window)) return;

    try {
      let clsValue = 0;
      let sessionValue = 0;
      let sessionEntries = [];

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Only count layout shifts without recent user input
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

            // If the entry occurred less than 1 second after the previous entry
            // and less than 5 seconds after the first entry in the session,
            // include the entry in the current session
            if (sessionValue &&
                entry.startTime - lastSessionEntry.startTime < 1000 &&
                entry.startTime - firstSessionEntry.startTime < 5000) {
              sessionValue += entry.value;
              sessionEntries.push(entry);
            } else {
              sessionValue = entry.value;
              sessionEntries = [entry];
            }

            // Update CLS if this session value is the largest
            if (sessionValue > clsValue) {
              clsValue = sessionValue;
              metrics.cls = Math.round(clsValue * 1000) / 1000; // Round to 3 decimals
              console.log(`[Performance] CLS: ${metrics.cls}`, getRating('cls', metrics.cls));
            }
          }
        }
      });

      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.warn('[Performance] CLS observation failed:', e);
    }
  }

  /**
   * First Contentful Paint (FCP)
   * Measures when first content is rendered
   */
  function observeFCP() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            metrics.fcp = Math.round(entry.startTime);
            console.log(`[Performance] FCP: ${metrics.fcp}ms`, getRating('fcp', metrics.fcp));
          }
        });
      });

      observer.observe({ type: 'paint', buffered: true });
    } catch (e) {
      console.warn('[Performance] FCP observation failed:', e);
    }
  }

  /**
   * Time to First Byte (TTFB)
   * Measures server response time
   */
  function measureTTFB() {
    if (!('performance' in window) || !performance.timing) return;

    try {
      const timing = performance.timing;
      metrics.ttfb = timing.responseStart - timing.requestStart;

      console.log(`[Performance] TTFB: ${metrics.ttfb}ms`, getRating('ttfb', metrics.ttfb));
    } catch (e) {
      console.warn('[Performance] TTFB measurement failed:', e);
    }
  }

  // ============================================
  // NAVIGATION TIMING
  // ============================================
  function measureNavigationTiming() {
    if (!('performance' in window) || !performance.timing) return;

    try {
      const timing = performance.timing;
      const nav = {
        dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
        tcpConnection: timing.connectEnd - timing.connectStart,
        serverResponse: timing.responseEnd - timing.requestStart,
        domProcessing: timing.domComplete - timing.domLoading,
        pageLoad: timing.loadEventEnd - timing.navigationStart
      };

      metrics.navigationTiming = nav;

      console.log('[Performance] Navigation Timing:', nav);
    } catch (e) {
      console.warn('[Performance] Navigation timing measurement failed:', e);
    }
  }

  // ============================================
  // RESOURCE TIMING
  // ============================================
  function measureResourceTiming() {
    if (!('performance' in window) || !performance.getEntriesByType) return;

    try {
      const resources = performance.getEntriesByType('resource');
      const slowResources = resources
        .filter(r => r.duration > 100) // Resources taking more than 100ms
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 10); // Top 10 slowest

      metrics.resources = slowResources.map(r => ({
        name: r.name.split('/').pop() || r.name,
        type: r.initiatorType,
        duration: Math.round(r.duration),
        size: r.transferSize || 0
      }));

      if (slowResources.length > 0) {
        console.log('[Performance] Slowest Resources:', metrics.resources);
      }
    } catch (e) {
      console.warn('[Performance] Resource timing measurement failed:', e);
    }
  }

  // ============================================
  // RATING & REPORTING
  // ============================================
  function getRating(metric, value) {
    const threshold = thresholds[metric];
    if (!threshold) return '';

    if (value <= threshold.good) {
      return '✓ Good';
    } else if (value <= threshold.needsImprovement) {
      return '⚠ Needs Improvement';
    } else {
      return '✖ Poor';
    }
  }

  function generateReport() {
    console.group('📊 Performance Report');

    console.log('%c━━━ CORE WEB VITALS ━━━', 'color: #00ff00; font-weight: bold;');

    if (metrics.lcp !== null) {
      console.log(`LCP (Largest Contentful Paint): ${metrics.lcp}ms ${getRating('lcp', metrics.lcp)}`);
    }

    if (metrics.fid !== null) {
      console.log(`FID (First Input Delay): ${metrics.fid}ms ${getRating('fid', metrics.fid)}`);
    }

    if (metrics.cls !== null) {
      console.log(`CLS (Cumulative Layout Shift): ${metrics.cls} ${getRating('cls', metrics.cls)}`);
    }

    console.log('%c━━━ ADDITIONAL METRICS ━━━', 'color: #00ff00; font-weight: bold;');

    if (metrics.fcp !== null) {
      console.log(`FCP (First Contentful Paint): ${metrics.fcp}ms ${getRating('fcp', metrics.fcp)}`);
    }

    if (metrics.ttfb !== null) {
      console.log(`TTFB (Time to First Byte): ${metrics.ttfb}ms ${getRating('ttfb', metrics.ttfb)}`);
    }

    if (Object.keys(metrics.navigationTiming).length > 0) {
      console.log('%c━━━ NAVIGATION TIMING ━━━', 'color: #00ff00; font-weight: bold;');
      console.table(metrics.navigationTiming);
    }

    if (metrics.resources.length > 0) {
      console.log('%c━━━ SLOWEST RESOURCES ━━━', 'color: #00ff00; font-weight: bold;');
      console.table(metrics.resources);
    }

    console.log('%c━━━ RECOMMENDATIONS ━━━', 'color: #00ff00; font-weight: bold;');

    const recommendations = [];

    if (metrics.lcp > thresholds.lcp.needsImprovement) {
      recommendations.push('• LCP is slow - optimize images, fonts, and critical resources');
    }

    if (metrics.fid > thresholds.fid.needsImprovement) {
      recommendations.push('• FID is slow - reduce JavaScript execution time');
    }

    if (metrics.cls > thresholds.cls.needsImprovement) {
      recommendations.push('• CLS is high - set explicit dimensions for images and embeds');
    }

    if (metrics.ttfb > thresholds.ttfb.needsImprovement) {
      recommendations.push('• TTFB is slow - optimize server response time');
    }

    if (recommendations.length > 0) {
      recommendations.forEach(rec => console.log(rec));
    } else {
      console.log('✓ All metrics are within acceptable ranges!');
    }

    console.groupEnd();
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    console.log('[Performance] Monitoring initialized');

    // Observe Core Web Vitals
    observeLCP();
    observeFID();
    observeCLS();
    observeFCP();

    // Measure on load
    window.addEventListener('load', () => {
      setTimeout(() => {
        measureTTFB();
        measureNavigationTiming();
        measureResourceTiming();

        // Generate report after 3 seconds (allow time for metrics to settle)
        setTimeout(generateReport, 3000);
      }, 0);
    });

    // Generate final report before unload
    window.addEventListener('beforeunload', () => {
      if (metrics.lcp || metrics.fid || metrics.cls) {
        console.log('[Performance] Final metrics:', metrics);
      }
    });
  }

  // ============================================
  // EXPORTS
  // ============================================
  window.PerformanceMonitor = {
    metrics: metrics,
    generateReport: generateReport,
    getRating: getRating
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
