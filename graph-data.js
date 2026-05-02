// Research project graph data structure
// Updated 2026-05 to reflect the four-pillar portfolio (ModelAtlas, Wayfinder,
// LintGate, Wesker) plus the current theoretical core and the older verification /
// grounding / alignment lineage that fed into them.
const GRAPH_DATA = {
  nodes: [
    // ============================================================
    // TIER 1 — Theoretical core
    // ============================================================
    {
      id: 'coec',
      title: 'COEC',
      subtitle: 'Constraint-Oriented Emergent Computation',
      description: 'Computation as trajectory through constrained state space.',
      type: 'theory',
      status: 'published',
      tags: ['ONTOLOGY', 'FRAMEWORK', 'CONSTRAINTS'],
      position: { x: 250, y: 100 }
    },
    {
      id: 'spec-complexity',
      title: 'SPEC COMPLEXITY',
      subtitle: 'Five-Field Identification',
      description: 'σ(P,μ) as a Blum measure. ~127 Lean 4 theorems across 12 fields.',
      type: 'theory',
      status: 'preprint',
      tags: ['LEAN', 'BLUM-MEASURES', 'MUTATION-SYMMETRY'],
      position: { x: 500, y: 100 }
    },
    {
      id: 'gse',
      title: 'GSE',
      subtitle: 'Geometric Semantic Encoding',
      description: 'Orthogonal Ternary Projection — informational zeros, no training.',
      type: 'theory',
      status: 'published',
      tags: ['HDC', 'OTP', 'SEMANTICS'],
      position: { x: 750, y: 100 }
    },

    // ============================================================
    // TIER 2 — Infrastructure / personal-knowledge platforms
    // ============================================================
    {
      id: 'mentalatlas',
      title: 'MENTALATLAS',
      subtitle: 'Personal-wiki MCP',
      description: 'Spreading-activation graph over 548 docs. Streams + signature anchors.',
      type: 'infrastructure',
      status: 'active',
      tags: ['MCP', 'KNOWLEDGE-GRAPH', 'ANCHORS'],
      position: { x: 200, y: 280 }
    },
    {
      id: 'mneme',
      title: 'MNEME',
      subtitle: 'Cognitive event graph',
      description: 'EPA values, weather, hypotheses — the affective layer beneath MentalAtlas.',
      type: 'infrastructure',
      status: 'active',
      tags: ['EPA', 'EVENTS', 'AFFECT'],
      position: { x: 450, y: 280 }
    },
    {
      id: 'hdc-survey',
      title: 'HDC SURVEY',
      subtitle: 'Hypervector principles',
      description: 'Vector-symbolic models — the substrate for several systems below.',
      type: 'theory',
      status: 'published',
      tags: ['HDC', 'VECTOR-SYMBOLIC', 'SURVEY'],
      position: { x: 700, y: 280 }
    },

    // ============================================================
    // TIER 3 — The four flagship systems (one paradigm, four domains)
    // ============================================================
    {
      id: 'modelatlas',
      title: 'MODELATLAS',
      subtitle: 'Coordinate system for HuggingFace',
      description: '29,657 models · 166 semantic anchors · <100ms · no GPU.',
      type: 'tools',
      status: 'shipped',
      tags: ['ML-MODEL-SEARCH', 'HDC', 'SEMANTIC-NAVIGATION'],
      position: { x: 130, y: 460 }
    },
    {
      id: 'wayfinder',
      title: 'WAYFINDER',
      subtitle: 'Proof compiler for Lean 4',
      description: '63% of a 2,000-theorem random Mathlib sample on a laptop, 22M-param encoder.',
      type: 'ai-security',
      status: 'active',
      tags: ['LEAN', 'NEURAL-THEOREM-PROVING', 'NAVIGATION'],
      position: { x: 380, y: 460 }
    },
    {
      id: 'lintgate',
      title: 'LINTGATE',
      subtitle: 'Specification compiler',
      description: '100% mutation kill on a 30K-model codebase. DO-178C Level A. 118 tools.',
      type: 'tools',
      status: 'shipped',
      tags: ['MUTATION-TESTING', 'SPECIFICATION', 'CODE-QUALITY'],
      position: { x: 630, y: 460 }
    },
    {
      id: 'wesker',
      title: 'WESKER',
      subtitle: 'In-process AST mutation testing',
      description: '100–500x faster than mutmut/cosmic-ray. 1,770 lines, zero deps.',
      type: 'tools',
      status: 'shipped',
      tags: ['MUTATION-TESTING', 'CI', 'PYTHON'],
      position: { x: 880, y: 460 }
    },

    // ============================================================
    // TIER 4 — Verification / grounding / alignment lineage
    // ============================================================
    {
      id: 'pot',
      title: 'PoT',
      subtitle: 'Proof-of-Training',
      description: '90.9% base/finetuned discrimination on a Mac. Cryptographic model identity.',
      type: 'ai-security',
      status: 'published',
      tags: ['VERIFICATION', 'BLACK-BOX', 'CRYPTOGRAPHY'],
      position: { x: 130, y: 660 }
    },
    {
      id: 'rev',
      title: 'REV',
      subtitle: 'Restriction-enzyme verification',
      description: 'Memory-bounded LLM verification. 70B models in 3–4 GB.',
      type: 'ai-security',
      status: 'active',
      tags: ['VERIFICATION', 'MEMORY-EFFICIENT'],
      position: { x: 320, y: 660 }
    },
    {
      id: 'hbt',
      title: 'HBT',
      subtitle: 'Holographic Behavioral Twin',
      description: '95.8% black-box identity verification with 256 API calls.',
      type: 'ai-security',
      status: 'published',
      tags: ['HDC', 'BLACK-BOX', 'VERIFICATION'],
      position: { x: 510, y: 660 }
    },
    {
      id: 'semantic-probing',
      title: 'SEM PROBING',
      subtitle: '62 NSM primitives via Hadamard',
      description: '100% routing precision · 273µs · zero training.',
      type: 'theory',
      status: 'active',
      tags: ['INTERPRETABILITY', 'NSM', 'HADAMARD'],
      position: { x: 700, y: 660 }
    },
    {
      id: 'negative-learning',
      title: 'NEG LEARNING',
      subtitle: 'Censors and suppressors',
      description: '22x more sample-efficient than positive examples — failure shapes are smaller.',
      type: 'ai-security',
      status: 'active',
      tags: ['MINSKY', 'CONSTRAINT-LEARNING'],
      position: { x: 890, y: 660 }
    },

    // ============================================================
    // TIER 5 — Domain applications
    // ============================================================
    {
      id: 'genomevault',
      title: 'GENOMEVAULT',
      subtitle: 'Privacy-preserving genomics',
      description: 'Z₂×Z₂ + HDC + reference pool. 99.978% accuracy at 30 MB / 5.81 µs.',
      type: 'bio-crypto',
      status: 'active',
      tags: ['GENOMICS', 'HDC', 'ZERO-KNOWLEDGE'],
      position: { x: 130, y: 860 }
    },
    {
      id: 'shortcutforge',
      title: 'SHORTCUTFORGE',
      subtitle: 'Apple Shortcuts compiler',
      description: 'Don\'t prompt. Compile. Treats LLM output as untrusted IR.',
      type: 'tools',
      status: 'active',
      tags: ['DSL', 'COMPILER', 'LLM-OUTPUT-VALIDATION'],
      position: { x: 350, y: 860 }
    },
    {
      id: 'yami',
      title: 'YAMI',
      subtitle: 'Wayfinder, applied to chess',
      description: '6 cheap signals — interference pattern IS the move.',
      type: 'exploratory',
      status: 'research',
      tags: ['NAVIGATION', 'INTERFERENCE'],
      position: { x: 540, y: 860 }
    },
    {
      id: 'vintageoptics',
      title: 'VINTAGEOPTICS',
      subtitle: 'Optical aberration correction',
      description: 'HDC-based correction over a database of 1,193 vintage lenses.',
      type: 'tools',
      status: 'active',
      tags: ['OPTICS', 'HDC', 'IMAGE-PROCESSING'],
      position: { x: 730, y: 860 }
    },
    {
      id: 'audhd',
      title: 'AUDHD',
      subtitle: 'Genetic architecture',
      description: '7 genetic subtypes from 18,381 cases.',
      type: 'biology',
      status: 'active',
      tags: ['GENOMICS', 'STATISTICAL-GENETICS'],
      position: { x: 920, y: 860 }
    }
  ],

  connections: [
    // Tier 1 → Tier 1: theoretical interlocks
    { from: 'coec', to: 'spec-complexity', label: 'σ(P,μ) as constraint measure', type: 'informs' },
    { from: 'coec', to: 'gse', label: 'orthogonal projection', type: 'informs' },
    { from: 'spec-complexity', to: 'gse', label: 'shared structural lens', type: 'informs' },

    // Tier 1 → Tier 2/3: theory grounds infrastructure & flagships
    { from: 'coec', to: 'mentalatlas', label: 'constraint geometry', type: 'informs' },
    { from: 'spec-complexity', to: 'lintgate', label: 'formalizes', type: 'informs' },
    { from: 'gse', to: 'modelatlas', label: 'OTP coordinate system', type: 'informs' },
    { from: 'gse', to: 'wayfinder', label: 'navigational encoding', type: 'informs' },
    { from: 'hdc-survey', to: 'modelatlas', label: 'hypervector primitives', type: 'informs' },
    { from: 'hdc-survey', to: 'genomevault', label: 'hypervector primitives', type: 'informs' },
    { from: 'hdc-survey', to: 'hbt', label: 'hypervector primitives', type: 'informs' },

    // Tier 2 ↔ Tier 2/3: personal-knowledge platforms underwrite the work
    { from: 'mentalatlas', to: 'mneme', label: 'shared vault, separate DB', type: 'parallels' },
    { from: 'mentalatlas', to: 'wayfinder', label: 'anchor extraction', type: 'serves' },
    { from: 'mentalatlas', to: 'modelatlas', label: 'anchor extraction', type: 'serves' },

    // Tier 3 ↔ Tier 3: the four pillars share paradigm & infrastructure
    { from: 'wayfinder', to: 'lintgate', label: 'spec → prescription → skeleton (sim 0.73)', type: 'parallels' },
    { from: 'wayfinder', to: 'modelatlas', label: 'shared paradigm: navigate, don\'t predict', type: 'parallels' },
    { from: 'lintgate', to: 'wesker', label: 'extracted from', type: 'iteration' },

    // Tier 4 → Tier 3: verification lineage feeds the pillars
    { from: 'pot', to: 'hbt', label: 'evolved approach', type: 'iteration' },
    { from: 'rev', to: 'hbt', label: 'memory bounding', type: 'technology' },
    { from: 'hbt', to: 'wayfinder', label: 'behavioral signature → proof signature', type: 'informs' },
    { from: 'semantic-probing', to: 'modelatlas', label: 'NSM primitive bank', type: 'informs' },
    { from: 'negative-learning', to: 'lintgate', label: 'failure-shaped specification', type: 'informs' },

    // Tier 3 → Tier 5: pillars enable applied work
    { from: 'wayfinder', to: 'yami', label: 'paradigm transfer', type: 'technology' },
    { from: 'lintgate', to: 'shortcutforge', label: 'spec compiler pattern', type: 'parallels' },
    { from: 'gse', to: 'vintageoptics', label: 'HDC over lens optics', type: 'informs' },
    { from: 'gse', to: 'genomevault', label: 'Z₂×Z₂ encoding', type: 'informs' },
    { from: 'genomevault', to: 'audhd', label: 'genomic infrastructure', type: 'technology' }
  ],

  domains: [
    { id: 'theory', name: 'Theoretical Foundation', color: '#a78bfa' },
    { id: 'infrastructure', name: 'Personal-Knowledge Infrastructure', color: '#fb923c' },
    { id: 'tools', name: 'Tools / Flagship Systems', color: '#fbbf24' },
    { id: 'ai-security', name: 'Verification & Alignment', color: '#f97316' },
    { id: 'bio-crypto', name: 'Privacy-Preserving Biology', color: '#22d3ee' },
    { id: 'biology', name: 'Computational Biology', color: '#4ade80' },
    { id: 'exploratory', name: 'Exploratory Research', color: '#ec4899' }
  ]
};
