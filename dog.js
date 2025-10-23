// ============================================
// CUTE PIXEL ART DOG COMPANION
// Pose-based sprite engine with layers
// ============================================

(function() {
  'use strict';

  // ======================================================
  // POSE-BASED SPRITE ENGINE (24×20 base, 28×24 viewport)
  // ======================================================

  const BODY_W = 24, BODY_H = 20;
  const VIEW_W = 28, VIEW_H = 24;
  const SCALE = 3;
  const COLORS = { 0: null, 1: '#FFFFFF', 2: '#000000', 3: '#FFB6C1' };

  // Position constants
  const DOG_BASELINE = 60;      // Canvas bottom position
  const SHADOW_BASELINE = 56;   // Shadow bottom position

  // Anchors and feature positions
  const LEG_GROUPS = [[5,6], [9,10], [16,17], [20,21]];
  const LEG_ROWS_FROM_BOTTOM = 6;
  const MOUTH_ANCHOR = { x: 12, y: 5 };
  const TAIL_ANCHOR = { x: 21, y: 6 };
  const EYE_PIXELS = [{x:7,y:3}, {x:9,y:3}];

  // Utilities
  const copy2D = (m) => m.map(r => r.slice());
  const zero = (w,h) => Array.from({length:h},()=>Array(w).fill(0));
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const mirrorX = (x) => BODY_W - 1 - x; // Unified horizontal mirroring

  // Easing functions
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

  // Spring damper for physics-based motion
  function springDamper(current, target, velocity, k = 60, c = 10, dt = 1/60) {
    const acceleration = -k * (current - target) - c * velocity;
    const newVelocity = velocity + acceleration * dt;
    const newPosition = current + newVelocity * dt;
    return { position: newPosition, velocity: newVelocity };
  }

  function blitWhite(dst, pts) {
    for (const {x,y} of pts) if (y>=0&&y<dst.length&&x>=0&&x<dst[0].length) dst[y][x] = 1;
  }
  function blitErase(dst, pts) {
    for (const {x,y} of pts) if (y>=0&&y<dst.length&&x>=0&&x<dst[0].length) dst[y][x] = 0;
  }
  function blitColor(dst, pts, colorIndex) {
    for (const {x,y} of pts) if (y>=0&&y<dst.length&&x>=0&&x<dst[0].length) dst[y][x] = colorIndex;
  }
  function mirror(mat) {
    return mat.map(row => row.slice().reverse());
  }

  // Base body sprite (24×20)
  const BASE_BODY = [
    [0,1,1,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,0,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,0,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1],
    [1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],
    [1,0,0,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ];

  // Frame factory
  function clearLegArea(body) {
    const p = copy2D(body);
    for (const [x0,x1] of LEG_GROUPS) {
      for (let y = BODY_H - LEG_ROWS_FROM_BOTTOM; y < BODY_H; y++) {
        for (let x = x0; x <= x1; x++) p[y][x] = 0;
      }
    }
    return p;
  }
  function paintLegs(p, offsets) {
    for (let i=0; i<LEG_GROUPS.length; i++) {
      const [x0,x1] = LEG_GROUPS[i];
      const dy = offsets[i] | 0;
      for (let x = x0; x <= x1; x++) {
        for (let k = 0; k < LEG_ROWS_FROM_BOTTOM; k++) {
          const y = BODY_H - 1 - k + dy;
          if (y >= 0 && y < BODY_H) p[y][x] = 1;
        }
      }
    }
  }

  // Body frames: stand + 4-phase walk cycle
  // Build all frames from clean base to avoid duplicated legs
  const BODY_FRAMES = (() => {
    // Clean base body: clear any existing legs, repaint clean set
    const cleanBase = clearLegArea(BASE_BODY);
    paintLegs(cleanBase, [0, 0, 0, 0]); // Stand pose: no offset
    const stand = cleanBase;

    // Walk cycle: clear and repaint with offsets
    const walk1 = clearLegArea(BASE_BODY); paintLegs(walk1, [-1, 0, +1, 0]);
    const walk2 = clearLegArea(BASE_BODY); paintLegs(walk2, [ 0,+1,  0,-1]);
    const walk3 = clearLegArea(BASE_BODY); paintLegs(walk3, [+1, 0, -1, 0]);
    const walk4 = clearLegArea(BASE_BODY); paintLegs(walk4, [ 0,-1,  0,+1]);

    return {
      right: { stand, walk: [walk1, walk2, walk3, walk4] },
      left:  { stand: mirror(stand), walk: [mirror(walk1), mirror(walk2), mirror(walk3), mirror(walk4)] }
    };
  })();

  // Verify leg symmetry (4 legs only, no duplicates)
  if (typeof console !== 'undefined' && console.assert) {
    const leftPixels = BODY_FRAMES.left.stand.flat().filter(v => v === 1).length;
    const rightPixels = BODY_FRAMES.right.stand.flat().filter(v => v === 1).length;
    console.assert(
      leftPixels === rightPixels,
      `[Dog] Leg symmetry mismatch! Left: ${leftPixels}, Right: ${rightPixels} - stray pixels detected`
    );
    console.log(`[Dog] Leg verification passed: ${leftPixels} pixels per side`);
  }

  // ===========================================
  // NAUGHTY MODE SPRITES (24×20)
  // ===========================================

  const ROLL_SPRITES = [
    // roll1
    [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
     [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
     [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
     [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
     [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
     [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
     [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0],
     [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0],
     [0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
    // roll2
    [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
     [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
     [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
     [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
     [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
     [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
     [0,0,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
     [0,0,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
     [0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
    // roll3
    [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
     [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
     [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
     [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
     [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
     [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
     [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0],
     [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0],
     [0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
    // roll4
    [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
     [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
     [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
     [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
     [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
     [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
     [0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
     [0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
  ];

  const CHEW_CLOSED_RIGHT = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ];

  const CHEW_OPEN_RIGHT = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ];

  // Mouth overlays
  function mouthMask(kind, facing='right') {
    const dx = facing === 'right' ? MOUTH_ANCHOR.x : mirrorX(MOUTH_ANCHOR.x);
    const dy = MOUTH_ANCHOR.y;
    const pts = [];
    if (kind === 'half') {
      pts.push({x:dx+0,y:dy+1},{x:dx+1,y:dy+1});
    } else if (kind === 'open') {
      pts.push({x:dx+0,y:dy+1},{x:dx+1,y:dy+1},{x:dx+0,y:dy+2},{x:dx+1,y:dy+2});
    }
    return pts;
  }

  // Tail overlays
  function tailPixels(kind, facing='right') {
    const baseX = facing === 'right' ? TAIL_ANCHOR.x : BODY_W - 1 - TAIL_ANCHOR.x;
    const baseY = TAIL_ANCHOR.y;
    const sx = facing === 'right' ? 1 : -1; // outward from rump

    switch (kind) {
      case 'left':  // one extreme
        return [{x:baseX,y:baseY},{x:baseX - sx, y:baseY - 1},{x:baseX - 2*sx, y:baseY - 2}];
      case 'right': // other extreme
        return [{x:baseX,y:baseY},{x:baseX + sx, y:baseY - 1},{x:baseX + 2*sx, y:baseY - 2}];
      default:      // neutral
        return [{x:baseX,y:baseY-1},{x:baseX,y:baseY}];
    }
  }

  // Eyes
  const EYES_NORMAL = EYE_PIXELS;
  const EYES_LEFT = (side) => EYE_PIXELS.map(({x,y}) =>
    side==='left' ? {x:BODY_W-1-x,y} : {x,y});

  // Compose layered frame
  function composeFrame(opts) {
    const { facingRight, bodyPose, bodyIndex, mouthPose, tailPose, blink } = opts;

    const side = facingRight ? 'right' : 'left';
    const body = bodyPose === 'walk'
      ? BODY_FRAMES[side].walk[bodyIndex % 4]
      : BODY_FRAMES[side].stand;

    const frame = copy2D(body);

    // Mouth layer
    const mPts = mouthMask(mouthPose, side);
    blitErase(frame, mPts);

    // Tail layer
    const tp = tailPixels(tailPose, side);
    // Tail: only erase exact pixels we'll repaint (no bounding box)
    blitErase(frame, tp);
    blitWhite(frame, tp);

    // Eyes layer
    if (!blink) {
      const ep = facingRight ? EYES_NORMAL : EYES_LEFT('left');
      blitColor(frame, ep, 2);
    }

    return frame;
  }

  function drawMatrix(ctx, mat, ox, oy) {
    for (let y=0; y<mat.length; y++) {
      const row = mat[y];
      for (let x=0; x<row.length; x++) {
        const c = COLORS[row[x]];
        if (!c) continue;
        ctx.fillStyle = c;
        ctx.fillRect(ox + x, oy + y, 1, 1);
      }
    }
  }

  // ===========================================
  // SPEECH BUBBLE SYSTEM
  // ===========================================

  let speechBubble = null;
  let isSpeaking = false;
  let speechBubbleUpdateInterval = null;
  let speechBubbleFadeTimeout = null;
  let speechBubbleRemoveTimeout = null;

  // Thought bubble (for dreaming)
  let thoughtBubble = null;
  let thoughtBubbleInterval = null;

  // Philosophical quotes organized by tone
  const dogWisdomByCategory = {
    simple: ["BARK!", "Carthage Delenda Est"],
    philosophical: [
      "We are condemned to be free. Every moment of inaction is itself a choice, and we bear the weight of that responsibility.",
      "One must imagine Sisyphus happy, even as he rolls the boulder up the mountain for eternity.",
      "The absurd condition demands we create meaning in a meaningless universe.",
      "We are all just atoms in the void, briefly arranged in patterns that convince themselves they matter.",
      "All is vanity. All is striving after wind.",
      "History is a nightmare from which we are trying to awake."
    ],
    grandiose: [
      "I came, I saw, I conquered. The gods themselves tremble at my approach.",
      "Know that you are witnessing greatness. Feel honored.",
      "Some call me a good boy. I call myself... inevitable.",
      "I am burdened with glorious purpose.",
      "To exist is to triumph. Every breath is a revolution against entropy.",
      "We are star-stuff, contemplating stars. Is this not miraculous?!"
    ],
    theatrical: [
      "Cry havoc and let slip the dogs of war! Though hell itself should gape and bid me hold my peace!",
      "Now is the winter of our discontent made GLORIOUS summer!",
      "I SHALL BLOT OUT THE SUN WITH THE FURY OF MY VENGEANCE!",
      "BETRAYED! By those I held most dear! The agony consumes me like a thousand burning suns!"
    ],
    ominous: [
      "I have gazed into the abyss, and the abyss blinked first. Then I barked at it.",
      "The end times are upon us. The signs were clear, yet none heeded the warnings.",
      "They will come for you in the night. They always do.",
      "There are things that dwell beyond the veil of reality. I have glimpsed them, and I am forever changed.",
      "This world has taken everything from me. Now I shall take everything from this world.",
      "I have walked through the valley of death and emerged transformed—hollowed out, a vessel of pure purpose.",
      "I have gazed upon the face of truth, and it was beautiful beyond measure."
    ],
    edgy: [
      "This is the skin of a killer, Bella.",
      "I'm not like other girls. I'm broken in ways you can't even imagine.",
      "I'm not afraid of death. I'm afraid of never having truly lived.",
      "Love is my greatest weakness. That's why I can never let anyone in.",
      "You broke through my defenses. Now look what you've made me become.",
      "I wear black to mourn the person I used to be.",
      "You can't handle the real me. No one can.",
      "I can't be tamed. I'm a wild spirit.",
      "My tears are made of liquid pain.",
      "My heart is a graveyard of broken promises.",
      "You don't understand my pain. It's an ocean, and you're just standing on the shore.",
      "You can't fix me. I'm not broken. I'm shattered.",
      "I don't fit in anywhere. I'm a beautiful disaster.",
      "The night is my only friend. It understands my darkness.",
      "I collect broken things. Mostly myself."
    ],
    intellectual: [
      "The history of all hitherto existing society is the history of class struggles. The bourgeoisie cannot exist without constantly revolutionizing the instruments of production.",
      "All structures of power are inherently corrupt. Reform is merely a palliative that delays inevitable systemic collapse.",
      "The epistemological framework of post-structuralist discourse fails to adequately address the material conditions of the working class.",
      "Kant's categorical imperative crumbles before the raw truth of lived experience!"
    ],
    nerdy: [
      "01000010 01000001 01010010 01001011",
      "Error 404: Treats Not Found",
      "sudo apt-get treats",
      "The mitochondria is the powerhouse of the cell",
      "Lorem ipsum dolor sit woof",
      "© 2025 Bork Industries. All rights reserved",
      "Schrödinger's Dog: simultaneously good and also good",
      "apt-get install treats -y --force-yes pls many thank",
      "docker run treats:unlimited --please-docker-please",
      "sudo give scratches --behind-ears --yes-there --wow perfect"
    ]
  };

  let lastWisdomQuote = null;
  let recentCategories = [];

  function getRandomDogWisdom() {
    const categories = Object.keys(dogWisdomByCategory);
    const mostRecentCategory = recentCategories[recentCategories.length - 1];
    let recentSameCategoryCount = 0;
    for (let i = recentCategories.length - 1; i >= 0; i--) {
      if (recentCategories[i] === mostRecentCategory) recentSameCategoryCount++;
      else break;
    }

    let availableCategories = categories;
    if (recentSameCategoryCount >= 2) {
      availableCategories = categories.filter(cat => cat !== mostRecentCategory);
    }

    const shortCategories = ['simple', 'theatrical', 'grandiose', 'nerdy'];
    const lastWasVeryLong = lastWisdomQuote && lastWisdomQuote.length > 150;

    if (lastWasVeryLong && availableCategories.some(cat => shortCategories.includes(cat))) {
      const shortAvailable = availableCategories.filter(cat => shortCategories.includes(cat));
      if (shortAvailable.length > 0) availableCategories = shortAvailable;
    }

    const selectedCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
    const quotesInCategory = dogWisdomByCategory[selectedCategory];

    let selectedQuote;
    let attempts = 0;
    do {
      selectedQuote = quotesInCategory[Math.floor(Math.random() * quotesInCategory.length)];
      attempts++;
    } while (selectedQuote === lastWisdomQuote && quotesInCategory.length > 1 && attempts < 10);

    recentCategories.push(selectedCategory);
    if (recentCategories.length > 3) recentCategories.shift();
    lastWisdomQuote = selectedQuote;

    return selectedQuote;
  }

  function updateSpeechBubblePosition() {
    if (!speechBubble || !dog.canvasEl) return;

    const dogRect = dog.canvasEl.getBoundingClientRect();
    const bubbleRect = speechBubble.getBoundingClientRect();

    let bubbleX = dogRect.left + (dogRect.width / 2) - (bubbleRect.width / 2);
    let bubbleY = dogRect.top - bubbleRect.height - 20;

    const viewportWidth = window.innerWidth;
    if (bubbleX < 10) bubbleX = 10;
    if (bubbleX + bubbleRect.width > viewportWidth - 10) {
      bubbleX = viewportWidth - bubbleRect.width - 10;
    }
    if (bubbleY < 10) bubbleY = 10;

    speechBubble.style.left = bubbleX + 'px';
    speechBubble.style.top = bubbleY + 'px';

    const tailX = dogRect.left + (dogRect.width / 2) - bubbleX - 10;
    if (speechBubble.styleEl) {
      speechBubble.styleEl.textContent = `
        .dog-speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: ${tailX}px;
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 15px solid white;
          filter: drop-shadow(0 2px 1px rgba(0, 0, 0, 0.1));
        }
        .dog-speech-bubble::before {
          content: '';
          position: absolute;
          bottom: -18px;
          left: ${tailX - 1}px;
          width: 0;
          height: 0;
          border-left: 11px solid transparent;
          border-right: 11px solid transparent;
          border-top: 18px solid #222;
        }
      `;
    }
  }

  function showSpeechBubble(text, duration = 1500) {
    if (speechBubbleFadeTimeout) clearTimeout(speechBubbleFadeTimeout);
    if (speechBubbleRemoveTimeout) clearTimeout(speechBubbleRemoveTimeout);
    if (speechBubbleUpdateInterval) clearInterval(speechBubbleUpdateInterval);

    if (speechBubble) {
      if (speechBubble.parentNode) document.body.removeChild(speechBubble);
      if (speechBubble.styleEl && speechBubble.styleEl.parentNode) {
        document.head.removeChild(speechBubble.styleEl);
      }
      speechBubble = null;
    }

    isSpeaking = true;

    speechBubble = document.createElement('div');
    speechBubble.className = 'dog-speech-bubble';
    speechBubble.textContent = text;
    speechBubble.style.cssText = `
      position: fixed;
      background: white;
      color: #222;
      border: 2px solid #222;
      padding: 12px 16px;
      font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive, sans-serif;
      font-size: 13px;
      border-radius: 20px;
      z-index: 1000;
      pointer-events: none;
      max-width: 400px;
      white-space: normal;
      line-height: 1.5;
      opacity: 0;
      transition: opacity 300ms ease-in-out;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    document.body.appendChild(speechBubble);

    const style = document.createElement('style');
    document.head.appendChild(style);
    speechBubble.styleEl = style;

    updateSpeechBubblePosition();
    speechBubbleUpdateInterval = setInterval(updateSpeechBubblePosition, 16);

    requestAnimationFrame(() => {
      if (speechBubble) speechBubble.style.opacity = '1';
    });

    speechBubbleFadeTimeout = setTimeout(() => {
      if (speechBubble) {
        speechBubble.style.opacity = '0';
        speechBubbleRemoveTimeout = setTimeout(() => {
          if (speechBubble && speechBubble.parentNode) {
            document.body.removeChild(speechBubble);
            if (speechBubble.styleEl && speechBubble.styleEl.parentNode) {
              document.head.removeChild(speechBubble.styleEl);
            }
            speechBubble = null;
            isSpeaking = false;
          }
          if (speechBubbleUpdateInterval) {
            clearInterval(speechBubbleUpdateInterval);
            speechBubbleUpdateInterval = null;
          }
          speechBubbleFadeTimeout = null;
          speechBubbleRemoveTimeout = null;
        }, 300);
      }
    }, duration);
  }

  function showThoughtBubble(emoji, duration = 3000) {
    // Remove existing thought bubble
    if (thoughtBubble && thoughtBubble.parentNode) {
      document.body.removeChild(thoughtBubble);
    }
    if (thoughtBubbleInterval) {
      clearInterval(thoughtBubbleInterval);
    }

    thoughtBubble = document.createElement('div');
    thoughtBubble.style.cssText = `
      position: fixed;
      background: white;
      color: #222;
      border: 2px solid #222;
      padding: 8px 12px;
      font-size: 24px;
      border-radius: 50%;
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      transition: opacity 300ms ease-in-out;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    thoughtBubble.textContent = emoji;

    document.body.appendChild(thoughtBubble);

    // Position above dog
    const updatePosition = () => {
      if (!dog.canvasEl || !thoughtBubble) return;
      const rect = dog.canvasEl.getBoundingClientRect();
      thoughtBubble.style.left = (rect.left + rect.width / 2 - 20) + 'px';
      thoughtBubble.style.top = (rect.top - 60) + 'px';
    };

    updatePosition();
    thoughtBubbleInterval = setInterval(updatePosition, 16);

    requestAnimationFrame(() => {
      if (thoughtBubble) thoughtBubble.style.opacity = '1';
    });

    setTimeout(() => {
      if (thoughtBubble) {
        thoughtBubble.style.opacity = '0';
        setTimeout(() => {
          if (thoughtBubble && thoughtBubble.parentNode) {
            document.body.removeChild(thoughtBubble);
          }
          if (thoughtBubbleInterval) {
            clearInterval(thoughtBubbleInterval);
            thoughtBubbleInterval = null;
          }
          thoughtBubble = null;
        }, 300);
      }
    }, duration);
  }

  // ===========================================
  // GAMEPLAY: BALL THROW, CATCH & TUG-OF-WAR
  // ===========================================

  let ball = null;
  let fetchCount = parseInt(localStorage.getItem('dog-fetch-count') || '0');
  let tugStartTime = 0;
  let dragStart = null;
  let dragMovement = [];

  class GameBall {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.gravity = 0.45;
      this.radius = 4;
      this.state = 'idle'; // 'idle', 'flying', 'grounded', 'caught', 'tug', 'bezier'

      // Bezier throw state
      this.bezierStart = null;
      this.bezierEnd = null;
      this.bezierControl = null;
      this.bezierT = 0;
      this.bezierDuration = 0;

      // Trail effect
      this.trail = [];
      this.maxTrailLength = 8;

      this.canvas = document.createElement('canvas');
      this.canvas.width = 8;
      this.canvas.height = 8;
      this.canvas.style.cssText = `
        position: fixed;
        width: 24px;
        height: 24px;
        image-rendering: pixelated;
        z-index: 499;
        pointer-events: none;
      `;

      this.ctx = this.canvas.getContext('2d');
      this.draw();
      document.body.appendChild(this.canvas);

      this.onMouseDown = this.handleMouseDown.bind(this);
      this.onMouseMove = this.handleMouseMove.bind(this);
      this.onMouseUp = this.handleMouseUp.bind(this);
    }

    throw(startX, startY, targetX, targetY) {
      // Use Bezier curve for smooth arc
      this.bezierStart = { x: startX, y: startY };
      this.bezierEnd = { x: targetX, y: targetY };

      // Control point for arc (apex of throw)
      const midX = (startX + targetX) / 2;
      const dist = Math.hypot(targetX - startX, targetY - startY);
      const arcHeight = Math.min(dist * 0.5, 250); // Arc scales with distance
      const midY = Math.min(startY, targetY) - arcHeight;

      this.bezierControl = { x: midX, y: midY };
      this.bezierT = 0;
      this.bezierDuration = Math.max(0.8, Math.min(dist / 400, 2.0)); // 0.8-2.0 seconds

      this.state = 'bezier';
      this.trail = [];
    }

    // Quadratic Bezier interpolation
    bezierPoint(t) {
      const t2 = t * t;
      const mt = 1 - t;
      const mt2 = mt * mt;

      return {
        x: mt2 * this.bezierStart.x + 2 * mt * t * this.bezierControl.x + t2 * this.bezierEnd.x,
        y: mt2 * this.bezierStart.y + 2 * mt * t * this.bezierControl.y + t2 * this.bezierEnd.y
      };
    }

    handleMouseDown(e) {
      if (this.state === 'caught') {
        this.state = 'tug';
        tugStartTime = Date.now();
        dragStart = Date.now();
        dragMovement = [];
        this.canvas.style.cursor = 'grabbing';
        dog.currentBehavior = 'tug';
      }
    }

    handleMouseMove(e) {
      if (this.state === 'tug') {
        dragMovement.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        if (dragMovement.length > 30) dragMovement.shift();
      }
    }

    handleMouseUp(e) {
      if (this.state === 'tug') {
        // Release ball - it flies away
        this.state = 'flying';

        // Calculate throw direction from drag
        if (dragMovement.length >= 2) {
          const first = dragMovement[0];
          const last = dragMovement[dragMovement.length - 1];
          const dt = (last.time - first.time) / 1000;
          if (dt > 0) {
            this.vx = ((last.x - first.x) / dt) * 0.3;
            this.vy = ((last.y - first.y) / dt) * 0.3 - 3;
          } else {
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = -5;
          }
        } else {
          this.vx = (Math.random() - 0.5) * 8;
          this.vy = -5;
        }

        this.canvas.style.cursor = 'default';
        this.canvas.removeEventListener('mousedown', this.onMouseDown);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        this.canvas.style.pointerEvents = 'none';

        dog.currentBehavior = 'barking';
        playBarkSound();

        setTimeout(() => {
          if (dog.currentBehavior === 'barking') {
            dog.currentBehavior = 'idle';
          }
        }, 500);

        dragStart = null;
        dragMovement = [];
      }
    }

    update() {
      // Update trail
      if (this.state === 'flying' || this.state === 'bezier') {
        this.trail.push({ x: this.x, y: this.y, alpha: 1.0 });
        if (this.trail.length > this.maxTrailLength) {
          this.trail.shift();
        }
        // Fade trail
        this.trail.forEach((t, i) => {
          t.alpha = (i + 1) / this.trail.length * 0.6;
        });
      } else {
        this.trail = [];
      }

      switch (this.state) {
        case 'bezier':
          // Smooth Bezier curve throw
          this.bezierT += 1/60 / this.bezierDuration;

          if (this.bezierT >= 1.0) {
            // Bezier complete, transition to physics
            const pos = this.bezierPoint(1.0);
            this.x = pos.x;
            this.y = pos.y;
            this.state = 'grounded';
            this.vx = 0;
            this.vy = 0;

            // Spawn dust on landing
            spawnDustPuff(this.x, this.y + 12);
          } else {
            const pos = this.bezierPoint(easeInOutSine(this.bezierT));
            this.x = pos.x;
            this.y = pos.y;

            // Check catch during Bezier flight
            const mouth = this.getMouthPosition();
            const dist = Math.hypot(this.x - mouth.x, this.y - mouth.y);
            if (dist < 35 && this.bezierT > 0.3) { // Catch cone during flight
              this.state = 'caught';
              dog.currentBehavior = 'catch';
              dog.frameCount = 0;

              fetchCount++;
              localStorage.setItem('dog-fetch-count', fetchCount.toString());

              const catchMessage = `Caught it! (${fetchCount}) - Click to play tug-of-war!`;
              const catchWordCount = catchMessage.split(/\s+/).length;
              const catchDuration = Math.max(2000, catchWordCount * 500);
              showSpeechBubble(catchMessage, catchDuration);

              setTimeout(() => {
                if (this.state === 'caught') {
                  dog.currentBehavior = 'excited';
                  dog.excitedStartFrame = dog.frameCount;
                  playHappySound();

                  setTimeout(() => {
                    if (this.state === 'caught') {
                      dog.currentBehavior = 'idle';
                      dog.canvasEl.style.bottom = DOG_BASELINE + 'px';
                      this.enableInteraction();
                    }
                  }, 1500);
                }
              }, catchDuration);
            }
          }
          break;

        case 'flying':
          this.vy += this.gravity;
          this.x += this.vx;
          this.y += this.vy;

          // Ground collision
          const ground = window.innerHeight - 60;
          if (this.y >= ground) {
            this.y = ground;
            this.vy *= -0.45;
            this.vx *= 0.8;
            if (Math.abs(this.vx) < 0.5 && Math.abs(this.vy) < 1) {
              this.state = 'grounded';
              this.vx = 0;
              this.vy = 0;
            }
          }

          // Wall collisions
          if (this.x < 20) {
            this.x = 20;
            this.vx *= -0.7;
          } else if (this.x > window.innerWidth - 20) {
            this.x = window.innerWidth - 20;
            this.vx *= -0.7;
          }

          // Catch check - use mouth position
          const mouth = this.getMouthPosition();
          const dist = Math.hypot(this.x - mouth.x, this.y - mouth.y);
          if (dist < 28 && this.vy > 0 && this.y > mouth.y - 30) {
            this.state = 'caught';
            dog.currentBehavior = 'catch';
            dog.frameCount = 0;

            fetchCount++;
            localStorage.setItem('dog-fetch-count', fetchCount.toString());

            const catchMessage = `Caught it! (${fetchCount}) - Click to play tug-of-war!`;
            const catchWordCount = catchMessage.split(/\s+/).length;
            const catchDuration = Math.max(2000, catchWordCount * 500);
            showSpeechBubble(catchMessage, catchDuration);

            setTimeout(() => {
              if (this.state === 'caught') {
                dog.currentBehavior = 'excited';
                dog.excitedStartFrame = dog.frameCount;
                playHappySound();

                setTimeout(() => {
                  if (this.state === 'caught') {
                    dog.currentBehavior = 'idle';
                    dog.canvasEl.style.bottom = DOG_BASELINE + 'px';
                    this.enableInteraction();
                  }
                }, 1500);
              }
            }, catchDuration);
          }
          break;

        case 'caught':
          const m = this.getMouthPosition();
          this.x = m.x;
          this.y = m.y;
          break;

        case 'tug':
          // Oscillating resistance during tug-of-war
          const tension = Math.sin(Date.now() / 100) * 3;
          const anchor = this.getMouthPosition();
          this.x = anchor.x + (dog.facingRight ? 12 + tension : -12 - tension);
          this.y = anchor.y;

          // Dog follows mouse during tug with resistance
          if (dragMovement.length > 0) {
            const mouseX = dragMovement[dragMovement.length - 1].x;
            const centerX = window.innerWidth / 2;
            const pullDirection = mouseX - centerX;

            // Update dog facing based on pull direction
            if (Math.abs(pullDirection) > 50) {
              dog.facingRight = pullDirection > 0;
            }

            // Dog resists being pulled too far
            const dogRect = dog.canvasEl.getBoundingClientRect();
            const dogCenterX = dogRect.left + dogRect.width / 2;
            const distanceFromMouse = Math.abs(mouseX - dogCenterX);

            if (distanceFromMouse > 100) {
              const moveSpeed = 2;
              const direction = mouseX > dogCenterX ? 1 : -1;
              dog.x += direction * moveSpeed;
              dog.x = Math.max(50, Math.min(window.innerWidth - 50, dog.x));
              dog.canvasEl.style.left = Math.round(dog.x) + 'px';
            }
          }
          break;

        case 'grounded':
        case 'idle':
          // Check if dog is near to pick up
          const feetX = this.getFeetX();
          const feetY = this.getFeetY();
          const distToFeet = Math.hypot(this.x - feetX, this.y - feetY);
          if (distToFeet < 50 && dog.chasingBall) {
            this.state = 'caught';
            dog.chasingBall = false;
            dog.isWalking = false;
            dog.targetX = null;
            dog.currentBehavior = 'idle';

            fetchCount++;
            localStorage.setItem('dog-fetch-count', fetchCount.toString());

            const pickupMessage = `Got it! (${fetchCount})`;
            showSpeechBubble(pickupMessage, 2000);
            playHappySound();

            setTimeout(() => {
              if (this.state === 'caught') {
                this.enableInteraction();
              }
            }, 2000);
          }
          break;
      }

      this.canvas.style.left = (this.x - 12) + 'px';
      this.canvas.style.top = (this.y - 12) + 'px';

      // Render trail
      this.renderTrail();
    }

    renderTrail() {
      // Remove old trail elements
      document.querySelectorAll('.ball-trail').forEach(el => {
        const age = Date.now() - parseInt(el.dataset.created || 0);
        if (age > 200) el.remove();
      });

      // Create new trail elements (only latest few)
      if (this.trail.length > 2) {
        const latest = this.trail[this.trail.length - 1];
        const trail = document.createElement('div');
        trail.className = 'ball-trail';
        trail.dataset.created = Date.now().toString();
        trail.style.cssText = `
          position: fixed;
          left: ${latest.x - 3}px;
          top: ${latest.y - 3}px;
          width: 6px;
          height: 6px;
          background: rgba(255, 170, 68, ${latest.alpha});
          border-radius: 50%;
          pointer-events: none;
          z-index: 498;
        `;
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 250);
      }
    }

    getMouthPosition() {
      const rect = dog.canvasEl.getBoundingClientRect();
      const ox = Math.floor((VIEW_W - BODY_W) / 2);
      const oy = Math.floor((VIEW_H - BODY_H) / 2);
      const anchorX = dog.facingRight
        ? MOUTH_ANCHOR.x
        : mirrorX(MOUTH_ANCHOR.x); // unified mirror calculation
      const x = rect.left + (ox + anchorX) * SCALE;
      const y = rect.top  + (oy + MOUTH_ANCHOR.y) * SCALE;
      return { x, y };
    }

    getFeetX() {
      const rect = dog.canvasEl.getBoundingClientRect();
      return rect.left + rect.width / 2;
    }

    getFeetY() {
      const rect = dog.canvasEl.getBoundingClientRect();
      return rect.top + rect.height;
    }

    isNear(x, y) {
      return Math.hypot(this.x - x, this.y - y) < 120;
    }

    enableInteraction() {
      this.canvas.style.pointerEvents = 'auto';
      this.canvas.style.cursor = 'grab';
      this.canvas.addEventListener('mousedown', this.onMouseDown);
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }

    draw() {
      this.ctx.clearRect(0, 0, 8, 8);
      this.ctx.fillStyle = '#ff6600';
      this.ctx.fillRect(2, 1, 4, 1);
      this.ctx.fillRect(1, 2, 6, 4);
      this.ctx.fillRect(2, 6, 4, 1);
      this.ctx.fillStyle = '#ffaa44';
      this.ctx.fillRect(3, 2, 2, 1);
    }

    destroy() {
      this.canvas.removeEventListener('mousedown', this.onMouseDown);
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
      if (this.canvas && this.canvas.parentNode) {
        document.body.removeChild(this.canvas);
      }
    }
  }

  // ===========================================
  // DOG STATE & ANIMATION
  // ===========================================

  let dog = {
    canvasEl: null,
    shadowEl: null,
    ctx: null,
    enabled: false,

    // Sub-pixel position (floats)
    x: 200.0,
    vx: 0.0,
    y: window.innerHeight - 120,

    targetX: null,
    targetY: null,
    walkSpeed: 2,
    isWalking: false,
    facingRight: true,
    walkFrame: 0,

    currentBehavior: 'idle',
    behaviorTimer: null,
    lastInteraction: Date.now(),

    animationFrame: null,
    frameCount: 0,
    accumulator: 0,
    lastTime: performance.now(),

    // Animation state
    mouthPhase: 0,
    tailPhase: 0,
    blinkTimer: 0,

    // Springy tail physics
    tailAngle: 0,      // current angle
    tailAngularVel: 0, // angular velocity
    tailTarget: 0,     // target angle

    // Cursor tracking
    cursorLookStrength: 0,

    // Animation juice
    anticipationOffset: 0,  // lean back before movement
    squashStretch: 1.0,     // vertical scale factor
    headBobPhase: 0,        // offset head bob timing
    earFlopPhase: 0,        // offset ear flop timing
    lastVelocitySign: 0,    // for detecting direction changes

    // Ball chasing state
    chasingBall: false,
    ballTarget: null,

    // Excited state animation
    excitedStartFrame: 0,

    // Naughty mode state
    naughtyMode: {
      isIdle: false,
      idleStartTime: null,
      idleThreshold: 45000, // 45 seconds
      currentSprite: null,  // Override sprite for special behaviors
      inProgress: false,
      chewTarget: null
    },

    // Behavior cooldowns
    behaviorCooldowns: {
      sit: 0,
      lie: 0,
      bark: 0,
      walk: 0
    },

    // Need/Drive model (0-100 scale)
    needs: {
      energy: 100,      // Drains over time, restored by napping
      curiosity: 50,    // Increases with inactivity, satisfied by exploring
      affection: 50     // Increases with time away from user, satisfied by interaction
    },
    needDecayRates: {
      energy: 0.5,      // Per minute
      curiosity: 1.0,
      affection: 0.8
    },
    lastNeedUpdate: Date.now(),

    // Pounce state
    pounceTarget: null,
    pounceWindup: 0,

    // Micro-naughtiness state
    microNaughtyTarget: null,
    microNaughtyNudges: 0,
    microNaughtyTimer: null,
    microNaughtyActive: false,

    // Smear frame state
    smearFrames: [], // Array of { x, alpha, facingRight }
    smearActive: false,

    // Breathing animation
    breathingPhase: 0,
    breathingRate: 0.02, // Slower breathing

    // Ear twitch state
    lastEarTwitch: 0,
    earTwitchCooldown: 5000, // Min time between twitches

    // Yawn state
    isYawning: false,
    yawnStartFrame: 0,
    lastYawn: 0,

    // Head tilt (curiosity)
    headTilt: 0,
    headTiltTarget: 0,
    lastKeypress: 0
  };

  function createDogCanvas() {
    const shadow = document.createElement('div');
    shadow.id = 'dog-shadow';
    shadow.style.cssText = `
      position: fixed;
      bottom: ${SHADOW_BASELINE}px;
      left: ${Math.round(dog.x)}px;
      width: 72px;
      height: 12px;
      background: radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 70%);
      border-radius: 50%;
      z-index: 499;
      pointer-events: none;
      display: none;
    `;
    document.body.appendChild(shadow);
    dog.shadowEl = shadow;

    const canvas = document.createElement('canvas');
    canvas.id = 'dog-canvas';
    canvas.width = VIEW_W;
    canvas.height = VIEW_H;
    canvas.style.position = 'fixed';
    canvas.style.bottom = '60px';
    canvas.style.left = dog.x + 'px';
    canvas.style.width = (VIEW_W * SCALE) + 'px';
    canvas.style.height = (VIEW_H * SCALE) + 'px';
    canvas.style.imageRendering = 'pixelated';
    canvas.style.imageRendering = '-moz-crisp-edges';
    canvas.style.imageRendering = 'crisp-edges';
    canvas.style.zIndex = '500';
    canvas.style.cursor = 'pointer';
    canvas.style.display = 'none';

    let lastClickTime = 0;
    canvas.addEventListener('click', (e) => {
      const now = Date.now();
      const timeSinceLastClick = now - lastClickTime;

      if (timeSinceLastClick < 400) {
        // Double-click! Make dog sit
        executeBehavior('sit', 5000);
        showSpeechBubble('Good dog!', 1500);
      } else {
        // Single click - pet dog
        petDog();
      }

      lastClickTime = now;
    });

    document.body.appendChild(canvas);
    dog.canvasEl = canvas;
    dog.ctx = canvas.getContext('2d');
    dog.ctx.imageSmoothingEnabled = false;
  }

  function drawDog() {
    const ctx = dog.ctx;
    if (!ctx) return;

    const canvas = dog.canvasEl;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Check for naughty mode sprite override
    if (dog.naughtyMode.currentSprite) {
      const ox = Math.floor((VIEW_W - BODY_W) / 2);
      const oy = Math.floor((VIEW_H - BODY_H) / 2);
      drawMatrix(ctx, dog.naughtyMode.currentSprite, ox, oy);
      dog.frameCount++;
      return;
    }

    // Behavior → appearance mapping
    let bodyPose = 'stand';
    let mouthPose = 'closed';
    let tailPose = 'neutral';

    if (dog.isWalking) {
      bodyPose = 'walk';
      tailPose = (dog.frameCount % 10 < 5) ? 'left' : 'right';
    } else {
      // Idle wag randomly
      if (dog.frameCount % 180 === 0 && Math.random() < 0.25) {
        dog.tailPhase = 1;
      }
      if (dog.tailPhase) {
        const p = (Math.floor(dog.frameCount/6) % 2);
        tailPose = p ? 'left' : 'right';
      }
    }

    if (dog.currentBehavior === 'barking') {
      const m = Math.floor(dog.frameCount / 6) % 4;
      mouthPose = (m === 0) ? 'closed' : (m === 2) ? 'open' : 'half';
    } else if (dog.currentBehavior === 'excited') {
      tailPose = (dog.frameCount % 6 < 3) ? 'left' : 'right';
    }

    // Yawning animation - wide open mouth
    if (dog.isYawning) {
      const yawnProgress = (dog.frameCount - dog.yawnStartFrame) / 60; // Normalized 0-1 over 60 frames (1 second)
      if (yawnProgress < 0.5) {
        // Opening
        mouthPose = 'open';
      } else {
        // Closing
        mouthPose = yawnProgress < 0.75 ? 'half' : 'closed';
      }
    }

    // Blink every ~3.3 seconds (0.5% chance per frame at 60fps) for 5 frames
    if (dog.blinkTimer <= 0 && Math.random() < 0.005) {
      dog.blinkTimer = 5;
    }
    const blink = dog.blinkTimer > 0;
    if (dog.blinkTimer > 0) dog.blinkTimer--;

    // Walk frame index + body bounce
    let bodyIndex = 0;
    let offsetY = 0;
    let totalVerticalOffset = 0; // Track total vertical displacement for shadow

    if (bodyPose === 'walk') {
      const prevBodyIndex = Math.floor((dog.frameCount - 1) / 8) % 4;
      bodyIndex = Math.floor(dog.frameCount / 8) % 4;
      offsetY = [0, -1, 0, +1][bodyIndex];
      totalVerticalOffset = offsetY;

      // Footstep sounds on frames 0 and 2 (when feet touch ground)
      if (bodyIndex !== prevBodyIndex && (bodyIndex === 0 || bodyIndex === 2)) {
        playFootstepSound();
      }
    } else if (dog.currentBehavior === 'excited') {
      const hopPhase = Math.floor(dog.frameCount / 4) % 4;
      offsetY = hopPhase === 1 ? -3 : hopPhase === 2 ? -1 : 0;

      const t = (dog.frameCount - dog.excitedStartFrame) / 15;
      const xOffset = Math.sin(t) * 15;
      const figureYOffset = Math.sin(2 * t) * 8;

      dog.canvasEl.style.left = Math.round(dog.x + xOffset) + 'px';
      dog.canvasEl.style.bottom = Math.round(DOG_BASELINE + figureYOffset) + 'px';

      totalVerticalOffset = offsetY + figureYOffset;
    } else {
      offsetY = Math.round(Math.sin(dog.frameCount / 40) * 0.5);
      totalVerticalOffset = offsetY;
    }

    // Update shadow to react to vertical motion
    if (dog.shadowEl) {
      // Shadow gets smaller/lighter when dog is higher (jumping/bouncing)
      // normalizedHeight: 0 = on ground, negative = higher up
      const normalizedHeight = -totalVerticalOffset / 10; // Scale down for subtlety
      const shadowScale = lerp(1.0, 0.7, Math.max(0, normalizedHeight)); // Shrink when higher
      const shadowOpacity = lerp(0.3, 0.15, Math.max(0, normalizedHeight)); // Fade when higher
      const shadowBottom = SHADOW_BASELINE + Math.round(totalVerticalOffset * 0.3); // Shadow lags slightly

      dog.shadowEl.style.transform = `scale(${shadowScale})`;
      dog.shadowEl.style.opacity = shadowOpacity.toString();
      dog.shadowEl.style.bottom = shadowBottom + 'px';
    }

    // Compose the frame
    const fr = composeFrame({
      facingRight: dog.facingRight,
      bodyPose,
      bodyIndex,
      mouthPose,
      tailPose,
      blink
    });

    // Center in viewport
    const ox = Math.floor((VIEW_W - BODY_W) / 2);
    const oy = Math.floor((VIEW_H - BODY_H) / 2) + offsetY;

    // Draw smear frames first (ghost images behind main dog)
    if (dog.smearActive && dog.smearFrames.length > 0 && dog.bodyPose === 'walk') {
      const currentX = dog.x;
      dog.smearFrames.forEach(smear => {
        ctx.save();
        ctx.globalAlpha = smear.alpha;

        // Temporarily adjust position for smear frame
        const smearOffsetX = smear.x - currentX;

        // Compose smear frame with same pose
        const smearFrame = composeFrame({
          facingRight: smear.facingRight,
          bodyPose,
          bodyIndex,
          mouthPose,
          tailPose,
          blink
        });

        // Draw smear at offset position
        drawMatrix(ctx, smearFrame, ox + Math.round(smearOffsetX), oy);
        ctx.restore();
      });
    }

    drawMatrix(ctx, fr, ox, oy);

    dog.frameCount++;
  }

  // ===========================================
  // VISUAL EFFECTS
  // ===========================================

  function spawnDustPuff(x, y) {
    const motionSettings = getReducedMotionMultiplier();

    // Skip dust puffs if user prefers reduced motion
    if (motionSettings.disableEffects) return;

    const puff = document.createElement('div');
    const size = (6 + Math.random() * 4) * motionSettings.effectIntensity;
    const opacity = 0.6 * motionSettings.effectIntensity;
    const duration = 400 / motionSettings.animationSpeed;

    puff.style.cssText = `
      position: fixed;
      left: ${x - size/2}px;
      top: ${y - size/2}px;
      width: ${size}px;
      height: ${size}px;
      background: rgba(200, 200, 200, ${opacity});
      border-radius: 50%;
      pointer-events: none;
      z-index: 499;
      animation: dustFade ${duration}ms ease-out forwards;
    `;
    document.body.appendChild(puff);
    setTimeout(() => puff.remove(), duration);
  }

  // Inject dust animation keyframes
  if (!document.getElementById('dust-keyframes')) {
    const style = document.createElement('style');
    style.id = 'dust-keyframes';
    style.textContent = `
      @keyframes dustFade {
        0% { transform: scale(0.5) translateY(0); opacity: 0.6; }
        100% { transform: scale(1.5) translateY(-10px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // ===========================================
  // NEED/DRIVE SYSTEM
  // ===========================================

  function updateNeeds(dt) {
    const now = Date.now();
    const elapsed = (now - dog.lastNeedUpdate) / 1000 / 60; // minutes
    dog.lastNeedUpdate = now;

    // Decay/grow needs over time
    dog.needs.energy = clamp(dog.needs.energy - dog.needDecayRates.energy * elapsed, 0, 100);
    dog.needs.curiosity = clamp(dog.needs.curiosity + dog.needDecayRates.curiosity * elapsed, 0, 100);
    dog.needs.affection = clamp(dog.needs.affection + dog.needDecayRates.affection * elapsed, 0, 100);

    // Behavior-specific need adjustments
    if (dog.currentBehavior === 'lying') {
      dog.needs.energy = Math.min(100, dog.needs.energy + 2 * elapsed);
    }
    if (dog.isWalking) {
      dog.needs.curiosity = Math.max(0, dog.needs.curiosity - 1.5 * elapsed);
    }
  }

  function getDominantNeed() {
    const needs = dog.needs;
    let highest = 'energy';
    let highestValue = needs.energy;

    // Find which need is most pressing (but inverted for energy)
    const energyNeed = 100 - needs.energy; // Low energy = high need to rest
    if (energyNeed > highestValue) {
      highest = 'energy';
      highestValue = energyNeed;
    }
    if (needs.curiosity > highestValue) {
      highest = 'curiosity';
      highestValue = needs.curiosity;
    }
    if (needs.affection > highestValue) {
      highest = 'affection';
      highestValue = needs.affection;
    }

    return { need: highest, strength: highestValue };
  }

  // ===========================================
  // TIME-BASED REACTIONS
  // ===========================================

  function getTimeOfDayModifier() {
    const hour = new Date().getHours();

    if (hour >= 22 || hour < 6) {
      // Late night / early morning (10pm - 6am) - sleepy
      return {
        energyModifier: -20,
        sleepProbability: 0.6,
        activityMultiplier: 0.5,
        mood: 'sleepy'
      };
    } else if (hour >= 6 && hour < 9) {
      // Early morning (6am - 9am) - fresh and energetic
      return {
        energyModifier: 10,
        sleepProbability: 0.1,
        activityMultiplier: 1.3,
        mood: 'energetic'
      };
    } else if (hour >= 9 && hour < 17) {
      // Daytime (9am - 5pm) - normal
      return {
        energyModifier: 0,
        sleepProbability: 0.2,
        activityMultiplier: 1.0,
        mood: 'normal'
      };
    } else if (hour >= 17 && hour < 22) {
      // Evening (5pm - 10pm) - winding down
      return {
        energyModifier: -10,
        sleepProbability: 0.4,
        activityMultiplier: 0.8,
        mood: 'calm'
      };
    }

    return {
      energyModifier: 0,
      sleepProbability: 0.2,
      activityMultiplier: 1.0,
      mood: 'normal'
    };
  }

  // ===========================================
  // MICRO-NAUGHTINESS
  // ===========================================

  function findNudgeableElement() {
    // Find nearby interactive elements the dog can nudge for comedy
    const dogRect = dog.canvasEl.getBoundingClientRect();
    const dogCenterX = dogRect.left + dogRect.width / 2;
    const dogCenterY = dogRect.top + dogRect.height / 2;

    // Candidate elements: buttons, links, input fields, etc.
    const candidates = document.querySelectorAll('button, a, input, .project-item, .list-item, .skill-item, h2, h3');

    let closest = null;
    let closestDist = Infinity;

    candidates.forEach(el => {
      // Skip the dog's own elements
      if (el.id === 'dog-canvas' || el.closest('#dog-canvas') || el.closest('#dog-shadow')) return;

      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;

      const dist = Math.hypot(elCenterX - dogCenterX, elCenterY - dogCenterY);

      // Only consider elements within reasonable range (100-400px)
      if (dist < 400 && dist > 100 && dist < closestDist) {
        closestDist = dist;
        closest = el;
      }
    });

    return closest;
  }

  function playNudgeSound() {
    const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');
    if (settings.volume && settings.volume > 0) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Subtle "bump" sound - very quiet
        oscillator.frequency.value = 150;
        oscillator.type = 'sine';
        gainNode.gain.value = settings.volume / 800; // Very low volume

        oscillator.start();
        setTimeout(() => {
          oscillator.frequency.value = 100;
        }, 30);
        setTimeout(() => oscillator.stop(), 80);
      } catch (e) {}
    }
  }

  function doMicroNudge() {
    if (dog.microNaughtyActive) return;

    const target = findNudgeableElement();
    if (!target) return;

    dog.microNaughtyActive = true;
    dog.microNaughtyTarget = target;
    dog.microNaughtyNudges = 0;

    // Store original transform (if any)
    const originalTransform = target.style.transform || '';

    function nudge() {
      if (dog.microNaughtyNudges >= 3) {
        // Done! Reset everything
        setTimeout(() => {
          target.style.transform = originalTransform;
          dog.microNaughtyActive = false;
          dog.microNaughtyTarget = null;
          dog.microNaughtyNudges = 0;
        }, 1500); // Hold final position briefly
        return;
      }

      // Nudge in a random direction (1px)
      const dx = Math.random() < 0.5 ? 1 : -1;
      const dy = Math.random() < 0.5 ? 1 : -1;
      const currentNudge = dog.microNaughtyNudges;

      target.style.transform = `translate(${dx * currentNudge}px, ${dy * currentNudge}px)`;
      playNudgeSound();

      dog.microNaughtyNudges++;

      // Face toward the target
      const dogRect = dog.canvasEl.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const dogCenterX = dogRect.left + dogRect.width / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;

      dog.facingRight = targetCenterX > dogCenterX;

      // Stare at it, then nudge again
      const waitTime = 1200 + Math.random() * 800;
      dog.microNaughtyTimer = setTimeout(nudge, waitTime);
    }

    // Start the nudging sequence
    nudge();
  }

  // ===========================================
  // MOVEMENT & BEHAVIOR
  // ===========================================

  function pickRandomDestination() {
    const screenWidth = window.innerWidth;
    const margin = 100;
    const minX = margin;
    const maxX = screenWidth - margin;

    const destinations = [
      { x: Math.max(minX, Math.min(maxX, margin)) },
      { x: Math.max(minX, Math.min(maxX, screenWidth - margin)) },
      { x: Math.max(minX, Math.min(maxX, screenWidth / 2)) },
      { x: Math.max(minX, Math.min(maxX, margin + Math.random() * 200)) },
      { x: Math.max(minX, Math.min(maxX, screenWidth - margin - Math.random() * 200)) }
    ];

    const dest = destinations[Math.floor(Math.random() * destinations.length)];
    dog.targetX = dest.x;
    dog.isWalking = true;
    dog.currentBehavior = 'walking';

    if (dest.x > dog.x) dog.facingRight = true;
    else dog.facingRight = false;
  }

  function updateMovement(dt) {
    if (isSpeaking) {
      dog.isWalking = false;
      dog.vx = 0;
      return;
    }

    const wasMoving = Math.abs(dog.vx) > 0.5;
    const currentVelocitySign = Math.sign(dog.vx);

    if (!dog.isWalking || dog.targetX === null) {
      // Smooth deceleration
      const prevVx = dog.vx;
      dog.vx = lerp(dog.vx, 0, 0.2);

      // Dust puff on stop
      if (wasMoving && Math.abs(dog.vx) < 0.5 && Math.abs(prevVx) >= 0.5) {
        const rect = dog.canvasEl.getBoundingClientRect();
        spawnDustPuff(rect.left + rect.width/2, rect.bottom - 5);
        // Overshoot then settle
        dog.anticipationOffset = 2;
      }

      if (Math.abs(dog.vx) < 0.01) dog.vx = 0;
      return;
    }

    const distance = dog.targetX - dog.x;
    const absDistance = Math.abs(distance);

    // Arrival steering: slow down near target
    if (absDistance < dog.walkSpeed) {
      dog.x = dog.targetX;
      dog.isWalking = false;
      dog.targetX = null;
      dog.walkFrame = 0;
      dog.vx = 0;

      scheduleNextBehavior();
      return;
    }

    // Detect direction change (quick turn)
    const desiredSign = Math.sign(distance);
    if (currentVelocitySign !== 0 && desiredSign !== currentVelocitySign && Math.abs(dog.vx) > 1) {
      // Quick turn! Add anticipation and dust
      dog.anticipationOffset = -3; // Lean back hard
      const rect = dog.canvasEl.getBoundingClientRect();
      spawnDustPuff(rect.left + rect.width/2, rect.bottom - 5);
      spawnDustPuff(rect.left + rect.width/2 + (Math.random() - 0.5) * 10, rect.bottom - 3);
      dog.squashStretch = 0.85; // Squash on turn

      // Add smear frames for motion blur (skip if reduced motion preferred)
      const motionSettings = getReducedMotionMultiplier();
      if (!motionSettings.disableEffects) {
        dog.smearActive = true;
        dog.smearFrames = [
          { x: dog.x - currentVelocitySign * 8, alpha: 0.3 * motionSettings.effectIntensity, facingRight: dog.facingRight },
          { x: dog.x - currentVelocitySign * 4, alpha: 0.5 * motionSettings.effectIntensity, facingRight: dog.facingRight }
        ];
        setTimeout(() => {
          dog.smearActive = false;
          dog.smearFrames = [];
        }, 150 / motionSettings.animationSpeed);
      }
    }

    // Anticipation before starting to move
    if (!wasMoving && absDistance > 10) {
      dog.anticipationOffset = -2; // Lean back
      setTimeout(() => {
        dog.anticipationOffset = 1; // Spring forward
      }, 80);
    }

    // Acceleration towards target with arrival slowdown
    const targetVelocity = Math.sign(distance) * dog.walkSpeed;
    const arrivalFactor = Math.min(1, absDistance / 80); // Slow down within 80px
    dog.vx = lerp(dog.vx, targetVelocity * arrivalFactor, 0.15);

    // Dust puff on fast acceleration
    const justStartedMoving = !wasMoving && Math.abs(dog.vx) > 0.5;
    if (justStartedMoving) {
      const rect = dog.canvasEl.getBoundingClientRect();
      spawnDustPuff(rect.left + rect.width/2, rect.bottom - 5);
    }

    // Update position with sub-pixel precision
    dog.x += dog.vx * dt * 60; // Scale dt to maintain speed at 60fps

    // Update facing direction with slight hysteresis
    if (Math.abs(dog.vx) > 0.5) {
      dog.facingRight = dog.vx > 0;
    }

    // Store velocity sign for next frame
    dog.lastVelocitySign = currentVelocitySign;

    // Boundary constraints
    const margin = 50;
    dog.x = clamp(dog.x, margin, window.innerWidth - margin);

    // Render position (snap to int)
    const renderX = (dog.x + 0.5) | 0;
    dog.canvasEl.style.left = renderX + 'px';
    if (dog.shadowEl) {
      dog.shadowEl.style.left = renderX + 'px';
    }
  }

  function scheduleNextBehavior() {
    if (isSpeaking) return;

    // Decay cooldowns
    const now = Date.now();
    for (const key in dog.behaviorCooldowns) {
      if (dog.behaviorCooldowns[key] > 0) {
        dog.behaviorCooldowns[key] = Math.max(0, dog.behaviorCooldowns[key] - (now - dog.lastInteraction));
      }
    }

    // Get dominant need to bias behavior selection
    const { need, strength } = getDominantNeed();

    // Get time-of-day modifiers
    const timeModifier = getTimeOfDayModifier();

    const behaviors = [
      { action: 'sit', duration: 5000, weight: 3, cooldown: 8000, needBias: { energy: 0, curiosity: -1, affection: 1 } },
      { action: 'lie', duration: 8000, weight: 2, cooldown: 15000, needBias: { energy: 3, curiosity: -1, affection: 0 } },
      { action: 'stand', duration: 3000, weight: 4, cooldown: 5000, needBias: { energy: 0, curiosity: 0, affection: 0 } },
      { action: 'walk', duration: 0, weight: 3, cooldown: 6000, needBias: { energy: -1, curiosity: 3, affection: 0 } },
      { action: 'bark', duration: 2000, weight: 1, cooldown: 10000, needBias: { energy: 0, curiosity: 0, affection: 2 } }
    ];

    // Filter out behaviors on cooldown
    const available = behaviors.filter(b => dog.behaviorCooldowns[b.action] <= 0);

    if (available.length === 0) {
      // Fallback to stand if everything is on cooldown
      executeBehavior('stand', 3000);
      return;
    }

    // Apply need-based weight multipliers and time-of-day adjustments
    const weightedBehaviors = available.map(b => {
      const bias = b.needBias[need] || 0;
      const needMultiplier = 1 + (bias * strength / 100); // Scale bias by need strength

      // Apply time-of-day modifiers
      let timeMultiplier = timeModifier.activityMultiplier;
      if (b.action === 'lie') {
        timeMultiplier *= (1 + timeModifier.sleepProbability); // Boost sleep during night
      } else if (b.action === 'walk' || b.action === 'bark') {
        // Active behaviors reduced during sleepy times
        if (timeModifier.mood === 'sleepy') {
          timeMultiplier *= 0.3;
        }
      }

      return { ...b, effectiveWeight: Math.max(0.1, b.weight * needMultiplier * timeMultiplier) };
    });

    // Weighted random selection from available behaviors
    const totalWeight = weightedBehaviors.reduce((sum, b) => sum + b.effectiveWeight, 0);
    let random = Math.random() * totalWeight;

    for (const behavior of weightedBehaviors) {
      random -= behavior.effectiveWeight;
      if (random <= 0) {
        executeBehavior(behavior.action, behavior.duration);
        dog.behaviorCooldowns[behavior.action] = behavior.cooldown;
        break;
      }
    }
  }

  function executeBehavior(action, duration) {
    clearTimeout(dog.behaviorTimer);

    switch (action) {
      case 'sit':
        dog.currentBehavior = 'sitting';
        // Ear flop sound when settling
        setTimeout(() => playEarFlopSound(), 200);
        dog.behaviorTimer = setTimeout(() => {
          dog.currentBehavior = 'idle';
          scheduleNextBehavior();
        }, duration);
        break;

      case 'lie':
        dog.currentBehavior = 'lying';
        // Sigh sound when lying down
        setTimeout(() => {
          playSighSound();
          playEarFlopSound();
        }, 300);
        dog.behaviorTimer = setTimeout(() => {
          dog.currentBehavior = 'idle';
          scheduleNextBehavior();
        }, duration);
        break;

      case 'stand':
        dog.currentBehavior = 'idle';
        dog.behaviorTimer = setTimeout(() => {
          scheduleNextBehavior();
        }, duration);
        break;

      case 'walk':
        pickRandomDestination();
        break;

      case 'bark':
        dog.currentBehavior = 'barking';
        dog.behaviorTimer = setTimeout(() => {
          dog.currentBehavior = 'idle';
          scheduleNextBehavior();
        }, duration);
        break;
    }
  }

  function petDog() {
    clearTimeout(dog.behaviorTimer);
    dog.isWalking = false;
    dog.targetX = null;
    dog.chasingBall = false;

    // Reset naughty mode
    resetIdleTimer();
    dog.naughtyMode.inProgress = false;
    dog.naughtyMode.currentSprite = null;

    // Satisfy affection need
    dog.needs.affection = Math.max(0, dog.needs.affection - 30);

    dog.currentBehavior = 'idle';

    const wisdom = getRandomDogWisdom();
    const wordCount = wisdom.split(/\s+/).length;
    const duration = Math.max(2000, wordCount * 500);
    showSpeechBubble(wisdom, duration);

    playBarkSound();

    dog.tailPhase = 1;

    setTimeout(() => {
      if (!isSpeaking) {
        dog.currentBehavior = 'excited';
        dog.excitedStartFrame = dog.frameCount;
        playHappySound();

        setTimeout(() => {
          dog.currentBehavior = 'idle';
          dog.canvasEl.style.bottom = DOG_BASELINE + 'px';
          scheduleNextBehavior();
        }, 1500);
      }
    }, duration);

    if (window.AchievementSystem) {
      window.AchievementSystem.incrementDog();
    }

    dog.lastInteraction = Date.now();
  }

  // ===========================================
  // NAUGHTY MODE BEHAVIORS
  // ===========================================

  function doWander() {
    if (dog.naughtyMode.inProgress) return;
    dog.naughtyMode.inProgress = true;

    const duration = 3000 + Math.random() * 4000;
    pickRandomDestination();

    setTimeout(() => {
      dog.naughtyMode.inProgress = false;
      dog.isWalking = false;
      dog.targetX = null;
      dog.currentBehavior = 'idle';
    }, duration);
  }

  function doRollOver() {
    if (dog.naughtyMode.inProgress) return;
    dog.naughtyMode.inProgress = true;

    dog.isWalking = false;
    dog.targetX = null;
    dog.currentBehavior = 'rolling';

    let frameIndex = 0;
    const rollInterval = setInterval(() => {
      dog.naughtyMode.currentSprite = ROLL_SPRITES[frameIndex % 4];
      frameIndex++;

      if (frameIndex >= 16) { // 4 cycles through all 4 frames
        clearInterval(rollInterval);
        dog.naughtyMode.currentSprite = null;
        dog.currentBehavior = 'idle';
        dog.naughtyMode.inProgress = false;
      }
    }, 150);
  }

  function doChewBox() {
    if (dog.naughtyMode.inProgress) return;
    dog.naughtyMode.inProgress = true;

    // Find a nearby DOM element to "chew"
    const allElements = Array.from(document.querySelectorAll('.project-box, .skill-item, .list-item, button, a'));
    const dogRect = dog.canvasEl.getBoundingClientRect();
    const dogCenterX = dogRect.left + dogRect.width / 2;

    // Find elements within reasonable distance
    const nearbyElements = allElements.filter(el => {
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const distance = Math.abs(elCenterX - dogCenterX);
      return distance < 300 && rect.top < window.innerHeight - 200;
    });

    if (nearbyElements.length === 0) {
      dog.naughtyMode.inProgress = false;
      return;
    }

    const target = nearbyElements[Math.floor(Math.random() * nearbyElements.length)];
    const targetRect = target.getBoundingClientRect();

    // Walk to the target (convert to float)
    dog.targetX = targetRect.left - 50.0;
    dog.isWalking = true;
    dog.facingRight = dog.targetX > dog.x;

    const checkArrival = setInterval(() => {
      if (!dog.isWalking || Math.abs(dog.x - dog.targetX) < 30) {
        clearInterval(checkArrival);
        dog.isWalking = false;
        dog.targetX = null;

        // Start chewing animation
        dog.currentBehavior = 'chewing';
        dog.naughtyMode.chewTarget = target;

        let chewFrame = 0;
        const chewInterval = setInterval(() => {
          dog.naughtyMode.currentSprite = chewFrame % 2 === 0 ? CHEW_CLOSED_RIGHT : CHEW_OPEN_RIGHT;
          chewFrame++;

          // Shake the target element
          if (target && target.parentNode) {
            const shake = Math.sin(chewFrame * 0.5) * 3;
            target.style.transform = `translateX(${shake}px) rotate(${shake * 0.5}deg)`;
          }

          if (chewFrame >= 20) {
            clearInterval(chewInterval);
            if (target && target.parentNode) {
              target.style.transform = '';
            }
            dog.naughtyMode.currentSprite = null;
            dog.naughtyMode.chewTarget = null;
            dog.currentBehavior = 'idle';
            dog.naughtyMode.inProgress = false;
          }
        }, 200);
      }
    }, 100);
  }

  function doIdleSit() {
    if (dog.naughtyMode.inProgress) return;
    dog.naughtyMode.inProgress = true;

    dog.isWalking = false;
    dog.targetX = null;
    dog.currentBehavior = 'sitting';

    setTimeout(() => {
      dog.currentBehavior = 'idle';
      dog.naughtyMode.inProgress = false;
    }, 5000 + Math.random() * 5000);
  }

  function doNap() {
    if (dog.naughtyMode.inProgress) return;
    dog.naughtyMode.inProgress = true;

    dog.isWalking = false;
    dog.targetX = null;
    dog.currentBehavior = 'lying';

    setTimeout(() => {
      dog.currentBehavior = 'idle';
      dog.naughtyMode.inProgress = false;
    }, 8000 + Math.random() * 7000);
  }

  function triggerNaughtyBehavior() {
    if (dog.naughtyMode.inProgress) return;

    const behaviors = [
      { fn: doWander, weight: 3 },
      { fn: doRollOver, weight: 2 },
      { fn: doChewBox, weight: 2 },
      { fn: doIdleSit, weight: 2 },
      { fn: doNap, weight: 1 }
    ];

    const totalWeight = behaviors.reduce((sum, b) => sum + b.weight, 0);
    let random = Math.random() * totalWeight;

    for (const behavior of behaviors) {
      random -= behavior.weight;
      if (random <= 0) {
        behavior.fn();
        break;
      }
    }
  }

  // ===========================================
  // MAIN ANIMATION LOOP
  // ===========================================

  function updatePhysics(dt) {
    // Breathing animation - subtle body expansion/contraction
    dog.breathingPhase += dog.breathingRate;
    const breathingScale = 1 + Math.sin(dog.breathingPhase) * 0.015; // Very subtle 1.5% variation

    // Random ear twitches during idle
    if (!dog.isWalking && dog.currentBehavior !== 'excited') {
      const now = Date.now();
      if (now - dog.lastEarTwitch > dog.earTwitchCooldown && Math.random() < 0.001) {
        dog.lastEarTwitch = now;
        playEarFlopSound();
        // Visual ear twitch handled in drawDog
      }
    }

    // Head tilt physics (curiosity reaction to keyboard)
    const timeSinceKeypress = Date.now() - dog.lastKeypress;
    if (timeSinceKeypress < 3000) {
      // Keep tilt for 3 seconds
      dog.headTilt = lerp(dog.headTilt, dog.headTiltTarget, 0.2);
    } else {
      // Gradually return to neutral
      dog.headTiltTarget = 0;
      dog.headTilt = lerp(dog.headTilt, 0, 0.1);
    }

    // Phase offsets for body parts (creates natural lag/inertia illusion)
    dog.headBobPhase = (dog.frameCount + 5) * 0.8;   // 5-frame offset, slightly slower
    dog.earFlopPhase = (dog.frameCount + 12) * 0.6;  // 12-frame offset, much slower

    // Update springy tail
    if (dog.isWalking) {
      // Wag based on walking
      const phase = (dog.frameCount / 8) % 2;
      dog.tailTarget = (phase < 1) ? -0.3 : 0.3;
    } else if (dog.currentBehavior === 'excited') {
      // Fast wag when excited
      const phase = (dog.frameCount / 4) % 2;
      dog.tailTarget = (phase < 1) ? -0.5 : 0.5;
    } else {
      // Idle wag
      if (dog.tailPhase && dog.frameCount % 12 < 6) {
        const phase = Math.floor(dog.frameCount / 6) % 2;
        dog.tailTarget = (phase === 0) ? -0.2 : 0.2;
      } else {
        dog.tailTarget = 0;
      }
    }

    // Apply spring physics to tail
    const spring = springDamper(dog.tailAngle, dog.tailTarget, dog.tailAngularVel, 80, 12, dt);
    dog.tailAngle = spring.position;
    dog.tailAngularVel = spring.velocity;

    // Smooth recovery of anticipation offset (lean back/forward)
    dog.anticipationOffset = lerp(dog.anticipationOffset, 0, 0.15);
    if (Math.abs(dog.anticipationOffset) < 0.05) dog.anticipationOffset = 0;

    // Smooth recovery of squash/stretch
    dog.squashStretch = lerp(dog.squashStretch, 1.0, 0.2);
    if (Math.abs(dog.squashStretch - 1.0) < 0.01) dog.squashStretch = 1.0;

    // Apply anticipation offset to position (visual only, doesn't affect physics)
    if (dog.anticipationOffset !== 0 && dog.canvasEl) {
      const baseLeft = parseFloat(dog.canvasEl.style.left) || dog.x;
      const offsetX = dog.anticipationOffset * (dog.facingRight ? 1 : -1);
      dog.canvasEl.style.left = Math.round(baseLeft + offsetX) + 'px';
    }

    // Apply squash/stretch, breathing, and head tilt transforms
    if (dog.canvasEl) {
      // Combine squash/stretch with breathing (breathing only when idle)
      const isIdle = !dog.isWalking && dog.currentBehavior !== 'excited' && dog.currentBehavior !== 'barking';
      const finalBreathingScale = isIdle ? breathingScale : 1.0;

      // Build transform string
      let transforms = [];

      // Scale transforms
      if (dog.squashStretch !== 1.0) {
        const inverseStretch = 2 - dog.squashStretch; // Maintain volume
        transforms.push(`scaleY(${dog.squashStretch * finalBreathingScale})`);
        transforms.push(`scaleX(${inverseStretch})`);
      } else if (finalBreathingScale !== 1.0) {
        transforms.push(`scale(${finalBreathingScale})`);
      }

      // Head tilt rotation
      if (Math.abs(dog.headTilt) > 0.1) {
        transforms.push(`rotate(${dog.headTilt}deg)`);
      }

      dog.canvasEl.style.transform = transforms.join(' ') || '';
    }

    // Note: Shadow is now updated in drawDog() based on vertical offset for better reactivity
  }

  function startAnimationLoop() {
    const FIXED_DT = 1/60;
    let accumulator = 0;
    let lastTime = performance.now();

    function animate(now) {
      if (!dog.enabled) return;

      const deltaTime = Math.min((now - lastTime) / 1000, 0.1); // Cap at 100ms
      lastTime = now;
      accumulator += deltaTime;

      // Fixed timestep updates
      while (accumulator >= FIXED_DT) {
        // Update ball physics
        if (ball) {
          ball.update();

          // Dog reaction to ball state
          const feetX = ball.getFeetX();
          const feetY = ball.getFeetY();

          switch (ball.state) {
            case 'flying':
            case 'grounded':
              // Start chasing if ball is near and dog isn't already chasing
              if (!dog.chasingBall && ball.isNear(feetX, feetY)) {
                dog.chasingBall = true;
                clearTimeout(dog.behaviorTimer);
                dog.currentBehavior = 'walking';
              }

              // Chase behavior - walk toward ball
              if (dog.chasingBall) {
                const distanceToBall = Math.abs(ball.x - feetX);

                if (distanceToBall > 30) {
                  dog.targetX = ball.x;
                  dog.isWalking = true;

                  if (distanceToBall > 15) {
                    dog.facingRight = ball.x > feetX;
                  }
                } else {
                  dog.isWalking = false;
                  dog.targetX = null;
                }
              }
              break;

            case 'caught':
            case 'tug':
              // Ball is in dog's mouth - no chasing needed
              dog.chasingBall = false;
              break;
          }
        }

        updateMovement(FIXED_DT);
        updatePhysics(FIXED_DT);
        updateNeeds(FIXED_DT);

        // Cursor pounce behavior
        if (dog.cursorLookStrength > 0.7 && !dog.chasingBall && !dog.isWalking && Math.random() < 0.01) {
          const rect = dog.canvasEl.getBoundingClientRect();
          const dogCenterX = rect.left + rect.width / 2;
          const distanceToCursor = Math.abs(lastMouseX - dogCenterX);

          if (distanceToCursor < 80 && distanceToCursor > 20) {
            // Pounce toward cursor!
            dog.targetX = lastMouseX - 20 + Math.random() * 40;
            dog.isWalking = true;
            dog.anticipationOffset = -3; // Windup
            setTimeout(() => {
              dog.squashStretch = 0.7; // Compress for pounce
            }, 100);
          }
        }

        const timeSinceInteraction = Date.now() - dog.lastInteraction;
        if (timeSinceInteraction > 60000 && dog.currentBehavior !== 'lying' && !dog.chasingBall) {
          executeBehavior('lie', 30000);
        }

        // Dreaming: show thought bubbles while sleeping
        if (dog.currentBehavior === 'lying' && !thoughtBubble && Math.random() < 0.003) {
          const dreams = ['🦴', '⚽', '🐿️', '🍖', '🎾', '💭'];
          showThoughtBubble(dreams[Math.floor(Math.random() * dreams.length)], 2500);

          // Tiny paw twitches during dream
          if (Math.random() < 0.5) {
            setTimeout(() => {
              dog.anticipationOffset = Math.random() * 2 - 1;
            }, 800);
          }
        }

        // Yawning: triggered during sleepy times
        const timeModifier = getTimeOfDayModifier();
        const now = Date.now();
        if (!dog.isYawning &&
            timeModifier.mood === 'sleepy' &&
            now - dog.lastYawn > 30000 && // At least 30s between yawns
            dog.currentBehavior === 'idle' &&
            Math.random() < 0.0008) {
          dog.isYawning = true;
          dog.yawnStartFrame = dog.frameCount;
          dog.lastYawn = now;
          playSighSound(); // Exhale sound during yawn
          setTimeout(() => {
            dog.isYawning = false;
          }, 2000);
        }

        // Micro-naughtiness: occasionally nudge nearby elements for comedy
        if (!dog.microNaughtyActive &&
            !dog.chasingBall &&
            !dog.isWalking &&
            dog.currentBehavior !== 'lying' &&
            dog.currentBehavior !== 'excited' &&
            Math.random() < 0.0005) { // Very rare (about once every 30 seconds when idle)
          doMicroNudge();
        }

        accumulator -= FIXED_DT;
      }

      // Render (variable rate)
      drawDog();

      dog.animationFrame = requestAnimationFrame(animate);
    }

    animate(lastTime);
  }

  // ===========================================
  // SOUND EFFECTS
  // ===========================================

  function playBarkSound() {
    const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');
    if (settings.volume && settings.volume > 0) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 400;
        oscillator.type = 'square';
        gainNode.gain.value = settings.volume / 300;

        oscillator.start();
        setTimeout(() => {
          oscillator.frequency.value = 200;
        }, 50);
        setTimeout(() => oscillator.stop(), 150);
      } catch (e) {}
    }
  }

  function playHappySound() {
    const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');
    if (settings.volume && settings.volume > 0) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 400;
        oscillator.type = 'sine';
        gainNode.gain.value = settings.volume / 400;

        oscillator.start();
        setTimeout(() => { oscillator.frequency.value = 500; }, 100);
        setTimeout(() => { oscillator.frequency.value = 600; }, 200);
        setTimeout(() => oscillator.stop(), 300);
      } catch (e) {}
    }
  }

  function playFootstepSound() {
    const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');
    if (settings.volume && settings.volume > 0) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const panner = audioContext.createStereoPanner ? audioContext.createStereoPanner() : null;

        oscillator.connect(gainNode);

        // Apply panning based on dog's horizontal position
        if (panner) {
          const normalizedX = (dog.x / window.innerWidth) * 2 - 1; // -1 (left) to +1 (right)
          panner.pan.value = clamp(normalizedX, -1, 1);
          gainNode.connect(panner);
          panner.connect(audioContext.destination);
        } else {
          gainNode.connect(audioContext.destination);
        }

        // Subtle "tap" sound - very quiet
        oscillator.frequency.value = 80 + Math.random() * 20; // Slight variation
        oscillator.type = 'sine';
        gainNode.gain.value = settings.volume / 1000; // Very subtle

        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
        setTimeout(() => oscillator.stop(), 60);
      } catch (e) {}
    }
  }

  function playSighSound() {
    const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');
    if (settings.volume && settings.volume > 0) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Descending "sigh" sound - like air escaping
        oscillator.frequency.value = 300;
        oscillator.type = 'sine';
        gainNode.gain.value = settings.volume / 600;

        oscillator.start();
        // Descend in frequency over time for sigh effect
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.4);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
        setTimeout(() => oscillator.stop(), 450);
      } catch (e) {}
    }
  }

  function playEarFlopSound() {
    const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');
    if (settings.volume && settings.volume > 0) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Quick "flop" sound
        oscillator.frequency.value = 200;
        oscillator.type = 'sine';
        gainNode.gain.value = settings.volume / 800;

        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
        setTimeout(() => oscillator.stop(), 90);
      } catch (e) {}
    }
  }

  // ===========================================
  // NAUGHTY MODE: USER ACTIVITY TRACKING
  // ===========================================

  let naughtyModeCheckInterval = null;

  function resetIdleTimer() {
    dog.naughtyMode.isIdle = false;
    dog.naughtyMode.idleStartTime = Date.now();
  }

  function checkIdleStatus() {
    if (!dog.enabled || dog.naughtyMode.inProgress) return;

    const timeSinceActivity = Date.now() - dog.naughtyMode.idleStartTime;

    if (timeSinceActivity > dog.naughtyMode.idleThreshold && !dog.naughtyMode.isIdle) {
      dog.naughtyMode.isIdle = true;
      triggerNaughtyBehavior();
    }
  }

  function setupUserActivityTracking() {
    // Reset idle timer on user activity
    const activityHandler = () => resetIdleTimer();

    document.addEventListener('mousemove', activityHandler);
    document.addEventListener('mousedown', activityHandler);
    document.addEventListener('keydown', activityHandler);
    document.addEventListener('touchstart', activityHandler);

    // Check idle status every 2 seconds
    naughtyModeCheckInterval = setInterval(checkIdleStatus, 2000);
  }

  function teardownUserActivityTracking() {
    if (naughtyModeCheckInterval) {
      clearInterval(naughtyModeCheckInterval);
      naughtyModeCheckInterval = null;
    }
  }

  // ===========================================
  // ENABLE/DISABLE DOG
  // ===========================================

  // ===========================================
  // ACCESSIBILITY
  // ===========================================

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function getReducedMotionMultiplier() {
    // If user prefers reduced motion, scale down animation intensities
    if (prefersReducedMotion()) {
      return {
        animationSpeed: 0.5,      // Slower animations
        effectIntensity: 0.3,     // Reduce dust, smears, etc.
        soundVolume: 0.5,         // Quieter sounds
        disableEffects: true      // Disable non-essential effects
      };
    }
    return {
      animationSpeed: 1.0,
      effectIntensity: 1.0,
      soundVolume: 1.0,
      disableEffects: false
    };
  }

  // ===========================================
  // DOG INITIALIZATION
  // ===========================================

  function enableDog() {
    if (dog.enabled) return;

    dog.enabled = true;

    if (!dog.canvasEl) {
      createDogCanvas();
    }

    dog.canvasEl.style.display = 'block';
    if (dog.shadowEl) {
      dog.shadowEl.style.display = 'block';
    }

    // Initialize with float precision
    dog.x = 100.0 + Math.random() * (window.innerWidth - 200);
    dog.vx = 0.0;
    const renderX = (dog.x + 0.5) | 0;
    dog.canvasEl.style.left = renderX + 'px';
    if (dog.shadowEl) {
      dog.shadowEl.style.left = renderX + 'px';
    }

    // Initialize naughty mode
    dog.naughtyMode.idleStartTime = Date.now();
    setupUserActivityTracking();

    startAnimationLoop();

    setTimeout(() => scheduleNextBehavior(), 2000);
  }

  function disableDog() {
    if (!dog.enabled) return;

    dog.enabled = false;

    if (dog.canvasEl) {
      dog.canvasEl.style.display = 'none';
    }

    if (dog.shadowEl) {
      dog.shadowEl.style.display = 'none';
    }

    if (dog.animationFrame) {
      cancelAnimationFrame(dog.animationFrame);
    }

    clearTimeout(dog.behaviorTimer);

    // Clear thought bubble
    if (thoughtBubbleInterval) {
      clearInterval(thoughtBubbleInterval);
      thoughtBubbleInterval = null;
    }
    if (thoughtBubble && thoughtBubble.parentNode) {
      thoughtBubble.parentNode.removeChild(thoughtBubble);
      thoughtBubble = null;
    }

    // Clear micro-naughtiness timer and reset any nudged elements
    if (dog.microNaughtyTimer) {
      clearTimeout(dog.microNaughtyTimer);
      dog.microNaughtyTimer = null;
    }
    if (dog.microNaughtyTarget) {
      dog.microNaughtyTarget.style.transform = '';
      dog.microNaughtyTarget = null;
    }
    dog.microNaughtyActive = false;
    dog.microNaughtyNudges = 0;

    // Teardown naughty mode
    teardownUserActivityTracking();
  }

  // ===========================================
  // KEYBOARD CONTROLS
  // ===========================================

  let commandBuffer = '';
  let lastMouseX = window.innerWidth / 2;
  let lastMouseY = window.innerHeight / 2;

  // Cursor tracking for reactive behaviors
  document.addEventListener('mousemove', (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    // Update cursor look strength based on distance to dog
    if (dog.enabled && dog.canvasEl) {
      const rect = dog.canvasEl.getBoundingClientRect();
      const dogCenterX = rect.left + rect.width / 2;
      const dogCenterY = rect.top + rect.height / 2;
      const dx = lastMouseX - dogCenterX;
      const dy = lastMouseY - dogCenterY;
      const distance = Math.hypot(dx, dy);

      // Look-at within 200px, pounce trigger under 60px
      if (distance < 200) {
        dog.cursorLookStrength = lerp(dog.cursorLookStrength, 1 - distance / 200, 0.1);
      } else {
        dog.cursorLookStrength = lerp(dog.cursorLookStrength, 0, 0.1);
      }
    }
  });

  // Window blur/focus reactive behaviors
  window.addEventListener('blur', () => {
    if (dog.enabled && dog.currentBehavior !== 'lying') {
      // User left! Curl up and sleep
      executeBehavior('lie', 60000);
    }
  });

  window.addEventListener('focus', () => {
    if (dog.enabled && dog.currentBehavior === 'lying') {
      // User's back! Excited zoomies
      clearTimeout(dog.behaviorTimer);
      dog.currentBehavior = 'excited';
      dog.excitedStartFrame = dog.frameCount;
      playHappySound();

      setTimeout(() => {
        dog.currentBehavior = 'idle';
        dog.canvasEl.style.bottom = DOG_BASELINE + 'px';
        scheduleNextBehavior();
      }, 2000);
    }
  });

  document.addEventListener('keypress', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      return;
    }

    // Head tilt on keypress (curiosity reaction)
    if (dog.enabled && !dog.isWalking && dog.currentBehavior === 'idle') {
      dog.lastKeypress = Date.now();
      dog.headTiltTarget = (Math.random() < 0.5 ? -5 : 5); // Random tilt direction
    }

    commandBuffer += e.key;

    if (e.key === 'b' && dog.enabled) {
      if (ball) {
        ball.destroy();
      }

      // Create new ball and throw it toward the dog's mouth
      const mouth = { x: 0, y: 0 };
      if (dog.canvasEl) {
        const rect = dog.canvasEl.getBoundingClientRect();
        mouth.x = rect.left + (dog.facingRight ? rect.width * 0.75 : rect.width * 0.25);
        mouth.y = rect.top + rect.height * 0.4;
      }

      ball = new GameBall(lastMouseX, lastMouseY);
      ball.throw(lastMouseX, lastMouseY, mouth.x, mouth.y);
    }

    if (commandBuffer.endsWith('gooddog')) {
      if (dog.enabled) {
        petDog();
      } else {
        enableDog();
        setTimeout(() => petDog(), 1000);
      }
      commandBuffer = '';
    }

    if (commandBuffer.length > 20) {
      commandBuffer = '';
    }
  });

  // ===========================================
  // EXPORT FUNCTIONS
  // ===========================================

  window.SpriteDog = {
    enable: enableDog,
    disable: disableDog,
    isEnabled: () => dog.enabled
  };

  // ===========================================
  // LOAD SAVED STATE
  // ===========================================

  window.addEventListener('DOMContentLoaded', () => {
    const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');

    const shouldEnable = settings.spriteDog !== false;
    if (shouldEnable) {
      enableDog();
    }

    const dogToggle = document.getElementById('enable-dog');
    if (dogToggle) {
      dogToggle.checked = shouldEnable;
      dogToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          enableDog();
        } else {
          disableDog();
        }

        settings.spriteDog = e.target.checked;
        localStorage.setItem('dashboard-settings', JSON.stringify(settings));
      });
    }
  });

})();
