/**
 * Twitter Paper Discovery Worker
 * Fetches papers from curated Twitter accounts
 * Runs separately to avoid subrequest limits
 */

import { addToArchive } from '../../paper-worker/src/archive.js';

export default {
  // Scheduled cron job - runs weekly on Mondays at 9:30 AM UTC
  async scheduled(event, env, ctx) {
    console.log('Twitter worker cron trigger: fetching papers from Twitter...');
    ctx.waitUntil(fetchTwitterPapers(env));
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
        const count = await fetchTwitterPapers(env);
        return new Response(JSON.stringify({
          status: 'success',
          timestamp: new Date().toISOString(),
          twitterPapersStored: count
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Error in Twitter refresh:', error);
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

    return new Response('Twitter Paper Worker', { status: 200, headers: corsHeaders });
  }
};

/**
 * Main Twitter paper fetching logic
 */
async function fetchTwitterPapers(env) {
  console.log('Starting Twitter paper fetch...');

  if (!env.TWITTER_BEARER_TOKEN) {
    console.error('TWITTER_BEARER_TOKEN not configured');
    return 0;
  }

  // Calculate date 3 months ago for filtering
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  let twitterPapers = [];

  try {
    twitterPapers = await fetchFromTwitterAccounts(env.TWITTER_BEARER_TOKEN, threeMonthsAgo);
    console.log(`Fetched ${twitterPapers.length} papers from Twitter`);
  } catch (error) {
    console.error('Error fetching from Twitter:', error);
    return 0;
  }

  // Fetch from Substack feeds (theory-focused)
  try {
    const substackPapers = await fetchFromSubstack(threeMonthsAgo);
    console.log(`Fetched ${substackPapers.length} papers from Substack`);
    twitterPapers.push(...substackPapers);
  } catch (error) {
    console.error('Error fetching from Substack:', error);
  }

  if (twitterPapers.length === 0) {
    console.log('No Twitter papers found');
    return 0;
  }

  // Deduplicate
  const uniquePapers = deduplicatePapers(twitterPapers);
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
  console.log(`Ranked ${rankedPapers.length} Twitter papers`);

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
    let allPapers = rankedPapers;

    if (existing && existing.papers) {
      // Combine with existing papers
      allPapers = [...rankedPapers, ...existing.papers];

      // Deduplicate combined list
      allPapers = deduplicatePapers(allPapers);

      // Re-rank combined list
      allPapers = rankPapers(allPapers);

      console.log(`Combined with existing: ${allPapers.length} total papers`);
    }

    // Store top 30 in KV
    const topPapers = allPapers.slice(0, 30);
    await env.PAPERS_KV.put('latest_papers', JSON.stringify({
      papers: topPapers,
      updated: new Date().toISOString(),
      count: allPapers.length
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

    console.log(`Stored ${topPapers.length} papers in KV (including ${rankedPapers.length} from Twitter)`);
    return rankedPapers.length;
  } catch (error) {
    console.error('Error storing papers:', error);
    throw error;
  }
}

/**
 * Fetch papers from Twitter/X accounts
 */
async function fetchFromTwitterAccounts(bearerToken, dateAfter = null) {
  // Curated list of Twitter accounts that frequently share relevant papers
  const twitterAccounts = [
    // Free Energy Principle / Active Inference
    'KarlFriston',
    'MagnusKoudahl',
    'BerenMillidge',
    'CasperHesp',
    'ActiveInference',

    // Hyperdimensional Computing & Neuromorphic
    'janrabaey',
    'BrunoOlshausen',
    'frisman_thomas',
    '_tnash',

    // Complex Systems & Santa Fe Institute
    'SFIscience',
    'CT_Bergstrom',
    'PessoaBrain',
    'davidkrakauer',
    'simon_dedeo',

    // Neuroscience Theory
    'KordingLab',
    'neuromusic',
    'SueYeonChung',
    'lucklab',

    // Topological Data Analysis
    'KathrynHess10',
    'appliedtopology',

    // Information Theory & ML Theory
    'ylecun',
    'poolio',
    'GaryMarcus',
    'ben_recht',

    // Statistical Mechanics & Physics
    'sfiscience',
  ];

  const allPapers = [];
  const paperUrls = new Set();

  for (const username of twitterAccounts) {
    try {
      // Get user ID first
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

      // Calculate start time for date filtering
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
        // Rate limit handling
        if (tweetsResponse.status === 429) {
          console.log('Rate limited, waiting...');
          await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute
        }
        continue;
      }

      const tweetsData = await tweetsResponse.json();
      if (!tweetsData.data) {
        continue;
      }

      // Extract paper links from tweets
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

      // Rate limiting
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

  // Check tweet text
  for (const pattern of paperPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      urls.push(matches[0]);
    }
  }

  // Check entities URLs
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
      topics: ['twitter-shared']
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
      topics: ['twitter-shared', 'bio-computing']
    };
  }

  return null;
}

/**
 * Enrich papers with citation data from Semantic Scholar
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
 * Filter out papers that were shown recently
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

  // Boost for being shared on Twitter by relevant researchers
  if (paper.source === 'twitter') {
    qualityScore += 3; // Social signal bonus
  }

  return qualityScore;
}

/**
 * Rank papers by relevance and quality
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
    'predictive coding': 4,
    'genomic privacy': 5,
    'zero knowledge': 4,
    'homomorphic encryption': 4,
    'private information retrieval': 5,
    'molecular computing': 5,
    'DNA computing': 4,
    'neuromorphic': 5,
    'spiking neural': 4,
    'topological data analysis': 5,
    'persistent homology': 5,
    'self-organized criticality': 5,
    'integrated information theory': 5,
    'neural computation': 4,
    'sparse coding': 4,
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
 * Fetch papers from theory-focused Substack feeds
 */
async function fetchFromSubstack(dateAfter = null) {
  const substackFeeds = [
    'https://boundedregret.ghost.io/rss/',  // Ben Recht - ML theory
    'https://www.argmin.net/feed.xml',      // Ben Recht's blog
    'https://moultano.wordpress.com/feed/', // Ryan Moulton - theoretical ML
  ];

  const allPapers = [];

  for (const feedUrl of substackFeeds) {
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
