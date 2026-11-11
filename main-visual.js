const topics = [
  {
    id: 'celulosa-bacteriana', number: '01', name: 'Celulosa bacteriana', tone: '#658d76',
    steps: [
      ['Residuos de té usado', 'Secamos el té usado y lo usamos en la kombucha.'],
      ['Kombucha', 'La kombucha es un líquido fermentado. Mezclamos un líquido que tiene bacterias y levadura con azúcar, té y agua. Los microorganismos fermentan el té y el azúcar, creando celulosa bacteriana en el proceso.'],
      ['Celulosa bacteriana', 'La celulosa bacteriana es un material liso y resbaladizo antes de secarse. Después de secarla, y dependiendo del método, toma la forma de papel o de una muestra de cuero.'],
      ['Lámpara, máscara, paneles acústicos', 'La celulosa bacteriana seca puede servir para muchas aplicaciones diferentes, como textiles y paneles acústicos.']
    ]
  },
  {
    id: 'bioplasticos', number: '02', name: 'Bioplásticos', tone: '#b28e55',
    steps: [
      ['Cáscaras de naranja, granada y guisantes', 'Secamos las cáscaras para poder usarlas en los biomateriales. Después, las cáscaras se mezclan con agentes aglutinantes.'],
      ['Bioplásticos', 'Materiales flexibles con texturas lisas o ásperas, dependiendo del tipo de cáscara que se haya usado.'],
      ['Máscaras, textiles', 'Los bioplásticos pueden tomar muchas formas según el molde y el tratamiento.']
    ]
  },
  {
    id: 'bioceramica', number: '03', name: 'Biocerámica', tone: '#4f9288',
    steps: [
      ['Cáscaras de huevo y mejillón', 'Las cáscaras de huevo y de mejillón reciben un tratamiento en el que se trituran para usarlas en los biomateriales.'],
      ['Biocerámica', 'Mezclamos las cáscaras trituradas con otros ingredientes para hacer la biocerámica.'],
      ['Gafas, tótems, baldosas', 'Con una impresora 3D, se pueden fabricar varios productos con la biocerámica.']
    ]
  },
  {
    id: 'micelio', number: '04', name: 'Micelio', tone: '#977996',
    steps: [
      ['Residuos orgánicos', 'Residuos como café, papel y arroz son sustratos perfectos para hacer crecer el micelio.'],
      ['Micelio crecido', 'Los hongos pueden crecer en los residuos orgánicos, creando un material ligero pero con mucho volumen.'],
      ['Embalaje, paneles acústicos, textiles', 'El micelio se puede usar para embalaje, paneles acústicos, textiles y mucho más.']
    ]
  }
];

const homeView = document.getElementById('homeView');
const processView = document.getElementById('processView');
const homeButton = document.getElementById('homeButton');
const orbitStage = document.getElementById('orbitStage');
const topicCircles = document.getElementById('topicCircles');
const processStage = document.getElementById('processStage');
const processNodes = document.getElementById('processNodes');
const processArrows = document.getElementById('processArrows');
const processFrame = document.getElementById('processFrame');
const projectCards = document.getElementById('projectCards');
let activeTopic = null;
let activeNodes = [];

const bioplasticProjects = [
  {
    title: 'Biomáscaras',
    subtitle: 'Diseño y cultura en Chamberí',
    description: 'Un proyecto participativo de diseño y cultura en el barrio Chamberí usando residuos de negocios locales.',
    people: 'Hechas por personas mayores y niños.',
    result: '57 máscaras creadas.',
    image: 'c4b6f8db-3ce8-46d9-8248-cfbc14356fb8.jpg',
    video: null
  },
  {
    title: 'Mantón Collectivo',
    subtitle: 'El Rincón del Brote',
    description: 'Un mantón con flores y flecos hechos a partir de los biomateriales.',
    people: 'Hecho en colaboración con Centro de Día Casa de las Flores.',
    result: '',
    image: 'IMG_8275.JPEG',
    video: 'https://www.youtube.com/shorts/czNZ8aRe5N0'
  }
];

