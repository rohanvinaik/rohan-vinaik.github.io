# RohanV.Me — the workshop treatment (2026-09)

The GitHub profile got its rewrite (2026-09-01); this plan records the equivalent
treatment for the website, split into reviewable PRs. The profile session's laws
carry over; the site's *genre* differs, so the execution differs.

## What this site is (genre)

The profile README is the note pinned to the workshop door. **This site is the
workshop's interior** — the one surface fully owned, where the long-form lives:
essays, papers, the map of how the pieces connect. Visitors arrive from three
places: an application or introduction (checking whether the person is real), an
essay or paper link (readers), or the GitHub door note (the curious, one level
deeper). It can afford more depth and more voice than the profile — it is the
personality-register surface — but the same laws hold:

- **No identity declarations.** Delight points outward; the visitor assembles
  the person. Questions as engines. The avatar/tagline layer already exists.
- **Facts conserved, claims re-derived.** Every number sourced from the repo's
  current README, rounded to the vibe. No dated precise counts.
- **No retracted claims.** The repos' honest-limits discipline is the brand;
  the site must never overclaim what a repo's own README has walked back.
- **The door stays open.** Empowerment first (things a visitor can run today);
  honest limits visible; no thank-you endings.

## Current-state audit (2026-09-01)

The May 2026 rebuild is a year behind the work:

| Problem | Where |
|---|---|
| Four-pillar framing (ModelAtlas/Wayfinder/LintGate/Wesker) as the whole story | hero, Home, Work |
| Stale numbers: 29,657 models · 166 anchors · 63% Mathlib · "118 tools" | Home metrics, project cards |
| **Retracted claims still live**: "100–500× faster than mutmut" (Wesker's own README now disavows per-mutant speed claims); "Matches DeepSeek-Prover-V2" (Wayfinder's README no longer claims parity) | Home metrics, Wayfinder card |
| Dead links: Proof-of-Training and GenomeVault papers are `href="#"` | Papers |
| Missing 2026 work: Detective, Uroboros, MeasuringAGI, Peitho, TriageGeist, Ephemeris, Ansatz, Prism; Yami described in obsolete "6 signals" framing | Work |
| Research graph (`graph-data.js`) reflects the 2025 taxonomy | Work |
| "The Kaggle medals are real" — unverifiable as stated | About |

## Work packages

### PR 1 — this plan (draft, for discussion)

### PR 2 — Truth pass (mechanical; mergeable immediately)
Fix falsehoods without redesigning. No voice, no structure changes:
stale numbers corrected against current repo READMEs; the two retracted claims
removed and replaced with claims the repos actually make; dead paper links
pointed at the repos; "medals" → "results". Diff is small and auditable.

### PR 3 — Information architecture
- Replace the four-pillar Work section with **the bench**: the domain-first map
  (genomes · programs · theorems · models · chess · triage · retail · chaos),
  one row/card per domain, mirroring the profile but with room to breathe.
- Add the missing 2026 projects; move PoT/REV/HBT into a "record" treatment
  consistent with their archived status.
- Research graph: regenerate `graph-data.js` from the current lineage
  (five threads, per the corpus reading notes) **or** retire the graph until it
  can be regenerated honestly. Decision point below.
- Papers section: remove placeholder entries; align summaries with what each
  paper/repo currently claims.

### PR 4 — Voice pass (requires the dialogue loop — not to be solo-drafted)
Hero line, Home intro, Approach, About. The profile session established the
failure mode: executing voice from a spec produces fluent, wrong drafts. This
package gets floated with Rohan in the loop, section by section.

### PR 5 — Scope-matched visual layer
The site is web-native, so the constrained-format PNG discipline does not apply
(SEMIOTICS §9): use `prefers-color-scheme` for default theme (currently
defaults light with a manual toggle); audit dual-mode on all pages including
the terminal-aesthetic paper pages; decide whether any accent from the
established identity layer (the avatar palette) enters the Lab Aesthetic or
whether the site stays fully in its own register. Hero canvas motifs are
already Winston-informed — keep.

### PR 6 — Publications pipeline
Decide which of the newer written works go public as site pages (per the
existing paper-conversion protocol in claude.md), and which stay private.
Candidates only Rohan can call: the Specification Complexity paper,
Ephemeris/Ansatz writeups, further essays.

## Decision points (the 1% — Rohan's calls, gathered here so PRs don't stall)

1. Hero line — replaces "Find the geometry. Navigate it. / Four working
   systems." What's the one sentence over the canvas?
2. Research graph — regenerate or retire?
3. Lab Aesthetic — keep pure, or admit an accent from the identity layer?
4. Which papers/documents go public in PR 6?
5. About section — the voice-pass dialogue, when ready.
