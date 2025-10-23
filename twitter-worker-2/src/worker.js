/**
 * Twitter Paper Discovery Worker 2
 * Fetches papers from additional Twitter accounts + Substack feeds
 * Runs separately to distribute subrequest load
 */

import { addToArchive } from '../../paper-worker/src/archive.js';

export default {
  // Scheduled cron job - runs weekly on Thursdays at 10:00 AM UTC
  async scheduled(event, env, ctx) {
    console.log('Twitter worker 2 cron trigger: fetching papers from Twitter + Substack...');
    ctx.waitUntil(fetchTwitterAndSubstackPapers(env));
  },

  // HTTP requests for manual refresh
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

    // Manual refresh endpoint
    if (url.pathname === '/api/refresh') {
      try {
        const count = await fetchTwitterAndSubstackPapers(env);
        return new Response(JSON.stringify({
          status: 'success',
          timestamp: new Date().toISOString(),
          papersStored: count
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Error in Twitter/Substack refresh:', error);
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

    return new Response('Twitter Paper Worker 2', { status: 200, headers: corsHeaders });
  }
};

/**
 * Main fetching logic for Twitter + Substack
 */
async function fetchTwitterAndSubstackPapers(env) {
  console.log('Starting Twitter + Substack paper fetch...');

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  let allPapers = [];

  // Twitter API disabled - free tier only allows 50 user lookups/month
  // This isn't enough for 40+ accounts we're monitoring
  // Using RSS feeds instead (newsletters, blogs, labs) - no API limits
  if (env.TWITTER_BEARER_TOKEN && false) {  // Disabled - free tier too limited
    try {
      const twitterPapers = await fetchFromTwitterAccounts(env.TWITTER_BEARER_TOKEN, threeMonthsAgo);
      console.log(`Fetched ${twitterPapers.length} papers from Twitter`);
      allPapers.push(...twitterPapers);
    } catch (error) {
      console.error('Error fetching from Twitter:', error);
    }
  } else {
    console.log('Twitter API disabled (free tier limits) - using RSS/newsletters only');
  }

  // Fetch from Substack & Newsletter RSS
  try {
    const newsletterPapers = await fetchFromNewsletters(threeMonthsAgo);
    console.log(`Fetched ${newsletterPapers.length} papers from newsletters`);
    allPapers.push(...newsletterPapers);
  } catch (error) {
    console.error('Error fetching from newsletters:', error);
  }

  // Fetch from research lab blogs
  try {
    const labPapers = await fetchFromResearchLabs(threeMonthsAgo);
    console.log(`Fetched ${labPapers.length} papers from research labs`);
    allPapers.push(...labPapers);
  } catch (error) {
    console.error('Error fetching from research labs:', error);
  }

  if (allPapers.length === 0) {
    console.log('No papers found from Twitter or Substack');
    return 0;
  }

  // Deduplicate
  const uniquePapers = deduplicatePapers(allPapers);
  console.log(`After deduplication: ${uniquePapers.length}`);

  // Filter out recently shown papers
  const filteredPapers = await filterRecentlyShown(env, uniquePapers);
  console.log(`After filtering recently shown: ${filteredPapers.length}`);

  // Enrich with Semantic Scholar (if available)
  let enrichedPapers = filteredPapers;
  if (env.SEMANTIC_SCHOLAR_API_KEY) {
    try {
      enrichedPapers = await enrichWithSemanticScholar(filteredPapers, env.SEMANTIC_SCHOLAR_API_KEY);
      console.log('Papers enriched with citation data');
    } catch (error) {
      console.error('Failed to enrich with Semantic Scholar:', error);
    }
  }

  // Rank papers
  const rankedPapers = rankPapers(enrichedPapers);
  console.log(`Ranked ${rankedPapers.length} papers`);

  // Add to archive
  try {
    const archiveResult = await addToArchive(env, rankedPapers);
    console.log(`Archive: ${archiveResult.added} new papers, ${archiveResult.total} total`);
  } catch (error) {
    console.error('Failed to update archive:', error);
  }

  // Merge with existing papers in KV
  try {
    const existing = await env.PAPERS_KV.get('latest_papers', 'json');
    let allCombinedPapers = rankedPapers;

    if (existing && existing.papers) {
      allCombinedPapers = [...rankedPapers, ...existing.papers];
      allCombinedPapers = deduplicatePapers(allCombinedPapers);
      allCombinedPapers = rankPapers(allCombinedPapers);
      console.log(`Combined with existing: ${allCombinedPapers.length} total papers`);
    }

    // Store top 30
    const topPapers = allCombinedPapers.slice(0, 30);
    await env.PAPERS_KV.put('latest_papers', JSON.stringify({
      papers: topPapers,
      updated: new Date().toISOString(),
      count: allCombinedPapers.length
    }), {
      expirationTtl: 86400 * 7
    });

    // Update recently shown papers
    const recentlyShown = await env.PAPERS_KV.get('recently_shown_papers', 'json');
    const newShownPapers = [...topPapers.map(p => ({ url: p.url, title: p.title }))];

    if (recentlyShown && recentlyShown.papers) {
      newShownPapers.push(...recentlyShown.papers);
    }

    await env.PAPERS_KV.put('recently_shown_papers', JSON.stringify({
      papers: newShownPapers.slice(0, 100),
      updated: new Date().toISOString()
    }), {
      expirationTtl: 86400
    });

    console.log(`Stored ${topPapers.length} papers in KV`);
    return rankedPapers.length;
  } catch (error) {
    console.error('Error storing papers:', error);
    throw error;
  }
}

/**
 * Fetch articles from AI/ML newsletters, blogs, and academic sources
 */
async function fetchFromNewsletters(dateAfter = null) {
  const newsletterFeeds = [
    // AI Safety & Alignment newsletters
    'https://aisafetyfrontier.substack.com/feed',
    'https://import.ai/feed',  // Import AI by Jack Clark
    'https://jack-clark.net/feed/',  // Jack Clark

    // ML Research newsletters & blogs
    'https://thegradient.pub/rss/',  // The Gradient
    'https://newsletter.sebastianraschka.com/feed',  // Sebastian Raschka
    'https://ruder.io/rss/index.rss',  // Sebastian Ruder - NLP
    'https://lilianweng.github.io/feed.xml',  // Lil'Log - OpenAI
    'https://karpathy.github.io/feed.xml',  // Andrej Karpathy

    // Technical ML blogs
    'https://ai.googleblog.com/feeds/posts/default',  // Google AI Blog
    'https://www.microsoft.com/en-us/research/feed/',  // Microsoft Research
    'https://blog.research.google/feeds/posts/default',  // Google Research
    'https://aws.amazon.com/blogs/machine-learning/feed/',  // AWS ML Blog
    'https://machinelearningmastery.com/feed/',  // ML Mastery

    // Academic aggregators
    'https://www.fast.ai/posts/index.xml',  // Fast.ai
    'https://mlcontests.com/rss/',  // ML Contests (competitions/challenges)

    // Geometric Deep Learning blog
    'https://towardsdatascience.com/tagged/geometric-deep-learning/feed',  // GDL articles on TDS
  ];

  const allPapers = [];

  for (const feedUrl of newsletterFeeds) {
    try {
      const response = await fetch(feedUrl);
      const xmlText = await response.text();

      // Parse RSS items
      const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];

      for (const item of items) {
        const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
                     item.match(/<title>(.*?)<\/title>/)?.[1] || '';
        const description = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] ||
                          item.match(/<description>(.*?)<\/description>/)?.[1] || '';
        const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '';
        const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';

        // Parse publication date
        const paperDate = pubDate ? new Date(pubDate) : new Date();

        // Filter by date if specified
        if (dateAfter && paperDate < dateAfter) {
          continue;
        }

        // Extract paper links from description/content
        const paperLinks = extractPaperLinksFromText(description);

        if (paperLinks.length > 0) {
          // Fetch metadata for each paper link
          for (const paperUrl of paperLinks) {
            try {
              const paper = await fetchPaperFromUrl(paperUrl);
              if (paper) {
                paper.source = 'substack';
                paper.substackPost = link;
                paper.substackTitle = cleanText(title);
                allPapers.push(paper);
              }
            } catch (error) {
              console.error(`Error fetching paper from ${paperUrl}:`, error);
            }
          }
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error fetching Substack feed ${feedUrl}:`, error);
    }
  }

  return allPapers;
}

/**
 * Extract paper URLs from text content
 */
function extractPaperLinksFromText(text) {
  const urls = [];
  const paperPatterns = [
    /https?:\/\/arxiv\.org\/abs\/[\d.]+/gi,
    /https?:\/\/arxiv\.org\/pdf\/[\d.]+/gi,
    /https?:\/\/biorxiv\.org\/content\/[\w.\/]+/gi,
    /https?:\/\/doi\.org\/[\w.\/()-]+/gi,
    /https?:\/\/semanticscholar\.org\/paper\/[\w-]+/gi,
  ];

  for (const pattern of paperPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      urls.push(match[0]);
    }
  }

  return [...new Set(urls)];
}

/**
 * Fetch papers from Twitter/X accounts
 */
async function fetchFromTwitterAccounts(bearerToken, dateAfter = null) {
  // New curated accounts focusing on ML/Bio/Geometric ML/Quantum/AI Safety
  const twitterAccounts = [
    // Publishing & Research Aggregators
    'asimovpress',
    'softmaxresearch',
    'biologyaidaily',
    'quantamagazine',
    'AK_ML',

    // Geometric Deep Learning & Molecular ML
    'brianltrippe',
    'gasteigerjo',
    'gabricorso',
    'hannesstaerk',
    'petarv_93',
    'mweber_pu',
    'ninamiolane',
    'geometric_intel',
    'mmbronstein',
    'joanbruna',
    '_xbresson',

    // Molecular/DNA Computing & Synthetic Biology
    'erikwinfree',
    'GeorgChurch',

    // AI Safety & Interpretability
    'jesse_hoogland',
    'timaeusresearch',
    'leafs_s',
    'zittrain',
    'anthropicai',
    'CollinBurns19',
    'neelnanda_io',
    'AnnaMTurner',

    // Quantum & Advanced Computing
    'googlequantumai',
    'thinkymachines',
    'IBM_Quantum',
    'AWSQuantum',
    'rigetti',

    // Research Labs & Institutions
    'arcinstitute',
    'mit_csail',
    'GoogleAI',
    'DeepMind',
    'OpenAI',

    // ML Research & Papers
    'fatihdin4en',
    '_akhaliq',
    'rasbt',
  ];

  const allPapers = [];
  const paperUrls = new Set();

  for (const username of twitterAccounts) {
    try {
      // Get user ID
      const userResponse = await fetch(
        `https://api.twitter.com/2/users/by/username/${username}`,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`
          }
        }
      );

      if (!userResponse.ok) {
        console.log(`Failed to fetch user ${username}: ${userResponse.status}`);
        continue;
      }

      const userData = await userResponse.json();
      if (!userData.data || !userData.data.id) {
        continue;
      }

      const userId = userData.data.id;
      const startTime = dateAfter ? dateAfter.toISOString() : null;

      // Fetch recent tweets (max_results=10 to stay under API quota)
      let tweetsUrl = `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=created_at,entities`;
      if (startTime) {
        tweetsUrl += `&start_time=${startTime}`;
      }

      const tweetsResponse = await fetch(tweetsUrl, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });

      if (!tweetsResponse.ok) {
        console.log(`Failed to fetch tweets for ${username}: ${tweetsResponse.status}`);
        if (tweetsResponse.status === 429) {
          console.log('Rate limited, waiting...');
          await new Promise(resolve => setTimeout(resolve, 60000));
        }
        continue;
      }

      const tweetsData = await tweetsResponse.json();
      if (!tweetsData.data) {
        continue;
      }

      // Extract paper links
      for (const tweet of tweetsData.data) {
        const urls = extractPaperUrls(tweet.text, tweet.entities);

        for (const url of urls) {
          if (paperUrls.has(url)) continue;
          paperUrls.add(url);

          try {
            const paper = await fetchPaperFromUrl(url);
            if (paper) {
              paper.source = 'twitter';
              paper.sharedBy = username;
              allPapers.push(paper);
            }
          } catch (error) {
            console.error(`Error fetching paper from ${url}:`, error);
          }
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`Error processing Twitter account ${username}:`, error);
    }
  }

  return allPapers;
}

/**
 * Extract paper URLs from tweet text and entities
 */
function extractPaperUrls(text, entities) {
  const urls = [];
  const paperPatterns = [
    /arxiv\.org\/abs\/[\d.]+/i,
    /arxiv\.org\/pdf\/[\d.]+/i,
    /biorxiv\.org\/content\/[\w.\/]+/i,
    /doi\.org\/[\w.\/()-]+/i,
    /semanticscholar\.org\/paper\//i,
  ];

  for (const pattern of paperPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      urls.push(matches[0]);
    }
  }

  if (entities && entities.urls) {
    for (const urlEntity of entities.urls) {
      const expandedUrl = urlEntity.expanded_url || urlEntity.url;
      for (const pattern of paperPatterns) {
        if (pattern.test(expandedUrl)) {
          urls.push(expandedUrl);
        }
      }
    }
  }

  return [...new Set(urls)];
}

