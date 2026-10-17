/* Fixed-frame pixel companion. No procedural deformation or page-moving effects. */
(function () {
  'use strict';
  if (window.ASCIIDog) return;
  const WIDTH = 32, HEIGHT = 24, SCALE = 3;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const atlas = new Image();
  atlas.src = 'assets/dog-sprites.svg';
  let enabled = false, timer = null, button = null, ctx = null;
  let x = 0, destination = 0, direction = 1, state = 'IDLE';
  let until = 0, lastTick = 0, lastFrame = '', phase = 0;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function bounds() {
    const pane = document.querySelector('.output-area');
    const left = innerWidth > 800 && pane ? pane.getBoundingClientRect().left + 12 : 8;
    return {left, right: Math.max(left, innerWidth - WIDTH * SCALE - 8)};
  }

  function place() {
    if (!button) return;
    const limits = bounds();
    x = clamp(x, limits.left, limits.right);
    destination = clamp(destination, limits.left, limits.right);
    const bar = document.querySelector('.console-bar');
    const baseline = bar ? Math.max(0, innerHeight - bar.getBoundingClientRect().top) : 8;
    button.style.left = Math.round(x) + 'px';
    // Foot pixels occupy row 22; the transparent last row sits on the bar.
    button.style.bottom = Math.round(baseline - SCALE) + 'px';
  }

  function frameIndex(now) {
    if (state === 'SLEEP') return 6;
    if (state === 'SIT' || motion.matches) return 5;
    if (state === 'WALK') return 1 + Math.floor(phase / 4) % 4;
    if (state === 'PET') return Math.floor(now / 180) % 2 ? 7 : 0;
    return now % 6000 > 5800 ? 8 : 0;
  }

  function draw(now) {
    if (!ctx || !atlas.complete || !atlas.naturalWidth) return;
    const frame = frameIndex(now), key = frame + ':' + direction;
    if (lastFrame === key) return;
    lastFrame = key;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.save();
    if (direction < 0) { ctx.translate(WIDTH, 0); ctx.scale(-1, 1); }
    ctx.drawImage(atlas, frame * WIDTH, 0, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT);
    ctx.restore();
    button.dataset.pose = state.toLowerCase();
  }

  function chooseNext(now) {
    const choices = ['IDLE', 'SIT', 'WALK', 'IDLE', 'SLEEP'];
    state = motion.matches ? 'SIT' : choices[Math.floor(Math.random() * choices.length)];
    until = now + (state === 'SLEEP' ? 14000 : 3500 + Math.random() * 4500);
    if (state === 'WALK') {
      const limits = bounds();
      destination = limits.left + Math.random() * (limits.right - limits.left);
      direction = destination < x ? -1 : 1;
      if (Math.abs(destination - x) < 24) state = 'IDLE';
    }
    lastFrame = '';
  }

  function tick() {
    timer = null;
    if (!enabled || document.hidden) return;
    const now = performance.now(), dt = Math.min((now - lastTick) / 1000, .2);
    lastTick = now;
    if (now >= until) chooseNext(now);
    if (state === 'WALK' && !motion.matches) {
      const step = Math.min(Math.abs(destination - x), 36 * dt);
      x += direction * step;
      phase += step;
      if (Math.abs(destination - x) < .5) { state = 'IDLE'; until = now + 4500; lastFrame = ''; }
    }
    place(); draw(now);
    timer = setTimeout(tick, state === 'WALK' || state === 'PET' ? 100 : 200);
  }

  function pet() {
    state = motion.matches ? 'SIT' : 'PET';
    until = performance.now() + 1800;
    lastFrame = '';
    draw(performance.now());
  }

  function create() {
    button = document.createElement('button');
    button.id = 'dog-companion';
    button.type = 'button';
    button.setAttribute('aria-label', 'Pet the dog');
    button.title = 'Pet the dog';
    button.style.cssText = `position:fixed;width:${WIDTH*SCALE}px;height:${HEIGHT*SCALE}px;padding:0;margin:0;border:0;background:transparent;z-index:95;cursor:pointer;line-height:0;touch-action:manipulation;`;
    const canvas = document.createElement('canvas');
    canvas.id = 'dog-canvas';
    canvas.width = WIDTH; canvas.height = HEIGHT;
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'width:100%;height:100%;image-rendering:pixelated;display:block;';
    button.append(canvas); document.body.append(button);
    ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false;
    button.addEventListener('click', pet);
  }

  function enable() {
    if (enabled) return;
    if (!button) create();
    enabled = true; button.hidden = false;
    const limits = bounds();
    x = (limits.left + limits.right) / 2; destination = x;
    state = motion.matches ? 'SIT' : 'IDLE';
    until = performance.now() + 4500; lastTick = performance.now(); lastFrame = '';
    place(); tick();
  }

  function disable() {
    enabled = false; clearTimeout(timer); timer = null;
    if (button) button.hidden = true;
  }

  atlas.addEventListener('load', () => { if (enabled) { lastFrame = ''; draw(performance.now()); } });
  window.addEventListener('resize', place);
  document.addEventListener('visibilitychange', () => {
    clearTimeout(timer); timer = null;
    if (enabled && !document.hidden) { lastTick = performance.now(); tick(); }
  });
  motion.addEventListener('change', () => {
    if (!enabled) return;
    state = motion.matches ? 'SIT' : 'IDLE';
    until = performance.now() + 4500; lastFrame = ''; draw(performance.now());
  });
  window.ASCIIDog = {enable, disable, isEnabled: () => enabled};
})();
