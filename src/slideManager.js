// ─────────────────────────────────────────────
//  SLIDE MANAGER
//  Gestiona el estado de la presentación:
//  qué slide está activa, transiciones (blend),
//  y el progreso temporal dentro de cada slide.
// ─────────────────────────────────────────────

import { CONFIG } from './config.js';
import { SLIDES } from './slides.js';
import {
  targetPositions, targetColors,
  seed_r0, seed_r1, seed_r2,
} from './particles.js';

const N  = CONFIG.TOTAL_PARTICLES;
const N3 = N * 3;
const TRANS_DUR = CONFIG.TRANSITION_DURATION;

// ── Estado ────────────────────────────────────
let currentSlide    = 0;   // índice [0, SLIDE_COUNT-1]
let transitionT     = 1.0; // 1 = estable, 0 = inicio de transición
let slideStartTime  = 0.0; // tiempo global al inicio de la slide
let globalTime      = 0.0;
let transitionStyle = 0;

// Buffers auxiliares para blend durante transición
const bufA = new Float32Array(N3);
const bufB = new Float32Array(N3);
const bufCA = new Float32Array(N3);
const bufCB = new Float32Array(N3);

// Forma final abstracta generada al iniciar la presentación
let _closingPositions = null;
let _closingColors = null;

export function setClosingForm(arr, colors) {
  _closingPositions = arr;
  _closingColors = colors;
}

export function getCurrentSlide() { return currentSlide; }
export function getSlideCount()   { return CONFIG.SLIDE_COUNT; }

// Navega al slide siguiente
export function nextSlide(time) {
  if (currentSlide < CONFIG.SLIDE_COUNT - 1) {
    _startTransition(time, currentSlide + 1);
  }
}

// Navega al slide anterior
export function prevSlide(time) {
  if (currentSlide > 0) {
    _startTransition(time, currentSlide - 1);
  }
}

// Salta directamente a un slide
export function goToSlide(index, time) {
  if (index >= 0 && index < CONFIG.SLIDE_COUNT && index !== currentSlide) {
    _startTransition(time, index);
  }
}

function _startTransition(time, toIndex) {
  // Captura el estado actual de targets como "origen" del blend
  bufA.set(targetPositions);
  bufCA.set(targetColors);
  transitionStyle = (currentSlide * 3 + toIndex * 5 + (toIndex > currentSlide ? 1 : 2)) % 4;
  currentSlide   = toIndex;
  slideStartTime = time;
  transitionT    = 0.0;
  globalTime     = time;
}

// ── Update principal ─────────────────────────
// Se llama en cada frame con el tiempo global del clock.
export function updateSlides(time) {
  globalTime = time;
  const slideProgress = transitionT; // cuánto llevan en esta slide (0→1)

  // Calcula los targets de la slide destino en bufB/bufCB
  // Necesitamos hacerlo sobre copias para no alterar los targets durante el blend
  if (transitionT < 1.0) {
    // Durante transición: blend A (posición anterior) → B (nueva slide)
    _computeSlide(currentSlide, time, bufB, bufCB, slideProgress);

    const blend = _easeInOut(transitionT);
    for (let i = 0; i < N3; i++) {
      targetPositions[i] = _transitionPosition(i, i % 3, blend, transitionT);
      targetColors[i]    = bufCA[i] + (bufCB[i] - bufCA[i]) * blend;
    }

    // Avanza la transición
    const dt = 1 / 60; // aproximado; se refina si se pasa deltaTime
    transitionT = Math.min(1.0, transitionT + dt / TRANS_DUR);

    if (transitionT >= 1.0) {
      // Transición completada: bufA recibe el estado final
      bufA.set(bufB);
      bufCA.set(bufCB);
    }

  } else {
    // Estado estable: escribe directo en targetPositions/targetColors
    const sp = Math.min((time - slideStartTime) / 12, 1); // 12s para progreso completo
    _computeSlide(currentSlide, time, targetPositions, targetColors, sp);
  }
}

// ── Evaluador de slides ───────────────────────
function _computeSlide(idx, time, posOut, colOut, sp) {
  // Swap temporario de punteros globales (los slides escriben en targetPositions/targetColors)
  // Como no podemos reasignar los exports, usamos un flag + copy después
  const slide = SLIDES[idx];
  if (!slide) return;

    if (idx >= 12) {
      // Las dos escenas finales comparten la forma abstracta en movimiento
      slide(targetPositions, targetColors, time, sp, _closingPositions, _closingColors);
  } else {
    slide(targetPositions, targetColors, time, sp);
  }

  // Copia el resultado al buffer de destino si es diferente al global
  if (posOut !== targetPositions) {
    posOut.set(targetPositions);
    colOut.set(targetColors);
  }
}

function _easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function _transitionPosition(particle, axis, blend, rawT) {
  const i = Math.floor(particle / 3);
  const x = bufA[i * 3];
  const y = bufA[i * 3 + 1];
  const z = bufA[i * 3 + 2];
  const baseX = bufA[particle] + (bufB[particle] - bufA[particle]) * blend;
  const arc = Math.sin(rawT * Math.PI);
  const radius = Math.sqrt(x * x + z * z) || 1;
  const seed = seed_r0[i] * 0.7 + seed_r1[i] * 0.3;
  const phase = seed_r2[i] * Math.PI;
  let offset = 0;

  if (transitionStyle === 0) {
    const angle = arc * (0.55 + seed * 0.55);
    const rotated = axis === 0
      ? x * Math.cos(angle) - z * Math.sin(angle)
      : x * Math.sin(angle) + z * Math.cos(angle);
    offset = (axis === 0 ? rotated - x : rotated - z) * 0.9;
  } else if (transitionStyle === 1) {
    offset = axis === 1
      ? arc * (4 + seed * 10) * Math.sin(phase + rawT * Math.PI * 2)
      : arc * (x / radius) * (3 + seed * 8);
  } else if (transitionStyle === 2) {
    offset = axis === 2
      ? arc * (8 + seed * 14) * (0.35 + Math.abs(Math.sin(phase)))
      : arc * (seed - 0.5) * 12;
  } else {
    const wave = Math.sin(rawT * Math.PI * 2 + seed * 8 + axis * 2.1);
    offset = arc * wave * (2.5 + seed * 6);
  }

  return baseX + offset;
}

// ── UI update (callback para el HUD) ─────────
let _onSlideChange = null;
export function onSlideChange(cb) { _onSlideChange = cb; }

function _startTransitionWithCB(time, toIndex) {
  _startTransition(time, toIndex);
  if (_onSlideChange) _onSlideChange(currentSlide);
}

// Override para incluir callback
export const slideManagerAPI = {
  next:   (t) => { if (currentSlide < CONFIG.SLIDE_COUNT - 1) _startTransitionWithCB(t, currentSlide + 1); },
  prev:   (t) => { if (currentSlide > 0)                       _startTransitionWithCB(t, currentSlide - 1); },
  goTo:   (i, t) => _startTransitionWithCB(t, i),
  current: () => currentSlide,
  count:   () => CONFIG.SLIDE_COUNT,
};