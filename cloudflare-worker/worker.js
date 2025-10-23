/**
 * Cloudflare Worker for Paper Feed
 * Fetches papers from arXiv, bioRxiv, and PubMed
 * Stores curated results in KV storage
 */

export default {
  async scheduled(event, env, ctx) {
    // Run daily at 9 AM UTC
    console.log('Scheduled task running at:', new Date().toISOString());
    await fetchAndStorePapers(env);
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // API endpoints
    if (url.pathname === '/api/papers') {
      return handleGetPapers(request, env, corsHeaders);
    }

    if (url.pathname === '/api/refresh' && request.method === 'POST') {
      await fetchAndStorePapers(env);
      return new Response(JSON.stringify({ status: 'refreshed', timestamp: new Date().toISOString() }), {
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: corsHeaders
    });
  }
};

/**
 * Fetch papers from multiple sources and store in KV
 */
async function fetchAndStorePapers(env) {
  const topics = [
    'hyperdimensional computing',
    'vector symbolic architectures',
    'genomic privacy',
    'zero knowledge proofs biology',
    'topological data analysis cells',
    'constraint satisfaction biology',
    'AI model verification',
    'behavioral fingerprinting',
    'differential privacy genomics',
    'federated learning healthcare'
  ];

  const papers = [];

  // Fetch from arXiv (5 papers per topic, limit to first 3 topics to avoid timeout)
  for (const topic of topics.slice(0, 3)) {
    try {
      const arxivPapers = await fetchArxiv(topic, 5);
      papers.push(...arxivPapers);
    } catch (error) {
      console.error(`Failed to fetch arXiv papers for topic "${topic}":`, error);
    }
  }

  // Fetch from bioRxiv
  try {
    const biorxivPapers = await fetchBioRxiv(['genomics', 'bioinformatics'], 10);
    papers.push(...biorxivPapers);
  } catch (error) {
    console.error('Failed to fetch bioRxiv papers:', error);
  }

  // Deduplicate by title
  const uniquePapers = deduplicatePapers(papers);

  // Rank by relevance
  const ranked = rankPapers(uniquePapers);

  // Store top 30 papers in KV
  await env.PAPERS_KV.put('latest_papers', JSON.stringify({
    papers: ranked.slice(0, 30),
    updated: new Date().toISOString()
  }), {
    expirationTtl: 86400 * 7 // 7 days
  });

  console.log(`Stored ${ranked.slice(0, 30).length} papers in KV`);
}

/**
 * Fetch papers from arXiv API
 */
async function fetchArxiv(query, maxResults) {
  const url = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&sortBy=submittedDate&sortOrder=descending&max_results=${maxResults}`;

  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PaperFeed/1.0)' }
  });

  if (!response.ok) {
    throw new Error(`arXiv API error: ${response.status}`);
  }

  const xml = await response.text();
  return parseArxivXML(xml);
}

/**
 * Parse arXiv XML response
 */
function parseArxivXML(xml) {
  const papers = [];

  // Simple regex-based XML parsing (Cloudflare Workers don't have DOMParser)
  const entryMatches = xml.matchAll(/<entry>(.*?)<\/entry>/gs);

  for (const match of entryMatches) {
    const entry = match[1];

    const title = entry.match(/<title>(.*?)<\/title>/s)?.[1]?.trim().replace(/\s+/g, ' ');
    const summary = entry.match(/<summary>(.*?)<\/summary>/s)?.[1]?.trim().replace(/\s+/g, ' ');
    const published = entry.match(/<published>(.*?)<\/published>/)?.[1];
    const id = entry.match(/<id>(.*?)<\/id>/)?.[1];

    // Extract authors
    const authorMatches = entry.matchAll(/<author>.*?<name>(.*?)<\/name>.*?<\/author>/gs);
    const authors = Array.from(authorMatches, m => m[1].trim());

    // Extract categories
    const categoryMatches = entry.matchAll(/<category.*?term="(.*?)".*?\/>/g);
    const categories = Array.from(categoryMatches, m => m[1]);

    if (title && summary && published) {
      papers.push({
        title,
        abstract: summary.slice(0, 500), // Limit abstract length
        authors,
        published,
        url: id,
        pdf_url: id?.replace('/abs/', '/pdf/'),
        source: 'arxiv',
        topics: categories.slice(0, 3), // First 3 categories
        raw_categories: categories
      });
    }
  }

  return papers;
}

/**
 * Fetch papers from bioRxiv
 */
async function fetchBioRxiv(subjects, maxResults) {
  const papers = [];

  for (const subject of subjects) {
    try {
      // bioRxiv RSS feed
      const url = `https://connect.biorxiv.org/biorxiv_xml.php?subject=${subject}`;

      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PaperFeed/1.0)' }
      });

      if (!response.ok) {
        console.error(`bioRxiv API error for ${subject}: ${response.status}`);
        continue;
      }

      const xml = await response.text();
      const parsed = parseBioRxivXML(xml);
      papers.push(...parsed);

    } catch (error) {
      console.error(`Failed to fetch bioRxiv for ${subject}:`, error);
    }
  }

  return papers.slice(0, maxResults);
}

