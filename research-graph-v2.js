/**
 * Research Graph v2 - Lab Aesthetic
 *
 * Redesigned for:
 * - Minimal nodes (title only, details on interaction)
 * - Clean layout with no collisions
 * - Lab aesthetic (light, subtle, typographic)
 * - Smooth interactions
 */

class ResearchGraphV2 {
  constructor(containerId, data) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.data = data;
    this.selectedNode = null;
    this.hoveredNode = null;

    // Layout configuration
    this.config = {
      nodeWidth: 160,
      nodeHeight: 48,
      tierGap: 100,
      nodeGap: 16,
      padding: 80
    };

    this.init();
  }

  init() {
    this.container.innerHTML = '';
    this.container.classList.add('graph-v2');

    // Create layers
    this.createSVGLayer();
    this.createNodesLayer();
    this.createDetailPanel();

    // Calculate and apply layout
    this.calculateLayout();
    this.renderConnections();
    this.renderNodes();

    // Bind events
    this.bindEvents();
  }

  createSVGLayer() {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.classList.add('graph-v2__svg');
    this.container.appendChild(this.svg);
  }

  createNodesLayer() {
    this.nodesLayer = document.createElement('div');
    this.nodesLayer.classList.add('graph-v2__nodes');
    this.container.appendChild(this.nodesLayer);
  }

  createDetailPanel() {
    this.detailPanel = document.createElement('div');
    this.detailPanel.classList.add('graph-v2__detail');
    this.detailPanel.innerHTML = `
      <div class="detail__header">
        <span class="detail__type"></span>
        <button class="detail__close">&times;</button>
      </div>
      <h3 class="detail__title"></h3>
      <p class="detail__subtitle"></p>
      <p class="detail__description"></p>
      <div class="detail__tags"></div>
      <div class="detail__connections">
        <div class="detail__informs"></div>
        <div class="detail__informed-by"></div>
      </div>
    `;
    this.container.appendChild(this.detailPanel);

    // Close button
    this.detailPanel.querySelector('.detail__close').addEventListener('click', () => {
      this.deselectNode();
    });
  }

  calculateLayout() {
    // Group nodes by tier (based on y position ranges)
    const tiers = this.groupByTier();

    // Calculate container dimensions
    const maxNodesInTier = Math.max(...Object.values(tiers).map(t => t.length));
    const numTiers = Object.keys(tiers).length;

    const width = maxNodesInTier * (this.config.nodeWidth + this.config.nodeGap) + this.config.padding * 2;
    const height = numTiers * this.config.tierGap + this.config.padding * 2;

    // Set container size
    this.container.style.minHeight = `${Math.max(height, 500)}px`;
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    this.svg.style.width = '100%';
    this.svg.style.height = '100%';

    this.layoutWidth = width;
    this.layoutHeight = height;

    // Position nodes within tiers
    let tierIndex = 0;
    const tierOrder = ['theory-top', 'infrastructure', 'applications', 'methods', 'tools'];

    tierOrder.forEach(tierName => {
      const nodes = tiers[tierName] || [];
      const tierY = this.config.padding + tierIndex * this.config.tierGap;
      const tierWidth = nodes.length * (this.config.nodeWidth + this.config.nodeGap) - this.config.nodeGap;
      const startX = (width - tierWidth) / 2;

      nodes.forEach((node, nodeIndex) => {
        node.layoutX = startX + nodeIndex * (this.config.nodeWidth + this.config.nodeGap);
        node.layoutY = tierY;
      });

      if (nodes.length > 0) tierIndex++;
    });
  }

  groupByTier() {
    const tiers = {
      'theory-top': [],
      'infrastructure': [],
      'applications': [],
      'methods': [],
      'tools': []
    };

    this.data.nodes.forEach(node => {
      const y = node.position.y;
      if (y <= 150) tiers['theory-top'].push(node);
      else if (y <= 350) tiers['infrastructure'].push(node);
      else if (y <= 550) tiers['applications'].push(node);
      else if (y <= 750) tiers['methods'].push(node);
      else tiers['tools'].push(node);
    });

    return tiers;
  }

  renderNodes() {
    this.data.nodes.forEach(node => {
      const el = document.createElement('div');
      el.classList.add('graph-v2__node');
      el.dataset.id = node.id;
      el.dataset.type = node.type;

      // Get domain color
      const domain = this.data.domains.find(d => d.id === node.type);
      const color = domain ? domain.color : '#888';

      el.innerHTML = `
        <span class="node__indicator" style="background: ${color}"></span>
        <span class="node__title">${node.title}</span>
      `;

      // Position
      el.style.left = `${(node.layoutX / this.layoutWidth) * 100}%`;
      el.style.top = `${node.layoutY}px`;
      el.style.width = `${this.config.nodeWidth}px`;

      // Store reference
      node.element = el;

      this.nodesLayer.appendChild(el);
    });
  }

  renderConnections() {
    // Create a group for connections
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('graph-v2__connections');

    this.data.connections.forEach(conn => {
      const fromNode = this.data.nodes.find(n => n.id === conn.from);
      const toNode = this.data.nodes.find(n => n.id === conn.to);

      if (!fromNode || !toNode) return;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.classList.add('graph-v2__connection');
      path.dataset.from = conn.from;
      path.dataset.to = conn.to;

      // Calculate path
      const x1 = fromNode.layoutX + this.config.nodeWidth / 2;
      const y1 = fromNode.layoutY + this.config.nodeHeight;
      const x2 = toNode.layoutX + this.config.nodeWidth / 2;
      const y2 = toNode.layoutY;

      // Bezier curve
      const midY = (y1 + y2) / 2;
      const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
      path.setAttribute('d', d);

      // Store reference
      conn.element = path;

      g.appendChild(path);
    });

    this.svg.appendChild(g);
  }

  bindEvents() {
    // Node hover
    this.nodesLayer.addEventListener('mouseover', (e) => {
      const node = e.target.closest('.graph-v2__node');
      if (node) this.hoverNode(node.dataset.id);
    });

    this.nodesLayer.addEventListener('mouseout', (e) => {
      const node = e.target.closest('.graph-v2__node');
      if (node) this.unhoverNode();
    });

    // Node click
    this.nodesLayer.addEventListener('click', (e) => {
      const node = e.target.closest('.graph-v2__node');
      if (node) this.selectNode(node.dataset.id);
    });

    // Click outside to deselect
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container || e.target === this.nodesLayer || e.target === this.svg) {
        this.deselectNode();
      }
    });
  }

  hoverNode(nodeId) {
    this.hoveredNode = nodeId;

    // Dim unrelated nodes and connections
    this.data.nodes.forEach(node => {
      const isRelated = this.isNodeRelated(node.id, nodeId);
      node.element.classList.toggle('dimmed', !isRelated);
    });

    this.data.connections.forEach(conn => {
      const isRelated = conn.from === nodeId || conn.to === nodeId;
      conn.element.classList.toggle('dimmed', !isRelated);
      conn.element.classList.toggle('highlighted', isRelated);
    });
  }

  unhoverNode() {
    if (this.selectedNode) return; // Don't unhover if something is selected

    this.hoveredNode = null;

    this.data.nodes.forEach(node => {
      node.element.classList.remove('dimmed');
    });

    this.data.connections.forEach(conn => {
      conn.element.classList.remove('dimmed', 'highlighted');
    });
  }

  selectNode(nodeId) {
    this.selectedNode = nodeId;
    const node = this.data.nodes.find(n => n.id === nodeId);
    if (!node) return;

    // Update detail panel
    const domain = this.data.domains.find(d => d.id === node.type);

    this.detailPanel.querySelector('.detail__type').textContent = domain ? domain.name : node.type;
    this.detailPanel.querySelector('.detail__type').style.borderColor = domain ? domain.color : '#888';
    this.detailPanel.querySelector('.detail__title').textContent = node.title;
    this.detailPanel.querySelector('.detail__subtitle').textContent = node.subtitle;
    this.detailPanel.querySelector('.detail__description').textContent = node.description;

    // Tags
    const tagsEl = this.detailPanel.querySelector('.detail__tags');
    tagsEl.innerHTML = node.tags.map(tag => `<span class="detail__tag">${tag}</span>`).join('');

    // Connections
    const informsEl = this.detailPanel.querySelector('.detail__informs');
    const informedByEl = this.detailPanel.querySelector('.detail__informed-by');

    const informs = this.data.connections.filter(c => c.from === nodeId).map(c => {
      const target = this.data.nodes.find(n => n.id === c.to);
      return target ? `<span class="connection-link" data-id="${target.id}">${target.title}</span>` : '';
    }).join('');

    const informedBy = this.data.connections.filter(c => c.to === nodeId).map(c => {
      const source = this.data.nodes.find(n => n.id === c.from);
      return source ? `<span class="connection-link" data-id="${source.id}">${source.title}</span>` : '';
    }).join('');

    informsEl.innerHTML = informs ? `<span class="connection-label">Informs:</span> ${informs}` : '';
    informedByEl.innerHTML = informedBy ? `<span class="connection-label">Informed by:</span> ${informedBy}` : '';

    // Show panel
    this.detailPanel.classList.add('visible');

    // Highlight node
    this.data.nodes.forEach(n => {
      n.element.classList.toggle('selected', n.id === nodeId);
      n.element.classList.toggle('dimmed', !this.isNodeRelated(n.id, nodeId));
    });

    this.data.connections.forEach(conn => {
      const isRelated = conn.from === nodeId || conn.to === nodeId;
      conn.element.classList.toggle('dimmed', !isRelated);
      conn.element.classList.toggle('highlighted', isRelated);
    });

    // Connection link clicks
    this.detailPanel.querySelectorAll('.connection-link').forEach(link => {
      link.addEventListener('click', () => {
        this.selectNode(link.dataset.id);
      });
    });
  }

  deselectNode() {
    this.selectedNode = null;
    this.detailPanel.classList.remove('visible');

    this.data.nodes.forEach(node => {
      node.element.classList.remove('selected', 'dimmed');
    });

    this.data.connections.forEach(conn => {
      conn.element.classList.remove('dimmed', 'highlighted');
    });
  }

  isNodeRelated(nodeId, targetId) {
    if (nodeId === targetId) return true;

    return this.data.connections.some(conn =>
      (conn.from === targetId && conn.to === nodeId) ||
      (conn.to === targetId && conn.from === nodeId)
    );
  }
}
