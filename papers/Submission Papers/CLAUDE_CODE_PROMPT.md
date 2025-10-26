# Prompt for Claude Code: Adapt Papers to Venue Guidelines

## Task Overview

I have three academic papers that need to be adapted to match the specific guidelines of their target journals. Currently, the papers exist in their original form but need significant revisions to align with venue requirements. Using the detailed submission guides I've already created, please help me create venue-appropriate versions of each paper.

## Context & File Locations

**Base Papers Directory:** `/Users/rohanvinaik/rohan-vinaik.github.io/papers/`

**Submission Guides Directory:** `/Users/rohanvinaik/rohan-vinaik.github.io/papers/Submission Papers/`

**Existing Guides:**
- `ontological_framework_minds_machines.tex` - Guide for Ontological Framework → Minds and Machines
- `blackbox_dual_track_guide.tex` - Guide for Black Box → Multiple venues
- `narrative_machine_ethics_minds_machines.tex` - Guide for Narrative Ethics → Minds and Machines
- `MASTER_PUBLICATION_STRATEGY.tex` - Overall strategy document

## Papers to Adapt

### Paper 1: An Ontological Framework for Meaning, Knowledge, and Intelligence

**Source File:** `An_Ontological_Framework_for_Meaning_Knowledge_and_Intelligence.md`

**Target Venue:** Minds and Machines

**Output File:** `Submission Papers/ontological_framework_MM_adapted.tex`

**Required Changes (from guide):**

1. **Citation Format Conversion**
   - Convert from numbered citations to author-date (APA style)
   - Currently uses: `[1]`, `[2]`, etc.
   - Need: `(Minsky, 1986)`, `(Brown, 1991)`, etc.
   - Update entire bibliography to APA format

2. **Add New Section: "Analysis of Contemporary AI Systems"**
   - Should be ~3-4 pages
   - Analyze GPT-4, Claude, Gemini through the framework
   - Show how different training approaches lead to different meaning modes
   - Discuss semantic density in LLM outputs
   - Examples of semantic vampirism in AI-generated content
   - Place after Section 5 (Typology of Meaning Modes)

3. **Add Figure 1: Framework Visualization**
   - Create TikZ diagram showing:
     - Three axes: Semantic Density, Agent Interaction, Intentionality
     - Five meaning modes positioned in this space
     - Labels for each mode with key characteristics
   - Place in Section 2 or 3

4. **Expand Section 9: Related Work**
   - Add subsection on contemporary philosophy of AI
   - Engage with:
     - Bender & Koller (octopus test, meaning in LLMs)
     - Shanahan (talking about large language models)
     - Recent interpretability debates
     - Mechanistic interpretability vs behavioral approaches
   - ~2 pages additional content

5. **Strengthen Section 10: Applications**
   - Add subsection: "Implications for AI Development"
   - Concrete recommendations for avoiding semantic vampirism
   - Design principles for meaning-generating vs meaning-draining systems
   - Connect to current AI safety/alignment debates
   - ~2 pages

6. **Revise Abstract**
   - Emphasize philosophical contributions
   - Mention contemporary AI relevance upfront
   - Highlight testable predictions and metrics
   - Keep to 150-250 words

7. **Add Cover Letter**
   - Use template from guide
   - Emphasize three key contributions
   - Suggest appropriate reviewers (leave blanks for names)

**Formatting Requirements:**
- LaTeX document class: article, 12pt
- Double spacing
- 1-inch margins
- Author-date citations throughout
- Appendices should be clearly marked
- Total length: Keep under 15,000 words

---

### Paper 2: Shaking the Black Box (Version A - Technical Journal)

**Source File:** `Shaking_the_Black_Box.md`

**Target Venue:** Artificial Intelligence (Elsevier) or JAIR

**Output File:** `Submission Papers/blackbox_technical_adapted.tex`

**Required Changes (from guide):**

1. **Update Abstract for Technical Audience**
   - Lead with methodological innovation
   - Emphasize empirical validation results upfront
   - Highlight: REV protocol, HDC encoding, variance-mediated inference
   - Mention 95.8% black-box accuracy prominently
   - 150-200 words

2. **Restructure for Technical Journal Format**
   - Introduction (current + emphasize novelty)
   - Related Work (expand with recent interpretability methods)
   - Methodology (keep detailed - this is strength)
   - Experimental Setup (ensure fully reproducible)
   - Results (keep comprehensive tables)
   - Discussion (add: comparison to baselines, ablation studies)
   - Conclusion (future work)