/**
 * Parse bioRxiv XML/RSS response
 */
function parseBioRxivXML(xml) {
  const papers = [];

  // Parse RSS items
  const itemMatches = xml.matchAll(/<item>(.*?)<\/item>/gs);

  for (const match of itemMatches) {
    const item = match[1];

    const title = item.match(/<title>(.*?)<\/title>/s)?.[1]?.trim().replace(/\s+/g, ' ');
    const description = item.match(/<description>(.*?)<\/description>/s)?.[1]?.trim().replace(/\s+/g, ' ').replace(/<[^>]*>/g, '');
    const link = item.match(/<link>(.*?)<\/link>/)?.[1];
    const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1];
    const creator = item.match(/<dc:creator>(.*?)<\/dc:creator>/)?.[1];

    if (title && description && link) {
      // Parse authors from creator field
      const authors = creator ? creator.split(/[,;]/).map(a => a.trim()) : [];

      papers.push({
        title,
        abstract: description.slice(0, 500),
        authors,
        published: pubDate || new Date().toISOString(),
        url: link,
        pdf_url: link?.replace('/content/', '/content/') + '.full.pdf',
        source: 'biorxiv',
        topics: ['bioRxiv'],
        raw_categories: []
      });
    }
  }

  return papers;
}

/**
 * Deduplicate papers by title similarity
 */
function deduplicatePapers(papers) {
  const seen = new Set();
  const unique = [];

  for (const paper of papers) {
    // Normalize title for comparison
    const normalizedTitle = paper.title.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (!seen.has(normalizedTitle)) {
      seen.add(normalizedTitle);
      unique.push(paper);
    }
  }

  return unique;
}

/**
 * Rank papers by relevance to research interests
 */