topics.forEach((topic, index) => {
  const circle = document.createElement('button');
  circle.type = 'button';
  circle.className = 'topic-circle';
  if (topic.id === 'celulosa-bacteriana') circle.classList.add('topic-celulosa');
  if (topic.id === 'bioplasticos') circle.classList.add('topic-bioplasticos');
  if (topic.id === 'bioceramica') circle.classList.add('topic-bioceramica');
  if (topic.id === 'micelio') circle.classList.add('topic-micelio');
  circle.setAttribute('aria-label', `Círculo ${index + 1}: ${topic.name}. Abrir proceso`);
  circle.innerHTML = '<span class="topic-name"></span><span class="topic-open">EXPLORAR PROCESO</span>';
  circle.querySelector('.topic-name').textContent = topic.name;
  circle.addEventListener('click', () => openTopic(topic));
  topicCircles.appendChild(circle);
});

function positionHomeCircles() {
  const width = orbitStage.clientWidth;
  const height = orbitStage.clientHeight;
  const circleSize = width <= 620 ? 112 : width <= 900 ? 160 : 176;
  const rx = Math.min(width * .36, 388);
  const ry = Math.max(0, Math.min(height * .36, height / 2 - circleSize / 2 - 7, 222));
  const coordinates = [[width / 2, height / 2 - ry], [width / 2 + rx, height / 2], [width / 2, height / 2 + ry], [width / 2 - rx, height / 2]];
  [...topicCircles.children].forEach((circle, index) => {
    circle.style.left = `${coordinates[index][0] / width * 100}%`;
    circle.style.top = `${coordinates[index][1] / height * 100}%`;
  });
}

function showHome(updateHash = true) {
  activeTopic = null;
  homeView.hidden = false;
  processView.hidden = true;
  homeView.classList.add('is-active');
  processView.classList.remove('is-active');
  homeButton.hidden = true;
  if (updateHash && location.hash) history.pushState(null, '', `${location.pathname}${location.search}`);
}

function openTopic(topic, updateHash = true) {
  activeTopic = topic;
  homeView.hidden = true;
  processView.hidden = false;
  homeView.classList.remove('is-active');
  processView.classList.add('is-active');
  homeButton.hidden = false;
  document.getElementById('processKicker').textContent = `CÍRCULO ${topic.number} · CICLO DE MATERIALES`;
  document.getElementById('processTitle').textContent = topic.name;
  processStage.style.setProperty('--accent', topic.tone);
  processFrame.classList.toggle('has-projects', topic.id === 'bioplasticos' && Boolean(projectCards));
  renderSteps(topic);
  renderProjectCards(topic);
  if (updateHash) location.hash = topic.id;
  requestAnimationFrame(() => {
    positionSteps();
    drawArrows();
  });
}

function renderProjectCards(topic) {
  if (!projectCards) return;
  projectCards.replaceChildren();
  if (topic.id !== 'bioplasticos') {
    projectCards.hidden = true;
    return;
  }
  projectCards.hidden = false;
  bioplasticProjects.forEach(project => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.style.backgroundImage = `linear-gradient(155deg,rgba(25,35,28,.25),rgba(25,35,28,.83)),url("${project.image}")`;
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'project-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    const kicker = document.createElement('span');
    kicker.className = 'project-kicker';
    kicker.textContent = 'PROYECTO';
    const title = document.createElement('span');
    title.className = 'project-title';
    title.textContent = project.title;
    const subtitle = document.createElement('span');
    subtitle.className = 'project-subtitle';
    subtitle.textContent = project.subtitle;
    const affordance = document.createElement('span');
    affordance.className = 'project-affordance';
    affordance.textContent = '＋';
    toggle.append(kicker, title, subtitle, affordance);
    const details = document.createElement('div');
    details.className = 'project-details';
    const description = document.createElement('p');
    description.textContent = project.description;
    const people = document.createElement('p');
    people.innerHTML = `<strong>Participantes</strong> ${project.people}`;
    details.append(description, people);
    if (project.result) {
      const result = document.createElement('p');
      result.innerHTML = `<strong>Resultado</strong> ${project.result}`;
      details.append(result);
    }
    if (project.video) {
      const link = document.createElement('a');
      link.className = 'project-video';
      link.href = project.video;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = '▶ Ver video';
      details.append(link);
    } else {
      const pending = document.createElement('span');
      pending.className = 'project-video pending';
      pending.textContent = 'Video por añadir';
      details.append(pending);
    }
    toggle.addEventListener('click', () => {
      const expanded = card.classList.toggle('expanded');
      toggle.setAttribute('aria-expanded', String(expanded));
      details.hidden = !expanded;
      affordance.textContent = expanded ? '−' : '＋';
      window.setTimeout(positionSteps, 260);
    });
    details.hidden = true;
    card.append(toggle, details);
    projectCards.appendChild(card);
  });
}