3. **Expand Experimental Section**
   - Ensure all hyperparameters documented
   - Add comparison to additional baselines if possible
   - Include ablation studies showing contribution of each component
   - Statistical significance tests for all comparisons
   - Error bars on all figures

4. **Add Reproducibility Statement**
   - Code availability (even if "upon request")
   - Data sources clearly specified
   - Computational requirements
   - Random seeds and initialization procedures

5. **Polish All Figures and Tables**
   - High-resolution figures suitable for print
   - All axes clearly labeled with units
   - Captions that fully explain what's shown
   - Consistent notation throughout

6. **References Section**
   - Ensure all cited work is relevant and recent
   - Add recent (2023-2024) papers on:
     - Model interpretability
     - Black-box analysis methods
     - Privacy-preserving ML
     - Behavioral analysis of neural networks

**Formatting Requirements:**
- LaTeX (Elsevier or JAIR template)
- Single column for submission (check specific venue)
- Standard technical paper formatting
- Mathematics should be clearly typeset
- Algorithm blocks using appropriate packages (algorithm2e or algorithmic)

---

### Paper 3: Shaking the Black Box (Version B - AI & Society)

**Source File:** `Shaking_the_Black_Box.md`

**Target Venue:** AI & Society

**Output File:** `Submission Papers/blackbox_aisociety_adapted.tex`

**Required Changes (from guide - MAJOR REFRAMING):**

1. **Complete Introduction Rewrite**
   - Start with governance challenge, not technical problem
   - Lead with: "How can we audit AI systems without exposing trade secrets?"
   - Frame as tension between transparency and proprietary interests
   - Mention EU AI Act, regulatory landscape
   - Make accessible to non-technical readers
   - ~2 pages

2. **Add New Section 2: "The Governance Challenge"**
   - Why AI auditing matters (safety, bias, accountability)
   - Current limitations of auditing approaches
   - Stakeholder concerns: regulators, companies, public
   - What "accountability" means in practice
   - ~3 pages, no equations

3. **Radically Simplify Technical Content**
   - Move ALL mathematics to appendices
   - Rewrite Sections 2-3 in plain language
   - Use metaphors and analogies
   - Focus on "what" and "why," minimize "how"
   - Example: Instead of "hyperdimensional encoding preserves semantic relationships via Johnson-Lindenstrauss lemma"
   - Write: "Our approach creates a kind of 'fingerprint' that captures behavioral patterns while protecting proprietary information, similar to how a face can be recognized from a sketch without revealing every detail."

4. **Massively Expand Applications (Section 5)**
   - Current section is brief; make this 5-6 pages
   - Add concrete scenarios:
     - Regulatory compliance checking for financial services AI
     - Consumer protection: verifying what you're actually using
     - Auditing hiring algorithms for bias
     - Supply chain verification for AI components
   - Each with plain-language explanation

5. **Add New Section: "Policy Implications and Recommendations"**
   - Recommendations for regulators
   - Industry best practices
   - Standards and certification frameworks
   - How this enables responsible innovation
   - Multi-stakeholder governance
   - ~3-4 pages

6. **Rewrite Abstract for General Audience**
   - Lead with societal problem
   - Minimize technical jargon
   - Emphasize practical impact
   - Highlight: "achieving 95.8% accuracy using only API access enables auditing without compromising trade secrets"
   - 150-200 words

7. **Add Stakeholder Boxes**
   - Throughout paper, add highlighted boxes showing:
     - "What This Means for Regulators"
     - "What This Means for Companies"
     - "What This Means for Consumers"
   - Plain language, 2-3 sentences each

8. **Conclusion: Call to Action**
   - What needs to happen next
   - Who should do what
   - Path forward for responsible AI governance

**Formatting Requirements:**
- Accessible to non-specialists
- Minimal equations in main text
- Use of subheadings and bullet points for readability
- Shorter paragraphs than technical version
- Total length: 8,000-10,000 words

---

### Paper 4: Machines, Morality, and Narrative Ethics

**Source File:** `machines-morality-narrative-ethics.md`

**Target Venue:** Minds and Machines

**Output File:** `Submission Papers/narrative_ethics_MM_adapted.tex`

**Required Changes (from existing guide):**

1. **Format Conversion**
   - Already in LaTeX format, verify compliance with Springer style
   - Double spacing for submission
   - Author-date citations (already done)
   - Check all references are complete

2. **Minor Content Additions**
   - Add brief discussion of recent AI developments (GPT-4, Claude)
   - How does narrative-based learning relate to RLHF?
   - Brief mention of how current AI systems might benefit from narrative training
   - ~1 page addition to Section 7 (Implementation)

