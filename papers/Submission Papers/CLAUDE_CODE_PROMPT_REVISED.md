# REVISED Prompt for Claude Code: Length Reduction & Venue Compliance

## CRITICAL ISSUE: Papers Are Too Long

The existing submission drafts are 50-60+ pages each - **far exceeding journal limits**. Typical requirements:
- **Minds and Machines:** 8,000-12,000 words (~20-30 pages double-spaced)
- **AI & Society:** 8,000-10,000 words (~20-25 pages)
- **Technical Journals:** Max 30-40 pages

**Primary Task:** RUTHLESSLY CUT these papers down to appropriate lengths while preserving core contributions.

---

## File Locations

**Draft Submissions:** `/Users/rohanvinaik/rohan-vinaik.github.io/papers/Submission Papers/Draft_Submissions/`

**Papers to Fix:**

1. `Minds_and_Machines/Ontological_Framework/Ontological_Framework_Submission.tex` (~55 pages → TARGET: 25 pages)
2. `Minds_and_Machines/Narrative_Ethics/Narrative_Ethics_Submission.tex` (check length → TARGET: 25 pages)
3. `Technical_Journals/Black_Box_Framework/Black_Box_Technical_Submission.tex` (check length → TARGET: 35 pages)

---

## PHASE 1: Length Assessment

For each paper, first determine:
1. **Current length** (word count, page count)
2. **Target length** for venue
3. **Percentage reduction needed**
4. **Which sections are expandable vs. cuttable**

Output a **Cutting Plan** before making any changes.

---

## General Cutting Strategy

### What to CUT ENTIRELY (move to separate technical report if valuable):

1. **Excessive Background**
   - Long literature reviews
   - Detailed historical overviews
   - Comprehensive related work surveys
   → Keep only most relevant 3-5 papers per subsection

2. **Redundant Examples**
   - Multiple examples making same point
   - Lengthy vignettes that don't advance argument
   → Keep 1-2 strongest examples per concept

3. **Over-Formalization**
   - Proofs that can be cited or stated without full derivation
   - Excessive mathematical notation
   - Multiple equivalent formulations
   → State results formally, provide intuition, cite proofs

4. **Methodological Details**
   - Extensive protocols better suited to supplementary materials
   - Step-by-step procedures
   - Full coding manuals
   → Summarize approach, reference appendix or online supplement

5. **Secondary Discussions**
   - Tangential philosophical debates
   - Speculative future work
   - Exhaustive limitations sections
   → Cut to essentials, brief bullet points

### What to CONDENSE HEAVILY:

1. **Introduction**
   - Current: Often 4-5 pages
   - Target: 2-3 pages maximum
   - Cut: Extended motivation, verbose roadmap
   - Keep: Core problem, thesis, contributions list

2. **Related Work**
   - Current: Often 6-8 pages
   - Target: 2-3 pages maximum  
   - Cut: Comprehensive surveys, detailed critiques
   - Keep: Most relevant work, positioning

3. **Multiple Subsections**
   - Collapse related subsections
   - Combine redundant discussions
   - Use paragraphs instead of subsections for minor points

4. **Repetitive Explanations**
   - State concepts once clearly
   - Remove restatements "in other words"
   - Eliminate recap paragraphs

### What to MOVE TO APPENDIX (online supplement):

1. **All proofs and detailed derivations**
2. **Extensive experimental details**
3. **Full coding protocols and IRB statements**
4. **Complete metric definitions** (keep formulas in main text, move justifications)
5. **Extended examples and case studies**
6. **Supplementary figures and tables**

### What to PRESERVE (core content):

1. **Abstract** (150-250 words)
2. **Core theoretical framework** (the novel contribution)
3. **Key formalism** (definitions, main theorems - stated concisely)
4. **Essential experimental validation** (main results table/figure)
5. **Primary application/case study** (ONE strong example)
6. **Conclusion** (1-2 pages maximum)

---

## Paper-Specific Cutting Plans

### Paper 1: Ontological Framework for Minds & Machines

**Current:** ~55 pages, ~25,000+ words
**Target:** 25 pages, ~10,000 words  
**Reduction Needed:** >50%

**Cutting Plan:**

**SECTION 1 (Problem & Contribution):**
- Current: 4 pages → Target: 2 pages
- Cut: Extended problem motivation, verbose contribution list
- Keep: Thesis statement, core claims (bullets), brief contributions

**SECTION 2 (Ontological Commitments):**
- Current: 6 pages → Target: 3 pages
- Cut: Extensive formal definitions, multiple examples per concept
- Keep: Core ontology (agents, K, T, I), one clear example
- Move: Detailed formal definitions to appendix

