// ─────────────────────────────────────────────
//  HUD — Interfaz mínima de navegación
//  Sin frameworks. DOM puro.
// ─────────────────────────────────────────────

const SLIDE_LABELS = [
  { num: '01', title: 'Relevo generacional', sub: 'La ventaja que nadie está aprovechando' },
  { num: '02', title: '¿Un gran auditorio…', sub: '…solo para hacer grados?' },
  { num: '03', title: 'La universidad sale al mundo', sub: 'Encontrarse con lo que ya existe' },
  { num: '04', title: 'Academia · Industria · Ciudad', sub: 'Tres naturalezas, un centro vacío' },
  { num: '05', title: 'Los eventos nunca fueron el objetivo', sub: 'El impacto sí' },
  { num: '06', title: 'Un evento trae personas', sub: 'Una comunidad trae transformación' },
  { num: '07', title: 'El talento crece a la velocidad de la confianza', sub: 'Una perturbación se transmite' },
  { num: '08', title: 'La experiencia construye el camino', sub: 'Las nuevas generaciones descubren rutas' },
  { num: '09', title: 'Una visión. Dos generaciones.', sub: 'Diferentes velocidades, un mismo horizonte' },
  { num: '10', title: 'Crecer es trabajar juntos', sub: 'Ninguna generación desaparece' },
  { num: '11', title: 'Los jóvenes no son el futuro', sub: 'Son el presente que modifica el campo' },
  { num: '12', title: 'El futuro no se hereda', sub: 'Se construye' },
  { num: '13', title: 'Lo que queda en movimiento', sub: 'Una forma abierta para continuar' },
  { num: '14', title: 'La memoria también se mueve', sub: 'Imágenes, vínculos y continuidad' },
];

let _counter, _title, _sub, _prevBtn, _nextBtn, _dotsContainer;
let _onPrev, _onNext;

export function initHUD(onPrev, onNext) {
  _onPrev = onPrev;
  _onNext = onNext;

  // Contenedor principal del HUD
  const hud = document.createElement('div');
  hud.id = 'hud';

  // Contador + título
  const topBar = document.createElement('div');
  topBar.id = 'hud-top';

  _counter = document.createElement('span');
  _counter.id = 'hud-counter';

  _title = document.createElement('h2');
  _title.id = 'hud-title';

  _sub = document.createElement('p');
  _sub.id = 'hud-sub';

  topBar.appendChild(_counter);
  topBar.appendChild(_title);
  topBar.appendChild(_sub);
  hud.appendChild(topBar);

  // Dots de navegación
  _dotsContainer = document.createElement('div');
  _dotsContainer.id = 'hud-dots';
  SLIDE_LABELS.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hud-dot';
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => {
      // Dispatch custom event para que main.js lo capture
      document.dispatchEvent(new CustomEvent('hud:goto', { detail: i }));
    });
    _dotsContainer.appendChild(dot);
  });
  hud.appendChild(_dotsContainer);

  // Botones prev / next
  const nav = document.createElement('div');
  nav.id = 'hud-nav';

  _prevBtn = document.createElement('button');
  _prevBtn.id = 'hud-prev';
  _prevBtn.textContent = '←';
  _prevBtn.addEventListener('click', _onPrev);

  _nextBtn = document.createElement('button');
  _nextBtn.id = 'hud-next';
  _nextBtn.textContent = '→';
  _nextBtn.addEventListener('click', _onNext);

  nav.appendChild(_prevBtn);
  nav.appendChild(_nextBtn);
  hud.appendChild(nav);

  // Hint de teclado (desaparece tras 4s)
  const hint = document.createElement('div');
  hint.id = 'hud-hint';
  hint.textContent = '← → para navegar · F pantalla completa';
  hud.appendChild(hint);
  setTimeout(() => { hint.style.opacity = '0'; }, 4000);

  document.body.appendChild(hud);
  updateHUD(0);
}

export function updateHUD(slideIndex) {
  const label = SLIDE_LABELS[slideIndex] || SLIDE_LABELS[0];

  const topBar = _title.parentElement;
  topBar.classList.remove('is-changing');
  void topBar.offsetWidth;
  _counter.textContent = label.num + ' / ' + String(SLIDE_LABELS.length).padStart(2, '0');
  _title.textContent   = label.title;
  _sub.textContent     = label.sub;
  topBar.classList.add('is-changing');

  // Actualizar dots
  const dots = _dotsContainer.querySelectorAll('.hud-dot');
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === slideIndex);
  });

  // Deshabilitar botones en extremos
  _prevBtn.disabled = slideIndex === 0;
  _nextBtn.disabled = slideIndex === SLIDE_LABELS.length - 1;
}