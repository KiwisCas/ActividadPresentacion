// ─────────────────────────────────────────────
//  ARCHIVE PANEL — SLIDE 13: Gran Cierre TED Talk
//  FOTO 6 + QR Memorias (pp móvil) + QR Redes @centrodeeventosupb
// ─────────────────────────────────────────────

const ASSET_ROOT = `${import.meta.env.BASE_URL}assets/forum/`;

export function initArchivePanel() {
  const layer = document.createElement('section');
  layer.id = 'archive-layer';
  layer.setAttribute('aria-label', 'Cierre y Memorias de la Presentación');
  layer.innerHTML = `
    <div class="archive-backdrop-glow"></div>
    <div class="archive-inner">
      <!-- Encabezado de Marcas -->
      <div class="archive-header">
        <div class="archive-tag">
          <span class="archive-tag-dot"></span>
          <span>TED TALK · CONCLUSIONES & CONTACTO</span>
        </div>
      </div>

      <!-- Contenido Principal: FOTO 6 y QRs -->
      <div class="archive-grid">
        <!-- FOTO 6: Campus al Atardecer -->
        <div class="archive-photo-card">
          <div class="archive-photo-wrapper">
            <img class="archive-photo-img" src="${ASSET_ROOT}slide-13-cierre.webp" alt="Campus y Fórum UPB al atardecer" />
          </div>
        </div>

        <!-- Columna de Códigos QR -->
        <div class="archive-qrs-wrapper">
          <div class="archive-qr-card" id="card-qr-memories">
            <div class="archive-qr-visual">
              <img src="${ASSET_ROOT}qr-memory.png" alt="QR con memorias" />
            </div>
            <div class="archive-qr-info">
              <div class="archive-qr-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <span>PP MÓVIL</span>
              </div>
              <h3 class="archive-qr-title">QR con Memorias</h3>
              <p class="archive-qr-desc">Accede a las diapositivas interactivas en tu celular.</p>
              <a class="archive-qr-btn" href="https://juanferfranco.github.io/ForumTEDTALK/" target="_blank" rel="noopener noreferrer">
                <span>Abrir Memorias</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
              </a>
            </div>
          </div>

          <div class="archive-qr-card" id="card-qr-social">
            <div class="archive-qr-visual">
              <img src="${ASSET_ROOT}qr-social.png" alt="QR redes sociales" />
            </div>
            <div class="archive-qr-info">
              <div class="archive-qr-badge alt">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                <span>COMUNIDAD</span>
              </div>
              <h3 class="archive-qr-title">QR Redes</h3>
              <p class="archive-qr-desc">Conecta con la agenda y novedades de eventos UPB.</p>
              <a class="archive-qr-btn alt" href="https://www.instagram.com/centrodeeventosupb/" target="_blank" rel="noopener noreferrer">
                <span>@centrodeeventosupb</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(layer);
  return layer;
}

export function setArchiveVisible(layer, visible) {
  layer.classList.toggle('is-visible', visible);
}

export function setArchiveLanguage(layer, language) {
  const isPt = language === 'pt';
  const quote = layer.querySelector('.archive-photo-quote');
  const memTitle = layer.querySelector('#card-qr-memories .archive-qr-title');
  const memDesc = layer.querySelector('#card-qr-memories .archive-qr-desc');
  const memBtn = layer.querySelector('#card-qr-memories .archive-qr-btn span');
  const socDesc = layer.querySelector('#card-qr-social .archive-qr-desc');

  if (quote) quote.textContent = isPt ? '"O que acontece aqui continua lá fora."' : '"Lo que ocurre aquí continúa afuera."';
  if (memTitle) memTitle.textContent = isPt ? 'QR com Anais' : 'QR con Memorias';
  if (memDesc) memDesc.textContent = isPt ? 'Acesse os slides interativos no seu celular.' : 'Accede a las diapositivas interactivas en tu celular.';
  if (memBtn) memBtn.textContent = isPt ? 'Abrir Anais' : 'Abrir Memorias';
  if (socDesc) socDesc.textContent = isPt ? 'Conecte-se com a agenda e novidades de eventos UPB.' : 'Conecta con la agenda y novedades de eventos UPB.';
}