**SECTION 3 (Neutral Mechanisms):**
- Current: 5 pages → Target: 3 pages
- Cut: Extended parameter discussions, multiple edge cases
- Keep: Core K/T/I definitions with key parameters
- Condense: Failure modes into single paragraph

**SECTION 4 (Metrics):**
- Current: 6 pages → Target: 3 pages
- Cut: Multiple operationalizations per metric, extensive justification
- Keep: One primary operationalization per metric (M, H/R, A, C_T, V, ΔG)
- Move: Alternative operationalizations to appendix

**SECTION 5 (Typology):**
- Current: 7 pages → Target: 4 pages
- Keep: This is core contribution - preserve table and mode descriptions
- Cut: Extended metric discussions for each mode
- Condense: 2-3 paragraphs per mode maximum

**SECTION 6 (Propositions):**
- Current: 6 pages → Target: 3 pages
- Cut: Detailed predictions, multiple signatures per proposition
- Keep: Statement of each proposition, key prediction
- Condense: All subsections

**SECTION 7 (AI Systems Analysis):**
- Current: 8 pages → Target: 4 pages
- This is valuable contemporary relevance - preserve but condense
- Cut: Detailed analysis of each LLM, extensive speculation
- Keep: General analysis framework, ONE detailed LLM example (GPT-4)
- Brief mentions: Other systems (Claude, RAG) in 1-2 paragraphs each

**SECTION 8 (Vignettes):**
- Current: 3 pages → Target: 1 page or CUT ENTIRELY
- These are illustrative only - not essential
- Option: Move to appendix or cut completely
- If kept: 2-3 sentences per vignette maximum

**SECTION 9 (Methods):**
- Current: 5 pages → Target: 2 pages
- Move: Detailed protocols to appendix/supplementary materials
- Keep: High-level approach, key metric definitions
- Cut: IRB details, full coding manual references

**SECTION 10 (Related Work):**
- Current: 6 pages → Target: 3 pages
- This is too comprehensive - cut 50%
- Keep: Most relevant work per subsection (2-3 papers)
- Cut: Historical overviews, comprehensive surveys
- Focus: Recent work most relevant to contribution

**SECTION 11 (Applications):**
- Current: 6 pages → Target: 3 pages
- Cut: Extensive lists, detailed procedures
- Keep: Key design principles (bullets), main application
- Condense: Ethical risks section to 1 paragraph

**SECTION 12 (Limitations):**
- Current: 3 pages → Target: 1 page
- Condense all subsections into concise paragraph format
- This can be brief

**CONCLUSION:**
- Current: 3 pages → Target: 2 pages
- Cut: Extended research program, verbose summaries
- Keep: Core results summary, key future directions

**TOTAL CUTS NEEDED:** ~30 pages to hit 25-page target

---

### Paper 2: Narrative Ethics for Minds & Machines

**Check current length first, then apply similar cutting strategy**

Target: ~25 pages for Minds & Machines

