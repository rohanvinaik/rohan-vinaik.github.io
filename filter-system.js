// ============================================
// INTERACTIVE SKILL-PROJECT FILTERING SYSTEM
// Bidirectional navigation with smooth animations
// ============================================

(function() {
  'use strict';

  class FilterSystem {
    constructor() {
      // State
      this.activeFilters = new Set();
      this.filterMode = 'OR'; // 'OR' or 'AND'
      this.isInitialized = false;
      this.debounceTimer = null;

      // DOM references (will be populated on init)
      this.projectCards = [];
      this.skillTags = [];
      this.filterBar = null;
      this.projectsSection = null;

      // Stats
      this.totalProjects = 0;
      this.matchingProjects = 0;
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    init() {
      if (this.isInitialized) return;

      console.log('[FilterSystem] Initializing...');

      // Wait for SkillProjectMap to load
      if (!window.SkillProjectMap) {
        console.warn('[FilterSystem] SkillProjectMap not loaded, retrying...');
        setTimeout(() => this.init(), 100);
        return;
      }

      // Create filter bar UI
      this.createFilterBar();

      // Find all project cards
      this.projectCards = Array.from(document.querySelectorAll('.item-box'));
      this.totalProjects = this.projectCards.length;

      // Find all skill tags and make them clickable
      this.setupSkillTags();

      // Setup project tag clicking
      this.setupProjectTags();

      // Restore state from URL
      this.restoreFromURL();

      // Handle browser navigation
      window.addEventListener('popstate', () => this.restoreFromURL());

      this.isInitialized = true;
      console.log('[FilterSystem] Initialized with', this.totalProjects, 'projects');
    }

    // ============================================
    // UI CREATION
    // ============================================
    createFilterBar() {
      // Create filter bar element
      const filterBar = document.createElement('div');
      filterBar.id = 'filter-bar';
      filterBar.className = 'filter-bar';
      filterBar.style.display = 'none';

      filterBar.innerHTML = `
        <div class="filter-bar-content">
          <div class="filter-bar-header">
            <span class="filter-bar-icon">▓</span>
            <span class="filter-bar-title">ACTIVE FILTERS</span>
          </div>
          <div class="filter-bar-body">
            <div class="filter-tags-container" id="filter-tags-container"></div>
            <div class="filter-controls">
              <button class="filter-btn" id="filter-mode-btn" title="Toggle AND/OR mode">
                <span class="btn-label" id="filter-mode-label">OR</span>
              </button>
              <button class="filter-btn" id="filter-clear-btn" title="Clear all filters">
                CLEAR ALL
              </button>
            </div>
          </div>
          <div class="filter-bar-footer">
            <span class="filter-count" id="filter-count">Showing all projects</span>
          </div>
        </div>
      `;

      // Insert at top of output area
      const outputArea = document.querySelector('.output-area');
      if (outputArea) {
        outputArea.insertBefore(filterBar, outputArea.firstChild);
      }

      this.filterBar = filterBar;

      // Setup event listeners
      document.getElementById('filter-mode-btn').addEventListener('click', () => {
        this.toggleMode();
      });

      document.getElementById('filter-clear-btn').addEventListener('click', () => {
        this.clearFilters();
      });
    }

    setupSkillTags() {
      // Find all skill tags in the skills section
      const skillElements = document.querySelectorAll('.tool-tag, .skill-name');

      skillElements.forEach(el => {
        const skillName = el.textContent.trim();

        // Check if this skill is in our mapping
        if (window.SkillProjectMap.skillProjectMap[skillName]) {
          // Make it clickable
          el.classList.add('skill-clickable');
          el.setAttribute('data-skill', skillName);
          el.setAttribute('title', 'Click to filter projects using this skill');

          // Add project count badge
          const count = window.SkillProjectMap.getProjectCountForSkill(skillName);
          if (count > 0) {
            const badge = document.createElement('span');
            badge.className = 'skill-project-count';
            badge.textContent = count;
            el.appendChild(badge);
          }

          // Add click handler
          el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleSkillClick(skillName);
          });

          this.skillTags.push(el);
        }
      });

      console.log('[FilterSystem] Made', this.skillTags.length, 'skills clickable');
    }

    setupProjectTags() {
      // Find all tags within project cards
      const projectTagElements = document.querySelectorAll('.item-box .tag');

      projectTagElements.forEach(el => {
        const tagName = el.textContent.trim().replace(/[\[\]]/g, '');

        // Make it clickable
        el.classList.add('tag-clickable');
        el.setAttribute('data-tag', tagName);
        el.setAttribute('title', 'Click to filter by this tag');

        // Add click handler
        el.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.handleTagClick(tagName);
        });
      });

      console.log('[FilterSystem] Made', projectTagElements.length, 'project tags clickable');
    }

    // ============================================
    // FILTER MANAGEMENT
    // ============================================
    handleSkillClick(skillName) {
      console.log('[FilterSystem] Skill clicked:', skillName);

      // Get tags for this skill
      const tags = window.SkillProjectMap.getTagsForSkill(skillName);

      if (tags.length === 0) {
        console.warn('[FilterSystem] No tags found for skill:', skillName);
        return;
      }

      // Add all tags for this skill
      tags.forEach(tag => this.activeFilters.add(tag));

      // Apply filters
      this.applyFilters();

      // Navigate to projects section
      this.navigateToProjects();

      // Update URL
      this.updateURL();
    }

    handleTagClick(tagName) {
      console.log('[FilterSystem] Tag clicked:', tagName);

      // Toggle filter
      if (this.activeFilters.has(tagName)) {
        this.activeFilters.delete(tagName);
      } else {
        this.activeFilters.add(tagName);
      }

      // Apply filters
      this.applyFilters();

      // Navigate to projects section
      this.navigateToProjects();

      // Update URL
      this.updateURL();
    }

    addFilter(tagOrSkill) {
      // Check if it's a skill or tag
      const tags = window.SkillProjectMap.getTagsForSkill(tagOrSkill);

      if (tags.length > 0) {
        // It's a skill, add all its tags
        tags.forEach(tag => this.activeFilters.add(tag));
      } else {
        // It's a tag, add directly
        this.activeFilters.add(tagOrSkill);
      }

      this.applyFilters();
      this.updateURL();
    }

    removeFilter(tag) {
      this.activeFilters.delete(tag);
      this.applyFilters();
      this.updateURL();
    }

    clearFilters() {
      this.activeFilters.clear();
      this.applyFilters();
      this.updateURL();
    }

    toggleMode() {
      this.filterMode = this.filterMode === 'OR' ? 'AND' : 'OR';
      document.getElementById('filter-mode-label').textContent = this.filterMode;
      this.applyFilters();
      this.updateURL();
    }

    // ============================================
    // FILTER APPLICATION
    // ============================================
    applyFilters() {
      console.log('[FilterSystem] Applying filters:', Array.from(this.activeFilters), 'Mode:', this.filterMode);

      // If no filters, show all
      if (this.activeFilters.size === 0) {
        this.showAllProjects();
        this.hideFilterBar();
        return;
      }

      // Show filter bar
      this.showFilterBar();

      // Update filter bar UI
      this.updateFilterBarTags();

      // Filter projects
      this.matchingProjects = 0;
      const activeTags = Array.from(this.activeFilters);

      this.projectCards.forEach(card => {
        const projectTags = this.getProjectTags(card);
        const matches = this.filterMode === 'OR'
          ? activeTags.some(tag => projectTags.includes(tag))
          : activeTags.every(tag => projectTags.includes(tag));

        if (matches) {
          this.showProject(card);
          this.matchingProjects++;
        } else {
          this.hideProject(card);
        }
      });

      // Update count
      this.updateFilterCount();

      // Update skill tag states
      this.updateSkillTagStates();
    }

    getProjectTags(card) {
      const tagElements = card.querySelectorAll('.tag');
      return Array.from(tagElements).map(el =>
        el.textContent.trim().replace(/[\[\]]/g, '')
      );
    }

    showProject(card) {
      card.classList.remove('filtered-out');
      card.classList.add('filtered-in');
    }

    hideProject(card) {
      card.classList.remove('filtered-in');
      card.classList.add('filtered-out');
    }

    showAllProjects() {
      this.projectCards.forEach(card => {
        card.classList.remove('filtered-out', 'filtered-in');
      });
      this.matchingProjects = this.totalProjects;
    }

    // ============================================
    // UI UPDATES
    // ============================================
    showFilterBar() {
      if (this.filterBar) {
        this.filterBar.style.display = 'block';
        // Trigger animation
        setTimeout(() => {
          this.filterBar.classList.add('filter-bar-visible');
        }, 10);
      }
    }

    hideFilterBar() {
      if (this.filterBar) {
        this.filterBar.classList.remove('filter-bar-visible');
        setTimeout(() => {
          this.filterBar.style.display = 'none';
        }, 300);
      }
    }

    updateFilterBarTags() {
      const container = document.getElementById('filter-tags-container');
      if (!container) return;

      container.innerHTML = '';

      this.activeFilters.forEach(tag => {
        const tagEl = document.createElement('span');
        tagEl.className = 'filter-tag';
        tagEl.innerHTML = `
          <span class="filter-tag-label">[${tag}]</span>
          <button class="filter-tag-remove" data-tag="${tag}" title="Remove filter">×</button>
        `;

        tagEl.querySelector('.filter-tag-remove').addEventListener('click', () => {
          this.removeFilter(tag);
        });

        container.appendChild(tagEl);
      });
    }

    updateFilterCount() {
      const countEl = document.getElementById('filter-count');
      if (!countEl) return;

      if (this.activeFilters.size === 0) {
        countEl.textContent = 'Showing all projects';
      } else {
        countEl.textContent = `Showing ${this.matchingProjects} of ${this.totalProjects} projects`;
      }
    }

    updateSkillTagStates() {
      // Highlight active skills
      this.skillTags.forEach(el => {
        const skillName = el.getAttribute('data-skill');
        const tags = window.SkillProjectMap.getTagsForSkill(skillName);

        // Check if any of this skill's tags are active
        const isActive = tags.some(tag => this.activeFilters.has(tag));

        if (isActive) {
          el.classList.add('skill-active');
        } else {
          el.classList.remove('skill-active');
        }
      });
    }

    // ============================================
    // NAVIGATION
    // ============================================
    navigateToProjects() {
      // Find projects section
      const projectsSection = document.getElementById('section-projects');
      if (!projectsSection) return;

      // Activate projects section
      if (window.terminal && window.terminal.switchSection) {
        window.terminal.switchSection('projects');
      } else {
        // Fallback: manual section switching
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        projectsSection.classList.add('active');

        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        const projectsNav = document.querySelector('[data-section="projects"]');
        if (projectsNav) projectsNav.classList.add('active');
      }

      // Smooth scroll to projects section
      setTimeout(() => {
        projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }

    // ============================================
    // URL STATE MANAGEMENT
    // ============================================
    updateURL() {
      const params = new URLSearchParams();

      if (this.activeFilters.size > 0) {
        const tagsArray = Array.from(this.activeFilters);
        params.set('filter', tagsArray.join(','));
      }

      if (this.filterMode === 'AND' && this.activeFilters.size > 0) {
        params.set('mode', 'and');
      }

      const newURL = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;

      window.history.pushState({ filters: Array.from(this.activeFilters), mode: this.filterMode }, '', newURL);
    }

    restoreFromURL() {
      const params = new URLSearchParams(window.location.search);
      const filterParam = params.get('filter');
      const modeParam = params.get('mode');

      if (filterParam) {
        // Parse filters
        const tags = filterParam.split(',').map(t => t.trim()).filter(t => t);
        this.activeFilters = new Set(tags);

        // Parse mode
        if (modeParam && modeParam.toLowerCase() === 'and') {
          this.filterMode = 'AND';
        } else {
          this.filterMode = 'OR';
        }

        // Apply filters
        this.applyFilters();

        // Navigate to projects
        this.navigateToProjects();
      } else {
        this.clearFilters();
      }
    }

    // ============================================
    // PUBLIC API
    // ============================================
    getActiveFilters() {
      return Array.from(this.activeFilters);
    }

    getFilterMode() {
      return this.filterMode;
    }

    getMatchingProjectCount() {
      return this.matchingProjects;
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  const filterSystem = new FilterSystem();

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => filterSystem.init(), 500);
    });
  } else {
    setTimeout(() => filterSystem.init(), 500);
  }

  // Export to global scope
  window.FilterSystem = filterSystem;

  console.log('[FilterSystem] Module loaded');

})();