function renderSteps(topic) {
  processNodes.replaceChildren();
  processArrows.innerHTML = `<defs><marker id="cycle-arrow" markerWidth="10" markerHeight="10" refX="7.5" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1 L7.5 5 L1 9" fill="none" stroke="${topic.tone}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></marker></defs>`;
  activeNodes = topic.steps.map(([title, description], index) => {
    const node = document.createElement('button');
    node.type = 'button';
    node.className = 'process-node';
    if (topic.id === 'celulosa-bacteriana' && index === 2) node.classList.add('step-cellulose-photo');
    if (topic.id === 'bioplasticos' && index === 0) node.classList.add('step-cascara-photo');
    if (topic.id === 'bioplasticos' && index === 1) node.classList.add('step-bioplasticos-photo');
    if (topic.id === 'bioplasticos' && index === 2) node.classList.add('step-mascaras-photo');
    if (topic.id === 'bioceramica' && index === 0) node.classList.add('step-eggshells-photo');
    if (topic.id === 'bioceramica' && index === 1) node.classList.add('step-bioceramica-photo');
    if (topic.id === 'micelio' && index === 0) node.classList.add('step-rice-photo');
    if (topic.id === 'micelio' && index === 1) node.classList.add('step-micelio-photo');
    node.style.setProperty('--tone-fill', `${topic.tone}16`);
    node.style.setProperty('--tone-border', `${topic.tone}55`);
    node.style.setProperty('--tone-text', topic.tone);
    node.setAttribute('aria-expanded', 'false');
    node.setAttribute('aria-label', `${title}. Mostrar descripción`);
    const number = document.createElement('span');
    number.className = 'step-index';
    number.textContent = String(index + 1).padStart(2, '0');
    const heading = document.createElement('span');
    heading.className = 'step-title';
    heading.textContent = title;
    const hint = document.createElement('span');
    hint.className = 'step-hint';
    hint.textContent = 'TOCA PARA LEER';
    const text = document.createElement('span');
    text.className = 'step-description';
    text.textContent = description;
    node.append(number, heading, hint, text);
    node.addEventListener('click', () => {
      const shouldExpand = !node.classList.contains('expanded');
      activeNodes.forEach(other => {
        other.classList.remove('expanded');
        other.setAttribute('aria-expanded', 'false');
      });
      positionSteps();
      if (shouldExpand) {
        node.classList.add('expanded');
        node.setAttribute('aria-expanded', 'true');
        requestAnimationFrame(() => {
          const margin = 9;
          const halfWidth = node.offsetWidth / 2;
          const halfHeight = node.offsetHeight / 2;
          const x = Math.max(halfWidth + margin, Math.min(processStage.clientWidth - halfWidth - margin, parseFloat(node.style.left)));
          const y = Math.max(halfHeight + margin, Math.min(processStage.clientHeight - halfHeight - margin, parseFloat(node.style.top)));
          node.style.left = `${x}px`;
          node.style.top = `${y}px`;
          window.setTimeout(drawArrows, 260);
        });
      } else {
        window.setTimeout(positionSteps, 260);
      }
    });
    processNodes.appendChild(node);
    return node;
  });
}

function positionSteps() {
  if (!activeNodes.length) return;
  const width = processStage.clientWidth;
  const height = processStage.clientHeight;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.max(0, Math.min(width * .34, (height - 220) / 2, (width - 300) / 2, 355));
  const count = activeNodes.length;
  activeNodes.forEach((node, index) => {
    const angle = (-90 + index * 360 / count) * Math.PI / 180;
    node.style.left = `${cx + radius * Math.cos(angle)}px`;
    node.style.top = `${cy + radius * Math.sin(angle)}px`;
  });
  drawArrows();
}

