// Research Graph Interactive Visualization
class ResearchGraph {
  constructor(containerId, data) {
    this.container = document.getElementById(containerId);
    this.data = data;
    this.selectedNode = null;
    this.hoveredNode = null;
    this.activeFilters = new Set();
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };

    this.init();
  }

  init() {
    this.createCanvas();
    this.createControls();
    this.createFilters();
    this.createLegend();
    this.renderNodes();
    this.renderConnections();
    this.attachEventListeners();
    this.centerGraph();
  }

  createCanvas() {
    this.canvas = document.createElement('div');
    this.canvas.className = 'graph-canvas';
    this.canvas.id = 'graph-canvas';

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.classList.add('graph-svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');

    // Create defs for arrow markers
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '10');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3, 0 6');
    polygon.classList.add('connection-arrow');

    marker.appendChild(polygon);
    defs.appendChild(marker);
    this.svg.appendChild(defs);

    this.canvas.appendChild(this.svg);
    this.container.appendChild(this.canvas);
  }

  createControls() {
    const controls = document.createElement('div');
    controls.className = 'graph-controls';
    controls.innerHTML = `
      <button class="graph-control-btn" id="graph-zoom-in" title="Zoom In">+</button>
      <button class="graph-control-btn" id="graph-zoom-out" title="Zoom Out">−</button>
      <button class="graph-control-btn" id="graph-reset" title="Reset View">⟲</button>
      <button class="graph-control-btn" id="graph-fit" title="Fit to Screen">⛶</button>
    `;
    this.container.appendChild(controls);
  }

  createFilters() {
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'graph-filters-toggle';
    toggleBtn.id = 'graph-filters-toggle';
    toggleBtn.innerHTML = '☰';
    toggleBtn.title = 'Toggle Domain Filters';
    this.container.appendChild(toggleBtn);

    // Create filters panel
    const filters = document.createElement('div');
    filters.className = 'graph-filters collapsed';
    filters.id = 'graph-filters';

    let html = '<div class="filter-title">DOMAINS</div>';

    this.data.domains.forEach(domain => {
      html += `
        <div class="filter-option" data-domain="${domain.id}">
          <div class="filter-checkbox"></div>
          <div class="filter-color" style="background: ${domain.color}"></div>
          <span>${domain.name}</span>
        </div>
      `;
    });

    filters.innerHTML = html;
    this.container.appendChild(filters);
  }

  createLegend() {
    const legend = document.createElement('div');
    legend.className = 'graph-legend';
    legend.innerHTML = `
      <div class="legend-title">CONNECTIONS</div>
      <div class="legend-item">
        <div class="legend-line"></div>
        <span>Technology Shared</span>
      </div>
      <div class="legend-item">
        <div class="legend-line" style="stroke-dasharray: 5,5"></div>
        <span>Motivates/Requires</span>
      </div>
      <div class="legend-item">
        <div class="legend-line" style="opacity: 0.5"></div>
        <span>Informs/Iteration</span>
      </div>
    `;
    this.container.appendChild(legend);
  }

  renderNodes() {
    this.data.nodes.forEach(node => {
      const nodeEl = document.createElement('div');
      nodeEl.className = 'graph-node';
      nodeEl.id = `node-${node.id}`;
      nodeEl.dataset.nodeId = node.id;
      nodeEl.dataset.type = node.type;

      const domain = this.data.domains.find(d => d.id === node.type);
      const iconColor = domain ? domain.color : 'var(--accent)';

      nodeEl.style.left = `${node.position.x}px`;
      nodeEl.style.top = `${node.position.y}px`;

      nodeEl.innerHTML = `
        <div class="node-status ${node.status}">${node.status.toUpperCase()}</div>
        <div class="node-header">
          <div class="node-icon" style="background: ${iconColor}">⚡</div>
          <div class="node-title-group">
            <div class="node-title">${node.title}</div>
            <div class="node-subtitle">${node.subtitle}</div>
          </div>
        </div>
        <div class="node-description">${node.description}</div>
        <div class="node-tags">
          ${node.tags.map(tag => `<span class="node-tag">[${tag}]</span>`).join('')}
        </div>
      `;

      this.canvas.appendChild(nodeEl);
    });
  }

  renderConnections() {
    const svgNS = 'http://www.w3.org/2000/svg';

    this.data.connections.forEach((conn, index) => {
      const fromNode = this.data.nodes.find(n => n.id === conn.from);
      const toNode = this.data.nodes.find(n => n.id === conn.to);

      if (!fromNode || !toNode) return;

      const fromEl = document.getElementById(`node-${conn.from}`);
      const toEl = document.getElementById(`node-${conn.to}`);

      if (!fromEl || !toEl) return;

      // Calculate center points
      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();
      const containerRect = this.canvas.getBoundingClientRect();

      const x1 = fromNode.position.x + (fromRect.width / 2);
      const y1 = fromNode.position.y + fromRect.height;
      const x2 = toNode.position.x + (toRect.width / 2);
      const y2 = toNode.position.y;

      // Create curved path
      const midY = (y1 + y2) / 2;
      const path = `M ${x1} ${y1} Q ${x1} ${midY}, ${(x1 + x2) / 2} ${midY} T ${x2} ${y2}`;

      const line = document.createElementNS(svgNS, 'path');
      line.setAttribute('d', path);
      line.classList.add('connection-line');
      line.dataset.from = conn.from;
      line.dataset.to = conn.to;
      line.dataset.type = conn.type;

      if (conn.type === 'motivates' || conn.type === 'requires') {
        line.style.strokeDasharray = '5,5';
      } else if (conn.type === 'informs' || conn.type === 'iteration') {
        line.style.opacity = '0.5';
      }

      line.setAttribute('marker-end', 'url(#arrowhead)');

      this.svg.appendChild(line);

      // Add label
      if (conn.label) {
        const label = document.createElementNS(svgNS, 'text');
        label.classList.add('connection-label');
        label.setAttribute('x', (x1 + x2) / 2);
        label.setAttribute('y', midY - 5);
        label.setAttribute('text-anchor', 'middle');
        label.textContent = conn.label;
        this.svg.appendChild(label);
      }
    });
  }

  attachEventListeners() {
    // Node clicks
    this.container.querySelectorAll('.graph-node').forEach(node => {
      node.addEventListener('click', (e) => this.handleNodeClick(e));
      node.addEventListener('mouseenter', (e) => this.handleNodeHover(e));
      node.addEventListener('mouseleave', () => this.handleNodeLeave());
    });

    // Connection clicks
    this.svg.querySelectorAll('.connection-line').forEach(line => {
      line.addEventListener('click', (e) => this.handleConnectionClick(e));
    });

    // Filter toggle button
    const toggleBtn = document.getElementById('graph-filters-toggle');
    const filtersPanel = document.getElementById('graph-filters');
    if (toggleBtn && filtersPanel) {
      toggleBtn.addEventListener('click', () => {
        filtersPanel.classList.toggle('collapsed');
        toggleBtn.classList.toggle('active');
      });
    }

    // Filter clicks
    this.container.querySelectorAll('.filter-option').forEach(option => {
      option.addEventListener('click', (e) => this.handleFilterClick(e));
    });

    // Control buttons
    document.getElementById('graph-zoom-in')?.addEventListener('click', () => this.zoomIn());
    document.getElementById('graph-zoom-out')?.addEventListener('click', () => this.zoomOut());
    document.getElementById('graph-reset')?.addEventListener('click', () => this.resetView());
    document.getElementById('graph-fit')?.addEventListener('click', () => this.fitToScreen());

    // Pan and drag
    this.canvas.addEventListener('mousedown', (e) => this.startDrag(e));
    this.canvas.addEventListener('mousemove', (e) => this.drag(e));
    this.canvas.addEventListener('mouseup', () => this.endDrag());
    this.canvas.addEventListener('mouseleave', () => this.endDrag());

    // Wheel zoom
    this.canvas.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
  }

  handleNodeClick(e) {
    const nodeId = e.currentTarget.dataset.nodeId;

    if (this.selectedNode === nodeId) {
      // Deselect
      this.selectedNode = null;
      this.clearHighlights();
    } else {
      // Select and highlight connections
      this.selectedNode = nodeId;
      this.highlightConnections(nodeId);
    }
  }

  handleNodeHover(e) {
    const nodeId = e.currentTarget.dataset.nodeId;
    this.hoveredNode = nodeId;

    if (!this.selectedNode) {
      this.highlightConnections(nodeId, true);
    }
  }

  handleNodeLeave() {
    this.hoveredNode = null;

    if (!this.selectedNode) {
      this.clearHighlights();
    }
  }

  handleConnectionClick(e) {
    const from = e.target.dataset.from;
    const to = e.target.dataset.to;

    // Highlight both connected nodes
    this.container.querySelectorAll('.graph-node').forEach(node => {
      const nodeId = node.dataset.nodeId;
      if (nodeId === from || nodeId === to) {
        node.classList.add('active');
      } else {
        node.classList.add('dimmed');
      }
    });

    e.target.classList.add('active');
  }

  handleFilterClick(e) {
    const option = e.currentTarget;
    const domain = option.dataset.domain;

    if (this.activeFilters.has(domain)) {
      this.activeFilters.delete(domain);
      option.classList.remove('active');
    } else {
      this.activeFilters.add(domain);
      option.classList.add('active');
    }

    this.applyFilters();
  }

  applyFilters() {
    if (this.activeFilters.size === 0) {
      // Show all
      this.container.querySelectorAll('.graph-node').forEach(node => {
        node.style.display = 'block';
      });
      this.svg.querySelectorAll('.connection-line, .connection-label').forEach(el => {
        el.style.display = 'block';
      });
    } else {
      // Filter nodes
      const visibleNodes = new Set();

      this.container.querySelectorAll('.graph-node').forEach(node => {
        const type = node.dataset.type;
        if (this.activeFilters.has(type)) {
          node.style.display = 'block';
          visibleNodes.add(node.dataset.nodeId);
        } else {
          node.style.display = 'none';
        }
      });

      // Filter connections (only show if both nodes visible)
      this.svg.querySelectorAll('.connection-line').forEach((line, index) => {
        const from = line.dataset.from;
        const to = line.dataset.to;
        const label = this.svg.querySelectorAll('.connection-label')[index];

        if (visibleNodes.has(from) && visibleNodes.has(to)) {
          line.style.display = 'block';
          if (label) label.style.display = 'block';
        } else {
          line.style.display = 'none';
          if (label) label.style.display = 'none';
        }
      });
    }
  }

  highlightConnections(nodeId, isHover = false) {
    const relatedNodes = new Set([nodeId]);
    const relatedConnections = new Set();

    // Find all connected nodes
    this.data.connections.forEach(conn => {
      if (conn.from === nodeId) {
        relatedNodes.add(conn.to);
        relatedConnections.add(`${conn.from}-${conn.to}`);
      }
      if (conn.to === nodeId) {
        relatedNodes.add(conn.from);
        relatedConnections.add(`${conn.from}-${conn.to}`);
      }
    });

    // Highlight nodes
    this.container.querySelectorAll('.graph-node').forEach(node => {
      const id = node.dataset.nodeId;
      if (relatedNodes.has(id)) {
        node.classList.add('active');
        node.classList.remove('dimmed');
      } else {
        node.classList.remove('active');
        node.classList.add('dimmed');
      }
    });

    // Highlight connections
    this.svg.querySelectorAll('.connection-line').forEach(line => {
      const from = line.dataset.from;
      const to = line.dataset.to;
      const key = `${from}-${to}`;

      if (relatedConnections.has(key)) {
        line.classList.add('active');
        line.classList.remove('dimmed');
      } else {
        line.classList.remove('active');
        line.classList.add('dimmed');
      }
    });
  }

  clearHighlights() {
    this.container.querySelectorAll('.graph-node').forEach(node => {
      node.classList.remove('active', 'dimmed');
    });

    this.svg.querySelectorAll('.connection-line').forEach(line => {
      line.classList.remove('active', 'dimmed');
    });
  }

  zoomIn() {
    this.scale = Math.min(this.scale * 1.2, 3);
    this.applyTransform();
  }

  zoomOut() {
    this.scale = Math.max(this.scale * 0.8, 0.3);
    this.applyTransform();
  }

  resetView() {
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.applyTransform();
  }

  fitToScreen() {
    // Calculate bounds of all nodes
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    this.data.nodes.forEach(node => {
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + 320); // approximate node width
      maxY = Math.max(maxY, node.position.y + 200); // approximate node height
    });

    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;
    const containerWidth = this.container.clientWidth;
    const containerHeight = this.container.clientHeight;

    const scaleX = containerWidth / (graphWidth + 100);
    const scaleY = containerHeight / (graphHeight + 100);
    this.scale = Math.min(scaleX, scaleY, 1);

    this.panX = (containerWidth - graphWidth * this.scale) / 2 - minX * this.scale;
    this.panY = 50;

    this.applyTransform();
  }

  centerGraph() {
    // Wait for DOM to fully render before fitting to screen
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.fitToScreen();
      });
    });
  }

  startDrag(e) {
    if (e.target.classList.contains('graph-node')) return;
    this.isDragging = true;
    this.dragStart = { x: e.clientX - this.panX, y: e.clientY - this.panY };
  }

  drag(e) {
    if (!this.isDragging) return;
    this.panX = e.clientX - this.dragStart.x;
    this.panY = e.clientY - this.dragStart.y;
    this.applyTransform();
  }

  endDrag() {
    this.isDragging = false;
  }

  handleWheel(e) {
    e.preventDefault();

    // Check if this is a pinch gesture (Ctrl+wheel or pinch on trackpad)
    if (e.ctrlKey || e.metaKey) {
      // Pinch-to-zoom
      const delta = e.deltaY;
      const zoomFactor = delta > 0 ? 0.95 : 1.05;
      const newScale = Math.min(Math.max(this.scale * zoomFactor, 0.3), 3);

      // Zoom towards cursor position
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate the point in graph space before zoom
      const graphX = (mouseX - this.panX) / this.scale;
      const graphY = (mouseY - this.panY) / this.scale;

      // Update scale
      this.scale = newScale;

      // Adjust pan to keep the point under cursor
      this.panX = mouseX - graphX * this.scale;
      this.panY = mouseY - graphY * this.scale;

      this.applyTransform();
    } else {
      // Two-finger scroll for panning
      const panSpeed = 1;
      this.panX -= e.deltaX * panSpeed;
      this.panY -= e.deltaY * panSpeed;
      this.applyTransform();
    }
  }

  applyTransform() {
    this.canvas.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
    this.canvas.style.transformOrigin = '0 0';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('research-graph-container')) {
    new ResearchGraph('research-graph-container', GRAPH_DATA);
  }
});
