#!/usr/bin/env python3
"""
LaTeX to Website Conversion Pipeline

Converts LaTeX papers to terminal-aesthetic HTML and integrates them into the website.
Uses LaTeXML for conversion with custom styling.

Usage:
    python3 latex_to_website.py input.tex [options]

Options:
    --title "Paper Title"           Paper title (extracted from LaTeX if not provided)
    --slug paper-name               URL slug (generated from title if not provided)
    --category CATEGORY             Paper category (AI|BIO|THEORY|PHILOSOPHY)
    --date YYYY-MM-DD               Publication date (today if not provided)
    --type "RESEARCH PAPER"         Paper type
    --tags TAG1,TAG2,TAG3           Comma-separated concept tags
    --no-integrate                  Skip website integration (just create HTML)
    --output-only                   Only convert to HTML, don't copy figures or integrate
"""

import os
import sys
import re
import argparse
import subprocess
import shutil
from pathlib import Path
from datetime import datetime
from html.parser import HTMLParser
import json

# Website root directory
WEBSITE_ROOT = Path(__file__).parent.parent
PAPERS_DIR = WEBSITE_ROOT / "papers"
SCRIPTS_DIR = WEBSITE_ROOT / "scripts"
CSS_FILE = SCRIPTS_DIR / "latexml-terminal.css"

# Category mapping
CATEGORIES = {
    'AI': 'AI VERIFICATION & SECURITY',
    'BIO': 'COMPUTATIONAL BIOLOGY & GENOMICS',
    'THEORY': 'THEORETICAL FOUNDATIONS',
    'PHILOSOPHY': 'PHILOSOPHY & EPISTEMOLOGY'
}


class LaTeXMLConverter:
    """Handles LaTeXML conversion with custom styling."""

    def __init__(self, input_file, slug, verbose=True):
        self.input_file = Path(input_file)
        self.slug = slug
        self.verbose = verbose
        self.output_file = PAPERS_DIR / f"{slug}.html"
        self.figures_dir = PAPERS_DIR / f"{slug}_figures"

    def convert(self):
        """Run LaTeXML conversion."""
        if self.verbose:
            print(f"Converting {self.input_file} using LaTeXML...")

        # Create temporary output file
        temp_output = self.input_file.parent / f"{self.slug}_temp.html"

        cmd = [
            'latexmlc',
            str(self.input_file),
            f'--destination={temp_output}',
            '--format=html5',
            f'--css={CSS_FILE}',
            '--presentationmathml',  # Use MathML for math
            '--numbersections',
            '--verbose' if self.verbose else '--quiet'
        ]

        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)

            if result.returncode != 0:
                print(f"LaTeXML conversion failed with error:")
                print(result.stderr)
                return None

            if self.verbose and result.stdout:
                print(result.stdout)

            return temp_output

        except subprocess.TimeoutExpired:
            print("LaTeXML conversion timed out (>5 minutes)")
            return None
        except FileNotFoundError:
            print("Error: latexmlc not found. Install with: brew install latexml")
            return None

    def copy_figures(self):
        """Copy figures from source directory to website papers directory."""
        source_dir = self.input_file.parent

        # Look for common figure directories
        possible_dirs = ['figures', 'images', 'figs', 'graphics']
        figure_sources = []

        for dirname in possible_dirs:
            potential_dir = source_dir / dirname
            if potential_dir.exists() and potential_dir.is_dir():
                figure_sources.append(potential_dir)

        # Also check for figures in the same directory as the tex file
        for ext in ['*.png', '*.jpg', '*.jpeg', '*.pdf', '*.svg']:
            figure_sources.extend(source_dir.glob(ext))

        if not figure_sources:
            if self.verbose:
                print("No figures found to copy")
            return

        # Create figures directory
        self.figures_dir.mkdir(exist_ok=True)

        # Copy all figures
        copied = 0
        for source in figure_sources:
            if source.is_dir():
                # Copy all files from directory
                for fig_file in source.iterdir():
                    if fig_file.suffix.lower() in ['.png', '.jpg', '.jpeg', '.pdf', '.svg']:
                        dest = self.figures_dir / fig_file.name
                        shutil.copy2(fig_file, dest)
                        copied += 1
            else:
                # Copy individual file
                dest = self.figures_dir / source.name
                shutil.copy2(source, dest)
                copied += 1

        if self.verbose:
            print(f"Copied {copied} figures to {self.figures_dir}")


