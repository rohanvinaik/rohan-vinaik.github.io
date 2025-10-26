# Complete Venue Compliance Prompt for Claude Code

## Objective

Transform existing draft papers to fully comply with target venue guidelines including:
1. **Length requirements** (page limits, word counts)
2. **Formatting specifications** (document class, spacing, margins, fonts)
3. **Citation style** (author-date, numbered, specific formats)
4. **Section structure** (required/optional sections, naming conventions)
5. **Style guidelines** (writing conventions, terminology, tone)
6. **Submission requirements** (file format, supplementary materials)

---

## Papers & Target Venues

### Paper 1: Ontological Framework
- **File:** `Draft_Submissions/Minds_and_Machines/Ontological_Framework/Ontological_Framework_Submission.tex`
- **Target:** Minds and Machines
- **Publisher:** Springer
- **Current Status:** ~55 pages, needs cutting + full formatting compliance

### Paper 2: Narrative Ethics
- **File:** `Draft_Submissions/Minds_and_Machines/Narrative_Ethics/Narrative_Ethics_Submission.tex`
- **Target:** Minds and Machines
- **Publisher:** Springer
- **Current Status:** Check length + formatting compliance

### Paper 3: Black Box Framework
- **File:** `Draft_Submissions/Technical_Journals/Black_Box_Framework/Black_Box_Technical_Submission.tex`
- **Target:** Artificial Intelligence (Elsevier) or JAIR
- **Current Status:** Check length + formatting compliance

---

## Part 1: Minds and Machines Compliance (Papers 1 & 2)

### A. Length Requirements

**STRICT LIMITS:**
- **Word Count:** 8,000-12,000 words (main text only, excluding references)
- **Page Count:** Approximately 20-30 pages double-spaced
- **Abstract:** 150-250 words
- **Keywords:** 4-6 keywords

**What counts toward limit:**
- Abstract
- Main text body
- Footnotes

**What does NOT count:**
- Title page
- References/bibliography
- Appendices (online supplementary materials)
- Figures and tables (minimal contribution to count)

**ACTION REQUIRED:**
1. Calculate current word count excluding references
2. If >12,000 words, cut to 10,000-11,000 target
3. Document all cuts made

### B. Document Formatting

**LaTeX Document Class:**
```latex
\documentclass[12pt]{article}
% NOT Springer's svjour3 for submission - use standard article
```

**Required Packages:**
```latex
\usepackage[utf8]{inputenc}
\usepackage[margin=1in]{geometry}  % 1-inch margins all sides
\usepackage{setspace}
\doublespacing  % MUST be double-spaced
\usepackage{natbib}  % For author-date citations
\usepackage{hyperref}  % For URLs and cross-references
\usepackage{amsmath, amssymb, amsthm}  % Mathematics
\usepackage{graphicx}  % For figures
```

**Font:**
- 12pt Times New Roman or similar serif font
- No special fonts without justification

**Spacing:**
- Double-spaced throughout (including references)
- Single line break between paragraphs
- No extra spacing around sections

**Margins:**
- 1 inch on all sides (top, bottom, left, right)

**Page Numbers:**
- Continuous throughout
- Bottom center or top right

### C. Citation Style - CRITICAL

**MUST USE: Author-Date (APA-like)**

Minds and Machines requires author-date citations in text with full references at end.

**In-Text Citation Format:**

```latex
% Basic citation
(Minsky, 1988)

% Multiple authors
(Bender \& Koller, 2020)  % 2 authors
(Bender et al., 2021)      % 3+ authors

% Multiple citations
(Minsky, 1988; Dennett, 1987)

% With page numbers
(Minsky, 1988, p. 45)

% Narrative citation
Minsky (1988) argues that...
```

**WRONG (numbered style):**
```latex
% Do NOT use:
[1], [2, 3], \cite{ref1}
```

**Bibliography Style:**
```latex
\bibliographystyle{apalike}
% OR
\bibliographystyle{plainnat}
```

**Reference List Format (APA-like):**

```
Books:
Minsky, M. (1988). The Society of Mind. Simon & Schuster.

Journal Articles:
Bender, E.M. & Koller, A. (2020). Climbing towards NLU: On 
  Meaning, Form, and Understanding in the Age of Data. 
  Proceedings of ACL, 5185–5198.

Chapters:
Gabriel, I. (2020). Artificial Intelligence, Values, and 
  Alignment. In J. Smith (Ed.), AI Ethics (pp. 45-67). 
  Oxford University Press.
```

