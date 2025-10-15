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

  // Anchors and feature positions
  const LEG_GROUPS = [[5,6], [9,10], [16,17], [20,21]];
  const LEG_ROWS_FROM_BOTTOM = 4;
  const MOUTH_ANCHOR = { x: 12, y: 5 };
  const TAIL_ANCHOR = { x: 21, y: 6 };
  const EYE_PIXELS = [{x:7,y:3}, {x:9,y:3}];

  // Utilities
  const copy2D = (m) => m.map(r => r.slice());
  const zero = (w,h) => Array.from({length:h},()=>Array(w).fill(0));

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
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1],
    [1,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1],
    [1,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1],
    [1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0]
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
  const BODY_FRAMES = (() => {
    const stand = copy2D(BASE_BODY);
    const walk1 = clearLegArea(BASE_BODY); paintLegs(walk1, [-1, 0, +1, 0]);
    const walk2 = clearLegArea(BASE_BODY); paintLegs(walk2, [ 0,+1,  0,-1]);
    const walk3 = clearLegArea(BASE_BODY); paintLegs(walk3, [+1, 0, -1, 0]);
    const walk4 = clearLegArea(BASE_BODY); paintLegs(walk4, [ 0,-1,  0,+1]);
    return {
      right: { stand, walk: [walk1, walk2, walk3, walk4] },
      left:  { stand: mirror(stand), walk: [mirror(walk1), mirror(walk2), mirror(walk3), mirror(walk4)] }
    };
  })();

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
    const dx = facing === 'right' ? MOUTH_ANCHOR.x : BODY_W - 1 - MOUTH_ANCHOR.x - 2;
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
    switch (kind) {
      case 'left':   return [{x:baseX,y:baseY},{x:baseX-1,y:baseY+1},{x:baseX-2,y:baseY+2}];
      case 'right':  return [{x:baseX,y:baseY},{x:baseX+1,y:baseY+1},{x:baseX+2,y:baseY+2}];
      default:       return [{x:baseX,y:baseY},{x:baseX,y:baseY+1}];
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
    const tx0 = Math.max(0, (facingRight?TAIL_ANCHOR.x:BODY_W-1-TAIL_ANCHOR.x)-3);
    const ty0 = Math.max(0, TAIL_ANCHOR.y-1);
    const clearPts = [];
    for (let yy=ty0; yy<ty0+4 && yy<BODY_H; yy++)
      for (let xx=tx0; xx<tx0+7 && xx<BODY_W; xx++) clearPts.push({x:xx,y:yy});
    blitErase(frame, clearPts);
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
      this.state = 'idle'; // 'idle', 'flying', 'grounded', 'caught', 'tug'

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
      const dx = targetX - startX;
      const dy = targetY - startY;
      const dist = Math.hypot(dx, dy);
      const speed = Math.min(dist / 8, 22);
      this.vx = (dx / dist) * speed;
      this.vy = (dy / dist) * (speed / 18) - 9;
      this.x = startX;
      this.y = startY;
      this.state = 'flying';
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
      switch (this.state) {
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
                    dog.canvasEl.style.bottom = '60px';
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
              dog.canvasEl.style.left = dog.x + 'px';
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
    }

    getMouthPosition() {
      const rect = dog.canvasEl.getBoundingClientRect();
      const x = rect.left + (dog.facingRight ? rect.width * 0.75 : rect.width * 0.25);
      const y = rect.top + rect.height * 0.4;
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

    x: 200,
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

    // Animation state
    mouthPhase: 0,
    tailPhase: 0,
    blinkTimer: 0,

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
    }
  };

  function createDogCanvas() {
    const shadow = document.createElement('div');
    shadow.id = 'dog-shadow';
    shadow.style.cssText = `
      position: fixed;
      bottom: 56px;
      left: ${dog.x}px;
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

    canvas.addEventListener('click', petDog);

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

    // Blink every ~6 seconds for 5 frames
    if (dog.blinkTimer <= 0 && Math.random() < 0.005) {
      dog.blinkTimer = 5;
    }
    const blink = dog.blinkTimer > 0;
    if (dog.blinkTimer > 0) dog.blinkTimer--;

    // Walk frame index + body bounce
    let bodyIndex = 0;
    let offsetY = 0;
    if (bodyPose === 'walk') {
      bodyIndex = Math.floor(dog.frameCount / 8) % 4;
      offsetY = [0, -1, 0, +1][bodyIndex];
    } else if (dog.currentBehavior === 'excited') {
      const hopPhase = Math.floor(dog.frameCount / 4) % 4;
      offsetY = hopPhase === 1 ? -3 : hopPhase === 2 ? -1 : 0;

      const t = (dog.frameCount - dog.excitedStartFrame) / 15;
      const xOffset = Math.sin(t) * 15;
      const figureYOffset = Math.sin(2 * t) * 8;

      dog.canvasEl.style.left = (dog.x + xOffset) + 'px';
      dog.canvasEl.style.bottom = (60 + figureYOffset) + 'px';
    } else {
      offsetY = Math.round(Math.sin(dog.frameCount / 40) * 0.5);
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

    drawMatrix(ctx, fr, ox, oy);

    dog.frameCount++;
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

  function updateMovement() {
    if (isSpeaking) {
      dog.isWalking = false;
      return;
    }

    if (!dog.isWalking || dog.targetX === null) return;

    const distance = Math.abs(dog.targetX - dog.x);

    if (distance < dog.walkSpeed) {
      dog.x = dog.targetX;
      dog.isWalking = false;
      dog.targetX = null;
      dog.walkFrame = 0;

      scheduleNextBehavior();
      return;
    }

    if (dog.targetX > dog.x) {
      dog.x += dog.walkSpeed;
      dog.facingRight = true;
    } else {
      dog.x -= dog.walkSpeed;
      dog.facingRight = false;
    }

    const margin = 50;
    dog.x = Math.max(margin, Math.min(window.innerWidth - margin, dog.x));

    dog.canvasEl.style.left = dog.x + 'px';
  }

  function scheduleNextBehavior() {
    if (isSpeaking) return;

    const behaviors = [
      { action: 'sit', duration: 5000, weight: 3 },
      { action: 'lie', duration: 8000, weight: 2 },
      { action: 'stand', duration: 3000, weight: 4 },
      { action: 'walk', duration: 0, weight: 3 },
      { action: 'bark', duration: 2000, weight: 1 }
    ];

    const totalWeight = behaviors.reduce((sum, b) => sum + b.weight, 0);
    let random = Math.random() * totalWeight;

    for (const behavior of behaviors) {
      random -= behavior.weight;
      if (random <= 0) {
        executeBehavior(behavior.action, behavior.duration);
        break;
      }
    }
  }

  function executeBehavior(action, duration) {
    clearTimeout(dog.behaviorTimer);

    switch (action) {
      case 'sit':
        dog.currentBehavior = 'sitting';
        dog.behaviorTimer = setTimeout(() => {
          dog.currentBehavior = 'idle';
          scheduleNextBehavior();
        }, duration);
        break;

      case 'lie':
        dog.currentBehavior = 'lying';
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
          dog.canvasEl.style.bottom = '60px';
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

    // Walk to the target
    dog.targetX = targetRect.left - 50;
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

  function startAnimationLoop() {
    function animate() {
      if (!dog.enabled) return;

      // Update ball physics - GameBall handles all state transitions internally
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

      updateMovement();
      drawDog();

      const timeSinceInteraction = Date.now() - dog.lastInteraction;
      if (timeSinceInteraction > 60000 && dog.currentBehavior !== 'lying' && !dog.chasingBall) {
        executeBehavior('lie', 30000);
      }

      dog.animationFrame = requestAnimationFrame(animate);
    }

    animate();
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

    dog.x = 100 + Math.random() * (window.innerWidth - 200);
    dog.canvasEl.style.left = dog.x + 'px';
    if (dog.shadowEl) {
      dog.shadowEl.style.left = dog.x + 'px';
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

    // Teardown naughty mode
    teardownUserActivityTracking();
  }

  // ===========================================
  // KEYBOARD CONTROLS
  // ===========================================

  let commandBuffer = '';
  let lastMouseX = window.innerWidth / 2;
  let lastMouseY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  document.addEventListener('keypress', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      return;
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

  window.ASCIIDog = {
    enable: enableDog,
    disable: disableDog,
    isEnabled: () => dog.enabled
  };

  // ===========================================
  // LOAD SAVED STATE
  // ===========================================

  window.addEventListener('DOMContentLoaded', () => {
    const settings = JSON.parse(localStorage.getItem('dashboard-settings') || '{}');

    const shouldEnable = settings.asciiDog !== false;
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

        settings.asciiDog = e.target.checked;
        localStorage.setItem('dashboard-settings', JSON.stringify(settings));
      });
    }
  });

})();
