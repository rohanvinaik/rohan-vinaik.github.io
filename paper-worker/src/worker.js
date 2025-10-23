/**
 * Paper Discovery Worker
 * Fetches papers from arXiv, bioRxiv, and PubMed
 * Stores in KV, serves via API to website
 */

import { addToArchive, getPapersByTag, getArchiveStats } from './archive.js';

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

    if (url.pathname === '/api/archive') {
      return handleGetArchive(request, env, corsHeaders);
    }

    if (url.pathname === '/api/archive/stats') {
      return handleGetArchiveStats(request, env, corsHeaders);
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
    // Core HDC/VSA research
    { query: 'hyperdimensional computing', category: 'hdc' },
    { query: 'vector symbolic architecture', category: 'hdc' },
    { query: 'high-dimensional vector representations', category: 'hdc' },
    { query: 'holographic reduced representations', category: 'hdc' },
    { query: 'sparse distributed representations', category: 'hdc' },
    
    // Constraint-oriented computation and emergence
    { query: 'constraint satisfaction emergence', category: 'coec' },
    { query: 'emergent computation biological', category: 'coec' },
    { query: 'free energy principle computation', category: 'coec' },
    { query: 'active inference systems', category: 'coec' },
    { query: 'variational free energy', category: 'coec' },
    { query: 'predictive coding neural', category: 'coec' },
    { query: 'bayesian brain hypothesis', category: 'coec' },
    
    // Privacy-preserving genomics
    { query: 'genomic privacy homomorphic', category: 'genomics' },
    { query: 'zero knowledge proof genomics', category: 'genomics' },
    { query: 'private information retrieval biology', category: 'genomics' },
    
    // Biological computing
    { query: 'molecular computing protein folding', category: 'bio-computing' },
    { query: 'DNA computing strand displacement', category: 'bio-computing' },
    { query: 'synthetic biology computation', category: 'bio-computing' },
    { query: 'cellular computation', category: 'bio-computing' },
    
    // Neuromorphic and brain-inspired computing
    { query: 'neuromorphic computing architecture', category: 'neuromorphic' },
    { query: 'spiking neural networks hardware', category: 'neuromorphic' },
    { query: 'memristor computing', category: 'neuromorphic' },
    { query: 'neuromorphic engineering', category: 'neuromorphic' },
    { query: 'brain-inspired computing', category: 'neuromorphic' },
    
    // Topological methods
    { query: 'persistent homology biological', category: 'tda' },
    { query: 'topological data analysis morphogenesis', category: 'tda' },
    { query: 'mapper algorithm biology', category: 'tda' },
    
    // Information Theory & Compression
    { query: 'information bottleneck neural', category: 'info-theory' },
    { query: 'rate distortion theory', category: 'info-theory' },
    { query: 'mutual information estimation', category: 'info-theory' },
    { query: 'information geometry learning', category: 'info-theory' },
    { query: 'entropy minimization systems', category: 'info-theory' },
    { query: 'minimum description length', category: 'info-theory' },
    
    // Complex Systems & Criticality
    { query: 'self-organized criticality', category: 'complex-systems' },
    { query: 'critical phase transitions neural', category: 'complex-systems' },
    { query: 'emergence complex systems', category: 'complex-systems' },
    { query: 'avalanche dynamics neural', category: 'complex-systems' },
    { query: 'scale-free networks brain', category: 'complex-systems' },
    { query: 'power law biological', category: 'complex-systems' },
    
    // Statistical Mechanics & Physics
    { query: 'statistical mechanics neural networks', category: 'stat-mech' },
    { query: 'ising model neural computation', category: 'stat-mech' },
    { query: 'mean field theory learning', category: 'stat-mech' },
    { query: 'replica theory neural', category: 'stat-mech' },
    { query: 'spin glass neural networks', category: 'stat-mech' },
    
    // Sparse Coding & Representation Learning
    { query: 'sparse coding visual cortex', category: 'sparse-coding' },
    { query: 'dictionary learning biological', category: 'sparse-coding' },
    { query: 'efficient coding hypothesis', category: 'sparse-coding' },
    { query: 'compressed sensing neural', category: 'sparse-coding' },
    
    // Neural Computation Theory
    { query: 'neural computation theory', category: 'neural-theory' },
    { query: 'computational neuroscience models', category: 'neural-theory' },
    { query: 'population coding neural', category: 'neural-theory' },
    { query: 'neural manifolds dynamics', category: 'neural-theory' },
    { query: 'attractor networks brain', category: 'neural-theory' },
    
    // Nonlinear Dynamics & Chaos
    { query: 'nonlinear dynamics neural', category: 'dynamics' },
    { query: 'chaos synchronization networks', category: 'dynamics' },
    { query: 'bifurcation neural systems', category: 'dynamics' },
    { query: 'dynamical systems computational', category: 'dynamics' },
    
    // Machine Learning Theory
    { query: 'representation learning theory', category: 'ml-theory' },
    { query: 'neural tangent kernel', category: 'ml-theory' },
    { query: 'implicit bias gradient descent', category: 'ml-theory' },
    { query: 'generalization neural networks', category: 'ml-theory' },
    { query: 'lottery ticket hypothesis', category: 'ml-theory' },
    
    // Artificial Life & Self-Organization
    { query: 'artificial life systems', category: 'alife' },
    { query: 'autopoiesis self-organization', category: 'alife' },
    { query: 'morphogenesis computational', category: 'alife' },
    { query: 'evolutionary computation emergence', category: 'alife' },
    
    // Consciousness & Integrated Information
    { query: 'integrated information theory', category: 'consciousness' },
    { query: 'phi consciousness measure', category: 'consciousness' },
    { query: 'neural correlates consciousness', category: 'consciousness' },
    { query: 'global workspace theory', category: 'consciousness' },
  ];

  const allPapers = [];

  // Calculate date 3 months ago for filtering
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  // Fetch from arXiv
  for (const topic of topics) {
    try {
      const papers = await fetchArxiv(topic.query, topic.category, 5, threeMonthsAgo);
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
    const biorxivPapers = await fetchBioRxiv(threeMonthsAgo);
    allPapers.push(...biorxivPapers);
  } catch (error) {
    console.error('Error fetching bioRxiv:', error);
  }

  // Fetch from medRxiv (medical sciences)
  try {
    const medrxivPapers = await fetchMedRxiv(threeMonthsAgo);
    allPapers.push(...medrxivPapers);
  } catch (error) {
    console.error('Error fetching medRxiv:', error);
  }

  // Fetch from chemRxiv (chemistry)
  try {
    const chemrxivPapers = await fetchChemRxiv(threeMonthsAgo);
    allPapers.push(...chemrxivPapers);
  } catch (error) {
    console.error('Error fetching chemRxiv:', error);
  }

  // Fetch from PsyArXiv (psychology/cognitive science)
  try {
    const psyarxivPapers = await fetchPsyArxiv(threeMonthsAgo);
    allPapers.push(...psyarxivPapers);
  } catch (error) {
    console.error('Error fetching PsyArXiv:', error);
  }

  // Fetch from high-impact journal RSS feeds
  try {
    const journalPapers = await fetchJournalFeeds(threeMonthsAgo);
    allPapers.push(...journalPapers);
  } catch (error) {
    console.error('Error fetching journal feeds:', error);
  }

  // Note: Twitter papers are now fetched by a separate worker to avoid subrequest limits

  console.log(`Total papers fetched: ${allPapers.length}`);

  // Deduplicate by title
  const uniquePapers = deduplicatePapers(allPapers);
  console.log(`After deduplication: ${uniquePapers.length}`);

  // Filter out recently shown papers (past 24 hours)
  const filteredPapers = await filterRecentlyShown(env, uniquePapers);
  console.log(`After filtering recently shown: ${filteredPapers.length} (removed ${uniquePapers.length - filteredPapers.length})`);

  // Enrich with quality signals (if Semantic Scholar API key available)
  let enrichedPapers = filteredPapers;
  if (env.SEMANTIC_SCHOLAR_API_KEY) {
    try {
      enrichedPapers = await enrichWithSemanticScholar(filteredPapers, env.SEMANTIC_SCHOLAR_API_KEY);
      console.log('Papers enriched with citation data');
    } catch (error) {
      console.error('Failed to enrich with Semantic Scholar:', error);
    }
  }

  // Rank by relevance and quality
  const rankedPapers = rankPapers(enrichedPapers);
  console.log(`After ranking: ${rankedPapers.length}, top score: ${rankedPapers[0]?.score || 'N/A'}`);

  // Add to archive (all papers, not just top 30)
  try {
    const archiveResult = await addToArchive(env, rankedPapers);
    console.log(`Archive: ${archiveResult.added} new papers, ${archiveResult.total} total`);
  } catch (error) {
    console.error('Failed to update archive:', error);
  }

  // Merge with existing papers in KV (to preserve Twitter papers from weekly runs)
  try {
    const existing = await env.PAPERS_KV.get('latest_papers', 'json');
    let allCombinedPapers = rankedPapers;

    if (existing && existing.papers) {
      // Combine new papers with existing papers
      allCombinedPapers = [...rankedPapers, ...existing.papers];

      // Deduplicate combined list
      allCombinedPapers = deduplicatePapers(allCombinedPapers);

      // Re-rank combined list
      allCombinedPapers = rankPapers(allCombinedPapers);

      console.log(`Combined with existing: ${allCombinedPapers.length} total papers`);
    }

    // Store top 30 for display
    const topPapers = allCombinedPapers.slice(0, 30);
    await env.PAPERS_KV.put('latest_papers', JSON.stringify({
      papers: topPapers,
      updated: new Date().toISOString(),
      count: allCombinedPapers.length
    }), {
      expirationTtl: 86400 * 7 // 7 days
    });

    // Update recently shown papers (merge with existing)
    const recentlyShown = await env.PAPERS_KV.get('recently_shown_papers', 'json');
    const newShownPapers = [...topPapers.map(p => ({ url: p.url, title: p.title }))];

    if (recentlyShown && recentlyShown.papers) {
      newShownPapers.push(...recentlyShown.papers);
    }

    await env.PAPERS_KV.put('recently_shown_papers', JSON.stringify({
      papers: newShownPapers.slice(0, 100), // Keep last 100
      updated: new Date().toISOString()
    }), {
      expirationTtl: 86400 // 24 hours
    });

    console.log(`Stored ${topPapers.length} papers in KV (including ${rankedPapers.length} new from this run)`);
    return rankedPapers.length;
  } catch (error) {
    console.error('Error storing papers:', error);
    throw error;
  }
}

