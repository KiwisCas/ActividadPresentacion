// ─────────────────────────────────────────────
//  SCENE ASSET LAYER — Imagen como campo escénico
// ─────────────────────────────────────────────

const ROOT = './assets/forum/';

const MOMENT_ASSETS = [
  ['slide-12-futuro.webp', 'Auditorio Forum UPB preparado para un evento'],
  ['slide-02-grados.webp', 'Ceremonia de grados en Forum UPB'],
  ['slide-04-actores.webp', 'Encuentro entre actores en Forum UPB'],
  ['slide-04-actores.webp', 'Academia, industria y ciudad en conversación'],
  ['slide-05-impacto.webp', 'Evento con actores institucionales y empresariales'],
  ['slide-08-rutas.webp', 'Mesas de trabajo y conversaciones en comunidad'],
  ['slide-08-rutas.webp', 'Comunidad en conversación'],
  ['slide-08-rutas.webp', 'Rutas nuevas a partir de la experiencia'],
  ['slide-12-futuro.webp', 'Auditorio abierto al futuro'],
  ['slide-04-actores.webp', 'Dos generaciones compartiendo visión'],
  ['slide-05-impacto.webp', 'Colaboración y acción colectiva'],
  ['slide-08-rutas.webp', 'Jóvenes modificando el presente'],
  ['slide-12-futuro.webp', 'El futuro se construye'],
];

export function initSceneAssetLayer() {
  const layer = document.createElement('aside');
  layer.id = 'scene-asset-layer';
  layer.innerHTML = `
    <div class="scene-asset-wash"></div>
    <img class="scene-asset-image" alt="" />
    <div class="scene-asset-edge"></div>
    <div class="scene-asset-brands">
      <img src="${ROOT}brand-forum.png" alt="Fórum UPB" />
      <img src="${ROOT}brand-90.png" alt="90 años UPB" />
    </div>
  `;
  document.body.appendChild(layer);
  return layer;
}

export function setSceneAsset(layer, index) {
  const asset = MOMENT_ASSETS[index];
  const visible = Boolean(asset);
  layer.classList.remove('is-changing');
  layer.classList.toggle('is-visible', visible);
  layer.dataset.moment = String(index + 1);
  if (!visible) return;

  const image = layer.querySelector('.scene-asset-image');
  image.src = `${ROOT}${asset[0]}`;
  image.alt = asset[1];
  requestAnimationFrame(() => layer.classList.add('is-changing'));
}
