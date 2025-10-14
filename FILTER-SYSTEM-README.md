# 🔗 Skill-Project Filtering System

An interactive, bidirectional filtering system that connects skills to projects with smooth animations and a terminal aesthetic.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [User Guide](#user-guide)
- [Developer Guide](#developer-guide)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The filtering system creates an interactive experience where visitors can:
- Click any skill to see which projects use it
- Click project tags to filter by category
- Combine multiple filters with OR/AND logic
- Share filtered views via URL parameters
- Navigate seamlessly between skills and projects

### Architecture

```
┌─────────────────────────────────────────────────────┐
│  skill-project-map.js                               │
│  ├─ skillProjectMap (skill → tags)                  │
│  ├─ tagSkillMap (tag → skills)                      │
│  ├─ projectTags (project → tags)                    │
│  └─ Helper functions                                │
└─────────────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────┐
│  filter-system.js                                   │
│  ├─ FilterSystem class                              │
│  ├─ Event listeners (skill clicks, tag clicks)      │
│  ├─ Filter logic (OR/AND modes)                     │
│  ├─ URL state management                            │
│  ├─ Smooth animations                               │
│  └─ Filter bar UI                                   │
└─────────────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────┐
│  style.css                                          │
│  ├─ Filter bar styling                              │
│  ├─ Clickable skill styles                          │
│  ├─ Project fade animations                         │
│  └─ Mobile responsive                               │
└─────────────────────────────────────────────────────┘
```

---

## ✨ Features

### Core Functionality

✅ **Skill → Project Filtering**
- Click any skill to automatically navigate to projects section
- Projects using that skill are highlighted
- Non-matching projects fade to 30% opacity

✅ **Multi-Select Filtering**
- Click multiple skills to combine filters
- OR mode: Show projects matching ANY selected skill
- AND mode: Show projects matching ALL selected skills

✅ **Bidirectional Navigation**
- Skills → Projects: Click skills to filter
- Projects → Skills: Click project tags to filter by that tag

✅ **Visual Feedback**
- Matching projects: green border, full opacity
- Non-matching: faded, grayscale
- Active skills: checkmark indicator, accent color
- Project count badges on skills

✅ **URL State Management**
- Filters encoded in URL: `?filter=python,cell-biology&mode=and`
- Shareable filtered views
- Browser back/forward support
- Restores filter state on page load

### UI Components

**Filter Bar** (appears at top when filters active):
```
┌─ ACTIVE FILTERS ────────────────────────────────────┐
│ ▓ ACTIVE FILTERS                                    │
│ [CELL-BIOLOGY] × [PDE-MODELS] ×                     │
│ [OR]  [CLEAR ALL]                                   │
│ Showing 2 of 6 projects                             │
└─────────────────────────────────────────────────────┘
```

**Skill Project Count Badges**:
```
Differential Equations [3]
       ↑ clickable      ↑ project count
```

**Interactive Project Tags**:
```
[CELL-BIOLOGY] [PDE-MODELS] [AI-CONTROL]
      ↑ click any tag to filter
```

---

## 🚀 How It Works

### 1. Skill-Project Mapping

The system uses a comprehensive mapping in `skill-project-map.js`:

```javascript
const skillProjectMap = {
  'Python': ['AI-CONTROL', 'ML-TOOLS', 'STATISTICS', 'GENOMICS'],
  'Cell Biology': ['CELL-BIOLOGY', 'WETWARE', 'MOLECULAR-BIO'],
  'Machine Learning': ['AI-CONTROL', 'ML-TOOLS', 'VALIDATION']
};
```

Each skill maps to an array of **project tags**. When you click a skill:
1. System looks up all tags for that skill
2. Adds those tags to active filters
3. Filters projects that have matching tags

### 2. Project Tag Detection

Projects are identified by their tags in the HTML:

```html
<div class="item-box">
  <div class="item-title">KIMAIYA</div>
  <div class="item-tags">
    <span class="tag">[CELL-BIOLOGY]</span>
    <span class="tag">[PDE-MODELS]</span>
    <span class="tag">[AI-CONTROL]</span>
  </div>
</div>
```

The system parses these tags to determine which projects match filters.

### 3. Filter Modes

**OR Mode (Default)**:
- Shows projects matching **any** active filter
- Example: `[PYTHON] OR [R]` → shows projects using Python OR R

**AND Mode**:
- Shows projects matching **all** active filters
- Example: `[PYTHON] AND [CELL-BIOLOGY]` → shows only projects using BOTH

### 4. URL State

Filters are encoded in URL parameters:

```
?filter=python,cell-biology&mode=or
         ↑ tags              ↑ filter mode
```

This allows:
- Sharing specific filtered views
- Bookmarking filter combinations
- Browser history navigation

---

## 📖 User Guide

### Basic Usage

**To filter projects by a skill:**
1. Navigate to Skills section
2. Hover over any skill (you'll see a project count badge)
3. Click the skill
4. System automatically scrolls to Projects section
5. Matching projects are highlighted

**To add multiple filters:**
1. Click multiple skills or project tags
2. Projects matching ANY filter are shown (OR mode)
3. Click `[OR]` button to switch to AND mode
4. Now only projects with ALL filters are shown

**To remove filters:**
- Click × next to any filter in the filter bar
- Or click `[CLEAR ALL]` to reset

### Advanced Features

**Sharing Filtered Views:**
```
https://yoursite.com/?filter=machine-learning,python&mode=and
```
Copy and share this URL to show your specific filter combination.

**Exploring Related Skills:**
1. Click a project tag
2. See which other projects share that tag
3. Look at skill badges to see what other skills apply

---

## 👨‍💻 Developer Guide

### Adding New Skills

**1. Add to `skill-project-map.js`:**

```javascript
const skillProjectMap = {
  // ... existing skills
  'Your New Skill': [
    'TAG1',        // Projects with TAG1
    'TAG2',        // Projects with TAG2
    'TAG3'         // Projects with TAG3
  ]
};
```

**2. Add skill to HTML** (`index.html` skills section):

```html
<span class="tool-tag">Your New Skill</span>
```

The system automatically:
- Makes it clickable
- Adds project count badge
- Sets up event listeners

### Adding New Projects

**1. Add project HTML:**

```html
<div class="item-box">
  <div class="item-title">PROJECT_NAME</div>
  <div class="item-desc">Description...</div>
  <div class="item-tags">
    <span class="tag">[TAG1]</span>
    <span class="tag">[TAG2]</span>
    <span class="tag">[TAG3]</span>
  </div>
</div>
```

**2. Update `skill-project-map.js` project metadata:**

```javascript
const projectTags = {
  // ... existing projects
  'PROJECT_NAME': ['TAG1', 'TAG2', 'TAG3']
};
```

**3. Update skill mappings:**

For each tag, update relevant skills to include the new tags:

```javascript
'Python': ['AI-CONTROL', 'TAG1'],  // Added TAG1
'Machine Learning': ['ML-TOOLS', 'TAG2']  // Added TAG2
```

### Adding New Tags

If you need a new tag category:

**1. Create the tag:**
```html
<span class="tag">[NEW-TAG]</span>
```

**2. Map skills to it:**
```javascript
'Relevant Skill': ['EXISTING-TAG', 'NEW-TAG']
```

**3. Update tag vocabulary** in documentation.

### Tag Naming Conventions

Use consistent naming:
- ALL-CAPS with hyphens: `CELL-BIOLOGY`
- Descriptive but concise: `PDE-MODELS` not `PARTIAL-DIFFERENTIAL-EQUATION-MATHEMATICAL-MODELS`
- Technology: `ML-TOOLS`, `PDE-SOLVERS`
- Domain: `CELL-BIOLOGY`, `GENOMICS`
- Method: `STATISTICS`, `VALIDATION`, `SIMULATION`
- Theory: `THEORY`, `EMERGENCE`, `SYSTEMS`

---

## 🎨 Customization

### Changing Filter Bar Position

Edit `style.css`:

```css
.filter-bar {
  position: sticky;  /* Change to fixed, absolute, etc. */
  top: 0;           /* Adjust position */
}
```

### Adjusting Fade Animation

Edit `style.css`:

```css
.item-box.filtered-out {
  opacity: 0.3;     /* Change fade level (0-1) */
  transform: scale(0.98);  /* Adjust scale */
}
```

### Changing Color Scheme

The filter system uses CSS variables:

```css
.filter-tag {
  border: 1px solid var(--accent);  /* Uses theme accent color */
}
```

Colors automatically adapt to your theme (green, amber, cyan).

### Custom Filter Modes

To add a third mode (e.g., "XOR"), edit `filter-system.js`:

```javascript
toggleMode() {
  const modes = ['OR', 'AND', 'XOR'];
  const current = modes.indexOf(this.filterMode);
  this.filterMode = modes[(current + 1) % modes.length];
  // ... rest of logic
}
```

---

## 🐛 Troubleshooting

### Skills Not Clickable

**Problem**: Skills don't respond to clicks.

**Solutions**:
1. Check browser console for JavaScript errors
2. Ensure `skill-project-map.js` loads before `filter-system.js`
3. Verify skill names match exactly (case-sensitive):
   ```javascript
   'Differential Equations' !== 'differential equations'
   ```
4. Check that skill exists in `skillProjectMap`

### No Projects Showing

**Problem**: All projects disappear when filtering.

**Solutions**:
1. Check filter mode (AND vs OR)
2. Verify project tags match skill mappings:
   ```javascript
   // skill-project-map.js
   'Python': ['PDE-SOLVERS']  // Must match HTML tag

   // index.html
   <span class="tag">[PDE-SOLVERS]</span>  // Exact match required
   ```
3. Clear filters and try again

### Filter Bar Not Appearing

**Problem**: Filter bar doesn't show when clicking skills.

**Solutions**:
1. Check console for errors
2. Verify CSS loaded:
   ```css
   .filter-bar { display: block; }  /* Should exist */
   ```
3. Ensure filter bar container created:
   ```javascript
   document.getElementById('filter-bar')  // Should exist
   ```

### URL State Not Working

**Problem**: URL doesn't update or restore filters.

**Solutions**:
1. Check browser supports `pushState` API
2. Verify URL format:
   ```
   ?filter=tag1,tag2&mode=and
   ```
3. Test with direct URL navigation

### Project Counts Wrong

**Problem**: Skill badges show incorrect project counts.

**Solutions**:
1. Verify `projectTags` object in `skill-project-map.js` is complete
2. Check for typos in tag names
3. Rebuild skill-tag mappings:
   ```javascript
   // The tagSkillMap is auto-generated from skillProjectMap
   // If it's wrong, fix the skillProjectMap source
   ```

---

## 📊 Statistics & Analytics

### Current System Stats

- **Skills Mapped**: 40+ skills across 4 categories
- **Projects**: 6 major projects
- **Tags**: 15 unique tag categories
- **Avg Skills per Project**: 3.5
- **Avg Projects per Skill**: 2.8

### Most Connected Skills

```
Python          → 6 projects
Cell Biology    → 4 projects
PDEs            → 3 projects
Machine Learning → 3 projects
```

### Most Tagged Projects

```
KIMAIYA             → 3 tags (CELL-BIOLOGY, PDE-MODELS, AI-CONTROL)
GENOMEVAULT         → 3 tags (GENOMICS, CRYPTOGRAPHY, COMPRESSION)
FDSC                → 3 tags (PDE-SOLVERS, DISTRIBUTED, SIMULATION)
```

---

## 🔮 Future Enhancements

Potential additions:

### 1. Skill Network Visualization
Interactive graph showing skill relationships:
- Nodes = skills
- Edges = shared projects
- Click to filter

### 2. Smart Suggestions
"You're viewing Python projects. Related skills: Machine Learning, NumPy"

### 3. Project Complexity Score
Rate projects by number of skills required:
```
[COMPLEXITY: ★★★★☆] KIMAIYA (uses 8 skills)
```

### 4. Search Bar
Type-ahead search for skills:
```
> diff[erent]
  ▸ Differential Equations (3)
  ▸ DifferentialEquations.jl (2)
```

### 5. Keyboard Shortcuts
```
/ → Focus search
Esc → Clear filters
1-9 → Quick filter by project
```

### 6. Export Functionality
Export filtered project list:
```
$ export --format=markdown
# Projects using Python
- KIMAIYA
- GENOMEVAULT
- FDSC
```

---

## 📝 Notes

### Performance

- Filter operations: O(n) where n = number of projects
- DOM updates batched for smooth 60fps animations
- Lazy initialization (500ms delay after page load)

### Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Accessibility

- Keyboard navigation supported
- Screen reader friendly (ARIA labels on controls)
- Focus indicators on all interactive elements
- Respects `prefers-reduced-motion`

---

## 📚 API Reference

### FilterSystem Class

```javascript
window.FilterSystem  // Global instance

// Methods
.addFilter(tagOrSkill)         // Add filter
.removeFilter(tag)             // Remove filter
.clearFilters()                // Clear all
.toggleMode()                  // Switch OR/AND
.getActiveFilters()            // Get active tags array
.getFilterMode()               // Get current mode
.getMatchingProjectCount()     // Get match count
```

### SkillProjectMap Module

```javascript
window.SkillProjectMap

// Properties
.skillProjectMap               // skill → tags mapping
.tagSkillMap                   // tag → skills mapping
.projectTags                   // project → tags mapping

// Methods
.getTagsForSkill(skill)        // Returns tag array
.getSkillsForTag(tag)          // Returns skill array
.getProjectCountForSkill(skill) // Returns number
.projectMatchesTags(project, tags, mode) // Returns boolean
```

---

## 🙏 Credits

Built with:
- Vanilla JavaScript (no dependencies)
- CSS Grid & Flexbox
- Modern Web APIs (URLSearchParams, pushState)

Inspired by:
- Terminal/command-line aesthetics
- Interactive data visualization
- Bidirectional navigation patterns

---

## 📧 Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Email: hello@rohanv.me
- Check browser console for error messages

---

**Last Updated**: 2025-01-14
**Version**: 1.0.0
**Status**: Production Ready 🚀
