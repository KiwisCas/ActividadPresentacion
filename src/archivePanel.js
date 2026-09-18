// ─────────────────────────────────────────────
//  ARCHIVE PANEL — Memoria visual y continuidad
// ─────────────────────────────────────────────

const ASSET_ROOT = './assets/forum/';

export function initArchivePanel() {
  const layer = document.createElement('section');
  layer.id = 'archive-layer';
  layer.setAttribute('aria-label', 'Memoria visual y continuidad');
  layer.innerHTML = `
    <div class="archive-brand-row">
      <img src="${ASSET_ROOT}brand-forum.png" alt="Fórum UPB" />
      <img src="${ASSET_ROOT}brand-90.png" alt="90 años UPB" />
    </div>
    <figure class="archive-feature">
      <img src="${ASSET_ROOT}slide-13-cierre.webp" alt="Campus UPB al atardecer" />
      <figcaption>Lo que ocurre aquí continúa afuera.</figcaption>
    </figure>
    <div class="archive-trail" aria-label="Memoria del recorrido">
      <img src="${ASSET_ROOT}slide-02-grados.webp" alt="Ceremonia de grados" />
      <img src="${ASSET_ROOT}slide-04-actores.webp" alt="Encuentro entre actores" />
      <img src="${ASSET_ROOT}slide-08-rutas.webp" alt="Conversación y comunidad" />
    </div>
    <div class="archive-exits">
      <a href="https://juanferfranco.github.io/ForumTEDTALK/" target="_blank" rel="noopener noreferrer">
        <img src="${ASSET_ROOT}qr-memory.png" alt="Código QR para memorias" />
        <span>Memorias</span>
      </a>
      <a href="https://www.instagram.com/centrodeeventosupb/" target="_blank" rel="noopener noreferrer">
        <img src="${ASSET_ROOT}qr-social.png" alt="Código QR para redes sociales" />
        <span>@centrodeeventosupb</span>
      </a>
    </div>
  `;
  document.body.appendChild(layer);
  return layer;
}

export function setArchiveVisible(layer, visible) {
  layer.classList.toggle('is-visible', visible);
}
