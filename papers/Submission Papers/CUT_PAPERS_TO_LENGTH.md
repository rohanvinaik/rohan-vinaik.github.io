# URGENT: Cut Papers to Venue Page Limits

## THE PROBLEM
Papers 1 & 2 are **TWICE the maximum page count** for Minds & Machines:
- Paper 1: 55 pages → MUST BE 20-30 pages
- Paper 2: 47 pages → MUST BE 20-30 pages

**Minds & Machines will DESK REJECT papers over 30 pages.** Word count alone is not enough - PAGE COUNT is strictly enforced.

---

## YOUR TASK

**CUT BOTH PAPERS TO MAXIMUM 28 PAGES DOUBLE-SPACED**

Target: Remove **50% of content** from each paper while preserving:
- Core theoretical contributions
- Main arguments
- Essential citations

---

## CUTTING STRATEGY (Apply in Order)

### 1. Remove Low-Value Sections FIRST (Saves 10-15 pages)

**Cut entirely:**
- Extended literature reviews (keep only 2-3 pages max)
- Redundant examples (keep 1-2 best examples per point)
- Detailed background sections (readers know the basics)
- Historical overviews (cite instead of explaining)
- Obvious limitations sections (move to online supplement)

**Example cuts:**
- "As Previous literature has shown..." → DELETE (just cite the work)
- Multiple paragraphs explaining well-known concepts → 1 sentence + citation
- Three examples of the same point → One example only

### 2. Compress Introduction & Related Work (Saves 5-8 pages)

**Introduction:**
- Current: Probably 4-6 pages
- Target: 2 pages MAX
- Keep: Problem statement, your contribution, paper structure
- Cut: Extensive motivation, long examples, field overview

**Related Work:**
- Current: Probably 5-8 pages
- Target: 2-3 pages MAX
- Keep: Directly related work you build on or contrast with
- Cut: Tangentially related work, detailed summaries
- Strategy: "Smith et al. (2020) proposed X; we differ by Y" (1 sentence, not 1 paragraph)

### 3. Tighten Core Sections (Saves 10-15 pages)

**For every paragraph, ask:**
- Is this essential to my argument? (If no → DELETE)
- Can I say this in half the words? (If yes → COMPRESS)
- Does this repeat something I said earlier? (If yes → DELETE)

**Specific cutting tactics:**
```
BEFORE (verbose):
"In this section, we present our theoretical framework for understanding semantic content. As we will demonstrate, this framework provides a novel perspective on the relationship between syntactic processing and meaningful representation. The framework consists of three main components, which we will discuss in detail below."

AFTER (tight):
"Our framework for semantic content has three components: [X, Y, Z]."

SAVES: 3 sentences → 1 sentence
```

**Delete these phrases everywhere:**
- "As mentioned previously..."
- "It is important to note that..."
- "In this section, we will..."
- "We can see that..."
- "This demonstrates that..."
- "It should be emphasized that..."

### 4. Move Content to Online Supplement (Saves 8-12 pages)

Create a separate file: `Online_Supplement.tex`

**Move these items:**
- Detailed proofs
- Extended examples
- Comprehensive literature reviews
- Implementation details
- Additional experimental results
- Lengthy philosophical objections and responses

**In main paper, write:**
```latex
"Detailed proofs are provided in the online supplementary materials."
"For extended discussion of objections, see Supplement Section 2."
```

### 5. Cut Subsections Ruthlessly (Saves 5-8 pages)

**Many papers have subsections like:**
- "5.1 First Implication"
- "5.2 Second Implication"  
- "5.3 Third Implication"

**Instead do:**
```latex
\section{Implications}
Our framework has three key implications: First, [1 paragraph]. Second, [1 paragraph]. Third, [1 paragraph].
```

3 subsections with headers and spacing → 1 unified section
SAVES: 2-3 pages just from fewer section breaks

### 6. Shrink Conclusion (Saves 2-3 pages)

**Conclusion should be:**
- 1 page MAX (current papers probably have 2-4 pages)
- Restate main contribution in 2-3 sentences
- Future work in 1 paragraph
- Done.

**Cut:**
- Restating your entire argument
- Summarizing each section
- Obvious implications
- Philosophical speculation

---

## SPECIFIC TARGETS FOR EACH PAPER

### Paper 1: Ontological Framework (55 → 28 pages)

**Must cut: 27 pages (49% reduction)**

**Priority cuts:**
1. Introduction: 4-6 pages → 2 pages (save 2-4 pages)
2. Related work: 6-8 pages → 3 pages (save 3-5 pages)
3. Background on AI systems: 5-7 pages → 2 pages (save 3-5 pages)
4. Extended examples: Cut 50% of examples (save 4-6 pages)
5. Limitations section: 2-3 pages → move to supplement (save 2-3 pages)
6. Philosophical objections: 4-5 pages → 2 pages or supplement (save 2-3 pages)
7. Conclusion: 3-4 pages → 1 page (save 2-3 pages)
8. General compression: Every paragraph 10% shorter (save 5-8 pages)

**TOTAL: 23-37 pages saved** ✓ Achieves target

### Paper 2: Narrative Ethics (47 → 28 pages)

**Must cut: 19 pages (40% reduction)**

**Priority cuts:**
1. Introduction: 3-5 pages → 2 pages (save 1-3 pages)
2. Related work on machine ethics: 5-6 pages → 2-3 pages (save 2-3 pages)
3. Background on narrative theory: 4-5 pages → 2 pages (save 2-3 pages)
4. Extended case studies: Cut 50% (save 3-5 pages)
5. Objections and replies: 5-6 pages → 3 pages or supplement (save 2-3 pages)
6. Implementation details: 3-4 pages → 1 page + supplement (save 2-3 pages)
7. Conclusion: 2-3 pages → 1 page (save 1-2 pages)
8. General compression throughout (save 4-6 pages)

