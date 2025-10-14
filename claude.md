# Claude Code Protocol for Website Maintenance

This document contains reproducible protocols for common website maintenance tasks.

---

## Protocol: Converting Papers to HTML and Website Integration

### Overview
This protocol converts research papers (markdown, PDF, or project folders) into styled HTML papers and integrates them into the website with proper categorization, links, and styling consistency.

### Prerequisites
- Source paper (markdown file, PDF, or project folder with manuscript.md)
- Any associated figures/images
- Understanding of paper's research domain

### Step 1: Explore and Extract Content

**If source is a project folder:**
```bash
# Navigate to folder structure
ls -la /path/to/project/folder
# Read main manuscript
Read manuscript.md or paper.md
# Read any README for key updates
Read README.md
# Identify figures directory
ls -la figures/ or images/
```

**If source is a markdown file:**
```bash
Read /path/to/paper.md
```

**Extract:**
- Title and subtitle
- Abstract/summary
- Key findings with specific numbers
- Section structure
- Tables (convert to HTML tables)
- Figures (note paths)
- References
- Concept tags (10-12 relevant tags from existing tag system)

### Step 2: Copy Figures to Website

**Create figures subdirectory:**
```bash
mkdir -p papers/<paper_slug>_figures/
```

**Copy all figures:**
```bash
cp /source/path/figures/*.png papers/<paper_slug>_figures/
cp /source/path/figures/*.jpg papers/<paper_slug>_figures/
```

**Note:** Use consistent naming: lowercase, underscores, descriptive (e.g., `figure1_enrichment_patterns.png`)

### Step 3: Create HTML Paper

**Use Task tool for large papers (>3000 words):**
```
Task tool with subagent_type: "general-purpose"
Prompt: "Create complete HTML paper from the manuscript at [path]. Use terminal aesthetic styling, include all sections, tables, figures, and references. Paper title: [title]"
```

