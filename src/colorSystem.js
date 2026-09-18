// ─────────────────────────────────────────────
//  COLOR SYSTEM
//  Helpers para escribir colores en Float32Array.
//  Todos reciben el buffer de destino explícitamente.
//  Cero objetos THREE.Color en el loop.
// ─────────────────────────────────────────────

import { CONFIG } from './config.js';

export const PALETTE = CONFIG.COLORS;

// Escribe color RGB directamente en el buffer
export function setColor(buf, i, rgb) {
  buf[i * 3]     = rgb[0];
  buf[i * 3 + 1] = rgb[1];
  buf[i * 3 + 2] = rgb[2];
}

// Mezcla lineal de dos colores RGB
export function blendColor(buf, i, rgbA, rgbB, t) {
  buf[i * 3]     = rgbA[0] + (rgbB[0] - rgbA[0]) * t;
  buf[i * 3 + 1] = rgbA[1] + (rgbB[1] - rgbA[1]) * t;
  buf[i * 3 + 2] = rgbA[2] + (rgbB[2] - rgbA[2]) * t;
}

// Escala el brillo del color en la posición i
export function dimColor(buf, i, factor) {
  buf[i * 3]     *= factor;
  buf[i * 3 + 1] *= factor;
  buf[i * 3 + 2] *= factor;
}