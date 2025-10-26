// ============================================
// OPS SYSTEM - Personal Maintenance Tracking
// Hidden from public, visible only with badge
// ============================================

(function() {
  'use strict';

  // ============================================
  // BADGE DETECTION
  // ============================================
  function isBadgeActive() {
    // Check for badge in localStorage (set via dev console)
    const badgeStatus = localStorage.getItem('ops-badge');
    // Check for URL parameter (?ops=true)
    const urlParams = new URLSearchParams(window.location.search);
    const urlBadge = urlParams.get('ops') === 'true';

    return badgeStatus === 'active' || urlBadge;
  }

  // Public API to enable badge
  window.enableOpsBadge = function() {
    localStorage.setItem('ops-badge', 'active');
    console.log('🔓 Ops badge enabled');
    location.reload();
  };

  window.disableOpsBadge = function() {
    localStorage.removeItem('ops-badge');
    console.log('🔒 Ops badge disabled');
    location.reload();
  };

  // Early exit if no badge
  if (!isBadgeActive()) {
    console.log('%c[OPS] Badge not detected. System inactive.', 'color: #808080; font-size: 10px');
    return;
  }

  console.log('%c[OPS] Badge detected. Initializing maintenance tracking...', 'color: #00ff00; font-weight: bold');

  // ============================================
  // MAINTENANCE ACTIVITIES CONFIG
  // ============================================
  const activities = {
    eating: {
      name: 'Fuel System',
      icon: '🍱',
      maxHours: 18,
      penaltyPerHour: 5,
      checkInterval: 2, // Warn 2h before threshold
      messages: {
        early: '⚙️ Fuel checkpoint in 2h',
        warning: '⚠️ Maintenance overdue: Fuel System',
        urgent: '🚨 SYSTEM CRITICAL: {hours}h without fuel',
        complete: '✅ Fuel system maintenance complete. Uptime optimized.'
      }
    },
    sleeping: {
      name: 'Shutdown Cycle',
      icon: '😴',
      maxHours: 20,
      penaltyPerHour: 8,
      checkInterval: 2,
      messages: {
        early: '⚙️ Shutdown cycle recommended in 2h',
        warning: '⚠️ Maintenance overdue: Shutdown Cycle',
        urgent: '🚨 SYSTEM DEGRADATION: {hours}h without shutdown',
        complete: '✅ Shutdown cycle complete. Systems refreshed.'
      }
    },
    showering: {
      name: 'Cooling System',
      icon: '🚿',
      maxHours: 36,
      penaltyPerHour: 3,
      checkInterval: 4,
      messages: {
        early: '⚙️ Cooling system maintenance due in 4h',
        warning: '⚠️ Maintenance overdue: Cooling System',
        urgent: '🚨 HYGIENE ALERT: {hours}h without cooling',
        complete: '✅ Cooling system maintenance complete.'
      }
    },
    water: {
      name: 'Hydration Module',
      icon: '💧',
      maxHours: 4,
      penaltyPerHour: 1,
      checkInterval: 1,
      messages: {
        early: '⚙️ Hydration checkpoint in 1h',
        warning: '⚠️ Hydration module overdue',
        urgent: '🚨 DEHYDRATION WARNING: {hours}h without water',
        complete: '✅ Hydration module replenished.'
      }
    }
  };

  // ============================================
  // STATE MANAGEMENT
  // ============================================
  let opsState = {
    activities: {},
    xp: 0,
    streak: 0,
    streakSaves: 1, // One grace miss per week
    lastPenaltyCheck: Date.now(),
    history: [] // For heatmap
  };

  // Load state from IndexedDB/localStorage
  function loadState() {
    const saved = localStorage.getItem('ops-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        opsState = { ...opsState, ...parsed };
      } catch (e) {
        console.error('[OPS] Failed to load state:', e);
      }
    }

    // Initialize activities if missing
    Object.keys(activities).forEach(key => {
      if (!opsState.activities[key]) {
        opsState.activities[key] = {
          lastCompleted: Date.now(),
          overdueHours: 0,
          totalCompletions: 0
        };
      }
    });
  }

  function saveState() {
    try {
      localStorage.setItem('ops-state', JSON.stringify(opsState));
    } catch (e) {
      console.error('[OPS] Failed to save state:', e);
    }
  }

  // ============================================
  // CORE TRACKING FUNCTIONS
  // ============================================
  function logActivity(activityKey, hours = null) {
    if (!activities[activityKey]) {
      console.error('[OPS] Unknown activity:', activityKey);
      return;
    }

    const now = Date.now();
    const activity = opsState.activities[activityKey];
    const config = activities[activityKey];

    // Log completion
    activity.lastCompleted = now;
    activity.totalCompletions++;
    activity.overdueHours = 0;

    // Add to history for heatmap
    opsState.history.push({
      activity: activityKey,
      timestamp: now,
      type: 'complete'
    });

    // Award XP (bonus if logging with duration)
    let xpGain = 10;
    if (hours && hours >= 6 && activityKey === 'sleeping') {
      xpGain = 20; // Bonus for good sleep
    }

    // Streak multiplier
    const streakMultiplier = Math.min(1 + (opsState.streak * 0.1), 2.0);
    xpGain = Math.floor(xpGain * streakMultiplier);

    updateXP(xpGain, `${config.name} completed`);

    saveState();

    // Show notification
    if (window.Notification && Notification.permission === 'granted') {
      new Notification('OPS System', {
        body: config.messages.complete,
        icon: config.icon,
        badge: config.icon
      });
    }

    // Update UI
    renderStatusWidget();

    console.log(`[OPS] ${config.name} logged (+${xpGain} XP)`);
  }

  function checkOverdue() {
    const now = Date.now();
    let anythingOverdue = false;

    Object.keys(activities).forEach(key => {
      const activity = opsState.activities[key];
      const config = activities[key];
      const hoursSince = (now - activity.lastCompleted) / (1000 * 60 * 60);
      const hoursOverdue = Math.max(0, hoursSince - config.maxHours);

      activity.overdueHours = hoursOverdue;

      if (hoursOverdue > 0) {
        anythingOverdue = true;

        // Send notifications
        if (hoursOverdue < 2) {
          sendNotification('warning', config.messages.warning, config.icon);
        } else if (hoursOverdue >= 2) {
          const urgentMsg = config.messages.urgent.replace('{hours}', Math.floor(hoursOverdue));
          sendNotification('urgent', urgentMsg, config.icon);
        }
      } else if (hoursSince >= config.maxHours - config.checkInterval) {
        // Early warning
        sendNotification('early', config.messages.early, config.icon);
      }
    });

    // Check streak
    if (anythingOverdue && opsState.streak > 0) {
      if (opsState.streakSaves > 0) {
        opsState.streakSaves--;
        sendNotification('info', `⚠️ Streak saved! (${opsState.streakSaves} saves remaining)`, '🛡️');
      } else {
        opsState.streak = 0;
        sendNotification('error', '💔 Streak broken! Back to day 0.', '📉');
      }
    } else if (!anythingOverdue && isNewDay()) {
      opsState.streak++;
      if (opsState.streak === 7) {
        opsState.streakSaves = 1; // Restore one save per week
      }
      updateXP(opsState.streak * 5, `${opsState.streak}-day streak bonus!`);
      sendNotification('success', `🔥 ${opsState.streak}-day streak! Infrastructure reliability: ${(99 + opsState.streak * 0.01).toFixed(2)}%`, '🏆');
    }

    saveState();
  }

  function calculatePenalties() {
    let totalPenalty = 0;

    Object.keys(activities).forEach(key => {
      const activity = opsState.activities[key];
      const config = activities[key];

      if (activity.overdueHours > 0) {
        totalPenalty += Math.floor(activity.overdueHours * config.penaltyPerHour);
      }
    });

    return totalPenalty;
  }

  function updateXP(amount, reason) {
    opsState.xp += amount;
    console.log(`[OPS] XP ${amount > 0 ? '+' : ''}${amount} (${reason}) → ${opsState.xp} total`);

    // Check achievements
    if (window.AchievementSystem) {
      if (opsState.xp >= 1000) {
        window.AchievementSystem.unlock('ops-veteran');
      }
      if (opsState.streak >= 30) {
        window.AchievementSystem.unlock('ops-master');
      }
    }
  }

  function isNewDay() {
    const lastCheck = new Date(opsState.lastPenaltyCheck);
    const now = new Date();
    return lastCheck.getDate() !== now.getDate();
  }

  function calculateRisk() {
    let risk = 0;

    Object.keys(activities).forEach(key => {
      const activity = opsState.activities[key];
      const config = activities[key];

      if (key === 'eating') risk += activity.overdueHours * 3;
      else if (key === 'sleeping') risk += activity.overdueHours * 5;
      else if (key === 'showering') risk += activity.overdueHours * 1;
      else if (key === 'water') risk += activity.overdueHours * 2;
    });

    return Math.min(Math.floor(risk), 100);
  }

  function getRiskLevel(risk) {
    if (risk >= 61) return { level: 'CRITICAL', color: '#ff0000', text: 'Crash Imminent' };
    if (risk >= 41) return { level: 'WARNING', color: '#ff8800', text: 'System Degradation' };
    if (risk >= 21) return { level: 'CAUTION', color: '#ffaa00', text: 'Minor Issues' };
    return { level: 'OPTIMAL', color: '#00ff00', text: 'All Systems Nominal' };
  }

  // ============================================
  // NOTIFICATIONS
  // ============================================
  function sendNotification(type, message, icon) {
    // Request permission if not granted
    if (window.Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Browser notification
    if (window.Notification && Notification.permission === 'granted') {
      const title = type === 'urgent' ? 'OPS ALERT' : 'OPS System';
      new Notification(title, {
        body: message,
        icon: icon || '⚙️',
        badge: icon || '⚙️',
        tag: 'ops-notification',
        requireInteraction: type === 'urgent'
      });
    }

    // Console log
    const colors = {
      early: '#00ffff',
      warning: '#ffaa00',
      urgent: '#ff0000',
      success: '#00ff00',
      info: '#0099ff',
      error: '#ff0000'
    };
    console.log(`%c[OPS] ${message}`, `color: ${colors[type] || '#808080'}; font-weight: bold`);
  }

  // ============================================
  // UI RENDERING
  // ============================================
  function renderStatusWidget() {
    let widget = document.getElementById('ops-status-widget');

    if (!widget) {
      widget = document.createElement('div');
      widget.id = 'ops-status-widget';
      widget.className = 'ops-widget collapsed';
      document.body.appendChild(widget);
    }

    const risk = calculateRisk();
    const riskInfo = getRiskLevel(risk);
    const nextDue = getNextDueActivity();
    const penalties = calculatePenalties();

    widget.innerHTML = `
      <div class="ops-widget-header" onclick="window.OpsSystem.toggleWidget()">
        <span class="ops-icon">⚙️</span>
        <span class="ops-title">OPS</span>
        <span class="ops-risk" style="color: ${riskInfo.color}">${risk}%</span>
        <span class="ops-expand">▼</span>
      </div>
      <div class="ops-widget-body">
        <div class="ops-stat">
          <span class="ops-stat-label">System Status:</span>
          <span class="ops-stat-value" style="color: ${riskInfo.color}">${riskInfo.text}</span>
        </div>
        <div class="ops-stat">
          <span class="ops-stat-label">Next Due:</span>
          <span class="ops-stat-value">${nextDue}</span>
        </div>
        <div class="ops-stat">
          <span class="ops-stat-label">Streak:</span>
          <span class="ops-stat-value">${opsState.streak} days 🔥</span>
        </div>
        <div class="ops-stat">
          <span class="ops-stat-label">XP Today:</span>
          <span class="ops-stat-value">${opsState.xp - (penalties * 2)} (${penalties > 0 ? `-${penalties} penalty` : 'no penalties'})</span>
        </div>
        <div class="ops-actions">
          <button class="ops-btn" onclick="window.OpsSystem.openDashboard()">Full Dashboard</button>
          <button class="ops-btn" onclick="window.OpsSystem.quickLog()">Quick Log</button>
        </div>
      </div>
    `;
  }

  function getNextDueActivity() {
    let closest = null;
    let minTime = Infinity;

    Object.keys(activities).forEach(key => {
      const activity = opsState.activities[key];
      const config = activities[key];
      const timeUntilDue = config.maxHours - ((Date.now() - activity.lastCompleted) / (1000 * 60 * 60));

      if (timeUntilDue < minTime && timeUntilDue > 0) {
        minTime = timeUntilDue;
        closest = config.name;
      }
    });

    if (!closest) return 'All overdue!';

    const hours = Math.floor(minTime);
    const minutes = Math.floor((minTime - hours) * 60);
    return `${closest} in ${hours}h ${minutes}m`;
  }

  function toggleWidget() {
    const widget = document.getElementById('ops-status-widget');
    if (widget) {
      widget.classList.toggle('collapsed');
    }
  }

  function quickLog() {
    // Open command palette with "log" prefix
    if (window.CommandPalette) {
      window.CommandPalette.open();
      setTimeout(() => {
        const input = document.querySelector('.palette-input');
        if (input) {
          input.value = 'log:';
          input.dispatchEvent(new Event('input'));
        }
      }, 100);
    }
  }

  function openDashboard() {
    // Create full dashboard modal
    const overlay = document.createElement('div');
    overlay.className = 'ops-dashboard-overlay';
    overlay.innerHTML = `
      <div class="ops-dashboard">
        <div class="ops-dashboard-header">
          <h2>⚙️ OPS DASHBOARD - SYSTEM MAINTENANCE</h2>
          <button class="ops-close" onclick="this.closest('.ops-dashboard-overlay').remove()">[×]</button>
        </div>
        <div class="ops-dashboard-content">
          ${renderDashboardContent()}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('active'), 10);
  }

  function renderDashboardContent() {
    const risk = calculateRisk();
    const riskInfo = getRiskLevel(risk);

    let activitiesHTML = '';
    Object.keys(activities).forEach(key => {
      const activity = opsState.activities[key];
      const config = activities[key];
      const hoursSince = (Date.now() - activity.lastCompleted) / (1000 * 60 * 60);
      const hoursUntilDue = Math.max(0, config.maxHours - hoursSince);
      const isOverdue = hoursUntilDue === 0;

      const progressPercent = Math.min(100, (hoursSince / config.maxHours) * 100);
      const progressColor = isOverdue ? '#ff0000' : (progressPercent > 75 ? '#ff8800' : '#00ff00');

      activitiesHTML += `
        <div class="ops-activity ${isOverdue ? 'overdue' : ''}">
          <div class="ops-activity-header">
            <span class="ops-activity-icon">${config.icon}</span>
            <span class="ops-activity-name">${config.name}</span>
            <button class="ops-log-btn" onclick="window.OpsSystem.log('${key}')">✓ Log</button>
          </div>
          <div class="ops-activity-status">
            ${isOverdue
              ? `<span class="overdue-text">⚠️ OVERDUE by ${Math.floor(activity.overdueHours)}h</span>`
              : `<span>Due in ${Math.floor(hoursUntilDue)}h ${Math.floor((hoursUntilDue % 1) * 60)}m</span>`
            }
          </div>
          <div class="ops-progress-bar">
            <div class="ops-progress-fill" style="width: ${progressPercent}%; background: ${progressColor};"></div>
          </div>
          <div class="ops-activity-stats">
            <span>Total: ${activity.totalCompletions}</span>
            <span>Last: ${new Date(activity.lastCompleted).toLocaleString()}</span>
          </div>
        </div>
      `;
    });

    return `
      <div class="ops-risk-meter">
        <h3>SYSTEM RISK METER</h3>
        <div class="risk-bar">
          <div class="risk-fill" style="width: ${risk}%; background: ${riskInfo.color};"></div>
        </div>
        <div class="risk-label" style="color: ${riskInfo.color}">
          ${riskInfo.level}: ${riskInfo.text} (${risk}%)
        </div>
      </div>

      <div class="ops-stats-grid">
        <div class="ops-stat-box">
          <div class="stat-value">${opsState.xp}</div>
          <div class="stat-label">Total XP</div>
        </div>
        <div class="ops-stat-box">
          <div class="stat-value">${opsState.streak} 🔥</div>
          <div class="stat-label">Day Streak</div>
        </div>
        <div class="ops-stat-box">
          <div class="stat-value">${opsState.streakSaves} 🛡️</div>
          <div class="stat-label">Streak Saves</div>
        </div>
        <div class="ops-stat-box">
          <div class="stat-value">${calculatePenalties()}</div>
          <div class="stat-label">Active Penalties</div>
        </div>
      </div>

      <div class="ops-activities">
        <h3>MAINTENANCE ACTIVITIES</h3>
        ${activitiesHTML}
      </div>

      <div class="ops-heatmap">
        <h3>MAINTENANCE HEATMAP</h3>
        <div class="heatmap-placeholder">
          [Heatmap visualization - ${opsState.history.length} logged activities]
        </div>
      </div>
    `;
  }

  // ============================================
  // COMMAND PALETTE INTEGRATION
  // ============================================
  function registerCommands() {
    if (!window.CommandPalette) {
      console.warn('[OPS] Command palette not found');
      return;
    }

    // Add ops commands to existing command palette
    const opsCommands = {
      'log:meal': {
        icon: '🍱',
        label: 'Log Meal',
        action: () => logActivity('eating')
      },
      'log:sleep': {
        icon: '😴',
        label: 'Log Sleep',
        action: () => {
          const hours = prompt('Hours slept?', '7');
          logActivity('sleeping', parseInt(hours) || null);
        }
      },
      'log:shower': {
        icon: '🚿',
        label: 'Log Shower',
        action: () => logActivity('showering')
      },
      'log:water': {
        icon: '💧',
        label: 'Log Water',
        action: () => logActivity('water')
      },
      'ops:status': {
        icon: '⚙️',
        label: 'Check OPS Status',
        action: () => openDashboard()
      },
      'ops:dashboard': {
        icon: '📊',
        label: 'Open OPS Dashboard',
        action: () => openDashboard()
      }
    };

    // Extend command palette
    Object.assign(window.CommandPalette.commands || {}, opsCommands);

    console.log('[OPS] Commands registered with palette');
  }

  // ============================================
  // SERVICE WORKER INTEGRATION
  // ============================================
  function initServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        console.log('[OPS] Service worker ready');

        // Set up periodic background sync (if supported)
        if ('periodicSync' in registration) {
          registration.periodicSync.register('ops-check', {
            minInterval: 30 * 60 * 1000 // 30 minutes
          }).catch(err => console.warn('[OPS] Periodic sync not available:', err));
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'ops-check') {
          checkOverdue();
        }
      });
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    loadState();
    renderStatusWidget();
    registerCommands();
    initServiceWorker();

    // Check overdue every 30 minutes
    setInterval(() => {
      checkOverdue();
      renderStatusWidget();
    }, 30 * 60 * 1000);

    // Initial check
    checkOverdue();

    // Request notification permission
    if (window.Notification && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('[OPS] Notification permission:', permission);
      });
    }

    console.log('[OPS] System initialized. Monitoring active.');
  }

  // ============================================
  // PUBLIC API
  // ============================================
  window.OpsSystem = {
    log: logActivity,
    checkOverdue,
    openDashboard,
    toggleWidget,
    quickLog,
    getState: () => opsState,
    exportData: () => JSON.stringify(opsState, null, 2)
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Console welcome
  console.log('%c╔═══════════════════════════════════════╗', 'color: #00ff00');
  console.log('%c║  ⚙️  OPS SYSTEM ACTIVE               ║', 'color: #00ff00; font-weight: bold');
  console.log('%c╠═══════════════════════════════════════╣', 'color: #00ff00');
  console.log('%c║  Personal maintenance tracking        ║', 'color: #808080');
  console.log('%c║  Type: window.OpsSystem for API       ║', 'color: #808080');
  console.log('%c║  Cmd+K → type "log:" for quick access ║', 'color: #808080');
  console.log('%c╚═══════════════════════════════════════╝', 'color: #00ff00');

})();
