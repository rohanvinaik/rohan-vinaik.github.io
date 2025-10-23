/**
 * Paper Archive Manager
 * Tracks all papers ever fetched with DOIs and tags for future reference
 */

/**
 * Add papers to the archive
 * Maintains a historical record of all papers fetched
 */
export async function addToArchive(env, papers) {
  try {
    // Get existing archive
    const existing = await env.PAPERS_KV.get('papers_archive', 'json') || { papers: [], updated: null };

    const archive = existing.papers || [];
    const archiveMap = new Map(archive.map(p => [p.id, p]));

    // Add new papers
    let newCount = 0;
    for (const paper of papers) {
      const archiveEntry = {
        id: paper.url || paper.id, // Use URL as unique ID
        doi: extractDOI(paper),
        arxiv_id: extractArxivId(paper),
        title: paper.title,
        authors: paper.authors,
        published: paper.published,
        source: paper.source,
        tags: paper.topics || [],
        url: paper.url,
        pdf_url: paper.pdf_url,
        abstract_preview: paper.abstract?.slice(0, 200) + '...',
        first_seen: archiveMap.has(paper.url) ? archiveMap.get(paper.url).first_seen : new Date().toISOString(),
        last_seen: new Date().toISOString(),
        relevance_score: paper.score
      };

      archiveMap.set(paper.url, archiveEntry);
      if (!archive.some(p => p.id === paper.url)) {
        newCount++;
      }
    }

    // Convert back to array and sort by last_seen
    const updatedArchive = Array.from(archiveMap.values())
      .sort((a, b) => new Date(b.last_seen) - new Date(a.last_seen));

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

  for (const paper of papers) {
    // Count by source
    sourceCounts[paper.source] = (sourceCounts[paper.source] || 0) + 1;

    // Count by tag
    for (const tag of paper.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }

  return {
    total: papers.length,
    by_source: sourceCounts,
    by_tag: tagCounts,
    oldest: papers[papers.length - 1]?.first_seen,
    newest: papers[0]?.first_seen
  };
}