**For smaller papers, use Write tool with this template:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Paper Title] | Rohan Vinaik</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
  <style>
    :root {
      --bg: #0a0a0a;
      --text: #e0e0e0;
      --text-secondary: #a0a0a0;
      --accent: #00ff00;
      --border: #333;
      --code-bg: #1a1a1a;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'JetBrains Mono', monospace;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }
    h1 {
      color: var(--accent);
      font-size: 1.5rem;
      margin-bottom: 8px;
      letter-spacing: 0.02em;
    }
    h2 {
      color: var(--accent);
      font-size: 1.1rem;
      margin-top: 32px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
    }
    h3 {
      color: var(--accent);
      font-size: 0.95rem;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    p { margin-bottom: 16px; font-size: 0.85rem; }
    a {
      color: var(--accent);
      text-decoration: none;
      border-bottom: 1px dotted var(--accent);
    }
    a:hover { border-bottom-style: solid; }
    .back-link {
      display: inline-block;
      margin-bottom: 24px;
      font-size: 0.85rem;
    }
    .paper-meta {
      color: var(--text-secondary);
      font-size: 0.75rem;
      margin-bottom: 24px;
    }
    .abstract {
      background: var(--code-bg);
      padding: 20px;
      border-left: 3px solid var(--accent);
      margin-bottom: 32px;
      font-size: 0.85rem;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 32px;
    }
    .tag {
      background: var(--code-bg);
      padding: 4px 12px;
      border: 1px solid var(--border);
      font-size: 0.7rem;
      color: var(--accent);
      text-decoration: none;
      border-bottom: none;
    }
    .tag:hover {
      background: var(--accent);
      color: var(--bg);
      border-color: var(--accent);
    }
    .quick-nav {
      background: var(--code-bg);
      padding: 16px;
      margin-bottom: 32px;
      border: 1px solid var(--border);
    }
    .quick-nav h3 {
      margin-top: 0;
      font-size: 0.85rem;
    }
    .quick-nav ul {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 8px;
      margin-top: 12px;
    }
    .quick-nav a {
      font-size: 0.75rem;
      border-bottom: none;
      padding: 4px 0;
      display: block;
    }
    .quick-nav a:hover { color: var(--bg); background: var(--accent); padding-left: 8px; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 0.75rem;
    }
    th, td {
      border: 1px solid var(--border);
      padding: 12px;
      text-align: left;
    }
    th {
      background: var(--code-bg);
      color: var(--accent);
      font-weight: 600;
    }
    figure {
      margin: 32px 0;
      text-align: center;
    }
    figure img {
      max-width: 100%;
      border: 1px solid var(--border);
    }
    figcaption {
      margin-top: 12px;
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-style: italic;
    }
    .references {
      font-size: 0.75rem;
      margin-top: 32px;
    }
    .references ol {
      padding-left: 20px;
    }
    .references li {
      margin-bottom: 12px;
      line-height: 1.5;
    }
    @media (max-width: 768px) {
      body { padding: 12px; }
      h1 { font-size: 1.2rem; }
      h2 { font-size: 1rem; }
    }
  </style>
</head>
<body>

<a href="../index.html#papers" class="back-link">← Back to Papers</a>

<h1>[Paper Title]</h1>
<div class="paper-meta">[Date] · [Type: RESEARCH PAPER / FRAMEWORK PAPER / etc]</div>

<div class="tags">
  <a href="../index.html?filter=TAG1" class="tag">[TAG1]</a>
  <a href="../index.html?filter=TAG2" class="tag">[TAG2]</a>
  <!-- Add 10-12 relevant tags -->
</div>

<div class="abstract">
  <strong>Abstract:</strong> [Abstract text...]
</div>

<div class="quick-nav">
  <h3>Quick Navigation</h3>
  <ul>
    <li><a href="#introduction">Introduction</a></li>
    <li><a href="#methods">Methods</a></li>
    <li><a href="#results">Results</a></li>
    <li><a href="#discussion">Discussion</a></li>
    <li><a href="#references">References</a></li>
  </ul>
</div>

<!-- Main content sections -->
<h2 id="introduction">Introduction</h2>
<p>[Content...]</p>

<!-- Tables -->
<table>
  <thead>
    <tr><th>Column 1</th><th>Column 2</th></tr>
  </thead>
  <tbody>
    <tr><td>Data</td><td>Data</td></tr>
  </tbody>
</table>

<!-- Figures -->
<figure>
  <img src="[paper_slug]_figures/figure1.png" alt="Description">
  <figcaption><strong>Figure 1:</strong> Caption text...</figcaption>
</figure>

<!-- References -->
<div class="references">
  <h2 id="references">References</h2>
  <ol>
    <li>Reference 1...</li>
  </ol>
</div>

</body>
</html>
```

**Save as:** `/Users/rohanvinaik/rohan-vinaik.github.io/papers/[Paper_Title_Slug].html`

### Step 4: Integrate into Website (index.html)

#### 4a. Add to Papers Section

**Determine category:**
- AI VERIFICATION & SECURITY
- COMPUTATIONAL BIOLOGY & GENOMICS
- THEORETICAL FOUNDATIONS
- PHILOSOPHY & EPISTEMOLOGY

**Add entry in appropriate section (lines ~437-526):**

```html
<div class="list-item">
  <div class="list-title">[Paper Title]</div>
  <div class="list-meta">[DATE · TYPE]</div>
  <div class="list-actions">
    <a href="papers/[Paper_Slug].html" target="_blank">> read</a>
    <!-- Add any appendices/supplements -->
  </div>
</div>
```

#### 4b. Update Project Box (if applicable)

**Find project box in Projects section (lines ~237-394):**

**Update description with specific findings:**
```html
<div class="item-desc">
  [Updated description with key numbers, findings, and validation results]
</div>
```

**Add paper link in item-actions:**
```html
<div class="item-actions">
  <a href="papers/[Paper_Slug].html" target="_blank">> read</a>
</div>
```

#### 4c. Update "Currently Working On" Section (if applicable)

**For active/recent work, update Home section (lines ~140-160):**

```html
<div class="highlight-item">
  <strong>[PROJECT]</strong> — [Key finding with specific numbers]
</div>
```

### Step 5: Commit and Push

```bash
# Stage all changes
git add papers/[paper_slug].html papers/[paper_slug]_figures/ index.html

# Check status
git status

# Commit with descriptive message
git commit -m "$(cat <<'EOF'
Add [Paper Title] and integration

[Paper Type] describing [brief overview]. Key findings:
- [Finding 1 with numbers]
- [Finding 2 with numbers]
- [Finding 3 with numbers]

Paper includes:
- Complete [X]-word content from [source]
- [N] concept tags: [TAG1, TAG2, TAG3, ...]
- [N] tables and [N] figures
- [N] references

Integration:
- Added to [CATEGORY] section in Papers
- Updated [PROJECT] box description with findings
- [If applicable] Updated "Currently Working On" section
- All figures copied to papers/[paper_slug]_figures/

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# Push to GitHub
git push
```

### Quality Checklist

Before committing, verify:

- [ ] All figures display correctly in HTML preview
- [ ] All tables are properly formatted
- [ ] Math equations render with MathJax (if applicable)
- [ ] All internal links work (quick navigation)
- [ ] Back link points to `../index.html#papers`
- [ ] Tags link to `../index.html?filter=TAGNAME`
- [ ] Paper appears in correct Papers section category
- [ ] Project box (if applicable) has updated description
- [ ] Terminal aesthetic styling is consistent
- [ ] Mobile responsive (check on narrow viewport)
- [ ] No broken image links
- [ ] Git status shows only intended files

### Tag Reference

Common tags to use (must match existing filter system):

**AI & Verification:**
AI-SECURITY, VERIFICATION, CRYPTOGRAPHY, ANYTIME-VALID, ZERO-KNOWLEDGE, LLM-TESTING, MEMORY-EFFICIENT

**Computational Methods:**
HYPERDIMENSIONAL-COMPUTING, HDC, TOPOLOGICAL-DATA-ANALYSIS, PDE-SOLVERS, DISTRIBUTED, NETWORK-FLOW, STATISTICAL-TESTING, CONFIDENCE-SEQUENCES

**Biology & Genomics:**
GENOMICS, BIOINFORMATICS, STATISTICAL-GENETICS, STEM-CELLS, BIOPROCESS, CLINICAL-TRANSLATION, COMORBIDITY, GWAS, NEUROTRANSMITTER-SYSTEMS, ADHD, AUTISM

**Theory & Foundations:**
ONTOLOGY, FRAMEWORK, SEMANTIC-AGENTS, PHASE-TRANSITIONS, MEANING-MODES, EPISTEMOLOGY

**Applications:**
CODE-ANALYSIS, COMPUTER-VISION, OPTICS, IMAGE-PROCESSING, WETWARE, MULTI-SUBSTRATE, BIOMETRIC-IDENTIFICATION, PRIVATE-INFORMATION-RETRIEVAL

### Common Issues and Solutions

**Issue:** Figures not displaying
- **Solution:** Check relative paths (`[paper_slug]_figures/filename.png`), ensure figures were copied to correct directory

**Issue:** Tags not filtering on main page
- **Solution:** Verify tag names match exactly with skill-project-map.js (case-sensitive, use hyphens)

**Issue:** Math not rendering
- **Solution:** Ensure MathJax script is in `<head>`, use `\(...\)` for inline math, `\[...\]` for display math

**Issue:** Tables too wide on mobile
- **Solution:** Keep tables simple, use `font-size: 0.75rem`, consider making horizontally scrollable

**Issue:** Commit message too long
- **Solution:** Use heredoc format with `git commit -m "$(cat <<'EOF' ... EOF)"` to handle multi-line messages

---

## Template Files Location

- **HTML Paper Template:** See Step 3 above
- **Filter System Tags:** `/Users/rohanvinaik/rohan-vinaik.github.io/skill-project-map.js`
- **Graph Data (for conceptual relationships):** `/Users/rohanvinaik/rohan-vinaik.github.io/graph-data.js`

---

## Notes

- Always preview HTML locally before committing (can use `open papers/Paper_Name.html` on macOS)
- Paper filenames should use underscores, not spaces: `Paper_Title_Here.html`
- Figure directories should match paper slug: `paper_title_here_figures/`
- Keep descriptions factual with specific numbers, avoid vague claims
- Terminal aesthetic is non-negotiable: JetBrains Mono, #0a0a0a background, #00ff00 accent
- When in doubt about categorization, check existing papers in index.html for guidance