/**
 * Fetch paper metadata from a URL
 */
async function fetchPaperFromUrl(url) {
  // Handle arXiv URLs
  if (url.includes('arxiv.org')) {
    const arxivId = url.match(/([\d.]+)(?:v\d+)?$/)?.[1];
    if (!arxivId) return null;

    const apiUrl = `https://export.arxiv.org/api/query?id_list=${arxivId}`;
    const response = await fetch(apiUrl);
    const xmlText = await response.text();

    const entry = xmlText.match(/<entry>([\s\S]*?)<\/entry>/)?.[1];
    if (!entry) return null;

    const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() || '';
    const summary = entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.trim() || '';
    const published = entry.match(/<published>(.*?)<\/published>/)?.[1] || '';
    const id = entry.match(/<id>(.*?)<\/id>/)?.[1] || '';
    const authors = [...entry.matchAll(/<author>[\s\S]*?<name>(.*?)<\/name>/g)].map(m => m[1].trim());
    const categories = [...entry.matchAll(/<category\s+term="([^"]+)"/g)].map(m => m[1]);

    return {
      title: cleanText(title),
      abstract: cleanText(summary),
      authors,
      published,
      url: id,
      pdf_url: id.replace('abs', 'pdf'),
      categories,
      primaryCategory: categories[0] || '',
      topics: ['shared']
    };
  }

  // Handle bioRxiv URLs
  if (url.includes('biorxiv.org')) {
    return {
      title: 'Paper from bioRxiv',
      abstract: '',
      authors: [],
      published: new Date().toISOString(),
      url: url,
      pdf_url: url + '.pdf',
      categories: ['biorxiv'],
      primaryCategory: 'biorxiv',
      topics: ['bio-computing']
    };
  }

  return null;
}

