// ─────────────────────────────────────────────
//  HUD — Interfaz mínima de navegación
//  Sin frameworks. DOM puro.
// ─────────────────────────────────────────────

const SLIDE_LABELS = {
  es: [
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
  ],
  pt: [
    { num: '01', title: 'Revezamento geracional', sub: 'A vantagem que ninguém está aproveitando' },
    { num: '02', title: 'Um grande auditório…', sub: '…apenas para formaturas?' },
    { num: '03', title: 'A Universidade se encontra com o mundo', sub: 'Encontrar o que já existe' },
    { num: '04', title: 'Academia · Indústria · Cidade', sub: 'Três forças, um espaço comum' },
    { num: '05', title: 'Os eventos nunca foram o objetivo', sub: 'O impacto, sim' },
    { num: '06', title: 'Um evento traz pessoas', sub: 'Uma comunidade traz transformação' },
    { num: '07', title: 'O talento cresce na velocidade da confiança', sub: 'Uma perturbação se transmite' },
    { num: '08', title: 'A experiência constrói o caminho', sub: 'Novas gerações descobrem novas rotas' },
    { num: '09', title: 'Uma visão. Duas gerações.', sub: 'Velocidades diferentes, um mesmo horizonte' },
    { num: '10', title: 'Crescer é trabalhar juntos', sub: 'Nenhuma geração desaparece' },
    { num: '11', title: 'Os jovens não são o futuro', sub: 'São o presente que transforma o campo' },
    { num: '12', title: 'O futuro não se herda', sub: 'Ele se constrói' },
    { num: '13', title: 'O que continua em movimento', sub: 'Uma forma aberta para continuar' },
    { num: '14', title: 'A memória também se move', sub: 'Imagens, vínculos e continuidade' },
  ],
};

let _counter, _title, _sub, _prevBtn, _nextBtn, _dotsContainer;
let _onPrev, _onNext, _onLanguageChange;
let _language = 'es';

export function initHUD(onPrev, onNext, onLanguageChange) {
  _onPrev = onPrev;
  _onNext = onNext;
  _onLanguageChange = onLanguageChange;

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
  SLIDE_LABELS.es.forEach((_, i) => {
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

  const language = document.createElement('div');
  language.id = 'hud-language';
  language.setAttribute('aria-label', 'Idioma');
  ['es', 'pt'].forEach((code) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.language = code;
    button.textContent = code.toUpperCase();
    button.addEventListener('click', () => {
      _language = code;
      _onLanguageChange?.(code);
      updateHUD(Number(_counter.textContent.slice(0, 2)) - 1);
    });
    language.appendChild(button);
  });
  hud.appendChild(language);

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
  const labels = SLIDE_LABELS[_language] || SLIDE_LABELS.es;
  const label = labels[slideIndex] || labels[0];

  const topBar = _title.parentElement;
  topBar.classList.remove('is-changing');
  void topBar.offsetWidth;
  _counter.textContent = label.num + ' / ' + String(labels.length).padStart(2, '0');
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
  _nextBtn.disabled = slideIndex === labels.length - 1;
  document.querySelectorAll('#hud-language button').forEach((button) => {
    button.classList.toggle('active', button.dataset.language === _language);
  });
}