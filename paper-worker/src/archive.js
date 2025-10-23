/**
 * Paper Archive Manager
 * Tracks all papers ever fetched with DOIs, relevance scores, and tags for future reference
 */

import { getSimplifiedTitle } from './relevance-scorer.js';

/**
 * Add papers to the archive
 * Maintains a historical record of all papers fetched with full relevance metadata
 */
export async function addToArchive(env, papers) {
  try {
    // Get existing archive
    const existing = await env.PAPERS_KV.get('papers_archive', 'json') || { papers: [], updated: null };

    const archive = existing.papers || [];
    const archiveMap = new Map(archive.map(p => [p.id, p]));

    // Add new papers with enhanced metadata
    let newCount = 0;
    for (const paper of papers) {
      const archiveEntry = {
        id: paper.url || paper.id, // Use URL as unique ID
        doi: extractDOI(paper),
        arxiv_id: extractArxivId(paper),
        title: paper.title,
        simplified_title: getSimplifiedTitle(paper.title),
        authors: paper.authors,
        published: paper.published,
        source: paper.source,

        // Relevance metadata
        relevance_score: paper.score || 0,
        base_score: paper.baseScore || 0,
        multiplier: paper.multiplier || 1.0,
        category_count: paper.categoryCount || 0,
        categories: paper.categories || [],
        tags: paper.tags || paper.topics || [],
        is_golden: paper.isGolden || false,
        matched_keywords: paper.matchedKeywords || {},

        // URLs and content
        url: paper.url,
        pdf_url: paper.pdf_url,
        abstract: paper.abstract,
        abstract_preview: paper.abstract?.slice(0, 200) + '...',

        // Tracking
        first_seen: archiveMap.has(paper.url) ? archiveMap.get(paper.url).first_seen : new Date().toISOString(),
        last_seen: new Date().toISOString(),
        times_seen: archiveMap.has(paper.url) ? (archiveMap.get(paper.url).times_seen || 1) + 1 : 1
      };

      archiveMap.set(paper.url, archiveEntry);
      if (!archive.some(p => p.id === paper.url)) {
        newCount++;
      }
    }

    // Convert back to array and sort by relevance_score then last_seen
    const updatedArchive = Array.from(archiveMap.values())
      .sort((a, b) => {
        // Sort by relevance first, then recency
        if (b.relevance_score !== a.relevance_score) {
          return b.relevance_score - a.relevance_score;
        }
        return new Date(b.last_seen) - new Date(a.last_seen);
      });

    // Store in KV
    await env.PAPERS_KV.put('papers_archive', JSON.stringify({
      papers: updatedArchive,
      total_count: updatedArchive.length,
      updated: new Date().toISOString()
    }));

    console.log(`Archive updated: ${newCount} new papers, ${updatedArchive.length} total`);

    return {
      added: newCount,
      total: updatedArchive.length
    };
  } catch (error) {
    console.error('Error updating archive:', error);
    throw error;
  }
}

/**
 * Extract DOI from paper metadata
 */
function extractDOI(paper) {
  // Check if DOI is in the URL or metadata
  if (paper.doi) return paper.doi;

  // arXiv papers don't have DOIs, use arXiv ID
  if (paper.source === 'arxiv') {
    return null; // We'll use arxiv_id instead
  }

  // bioRxiv papers have DOIs in their URLs
  if (paper.source === 'biorxiv' && paper.url) {
    const match = paper.url.match(/10\.\d+\/[\d.]+/);
    if (match) return match[0];
  }

  return null;
}

/**
 * Extract arXiv ID from URL
 */
function extractArxivId(paper) {
  if (paper.source !== 'arxiv') return null;

  // Extract from URL like: http://arxiv.org/abs/2401.12345v1
  const match = paper.url?.match(/arxiv\.org\/abs\/(\d+\.\d+)/);
  return match ? match[1] : null;
}

/**
 * Get papers by tag
 */
export async function getPapersByTag(env, tag) {
  const archive = await env.PAPERS_KV.get('papers_archive', 'json');
  if (!archive) return [];

  return archive.papers.filter(p =>
    p.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Get archive statistics
 */
export async function getArchiveStats(env) {
  const archive = await env.PAPERS_KV.get('papers_archive', 'json');
  if (!archive) return null;

  const papers = archive.papers;
  const tagCounts = {};
  const sourceCounts = {};
  const categoryCounts = {};

  for (const paper of papers) {
    // Count by source
    sourceCounts[paper.source] = (sourceCounts[paper.source] || 0) + 1;

    // Count by tag
    for (const tag of paper.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }

    // Count by category
    for (const category of (paper.categories || [])) {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }
  }

  return {
    total: papers.length,
    golden_count: papers.filter(p => p.is_golden).length,
    by_source: sourceCounts,
    by_tag: tagCounts,
    by_category: categoryCounts,
    oldest: papers[papers.length - 1]?.first_seen,
    newest: papers[0]?.first_seen,
    avg_relevance: papers.reduce((sum, p) => sum + (p.relevance_score || 0), 0) / papers.length
  };
}

/**
 * Search papers in archive
 * Supports searching by title, tags, categories, DOI, and relevance filters
 */
export async function searchArchive(env, query, options = {}) {
  const archive = await env.PAPERS_KV.get('papers_archive', 'json');
  if (!archive) return { papers: [], total: 0 };

  const {
    category = null,
    tag = null,
    minRelevance = null,
    onlyGolden = false,
    limit = 50
  } = options;

  let results = archive.papers;

  // Filter by text query (title, simplified_title, authors, abstract)
  if (query && query.trim()) {
    const queryLower = query.toLowerCase();
    results = results.filter(p =>
      p.title.toLowerCase().includes(queryLower) ||
      p.simplified_title?.toLowerCase().includes(queryLower) ||
      p.authors?.some(a => a.toLowerCase().includes(queryLower)) ||
      p.abstract?.toLowerCase().includes(queryLower) ||
      p.doi?.toLowerCase().includes(queryLower) ||
      p.arxiv_id?.toLowerCase().includes(queryLower)
    );
  }

  // Filter by category
  if (category) {
    results = results.filter(p =>
      p.categories?.includes(category.toUpperCase())
    );
  }

  // Filter by tag
  if (tag) {
    results = results.filter(p =>
      p.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  // Filter by minimum relevance
  if (minRelevance !== null) {
    results = results.filter(p => p.relevance_score >= minRelevance);
  }

  // Filter golden only
  if (onlyGolden) {
    results = results.filter(p => p.is_golden);
  }

  // Group results by category for visual discrimination
  const grouped = {
    golden: [],
    byCategory: {
      BIOLOGY: [],
      PHYSICAL_ARCHITECTURE: [],
      AI_ML: [],
      PRIVACY: [],
      MATH: [],
      OTHER: []
    },
    all: results.slice(0, limit)
  };

  for (const paper of results) {
    if (paper.is_golden) {
      grouped.golden.push(paper);
    }

    if (paper.categories && paper.categories.length > 0) {
      for (const cat of paper.categories) {
        if (grouped.byCategory[cat]) {
          grouped.byCategory[cat].push(paper);
        } else {
          grouped.byCategory.OTHER.push(paper);
          break;
        }
      }
    } else {
      grouped.byCategory.OTHER.push(paper);
    }
  }

  return {
    papers: results.slice(0, limit),
    grouped: grouped,
    total: results.length,
    query: query,
    filters: { category, tag, minRelevance, onlyGolden }
  };
}