function drawArrows() {
  if (!activeNodes.length || processView.hidden) return;
  const stageRect = processStage.getBoundingClientRect();
  const cx = processStage.clientWidth / 2;
  const cy = processStage.clientHeight / 2;
  const count = activeNodes.length;
  processArrows.querySelectorAll('.process-edge').forEach(path => path.remove());
  const reverseCycle = activeTopic.id === 'celulosa-bacteriana';
  for (let i = 0; i < count; i += 1) {
    const sourceIndex = reverseCycle ? (i + 1) % count : i;
    const targetIndex = reverseCycle ? i : (i + 1) % count;
    const source = activeNodes[sourceIndex].getBoundingClientRect();
    const target = activeNodes[targetIndex].getBoundingClientRect();
    const sx = source.left + source.width / 2 - stageRect.left;
    const sy = source.top + source.height / 2 - stageRect.top;
    const tx = target.left + target.width / 2 - stageRect.left;
    const ty = target.top + target.height / 2 - stageRect.top;
    const dx = tx - sx;
    const dy = ty - sy;
    const length = Math.hypot(dx, dy) || 1;
    const ux = dx / length;
    const uy = dy / length;
    const sourceInset = activeNodes[sourceIndex].classList.contains('expanded')
      ? Math.min((source.width / 2) / Math.max(Math.abs(ux), .01), (source.height / 2) / Math.max(Math.abs(uy), .01))
      : Math.min(source.width, source.height) / 2;
    const targetInset = activeNodes[targetIndex].classList.contains('expanded')
      ? Math.min((target.width / 2) / Math.max(Math.abs(ux), .01), (target.height / 2) / Math.max(Math.abs(uy), .01))
      : Math.min(target.width, target.height) / 2;
    const x1 = sx + ux * (sourceInset + 3);
    const y1 = sy + uy * (sourceInset + 3);
    const x2 = tx - ux * (targetInset + 5);
    const y2 = ty - uy * (targetInset + 5);
    const midAngle = (-90 + (i + .5) * 360 / count) * Math.PI / 180;
    const bow = Math.min(22, length * .07);
    const controlX = (x1 + x2) / 2 + Math.cos(midAngle) * bow;
    const controlY = (y1 + y2) / 2 + Math.sin(midAngle) * bow;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'process-edge');
    path.setAttribute('d', `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`);
    path.setAttribute('marker-end', 'url(#cycle-arrow)');
    path.setAttribute('stroke', activeTopic.tone);
    processArrows.appendChild(path);
  }
}

document.getElementById('backButton').addEventListener('click', () => showHome());
homeButton.addEventListener('click', () => showHome());
document.querySelectorAll('.definition-circle').forEach(circle => {
  circle.addEventListener('click', () => {
    const expanded = circle.classList.toggle('expanded');
    circle.setAttribute('aria-expanded', String(expanded));
  });
});
const kitToggle = document.querySelector('.kit-toggle');
const kitDetails = document.getElementById('kitDetails');
kitToggle.addEventListener('click', () => {
  const expanded = kitToggle.getAttribute('aria-expanded') !== 'true';
  kitToggle.setAttribute('aria-expanded', String(expanded));
  kitDetails.hidden = !expanded;
  kitToggle.querySelector('.kit-expand-mark').textContent = expanded ? '−' : '＋';
});
document.getElementById('nextCircle').addEventListener('click', () => {
  const index = topics.findIndex(topic => topic.id === activeTopic?.id);
  openTopic(topics[(index + 1) % topics.length]);
});

function loadHash() {
  const topic = topics.find(candidate => candidate.id === location.hash.slice(1));
  if (topic) openTopic(topic, false);
  else showHome(false);
}
window.addEventListener('hashchange', loadHash);
window.addEventListener('resize', positionSteps);
window.addEventListener('resize', positionHomeCircles);
if ('ResizeObserver' in window) new ResizeObserver(() => {
  if (activeTopic) positionSteps();
}).observe(processStage);
positionHomeCircles();
loadHash();
