# Paper Feed Cloudflare Worker

Automated research paper aggregator for rohanvinaik.github.io

## Quick Start

1. **Install Wrangler CLI:**
   ```bash
   npm install -g wrangler
   ```

2. **Login:**
   ```bash
   wrangler login
   ```

3. **Create KV Namespace:**
   ```bash
   wrangler kv:namespace create "PAPERS_KV"
   ```
   Copy the namespace ID and update it in `wrangler.toml`

4. **Deploy:**
   ```bash
   wrangler deploy
   ```

5. **Update Website:**
   - Copy your Worker URL
   - Update `../paper-feed.js` with the Worker endpoint

See [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) for detailed instructions.

## Files

- `worker.js` - Main Worker code with API endpoints and paper fetching logic
- `wrangler.toml` - Cloudflare Worker configuration
- `DEPLOYMENT-GUIDE.md` - Comprehensive deployment and troubleshooting guide
- `README.md` - This file

## API Endpoints

### GET `/api/papers`

Fetch curated papers from KV storage.

**Query Parameters:**
- `filter` (optional) - Topic filter: `all`, `hdc`, `genomics`, `ai-security`, `tda`, `theory`, `bio-computing`
- `count` (optional) - Number of papers to return (default: 5)

**Example:**
```bash
curl "https://YOUR-WORKER.workers.dev/api/papers?filter=hdc&count=10"
```

**Response:**
```json
{
  "papers": [...],
  "updated": "2025-01-15T09:00:00.000Z",
  "total": 25
}
```

### POST `/api/refresh`

Trigger manual paper refresh from APIs.

**Example:**
```bash
curl -X POST https://YOUR-WORKER.workers.dev/api/refresh
```

**Response:**
```json
{
  "status": "refreshed",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## Scheduled Tasks

Worker runs daily at **9 AM UTC** to fetch fresh papers.

Configured in `wrangler.toml`:
```toml
[triggers]
crons = ["0 9 * * *"]
```

## Data Sources

- **arXiv** - Computer science, physics, math papers
- **bioRxiv** - Biology and life sciences preprints

Papers are ranked by:
1. Keyword relevance to research interests
2. Recency (newer = higher score)
3. Source preference

## Monitoring

**View logs:**
```bash
wrangler tail
```

**Check KV contents:**
```bash
wrangler kv:key get --binding=PAPERS_KV "latest_papers"
```

**Analytics:**
Visit https://dash.cloudflare.com/ → Workers & Pages → paper-feed-worker

## Customization

### Add Research Topics

Edit `worker.js` line 50-61:
```javascript
const topics = [
  'your new topic',
  // ...
];
```

### Adjust Keyword Weights

Edit `worker.js` line 199-245:
```javascript
const keywords = [
  { term: 'important keyword', weight: 10 },  // Very important
  { term: 'relevant keyword', weight: 5 },    // Somewhat important
  // ...
];
```

## Troubleshooting

**Papers not loading?**
1. Check Worker URL is correct
2. Verify KV namespace ID in `wrangler.toml`
3. Test endpoint: `curl https://YOUR-WORKER.workers.dev/api/papers`

**Need to reset?**
```bash
wrangler kv:key delete --binding=PAPERS_KV "latest_papers"
curl -X POST https://YOUR-WORKER.workers.dev/api/refresh
```

See [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) for more troubleshooting.

## License

MIT
