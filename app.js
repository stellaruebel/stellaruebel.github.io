const diagram = document.getElementById('diagram');
const svg = document.getElementById('connections');
const items = [...diagram.querySelectorAll('.item')];
const edges = [
  { from: 'tienda', to: 'kombucha', label: 'té verde usado' },
  { from: 'kombucha', to: 'celulosa', label: 'fermentación' },
  { from: 'en-bruto', to: 'celulosa', label: 'SCOBY' },
  { from: 'celulosa', to: 'lampara', label: 'material' }
];

svg.innerHTML = '<defs><marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1 L6 4 L1 7" fill="none" stroke="#8da28a" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></marker></defs>';

function drawConnections() {
  const diagramRect = diagram.getBoundingClientRect();
  if (!diagramRect.width) return;
  svg.querySelectorAll('.edge, .edge-label').forEach(element => element.remove());

  for (const edge of edges) {
    const from = diagram.querySelector(`[data-id="${edge.from}"]`).getBoundingClientRect();
    const to = diagram.querySelector(`[data-id="${edge.to}"]`).getBoundingClientRect();
    const x1 = from.right - diagramRect.left;
    const y1 = from.top + from.height / 2 - diagramRect.top;
    const x2 = to.left - diagramRect.left;
    const y2 = to.top + to.height / 2 - diagramRect.top;
    const reach = Math.max(50, (x2 - x1) * .42);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${x1} ${y1} C ${x1 + reach} ${y1}, ${x2 - reach} ${y2}, ${x2 - 4} ${y2}`);
    path.setAttribute('class', 'edge');
    path.setAttribute('marker-end', 'url(#arrowhead)');
    svg.appendChild(path);
  }
}

function toggleItem(item) {
  const willExpand = !item.classList.contains('expanded');
  items.forEach(candidate => {
    candidate.classList.remove('expanded');
    candidate.setAttribute('aria-expanded', 'false');
    candidate.querySelector('.expand-mark').textContent = '＋';
  });
  if (willExpand) {
    item.classList.add('expanded');
    item.setAttribute('aria-expanded', 'true');
    item.querySelector('.expand-mark').textContent = '＋';
  }
  window.setTimeout(drawConnections, 230);
}

items.forEach(item => {
  item.addEventListener('click', () => toggleItem(item));
  item.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleItem(item);
    }
  });
});

document.getElementById('resetView').addEventListener('click', () => {
  items.forEach(item => {
    item.classList.remove('expanded');
    item.setAttribute('aria-expanded', 'false');
    item.querySelector('.expand-mark').textContent = '＋';
  });
  window.setTimeout(drawConnections, 230);
  document.getElementById('diagramViewport').scrollTo({ left: 0, top: 0, behavior: 'smooth' });
});

window.addEventListener('resize', drawConnections);
window.addEventListener('load', drawConnections);
diagram.querySelectorAll('img').forEach(image => image.addEventListener('load', drawConnections));
if ('ResizeObserver' in window) new ResizeObserver(drawConnections).observe(diagram);
requestAnimationFrame(drawConnections);
