# Visual Prototypes

Testing ground for the new "Lab" aesthetic before committing to full site architecture.

## Core Concept: "The Resolution"

The viewer's perception completes the computation.

- **Noise state**: Random dot field, Brownian drift
- **Interaction**: Coherence increases through engagement
- **Structure**: Geometric patterns emerge from apparent chaos

## Files

| File | Purpose |
|------|---------|
| `index.html` | Hero prototype test page (standalone) |
| `narrative-prototype.html` | **Full narrative architecture** with 4 chapters |
| `hero.js` | Canvas-based particle system with chapter support |
| `lab-theme.css` | New visual language |

## How to Test

1. Open `index.html` in a browser
2. Hover over the hero area to see local resolution
3. Scroll down to increase global coherence
4. Click to pulse full coherence
5. Use the pattern selector to switch targets
6. Toggle dark mode to test inverted theme

## Interaction Model

| Input | Effect |
|-------|--------|
| **Idle** | Gentle Brownian drift |
| **Mouse hover** | Local coherence (nearby particles resolve) |
| **Scroll** | Global coherence increases |
| **Click** | Momentary pulse to full coherence |

## Available Patterns

- **circles**: Concentric rings (represents order)
- **grid**: Lattice structure (represents encoding)
- **spiral**: Fibonacci-like spiral (represents emergence)
- **dna**: Double helix (represents biological encoding)

## Performance

Target: 60fps on modest hardware (<16ms per frame)

The particle system uses:
- Canvas 2D (lighter than WebGL)
- Spring physics (smooth, organic motion)
- Per-particle coherence tracking
- RequestAnimationFrame for smooth rendering

## Design Philosophy

From `personal_semiotics.md`:

> The key insight: monospace typography isn't about "code"—it's about grid alignment. Characters as texture. Text as data.

> Revelations should feel earned by user action, but the *meaning* of the revelation is authored.

## Narrative Architecture (narrative-prototype.html)

The full narrative prototype implements:

### Empowerment Promise
```
Computation through constraint.
Structure carries the answer.
```

### Four Chapters
| Chapter | Hero Pattern | Emotional Beat |
|---------|--------------|----------------|
| Home | `encoding` (DNA) | "Teach rules" |
| Approach | `constraints` (wells) | "Deepen pattern" |
| Work | `network` (connections) | "Pattern holds" |
| About | `emergence` (crystallization) | "Resolution" |

### Mission Control Sidebar
- Fixed 260px sidebar on left
- Terminal path updates: `~/home`, `~/approach`, etc.
- Chapter navigation with filled/hollow dots
- Coherence indicator from hero state

### How to Test Narrative Prototype
1. Open `narrative-prototype.html` in browser
2. Scroll through chapters to see hero transform
3. Watch sidebar update with current chapter
4. Hover over hero to see local coherence
5. Check coherence indicator in sidebar

## Next Steps

1. Refine particle behavior and timing
2. Test on mobile devices (sidebar collapse)
3. Add project deep-linking for papers
4. Integrate with main site architecture
