/**
 * ASCII HERO - The Resolution
 *
 * Design philosophy encoded:
 * - Engagement REVEALS structure (not displaces it)
 * - Viewer's perception completes the computation
 * - Noise → Structure through attention
 *
 * Motifs tied to research themes:
 * - Encoding: DNA/hypervector compression
 * - Constraints: Energy landscapes, satisfaction not optimization
 * - Networks: Semantic connections, research topology
 */

class AsciiHero {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.config = {
      // Particle counts
      starCount: options.starCount || 250,
      motifParticleCount: options.motifParticleCount || 2500,

      // Appearance
      starOpacity: options.starOpacity || 0.2,
      particleSize: options.particleSize || 1.4,

      // The Resolution: how much structure is visible
      baseCoherence: options.baseCoherence || 0.3,    // Idle state coherence
      maxCoherence: options.maxCoherence || 0.95,     // Full engagement coherence
      coherenceRadius: options.coherenceRadius || 150, // Mouse influence radius

      // Animation
      breathingSpeed: options.breathingSpeed || 0.1,
      coherenceSpeed: options.coherenceSpeed || 0.04,

      // Colors
      dotColor: options.dotColor || '#ffffff',
      backgroundColor: options.backgroundColor || '#0a0a0a',

      ...options
    };

    this.stars = [];
    this.particles = [];
    this.mouseX = -1000;
    this.mouseY = -1000;
    this.isHovering = false;
    this.scrollProgress = 0;
    this.globalCoherence = this.config.baseCoherence;
    this.animationId = null;
    this.currentMotif = 'encoding';
    this.currentChapter = null;
    this.onChapterChange = options.onChapterChange || null;

    // Chapter definitions for narrative architecture
    // Each chapter triggers a pattern change at its scroll threshold
    this.chapters = options.chapters || [
      { id: 'home', start: 0, pattern: 'encoding' },
      { id: 'approach', start: 0.20, pattern: 'constraints' },
      { id: 'work', start: 0.40, pattern: 'network' },
      { id: 'papers', start: 0.60, pattern: 'encoding' },  // Papers uses encoding (similar to research data)
      { id: 'about', start: 0.80, pattern: 'emergence' }
    ];

    // Research-aligned motifs
    this.motifs = {
      encoding: this.generateEncodingField.bind(this),      // DNA/hypervector
      constraints: this.generateConstraintField.bind(this), // Energy landscape
      network: this.generateNetworkField.bind(this),        // Semantic connections
      emergence: this.generateEmergenceField.bind(this)     // Order from noise
    };

