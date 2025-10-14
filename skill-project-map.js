// ============================================
// SKILL-PROJECT MAPPING DATA STRUCTURE
// Maps skills to project tags for filtering
// ============================================

(function() {
  'use strict';

  // Comprehensive skill-to-tag mapping
  // Each skill maps to array of project tags that use it
  const skillProjectMap = {
    // ==========================================
    // MATHEMATICAL FOUNDATIONS
    // ==========================================
    'Differential Equations': [
      'PDE-MODELS',      // KIMAIYA - PDE models for differentiation
      'PDE-SOLVERS',     // FDSC - solving PDEs
      'CELL-BIOLOGY',    // KIMAIYA - ODE/PDE systems for cells
      'SIMULATION'       // FDSC - numerical simulation
    ],

    'Stochastic Simulation': [
      'CELL-BIOLOGY',    // KIMAIYA - stochastic cell processes
      'SIMULATION',      // FDSC - Monte Carlo methods
      'MOLECULAR-BIO',   // BIOCOMPUTING - molecular stochasticity
      'PDE-MODELS'       // KIMAIYA - stochastic PDEs
    ],

    'Statistical Mechanics': [
      'MOLECULAR-BIO',   // BIOCOMPUTING - thermodynamics
      'THEORY',          // Theoretical frameworks
      'SYSTEMS',         // CONSTRAINT_THEORY - emergent systems
      'CELL-BIOLOGY'     // KIMAIYA - statistical behavior
    ],

    'Bayesian Inference': [
      'STATISTICS',      // MODEL_VERIFICATION
      'VALIDATION',      // MODEL_VERIFICATION - Bayesian validation
      'ML-TOOLS',        // MODEL_VERIFICATION - probabilistic ML
      'GENOMICS'         // GENOMEVAULT - statistical genomics
    ],

    'Optimization': [
      'AI-CONTROL',      // KIMAIYA - optimization-based control
      'PDE-SOLVERS',     // FDSC - numerical optimization
      'VALIDATION',      // MODEL_VERIFICATION - optimization algorithms
      'DISTRIBUTED'      // FDSC - distributed optimization
    ],

    'Parameter Estimation': [
      'VALIDATION',      // MODEL_VERIFICATION - parameter inference
      'STATISTICS',      // MODEL_VERIFICATION
      'AI-CONTROL',      // KIMAIYA - learning parameters
      'PDE-MODELS'       // KIMAIYA - fitting models to data
    ],

    'Dynamical Systems': [
      'CELL-BIOLOGY',    // KIMAIYA - cell fate dynamics
      'SYSTEMS',         // CONSTRAINT_THEORY - complex systems
      'THEORY',          // Theoretical dynamics
      'PDE-MODELS',      // KIMAIYA - dynamic PDEs
      'EMERGENCE'        // CONSTRAINT_THEORY - emergent dynamics
    ],

    'Gillespie Algorithm': [
      'CELL-BIOLOGY',    // KIMAIYA - stochastic gene expression
      'SIMULATION',      // FDSC - biochemical simulation
      'MOLECULAR-BIO'    // BIOCOMPUTING - molecular reactions
    ],

    // ==========================================
    // PROGRAMMING & SOFTWARE
    // ==========================================
    'Python': [
      'AI-CONTROL',      // KIMAIYA - Python ML stack
      'ML-TOOLS',        // MODEL_VERIFICATION - Python tools
      'STATISTICS',      // MODEL_VERIFICATION - Python stats
      'VALIDATION',      // MODEL_VERIFICATION
      'CRYPTOGRAPHY',    // GENOMEVAULT - Python crypto
      'GENOMICS',        // GENOMEVAULT - bioinformatics
      'PDE-SOLVERS',     // FDSC - Python PDE libs
      'SIMULATION'       // FDSC - Python simulation
    ],

    'R': [
      'STATISTICS',      // MODEL_VERIFICATION - R stats
      'VALIDATION',      // MODEL_VERIFICATION - R validation
      'GENOMICS',        // GENOMEVAULT - Bioconductor
      'CELL-BIOLOGY'     // KIMAIYA - single-cell analysis in R
    ],

    'Julia': [
      'PDE-SOLVERS',     // FDSC - DifferentialEquations.jl
      'DISTRIBUTED',     // FDSC - distributed Julia
      'SIMULATION',      // FDSC - high-performance simulation
      'PDE-MODELS'       // KIMAIYA - Julia PDE solving
    ],

    'Machine Learning': [
      'AI-CONTROL',      // KIMAIYA - ML-based control
      'ML-TOOLS',        // MODEL_VERIFICATION - ML toolkit
      'VALIDATION',      // MODEL_VERIFICATION - ML validation
      'STATISTICS',      // MODEL_VERIFICATION - statistical ML
      'GENOMICS'         // GENOMEVAULT - ML for genomics
    ],

    'PyTorch': [
      'AI-CONTROL',      // KIMAIYA - deep learning control
      'ML-TOOLS',        // MODEL_VERIFICATION - PyTorch tools
      'VALIDATION'       // MODEL_VERIFICATION - model verification
    ],

    'JAX': [
      'AI-CONTROL',      // KIMAIYA - differentiable programming
      'PDE-SOLVERS',     // FDSC - JAX for PDEs
      'ML-TOOLS'         // MODEL_VERIFICATION - JAX ML
    ],

    'NumPy': [
      'AI-CONTROL',
      'ML-TOOLS',
      'STATISTICS',
      'PDE-SOLVERS',
      'SIMULATION',
      'GENOMICS'
    ],

    'SciPy': [
      'PDE-MODELS',
      'PDE-SOLVERS',
      'STATISTICS',
      'VALIDATION',
      'SIMULATION'
    ],

    // ==========================================
    // BIOLOGICAL SYSTEMS EXPERTISE
    // ==========================================
    'Cell Biology': [
      'CELL-BIOLOGY',    // KIMAIYA - primary focus
      'WETWARE',         // BIOCOMPUTING - cellular computation
      'MOLECULAR-BIO',   // BIOCOMPUTING - cell-level mechanisms
      'THEORY'           // Theoretical cell biology
    ],

    'Biophysics': [
      'MOLECULAR-BIO',   // BIOCOMPUTING - biophysical mechanisms
      'CELL-BIOLOGY',    // KIMAIYA - biophysical models
      'PDE-MODELS',      // KIMAIYA - physical models
      'THEORY'           // Theoretical biophysics
    ],

    'Gene Regulatory Networks': [
      'CELL-BIOLOGY',    // KIMAIYA - GRN dynamics
      'MOLECULAR-BIO',   // BIOCOMPUTING - gene circuits
      'SYSTEMS',         // CONSTRAINT_THEORY - network systems
      'THEORY',          // Theoretical GRNs
      'WETWARE'          // BIOCOMPUTING - biological circuits
    ],

    'Protein Dynamics': [
      'MOLECULAR-BIO',   // BIOCOMPUTING - protein computation
      'WETWARE',         // BIOCOMPUTING - protein machinery
      'SIMULATION',      // FDSC - molecular dynamics
      'THEORY'           // Theoretical protein dynamics
    ],

    'Cellular Differentiation': [
      'CELL-BIOLOGY',    // KIMAIYA - iPSC differentiation
      'PDE-MODELS',      // KIMAIYA - differentiation models
      'AI-CONTROL',      // KIMAIYA - controlling differentiation
      'SYSTEMS'          // Complex cell fate systems
    ],

    'Stochastic Gene Expression': [
      'CELL-BIOLOGY',    // KIMAIYA - stochastic models
      'MOLECULAR-BIO',   // BIOCOMPUTING - gene expression
      'SIMULATION'       // Gillespie simulation
    ],

    'Single-Cell Analysis': [
      'CELL-BIOLOGY',    // KIMAIYA - single-cell data
      'GENOMICS',        // GENOMEVAULT - single-cell genomics
      'STATISTICS',      // Statistical analysis of sc data
      'VALIDATION'       // Validating single-cell models
    ],

    'Biochemical Kinetics': [
      'MOLECULAR-BIO',   // BIOCOMPUTING - reaction kinetics
      'SIMULATION',      // FDSC - kinetic simulations
      'PDE-MODELS',      // Reaction-diffusion systems
      'WETWARE'          // BIOCOMPUTING - biochemical computation
    ],

    // ==========================================
    // EXPERIMENTAL FOUNDATION
    // ==========================================
    'Flow Cytometry': [
      'CELL-BIOLOGY',    // KIMAIYA - understanding distributions
      'STATISTICS',      // Statistical analysis of flow data
      'VALIDATION'       // Experimental validation
    ],

    'Cell Culture': [
      'CELL-BIOLOGY',    // KIMAIYA - practical cell culture
      'WETWARE'          // BIOCOMPUTING - working with cells
    ],

    'Biochemical Assays': [
      'MOLECULAR-BIO',   // BIOCOMPUTING - wet lab validation
      'VALIDATION',      // Experimental validation
      'WETWARE'          // BIOCOMPUTING - biochemical systems
    ],

    'Quality Control': [
      'VALIDATION',      // MODEL_VERIFICATION - QC frameworks
      'CELL-BIOLOGY',    // KIMAIYA - manufacturing QC
      'STATISTICS'       // Statistical QC
    ],

    // ==========================================
    // CRYPTOGRAPHY & SECURITY (for GENOMEVAULT)
    // ==========================================
    'Cryptography': [
      'CRYPTOGRAPHY',    // GENOMEVAULT - core focus
      'GENOMICS'         // GENOMEVAULT - genomic security
    ],

    'Privacy-Preserving Computation': [
      'CRYPTOGRAPHY',    // GENOMEVAULT
      'GENOMICS'         // GENOMEVAULT
    ],

    'HDC': [
      'COMPRESSION',     // GENOMEVAULT - HDC compression
      'CRYPTOGRAPHY',    // GENOMEVAULT - HDC security
      'THEORY'           // Hyperdimensional computing theory
    ],

    // ==========================================
    // ADDITIONAL COMPUTATIONAL SKILLS
    // ==========================================
    'Distributed Computing': [
      'DISTRIBUTED',     // FDSC - primary focus
      'PDE-SOLVERS',     // FDSC - distributed solving
      'SIMULATION'       // FDSC - distributed simulation
    ],

    'High-Performance Computing': [
      'DISTRIBUTED',     // FDSC
      'PDE-SOLVERS',     // FDSC
      'SIMULATION',      // FDSC
      'GENOMICS'         // GENOMEVAULT - large-scale genomics
    ],

    'Numerical Methods': [
      'PDE-SOLVERS',     // FDSC
      'PDE-MODELS',      // KIMAIYA
      'SIMULATION',      // FDSC
      'STATISTICS'       // Numerical statistics
    ],

    // ==========================================
    // THEORETICAL FOUNDATIONS
    // ==========================================
    'Systems Theory': [
      'SYSTEMS',         // CONSTRAINT_THEORY
      'THEORY',          // Theoretical frameworks
      'EMERGENCE',       // CONSTRAINT_THEORY
      'CELL-BIOLOGY'     // Systems biology
    ],

    'Emergence': [
      'EMERGENCE',       // CONSTRAINT_THEORY
      'THEORY',          // Theoretical emergence
      'SYSTEMS',         // CONSTRAINT_THEORY
      'MOLECULAR-BIO'    // BIOCOMPUTING - emergent computation
    ],

    'Topology': [
      'THEORY',          // CONSTRAINT_THEORY
      'SYSTEMS',         // Network topology
      'EMERGENCE'        // Topological emergence
    ],

    'Information Theory': [
      'THEORY',          // Theoretical info theory
      'COMPRESSION',     // GENOMEVAULT - information compression
      'CRYPTOGRAPHY',    // GENOMEVAULT - info-theoretic security
      'WETWARE'          // BIOCOMPUTING - biological information
    ]
  };

  // Reverse mapping: tag -> skills that lead to it
  // Automatically generated from skillProjectMap
  const tagSkillMap = {};

  for (const [skill, tags] of Object.entries(skillProjectMap)) {
    tags.forEach(tag => {
      if (!tagSkillMap[tag]) {
        tagSkillMap[tag] = [];
      }
      tagSkillMap[tag].push(skill);
    });
  }

  // Project metadata (maps project names to their tags)
  const projectTags = {
    'KIMAIYA': ['CELL-BIOLOGY', 'PDE-MODELS', 'AI-CONTROL'],
    'GENOMEVAULT': ['GENOMICS', 'CRYPTOGRAPHY', 'COMPRESSION'],
    'BIOCOMPUTING': ['THEORY', 'MOLECULAR-BIO', 'WETWARE'],
    'FDSC': ['PDE-SOLVERS', 'DISTRIBUTED', 'SIMULATION'],
    'MODEL_VERIFICATION': ['STATISTICS', 'VALIDATION', 'ML-TOOLS'],
    'CONSTRAINT_THEORY': ['THEORY', 'EMERGENCE', 'SYSTEMS']
  };

  // Helper function: Get all tags for a skill
  function getTagsForSkill(skill) {
    return skillProjectMap[skill] || [];
  }

  // Helper function: Get all skills that lead to a tag
  function getSkillsForTag(tag) {
    return tagSkillMap[tag] || [];
  }

  // Helper function: Get project count for a skill
  function getProjectCountForSkill(skill) {
    const tags = getTagsForSkill(skill);
    const matchingProjects = new Set();

    for (const [projectName, projectTagList] of Object.entries(projectTags)) {
      if (tags.some(tag => projectTagList.includes(tag))) {
        matchingProjects.add(projectName);
      }
    }

    return matchingProjects.size;
  }

  // Helper function: Check if a project matches given tags (OR mode)
  function projectMatchesTags(projectName, tags, mode = 'OR') {
    const projectTagList = projectTags[projectName] || [];

    if (mode === 'OR') {
      return tags.some(tag => projectTagList.includes(tag));
    } else {
      // AND mode
      return tags.every(tag => projectTagList.includes(tag));
    }
  }

  // Export to global scope
  window.SkillProjectMap = {
    skillProjectMap,
    tagSkillMap,
    projectTags,
    getTagsForSkill,
    getSkillsForTag,
    getProjectCountForSkill,
    projectMatchesTags
  };

  console.log('[SkillProjectMap] Loaded mappings for', Object.keys(skillProjectMap).length, 'skills');

})();