/**
 * Enrich papers with Semantic Scholar
 */
async function enrichWithSemanticScholar(papers, apiKey) {
  const enrichedPapers = [];

  for (const paper of papers) {
    try {
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

          await new Promise(resolve => setTimeout(resolve, apiKey ? 100 : 1000));
          continue;
        }
      }

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
 * Clean text
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
 * Filter recently shown papers
 */
async function filterRecentlyShown(env, papers) {
  try {
    const recentlyShownData = await env.PAPERS_KV.get('recently_shown_papers', 'json');

    if (!recentlyShownData || !recentlyShownData.papers) {
      return papers;
    }

    const shownUrls = new Set(recentlyShownData.papers.map(p => p.url));
    const shownTitles = new Set(recentlyShownData.papers.map(p => p.title.toLowerCase().slice(0, 50)));

    const filtered = papers.filter(paper => {
      const titleKey = paper.title.toLowerCase().slice(0, 50);
      return !shownUrls.has(paper.url) && !shownTitles.has(titleKey);
    });

    return filtered;
  } catch (error) {
    console.error('Error filtering recently shown papers:', error);
    return papers;
  }
}

/**
 * Deduplicate papers
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
 * Calculate quality score
 */
function calculateQualityScore(paper) {
  let qualityScore = 0;

  if (paper.citationCount !== undefined) {
    qualityScore += Math.min(Math.log10(paper.citationCount + 1) * 2, 8);
    if (paper.influentialCitationCount !== undefined) {
      qualityScore += Math.min(Math.log10(paper.influentialCitationCount + 1) * 3, 6);
    }
  }

  const authorCount = paper.authors?.length || 0;
  if (authorCount >= 3 && authorCount <= 8) {
    qualityScore += 3;
  } else if (authorCount > 8 && authorCount <= 15) {
    qualityScore += 2;
  } else if (authorCount > 1) {
    qualityScore += 1;
  }

  const abstractLength = paper.abstract?.length || 0;
  if (abstractLength > 800 && abstractLength < 3000) {
    qualityScore += 2;
  } else if (abstractLength > 400) {
    qualityScore += 1;
  }

  // Boost for being shared
  if (paper.source === 'twitter' || paper.source === 'substack') {
    qualityScore += 3;
  }

  return qualityScore;
}

/**
 * Rank papers
 */
function rankPapers(papers) {
  const keywords = {
    'hyperdimensional computing': 5,
    'vector symbolic': 5,
    'HDC': 4,
    'VSA': 4,
    'constraint-oriented': 5,
    'free energy principle': 5,
    'active inference': 5,
    'variational free energy': 4,
    'predictive processing': 4,
    'genomic privacy': 5,
    'zero knowledge': 4,
    'homomorphic encryption': 4,
    'molecular computing': 5,
    'DNA computing': 4,
    'protein folding': 4,
    'geometric deep learning': 5,
    'equivariant': 4,
    'graph neural network': 4,
    'neuromorphic': 5,
    'spiking neural': 4,
    'topological data analysis': 5,
    'persistent homology': 5,
    'self-organized criticality': 5,
    'integrated information theory': 5,
    'quantum computing': 4,
    'quantum algorithm': 4,
    'AI safety': 5,
    'interpretability': 4,
    'mechanistic interpretability': 5,
  };

  return papers.map(paper => {
    let score = 0;
    const text = (paper.title + ' ' + paper.abstract).toLowerCase();

    for (const [keyword, weight] of Object.entries(keywords)) {
      if (text.includes(keyword.toLowerCase())) {
        score += weight;
      }
    }

    const qualityScore = calculateQualityScore(paper);
    score += qualityScore;

    return { ...paper, score, qualityScore };
  }).sort((a, b) => b.score - a.score);
}

/**
 * Fetch articles from research labs, institutes, and organizations
 */
async function fetchFromResearchLabs(dateAfter = null) {
  const labFeeds = [
    // AI Research Labs
    {
      name: 'DeepMind',
      url: 'https://www.deepmind.com/blog/rss.xml',
      topics: ['ml-theory', 'ai-safety']
    },
    {
      name: 'OpenAI',
      url: 'https://openai.com/blog/rss/',
      topics: ['ml-theory', 'ai-safety']
    },
    {
      name: 'Anthropic',
      url: 'https://www.anthropic.com/news/rss.xml',
      topics: ['ai-safety', 'interpretability']
    },
    {
      name: 'Meta AI Research',
      url: 'https://ai.meta.com/blog/rss/',
      topics: ['ml-theory', 'ai-research']
    },

    // Research Institutes
    {
      name: 'Allen Institute',
      url: 'https://alleninstitute.org/feed/',
      topics: ['neuroscience', 'bio-computing']
    },
    {
      name: 'Santa Fe Institute',
      url: 'https://www.santafe.edu/news/feed',
      topics: ['complex-systems', 'emergence']
    },
    {
      name: 'MIT CSAIL',
      url: 'https://www.csail.mit.edu/news/rss.xml',
      topics: ['ai-research', 'ml-theory']
    },
    {
      name: 'Berkeley AI Research',
      url: 'https://bair.berkeley.edu/blog/feed.xml',
      topics: ['ai-research', 'robotics']
    },
    {
      name: 'Stanford HAI',
      url: 'https://hai.stanford.edu/news/rss.xml',
      topics: ['ai-research', 'ai-policy']
    },

    // Specialized Centers
    {
      name: 'Center for Human-Compatible AI',
      url: 'https://humancompatible.ai/news/rss/',
      topics: ['ai-safety', 'ai-alignment']
    },
    {
      name: 'Future of Humanity Institute',
      url: 'https://www.fhi.ox.ac.uk/feed/',
      topics: ['ai-safety', 'existential-risk']
    },

    // Additional Research Centers (alternative to Twitter)
    {
      name: 'Arc Institute',
      url: 'https://arcinstitute.org/news/rss',
      topics: ['bio-computing', 'genomics', 'neuroscience']
    },
    {
      name: 'Quanta Magazine',
      url: 'https://www.quantamagazine.org/feed/',
      topics: ['physics', 'mathematics', 'biology', 'computer-science']
    },
    {
      name: 'Redwood Center Theoretical Neuroscience',
      url: 'https://redwood.berkeley.edu/feed/',
      topics: ['neuroscience', 'sparse-coding', 'neural-theory']
    },
    {
      name: 'Wyss Institute',
      url: 'https://wyss.harvard.edu/feed/',
      topics: ['synthetic-biology', 'bioengineering', 'dna-computing']
    },
  ];

  const allPapers = [];

  for (const lab of labFeeds) {
    try {
      const response = await fetch(lab.url);
      const xmlText = await response.text();

      const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || 
                   xmlText.match(/<entry>([\s\S]*?)<\/entry>/g) || [];

      for (const item of items) {
        const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
                     item.match(/<title>(.*?)<\/title>/)?.[1] || '';
        const description = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] ||
                          item.match(/<description>(.*?)<\/description>/)?.[1] ||
                          item.match(/<summary>(.*?)<\/summary>/)?.[1] || '';
        const link = item.match(/<link>(.*?)<\/link>/)?.[1] ||
                    item.match(/<link[^>]+href="([^"]+)"/)?.[1] || '';
        const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ||
                       item.match(/<published>(.*?)<\/published>/)?.[1] || '';

        const paperDate = pubDate ? new Date(pubDate) : new Date();

        if (dateAfter && paperDate < dateAfter) {
          continue;
        }

        // Extract paper links from description
        const paperLinks = extractPaperLinksFromText(description + ' ' + title);

        if (paperLinks.length > 0) {
          for (const paperUrl of paperLinks) {
            try {
              const paper = await fetchPaperFromUrl(paperUrl);
              if (paper) {
                paper.source = lab.name.toLowerCase().replace(/\s+/g, '-');
                paper.blogPost = link;
                paper.blogTitle = cleanText(title);
                paper.topics = lab.topics;
                allPapers.push(paper);
              }
            } catch (error) {
              console.error(`Error fetching paper from ${paperUrl}:`, error);
            }
          }
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error fetching ${lab.name}:`, error);
    }
  }

  return allPapers;
}
