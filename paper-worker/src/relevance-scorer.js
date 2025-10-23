/**
 * Advanced Relevance Scoring System
 * Non-linear multi-category scoring with multiplicative bonuses
 */

// Define research interest categories with keywords and weights
const RESEARCH_CATEGORIES = {
  BIOLOGY: {
    name: 'Biology',
    keywords: {
      // Computational biology
      'computational biology': 5,
      'systems biology': 4,
      'cellular computation': 5,
      'cell signaling': 4,
      'gene regulatory': 4,
      'protein folding': 4,
      'molecular computing': 5,
      'DNA computing': 4,
      'synthetic biology': 5,
      'biochemical network': 4,
      'reaction-diffusion': 4,
      'metabolic network': 3,
      'molecular dynamics': 3,
      'stem cell': 4,
      'iPSC': 3,
      'differentiation': 3,
      'morphogenesis': 4,
      'tissue engineering': 3,
      'bioprocess': 3,
      'cellular model': 4,
      'multicellular': 3,
      'organoid': 3,
    }
  },

  PHYSICAL_ARCHITECTURE: {
    name: 'Physical Data Architecture',
    keywords: {
      // Hyperdimensional computing
      'hyperdimensional computing': 5,
      'vector symbolic': 5,
      'HDC': 4,
      'VSA': 4,
      'holographic reduced': 5,
      'high-dimensional vector': 4,
      'distributed representation': 4,
      'sparse distributed': 4,

      // Topology
      'topological data analysis': 5,
      'persistent homology': 5,
      'TDA': 4,
      'mapper algorithm': 4,
      'sheaf cohomology': 4,
      'simplicial complex': 4,
      'morse theory': 3,
      'betti number': 3,
      'filtration': 3,

      // Neuromorphic/physical computing
      'neuromorphic': 5,
      'in-memory computing': 4,
      'memristor': 4,
      'analog computing': 4,
      'spiking neural': 4,
      'reservoir computing': 4,
      'physical neural network': 5,
    }
  },

  AI_ML: {
    name: 'AI/ML/Learning Networks',
    keywords: {
      // Core ML/AI
      'representation learning': 4,
      'neural network': 2,
      'deep learning': 2,
      'machine learning': 2,
      'feature learning': 3,
      'neural tangent kernel': 4,
      'double descent': 4,
      'implicit bias': 3,
      'lottery ticket': 3,

      // Federated/distributed learning
      'federated learning': 5,
      'distributed learning': 4,
      'decentralized learning': 4,
      'split learning': 4,
      'multi-agent learning': 4,
      'collaborative learning': 3,

      // Learning theory
      'free energy principle': 5,
      'active inference': 5,
      'predictive processing': 5,
      'predictive coding': 5,
      'variational free energy': 4,
      'bayesian brain': 4,
      'information bottleneck': 4,
      'self-supervised': 3,
      'contrastive learning': 3,

      // Network/graph learning
      'graph neural network': 4,
      'message passing': 3,
      'attention mechanism': 2,
      'transformer': 2,
    }
  },

  PRIVACY: {
    name: 'Privacy & Private Computing',
    keywords: {
      // Cryptographic privacy
      'zero knowledge': 5,
      'ZK-SNARK': 5,
      'ZK-STARK': 5,
      'homomorphic encryption': 5,
      'private information retrieval': 5,
      'PIR': 4,
      'secure multi-party': 5,
      'MPC': 4,
      'differential privacy': 4,
      'secure computation': 4,

      // Privacy-preserving ML
      'privacy-preserving machine learning': 5,
      'private neural network': 5,
      'encrypted inference': 4,
      'secure aggregation': 4,
      'genomic privacy': 5,
      'medical privacy': 4,

      // Cryptographic protocols
      'cryptographic protocol': 4,
      'oblivious transfer': 4,
      'secret sharing': 4,
      'garbled circuit': 4,
      'threshold cryptography': 4,
    }
  },

  MATH: {
    name: 'Mathematics',
    keywords: {
      // Information theory
      'information theory': 4,
      'mutual information': 4,
      'information geometry': 4,
      'rate distortion': 4,
      'channel capacity': 3,
      'kolmogorov complexity': 4,
      'entropy': 3,
      'shannon': 3,

      // Statistical mechanics
      'statistical mechanics': 4,
      'ising model': 4,
      'mean field theory': 4,
      'replica theory': 4,
      'spin glass': 4,
      'partition function': 3,

      // Dynamical systems
      'nonlinear dynamics': 4,
      'dynamical systems': 4,
      'chaos theory': 3,
      'bifurcation': 3,
      'lyapunov exponent': 3,
      'synchronization': 3,
      'attractor': 3,

      // Complex systems
      'self-organized criticality': 5,
      'critical phase transition': 5,
      'criticality': 4,
      'avalanche dynamics': 4,
      'power law': 3,
      'scale-free network': 3,
      'emergence': 4,

      // Optimization/variational methods
      'variational inference': 4,
      'convex optimization': 3,
      'constraint satisfaction': 4,
      'lagrangian': 3,
      'hamiltonian': 3,
    }
  }
};