**ACTION REQUIRED:**
1. Convert ALL numbered citations `\cite{ref}` to `\citep{ref}` or `\citet{ref}`
2. Update bibliography style to `apalike` or `plainnat`
3. Verify all references are properly formatted
4. Check that in-text citations match bibliography entries

### D. Structure Requirements

**Required Sections (in order):**

1. **Title Page:**
   ```latex
   \title{Your Title Here}
   \author{Author Name\\
   \textit{Affiliation}}
   \date{\today}  % or leave blank
   ```

2. **Abstract:**
   - 150-250 words
   - Self-contained summary
   - No citations in abstract
   - State: problem, approach, key findings, implications

3. **Keywords:**
   ```latex
   \noindent\textbf{Keywords:} keyword1, keyword2, keyword3, 
   keyword4, keyword5
   ```

4. **Main Text:**
   - Introduction (no need to label as "1. Introduction" - can be unlabeled or labeled)
   - Body sections (numbered or not, venue is flexible)
   - Conclusion

5. **Acknowledgments** (optional, after main text)

6. **References:**
   - Called "References" not "Bibliography"
   - Alphabetically ordered by first author surname
   - APA format

**Section Numbering:**
- Venue allows either numbered or unnumbered sections
- Be consistent throughout
- Current papers use numbered - that's fine

**Subsection Depth:**
- Limit to 3 levels: Section, Subsection, Subsubsection
- Avoid excessive nesting

### E. Tables and Figures

**Placement:**
- Can be in-text or at end (in-text preferred for readability)
- Each must be referenced in text before it appears

**Tables:**
```latex
\begin{table}[h]
\centering
\caption{Descriptive caption explaining what the table shows}
\label{tab:mylabel}
\begin{tabular}{...}
...
\end{tabular}
\end{table}
```

**Figures:**
```latex
\begin{figure}[h]
\centering
\includegraphics[width=0.8\textwidth]{filename}
\caption{Descriptive caption}
\label{fig:mylabel}
\end{figure}
```

**Caption Style:**
- Table captions ABOVE table
- Figure captions BELOW figure
- Full sentence explaining what is shown
- No period at end of caption (convention varies, be consistent)

### F. Writing Style Guidelines

**Philosophical rigor:**
- Define technical terms clearly
- Distinguish your contributions from prior work
- Engage substantively with relevant philosophy of AI/mind literature
- Avoid excessive jargon; explain technical concepts

**Argumentation:**
- State claims clearly and support them
- Consider objections and respond
- Connect technical content to philosophical significance

**Tone:**
- Formal academic writing
- Avoid colloquialisms
- Use active voice when appropriate ("I argue that..." is acceptable)
- Avoid excessive hedging but don't overstate