function rankPapers(papers) {
  const keywords = [
    // Hyperdimensional Computing
    { term: 'hyperdimensional', weight: 5 },
    { term: 'vector symbolic', weight: 5 },
    { term: 'HDC', weight: 4 },
    { term: 'VSA', weight: 4 },
    { term: 'holographic reduced representation', weight: 4 },

    // Genomics & Privacy
    { term: 'genomic privacy', weight: 5 },
    { term: 'zero knowledge', weight: 4 },
    { term: 'ZK-SNARK', weight: 4 },
    { term: 'differential privacy', weight: 3 },
    { term: 'homomorphic encryption', weight: 3 },
    { term: 'private genomics', weight: 5 },

    // Topological Data Analysis
    { term: 'topological data analysis', weight: 4 },
    { term: 'TDA', weight: 3 },
    { term: 'persistent homology', weight: 4 },
    { term: 'mapper algorithm', weight: 3 },

    // Constraint Theory
    { term: 'constraint satisfaction', weight: 3 },
    { term: 'constraint-oriented', weight: 4 },
    { term: 'constraint network', weight: 3 },

    // AI Security & Verification
    { term: 'behavioral fingerprinting', weight: 4 },
    { term: 'model verification', weight: 4 },
    { term: 'proof of training', weight: 4 },
    { term: 'AI watermarking', weight: 3 },

    // Biology & Genomics
    { term: 'iPSC', weight: 3 },
    { term: 'stem cell', weight: 2 },
    { term: 'cell differentiation', weight: 2 },
    { term: 'GWAS', weight: 3 },
    { term: 'variant calling', weight: 2 },
    { term: 'bioinformatics', weight: 2 },
    { term: 'single cell', weight: 2 },

    // Federated & Distributed
    { term: 'federated learning', weight: 3 },
    { term: 'distributed computing', weight: 2 },

    // Other relevant
    { term: 'biocomputing', weight: 4 },
    { term: 'biological computing', weight: 4 },
    { term: 'DNA storage', weight: 3 }
  ];

  return papers.map(paper => {
    let score = 0;

    // Combine title and abstract for keyword matching
    const text = (paper.title + ' ' + paper.abstract).toLowerCase();

    // Keyword matching with weights
    for (const { term, weight } of keywords) {
      if (text.includes(term.toLowerCase())) {
        score += weight;
      }
    }

    // Recency bonus
    const daysSincePublished = (Date.now() - new Date(paper.published)) / (1000 * 60 * 60 * 24);
    if (daysSincePublished < 7) {
      score += 10; // Very recent
    } else if (daysSincePublished < 30) {
      score += 5; // Recent
    } else if (daysSincePublished < 90) {
      score += 2; // Somewhat recent
    }

    // Source bonus (prefer arXiv for CS topics)
    if (paper.source === 'arxiv') {
      score += 1;
    }

    return { ...paper, score };
  }).sort((a, b) => b.score - a.score);
}

/**
 * Handle GET /api/papers request
 */
async function handleGetPapers(request, env, corsHeaders) {
  const url = new URL(request.url);
  const filter = url.searchParams.get('filter') || 'all';
  const count = parseInt(url.searchParams.get('count') || '5');

  try {
    // Fetch from KV
    const stored = await env.PAPERS_KV.get('latest_papers', 'json');

    if (!stored || !stored.papers) {
      return new Response(JSON.stringify({
        papers: [],
        updated: null,
        error: 'No papers available. Try refreshing.'
      }), {
        headers: corsHeaders
      });
    }

    let papers = stored.papers;

    // Apply topic filter
    if (filter !== 'all') {
      papers = papers.filter(p => paperMatchesFilter(p, filter));
    }

    return new Response(JSON.stringify({
      papers: papers.slice(0, count),
      updated: stored.updated,
      total: papers.length
    }), {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Error fetching papers:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch papers',
      details: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

/**
 * Check if paper matches a topic filter
 */
function paperMatchesFilter(paper, filter) {
  const text = (paper.title + ' ' + paper.abstract).toLowerCase();

  const filterMap = {
    'hdc': ['hyperdimensional', 'vector symbolic', 'HDC', 'VSA', 'holographic'],
    'genomics': ['genomic', 'genome', 'DNA', 'sequencing', 'GWAS', 'variant', 'bioinformatics', 'privacy genomics'],
    'ai-security': ['verification', 'fingerprinting', 'proof of training', 'watermark', 'model security', 'AI security'],
    'tda': ['topological', 'TDA', 'persistent homology', 'mapper', 'topology'],
    'theory': ['constraint', 'framework', 'theoretical', 'mathematical model', 'ontology'],
    'bio-computing': ['biocomputing', 'biological computing', 'cellular computing', 'DNA computing', 'wetware']
  };

  const keywords = filterMap[filter] || [];

  return keywords.some(keyword => text.includes(keyword.toLowerCase()));
}
