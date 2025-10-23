# GitHub Actions Workflows

This directory contains automated workflows for the paper discovery system.

## update-paper-archive.yml

**Purpose:** Automatically exports and commits the paper archive daily.

**Schedule:**
- Runs daily at 9:30 AM UTC (30 minutes after paper fetch)
- Can also be triggered manually from GitHub Actions tab

**What it does:**
1. Downloads latest archive from Cloudflare Worker
2. Generates papers-archive.json (machine-readable)
3. Generates PAPERS-ARCHIVE.md (human-readable)
4. Commits changes if archive has been updated
5. Pushes to main branch

**Configuration:**
- Worker URL: `https://paper-discovery-worker.rohan-vinaik.workers.dev`
- Files updated: `papers-archive.json`, `PAPERS-ARCHIVE.md`
- Auto-commit message: "🤖 Auto-update paper archive - YYYY-MM-DD"

**Manual Trigger:**
1. Go to GitHub repo → Actions tab
2. Select "Update Paper Archive" workflow
3. Click "Run workflow" → "Run workflow"

**Monitoring:**
- View workflow runs: GitHub repo → Actions tab
- Check run history and logs
- Receive notifications if workflow fails

**No manual intervention required!** Archive updates automatically every day.