    this.init();
  }

  init() {
    this.resize();
    this.initStarfield();
    // Initialize with first chapter's pattern
    this.currentChapter = this.chapters[0].id;
    this.setMotif(this.chapters[0].pattern);
    this.bindEvents();
    // Set initial chapter based on scroll position (in case of page reload)
    this.updateChapter();
    this.animate();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);

    if (this.stars.length > 0) {
      this.initStarfield();
      this.setMotif(this.currentMotif);
    }
  }

  // ============================================
  // STARFIELD (atmospheric background)
  // ============================================

  initStarfield() {
    this.stars = [];
    for (let i = 0; i < this.config.starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 1.5 + 0.5,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.3 + 0.15
      });
    }
  }

  // ============================================
  // MOTIF GENERATORS
  // ============================================

  setMotif(motifName) {
    this.currentMotif = motifName;
    const generator = this.motifs[motifName];
    if (generator) {
      this.particles = generator();
    }
  }

  /**
   * ENCODING: DNA-like double helix
   * Represents: GenomeVault, hypervector compression, semantic encoding
   * "Compress once, query forever"
   */
  generateEncodingField() {
    const particles = [];
    const cx = this.width / 2;
    const cy = this.height / 2;
    const height = this.height * 0.7;
    const width = this.width * 0.12;
    const turns = 2.5;
    const count = this.config.motifParticleCount;

    // Generate helix structure
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const y = cy - height/2 + t * height;
      const phase = t * Math.PI * 2 * turns;

      // Choose strand (left or right)
      const strand = Math.random() > 0.5 ? 0 : Math.PI;
      const strandX = cx + Math.sin(phase + strand) * width;

      // Add noise for "unresolved" state
      const noiseX = (Math.random() - 0.5) * width * 2;
      const noiseY = (Math.random() - 0.5) * 40;

      // Depth-based intensity (front brighter)
      const depth = Math.cos(phase + strand);
      const intensity = 0.4 + Math.abs(depth) * 0.5;

      particles.push({
        // Noise state (scattered)
        noiseX: cx + noiseX,
        noiseY: y + noiseY,
        // Structure state (helix)
        structureX: strandX + (Math.random() - 0.5) * 8,
        structureY: y + (Math.random() - 0.5) * 4,
        // Current position
        x: cx + noiseX,
        y: y + noiseY,
        size: this.config.particleSize * (0.6 + Math.random() * 0.6),
        phase: phase,
        intensity: intensity,
        coherence: 0
      });

      // Base pair rungs (sparser)
      if (i % 40 === 0) {
        const leftX = cx + Math.sin(phase) * width;
        const rightX = cx + Math.sin(phase + Math.PI) * width;
        const rungCount = 4;
        for (let r = 0; r < rungCount; r++) {
          const rt = (r + 1) / (rungCount + 1);
          const rx = leftX + (rightX - leftX) * rt;
          particles.push({
            noiseX: cx + (Math.random() - 0.5) * width * 2,
            noiseY: y + (Math.random() - 0.5) * 40,
            structureX: rx,
            structureY: y,
            x: cx + (Math.random() - 0.5) * width * 2,
            y: y + (Math.random() - 0.5) * 40,
            size: this.config.particleSize * 0.7,
            phase: phase,
            intensity: 0.35,
            coherence: 0
          });
        }
      }
    }

    return particles;
  }

  /**
   * CONSTRAINTS: Energy landscape / topological surface
   * Represents: COEC, constraint satisfaction, "biology doesn't optimize—it satisfies"
   */
  generateConstraintField() {
    const particles = [];
    const cx = this.width / 2;
    const cy = this.height / 2;
    const radius = Math.min(this.width, this.height) * 0.35;
    const count = this.config.motifParticleCount;

    // Create an energy landscape with wells
    const wells = [
      { x: cx - radius * 0.4, y: cy - radius * 0.2, depth: 1.0 },
      { x: cx + radius * 0.3, y: cy + radius * 0.1, depth: 0.8 },
      { x: cx, y: cy + radius * 0.4, depth: 0.6 }
    ];

    for (let i = 0; i < count; i++) {
      // Random position in field
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      const fieldX = cx + Math.cos(angle) * r;
      const fieldY = cy + Math.sin(angle) * r;

      // Find influence from wells (structure emerges near wells)
      let totalInfluence = 0;
      let targetX = fieldX;
      let targetY = fieldY;

      for (const well of wells) {
        const dx = fieldX - well.x;
        const dy = fieldY - well.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = well.depth * Math.exp(-dist * dist / (radius * radius * 0.15));
        totalInfluence += influence;

        // Pull toward well
        targetX -= dx * influence * 0.3;
        targetY -= dy * influence * 0.3;
      }

      // Add concentric ring structure around wells
      const nearestWell = wells.reduce((nearest, well) => {
        const d = Math.sqrt((fieldX - well.x) ** 2 + (fieldY - well.y) ** 2);
        return d < nearest.dist ? { well, dist: d } : nearest;
      }, { well: null, dist: Infinity });

      if (nearestWell.well) {
        const ringRadius = nearestWell.dist;
        const ringAngle = Math.atan2(fieldY - nearestWell.well.y, fieldX - nearestWell.well.x);
        targetX = nearestWell.well.x + Math.cos(ringAngle) * ringRadius;
        targetY = nearestWell.well.y + Math.sin(ringAngle) * ringRadius;
      }

      particles.push({
        noiseX: fieldX,
        noiseY: fieldY,
        structureX: targetX + (Math.random() - 0.5) * 6,
        structureY: targetY + (Math.random() - 0.5) * 6,
        x: fieldX,
        y: fieldY,
        size: this.config.particleSize * (0.5 + totalInfluence * 0.8),
        phase: Math.random() * Math.PI * 2,
        intensity: 0.3 + totalInfluence * 0.6,
        coherence: 0
      });
    }

    return particles;
  }

  /**
   * NETWORK: Connected nodes / semantic graph
   * Represents: Research topology, semantic connections
   */
  generateNetworkField() {
    const particles = [];
    const cx = this.width / 2;
    const cy = this.height / 2;
    const radius = Math.min(this.width, this.height) * 0.38;
    const count = this.config.motifParticleCount;

    // Create nodes (research areas)
    const nodeCount = 7;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
      const r = radius * (0.5 + (i % 2) * 0.3);
      nodes.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        size: 0.8 + Math.random() * 0.4
      });
    }
    // Center node
    nodes.push({ x: cx, y: cy, size: 1.2 });

    // Distribute particles
    const particlesPerNode = Math.floor(count * 0.4 / nodes.length);
    const particlesPerEdge = Math.floor(count * 0.4 / (nodes.length * 2));
    const atmosphereParticles = count - particlesPerNode * nodes.length - particlesPerEdge * nodes.length * 2;

    // Node clusters
    for (const node of nodes) {
      for (let i = 0; i < particlesPerNode; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 25 * node.size;
        particles.push({
          noiseX: cx + (Math.random() - 0.5) * radius * 2,
          noiseY: cy + (Math.random() - 0.5) * radius * 2,
          structureX: node.x + Math.cos(angle) * r,
          structureY: node.y + Math.sin(angle) * r,
          x: cx + (Math.random() - 0.5) * radius * 2,
          y: cy + (Math.random() - 0.5) * radius * 2,
          size: this.config.particleSize * (0.7 + Math.random() * 0.5),
          phase: Math.random() * Math.PI * 2,
          intensity: 0.7 + Math.random() * 0.3,
          coherence: 0
        });
      }
    }

    // Edges (connections between nodes)
    for (let i = 0; i < nodes.length; i++) {
      const connections = [
        (i + 1) % nodes.length,
        nodes.length - 1 // Connect to center
      ];

      for (const j of connections) {
        if (i === j) continue;
        for (let p = 0; p < particlesPerEdge; p++) {
          const t = Math.random();
          const edgeX = nodes[i].x + (nodes[j].x - nodes[i].x) * t;
          const edgeY = nodes[i].y + (nodes[j].y - nodes[i].y) * t;

          particles.push({
            noiseX: cx + (Math.random() - 0.5) * radius * 2,
            noiseY: cy + (Math.random() - 0.5) * radius * 2,
            structureX: edgeX + (Math.random() - 0.5) * 8,
            structureY: edgeY + (Math.random() - 0.5) * 8,
            x: cx + (Math.random() - 0.5) * radius * 2,
            y: cy + (Math.random() - 0.5) * radius * 2,
            size: this.config.particleSize * 0.6,
            phase: Math.random() * Math.PI * 2,
            intensity: 0.3 + Math.random() * 0.2,
            coherence: 0
          });
        }
      }
    }

    // Atmosphere
    for (let i = 0; i < atmosphereParticles; i++) {
      const x = cx + (Math.random() - 0.5) * radius * 2.2;
      const y = cy + (Math.random() - 0.5) * radius * 2.2;
      particles.push({
        noiseX: x,
        noiseY: y,
        structureX: x,
        structureY: y,
        x: x,
        y: y,
        size: this.config.particleSize * 0.5,
        phase: Math.random() * Math.PI * 2,
        intensity: 0.1 + Math.random() * 0.1,
        coherence: 0
      });
    }

    return particles;
  }

  /**
   * EMERGENCE: Order crystallizing from noise
   * Represents: The Resolution principle itself
   */
  generateEmergenceField() {
    const particles = [];
    const cx = this.width / 2;
    const cy = this.height / 2;
    const radius = Math.min(this.width, this.height) * 0.35;
    const count = this.config.motifParticleCount;

    // Structure: concentric hexagonal rings (crystalline order)
    const rings = 6;
    const sidesPerRing = 6;

    for (let i = 0; i < count; i++) {
      // Random noise position
      const noiseAngle = Math.random() * Math.PI * 2;
      const noiseR = Math.sqrt(Math.random()) * radius * 1.2;
      const noiseX = cx + Math.cos(noiseAngle) * noiseR;
      const noiseY = cy + Math.sin(noiseAngle) * noiseR;

      // Structure position (hexagonal grid)
      const ring = Math.floor(Math.random() * rings) + 1;
      const ringRadius = (ring / rings) * radius;
      const pointsInRing = ring * sidesPerRing;
      const pointIndex = Math.floor(Math.random() * pointsInRing);
      const structureAngle = (pointIndex / pointsInRing) * Math.PI * 2;

      const structureX = cx + Math.cos(structureAngle) * ringRadius + (Math.random() - 0.5) * 10;
      const structureY = cy + Math.sin(structureAngle) * ringRadius + (Math.random() - 0.5) * 10;

      particles.push({
        noiseX,
        noiseY,
        structureX,
        structureY,
        x: noiseX,
        y: noiseY,
        size: this.config.particleSize * (0.5 + (1 - ring/rings) * 0.6),
        phase: structureAngle,
        intensity: 0.4 + (1 - ring/rings) * 0.5,
        coherence: 0
      });
    }

    return particles;
  }

  // ============================================
  // EVENTS
  // ============================================

  bindEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      this.isHovering = true;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouseX = -1000;
      this.mouseY = -1000;
      this.isHovering = false;
    });

    // Scroll affects global coherence AND chapter transitions
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      this.scrollProgress = Math.min(1, scrollY / Math.max(1, docHeight));

      // Check for chapter transitions (can be disabled via config.autoChapterDetection)
      if (this.config.autoChapterDetection !== false) {
        this.updateChapter();
      }
    });

    window.addEventListener('resize', () => this.resize());

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = touch.clientX - rect.left;
      this.mouseY = touch.clientY - rect.top;
      this.isHovering = true;
    }, { passive: false });

    this.canvas.addEventListener('touchend', () => {
      this.mouseX = -1000;
      this.mouseY = -1000;
      this.isHovering = false;
    });
  }

  // ============================================
  // THE RESOLUTION: Coherence determines structure
  // ============================================

  update() {
    const time = performance.now() * 0.001;

    // Global coherence from scroll
    const targetGlobalCoherence = this.config.baseCoherence +
      (this.config.maxCoherence - this.config.baseCoherence) * this.scrollProgress * 0.5;

    this.globalCoherence += (targetGlobalCoherence - this.globalCoherence) * 0.02;

    // Update stars
    for (let star of this.stars) {
      star.x += Math.sin(time * 0.08 + star.phase) * 0.05;
      star.y += Math.cos(time * 0.06 + star.phase) * 0.03;

      if (star.x < 0) star.x = this.width;
      if (star.x > this.width) star.x = 0;
      if (star.y < 0) star.y = this.height;
      if (star.y > this.height) star.y = 0;
    }

    // Update particles: coherence determines noise vs structure blend
    for (let p of this.particles) {
      // Local coherence from mouse proximity
      const dx = this.mouseX - p.x;
      const dy = this.mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetCoherence = this.globalCoherence;

      if (this.isHovering && dist < this.config.coherenceRadius) {
        // Mouse REVEALS structure - snap to near-perfect coherence
        const proximity = 1 - (dist / this.config.coherenceRadius);
        // Aggressive curve: even moderate proximity → high coherence
        const localCoherence = proximity * proximity * proximity; // Cubic for sharper falloff
        targetCoherence = this.globalCoherence + localCoherence * (0.98 - this.globalCoherence);
      }

      // Faster coherence transition when revealing, slower when fading
      const speed = targetCoherence > p.coherence ? 0.12 : 0.04;
      p.coherence += (targetCoherence - p.coherence) * speed;

      // Blend between noise and structure based on coherence
      const targetX = p.noiseX + (p.structureX - p.noiseX) * p.coherence;
      const targetY = p.noiseY + (p.structureY - p.noiseY) * p.coherence;

      // Gentle breathing (reduced when coherent)
      const breathScale = 1 - p.coherence * 0.7;
      const breath = Math.sin(time * this.config.breathingSpeed + p.phase);
      const breathX = breath * 2 * breathScale;
      const breathY = Math.cos(time * this.config.breathingSpeed * 0.7 + p.phase) * 1.5 * breathScale;

      // Smooth interpolation to target
      p.x += (targetX + breathX - p.x) * 0.06;
      p.y += (targetY + breathY - p.y) * 0.06;
    }
  }

  render() {
    const time = performance.now() * 0.001;

    // Clear
    this.ctx.fillStyle = this.config.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw starfield
    this.ctx.fillStyle = this.config.dotColor;
    for (let star of this.stars) {
      const twinkle = 0.5 + Math.sin(time * star.twinkleSpeed + star.phase) * 0.3;
      this.ctx.globalAlpha = this.config.starOpacity * twinkle;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Draw particles - opacity increases with coherence
    this.ctx.fillStyle = this.config.dotColor;
    for (let p of this.particles) {
      const baseOpacity = p.intensity * 0.4;
      const coherenceOpacity = p.intensity * p.coherence * 0.6;
      this.ctx.globalAlpha = baseOpacity + coherenceOpacity;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
  }

  animate() {
    this.update();
    this.render();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }

  setPattern(patternName) {
    if (this.motifs[patternName]) {
      this.setMotif(patternName);
    }
  }

  getCoherence() {
    return this.globalCoherence;
  }

  /**
   * Update chapter based on scroll position
   * Triggers pattern transition when crossing chapter boundaries
   */
  updateChapter() {
    // Find current chapter based on scroll progress
    let newChapter = this.chapters[0];
    for (const chapter of this.chapters) {
      if (this.scrollProgress >= chapter.start) {
        newChapter = chapter;
      }
    }

    // If chapter changed, trigger transition
    if (this.currentChapter !== newChapter.id) {
      const previousChapter = this.currentChapter;
      this.currentChapter = newChapter.id;

      // Transition to new pattern with smooth morphing
      if (newChapter.pattern !== this.currentMotif) {
        this.transitionToPattern(newChapter.pattern);
      }

      // Notify callback if provided
      if (this.onChapterChange) {
        this.onChapterChange({
          previous: previousChapter,
          current: newChapter.id,
          pattern: newChapter.pattern,
          scrollProgress: this.scrollProgress
        });
      }
    }
  }

  /**
   * Get current chapter info
   */
  getCurrentChapter() {
    return {
      id: this.currentChapter,
      pattern: this.currentMotif,
      scrollProgress: this.scrollProgress,
      coherence: this.globalCoherence
    };
  }

  /**
   * Smooth transition to new pattern
   * Particles morph from current position to new structure
   */
  transitionToPattern(patternName) {
    if (!this.motifs[patternName]) return;

    // Store current positions as new noise positions
    const currentPositions = this.particles.map(p => ({ x: p.x, y: p.y }));

    // Generate new structure
    this.particles = this.motifs[patternName]();

    // Use current positions as starting noise state for smooth transition
    for (let i = 0; i < this.particles.length && i < currentPositions.length; i++) {
      this.particles[i].noiseX = currentPositions[i].x;
      this.particles[i].noiseY = currentPositions[i].y;
      this.particles[i].x = currentPositions[i].x;
      this.particles[i].y = currentPositions[i].y;
      // Carry over coherence for smooth visual transition
      this.particles[i].coherence = this.globalCoherence * 0.3;
    }

    this.currentMotif = patternName;
  }

  /**
   * Set chapter manually (for navigation clicks)
   */
  setChapter(chapterId) {
    const chapter = this.chapters.find(c => c.id === chapterId);
    if (chapter) {
      this.currentChapter = chapter.id;
      this.transitionToPattern(chapter.pattern);
      if (this.onChapterChange) {
        this.onChapterChange({
          previous: null,
          current: chapter.id,
          pattern: chapter.pattern,
          scrollProgress: this.scrollProgress
        });
      }
    }
  }
}

const NoiseToStructure = AsciiHero;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AsciiHero, NoiseToStructure };
}
