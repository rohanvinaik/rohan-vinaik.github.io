# Paper Discovery Worker - Deployment Instructions

## ✅ What's Ready

All files are created and configured:
- ✅ `wrangler.toml` - Worker configuration with KV namespace
- ✅ `src/worker.js` - Complete worker logic
- ✅ `package.json` - Dependencies installed
- ✅ Website integration - HTML section and JavaScript ready

## 🚀 Deployment Steps (3 Steps!)

### Step 1: Authenticate with Cloudflare

```bash
npx wrangler login
```

This will open your browser to authenticate. Once done, close the browser and return to terminal.

### Step 2: Deploy the Worker

```bash
npx wrangler deploy
```

You'll see output like:
```
✨ Success! Uploaded worker 'paper-discovery-worker'
  https://paper-discovery-worker.XXXXXX.workers.dev
```

**📋 COPY THIS URL!** You'll need it in the next step.

### Step 3: Update Website Configuration

Edit `/Users/rohanvinaik/rohan-vinaik.github.io/paper-feed.js`

Replace lines 9-10 with your actual worker URL:

```javascript
// OLD:
this.apiEndpoint = 'https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev/api/papers';
this.refreshEndpoint = 'https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev/api/refresh';

// NEW (use your actual URL from Step 2):
this.apiEndpoint = 'https://paper-discovery-worker.XXXXXX.workers.dev/api/papers';
this.refreshEndpoint = 'https://paper-discovery-worker.XXXXXX.workers.dev/api/refresh';
```

## 🧪 Testing

### Test 1: Trigger Initial Paper Fetch

```bash
curl -X POST https://paper-discovery-worker.XXXXXX.workers.dev/api/refresh
```

You should see:
```json
{"status":"refreshing","timestamp":"2025-10-23T..."}
```

### Test 2: Wait 15 seconds, then fetch papers

```bash
curl https://paper-discovery-worker.XXXXXX.workers.dev/api/papers?count=3
```

You should see JSON with paper data.

### Test 3: Open Website Locally

```bash
open /Users/rohanvinaik/rohan-vinaik.github.io/index.html
```

Navigate to "paper_feed" section - papers should load!

## 📝 After Testing

Commit and push to GitHub:

```bash
cd /Users/rohanvinaik/rohan-vinaik.github.io
git add .
git commit -m "Add automated paper discovery system with Cloudflare Worker"
git push origin main
```

Visit https://rohanvinaik.github.io/ and test the live site!

## 🔍 Monitoring

### View Real-Time Logs

```bash
npx wrangler tail
```

### Check Stored Papers

```bash
npx wrangler kv:key get --binding=PAPERS_KV latest_papers
```

### Force Refresh Papers

```bash
curl -X POST https://paper-discovery-worker.XXXXXX.workers.dev/api/refresh
```

## 🎯 How It Works

**Daily Automation:**
- Worker runs every day at 9 AM UTC
- Fetches papers from arXiv and bioRxiv
- Ranks by relevance to your research keywords
- Stores top 30 papers in Cloudflare KV

**Website Integration:**
- JavaScript fetches papers from Worker API
- Filters by topic (HDC, genomics, AI security, etc.)
- Shows relevance scores
- Manual refresh button for immediate updates

**No Cost:**
- Cloudflare Workers free tier: 100,000 requests/day
- KV storage free tier: 1 GB storage, 100,000 reads/day
- This system uses ~100 reads/day, well within limits

## 🛠️ Customization

### Add Research Topics

Edit `src/worker.js` lines 48-58:

```javascript
const topics = [
  { query: 'your new topic', category: 'theory' },
  // ... existing topics
];
```

### Adjust Keyword Weights

Edit `src/worker.js` lines 231-254:

```javascript
const keywords = {
  'important term': 5,  // Higher number = more important
  'relevant term': 3,
  // ...
};
```

After changes, redeploy:

```bash
npx wrangler deploy
```

## 🐛 Troubleshooting

**Problem:** "No papers available yet"
- **Solution:** Run `curl -X POST https://YOUR-WORKER.workers.dev/api/refresh`

**Problem:** CORS errors in browser
- **Solution:** Check ALLOWED_ORIGIN in wrangler.toml matches your domain

**Problem:** Papers not updating daily
- **Solution:** Check cron trigger in wrangler.toml is set to `["0 9 * * *"]`

## 📚 Commands Reference

```bash
# Deploy changes
npx wrangler deploy

# View logs
npx wrangler tail

# Check KV storage
npx wrangler kv:key list --binding=PAPERS_KV
npx wrangler kv:key get --binding=PAPERS_KV latest_papers

# Delete stored papers (force fresh fetch)
npx wrangler kv:key delete --binding=PAPERS_KV latest_papers

# Test locally
npx wrangler dev
```

## 📖 API Endpoints

**GET /api/papers**
- Query params: `filter` (all|hdc|genomics|ai-security|tda|theory|bio-computing), `count` (number)
- Example: `/api/papers?filter=hdc&count=5`

**POST /api/refresh**
- Triggers immediate paper fetch
- Returns: `{"status":"refreshing","timestamp":"..."}`

---

**Ready to deploy?** Run `npx wrangler login` to start!