**TOTAL: 17-28 pages saved** ✓ Achieves target

---

## IMPLEMENTATION INSTRUCTIONS

### Step 1: Create Backup
```bash
cp Ontological_Framework_Submission.tex Ontological_Framework_LONG_VERSION.tex
cp Narrative_Ethics_Submission.tex Narrative_Ethics_LONG_VERSION.tex
```

### Step 2: Create Online Supplement Template
Create `Online_Supplement.tex`:
```latex
\documentclass[12pt]{article}
\usepackage[margin=1in]{geometry}
\title{Online Supplementary Materials:\\
[Paper Title Goes Here]}
\author{[Author Name]}
\date{}

\begin{document}
\maketitle

\section{Extended Proofs}
[Move detailed proofs here]

\section{Additional Examples}
[Move extra examples here]

\section{Comprehensive Literature Review}
[Move detailed related work here]

\section{Philosophical Objections: Extended Discussion}
[Move lengthy objection responses here]

\end{document}
```

### Step 3: Cut Content Systematically

**For each paper, go through line by line:**

1. **Read each paragraph and decide:**
   - Essential to core argument? → KEEP (maybe compress)
   - Supporting but not essential? → MOVE TO SUPPLEMENT
   - Redundant or tangential? → DELETE

2. **Mark content for deletion/moving:**
```latex
% CUT: This entire section is background readers likely know
% \subsection{Historical Development}
% [deleted content]

% MOVE TO SUPPLEMENT: Detailed proof not essential for main flow
% See Online Supplement Section 2.1 for complete proof.
```

3. **Compress remaining text:**
   - Every paragraph: Can you say it in fewer words?
   - Every sentence: Can you delete unnecessary qualifiers?
   - Every section: Can you merge subsections?

### Step 4: Recompile and Check

After each major cut:
```bash
pdflatex paper.tex
# Check page count
# If > 28 pages, cut more
# Repeat until ≤ 28 pages
```

### Step 5: Verify Coherence

After cutting to length:
- Read paper start to finish
- Ensure argument still flows
- Check that all references to moved content are updated
- Verify citations still resolve

---

## PAGE COUNT VERIFICATION

**Check actual page count:**
```bash
# Count pages in PDF
pdfinfo paper.pdf | grep Pages

# Or open PDF and check
```

**Target verified page counts:**
- Paper 1: 28 pages or less ✓
- Paper 2: 28 pages or less ✓
- Online supplements: Any length (not counted)

---

## RED FLAGS TO AVOID

**Don't do these things:**

❌ Don't just decrease font size (journals check this)
❌ Don't just decrease margins (not compliant)
❌ Don't just decrease line spacing (must be double-spaced)
❌ Don't cut essential arguments (paper becomes weak)
❌ Don't delete all examples (paper becomes abstract)
❌ Don't over-reference supplement (paper must stand alone)

**Do these things:**

✅ Cut verbose explanations of well-known concepts
✅ Delete redundant examples (keep the best one)
✅ Move detailed proofs to supplement
✅ Compress intro and conclusion
✅ Tighten every paragraph by 10-20%
✅ Ensure paper still makes strong, clear argument

---

## QUALITY CONTROL AFTER CUTTING

**Paper must still have:**
- ✓ Clear statement of contribution
- ✓ Sufficient motivation (brief but compelling)
- ✓ Core theoretical framework explained
- ✓ Main arguments presented with evidence
- ✓ Key examples illustrating points
- ✓ Engagement with essential related work
- ✓ Brief conclusion summarizing contribution

**Paper can omit:**
- Extended background (cite instead)
- Comprehensive literature review (keep core works only)
- Multiple examples per point (one good example suffices)
- Detailed proofs (supplement)
- Lengthy objection responses (supplement)
- Obvious limitations (or very brief)

---

## SUCCESS CRITERIA

**You're done when:**

1. ✅ Paper 1: ≤ 28 pages double-spaced
2. ✅ Paper 2: ≤ 28 pages double-spaced
3. ✅ Both papers still make clear, strong arguments
4. ✅ Core contributions are preserved and clear
5. ✅ Papers read smoothly despite cuts
6. ✅ All references resolve correctly
7. ✅ Online supplements created for moved content
8. ✅ Main papers reference supplements appropriately

---

## CRITICAL REMINDER

**Minds & Machines WILL desk-reject papers over 30 pages without review.**

- Current: Paper 1 = 55 pages, Paper 2 = 47 pages
- Required: Both ≤ 30 pages (target 28 pages for safety)
- This is NON-NEGOTIABLE

**You must cut ~50% of content.** Be ruthless. A 28-page paper that gets reviewed is infinitely better than a 55-page paper that gets desk-rejected.

---

## DELIVERABLES

For each paper, provide:

1. **Cut version:** `[Paper]_Submission.tex` (≤ 28 pages)
2. **Supplement:** `[Paper]_Online_Supplement.tex` (any length)
3. **Change log:** List what was cut/moved and why
4. **Page count verification:** Actual page count from PDF

**Do not provide "compliance reports" or "analysis" - just cut the papers to length and provide the deliverables above.**

---

## START HERE

1. Create backups of current versions
2. Create supplement template
3. Start cutting Paper 1 (needs more cuts)
4. Then cut Paper 2
5. Verify both are ≤ 28 pages
6. Done.

**Get both papers to ≤ 28 pages. That's the only goal.**