/**
 * Fetch papers from arXiv API with date filtering
 */
async function fetchArxiv(query, category, maxResults = 5, dateAfter = null) {
  // Format date for arXiv query (YYYYMMDD0000)
  let searchQuery = `all:${encodeURIComponent(query)}`;
  
  if (dateAfter) {
    const dateStr = dateAfter.toISOString().split('T')[0].replace(/-/g, '');
    searchQuery += ` AND submittedDate:[${dateStr}0000 TO 99991231235959]`;
  }

  const url = `https://export.arxiv.org/api/query?search_query=${searchQuery}&sortBy=submittedDate&sortOrder=descending&max_results=${maxResults}`;

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
    const authors = [...entry.matchAll(/<author>[\s\S]*?<name>(.*?)<\/name>/g)].map(m => m[1].trim());
    
    // Extract arXiv categories for quality signals
    const categories = [...entry.matchAll(/<category\s+term="([^"]+)"/g)].map(m => m[1]);
    const primaryCategory = entry.match(/<arxiv:primary_category[^>]+term="([^"]+)"/)?.[1] || categories[0] || '';

    const paper = {
      title: cleanText(title),
      abstract: cleanText(summary),
      authors,
      published,
      url: id,
      pdf_url: id.replace('abs', 'pdf'),
      source: 'arxiv',
      topics: [category],
      categories,
      primaryCategory
    };

    console.log(`Parsed paper - title: ${paper.title ? 'YES' : 'NO'}, abstract: ${paper.abstract ? 'YES' : 'NO'}`);
    return paper;
  }).filter(p => p.title && p.abstract);

  console.log(`After filter: ${parsed.length} papers`);
  return parsed;
}