class HTMLWrapper:
    """Wraps LaTeXML output in terminal aesthetic template."""

    def __init__(self, latexml_html, metadata):
        self.latexml_html = latexml_html
        self.metadata = metadata

    def extract_content(self):
        """Extract main content from LaTeXML HTML."""
        with open(self.latexml_html, 'r', encoding='utf-8') as f:
            html = f.read()

        # Extract body content (between <body> tags)
        body_match = re.search(r'<body[^>]*>(.*)</body>', html, re.DOTALL)
        if body_match:
            return body_match.group(1)
        return html

    def create_wrapped_html(self, output_file):
        """Create final HTML with terminal aesthetic wrapper."""
        content = self.extract_content()

        # Generate tags HTML
        tags_html = '\n  '.join([
            f'<a href="../index.html?filter={tag}" class="tag">{tag}</a>'
            for tag in self.metadata.get('tags', [])
        ])

        # Create final HTML
        html = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{self.metadata['title']} | Rohan Vinaik</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
  <link rel="stylesheet" href="../scripts/latexml-terminal.css">
</head>
<body>

<a href="../index.html#papers" class="back-link">← Back to Papers</a>

<h1>{self.metadata['title']}</h1>
<div class="paper-meta">{self.metadata['date']} · {self.metadata['type']}</div>

<div class="tags">
  {tags_html}
</div>

{content}

