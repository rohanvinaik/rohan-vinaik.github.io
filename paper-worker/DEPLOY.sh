#!/bin/bash

# Paper Discovery Worker - Deployment Script
# This script will guide you through deploying the Cloudflare Worker

set -e

echo "======================================"
echo "Paper Discovery Worker - Deployment"
echo "======================================"
echo ""

# Check if wrangler is available
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npm/npx not found. Please install Node.js first."
    exit 1
fi

echo "Step 1: Authenticating with Cloudflare..."
echo "This will open your browser. Please log in and authorize Wrangler."
echo ""
read -p "Press Enter to continue..."

npx wrangler login

echo ""
echo "✅ Authentication successful!"
echo ""

echo "Step 2: Deploying worker..."
echo ""

DEPLOY_OUTPUT=$(npx wrangler deploy 2>&1)
echo "$DEPLOY_OUTPUT"

# Extract worker URL from output
WORKER_URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://[^ ]*workers.dev' | head -1)

if [ -z "$WORKER_URL" ]; then
    echo ""
    echo "⚠️  Could not automatically detect worker URL."
    echo "Please check the output above and note your worker URL."
    echo ""
    read -p "Enter your worker URL: " WORKER_URL
fi

echo ""
echo "✅ Worker deployed successfully!"
echo ""
echo "======================================"
echo "Worker URL: $WORKER_URL"
echo "======================================"
echo ""

echo "Step 3: Triggering initial paper fetch..."
echo ""

curl -X POST "$WORKER_URL/api/refresh"

echo ""
echo ""
echo "✅ Initial fetch triggered!"
echo ""

echo "Waiting 10 seconds for papers to be fetched..."
sleep 10

echo ""
echo "Testing paper retrieval..."
curl -s "$WORKER_URL/api/papers?count=3" | head -c 500
echo ""
echo "..."
echo ""

echo "======================================"
echo "✅ Deployment Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Update paper-feed.js with your worker URL:"
echo "   File: /Users/rohanvinaik/rohan-vinaik.github.io/paper-feed.js"
echo "   Replace lines 9-10 with:"
echo ""
echo "   this.apiEndpoint = '$WORKER_URL/api/papers';"
echo "   this.refreshEndpoint = '$WORKER_URL/api/refresh';"
echo ""
echo "2. Test locally:"
echo "   open /Users/rohanvinaik/rohan-vinaik.github.io/index.html"
echo ""
echo "3. Commit and push:"
echo "   cd /Users/rohanvinaik/rohan-vinaik.github.io"
echo "   git add ."
echo "   git commit -m 'Add paper discovery system'"
echo "   git push origin main"
echo ""
echo "======================================"
echo "Your worker is now running!"
echo "Papers will be automatically updated daily at 9 AM UTC."
echo "======================================"