/**
 * Fetch papers from medRxiv RSS with date filtering
 */
async function fetchMedRxiv(dateAfter = null) {
  const subjects = ['bioinformatics', 'health-informatics', 'medical-education'];
  const papers = [];

  for (const subject of subjects) {
    try {
      const url = `https://connect.medrxiv.org/medrxiv_xml.php?subject=${subject}`;
      const response = await fetch(url);
      const xmlText = await response.text();

      const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];

      items.forEach(item => {
        const title = item.match(/<title>(.*?)<\/title>/)?.[1] || '';
        const description = item.match(/<description>(.*?)<\/description>/)?.[1] || '';
        const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '';
        const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
        
        const paperDate = pubDate ? new Date(pubDate) : new Date();
        
        if (dateAfter && paperDate < dateAfter) {
          return;
        }

        if (title && description && link) {
          papers.push({
            title: cleanText(title),
            abstract: cleanText(description),
            authors: [],
            published: paperDate.toISOString(),
            url: link,
            pdf_url: link + '.pdf',
            source: 'medrxiv',
            topics: ['bio-computing', 'genomics'],
            categories: [subject],
            primaryCategory: subject
          });
        }
      });

      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Error fetching medRxiv ${subject}:`, error);
    }
  }

  return papers;
}

/**
 * Fetch papers from chemRxiv via OSF API
 */
async function fetchChemRxiv(dateAfter = null) {
  const papers = [];
  
  try {
    // ChemRxiv uses OSF infrastructure
    const url = 'https://api.osf.io/v2/preprints/?filter[provider]=chemrxiv&page[size]=50';
    const response = await fetch(url);
    const data = await response.json();

    if (data.data) {
      for (const item of data.data) {
        const dateCreated = new Date(item.attributes.date_created);
        
        if (dateAfter && dateCreated < dateAfter) {
          continue;
        }

        // Only include if keywords match molecular/computational chemistry
        const title = item.attributes.title || '';
        const abstract = item.attributes.description || '';
        const text = (title + ' ' + abstract).toLowerCase();
        
        const relevantKeywords = ['computational', 'molecular', 'simulation', 'quantum', 'dynamics', 'protein', 'folding', 'dna', 'reaction'];
        const isRelevant = relevantKeywords.some(kw => text.includes(kw));
        
        if (isRelevant) {
          papers.push({
            title: cleanText(title),
            abstract: cleanText(abstract),
            authors: [],
            published: dateCreated.toISOString(),
            url: item.links.html,
            pdf_url: item.links.download || item.links.html,
            source: 'chemrxiv',
            topics: ['bio-computing', 'molecular-computing'],
            categories: ['chemistry'],
            primaryCategory: 'chemistry'
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching chemRxiv:', error);
  }

  return papers;
}

/**
 * Fetch papers from PsyArXiv via OSF API
 */
async function fetchPsyArxiv(dateAfter = null) {
  const papers = [];
  
  try {
    const url = 'https://api.osf.io/v2/preprints/?filter[provider]=psyarxiv&page[size]=50';
    const response = await fetch(url);
    const data = await response.json();

    if (data.data) {
      for (const item of data.data) {
        const dateCreated = new Date(item.attributes.date_created);
        
        if (dateAfter && dateCreated < dateAfter) {
          continue;
        }

        const title = item.attributes.title || '';
        const abstract = item.attributes.description || '';
        const text = (title + ' ' + abstract).toLowerCase();
        
        // Filter for cognitive science, consciousness, predictive processing topics
        const relevantKeywords = ['consciousness', 'integrated information', 'predictive', 'bayesian', 'neural', 'cognitive', 'perception', 'attention', 'free energy'];
        const isRelevant = relevantKeywords.some(kw => text.includes(kw));
        
        if (isRelevant) {
          papers.push({
            title: cleanText(title),
            abstract: cleanText(abstract),
            authors: [],
            published: dateCreated.toISOString(),
            url: item.links.html,
            pdf_url: item.links.download || item.links.html,
            source: 'psyarxiv',
            topics: ['consciousness', 'coec', 'neural-theory'],
            categories: ['psychology'],
            primaryCategory: 'psychology'
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching PsyArXiv:', error);
  }

  return papers;
}

/**
 * Fetch papers and articles from journals, academic news, and blogs
 */
async function fetchJournalFeeds(dateAfter = null) {
  const journals = [
    // High-impact journals
    {
      name: 'Nature Neuroscience',
      url: 'https://www.nature.com/neuro.rss',
      topics: ['neural-theory', 'neuroscience']
    },
    {
      name: 'Nature Machine Intelligence',
      url: 'https://www.nature.com/natmachintell.rss',
      topics: ['ml-theory', 'neuromorphic']
    },
    {
      name: 'Nature Physics',
      url: 'https://www.nature.com/nphys.rss',
      topics: ['stat-mech', 'complex-systems']
    },
    {
      name: 'PLOS Computational Biology',
      url: 'https://journals.plos.org/ploscompbiol/feed/atom',
      topics: ['bio-computing', 'neural-theory']
    },
    {
      name: 'eLife',
      url: 'https://elifesciences.org/rss/recent.xml',
      topics: ['bio-computing', 'neuroscience']
    },
    {
      name: 'Physical Review E',
      url: 'https://journals.aps.org/pre/recent',
      topics: ['stat-mech', 'complex-systems', 'dynamics']
    },

    // Academic news and articles
    {
      name: 'Science News',
      url: 'https://www.sciencenews.org/feed',
      topics: ['general-science', 'research-news']
    },
    {
      name: 'Nature News',
      url: 'https://www.nature.com/nature.rss',
      topics: ['general-science', 'research-news']
    },
    {
      name: 'Science Magazine News',
      url: 'https://www.science.org/rss/news_current.xml',
      topics: ['general-science', 'research-news']
    },
    {
      name: 'PNAS Front Matter',
      url: 'https://www.pnas.org/rss/front.xml',
      topics: ['general-science']
    },
    {
      name: 'Cell Press Articles',
      url: 'https://www.cell.com/cell/current.rss',
      topics: ['bio-computing', 'neuroscience']
    },
    {
      name: 'Neuron Journal',
      url: 'https://www.cell.com/neuron/current.rss',
      topics: ['neuroscience', 'neural-theory']
    }
  ];

  const papers = [];

  for (const journal of journals) {
    try {
      const response = await fetch(journal.url);
      const xmlText = await response.text();

      // Parse both RSS and Atom formats
      const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || 
                   xmlText.match(/<entry>([\s\S]*?)<\/entry>/g) || [];

      for (const item of items) {
        // Try RSS format first
        let title = item.match(/<title>(.*?)<\/title>/)?.[1] || 
                   item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || '';
        let description = item.match(/<description>(.*?)<\/description>/)?.[1] ||
                         item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] ||
                         item.match(/<summary>(.*?)<\/summary>/)?.[1] || '';
        let link = item.match(/<link>(.*?)<\/link>/)?.[1] ||
                  item.match(/<link[^>]+href="([^"]+)"/)?.[1] || '';
        let pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ||
                     item.match(/<published>(.*?)<\/published>/)?.[1] ||
                     item.match(/<updated>(.*?)<\/updated>/)?.[1] || '';

        if (!title || !link) continue;

        const paperDate = pubDate ? new Date(pubDate) : new Date();
        
        if (dateAfter && paperDate < dateAfter) {
          continue;
        }

        papers.push({
          title: cleanText(title),
          abstract: cleanText(description),
          authors: [],
          published: paperDate.toISOString(),
          url: link,
          pdf_url: link,
          source: journal.name.toLowerCase().replace(/\s+/g, '-'),
          topics: journal.topics,
          categories: [journal.name],
          primaryCategory: journal.name,
          venue: journal.name
        });
      }

      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Error fetching ${journal.name}:`, error);
    }
  }

  return papers;
}