Key sections to preserve:
- Core argument about narrative-based moral learning
- Terminator 2 case study (it's distinctive)
- Objections and replies

Sections to cut heavily:
- Extended literature review beyond essentials
- Verbose philosophical background
- Lengthy methodological discussion

---

### Paper 3: Black Box for Technical Journal

**Check current length first**

Target: ~35 pages for technical journal (can be slightly longer)

Key sections to preserve:
- Technical methodology (REV, HDC, VMCI)
- Experimental results (this is strength)
- Black-box validation

Sections to cut/condense:
- Philosophical framing (save for Minds & Machines version if you make one)
- Extended discussion of applications
- Some background material

---

## Specific Editing Guidelines

### Sentence-Level Cuts

**Remove hedging and qualification:**
- Before: "It should be noted that this approach, while potentially useful, may have limitations that..."
- After: "This approach has limitations..."

**Remove meta-commentary:**
- Cut: "As we will see in Section X..."
- Cut: "Having established X, we now turn to..."  
- Cut: "It is important to emphasize that..."

**Combine redundant sentences:**
- Before: "Systems can fail. Failure occurs when constraints degrade. Degraded constraints lead to Mode V."
- After: "Systems fail when degraded constraints induce Mode V."

**Use lists instead of paragraphs:**
- Convert verbose explanations to bulleted lists
- Use tables to consolidate information

**Cut examples after the first:**
- One clear example is sufficient
- Delete "for instance," "another example," etc.

### Paragraph-Level Cuts

**Eliminate paragraphs that:**
- Repeat information stated elsewhere
- Provide general background available in cited sources
- Qualify or hedge the main argument excessively
- Discuss tangential issues

**Merge short paragraphs:**
- 2-3 sentence paragraphs can often be combined
- Reduces white space and perceived length

### Section-Level Cuts

**Ask for each section:**
1. Does this advance the core argument?
2. Could a reader understand the contribution without it?
3. Is this information available elsewhere (citations)?
4. Can this be moved to appendix/supplement?

**If "no" to #1 or "yes" to #2-4: CUT IT**

---

## Output Requirements

For each paper, provide:

### 1. Before/After Analysis
```
Current length: X pages / Y words
Target length: A pages / B words
Reduction: C pages / D words (E%)

Sections cut: [list]
Sections condensed: [list]
Content moved to appendix: [list]
```

### 2. Cutting Log
Document major deletions:
- What was cut
- Why it was cut  
- Impact on argument (minimal, moderate, significant)

### 3. Appendix Organization
Create separate supplementary materials file with:
- Detailed proofs
- Extended examples
- Full protocols
- Additional tables/figures

### 4. Updated Paper
The shortened version meeting target length

### 5. Quality Check
- Does paper still make coherent argument?
- Are all necessary definitions present?
- Are core contributions clear?
- Would a reviewer understand the work?

---

## Critical Rules

1. **PRESERVE NOVELTY:** Never cut the unique contributions
2. **PRESERVE CLARITY:** If cut creates confusion, add brief explanation
3. **RESPECT CITATIONS:** Don't cut so much you can't properly cite prior work
4. **MAINTAIN FLOW:** After cuts, ensure transitions work
5. **VERIFY REFERENCES:** All cited works must still be relevant
6. **CHECK FIGURES:** Ensure all referenced figures/tables still exist
7. **UPDATE TOC:** Remove sections that no longer exist

---

## Quality Thresholds

**Reject the edit if:**
- Paper becomes incoherent
- Core argument is lost
- Novel contributions are cut
- Mathematical rigor is compromised (for technical papers)

**Accept minor loss of:**
- Comprehensiveness
- Background detail
- Extended examples
- Methodological minutiae
- Speculative discussion

---

## Suggested Appendix Structure

Create online supplement with:

**Appendix A:** Formal Proofs and Derivations
**Appendix B:** Extended Experimental Details  
**Appendix C:** Detailed Protocols and Methods
**Appendix D:** Supplementary Examples and Vignettes
**Appendix E:** Additional Figures and Tables

---

## Example of Good Cutting

**BEFORE (verbose):**
```
The framework that we propose in this paper builds on several 
lines of prior research. First, there is extensive work in 
cognitive science on agent-based models of mind, pioneered by 
Minsky (1988) and extended by numerous researchers. Second, 
there is work in narratology examining story structure, 
including structuralist approaches (Propp, 1968; Barthes, 1977) 
and more recent computational narratology. Third, information 
theory provides tools for measuring semantic content...
[continues for 2 more paragraphs]
```

**AFTER (concise):**
```
The framework extends agent-based cognitive architectures 
(Minsky, 1988) and structural narratology (Propp, 1968; Barthes, 
1977) using information-theoretic metrics to characterize meaning 
emergence across minds, media, and computational systems.
```

**Cut:** ~200 words → ~30 words (85% reduction)

---

## Final Checklist

Before considering paper "done":

- [ ] Word count meets target (±10%)
- [ ] All sections properly formatted
- [ ] Citations still correct after cuts
- [ ] Figures/tables all referenced
- [ ] Appendix created with cut material
- [ ] Abstract updated if needed
- [ ] Conclusion still summarizes actual content
- [ ] No orphaned references to cut sections
- [ ] Paper reads coherently start to finish
- [ ] Contribution is still clear and compelling

---

## Priority Order

1. **Ontological Framework** - Most urgent, most over-length
2. **Narrative Ethics** - Check length, cut if needed  
3. **Black Box Technical** - Check length, cut if needed

---

## Questions to Answer First

Before starting cuts, tell me:

1. **Ontological Framework:**
   - Current word count?
   - Can we move Sections 8 (Vignettes) and 9 (Methods) entirely to appendix?
   - Is Section 7 (AI Systems) essential or can it be drastically shortened?

2. **Narrative Ethics:**
   - Current length?
   - Is it already compliant or does it need cuts?

3. **Black Box:**
   - Current length?
   - Target venue (affects length tolerance)?

---

## Success Criteria

A paper is "done" when:
1. ✓ Length meets venue requirements
2. ✓ Core contributions are clear and prominent
3. ✓ Argument flows logically
4. ✓ All essential background is present
5. ✓ Formatting is correct
6. ✓ Paper would be comprehensible to informed reviewer
7. ✓ Nothing essential is missing
8. ✓ Nothing unnecessary remains

---

**Remember:** Academic journals want FOCUSED contributions, not comprehensive treatises. Cutting is not weakness - it's discipline. The mark of good academic writing is saying everything necessary and nothing more.

**Motto:** "Kill your darlings. Then kill them again. Then check the word count."
