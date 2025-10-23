# Paper Archive System - Quick Reference

## Overview

The paper archive system automatically records every research paper fetched by the discovery worker, storing them permanently with DOIs/arXiv IDs and subject tags for future reference.

## Archive Locations

1. **Cloudflare KV Storage** (primary, always up-to-date)
   - Automatically updated when papers are fetched
   - Accessible via API

2. **GitHub Repository** (snapshots)
   - `papers-archive.json` - Machine-readable JSON
   - `PAPERS-ARCHIVE.md` - Human-readable markdown
   - Updated manually via export script

## Quick Commands

### View Archive

**Online (GitHub):**
```
https://github.com/rohanvinaik/rohan-vinaik.github.io/blob/main/PAPERS-ARCHIVE.md
```

**API (All Papers):**
```bash
curl "https://paper-discovery-worker.rohan-vinaik.workers.dev/api/archive"
```

**API (By Tag):**
```bash
# HDC papers only
curl "https://paper-discovery-worker.rohan-vinaik.workers.dev/api/archive?tag=hdc"

# Genomics papers only
curl "https://paper-discovery-worker.rohan-vinaik.workers.dev/api/archive?tag=genomics"
```

**API (Statistics):**
```bash
curl "https://paper-discovery-worker.rohan-vinaik.workers.dev/api/archive/stats"
```

### Update Archive Files

```bash
# Run export script
cd /Users/rohanvinaik/rohan-vinaik.github.io
./scripts/export-archive.sh

# Commit to GitHub
git add papers-archive.json PAPERS-ARCHIVE.md
git commit -m "Update paper archive - $(date +%Y-%m-%d)"
git push
```

## Archive Entry Format

Each paper in the archive includes:

```json
{
  "id": "unique_url",
  "doi": "10.1101/xxxxx",           // bioRxiv papers
  "arxiv_id": "2401.xxxxx",         // arXiv papers
  "title": "Paper Title",
  "authors": ["Author 1", "..."],
  "published": "2025-10-23T...",
  "source": "arxiv",
  "tags": ["hdc", "genomics"],
  "url": "http://arxiv.org/abs/...",
  "pdf_url": "http://arxiv.org/pdf/...",
  "abstract_preview": "First 200 chars...",
  "first_seen": "2025-10-23T03:34:08Z",
  "last_seen": "2025-10-23T03:34:08Z",
  "relevance_score": 12
}
```

## Available Tags

Current subject tags used for classification:

- `hdc` - Hyperdimensional Computing
- `genomics` - Genomics & Privacy
- `tda` - Topological Data Analysis
- `theory` - Theoretical Foundations
- `ai-security` - AI Security & Verification
- `bio-computing` - Biological Computing

## How It Works

### Automatic Updates

1. **Daily at 9 AM UTC**: Worker fetches new papers
2. Papers are automatically added to the archive
3. Duplicates are avoided (by URL)
4. Timestamps updated (first_seen, last_seen)

### Automatic Export (Recommended)

**GitHub Action runs daily at 9:30 AM UTC** and automatically:
- Downloads latest archive from worker
- Generates JSON file (papers-archive.json)
- Generates Markdown file (PAPERS-ARCHIVE.md)
- Commits and pushes changes if archive updated

**No manual intervention needed!** Just check GitHub to see the latest archive.

**Manual trigger:** GitHub repo → Actions tab → "Update Paper Archive" → Run workflow

### Manual Export (Optional)

If you want to update immediately without waiting for the scheduled run:

```bash
./scripts/export-archive.sh
git add papers-archive.json PAPERS-ARCHIVE.md
git commit -m "Update paper archive"
git push
```

## Use Cases

### Research Planning
Browse the markdown file to see what papers you've discovered in each topic area.

### Reading List
Use the archive as a permanent reading list with links to PDFs.

### Topic Exploration
Filter by tag to find all papers in a specific area:
```bash
curl "https://paper-discovery-worker.rohan-vinaik.workers.dev/api/archive?tag=genomics" | jq '.papers[].title'
```

### Citation Management
Extract DOIs and arXiv IDs for importing into reference managers.

### Analytics
Track how many papers you've discovered over time:
```bash
curl "https://paper-discovery-worker.rohan-vinaik.workers.dev/api/archive/stats" | jq '.total'
```

## Maintenance

### Check Archive Size
```bash
curl -s "https://paper-discovery-worker.rohan-vinaik.workers.dev/api/archive/stats" | jq '.'
```

### Update Schedule
Recommended: Export and commit archive monthly or when significant papers accumulate.

### Cleanup
The archive automatically deduplicates. No manual cleanup needed.

## API Reference

### GET /api/archive

Get papers from archive.

**Parameters:**
- `tag` (optional) - Filter by subject tag
- `limit` (optional) - Max papers to return (default: 100)

**Example:**
```bash
curl "https://paper-discovery-worker.rohan-vinaik.workers.dev/api/archive?tag=hdc&limit=10"
```

**Response:**
```json
{
  "papers": [...],
  "total": 19,
  "filtered": 6,
  "updated": "2025-10-23T03:34:09.008Z"
}
```

### GET /api/archive/stats

Get archive statistics.

**Example:**
```bash
curl "https://paper-discovery-worker.rohan-vinaik.workers.dev/api/archive/stats"
```

**Response:**
```json
{
  "total": 19,
  "by_source": {
    "arxiv": 19
  },
  "by_tag": {
    "hdc": 6,
    "genomics": 6,
    "tda": 2,
    "theory": 4,
    "ai-security": 1
  },
  "oldest": "2025-10-23T03:34:08.578Z",
  "newest": "2025-10-23T03:34:08.578Z"
}
```

## Troubleshooting

**Archive seems outdated:**
- Run `./scripts/export-archive.sh` to get latest
- Archive updates automatically on each paper fetch

**Missing papers:**
- Check if papers match your search topics
- Verify worker is running: `npx wrangler tail`

**Export script fails:**
- Check worker URL is correct in the script
- Verify you have internet connection
- Ensure python3 is installed

## Related Files

- `paper-worker/src/archive.js` - Archive management module
- `paper-worker/src/worker.js` - Integration with main worker
- `scripts/export-archive.sh` - Export utility
- `papers-archive.json` - JSON export (commit to git)
- `PAPERS-ARCHIVE.md` - Markdown export (commit to git)

---

**Questions?** Check the full deployment guide in `PAPER-DISCOVERY-SETUP.md`