3. **Strengthen Contemporary Relevance**
   - In introduction, mention current AI alignment challenges
   - Connect to recent work on AI learning from human feedback
   - Cite recent papers on AI moral reasoning
   - Throughout: make contemporary relevance explicit

4. **Polish Abstract**
   - Ensure it emphasizes philosophical novelty
   - Mention practical implications for AI development
   - Keep to 150-250 words

5. **Final Proofread**
   - Consistent terminology throughout
   - No LaTeX compilation errors
   - All citations properly formatted
   - Section numbers correct

**Formatting Requirements:**
- Standard Springer format for Minds and Machines
- Double-spaced manuscript
- 1-inch margins
- Already mostly done, just needs verification

---

## General Instructions for All Papers

### Citation Management
- All citations must be author-date format: (Author, Year)
- Multiple authors: (Smith et al., 2020)
- Multiple citations: (Smith, 2020; Jones, 2021)
- Page numbers when quoting: (Smith, 2020, p. 45)
- Bibliography in APA format

### LaTeX Package Requirements
```latex
\usepackage[utf8]{inputenc}
\usepackage[margin=1in]{geometry}
\usepackage{setspace}
\usepackage{natbib} % for author-date citations
\usepackage{hyperref}
\usepackage{amsmath}
\usepackage{amssymb}
\usepackage{graphicx}
\usepackage{tikz} % for diagrams
\usepackage{algorithm2e} % for algorithms if needed
```

### Quality Checks
For each adapted paper:
1. Verify all citations are in correct format
2. Check that all figures compile correctly
3. Ensure consistent notation throughout
4. Proofread for typos and grammar
5. Verify word count is appropriate for venue
6. Ensure all sections are properly numbered
7. Check that appendices are clearly marked

### File Organization
Create clear directory structure:
```
/Submission Papers/
  /Minds_and_Machines/
    - ontological_framework_MM_adapted.tex
    - ontological_framework_MM_adapted.pdf
    - narrative_ethics_MM_adapted.tex
    - narrative_ethics_MM_adapted.pdf
  /Technical_Journals/
    - blackbox_technical_adapted.tex
    - blackbox_technical_adapted.pdf
  /AI_and_Society/
    - blackbox_aisociety_adapted.tex
    - blackbox_aisociety_adapted.pdf
  /Cover_Letters/
    - ontological_MM_cover.tex
    - narrative_MM_cover.tex
    - blackbox_technical_cover.tex
    - blackbox_aisociety_cover.tex
```

---

## Priority Order

Please work on papers in this order:

1. **Ontological Framework for M&M** (highest priority, best fit)
2. **Narrative Ethics for M&M** (mostly done, quick turnaround)
3. **Black Box Technical version** (if time permits)
4. **Black Box AI&S version** (backup option)

---

## Expected Outputs

For each paper, please provide:

1. **Adapted LaTeX file** with all changes implemented
2. **Compiled PDF** showing final formatting
3. **Change log** documenting major modifications
4. **Checklist completion** marking which items from guide were addressed
5. **Suggested cover letter** specific to that paper/venue

---

## Notes for Claude Code

- Refer to the detailed guides in `/Submission Papers/` for complete specifications
- Maintain academic tone and quality throughout
- When in doubt about philosophical content, preserve original author's voice
- For technical simplifications (AI&S version), use clear analogies
- Check recent literature (2023-2024) to ensure citations are current
- If any requirements are unclear, flag them for clarification
- Maintain internal consistency in each document
- Proofread carefully before marking as complete

---

## Questions to Consider

If you encounter any of these issues, please flag:

1. Should certain technical details be preserved even in AI&S version?
2. Are there specific reviewers I should suggest? (leave as "TBD" if unsure)
3. Do any claims need additional citations?
4. Are there any potential copyright issues with figures or examples?
5. Should certain sections be moved to appendices vs main text?

---

## Success Criteria

Each adapted paper should:
- ✓ Match target venue's formatting requirements exactly
- ✓ Address all "Required Changes" from the guide
- ✓ Maintain academic quality and rigor
- ✓ Be ready for submission with minimal additional editing
- ✓ Include all necessary front matter (abstract, keywords, etc.)
- ✓ Compile without LaTeX errors
- ✓ Have properly formatted bibliography
- ✓ Include appropriate cover letter

---

## Timeline

If possible, prioritize in this order:
1. Ontological Framework (target: ready in 1 week)
2. Narrative Ethics (target: ready in 3 days)
3. Black Box versions (target: 1-2 weeks)

Please let me know if you have questions or need clarification on any of these requirements. Thank you!
