# Paper Feed System - Quick Start Guide

## What This Does

Automatically fetches research papers from arXiv and bioRxiv based on your research interests, ranks them by relevance, and displays them in a new "paper_feed" section on your website.

Papers are updated daily and stored in Cloudflare's edge network for fast access.

## Installation (5 Steps)

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Deploy the Cloudflare Worker

```bash
# Login to Cloudflare
wrangler login

# Navigate to worker directory
cd cloudflare-worker

# Create KV namespace
wrangler kv:namespace create "PAPERS_KV"

# Copy the namespace ID and update wrangler.toml
# Replace YOUR_KV_NAMESPACE_ID_HERE with the ID from the command above

# Deploy
wrangler deploy
```

You'll get a URL like: `https://paper-feed-worker.YOUR-SUBDOMAIN.workers.dev`

### 3. Update Your Website

Open `paper-feed.js` and update lines 9-10 with your Worker URL:

```javascript
this.apiEndpoint = 'https://paper-feed-worker.YOUR-SUBDOMAIN.workers.dev/api/papers';
this.refreshEndpoint = 'https://paper-feed-worker.YOUR-SUBDOMAIN.workers.dev/api/refresh';
```

### 4. Test Locally

```bash
# From root directory
open index.html
```

Navigate to "paper_feed" section and verify papers load.

### 5. Deploy to GitHub

```bash
git add .
git commit -m "Add paper feed system"
git push
```

Visit https://rohanvinaik.github.io/ and test the paper feed!

## Usage

- **Filter by Topic:** Use dropdown to show papers in specific areas
- **Refresh:** Click "🔄 REFRESH NOW" to fetch latest papers from APIs
- **Auto-Update:** Worker automatically fetches new papers daily at 9 AM UTC

## Customization

### Change Research Topics

Edit `cloudflare-worker/worker.js` lines 50-61:

```javascript
const topics = [
  'your topic here',
  'another topic',
  // ...
];
```

Then redeploy:
```bash
cd cloudflare-worker
wrangler deploy
```

### Adjust Ranking

Edit keyword weights in `cloudflare-worker/worker.js` lines 199-245:

```javascript
{ term: 'important keyword', weight: 10 },  // Higher = more important
```

## Troubleshooting

**Papers not showing?**

1. Manually trigger refresh:
   ```bash
   curl -X POST https://YOUR-WORKER.workers.dev/api/refresh
   ```

2. Check logs:
   ```bash
   cd cloudflare-worker
   wrangler tail
   ```

3. Test API directly:
   ```bash
   curl https://YOUR-WORKER.workers.dev/api/papers
   ```

## Full Documentation

See `cloudflare-worker/DEPLOYMENT-GUIDE.md` for comprehensive setup, troubleshooting, and advanced configuration.

## Cost

✅ **FREE** - Cloudflare Workers free tier includes:
- 100,000 requests/day
- 1 GB KV storage
- Scheduled tasks

This system uses ~100 reads/day and ~2 writes/day - well within limits.

---

**Questions?** Check the full deployment guide or inspect browser console (F12) for errors.
