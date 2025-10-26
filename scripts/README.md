# LaTeX to Website Conversion Pipeline

Automated tools for converting LaTeX papers to terminal-aesthetic HTML and integrating them into the website.

## Overview

This pipeline uses **LaTeXML** (arXiv's HTML conversion tool) with custom terminal aesthetic styling to convert research papers from LaTeX to HTML format matching the website's design.

## Installation

### Prerequisites

```bash
# Install LaTeXML (macOS)
brew install latexml

# Verify installation
latexmlc --VERSION
```

For other platforms, see [LaTeXML installation guide](https://github.com/brucemiller/LaTeXML/wiki/Installation-Guides).

## Quick Start

### Basic Conversion

```bash
# Convert a LaTeX file to HTML
python3 scripts/latex_to_website.py paper.tex \
  --title "My Research Paper" \
  --category THEORY \
  --tags "TAG1,TAG2,TAG3"
```

### Advanced Usage

```bash
# Full conversion with website integration
python3 scripts/latex_to_website.py paper.tex \
  --title "Hyperdimensional Computing Survey" \
  --slug hdc-survey \
  --category THEORY \
  --date 2025-01-15 \
  --type "SURVEY PAPER" \
  --tags "HDC,VECTOR-SYMBOLIC,SURVEY" \
  --subtitle "Semantic Encoding" \
  --description "Comprehensive survey of hypervector principles and models"
```

### Output-Only Mode

```bash
# Just convert to HTML, don't copy figures or integrate
python3 scripts/latex_to_website.py paper.tex --output-only
```

## Command-Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `input` | Input LaTeX file (required) | - |
| `--title` | Paper title | Extracted from `\title{}` |
| `--slug` | URL slug for paper | Generated from title |
| `--category` | Category: AI, BIO, THEORY, PHILOSOPHY | THEORY |
| `--date` | Publication date (YYYY-MM-DD) | Today |
| `--type` | Paper type (e.g., "RESEARCH PAPER") | RESEARCH PAPER |
| `--tags` | Comma-separated tags | [] |
| `--subtitle` | Subtitle for research graph | - |
| `--description` | One-sentence description | - |
| `--no-integrate` | Skip website integration | false |
| `--output-only` | Only convert, no figures/integration | false |

## Pipeline Stages

### 1. LaTeXML Conversion

```bash
latexmlc input.tex \
  --destination=output.html \
  --format=html5 \
  --css=latexml-terminal.css \
  --presentationmathml \
  --numbersections
```

Features:
- Converts LaTeX → HTML5
- Preserves math as MathML (works with MathJax)
- Handles figures, tables, references
- Applies custom terminal aesthetic CSS

### 2. Figure Handling

Automatically copies figures from source directory:
- Searches for `figures/`, `images/`, `figs/`, `graphics/` directories
- Copies to `papers/{slug}_figures/`
- Supported formats: PNG, JPG, PDF, SVG

### 3. HTML Wrapping

Wraps LaTeXML output in website template:
- Terminal aesthetic styling
- Back link to papers section
- Concept tags with filtering
- MathJax for math rendering
- Mobile responsive design

### 4. Website Integration

Optionally integrates paper into website:
- Adds entry to Papers section in `index.html`
- Suggests research graph node configuration
- Requires manual verification/adjustment

## Files

```
scripts/
├── README.md                    # This file
├── latexml-terminal.css         # Custom CSS for LaTeXML
├── latex_to_website.py          # Main conversion script
└── example.tex                  # Example LaTeX file
```

## Customization

### Terminal Aesthetic CSS

The `latexml-terminal.css` file defines the website's terminal color scheme:

```css
:root {
  --bg: #0a0a0a;           /* Background */
  --text: #e0e0e0;         /* Primary text */
  --text-secondary: #a0a0a0; /* Secondary text */
  --accent: #00ff00;       /* Accent (links, headers) */
  --border: #333;          /* Borders */
  --code-bg: #1a1a1a;      /* Code background */
}
```

Font: **JetBrains Mono** (monospace)

### LaTeXML Classes

LaTeXML generates semantic HTML with classes like:
- `.ltx_abstract` - Abstract/summary
- `.ltx_theorem`, `.ltx_proof` - Theorem environments
- `.ltx_bibliography` - References
- `.ltx_figure`, `.ltx_table` - Figures and tables
- `.ltx_Math` - Mathematical content

See CSS file for full styling.

## Examples

### Example 1: Theory Paper

```bash
python3 scripts/latex_to_website.py research/coec.tex \
  --title "Computational Ontology and Emergent Computation" \
  --category THEORY \
  --tags "ONTOLOGY,FRAMEWORK,SEMANTIC-AGENTS"
```

### Example 2: Biology Paper

```bash
python3 scripts/latex_to_website.py genomevault/paper.tex \
  --title "GenomeVault: Privacy-Preserving Genomic Data Storage" \
  --category BIO \
  --tags "GENOMICS,CRYPTOGRAPHY,PRIVACY"
```

### Example 3: AI Security Paper

```bash
python3 scripts/latex_to_website.py verification/paper.tex \
  --title "REV: Runtime Evolving Verification" \
  --category AI \
  --tags "AI-SECURITY,VERIFICATION,ANYTIME-VALID"
```

## Workflow Integration

### Complete Paper Addition Workflow

```bash
# 1. Convert LaTeX to HTML
python3 scripts/latex_to_website.py paper.tex \
  --title "Paper Title" \
  --category THEORY \
  --tags "TAG1,TAG2,TAG3"

# 2. Preview HTML
open papers/Paper_Title.html

# 3. Manually add to research graph
# Edit graph-data.js to add node and connections

# 4. Commit changes
git add papers/Paper_Title.html papers/paper_title_figures/ index.html graph-data.js
git commit -m "Add Paper Title"
git push
```

## Troubleshooting

### LaTeXML not found

```bash
brew install latexml
```

### Math not rendering

- Check MathJax script is loaded in HTML
- Verify `--presentationmathml` flag is used
- Ensure math uses proper LaTeX delimiters

### Figures not displaying

- Verify figures exist in source directory
- Check figure paths are relative
- Ensure figures copied to `papers/{slug}_figures/`

### Styling issues

- Check CSS file is linked correctly
- Verify LaTeXML classes match CSS selectors
- Use browser inspector to debug styles

## Advanced: Manual LaTeXML Usage

For fine-tuned control, use LaTeXML directly:

```bash
# Two-step conversion
latexml paper.tex --destination=paper.xml
latexmlpost paper.xml \
  --destination=paper.html \
  --format=html5 \
  --css=scripts/latexml-terminal.css \
  --javascript=https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js

# Or one-step
latexmlc paper.tex \
  --destination=paper.html \
  --format=html5 \
  --css=scripts/latexml-terminal.css
```

See [LaTeXML manual](https://math.nist.gov/~BMiller/LaTeXML/manual/) for all options.

## Resources

- **LaTeXML**: https://github.com/brucemiller/LaTeXML
- **arXiv HTML**: https://info.arxiv.org/about/accessible_HTML.html
- **LaTeXML Manual**: https://math.nist.gov/~BMiller/LaTeXML/manual/
- **MathJax**: https://www.mathjax.org/

## Tag Reference

Common tags for filtering (must match `skill-project-map.js`):

**AI & Verification:**
- AI-SECURITY, VERIFICATION, CRYPTOGRAPHY
- ANYTIME-VALID, ZERO-KNOWLEDGE, LLM-TESTING

**Computational Methods:**
- HYPERDIMENSIONAL-COMPUTING, HDC, TOPOLOGICAL-DATA-ANALYSIS
- PDE-SOLVERS, DISTRIBUTED, NETWORK-FLOW

**Biology & Genomics:**
- GENOMICS, BIOINFORMATICS, STATISTICAL-GENETICS
- STEM-CELLS, BIOPROCESS, CLINICAL-TRANSLATION

**Theory & Foundations:**
- ONTOLOGY, FRAMEWORK, SEMANTIC-AGENTS
- PHASE-TRANSITIONS, MEANING-MODES, EPISTEMOLOGY

**Applications:**
- CODE-ANALYSIS, COMPUTER-VISION, OPTICS
- WETWARE, MULTI-SUBSTRATE, BIOMETRIC-IDENTIFICATION

## License

Tools and CSS are part of the rohanv.me website.
LaTeXML is licensed under the CC0 1.0 Universal license.