</body>
</html>
'''

        # Write final HTML
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html)

        print(f"Created wrapped HTML: {output_file}")


class WebsiteIntegrator:
    """Integrates paper into website (index.html and graph-data.js)."""

    def __init__(self, metadata, slug):
        self.metadata = metadata
        self.slug = slug
        self.index_file = WEBSITE_ROOT / "index.html"
        self.graph_file = WEBSITE_ROOT / "graph-data.js"

    def add_to_papers_section(self):
        """Add paper entry to Papers section in index.html."""
        if not self.index_file.exists():
            print(f"Warning: {self.index_file} not found, skipping integration")
            return False

        with open(self.index_file, 'r', encoding='utf-8') as f:
            html = f.read()

        # Find the appropriate category section
        category = self.metadata.get('category', 'THEORY')
        category_name = CATEGORIES.get(category, category)

        # Create paper entry HTML
        paper_entry = f'''
        <div class="list-item">
          <div class="list-title">{self.metadata['title']}</div>
          <div class="list-meta">{self.metadata['date']} · {self.metadata['type']}</div>
          <div class="list-actions">
            <a href="papers/{self.slug}.html" target="_blank">> read</a>
          </div>
        </div>'''

        # Try to find category section and add entry
        # This is a simplified version - you may need to adjust based on actual HTML structure
        pattern = rf'({category_name}.*?<div class="list-container">)(.*?)(</div>\s*</div>)'

        match = re.search(pattern, html, re.DOTALL)
        if match:
            # Add to end of category
            new_html = html[:match.end(2)] + paper_entry + html[match.end(2):]

            with open(self.index_file, 'w', encoding='utf-8') as f:
                f.write(new_html)

            print(f"Added paper to {category_name} section in index.html")
            return True
        else:
            print(f"Warning: Could not find {category_name} section in index.html")
            print("You'll need to manually add the paper entry:")
            print(paper_entry)
            return False

    def suggest_graph_node(self):
        """Suggest graph node configuration (requires manual addition)."""
        # Determine tier based on category
        tier_map = {
            'THEORY': 300,      # TIER 2: Foundational theory
            'BIO': 500,         # TIER 3: Domain applications
            'AI': 500,          # TIER 3: Domain applications
            'PHILOSOPHY': 100   # TIER 1: Foundational philosophy
        }

        y_position = tier_map.get(self.metadata.get('category', 'THEORY'), 500)

        node_config = {
            'id': self.slug.lower().replace('_', '-'),
            'title': self.metadata['title'].upper(),
            'subtitle': self.metadata.get('subtitle', ''),
            'description': self.metadata.get('description', ''),
            'type': 'theory',  # Adjust based on category
            'status': 'published',
            'tags': self.metadata.get('tags', []),
            'position': {'x': 400, 'y': y_position}
        }

        print("\n" + "="*60)
        print("GRAPH NODE SUGGESTION")
        print("="*60)
        print("\nAdd this to graph-data.js nodes array:")
        print(json.dumps(node_config, indent=2))
        print("\nDon't forget to add connections to related papers!")
        print("="*60 + "\n")


def main():
    parser = argparse.ArgumentParser(
        description='Convert LaTeX papers to website format',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )

    parser.add_argument('input', help='Input LaTeX file')
    parser.add_argument('--title', help='Paper title')
    parser.add_argument('--slug', help='URL slug')
    parser.add_argument('--category', choices=['AI', 'BIO', 'THEORY', 'PHILOSOPHY'],
                       default='THEORY', help='Paper category')
    parser.add_argument('--date', help='Publication date (YYYY-MM-DD)')
    parser.add_argument('--type', default='RESEARCH PAPER', help='Paper type')
    parser.add_argument('--tags', help='Comma-separated concept tags')
    parser.add_argument('--subtitle', help='Paper subtitle for graph')
    parser.add_argument('--description', help='One-sentence description for graph')
    parser.add_argument('--no-integrate', action='store_true',
                       help='Skip website integration')
    parser.add_argument('--output-only', action='store_true',
                       help='Only convert to HTML')

    args = parser.parse_args()

    # Validate input file
    input_file = Path(args.input)
    if not input_file.exists():
        print(f"Error: Input file {input_file} not found")
        sys.exit(1)

    # Extract title from LaTeX if not provided
    title = args.title
    if not title:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
            title_match = re.search(r'\\title\{([^}]+)\}', content)
            if title_match:
                title = title_match.group(1)
            else:
                title = input_file.stem.replace('_', ' ').title()

    # Generate slug
    slug = args.slug or re.sub(r'[^a-zA-Z0-9]+', '_', title).strip('_')

    # Prepare metadata
    metadata = {
        'title': title,
        'date': args.date or datetime.now().strftime('%Y-%m-%d'),
        'type': args.type,
        'category': args.category,
        'tags': [t.strip() for t in args.tags.split(',')] if args.tags else [],
        'subtitle': args.subtitle or '',
        'description': args.description or ''
    }

    print(f"\n{'='*60}")
    print(f"LaTeX to Website Conversion Pipeline")
    print(f"{'='*60}")
    print(f"Input:    {input_file}")
    print(f"Title:    {title}")
    print(f"Slug:     {slug}")
    print(f"Category: {CATEGORIES[args.category]}")
    print(f"{'='*60}\n")

    # Step 1: Convert with LaTeXML
    converter = LaTeXMLConverter(input_file, slug)
    temp_html = converter.convert()

    if not temp_html:
        print("Conversion failed")
        sys.exit(1)

    # Step 2: Copy figures (unless output-only)
    if not args.output_only:
        converter.copy_figures()

    # Step 3: Wrap in terminal aesthetic template
    wrapper = HTMLWrapper(temp_html, metadata)
    output_file = PAPERS_DIR / f"{slug}.html"
    wrapper.create_wrapped_html(output_file)

    # Clean up temp file
    if temp_html.exists():
        temp_html.unlink()

    # Step 4: Integrate into website (unless disabled)
    if not args.no_integrate and not args.output_only:
        integrator = WebsiteIntegrator(metadata, slug)
        integrator.add_to_papers_section()
        integrator.suggest_graph_node()

    print(f"\n{'='*60}")
    print(f"✓ Conversion complete!")
    print(f"{'='*60}")
    print(f"Output: {output_file}")
    print(f"Preview: open {output_file}")
    print(f"{'='*60}\n")


if __name__ == '__main__':
    main()
