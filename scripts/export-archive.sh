#!/bin/bash

# Export Paper Archive from Cloudflare Worker
# This script downloads the archive from the worker and creates JSON and Markdown files

WORKER_URL="https://paper-discovery-worker.rohan-vinaik.workers.dev"
REPO_ROOT="/Users/rohanvinaik/rohan-vinaik.github.io"

echo "==================================="
echo "Exporting Paper Archive"
echo "==================================="
echo ""

# Download archive JSON
echo "Downloading archive from worker..."
curl -s "${WORKER_URL}/api/archive" > /tmp/papers_archive.json

if [ $? -eq 0 ]; then
    echo "✓ Archive downloaded"
else
    echo "✗ Failed to download archive"
    exit 1
fi

# Get stats
echo ""
echo "Archive Statistics:"
curl -s "${WORKER_URL}/api/archive/stats" | python3 -m json.tool 2>/dev/null || echo "Stats unavailable"
echo ""

# Convert to markdown
echo "Converting to markdown..."
python3 << 'PYTHON_SCRIPT'
import json
from datetime import datetime
from collections import defaultdict

# Load archive
with open('/tmp/papers_archive.json', 'r') as f:
    data = json.load(f)

papers = data['papers']

# Create markdown
md = f"""# Paper Archive

**Total Papers:** {data['total']}
**Last Updated:** {data['updated']}

This archive contains all research papers discovered by the automated paper feed system, organized by tags for easy reference and future reading.

## Quick Navigation

- [By Tag](#papers-by-tag)
- [All Papers (Chronological)](#all-papers-chronological)

---

## Papers by Tag

"""

# Group by tags
by_tag = defaultdict(list)
for paper in papers:
    for tag in paper['tags']:
        by_tag[tag].append(paper)

# Sort tags alphabetically
for tag in sorted(by_tag.keys()):
    md += f"### {tag.upper()} ({len(by_tag[tag])} papers)\n\n"

    for paper in sorted(by_tag[tag], key=lambda x: x['last_seen'], reverse=True):
        md += f"**{paper['title']}**  \n"
        md += f"*Authors:* {', '.join(paper['authors'][:3])}"
        if len(paper['authors']) > 3:
            md += f" et al."
        md += f"  \n"

        if paper.get('arxiv_id'):
            md += f"*arXiv:* [{paper['arxiv_id']}](https://arxiv.org/abs/{paper['arxiv_id']}) "
        elif paper.get('doi'):
            md += f"*DOI:* [{paper['doi']}](https://doi.org/{paper['doi']}) "

        md += f"| [PDF]({paper['pdf_url']})  \n"
        md += f"*Published:* {paper['published'][:10]} | *Score:* {paper.get('relevance_score', 'N/A')}  \n\n"

# Save markdown
with open('/tmp/papers_archive.md', 'w') as f:
    f.write(md)

print("✓ Markdown created")
PYTHON_SCRIPT

# Copy to repository
cp /tmp/papers_archive.json "${REPO_ROOT}/papers-archive.json"
cp /tmp/papers_archive.md "${REPO_ROOT}/PAPERS-ARCHIVE.md"

echo "✓ Files copied to repository"
echo ""
echo "Files created:"
echo "  - papers-archive.json (machine-readable)"
echo "  - PAPERS-ARCHIVE.md (human-readable)"
echo ""
echo "To commit changes:"
echo "  cd ${REPO_ROOT}"
echo "  git add papers-archive.json PAPERS-ARCHIVE.md"
echo "  git commit -m 'Update paper archive'"
echo "  git push"