/**
 * Calculate relevance score with category detection and multiplicative bonuses
 * @param {Object} paper - Paper object with title and abstract
 * @returns {Object} - Scoring details: score, categories, isGolden, categoryCount
 */
export function calculateRelevanceScore(paper) {
  const text = (paper.title + ' ' + paper.abstract).toLowerCase();

  // Track scores per category
  const categoryScores = {};
  const matchedKeywords = {};

  // Calculate base scores for each category
  for (const [categoryId, category] of Object.entries(RESEARCH_CATEGORIES)) {
    let categoryScore = 0;
    const matched = [];

    for (const [keyword, weight] of Object.entries(category.keywords)) {
      if (text.includes(keyword.toLowerCase())) {
        categoryScore += weight;
        matched.push(keyword);
      }
    }

    if (categoryScore > 0) {
      categoryScores[categoryId] = categoryScore;
      matchedKeywords[categoryId] = matched;
    }
  }

  // Count active categories (categories with score > 0)
  const activeCategories = Object.keys(categoryScores);
  const categoryCount = activeCategories.length;

  // Base score (sum of all category scores)
  let baseScore = Object.values(categoryScores).reduce((a, b) => a + b, 0);

  // Apply non-linear multiplicative bonuses for cross-category papers
  let multiplier = 1.0;

  if (categoryCount >= 2) {
    // Two categories: 1.5x bonus
    multiplier = 1.5;
  }
  if (categoryCount >= 3) {
    // Three categories: 2.0x bonus (like a combo multiplier!)
    multiplier = 2.0;
  }
  if (categoryCount >= 4) {
    // Four categories: 3.0x bonus (mega combo!)
    multiplier = 3.0;
  }
  if (categoryCount === 5) {
    // All five categories: 5.0x bonus (legendary combo!)
    multiplier = 5.0;
  }

  // Calculate final score with multiplier
  const finalScore = baseScore * multiplier;

  // Generate human-readable category tags
  const tags = activeCategories.map(catId => RESEARCH_CATEGORIES[catId].name);

  return {
    score: finalScore,
    baseScore: baseScore,
    multiplier: multiplier,
    categories: activeCategories,
    categoryCount: categoryCount,
    tags: tags,
    categoryScores: categoryScores,
    matchedKeywords: matchedKeywords,
    isGolden: false // Will be set during ranking based on percentile
  };
}

/**
 * Rank papers and identify golden papers (top 5%)
 * @param {Array} papers - Array of paper objects
 * @returns {Array} - Ranked papers with relevance scores
 */
export function rankPapersWithRelevance(papers) {
  // Calculate relevance scores for all papers
  const scoredPapers = papers.map(paper => {
    const relevance = calculateRelevanceScore(paper);
    return {
      ...paper,
      ...relevance
    };
  });

  // Sort by score (descending)
  scoredPapers.sort((a, b) => b.score - a.score);

  // Identify top 5% as golden papers
  const goldenThreshold = Math.ceil(scoredPapers.length * 0.05);

  for (let i = 0; i < scoredPapers.length; i++) {
    if (i < goldenThreshold) {
      scoredPapers[i].isGolden = true;
    }
  }

  console.log(`Ranked ${scoredPapers.length} papers, ${goldenThreshold} marked as golden (top 5%)`);

  // Log some stats about top papers
  if (scoredPapers.length > 0) {
    const topPaper = scoredPapers[0];
    console.log(`Top paper: "${topPaper.title.substring(0, 60)}..." - Score: ${topPaper.score.toFixed(1)} (${topPaper.categoryCount} categories, ${topPaper.multiplier}x multiplier)`);
  }

  return scoredPapers;
}

/**
 * Get simplified title for archiving (remove special chars, limit length)
 */
export function getSimplifiedTitle(title) {
  return title
    .replace(/[^\w\s-]/g, '')
    .substring(0, 150)
    .trim();
}
