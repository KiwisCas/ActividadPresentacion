// ─────────────────────────────────────────────
//  SCENE ASSET LAYER — Fotografías Oficiales TED Talk
//  Mapeo exacto según el guión (solo fotos correspondientes):
//  Slide 2: FOTO 1 (Grados)
//  Slide 4: FOTO 2 (Academia + Industria + Ciudad)
//  Slide 5: FOTO 3 (Impacto / Fondo Futuro)
//  Slide 8: FOTO 4 (Nuevas rutas / Mesas de trabajo)
//  Slide 12: FOTO 5 (Auditorio / Futuro se construye)
// ─────────────────────────────────────────────

const ROOT = `${import.meta.env.BASE_URL}assets/forum/`;

// Array de 13 posiciones (índices 0 a 12)
// null para slides sin fotografía según el guión
export const SLIDE_PHOTOS = [
  null, // Slide 1: Sin foto (Portada TED Talk)
  {
    src: 'slide-02-grados.webp',
    badge: 'FOTO 1 · CEREMONIA DE GRADOS',
    title: 'Fórum UPB: ¿Solo para hacer grados?',
    alt: 'Fotografía de una ceremonia de grados en Fórum UPB'
  }, // Slide 2 (FOTO 1)
  null, // Slide 3: Sin foto (La Universidad sale al mundo)
  {
    src: 'slide-04-actores.webp',
    badge: 'FOTO 2 · PANEL CIUDAD & PAÍS',
    title: 'Academia + Industria + Ciudad',
    alt: 'Panel con líderes de gobierno, universidad y empresa en Fórum UPB'
  }, // Slide 4 (FOTO 2)
  {
    src: 'slide-05-impacto.webp',
    badge: 'FOTO 3 · EL IMPACTO REAL',
    title: 'El impacto trasciende el evento',
    alt: 'Lanzamiento de alianzas e impacto institucional en Fórum UPB'
  }, // Slide 5 (FOTO 3)
  null, // Slide 6: Sin foto (Comunidad y transformación)
  null, // Slide 7: Sin foto (Velocidad de la confianza)
  {
    src: 'slide-08-rutas.webp',
    badge: 'FOTO 4 · NUEVAS GENERACIONES',
    title: 'Nuevas rutas y sinergia colaborativa',
    alt: 'Mesas de trabajo multigeneracionales con laptops y diálogo activo'
  }, // Slide 8 (FOTO 4)
  null, // Slide 9: Sin foto (Una visión, dos generaciones)
  null, // Slide 10: Sin foto (Crecimiento en conjunto)
  null, // Slide 11: Sin foto (Los jóvenes son el presente)
  {
    src: 'slide-12-futuro.webp',
    badge: 'FOTO 5 · CONSTRUCCIÓN DE FUTURO',
    title: 'El auditorio preparado para el mañana',
    alt: 'Auditorio Fórum UPB iluminado y dispuesto para el futuro'
  }, // Slide 12 (FOTO 5)
  null, // Slide 13: Manejado especialmente con FOTO 6 + QRs en archivePanel
];

export function initSceneAssetLayer() {
  const layer = document.createElement('aside');
  layer.id = 'scene-asset-layer';
  layer.innerHTML = `
    <div class="scene-photo-container">
      <div class="scene-photo-glow"></div>
      <div class="scene-photo-card">
        <div class="scene-photo-frame">
          <img class="scene-photo-img" alt="" />
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(layer);
  return layer;
}

export function setSceneAsset(layer, index) {
  const photo = SLIDE_PHOTOS[index];
  const isVisible = Boolean(photo);

  layer.classList.remove('is-active');
  layer.classList.toggle('is-visible', isVisible);
  layer.dataset.slide = String(index + 1);

  if (!isVisible) {
    return;
  }

  const img = layer.querySelector('.scene-photo-img');

  img.src = `${ROOT}${photo.src}`;
  img.alt = photo.alt;

  requestAnimationFrame(() => {
    layer.classList.add('is-active');
  });
}