**Terminology:**
- Be consistent (if you say "semantic agent" don't switch to "meaning-bearing unit")
- Define abbreviations on first use
- Use standard terminology from field when available

### G. Common Issues to Fix

**Issue 1: Table of Contents**
```latex
% REMOVE THIS - not needed for journal submission
\tableofcontents
\clearpage
```

**Issue 2: Excessive Formatting**
```latex
% Remove:
\doublespacing in individual sections (apply globally)
Custom theorem environments unless necessary
Colored text (use sparingly)
```

**Issue 3: Appendices**
- Keep appendices ONLY if truly essential
- Prefer online supplementary materials for lengthy appendices
- Label clearly: "Appendix A", "Appendix B"

**Issue 4: Equations**
- Number only equations that are referenced
- Use align environment for multi-line equations
- Explain notation clearly

### H. Pre-Submission Checklist

**Length:**
- [ ] Word count 8,000-12,000 (excluding references)
- [ ] Page count ~20-30 pages double-spaced
- [ ] Abstract 150-250 words
- [ ] 4-6 keywords provided

**Formatting:**
- [ ] 12pt font, double-spaced, 1-inch margins
- [ ] Author-date citations throughout
- [ ] Bibliography in APA format, alphabetically ordered
- [ ] No table of contents
- [ ] All figures/tables referenced in text
- [ ] Proper caption formatting

**Content:**
- [ ] All technical terms defined
- [ ] Clear statement of contributions
- [ ] Engagement with relevant literature
- [ ] Objections addressed
- [ ] Conclusion summarizes findings

**Technical:**
- [ ] LaTeX compiles without errors
- [ ] All citations resolve correctly
- [ ] No broken cross-references
- [ ] PDF looks professional

---

## Part 2: Technical Journal Compliance (Paper 3)

### A. Venue Selection

**Option 1: Artificial Intelligence (Elsevier)**
- More prestigious, more competitive
- Length: Up to 40 pages recommended
- Format: Elsevier LaTeX template

**Option 2: JAIR (Journal of Artificial Intelligence Research)**
- Open access, no page charges
- Length: No strict limit, but concise preferred (~30-40 pages)
- Format: JAIR LaTeX template

**Recommendation:** Try AI first, JAIR as backup

### B. Artificial Intelligence (Elsevier) Requirements

**Document Class:**
```latex
\documentclass{elsarticle}
% Download template from Elsevier
```

**Length:**
- No strict word limit
- Typical: 30-40 pages
- Appendices allowed
- Comprehensive experimental validation expected

**Citation Style:**
```latex
\bibliographystyle{elsarticle-num}  % Numbered citations
% OR
\bibliographystyle{elsarticle-harv}  % Author-date
```

**Numbered citations ARE acceptable for technical journals:**
```latex
Recent work [1, 2] has shown...
\cite{ref1,ref2}
```

**Formatting:**
- Single column for submission (will be reformatted for publication)
- Single-spaced acceptable
- Standard margins

**Structure:**
```latex
\begin{frontmatter}
\title{Your Title}
\author[inst1]{Author Name}
\address[inst1]{Affiliation}
\begin{abstract}
...
\end{abstract}
\begin{keyword}
keyword1 \sep keyword2 \sep keyword3
\end{keyword}
\end{frontmatter}
```

**Sections:**
1. Introduction
2. Related Work (can be section 2 or woven throughout)
3. Technical Content (Methods, Framework, etc.)
4. Experiments/Validation
5. Discussion
6. Conclusion

**Emphasis:**
- Technical rigor
- Comprehensive experiments
- Comparison to baselines
- Reproducibility details

### C. JAIR Requirements

**Document Class:**
```latex
\documentclass{article}
\usepackage{jair}  % Download JAIR style file
```

**Length:**
- No strict limit
- Quality over length
- Typical: 25-35 pages

**Citation Style:**
```latex
\bibliographystyle{theapa}  % JAIR uses APA-like author-date
```

**Formatting:**
- Double column final format (but submit single column)
- Specific JAIR macros for theorems, algorithms

**Structure:**
- Similar to Elsevier
- Emphasize clear exposition
- Open access mandate: ensure no copyright conflicts

---

## Part 3: Automated Compliance Checks

For each paper, create a compliance report:

```markdown
## Compliance Report: [Paper Title] for [Venue]

### Length Compliance
- Current word count: X words
- Target range: Y-Z words
- Status: ✓ PASS / ✗ FAIL (over by N words)
- Action needed: [if fail, cutting plan]

### Format Compliance
- Document class: ✓/✗
- Margins: ✓/✗ (1 inch all sides)
- Spacing: ✓/✗ (double-spaced)
- Font size: ✓/✗ (12pt)

### Citation Compliance
- Style: ✓/✗ (author-date / numbered as required)
- In-text format: ✓/✗
- Bibliography format: ✓/✗
- All references cited: ✓/✗
- All citations in references: ✓/✗

### Structure Compliance
- Abstract length: ✓/✗ (150-250 words)
- Keywords: ✓/✗ (4-6 keywords)
- Required sections present: ✓/✗
- Table of contents removed: ✓/✗

### Content Compliance
- Technical terms defined: ✓/✗
- Literature engagement: ✓/✗
- Clear contributions: ✓/✗
- Appropriate tone: ✓/✗

### Issues Found
1. [List each issue with location and fix needed]
2. ...

### Changes Made
1. [List each change with justification]
2. ...
```

---

## Part 4: Systematic Fixing Procedure

### Step 1: Assessment
For each paper:
1. Compile current version
2. Count words (main text only)
3. Check LaTeX packages and document class
4. Scan for citation style
5. Review section structure
6. Generate initial compliance report

### Step 2: Citation Fix (HIGHEST PRIORITY)
This is often the biggest issue:

```bash
# Find all numbered citations
grep -n "\\cite{" filename.tex
grep -n "\[.*\]" filename.tex  # Potential numbered citations

# Replace with appropriate style:
# For M&M (author-date):
\cite{ref} → \citep{ref}  # (Author, Year)
\cite{ref} → \citet{ref}  # Author (Year) - in sentence

# For technical (if using numbered):
Keep \cite{ref} but ensure numbering style is set
```

**Manual check required:**
- Some \cite{ref} should be \citet (narrative: "Author shows...")
- Some should be \citep (parenthetical: "as shown previously (Author, Year)")

### Step 3: Length Reduction (if needed)
Follow cutting strategy:
1. Remove table of contents
2. Condense introduction (max 2-3 pages)
3. Shorten related work (max 3 pages for M&M, 4-5 for technical)
4. Move detailed proofs to appendix
5. Cut redundant examples
6. Combine subsections
7. Tighten prose throughout

### Step 4: Format Compliance
```latex
% Fix document class
\documentclass[12pt]{article}

% Fix packages
\usepackage[utf8]{inputenc}
\usepackage[margin=1in]{geometry}
\usepackage{setspace}
\doublespacing

% Fix citation style
\usepackage{natbib}
\bibliographystyle{apalike}  % for M&M
```

### Step 5: Structure Fix
- Remove or move table of contents
- Ensure abstract is 150-250 words
- Add/verify keywords (4-6)
- Check all figures/tables are referenced
- Verify section numbering consistency

### Step 6: Content Polish
- Define all technical terms on first use
- Check that contributions are clearly stated
- Ensure literature engagement is substantial
- Verify philosophical depth (for M&M)
- Confirm experimental rigor (for technical)

### Step 7: Reference Cleanup
```latex
% Ensure alphabetical order
% Check format consistency
% Verify completeness:
  % - All authors listed
  % - Full title
  % - Publication venue
  % - Year
  % - Page numbers (for articles)
```

### Step 8: Compilation Check
```bash
pdflatex paper.tex
bibtex paper
pdflatex paper.tex
pdflatex paper.tex

# Check for:
# - No LaTeX errors
# - All citations resolved
# - No "??" in references
# - PDF looks correct
```

### Step 9: Final Compliance Verification
Generate final compliance report showing all checks pass.

### Step 10: Supplementary Materials
Create separate file for online supplements:
```latex
\documentclass[12pt]{article}
\title{Online Supplementary Materials for: [Paper Title]}
\begin{document}
\appendix
\section{Detailed Proofs}
...
\section{Extended Experimental Results}
...
\end{document}
```

---

## Part 5: Venue-Specific Style Guides

### Minds and Machines Style

**Philosophical expectations:**
- Engage with philosophy of AI, philosophy of mind, cognitive science
- Don't just present technical work - discuss philosophical implications
- Address potential philosophical objections
- Connect to debates in the field

**Citation expectations:**
- Cite classic works (Minsky, Dennett, etc.)
- Cite recent philosophy of AI (last 3-5 years)
- Engage substantively, don't just name-drop

**Avoid:**
- Pure engineering/implementation details without philosophical framing
- Purely empirical papers without theoretical significance
- Papers that don't engage with existing philosophical literature

**Tone:**
- Thoughtful, careful argumentation
- Acknowledge complexity and uncertainty
- Don't overstate implications

### Technical Journal Style

**Expectations:**
- Rigorous technical content
- Comprehensive experiments
- Comparison to baselines
- Reproducibility information
- Clear contributions

**Citation expectations:**
- Recent technical papers (last 2-3 years)
- Cite related methods
- Compare results quantitatively

**Avoid:**
- Philosophical speculation without technical grounding
- Insufficient experimental validation
- Claims without evidence
- Missing baselines or comparisons

**Tone:**
- Precise, technical
- Claim-evidence structure
- Quantitative whenever possible

---

## Part 6: Common Errors to Fix

### Error 1: Wrong Citation Style
**Fix:** Convert all citations to venue-appropriate style

### Error 2: Too Long
**Fix:** Apply systematic cutting strategy, move material to appendix

### Error 3: Wrong Spacing
**Fix:** Ensure double-spacing for M&M, appropriate spacing for technical

### Error 4: Missing Keywords
**Fix:** Add 4-6 relevant keywords after abstract

### Error 5: Table of Contents
**Fix:** Remove for journal submission

### Error 6: Inconsistent Terminology
**Fix:** Search-and-replace to ensure consistent terms throughout

### Error 7: Undefined Abbreviations
**Fix:** Define all abbreviations on first use

### Error 8: Unreferenced Figures/Tables
**Fix:** Ensure all are mentioned in text before they appear

### Error 9: Incomplete References
**Fix:** Check all references have complete information

### Error 10: LaTeX Compilation Errors
**Fix:** Resolve all errors and warnings

---

## Part 7: Quality Assurance

### Automated Checks
```bash
# Word count (main text only)
detex paper.tex | wc -w

# Check for citation style consistency
grep -c "\\citep" paper.tex
grep -c "\\citet" paper.tex
grep -c "\\cite{" paper.tex

# Find potential formatting issues
grep "TODO" paper.tex
grep "XXX" paper.tex
grep "FIXME" paper.tex

# Check for common mistakes
grep "\\\\\\\\$" paper.tex  # Double line breaks
grep "  " paper.tex  # Double spaces
```

### Manual Review Checklist

**Overall:**
- [ ] Reads smoothly start to finish
- [ ] Argument is coherent
- [ ] Contributions are clear
- [ ] Appropriate for target venue

**Technical:**
- [ ] All math notation defined
- [ ] Theorems stated clearly
- [ ] Proofs correct (or in appendix)
- [ ] Algorithms properly formatted

**Experimental (technical papers):**
- [ ] Setup clearly described
- [ ] Results tables formatted properly
- [ ] Comparisons to baselines included
- [ ] Statistical significance reported

**Philosophical (M&M papers):**
- [ ] Philosophical framing clear
- [ ] Literature engagement substantial
- [ ] Objections considered
- [ ] Implications discussed

---

## Output Requirements

For each paper, provide:

### 1. Initial Assessment Report
- Current status (length, format, citations)
- Issues identified
- Estimated work needed

### 2. Compliance-Fixed Version
- Corrected LaTeX file
- Compiled PDF
- Supplementary materials file (if needed)

### 3. Change Log
```markdown
## Changes Made: [Paper Title]

### Citation Style
- Converted N citations from numbered to author-date
- Updated bibliography style to apalike
- Fixed M inconsistent citation formats

### Length Reduction
- Reduced from X words to Y words
- Sections cut: [list]
- Material moved to appendix: [list]

### Formatting
- Fixed margins to 1 inch
- Ensured double-spacing throughout
- Removed table of contents
- Updated document class

### Structure
- Shortened abstract from X to Y words
- Added keywords: [list]
- Reorganized Section Z for clarity

### Content
- Defined technical term "X" on first use
- Expanded discussion of related work
- Added philosophical framing to Section Y
```

### 4. Final Compliance Report
All checks passing, ready for submission

### 5. Submission Checklist
Completed checklist specific to venue

---

## Success Criteria

Paper is ready for submission when:

**Format:**
- ✓ Correct document class and packages
- ✓ Proper margins and spacing
- ✓ Appropriate citation style throughout
- ✓ Bibliography properly formatted

**Length:**
- ✓ Within venue word/page limits
- ✓ Abstract correct length
- ✓ Right number of keywords

**Structure:**
- ✓ All required sections present
- ✓ Logical organization
- ✓ No extraneous elements (TOC, etc.)

**Content:**
- ✓ Clear contributions
- ✓ Appropriate engagement with literature
- ✓ Right tone for venue
- ✓ Technical terms defined

**Quality:**
- ✓ LaTeX compiles without errors
- ✓ No broken references
- ✓ Professional appearance
- ✓ Ready to submit

---

## Critical Reminders

1. **Citation style is non-negotiable** - must match venue exactly
2. **Length limits are strict** - journals will desk-reject if too long
3. **Formatting matters** - wrong format suggests lack of care
4. **Venue expectations differ** - M&M wants philosophy, technical journals want rigor
5. **Double-check everything** - small errors create bad impressions

**When in doubt:** Consult official author guidelines on journal website