/**
 * Fetch papers from bioRxiv RSS with date filtering
 */
async function fetchBioRxiv(dateAfter = null) {
  const subjects = ['bioinformatics', 'genomics', 'systems-biology', 'synthetic-biology'];
  const papers = [];

  for (const subject of subjects) {
    try {
      const url = `https://connect.biorxiv.org/biorxiv_xml.php?subject=${subject}`;
      const response = await fetch(url);
      const xmlText = await response.text();

      const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];

      items.forEach(item => {
        const title = item.match(/<title>(.*?)<\/title>/)?.[1] || '';
        const description = item.match(/<description>(.*?)<\/description>/)?.[1] || '';
        const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '';
        const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
        
        // Parse publication date
        const paperDate = pubDate ? new Date(pubDate) : new Date();
        
        // Filter by date if specified
        if (dateAfter && paperDate < dateAfter) {
          return; // Skip old papers
        }

        if (title && description && link) {
          papers.push({
            title: cleanText(title),
            abstract: cleanText(description),
            authors: [],
            published: paperDate.toISOString(),
            url: link,
            pdf_url: link + '.pdf',
            source: 'biorxiv',
            topics: ['genomics', 'bio-computing'],
            categories: [subject],
            primaryCategory: subject
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

// Twitter fetching functions removed - now handled by separate twitter-worker

/**
 * Enrich papers with citation data from Semantic Scholar (optional)
 */
async function enrichWithSemanticScholar(papers, apiKey) {
  const enrichedPapers = [];
  
  for (const paper of papers) {
    try {
      // Search by title
      const searchUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(paper.title)}&fields=title,citationCount,influentialCitationCount,authors,year,venue`;
      
      const response = await fetch(searchUrl, {
        headers: apiKey ? { 'x-api-key': apiKey } : {}
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const match = data.data[0];
          enrichedPapers.push({
            ...paper,
            citationCount: match.citationCount || 0,
            influentialCitationCount: match.influentialCitationCount || 0,
            venue: match.venue || '',
            semanticScholarData: match
          });
          
          // Rate limiting: 100 requests/5 minutes with API key, 1/second without
          await new Promise(resolve => setTimeout(resolve, apiKey ? 100 : 1000));
          continue;
        }
      }
      
      // If no match found, keep original paper
      enrichedPapers.push({
        ...paper,
        citationCount: 0,
        influentialCitationCount: 0
      });
      
    } catch (error) {
      console.error(`Error enriching paper "${paper.title}":`, error);
      enrichedPapers.push({
        ...paper,
        citationCount: 0,
        influentialCitationCount: 0
      });
    }
  }
  
  return enrichedPapers;
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
 * Filter out papers that were shown in the past 24 hours
 */
async function filterRecentlyShown(env, papers) {
  try {
    // Get recently shown papers (stored with 24h expiration)
    const recentlyShownData = await env.PAPERS_KV.get('recently_shown_papers', 'json');

    if (!recentlyShownData || !recentlyShownData.papers) {
      return papers; // No history, show all papers
    }

    const shownUrls = new Set(recentlyShownData.papers.map(p => p.url));
    const shownTitles = new Set(recentlyShownData.papers.map(p => p.title.toLowerCase().slice(0, 50)));

    // Filter out papers we've shown recently
    const filtered = papers.filter(paper => {
      const titleKey = paper.title.toLowerCase().slice(0, 50);
      return !shownUrls.has(paper.url) && !shownTitles.has(titleKey);
    });

    return filtered;
  } catch (error) {
    console.error('Error filtering recently shown papers:', error);
    return papers; // On error, return all papers
  }
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
 * Calculate quality score based on available metadata
 */
function calculateQualityScore(paper) {
  let qualityScore = 0;
  
  // 1. Citation-based quality (if available from Semantic Scholar)
  if (paper.citationCount !== undefined) {
    // Log scale for citations (diminishing returns)
    qualityScore += Math.min(Math.log10(paper.citationCount + 1) * 2, 8);
    
    // Influential citations are worth more
    if (paper.influentialCitationCount !== undefined) {
      qualityScore += Math.min(Math.log10(paper.influentialCitationCount + 1) * 3, 6);
    }
  }
  
  // 2. Author count (collaboration indicator - sweet spot is 3-8 authors)
  const authorCount = paper.authors?.length || 0;
  if (authorCount >= 3 && authorCount <= 8) {
    qualityScore += 3; // Well-collaborated research
  } else if (authorCount > 8 && authorCount <= 15) {
    qualityScore += 2; // Large collaboration
  } else if (authorCount > 1) {
    qualityScore += 1; // At least collaborative
  }
  
  // 3. Abstract quality indicators
  const abstractLength = paper.abstract?.length || 0;
  if (abstractLength > 800 && abstractLength < 3000) {
    qualityScore += 2; // Detailed but not excessive
  } else if (abstractLength > 400) {
    qualityScore += 1;
  }
  
  // 4. High-quality arXiv categories (boost for specific relevant categories)
  const prestigiousCategories = {
    'cs.LG': 2,      // Machine Learning
    'cs.AI': 2,      // Artificial Intelligence
    'cs.CR': 3,      // Cryptography (relevant for genomic privacy work)
    'cs.NE': 3,      // Neural and Evolutionary Computing (HDC, neuromorphic)
    'cs.ET': 3,      // Emerging Technologies (neuromorphic)
    'cs.IT': 3,      // Information Theory
    'q-bio.NC': 3,   // Neurons and Cognition
    'q-bio.QM': 2,   // Quantitative Methods
    'q-bio.MN': 2,   // Molecular Networks
    'stat.ML': 2,    // Machine Learning (stats)
    'cs.DC': 1,      // Distributed Computing
    'math.AT': 2,    // Algebraic Topology (TDA)
    'cond-mat.stat-mech': 3,  // Statistical Mechanics
    'cond-mat.dis-nn': 2,     // Disordered Systems and Neural Networks
    'nlin.CD': 2,    // Chaotic Dynamics
    'nlin.AO': 2,    // Adaptation and Self-Organizing Systems
    'nlin.PS': 2,    // Pattern Formation and Solitons
    'physics.bio-ph': 2,      // Biological Physics
    'physics.comp-ph': 1,     // Computational Physics
    'math.DS': 2,    // Dynamical Systems
    'math.PR': 1,    // Probability
    'math.ST': 1,    // Statistics Theory
    'q-bio.TO': 2,   // Tissues and Organs
    'q-bio.CB': 2    // Cell Behavior
  };
  
  if (paper.primaryCategory && prestigiousCategories[paper.primaryCategory]) {
    qualityScore += prestigiousCategories[paper.primaryCategory];
  }
  
  // 5. Venue prestige (if available from Semantic Scholar)
  const topVenues = [
    // Top-tier general science
    'Nature', 'Science', 'Cell', 'PNAS',
    
    // Neuroscience & Cognitive Science
    'Nature Neuroscience', 'Neuron', 'Neural Computation',
    'Trends in Cognitive Sciences', 'Current Biology',
    
    // Computing & AI conferences
    'NeurIPS', 'ICML', 'ICLR', 'CVPR', 'AAAI', 'AISTATS',
    'COSYNE', 'CCN',
    
    // Journals
    'Nature Communications', 'Nature Methods', 'Nature Physics',
    'PLoS Computational Biology', 'Bioinformatics',
    'Neural Networks', 'IEEE Transactions on Neural Networks',
    'Neuromorphic Computing and Engineering',
    'Cognitive Computation', 'Artificial Life',
    
    // Physics & Information Theory
    'IEEE Transactions on Information Theory',
    'Physical Review E', 'Physical Review Letters',
    'Entropy', 'Science Advances',
    
    // Interdisciplinary
    'Philosophical Transactions of the Royal Society',
    'Complexity', 'Chaos',
    
    // Cryptography
    'CRYPTO', 'EUROCRYPT', 'IEEE S&P'
  ];
  
  if (paper.venue) {
    const venueLower = paper.venue.toLowerCase();
    for (const topVenue of topVenues) {
      if (venueLower.includes(topVenue.toLowerCase())) {
        qualityScore += 5;
        break;
      }
    }
  }
  
  return qualityScore;
}

/**
 * Rank papers by relevance to research interests + quality
 */
function rankPapers(papers) {
  const keywords = {
    // Core HDC/VSA concepts (highest priority)
    'hyperdimensional computing': 5,
    'vector symbolic': 5,
    'HDC': 4,
    'VSA': 4,
    'holographic reduced': 4,
    'high-dimensional vector': 4,
    'distributed representation': 3,
    'sparse distributed': 3,
    
    // COEC Framework concepts
    'constraint-oriented': 5,
    'constraint satisfaction': 4,
    'emergent computation': 5,
    'free energy principle': 5,
    'active inference': 5,
    'variational free energy': 4,
    'predictive processing': 4,
    'predictive coding': 4,
    'bayesian brain': 4,
    'entropy minimization': 3,
    'information bottleneck': 4,
    'self-organization': 3,
    
    // Privacy and cryptography
    'genomic privacy': 5,
    'zero knowledge': 4,
    'ZK-SNARK': 4,
    'ZK-STARK': 4,
    'homomorphic encryption': 4,
    'private information retrieval': 5,
    'PIR': 3,
    'differential privacy': 3,
    'secure multi-party': 3,
    'federated learning': 3,
    'cryptographic protocol': 3,
    
    // Biological computing
    'molecular computing': 5,
    'DNA computing': 4,
    'protein folding': 4,
    'strand displacement': 4,
    'synthetic biology': 4,
    'cellular computation': 4,
    'molecular dynamics': 3,
    'reaction-diffusion': 3,
    'biochemical network': 3,
    'gene regulatory': 3,
    'iPSC': 3,
    'stem cell differentiation': 3,
    
    // Neuromorphic and brain-inspired
    'neuromorphic': 5,
    'spiking neural': 4,
    'memristor': 4,
    'analog computing': 3,
    'in-memory computing': 3,
    'brain-inspired': 4,
    'neuromorphic engineering': 4,
    
    // Topological and geometric methods
    'topological data analysis': 5,
    'persistent homology': 5,
    'TDA': 3,
    'mapper algorithm': 4,
    'sheaf cohomology': 4,
    'simplicial complex': 3,
    'morse theory': 3,
    
    // Information theory
    'mutual information': 3,
    'information geometry': 3,
    'rate distortion': 3,
    'channel capacity': 2,
    'minimum description length': 3,
    'kolmogorov complexity': 3,
    
    // Complex Systems & Criticality
    'self-organized criticality': 5,
    'critical phase transition': 4,
    'criticality': 3,
    'avalanche dynamics': 4,
    'power law': 3,
    'scale-free network': 3,
    'complex systems': 3,
    'emergence': 4,
    
    // Statistical Mechanics
    'statistical mechanics': 3,
    'ising model': 3,
    'mean field theory': 3,
    'replica theory': 3,
    'spin glass': 3,
    'partition function': 2,
    
    // Sparse Coding
    'sparse coding': 4,
    'dictionary learning': 3,
    'efficient coding': 4,
    'compressed sensing': 3,
    'sparse representation': 3,
    
    // Neural Computation Theory
    'neural computation': 4,
    'computational neuroscience': 3,
    'population coding': 3,
    'neural manifold': 4,
    'attractor network': 4,
    'reservoir computing': 3,
    
    // Nonlinear Dynamics
    'nonlinear dynamics': 3,
    'chaos theory': 3,
    'synchronization': 3,
    'bifurcation': 3,
    'dynamical systems': 3,
    'lyapunov exponent': 2,
    
    // Machine Learning Theory
    'representation learning': 3,
    'neural tangent kernel': 4,
    'implicit bias': 3,
    'double descent': 3,
    'lottery ticket': 3,
    'feature learning': 2,
    
    // Artificial Life
    'artificial life': 4,
    'autopoiesis': 4,
    'morphogenesis': 4,
    'evolutionary computation': 3,
    'open-ended evolution': 4,
    
    // Consciousness & IIT
    'integrated information theory': 5,
    'IIT': 3,
    'phi measure': 4,
    'neural correlates consciousness': 4,
    'global workspace': 4,
    'qualia': 3,
    
    // AI safety and verification
    'behavioral fingerprinting': 4,
    'model verification': 3,
    'proof of training': 4,
    'neural network watermarking': 3,
    'adversarial robustness': 2,
    
    // Genomics and bioinformatics (lower priority, too broad)
    'GWAS': 2,
    'variant calling': 2,
    'whole genome': 2,
    'bioinformatics': 1,
    'computational biology': 1,
    
    // Systems and distributed computing
    'distributed computing': 2,
    'parallel algorithm': 2,
    'consensus protocol': 2
  };

  return papers.map(paper => {
    let score = 0;
    const text = (paper.title + ' ' + paper.abstract).toLowerCase();

    // 1. Keyword relevance scoring (primary factor)
    for (const [keyword, weight] of Object.entries(keywords)) {
      if (text.includes(keyword.toLowerCase())) {
        score += weight;
      }
    }

    // 2. Quality scoring (citations, authors, venue, etc.)
    const qualityScore = calculateQualityScore(paper);
    score += qualityScore;

    return { ...paper, score, qualityScore };
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

/**
 * Handle GET /api/archive requests
 */
async function handleGetArchive(request, env, corsHeaders) {
  const url = new URL(request.url);
  const tag = url.searchParams.get('tag');
  const limit = parseInt(url.searchParams.get('limit') || '100');

  try {
    const archive = await env.PAPERS_KV.get('papers_archive', 'json');

    if (!archive) {
      return new Response(JSON.stringify({
        papers: [],
        total: 0,
        message: 'Archive is empty'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let papers = archive.papers;

    // Filter by tag if specified
    if (tag) {
      papers = papers.filter(p =>
        p.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
    }

    return new Response(JSON.stringify({
      papers: papers.slice(0, limit),
      total: archive.total_count,
      filtered: papers.length,
      updated: archive.updated
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

/**
 * Handle GET /api/archive/stats requests
 */
async function handleGetArchiveStats(request, env, corsHeaders) {
  try {
    const stats = await getArchiveStats(env);

    if (!stats) {
      return new Response(JSON.stringify({
        message: 'No archive data available'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(stats), {
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
