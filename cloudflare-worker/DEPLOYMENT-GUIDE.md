# Paper Feed System - Deployment Guide

## Overview

This system automatically fetches research papers from arXiv, bioRxiv, and PubMed, ranks them by relevance to your research interests, and displays them on your website.

**Architecture:**
```
[Cloudflare Worker] ──> [arXiv API / bioRxiv API]
        ↓
[Cloudflare KV Storage] ← stores curated papers
        ↓
[Your Website] ──> fetches from KV via Worker API
```

## Prerequisites

1. **Cloudflare Account** (free tier is sufficient)
   - Sign up at https://dash.cloudflare.com/sign-up

2. **Node.js & npm** installed (for Wrangler CLI)
   - Download from https://nodejs.org/

3. **Wrangler CLI** (Cloudflare's deployment tool)
   ```bash
   npm install -g wrangler
   ```

## Step 1: Set Up Cloudflare Worker

### 1.1 Login to Wrangler

```bash
wrangler login
```

This will open your browser to authenticate with Cloudflare.

### 1.2 Create KV Namespace

```bash
wrangler kv:namespace create "PAPERS_KV"
```

You'll get output like:
```
🌀 Creating namespace with title "paper-feed-worker-PAPERS_KV"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "PAPERS_KV", id = "abc123def456..." }
```

**Copy the namespace ID** - you'll need it in the next step.

### 1.3 Update wrangler.toml

Open `cloudflare-worker/wrangler.toml` and replace `YOUR_KV_NAMESPACE_ID_HERE` with the ID from step 1.2:

```toml
[[kv_namespaces]]
binding = "PAPERS_KV"
id = "abc123def456..."  # Your actual KV namespace ID
```

### 1.4 Deploy the Worker

From the `cloudflare-worker` directory:

```bash
cd cloudflare-worker
wrangler deploy
```

You'll get output like:
```
✨ Success! Uploaded worker 'paper-feed-worker'
  https://paper-feed-worker.YOUR-SUBDOMAIN.workers.dev
```

**Copy this URL** - this is your Worker endpoint!

## Step 2: Update Your Website Configuration

### 2.1 Update paper-feed.js

Open `/Users/rohanvinaik/rohan-vinaik.github.io/paper-feed.js` and update lines 9-10:

```javascript
// Replace with your actual Worker URL from Step 1.4
this.apiEndpoint = 'https://paper-feed-worker.YOUR-SUBDOMAIN.workers.dev/api/papers';
this.refreshEndpoint = 'https://paper-feed-worker.YOUR-SUBDOMAIN.workers.dev/api/refresh';
```

### 2.2 Test Locally

Open `index.html` in your browser locally:

```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

Navigate to the "paper_feed" section and verify it loads.

## Step 3: Configure Scheduled Fetching

The Worker is configured to run daily at 9 AM UTC. To verify the cron trigger is set:

```bash
wrangler tail
```

Then wait for the next scheduled run, or trigger it manually (see Testing section).

## Step 4: Deploy to GitHub Pages

### 4.1 Commit Changes

```bash
git add index.html paper-feed.js cloudflare-worker/
git commit -m "Add paper feed system with Cloudflare Worker integration"
git push origin main
```

### 4.2 Verify on GitHub Pages

Visit your site: `https://rohanvinaik.github.io/`

Navigate to the paper feed section and test functionality.

## Testing

### Test Manual Refresh

1. Visit your website
2. Navigate to **paper_feed** section
3. Click **🔄 REFRESH NOW** button
4. Verify papers load

### Test API Endpoints Directly

**Get Papers:**
```bash
curl https://paper-feed-worker.YOUR-SUBDOMAIN.workers.dev/api/papers
```

**Trigger Refresh:**
```bash
curl -X POST https://paper-feed-worker.YOUR-SUBDOMAIN.workers.dev/api/refresh
```

**Get Filtered Papers:**
```bash
curl "https://paper-feed-worker.YOUR-SUBDOMAIN.workers.dev/api/papers?filter=hdc&count=3"
```

### View Worker Logs

Monitor real-time logs:
```bash
wrangler tail
```

## Customization

### Update Search Topics

Edit `cloudflare-worker/worker.js` line 50-61 to add/remove topics:

```javascript
const topics = [
  'your custom topic 1',
  'your custom topic 2',
  // ... add more
];
```

### Update Ranking Keywords

Edit `cloudflare-worker/worker.js` line 199-245 to adjust keyword weights:

```javascript
const keywords = [
  { term: 'your keyword', weight: 5 },  // Higher weight = more relevant
  // ... add more
];
```

### Update Filter Categories

To add new filter categories:

1. **Add filter to HTML** (`index.html` line ~1159):
   ```html
   <option value="new-category">New Category Name</option>
   ```

2. **Add filter mapping** (`cloudflare-worker/worker.js` line 398):
   ```javascript
   const filterMap = {
     // ... existing filters
     'new-category': ['keyword1', 'keyword2', 'keyword3']
   };
   ```

3. **Update filter label** (`paper-feed.js` line 308):
   ```javascript
   const labels = {
     // ... existing labels
     'new-category': 'New Category Name'
   };
   ```

## Monitoring & Maintenance

### Check KV Storage Usage

```bash
wrangler kv:key list --binding=PAPERS_KV
```

### View Stored Papers

```bash
wrangler kv:key get --binding=PAPERS_KV "latest_papers"
```

### Update Worker Code

After making changes to `worker.js`:

```bash
cd cloudflare-worker
wrangler deploy
```

Changes take effect immediately (no need to restart).

### Check Worker Analytics

Visit: https://dash.cloudflare.com/

Navigate to: **Workers & Pages** → **paper-feed-worker** → **Analytics**

## Troubleshooting

### Papers Not Loading

**Symptoms:** "Failed to load papers" error

**Solutions:**
1. Check Worker URL is correct in `paper-feed.js`
2. Verify CORS headers are set (already configured in worker)
3. Check browser console for detailed errors (F12 → Console)
4. Test API endpoint directly:
   ```bash
   curl https://YOUR-WORKER.workers.dev/api/papers
   ```

### No Papers in KV Storage

**Symptoms:** "No papers available" message

**Solutions:**
1. Manually trigger refresh:
   ```bash
   curl -X POST https://YOUR-WORKER.workers.dev/api/refresh
   ```
2. Check worker logs:
   ```bash
   wrangler tail
   ```
3. Verify APIs are accessible:
   ```bash
   curl "http://export.arxiv.org/api/query?search_query=all:hyperdimensional&max_results=1"
   ```

### Scheduled Task Not Running

**Symptoms:** Papers never auto-update

**Solutions:**
1. Verify cron trigger in `wrangler.toml`:
   ```toml
   [triggers]
   crons = ["0 9 * * *"]  # Daily at 9 AM UTC
   ```
2. Check Cloudflare dashboard for scheduled runs
3. Manually trigger for testing (see above)

### Rate Limiting from APIs

**Symptoms:** Some papers not fetching

**Solutions:**
1. Reduce number of topics in `worker.js` (line 50-61)
2. Reduce `maxResults` per query (line 66, 73)
3. Add delays between API calls (not currently implemented)

### CORS Errors

**Symptoms:** Browser console shows CORS errors

**Solutions:**
- Worker already includes CORS headers (lines 18-22 in worker.js)
- If issues persist, verify headers are being sent:
  ```bash
  curl -H "Origin: https://rohanvinaik.github.io" \
       -H "Access-Control-Request-Method: GET" \
       -X OPTIONS \
       https://YOUR-WORKER.workers.dev/api/papers -v
  ```

## Cost Estimate (Cloudflare Free Tier)

✅ **Worker Requests:** 100,000/day (more than sufficient)
✅ **KV Reads:** 100,000/day
✅ **KV Writes:** 1,000/day
✅ **KV Storage:** 1 GB

**Expected Usage:**
- ~100 reads/day (website visitors)
- ~2 writes/day (1 scheduled + manual refreshes)
- ~50 KB storage (paper data)

👍 **This system fits comfortably within the free tier.**

## Advanced: Custom Domain

To use a custom domain for your Worker:

1. Add route in `wrangler.toml`:
   ```toml
   routes = [
     { pattern = "api.yourdomain.com/*", zone_name = "yourdomain.com" }
   ]
   ```

2. Update DNS in Cloudflare dashboard:
   - Add CNAME: `api` → `YOUR-WORKER.workers.dev`

3. Update endpoint in `paper-feed.js`:
   ```javascript
   this.apiEndpoint = 'https://api.yourdomain.com/api/papers';
   ```

## Security Considerations

✅ **No API keys exposed** - Worker runs server-side
✅ **CORS configured** - Only necessary origins allowed
✅ **Rate limiting** - Cloudflare provides automatic DDoS protection
✅ **KV TTL** - Papers expire after 7 days to save storage

**Recommended:**
- Monitor Worker analytics for unusual traffic
- Consider adding rate limiting per IP if needed
- Keep Wrangler CLI updated: `npm update -g wrangler`

## Support

- **Cloudflare Workers Docs:** https://developers.cloudflare.com/workers/
- **Wrangler CLI Docs:** https://developers.cloudflare.com/workers/wrangler/
- **arXiv API Docs:** https://arxiv.org/help/api/
- **bioRxiv Info:** https://www.biorxiv.org/

## Next Steps

Once deployed, consider:

1. **Add more sources** - PubMed, Semantic Scholar, etc.
2. **Email notifications** - Send weekly digest of top papers
3. **Personalization** - Track which papers you've read
4. **Export functionality** - Download papers as BibTeX/PDF
5. **Integration with research graph** - Auto-link papers to projects

---

**Questions or issues?** Check the troubleshooting section or inspect browser console (F12) for detailed error messages.
