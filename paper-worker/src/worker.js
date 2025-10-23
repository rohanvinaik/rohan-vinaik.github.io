/**
 * Paper Discovery Worker
 * Fetches papers from arXiv, bioRxiv, and PubMed
 * Stores in KV, serves via API to website
 */

export default {
  // Scheduled cron job - runs daily at 9 AM UTC
  async scheduled(event, env, ctx) {
    console.log('Cron trigger: fetching papers...');
    ctx.waitUntil(fetchAndStorePapers(env));
  },

  // HTTP requests from your website
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // API Routes
    if (url.pathname === '/api/papers') {
      return handleGetPapers(request, env, corsHeaders);
    }

    if (url.pathname === '/api/refresh') {
      try {
        // Actually await the fetch to catch any errors
        const count = await fetchAndStorePapers(env);
        return new Response(JSON.stringify({
          status: 'success',
          timestamp: new Date().toISOString(),
          papersStored: count
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Error in refresh:', error);
        return new Response(JSON.stringify({
          status: 'error',
          message: error.message,
          timestamp: new Date().toISOString()
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
};

/**
 * Main paper fetching and storage logic
 */
async function fetchAndStorePapers(env) {
  console.log('Starting paper fetch...');

  const topics = [
    { query: 'hyperdimensional computing', category: 'hdc' },
    { query: 'vector symbolic architecture', category: 'hdc' },
    { query: 'genomic privacy', category: 'genomics' },
    { query: 'zero knowledge proof genomics', category: 'genomics' },
    { query: 'topological data analysis cells', category: 'tda' },
    { query: 'constraint satisfaction biology', category: 'theory' },
    { query: 'AI model verification', category: 'ai-security' },
    { query: 'behavioral fingerprinting neural networks', category: 'ai-security' },
    { query: 'iPSC differentiation computational', category: 'bio-computing' },
    { query: 'distributed computing privacy', category: 'theory' },
  ];

  const allPapers = [];

  // Fetch from arXiv
  for (const topic of topics) {
    try {
      const papers = await fetchArxiv(topic.query, topic.category, 3);
      console.log(`Fetched ${papers.length} papers for topic: ${topic.query}`);
      allPapers.push(...papers);
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Error fetching arXiv for ${topic.query}:`, error);
    }
  }

  // Fetch from bioRxiv
  try {
    const biorxivPapers = await fetchBioRxiv();
    allPapers.push(...biorxivPapers);
  } catch (error) {
    console.error('Error fetching bioRxiv:', error);
  }

  console.log(`Total papers fetched: ${allPapers.length}`);

  // Deduplicate by title
  const uniquePapers = deduplicatePapers(allPapers);
  console.log(`After deduplication: ${uniquePapers.length}`);

  // Rank by relevance
  const rankedPapers = rankPapers(uniquePapers);
  console.log(`After ranking: ${rankedPapers.length}, top score: ${rankedPapers[0]?.score || 'N/A'}`);

  // Store in KV
  await env.PAPERS_KV.put('latest_papers', JSON.stringify({
    papers: rankedPapers.slice(0, 30),
    updated: new Date().toISOString(),
    count: rankedPapers.length
  }), {
    expirationTtl: 86400 * 7 // 7 days
  });

  console.log(`Stored ${rankedPapers.slice(0, 30).length} papers in KV`);
  return rankedPapers.length;
}

/**
 * Fetch papers from arXiv API
 */
async function fetchArxiv(query, category, maxResults = 5) {
  const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&sortBy=submittedDate&sortOrder=descending&max_results=${maxResults}`;

  const response = await fetch(url);
  const xmlText = await response.text();

  console.log(`arXiv response status: ${response.status}, length: ${xmlText.length} chars`);
  if (xmlText.length < 500) {
    console.log(`arXiv response preview: ${xmlText.slice(0, 200)}`);
  }

  // Simple XML parsing (arXiv returns Atom feed)
  const entries = xmlText.match(/<entry>([\s\S]*?)<\/entry>/g) || [];
  console.log(`arXiv found ${entries.length} entries in XML`);

  const parsed = entries.map(entry => {
    const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() || '';
    const summary = entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.trim() || '';
    const published = entry.match(/<published>(.*?)<\/published>/)?.[1] || '';
    const id = entry.match(/<id>(.*?)<\/id>/)?.[1] || '';
    const authors = [...entry.matchAll(/<author>[\s\S]*?<name>(.*?)<\/name>/g)].map(m => m[1]);

    const paper = {
      title: cleanText(title),
      abstract: cleanText(summary),
      authors,
      published,
      url: id,
      pdf_url: id.replace('abs', 'pdf'),
      source: 'arxiv',
      topics: [category]
    };

    console.log(`Parsed paper - title: ${paper.title ? 'YES' : 'NO'}, abstract: ${paper.abstract ? 'YES' : 'NO'}`);
    return paper;
  }).filter(p => p.title && p.abstract);

  console.log(`After filter: ${parsed.length} papers`);
  return parsed;
}

/**
 * Fetch papers from bioRxiv RSS
 */
async function fetchBioRxiv() {
  const subjects = ['bioinformatics', 'genomics', 'systems-biology'];
  const papers = [];

  for (const subject of subjects) {
    try {
      const url = `https://connect.biorxiv.org/biorxiv_xml.php?subject=${subject}`;
      const response = await fetch(url);
      const xmlText = await response.text();

      const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];

      items.slice(0, 3).forEach(item => {
        const title = item.match(/<title>(.*?)<\/title>/)?.[1] || '';
        const description = item.match(/<description>(.*?)<\/description>/)?.[1] || '';
        const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '';
        const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';

        if (title && description && link) {
          papers.push({
            title: cleanText(title),
            abstract: cleanText(description),
            authors: [],
            published: pubDate || new Date().toISOString(),
            url: link,
            pdf_url: link + '.pdf',
            source: 'biorxiv',
            topics: ['genomics', 'bio-computing']
          });
        }
      });

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Error fetching bioRxiv ${subject}:`, error);
    }
  }

  return papers;
}

/**
 * Clean HTML entities and whitespace from text
 */
function cleanText(text) {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Remove duplicate papers by title similarity
 */
function deduplicatePapers(papers) {
  const seen = new Set();
  return papers.filter(paper => {
    const key = paper.title.toLowerCase().slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Rank papers by relevance to research interests
 */
function rankPapers(papers) {
  const keywords = {
    'hyperdimensional': 3,
    'vector symbolic': 3,
    'HDC': 3,
    'VSA': 3,
    'genomic privacy': 4,
    'zero knowledge': 3,
    'ZK-SNARK': 3,
    'topological data analysis': 3,
    'TDA': 2,
    'persistent homology': 2,
    'constraint satisfaction': 2,
    'constraint-oriented': 3,
    'behavioral fingerprinting': 4,
    'model verification': 3,
    'proof of training': 4,
    'differential privacy': 2,
    'federated learning': 2,
    'iPSC': 3,
    'stem cell': 2,
    'cell differentiation': 2,
    'GWAS': 2,
    'variant calling': 2,
    'bioinformatics': 1,
    'computational biology': 1,
    'distributed computing': 2,
    'cryptographic protocol': 2
  };

  return papers.map(paper => {
    let score = 0;
    const text = (paper.title + ' ' + paper.abstract).toLowerCase();

    // Keyword scoring
    for (const [keyword, weight] of Object.entries(keywords)) {
      if (text.includes(keyword.toLowerCase())) {
        score += weight;
      }
    }

    // Recency bonus
    const daysSince = (Date.now() - new Date(paper.published)) / (1000 * 60 * 60 * 24);
    if (daysSince < 7) score += 5;
    else if (daysSince < 30) score += 3;
    else if (daysSince < 90) score += 1;

    return { ...paper, score };
  }).sort((a, b) => b.score - a.score);
}

/**
 * Handle GET /api/papers requests
 */
async function handleGetPapers(request, env, corsHeaders) {
  const url = new URL(request.url);
  const filter = url.searchParams.get('filter') || 'all';
  const count = parseInt(url.searchParams.get('count') || '5');

  try {
    const stored = await env.PAPERS_KV.get('latest_papers', 'json');

    if (!stored) {
      return new Response(JSON.stringify({
        papers: [],
        updated: null,
        error: 'No papers available yet. Try clicking Refresh Now.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let papers = stored.papers;

    // Apply topic filter
    if (filter !== 'all') {
      papers = papers.filter(p => p.topics.includes(filter));
    }

    return new Response(JSON.stringify({
      papers: papers.slice(0, count),
      updated: stored.updated,
      total: papers.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
