// ─────────────────────────────────────────────
//  MAIN — Punto de entrada
//  Orquesta la inicialización de todos los módulos.
// ─────────────────────────────────────────────

import { initRenderer, startLoop, clock } from './renderer.js';
import { slideManagerAPI, onSlideChange } from './slideManager.js';
import { initHUD, updateHUD } from './hud.js';
import { loadClosingForm } from './logoMapper.js';
import { initArchivePanel, setArchiveVisible, setArchiveLanguage } from './archivePanel.js';
import { initSceneAssetLayer, setSceneAsset } from './sceneAssetLayer.js';

// ── Inicialización ────────────────────────────
const container = document.getElementById('canvas-container');
initRenderer(container);

const archivePanel = initArchivePanel();
setArchiveVisible(archivePanel, false);
setArchiveLanguage(archivePanel, 'es');

// ── HUD ───────────────────────────────────────
initHUD(
  () => slideManagerAPI.prev(clock.getElapsedTime()),
  () => slideManagerAPI.next(clock.getElapsedTime()),
  (language) => setArchiveLanguage(archivePanel, language),
);
const sceneAssetLayer = initSceneAssetLayer();
setSceneAsset(sceneAssetLayer, 0);

// Sincronizar HUD cuando cambie el slide
onSlideChange((idx) => {
  updateHUD(idx);
  setArchiveVisible(archivePanel, idx === 12);
  setSceneAsset(sceneAssetLayer, idx < 12 ? idx : -1);
});

// Evento de los dots del HUD
document.addEventListener('hud:goto', (e) => {
  slideManagerAPI.goTo(e.detail, clock.getElapsedTime());
  updateHUD(e.detail);
  setArchiveVisible(archivePanel, e.detail === 12);
  setSceneAsset(sceneAssetLayer, e.detail < 12 ? e.detail : -1);
});

// ── Teclado ───────────────────────────────────
window.addEventListener('keydown', (e) => {
  const t = clock.getElapsedTime();
  switch (e.key) {
    case 'ArrowRight':
    case 'PageDown':
    case ' ':
      e.preventDefault();
      slideManagerAPI.next(t);
      break;
    case 'ArrowLeft':
    case 'PageUp':
      e.preventDefault();
      slideManagerAPI.prev(t);
      break;
    case 'Home':
      e.preventDefault();
      slideManagerAPI.goTo(0, t);
      break;
    case 'End':
      e.preventDefault();
      slideManagerAPI.goTo(12, t);
      break;
    case 'f':
    case 'F':
      _toggleFullscreen();
      break;
  }
  // Acceso directo por número (1-9)
  const num = parseInt(e.key, 10);
  if (!isNaN(num) && num >= 1 && num <= 9) {
    slideManagerAPI.goTo(num - 1, t);
  }
});

// ── Logo ──────────────────────────────────────
// Intenta cargar el logo del Fórum UPB.
// Si no existe el asset local, el fallback de texto se activa.
loadClosingForm();

// ── Pantalla completa ─────────────────────────
function _toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}

// ── Loop ──────────────────────────────────────
startLoop();