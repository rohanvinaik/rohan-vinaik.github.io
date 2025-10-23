# Twitter/X Paper Scraping Setup Guide

## Overview

Your paper scraper can now fetch papers shared by prominent researchers on Twitter/X! The system monitors tweets from curated accounts and extracts paper links (arXiv, bioRxiv, DOI, etc.).

## Monitored Accounts

The scraper currently monitors these researcher accounts:

### Free Energy Principle / Active Inference
- @KarlFriston - Karl Friston (inventor of FEP)
- @MagnusKoudahl
- @BerenMillidge
- @CasperHesp
- @ActiveInference (community account)

### Hyperdimensional Computing & Neuromorphic
- @janrabaey - Jan Rabaey (neuromorphic systems)
- @BrunoOlshausen - Bruno Olshausen (sparse coding pioneer)

### Complex Systems
- @SFIscience - Santa Fe Institute
- @CT_Bergstrom - Carl Bergstrom (info theory + biology)
- @PessoaBrain - Luiz Pessoa (complexity in neuroscience)

### Neuroscience Theory
- @KordingLab - Konrad Kording (Bayesian brain)
- @neuromusic - Justin Kiggins (comp neuro)

### Information Theory & ML
- @ylecun - Yann LeCun
- @poolio - Ben Poole (deep learning theory)
- @GaryMarcus - Debates compositionality

## Setup Instructions

### Step 1: Get Twitter API Access

1. Go to the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Sign in with your Twitter/X account
3. Apply for a developer account (free tier is sufficient)
4. Create a new Project and App
5. Generate a **Bearer Token** (this is what we need)

### Step 2: Add to Cloudflare Worker

1. Navigate to your Cloudflare Worker dashboard
2. Go to your `paper-worker` settings
3. Add a new environment variable:
   - **Name**: `TWITTER_BEARER_TOKEN`
   - **Value**: Your Bearer Token from Step 1

Or via command line with wrangler:

```bash
cd paper-worker
wrangler secret put TWITTER_BEARER_TOKEN
# Paste your token when prompted
```

### Step 3: Deploy

```bash
cd paper-worker
npm run deploy
```

## How It Works

1. **Daily Scraping**: The worker fetches the last 20 tweets from each monitored account
2. **Link Extraction**: Extracts paper URLs matching these patterns:
   - arxiv.org/abs/...
   - arxiv.org/pdf/...
   - biorxiv.org/content/...
   - doi.org/...
   - semanticscholar.org/paper/...

3. **Metadata Fetching**: For each link, fetches full paper metadata from the source
4. **Integration**: Papers are added to your existing feed, ranked by your quality/relevance scoring
5. **Attribution**: Papers show which researcher shared them (`sharedBy` field)

## Rate Limits

- Twitter Free Tier: 1,500 tweets/month for user timeline
- With ~17 accounts × 20 tweets each = 340 tweets/day
- This should work fine with daily scraping
- The code includes rate limit handling and backoff

## Adding More Accounts

Edit the `twitterAccounts` array in `/paper-worker/src/worker.js`:

```javascript
const twitterAccounts = [
  'KarlFriston',
  'YourNewAccount',  // Add here
  // ... rest of accounts
];
```

## Optional: Increase Tweet Count

By default, we fetch 20 tweets per account. To increase:

```javascript
let tweetsUrl = `https://api.twitter.com/2/users/${userId}/tweets?max_results=100&tweet.fields=created_at,entities`;
```

Maximum is 100 tweets per request with the free tier.

## Testing

Once configured, you can test by:

1. Clicking "Refresh Now" on your website
2. Check the Cloudflare Worker logs:
```bash
wrangler tail
```

3. Look for messages like:
```
Fetched 15 papers from Twitter
```

## Troubleshooting

### "Failed to fetch user"
- Check your Bearer Token is correct
- Ensure the Twitter account exists and username is spelled correctly

### "Rate limited"
- The free tier has limits. The code will wait 1 minute and retry
- Consider fetching less frequently or reducing the number of accounts

### No papers found
- Researchers may not have shared papers recently
- Try increasing `max_results` or adjusting the date filter

## Alternative: RSS Feeds

If you don't want to deal with Twitter API, some researchers have RSS feeds:
- Nitter instances (if available)
- Personal blogs
- Google Scholar profiles

Let me know if you'd like help setting those up instead!

## Cost

Twitter API Free Tier is completely free for this use case. You get:
- 1,500 tweets/month
- 500,000 tweets/month for reading (way more than we need)
- Essential level access

## Privacy Note

This only fetches public tweets. No private information or DMs are accessed.
