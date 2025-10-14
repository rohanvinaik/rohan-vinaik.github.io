// Research project graph data structure
const GRAPH_DATA = {
  nodes: [
    // Core Computational Biology Projects
    {
      id: 'audhd',
      title: 'AUDHD',
      subtitle: 'Genetic Architecture Analysis',
      description: '7 genetic subtypes from 18,381 cases',
      type: 'biology',
      status: 'active',
      tags: ['GENOMICS', 'STATISTICAL-GENETICS', 'CLINICAL'],
      position: { x: 300, y: 100 }
    },
    {
      id: 'kimaiya',
      title: 'KIMAIYA',
      subtitle: 'iPSC Differentiation Platform',
      description: 'AI-guided stem cell protocols',
      type: 'biology',
      status: 'active',
      tags: ['STEM-CELLS', 'TDA', 'NETWORK-FLOW'],
      position: { x: 600, y: 100 }
    },
    {
      id: 'genomevault',
      title: 'GENOMEVAULT',
      subtitle: 'Privacy-Preserving Genomics',
      description: 'HDC + ZK-SNARKs + PIR',
      type: 'bio-crypto',
      status: 'published',
      tags: ['HDC', 'ZERO-KNOWLEDGE', 'GENOMICS'],
      position: { x: 450, y: 300 }
    },
    {
      id: 'biocomputing',
      title: 'BIOCOMPUTING',
      subtitle: 'Multi-Substrate HDC',
      description: 'Biological information processing',
      type: 'biology',
      status: 'research',
      tags: ['HDC', 'WETWARE', 'TDA'],
      position: { x: 750, y: 300 }
    },

    // AI Verification & Security
    {
      id: 'behavioral-holography',
      title: 'BEHAVIORAL HOLOGRAPHY',
      subtitle: 'LLM Identity Verification',
      description: 'Cryptographic behavioral verifier',
      type: 'ai-security',
      status: 'published',
      tags: ['AI-SECURITY', 'VERIFICATION', 'CRYPTOGRAPHY'],
      position: { x: 200, y: 500 }
    },
    {
      id: 'rev',
      title: 'REV',
      subtitle: 'Restriction Enzyme Verification',
      description: 'Black-box LLM fingerprinting',
      type: 'ai-security',
      status: 'active',
      tags: ['AI-SECURITY', 'VERIFICATION'],
      position: { x: 500, y: 500 }
    },
    {
      id: 'hbt',
      title: 'HBT',
      subtitle: 'Holographic Behavioral Twin',
      description: '95.8% verification with ZK proofs',
      type: 'ai-security',
      status: 'active',
      tags: ['AI-SECURITY', 'HDC', 'ZERO-KNOWLEDGE'],
      position: { x: 350, y: 700 }
    },

    // Foundational Framework
    {
      id: 'coec',
      title: 'CONSTRAINT THEORY',
      subtitle: 'COEC Framework',
      description: 'Ontological framework for emergence',
      type: 'theory',
      status: 'published',
      tags: ['ONTOLOGY', 'FRAMEWORK', 'EPISTEMOLOGY'],
      position: { x: 100, y: 900 }
    },

    // Infrastructure
    {
      id: 'fdsc',
      title: 'FDSC',
      subtitle: 'Distributed Computing',
      description: 'PDE solvers for biological sims',
      type: 'infrastructure',
      status: 'development',
      tags: ['PDE-SOLVERS', 'DISTRIBUTED'],
      position: { x: 600, y: 700 }
    },

    // Applied Tools
    {
      id: 'tailchasing',
      title: 'TAILCHASING',
      subtitle: 'Code Analysis',
      description: 'LLM anti-pattern detection',
      type: 'tools',
      status: 'active',
      tags: ['CODE-ANALYSIS', 'HDC'],
      position: { x: 800, y: 500 }
    }
  ],

  connections: [
    // Genomics → Privacy
    { from: 'audhd', to: 'genomevault', label: 'privacy needs', type: 'motivates' },
    { from: 'kimaiya', to: 'genomevault', label: 'data security', type: 'uses' },

    // HDC shared technology
    { from: 'genomevault', to: 'biocomputing', label: 'HDC methods', type: 'technology' },
    { from: 'genomevault', to: 'hbt', label: 'HDC + ZK', type: 'technology' },
    { from: 'hbt', to: 'tailchasing', label: 'HDC analysis', type: 'technology' },

    // Verification lineage
    { from: 'behavioral-holography', to: 'rev', label: 'evolved approach', type: 'iteration' },
    { from: 'behavioral-holography', to: 'hbt', label: 'HDC integration', type: 'iteration' },

    // Computational infrastructure
    { from: 'kimaiya', to: 'fdsc', label: 'distributed sims', type: 'requires' },
    { from: 'biocomputing', to: 'fdsc', label: 'large-scale compute', type: 'requires' },

    // Theoretical foundation
    { from: 'coec', to: 'behavioral-holography', label: 'constraint framework', type: 'informs' },
    { from: 'coec', to: 'genomevault', label: 'emergence theory', type: 'informs' },
    { from: 'coec', to: 'kimaiya', label: 'network dynamics', type: 'informs' },
    { from: 'coec', to: 'biocomputing', label: 'substrate independence', type: 'informs' },

    // Network analysis methods
    { from: 'kimaiya', to: 'biocomputing', label: 'TDA methods', type: 'technology' },

    // Applied verification
    { from: 'rev', to: 'tailchasing', label: 'model testing', type: 'application' }
  ],

  domains: [
    { id: 'biology', name: 'Computational Biology', color: '#4ade80' },
    { id: 'bio-crypto', name: 'Privacy-Preserving Biology', color: '#22d3ee' },
    { id: 'ai-security', name: 'AI Verification', color: '#f97316' },
    { id: 'theory', name: 'Theoretical Framework', color: '#a78bfa' },
    { id: 'infrastructure', name: 'Infrastructure', color: '#fb923c' },
    { id: 'tools', name: 'Applied Tools', color: '#fbbf24' }
  ]
};
