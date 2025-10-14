// Research project graph data structure
const GRAPH_DATA = {
  nodes: [
    // TIER 1: Theoretical Foundation (TOP - most fundamental)
    {
      id: 'coec',
      title: 'CONSTRAINT THEORY',
      subtitle: 'COEC Framework',
      description: 'Ontological framework for emergence',
      type: 'theory',
      status: 'published',
      tags: ['ONTOLOGY', 'FRAMEWORK', 'EPISTEMOLOGY'],
      position: { x: 350, y: 100 }
    },
    {
      id: 'machine-ethics',
      title: 'MACHINE ETHICS',
      subtitle: 'Beyond Binary Ethics',
      description: 'Narrative learning and moral agency',
      type: 'theory',
      status: 'preprint',
      tags: ['PHILOSOPHY', 'AI-ETHICS', 'NARRATIVE-LEARNING'],
      position: { x: 650, y: 100 }
    },

    // TIER 2: Infrastructure & Technology Platforms
    {
      id: 'fdsc',
      title: 'FDSC',
      subtitle: 'Distributed Computing',
      description: 'PDE solvers for biological sims',
      type: 'infrastructure',
      status: 'development',
      tags: ['PDE-SOLVERS', 'DISTRIBUTED'],
      position: { x: 200, y: 300 }
    },
    {
      id: 'hdc-survey',
      title: 'HDC SURVEY',
      subtitle: 'Semantic Encoding',
      description: 'Hypervector principles and models',
      type: 'theory',
      status: 'published',
      tags: ['HDC', 'VECTOR-SYMBOLIC', 'SURVEY'],
      position: { x: 400, y: 300 }
    },
    {
      id: 'genomevault',
      title: 'GENOMEVAULT',
      subtitle: 'Privacy-Preserving Genomics',
      description: 'HDC + ZK-SNARKs + PIR',
      type: 'bio-crypto',
      status: 'published',
      tags: ['HDC', 'ZERO-KNOWLEDGE', 'GENOMICS'],
      position: { x: 600, y: 300 }
    },
    {
      id: 'behavioral-holography',
      title: 'BEHAVIORAL HOLOGRAPHY',
      subtitle: 'LLM Identity Verification',
      description: 'Cryptographic behavioral verifier',
      type: 'ai-security',
      status: 'published',
      tags: ['AI-SECURITY', 'VERIFICATION', 'CRYPTOGRAPHY'],
      position: { x: 800, y: 300 }
    },

    // TIER 3: Domain Applications
    {
      id: 'kimaiya',
      title: 'KIMAIYA',
      subtitle: 'iPSC Differentiation Platform',
      description: 'AI-guided stem cell protocols',
      type: 'biology',
      status: 'active',
      tags: ['STEM-CELLS', 'TDA', 'NETWORK-FLOW'],
      position: { x: 170, y: 500 }
    },
    {
      id: 'audhd',
      title: 'AUDHD',
      subtitle: 'Genetic Architecture Analysis',
      description: '7 genetic subtypes from 18,381 cases',
      type: 'biology',
      status: 'active',
      tags: ['GENOMICS', 'STATISTICAL-GENETICS', 'CLINICAL'],
      position: { x: 390, y: 500 }
    },
    {
      id: 'biocomputing',
      title: 'BIOCOMPUTING',
      subtitle: 'Multi-Substrate HDC',
      description: 'Biological information processing',
      type: 'biology',
      status: 'research',
      tags: ['HDC', 'WETWARE', 'TDA'],
      position: { x: 610, y: 500 }
    },
    {
      id: 'ad-mvp',
      title: 'AD-MVP',
      subtitle: 'Camera Architecture',
      description: 'Hybrid analog-digital optics + ML',
      type: 'exploratory',
      status: 'research',
      tags: ['COMPUTATIONAL-PHOTOGRAPHY', 'MACHINE-LEARNING'],
      position: { x: 830, y: 500 }
    },

    // TIER 4: Refined Methods & Iterations
    {
      id: 'rev',
      title: 'REV',
      subtitle: 'Restriction Enzyme Verification',
      description: 'Black-box LLM fingerprinting',
      type: 'ai-security',
      status: 'active',
      tags: ['AI-SECURITY', 'VERIFICATION'],
      position: { x: 350, y: 700 }
    },
    {
      id: 'hbt',
      title: 'HBT',
      subtitle: 'Holographic Behavioral Twin',
      description: '95.8% verification with ZK proofs',
      type: 'ai-security',
      status: 'active',
      tags: ['AI-SECURITY', 'HDC', 'ZERO-KNOWLEDGE'],
      position: { x: 650, y: 700 }
    },

    // TIER 5: Final Applications (BOTTOM - most specific)
    {
      id: 'tailchasing',
      title: 'TAILCHASING',
      subtitle: 'Code Analysis',
      description: 'LLM anti-pattern detection',
      type: 'tools',
      status: 'active',
      tags: ['CODE-ANALYSIS', 'HDC'],
      position: { x: 350, y: 900 }
    },
    {
      id: 'vintageoptics',
      title: 'VINTAGEOPTICS',
      subtitle: 'Lens Correction',
      description: 'HDC-based optical aberration correction',
      type: 'tools',
      status: 'active',
      tags: ['COMPUTER-VISION', 'HDC', 'OPTICS'],
      position: { x: 650, y: 900 }
    }
  ],

  connections: [
    // TIER 1 → TIER 2: Theoretical foundation informs platforms
    { from: 'coec', to: 'fdsc', label: 'constraint framework', type: 'informs' },
    { from: 'coec', to: 'genomevault', label: 'emergence theory', type: 'informs' },
    { from: 'coec', to: 'behavioral-holography', label: 'semantic agents', type: 'informs' },
    { from: 'machine-ethics', to: 'behavioral-holography', label: 'moral agency', type: 'informs' },

    // TIER 2 → TIER 3: Platforms enable domain applications
    { from: 'fdsc', to: 'kimaiya', label: 'distributed sims', type: 'technology' },
    { from: 'fdsc', to: 'biocomputing', label: 'large-scale compute', type: 'technology' },
    { from: 'genomevault', to: 'audhd', label: 'privacy-preserving', type: 'technology' },
    { from: 'genomevault', to: 'biocomputing', label: 'HDC methods', type: 'technology' },
    { from: 'behavioral-holography', to: 'rev', label: 'evolved approach', type: 'iteration' },
    { from: 'hdc-survey', to: 'genomevault', label: 'semantic encoding', type: 'informs' },
    { from: 'hdc-survey', to: 'biocomputing', label: 'vector models', type: 'informs' },

    // TIER 2 → TIER 4: Platform technology to refined methods
    { from: 'genomevault', to: 'hbt', label: 'HDC + ZK', type: 'technology' },
    { from: 'behavioral-holography', to: 'hbt', label: 'verification core', type: 'iteration' },
    { from: 'hdc-survey', to: 'hbt', label: 'hypervector theory', type: 'informs' },

    // TIER 3 → TIER 3: Cross-domain technology sharing
    { from: 'kimaiya', to: 'biocomputing', label: 'TDA methods', type: 'technology' },

    // TIER 1 → TIER 3: Direct foundational influence
    { from: 'coec', to: 'kimaiya', label: 'network dynamics', type: 'informs' },
    { from: 'coec', to: 'biocomputing', label: 'substrate independence', type: 'informs' },

    // TIER 4 → TIER 5: Refined methods enable final applications
    { from: 'hbt', to: 'tailchasing', label: 'HDC analysis', type: 'technology' },
    { from: 'rev', to: 'tailchasing', label: 'behavioral signatures', type: 'technology' },
    { from: 'hdc-survey', to: 'vintageoptics', label: 'vector operations', type: 'informs' },
    { from: 'ad-mvp', to: 'vintageoptics', label: 'optical systems', type: 'informs' }
  ],

  domains: [
    { id: 'biology', name: 'Computational Biology', color: '#4ade80' },
    { id: 'bio-crypto', name: 'Privacy-Preserving Biology', color: '#22d3ee' },
    { id: 'ai-security', name: 'AI Verification', color: '#f97316' },
    { id: 'theory', name: 'Theoretical Framework', color: '#a78bfa' },
    { id: 'infrastructure', name: 'Infrastructure', color: '#fb923c' },
    { id: 'tools', name: 'Applied Tools', color: '#fbbf24' },
    { id: 'exploratory', name: 'Exploratory Research', color: '#ec4899' }
  ]
};
