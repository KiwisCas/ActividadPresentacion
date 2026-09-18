// ─────────────────────────────────────────────
//  SLIDES — Generadores de posiciones y colores
//
//  Firma de cada función:
//    slideN(posOut, colOut, time, slideProgress, ...extras)
//
//  posOut / colOut: Float32Array de destino.
//  Cero objetos creados en el loop.
// ─────────────────────────────────────────────

import { CONFIG } from './config.js';
import {
  seed_r0, seed_r1, seed_r2,
  seed_theta, seed_phi, seed_delay,
  clusterID, groupID,
} from './particles.js';
import { noise3 } from './noise.js';
import { PALETTE, setColor, blendColor, dimColor } from './colorSystem.js';

const N   = CONFIG.TOTAL_PARTICLES;
const PI  = Math.PI;
const TAU = PI * 2;

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
function smoothstep(e0, e1, x) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

// ─────────────────────────────────────────────
//  SLIDE 1 — ADN ASIMÉTRICO
// ─────────────────────────────────────────────
export function slide1(posOut, colOut, time) {
  const N_A  = Math.floor(N * 0.38);
  const N_B  = Math.floor(N * 0.32);
  const N_BR = Math.floor(N * 0.18);
  const lenX = 44, freq = 0.20, ampA = 9.0, ampB = 10.5;
  const roll = time * 0.28;

  for (let i = 0; i < N; i++) {
    const r0 = seed_r0[i], r1 = seed_r1[i], r2 = seed_r2[i];
    let tx, ty, tz;

    if (i < N_A) {
      const t = i / N_A;
      const x = (t - 0.5) * lenX;
      const ph = x * freq;
      const rawY = Math.sin(ph) * ampA;
      const rawZ = Math.cos(ph) * ampA;
      const jx = noise3(x * 0.3, time * 0.4, 0) * 0.35;
      const jy = noise3(x * 0.3, 0, time * 0.4) * 0.35;
      tx = x + jx;
      ty = rawY * Math.cos(roll) - rawZ * Math.sin(roll) + jy;
      tz = rawY * Math.sin(roll) + rawZ * Math.cos(roll);
      blendColor(colOut, i, PALETTE.DARK_BLUE, PALETTE.BLUE, 0.4);

    } else if (i < N_A + N_B) {
      const t = (i - N_A) / N_B;
      const x = (t - 0.5) * lenX;
      const ph = x * freq + PI;
      const rawY = Math.sin(ph) * ampB;
      const rawZ = Math.cos(ph) * ampB;
      const s = 0.25;
      const jx = noise3(x * s, time * 0.6, r0 * 5) * 0.9;
      const jy = noise3(x * s, r1 * 5, time * 0.6) * 0.9;
      const jz = noise3(r2 * 5, x * s, time * 0.5) * 0.9;
      tx = x + jx;
      ty = (rawY + jy) * Math.cos(roll) - (rawZ + jz) * Math.sin(roll);
      tz = (rawY + jy) * Math.sin(roll) + (rawZ + jz) * Math.cos(roll);
      blendColor(colOut, i, PALETTE.BLUE, PALETTE.PINK, 0.45);

    } else if (i < N_A + N_B + N_BR) {
      const bCount = 16;
      const bID = (i - N_A - N_B) % bCount;
      const cycleT = time * 0.7 + bID * 0.4 + seed_delay[i] * PI;
      const life = smoothstep(0, 0.35, Math.sin(cycleT) * 0.5 + 0.5);
      const x = (-lenX * 0.42 + (bID / (bCount - 1)) * lenX * 0.84);
      const ph = x * freq;
      const yA = Math.sin(ph) * ampA * Math.cos(roll) - Math.cos(ph) * ampA * Math.sin(roll);
      const zA = Math.sin(ph) * ampA * Math.sin(roll) + Math.cos(ph) * ampA * Math.cos(roll);
      const yB = Math.sin(ph + PI) * ampB * Math.cos(roll) - Math.cos(ph + PI) * ampB * Math.sin(roll);
      const zB = Math.sin(ph + PI) * ampB * Math.sin(roll) + Math.cos(ph + PI) * ampB * Math.cos(roll);
      const bt = seed_r0[i];
      tx = x;
      ty = lerp(yA, lerp(yA, yB, bt), life);
      tz = lerp(zA, lerp(zA, zB, bt), life);
      const ct = bID % 3 === 0 ? 0 : bID % 3 === 1 ? 1 : bt;
      blendColor(colOut, i, PALETTE.RED, PALETTE.PINK, ct);

    } else {
      const nx = (r0 - 0.5) * lenX * 1.1;
      const ny = (r1 - 0.5) * 24;
      const nz = r2 * 10;
      tx = nx + noise3(nx * 0.1, time * 0.3, r0) * 1.5;
      ty = ny + noise3(ny * 0.1, r1, time * 0.3) * 1.5;
      tz = nz + noise3(nz * 0.1, time * 0.3, r2) * 1.5;
      blendColor(colOut, i, PALETTE.DARK_BLUE, PALETTE.BLUE, 0.12);
    }

    posOut[i * 3] = tx; posOut[i * 3 + 1] = ty; posOut[i * 3 + 2] = tz;
  }
}

// ─────────────────────────────────────────────
//  SLIDE 2 — ¿SOLO PARA GRADOS?
// ─────────────────────────────────────────────
export function slide2(posOut, colOut, time, sp) {
  const release = smoothstep(0.08, 0.85, sp);
  const blueCount = Math.floor(N * 0.68);
  const pinkCount = Math.floor(N * 0.06);

  for (let i = 0; i < N; i++) {
    const r0 = seed_r0[i], r1 = seed_r1[i], r2 = seed_r2[i];
    const isBlue = i < blueCount;
    const isPink = i >= blueCount && i < blueCount + pinkCount;
    const cohesion = isBlue ? 3.5 + r0 * 7 : 18 + r0 * 12;
    const angle = seed_theta[i] + time * (isBlue ? 0.16 : 0.05);
    let tx, ty, tz;

    if (isBlue) {
      const wellX = -9 + Math.sin(time * 0.35) * 1.5;
      const compression = 1 + Math.sin(time * 1.7 + r1 * TAU) * 0.08;
      tx = wellX + Math.cos(angle) * cohesion * compression;
      ty = Math.sin(angle) * cohesion * 0.55 + r2 * 1.5;
      tz = Math.sin(angle) * cohesion * 0.35;
      blendColor(colOut, i, PALETTE.DARK_BLUE, PALETTE.BLUE, 0.7);
    } else if (isPink) {
      const launch = (time * 0.12 + seed_delay[i]) % 1;
      const path = smoothstep(0, 1, launch);
      tx = lerp(-5, 14, path) + Math.sin(path * PI) * 3;
      ty = lerp(r2 * 3, (r1 - 0.5) * 12, path) + Math.sin(path * TAU + r0) * 1.5;
      tz = lerp(0, r2 * 8, path);
      blendColor(colOut, i, PALETTE.BLUE, PALETTE.PINK, path);
    } else {
      const fieldPulse = Math.sin(time * 0.8 + angle) * 1.2;
      tx = 13 + Math.cos(angle) * cohesion * 0.65 + fieldPulse;
      ty = r2 * 9 + Math.sin(angle * 2 + time) * 0.8;
      tz = Math.sin(angle) * cohesion * 0.42;
      blendColor(colOut, i, PALETTE.WHITE, PALETTE.BLUE, 0.12 + release * 0.18);
    }

    posOut[i * 3] = tx; posOut[i * 3 + 1] = ty; posOut[i * 3 + 2] = tz;
  }
}

// ─────────────────────────────────────────────
//  SLIDE 3 — LA UNIVERSIDAD SALE AL MUNDO
// ─────────────────────────────────────────────
export function slide3(posOut, colOut, time, sp) {
  const dissolve = smoothstep(0.05, 0.9, sp);
  for (let i = 0; i < N; i++) {
    const r0 = seed_r0[i], r1 = seed_r1[i], r2 = seed_r2[i];
    const side = i % 2 === 0 ? -1 : 1;
    const edge = side * (13 + r0 * 8);
    const bridge = smoothstep(0.25, 0.95, dissolve) * (0.25 + r1 * 0.75);
    const drift = Math.sin(time * 0.35 + seed_theta[i]) * 1.4;
    posOut[i * 3] = lerp(edge, (r0 - 0.5) * 34, bridge) + drift;
    posOut[i * 3 + 1] = lerp(r2 * 10, Math.sin(seed_theta[i] + time * 0.2) * 8, bridge);
    posOut[i * 3 + 2] = lerp((r1 - 0.5) * 7, Math.cos(seed_theta[i] + time * 0.2) * 6, bridge);
    blendColor(colOut, i, side < 0 ? PALETTE.BLUE : PALETTE.WHITE, side < 0 ? PALETTE.WHITE : PALETTE.BLUE, bridge * 0.72);
  }
}

// ─────────────────────────────────────────────
//  SLIDE 4 — ACADEMIA · INDUSTRIA · CIUDAD
// ─────────────────────────────────────────────
export function slide4(posOut, colOut, time, sp) {
  const emerge = smoothstep(0.05, 0.9, sp);
  const centers = [[-14, 6], [0, -7], [14, 5]];
  const colors3 = [PALETTE.BLUE, PALETTE.RED, PALETTE.WHITE];
  const coreStart = Math.floor(N * 0.72);

  for (let i = 0; i < N; i++) {
    const r0 = seed_r0[i], r1 = seed_r1[i], r2 = seed_r2[i];
    const group = groupID[i] % 3;
    const center = centers[group];
    const angle = seed_theta[i] + time * (0.12 + group * 0.08);
    if (i < coreStart) {
      const flow = 4 + r0 * 8;
      const bend = Math.sin(angle * 2 + time * (0.5 + group * 0.2));
      posOut[i * 3] = center[0] + Math.cos(angle) * flow + bend * group;
      posOut[i * 3 + 1] = center[1] + Math.sin(angle) * flow * 0.45;
      posOut[i * 3 + 2] = Math.sin(angle) * flow + r2 * 2;
      setColor(colOut, i, colors3[group]);
    } else {
      const progress = (time * (0.08 + r0 * 0.16) + seed_delay[i]) % 1;
      const sourceX = center[0] + Math.cos(angle) * 8;
      const sourceY = center[1] + Math.sin(angle) * 4;
      const targetX = Math.sin(angle * 1.7) * 3;
      const targetY = Math.cos(angle * 1.3) * 3;
      posOut[i * 3] = lerp(sourceX, targetX, progress * emerge);
      posOut[i * 3 + 1] = lerp(sourceY, targetY, progress * emerge);
      posOut[i * 3 + 2] = lerp(r2 * 4, Math.sin(angle) * 3, progress * emerge);
      blendColor(colOut, i, colors3[group], PALETTE.PINK, progress * emerge);
    }
  }
}

// ─────────────────────────────────────────────
//  SLIDE 5 — EL IMPACTO PERMANECE
// ─────────────────────────────────────────────
export function slide5(posOut, colOut, time, sp) {
  const ring = 12 + smoothstep(0, 1, sp) * 9;
  const wave = (time * 8) % 32;
  for (let i = 0; i < N; i++) {
    const r0 = seed_r0[i], r1 = seed_r1[i], r2 = seed_r2[i];
    const angle = seed_theta[i] + time * 0.08;
    const radius = ring + (r0 - 0.5) * 6;
    const impact = clamp(1 - Math.abs(radius - wave) / 3.5, 0, 1);
    const pulse = impact * (3 + r1 * 5);
    posOut[i * 3] = Math.cos(angle) * (radius + pulse);
    posOut[i * 3 + 1] = r2 * 5 + Math.sin(angle * 3 + time) * impact * 1.5;
    posOut[i * 3 + 2] = Math.sin(angle) * (radius + pulse) * 0.58;
    blendColor(colOut, i, PALETTE.DARK_BLUE, PALETTE.WHITE, impact * 0.9 + r0 * 0.12);
  }
}

// ─────────────────────────────────────────────
//  SLIDE 6 — UNA COMUNIDAD TRAE TRANSFORMACIÓN
// ─────────────────────────────────────────────
export function slide6(posOut, colOut, time, sp) {
  const nodes = [[-12, 5, 0], [0, 7, 1], [12, 5, 0], [-9, -6, 1], [4, -5, 0], [14, -4, 1]];
  const cohesion = smoothstep(0.1, 0.9, sp);
  for (let i = 0; i < N; i++) {
    const r0 = seed_r0[i], r1 = seed_r1[i], r2 = seed_r2[i];
    const a = i % nodes.length;
    const b = (a + 1 + Math.floor(r0 * 2)) % nodes.length;
    const phase = (time * 0.25 + seed_delay[i]) % 1;
    const join = smoothstep(0.15, 0.85, cohesion) * (0.35 + r1 * 0.65);
    const ax = nodes[a][0], ay = nodes[a][1], az = nodes[a][2];
    const bx = nodes[b][0], by = nodes[b][1], bz = nodes[b][2];
    const drift = (r0 - 0.5) * (1 - join) * 20;
    posOut[i * 3] = lerp(ax + drift, lerp(ax, bx, phase), join);
    posOut[i * 3 + 1] = lerp(ay + (r1 - 0.5) * 12, lerp(ay, by, phase), join) + Math.sin(phase * PI) * join * 3;
    posOut[i * 3 + 2] = lerp(az + (r2 - 0.5) * 8, lerp(az, bz, phase), join);
    blendColor(colOut, i, PALETTE.BLUE, PALETTE.PINK, join * 0.7 + r0 * 0.1);
  }
}

// ─────────────────────────────────────────────
//  SLIDE 7 — LA CONFIANZA TRANSMITE MOVIMIENTO
// ─────────────────────────────────────────────
export function slide7(posOut, colOut, time, sp) {
  const trust = smoothstep(0.05, 0.9, sp);
  const links = [[-10, 4], [0, 7], [10, 4], [-6, -5], [5, -5]];
  for (let i = 0; i < N; i++) {
    const r0 = seed_r0[i], r1 = seed_r1[i], r2 = seed_r2[i];
    const a = i % links.length;
    const b = (a + 1) % links.length;
    const phase = (time * (0.12 + trust * 0.35) + seed_delay[i]) % 1;
    const spring = Math.sin(time * (1.4 + r0) + seed_theta[i]) * (1 - trust) * 3;
    const x = lerp(links[a][0], links[b][0], phase);
    const y = lerp(links[a][1], links[b][1], phase);
    posOut[i * 3] = x + spring;
    posOut[i * 3 + 1] = y + Math.sin(phase * PI) * (2 + trust * 3) + r2 * 1.5;
    posOut[i * 3 + 2] = (r1 - 0.5) * (5 - trust * 3);
    blendColor(colOut, i, PALETTE.DARK_BLUE, PALETTE.PINK, trust * 0.65 + r0 * 0.18);
  }
}

// ─────────────────────────────────────────────
//  SLIDE 8 — LA EXPERIENCIA ABRE RUTAS
// ─────────────────────────────────────────────
export function slide8(posOut, colOut, time, sp) {
  const branch = smoothstep(0.2, 0.8, sp);
  for (let i = 0; i < N; i++) {
    const r0 = seed_r0[i], r1 = seed_r1[i], r2 = seed_r2[i];
    const lane = (i % 3) - 1;
    const flow = (time * (3 + r0 * 2) + seed_delay[i] * 30) % 50 - 25;
    const fork = Math.sin((flow + 25) * 0.16) * 8 * branch * (r1 > 0.48 ? 1 : -1);
    posOut[i * 3] = flow;
    posOut[i * 3 + 1] = lane * 3.4 + fork + noise3(r0 * 4, time * 0.3, r1) * 0.8;
    posOut[i * 3 + 2] = r2 * 3 + fork * 0.12;
    blendColor(colOut, i, PALETTE.BLUE, PALETTE.PINK, branch * (r1 > 0.48 ? 0.75 : 0.18));
  }
}

// ─────────────────────────────────────────────
//  SLIDE 9 — UNA VISIÓN, DOS GENERACIONES
//  Coreografía de 3 fases:
//   1. Choque frontal y desvío vertical hacia arriba (sp: 0.0 → 0.35)
//   2. Segundo intento en la altura con repulsión violenta (sp: 0.35 → 0.65)
//   3. Cruce armónico y formación de una base plana firme en la zona de choque (sp: 0.65 → 1.0+)
// ─────────────────────────────────────────────
export function slide9(posOut, colOut, time, sp) {
  // Ponderaciones suaves y continuas para cada una de las 3 etapas
  const w1 = 1.0 - smoothstep(0.28, 0.38, sp);
  const w2 = smoothstep(0.28, 0.38, sp) * (1.0 - smoothstep(0.62, 0.72, sp));
  const w3 = smoothstep(0.62, 0.72, sp);

  const streamParticles = 1800; // Por cada lado (3600 en total para las dos líneas de haz)

  for (let i = 0; i < N; i++) {
    const r0 = seed_r0[i], r1 = seed_r1[i], r2 = seed_r2[i];
    let px = 0, py = 0, pz = 0;

    if (i < streamParticles * 2) {
      // ── Corrientes de haz (Línea A: Izquierda / Azul, Línea B: Derecha / Rosa)
      const isYoung = i >= streamParticles;
      const side = isYoung ? 1 : -1;
      const idxInStream = isYoung ? i - streamParticles : i;
      const u = idxInStream / streamParticles;
      const flow = (u + time * 0.18 + seed_delay[i] * 0.05) % 1;

      // ── Fase 1: Choque y elevación vertical
      const reach1 = smoothstep(0.0, 0.18, sp);
      const deflect1 = smoothstep(0.14, 0.34, sp) * smoothstep(0.35, 0.95, flow);
      const x1 = side * lerp(32, 1.2, flow * reach1) + side * deflect1 * 2.0;
      const y1 = -2.5 + Math.sin(flow * PI) * 0.8 + deflect1 * 12.0;
      const z1 = Math.sin(flow * 8 + time * 1.5) * 1.2 + (r1 - 0.5) * 1.4;

      // ── Fase 2: Re-aproximación en lo alto y repulsión elástica
      const approach2 = smoothstep(0.32, 0.46, sp);
      const repelling = smoothstep(0.46, 0.60, sp);
      const springDecay = Math.exp(-Math.max(0, sp - 0.46) * 10);
      const spring = Math.sin((sp - 0.46) * 35) * springDecay * 4.5;
      const arcY = 7.0 + Math.sin(flow * PI) * 1.5;
      const x2 = side * (lerp(28, 0.8, flow * approach2) + repelling * 15.0 + (sp > 0.46 ? spring : 0));
      const y2 = arcY + (sp > 0.46 ? (r2 - 0.5) * repelling * 2.5 : 0);
      const z2 = Math.cos(flow * 6 + time) * 1.8 + (r0 - 0.5) * 1.5;

      // ── Fase 3: Descenso, cruce armónico y unión a la base plana
      const descent3 = smoothstep(0.64, 0.82, sp);
      const startX3 = side * 28;
      const endX3 = -side * 15; // Cruza armoniosamente hacia el otro lado
      const x3 = lerp(startX3, endX3, flow);
      let y3 = lerp(lerp(4.5, -1.0, flow), -5.2, descent3);
      const flatT = smoothstep(0.76, 0.96, sp) * smoothstep(0.3, 1.0, flow);
      const wave3 = Math.sin(time * 2.2 + x3 * 0.35) * 0.15;
      y3 = lerp(y3, -5.2 + wave3, flatT);
      const z3 = Math.sin(flow * TAU + time * 0.8) * (2.8 * (1 - flatT) + 4.5 * flatT) + (r2 - 0.5) * 1.2;

      // Combinación ponderada de las tres fases
      px = w1 * x1 + w2 * x2 + w3 * x3;
      py = w1 * y1 + w2 * y2 + w3 * y3;
      pz = w1 * z1 + w2 * z2 + w3 * z3;

      // Coloración dinámica
      const baseCol = isYoung ? PALETTE.PINK : PALETTE.BLUE;
      if (w1 > 0.01) {
        // En Fase 1, chispas brillantes al chocar
        blendColor(colOut, i, baseCol, PALETTE.WHITE, deflect1 * 0.85 * w1);
      } else if (w2 > 0.01) {
        // En Fase 2, fricción y calor al repelerse
        blendColor(colOut, i, baseCol, PALETTE.RED, repelling * 0.7 * w2);
      } else {
        // En Fase 3, unión armónica con violeta y blanco
        const unionGlow = flatT * 0.85;
        blendColor(colOut, i, baseCol, PALETTE.VIOLET, unionGlow * 0.7);
        if (Math.abs(px) < 4.0) {
          blendColor(colOut, i, colOut, PALETTE.WHITE, 0.6);
        }
      }

    } else {
      // ── Partículas de impacto / base plana (2900 partículas)
      const j = i - streamParticles * 2;
      const sideJ = j % 2 === 0 ? -1 : 1;

      // Fase 1: Surtidor de chispas verticales desde el choque en Y = -2.5
      const burst1 = smoothstep(0.14, 0.34, sp);
      const sparkH1 = r0 * 13.5 * burst1;
      const spread1 = (r1 - 0.5) * (2.5 + sparkH1 * 0.3);
      const x1 = spread1 + Math.sin(time * 4 + j) * 0.4;
      const y1 = -2.5 + sparkH1;
      const z1 = (r2 - 0.5) * (2.5 + sparkH1 * 0.2);

      // Fase 2: Onda expansiva de repulsión horizontal desde (0, 7.0, 0)
      const rep2 = smoothstep(0.46, 0.62, sp);
      const distX2 = sideJ * (1.2 + r0 * 18.0 * rep2);
      const x2 = distX2 + Math.sin(time * 6 + j) * 0.5;
      const y2 = 7.0 + (r1 - 0.5) * 3.5 * rep2;
      const z2 = (r2 - 0.5) * 6.0 * rep2;

      // Fase 3: La Base Plana Horizontal ("se forma una base plana en donde se chocaron y funcionó")
      const nx = 58;
      const nz = 50;
      const gx = ((j % nx) / (nx - 1) - 0.5) * 32.0; // Plano horizontal X: [-16, +16]
      const gz = (Math.floor(j / nx) / (nz - 1) - 0.5) * 16.0; // Plano horizontal Z: [-8, +8]
      const normRad = Math.sqrt((gx / 16) * (gx / 16) + (gz / 8) * (gz / 8));
      const expand3 = smoothstep(0.70, 0.94, sp);
      const formed3 = clamp((expand3 - normRad * 0.6) / 0.4, 0, 1);

      const wave3 = Math.sin(time * 2.4 - normRad * 4.2) * 0.14 * (1.0 - normRad * 0.45);
      const flatY = -5.2 + wave3;

      // Despliegue desde el punto de choque (0, -5.2, 0) hacia la base plana
      const x3 = gx * formed3 + (r0 - 0.5) * 0.25;
      const y3 = lerp(0.0, flatY, smoothstep(0.64, 0.84, sp));
      const z3 = gz * formed3 + (r1 - 0.5) * 0.25;

      px = w1 * x1 + w2 * x2 + w3 * x3;
      py = w1 * y1 + w2 * y2 + w3 * y3;
      pz = w1 * z1 + w2 * z2 + w3 * z3;

      // Color de las chispas y de la base plana
      if (w1 > 0.01) {
        blendColor(colOut, i, PALETTE.WHITE, PALETTE.BLUE, 0.35);
      } else if (w2 > 0.01) {
        blendColor(colOut, i, PALETTE.RED, PALETTE.PINK, 0.5);
      } else {
        // En la base plana: Gradiente armónico de izquierda (Azul) a centro (Blanco-Oro/Violeta) a derecha (Rosa)
        const tGrid = (gx + 16) / 32; // 0 a 1 de izquierda a derecha
        blendColor(colOut, i, PALETTE.BLUE, PALETTE.PINK, tGrid);
        const centerProximity = 1 - clamp(normRad, 0, 1);
        blendColor(colOut, i, colOut, PALETTE.WHITE, centerProximity * 0.85);
        if (normRad < 0.25) {
          blendColor(colOut, i, colOut, PALETTE.WHITE, 0.95);
        }
      }
    }

    posOut[i * 3]     = px;
    posOut[i * 3 + 1] = py;
    posOut[i * 3 + 2] = pz;
  }
}

// ─────────────────────────────────────────────
//  SLIDE 10 — CRECER ES TRABAJAR JUNTOS
// ─────────────────────────────────────────────
export function slide10(posOut, colOut, time, sp) {
  const emergence = smoothstep(0.15, 0.85, sp);
  for (let i = 0; i < N; i++) {
    const r0 = seed_r0[i], r1 = seed_r1[i], r2 = seed_r2[i];
    const group = i % 2;
    const side = group === 0 ? -1 : 1;
    const orbit = seed_theta[i] + time * (group === 0 ? 0.17 : -0.25);
    const radius = 9 + r0 * 5;
    const sourceX = side * 12 + Math.cos(orbit) * radius;
    const sourceY = Math.sin(orbit) * radius * 0.45;
    const sourceZ = Math.sin(orbit) * radius * 0.4;
    const shared = emergence * (0.35 + r1 * 0.65);
    posOut[i * 3] = lerp(sourceX, Math.cos(orbit * 1.7) * 7, shared);
    posOut[i * 3 + 1] = lerp(sourceY, Math.sin(orbit * 1.3) * 5, shared);
    posOut[i * 3 + 2] = lerp(sourceZ, Math.sin(orbit * 1.7) * 7, shared) + r2 * shared * 2;
    blendColor(colOut, i, group === 0 ? PALETTE.BLUE : PALETTE.PINK, PALETTE.VIOLET, shared * 0.8);
  }
}

// ─────────────────────────────────────────────
//  SLIDE 11 — LOS JÓVENES SON EL PRESENTE
// ─────────────────────────────────────────────
export function slide11(posOut, colOut, time, sp) {
  const field = smoothstep(0.05, 0.85, sp);
  for (let i = 0; i < N; i++) {
    const r0 = seed_r0[i], r1 = seed_r1[i], r2 = seed_r2[i];
    const entrant = r0 > 0.72;
    const baseR = entrant ? 24 : 10 + r1 * 10;
    const angle = seed_theta[i] + time * (entrant ? -0.32 : 0.18);
    const influence = entrant ? field * 4 : field * 1.8;
    const tx = Math.cos(angle) * baseR;
    const tz = Math.sin(angle) * baseR * 0.55;
    posOut[i * 3] = tx + Math.sin(tz * 0.18 + time) * influence;
    posOut[i * 3 + 1] = r2 * 5 + Math.cos(tx * 0.14 + time * 0.7) * influence;
    posOut[i * 3 + 2] = tz + Math.cos(tx * 0.12) * influence;
    blendColor(colOut, i, entrant ? PALETTE.PINK : PALETTE.BLUE, PALETTE.RED, entrant ? 0.55 : field * 0.3);
  }
}

// ─────────────────────────────────────────────
//  SLIDE 12 — EL FUTURO SE CONSTRUYE
// ─────────────────────────────────────────────
export function slide12(posOut, colOut, time, sp) {
  const build = smoothstep(0.05, 0.92, sp);
  const path = [[-17, -5], [-12, 2], [-7, -1], [-2, 5], [4, 1], [10, 7], [17, 3]];
  for (let i = 0; i < N; i++) {
    const r0 = seed_r0[i], r1 = seed_r1[i], r2 = seed_r2[i];
    const phase = (i / N) * 10;
    const visible = clamp(build * 10 - phase, 0, 1);
    const segment = i % (path.length - 1);
    const local = (i * 0.37 + time * 0.05) % 1;
    const start = path[segment];
    const end = path[segment + 1];
    const targetX = lerp(start[0], end[0], local);
    const targetY = lerp(start[1], end[1], local);
    const targetZ = Math.sin(segment * 1.4 + local * PI) * 1.8;
    const scatter = 1 - smoothstep(0, 1, visible);
    posOut[i * 3] = targetX * visible + (r0 - 0.5) * 36 * scatter;
    posOut[i * 3 + 1] = targetY * visible + (r1 - 0.5) * 24 * scatter;
    posOut[i * 3 + 2] = targetZ * visible + (r2 - 0.5) * 14 * scatter;
    blendColor(colOut, i, PALETTE.BLUE, PALETTE.WHITE, visible * 0.7);
  }
}

// ─────────────────────────────────────────────
//  SLIDE 13 — FORMA FINAL EN VÓRTICE
// ─────────────────────────────────────────────
export function slide13(posOut, colOut, time, sp, closingPositions, closingColors) {
  const form = smoothstep(0.0, 0.75, sp);
  const hasForm = closingPositions && closingPositions.length >= N * 3;
  const spin = time * 0.24;
  const pulse = 1 + Math.sin(time * 0.85) * 0.045;

  for (let i = 0; i < N; i++) {
    const r0 = seed_r0[i], r1 = seed_r1[i];

    if (hasForm) {
      const lx = closingPositions[i * 3];
      const ly = closingPositions[i * 3 + 1];
      const lz = closingPositions[i * 3 + 2];
      const radius = Math.sqrt(lx * lx + ly * ly) || 1;
      const baseAngle = Math.atan2(ly, lx);
      const angularVelocity = 0.55 + 1.7 / (radius + 4);
      const radialWave = Math.sin(time * 1.1 - radius * 0.22 + r0 * TAU) * 0.08;
      const localSpin = baseAngle + spin * angularVelocity + radius * 0.012 + noise3(r0 * 2, r1 * 2, time * 0.12) * 0.035;
      const cosSpin = Math.cos(localSpin);
      const sinSpin = Math.sin(localSpin);
      const scaledX = Math.cos(baseAngle) * radius * (pulse + radialWave);
      const scaledY = Math.sin(baseAngle) * radius * (pulse + radialWave);
      posOut[i * 3] = scaledX * cosSpin - scaledY * sinSpin + noise3(r0 * 3, time * 0.3, 0) * (1 - form) * 3;
      posOut[i * 3 + 1] = scaledX * sinSpin + scaledY * cosSpin + noise3(0, r1 * 3, time * 0.3) * (1 - form) * 3;
      posOut[i * 3 + 2] = lz + Math.sin(time * 0.7 + radius * 0.08 + baseAngle) * (0.45 + radius * 0.025);
    } else {
      const th = seed_theta[i] + time * 0.18;
      const R = 18 + r0 * 10;
      posOut[i * 3]     = R * Math.cos(th);
      posOut[i * 3 + 1] = (r0 * 2 - 1) * 6;
      posOut[i * 3 + 2] = R * Math.sin(th) * 0.4 - 8;
    }

    if (closingColors && closingColors.length >= N * 3) {
      colOut[i * 3] = closingColors[i * 3];
      colOut[i * 3 + 1] = closingColors[i * 3 + 1];
      colOut[i * 3 + 2] = closingColors[i * 3 + 2];
    } else {
      blendColor(colOut, i, PALETTE.WHITE, PALETTE.BLUE, 0.35);
    }
    const bright = lerp(0.15, 1.0, form);
    dimColor(colOut, i, bright);
  }
}

// ── Registro ──────────────────────────────────
export const SLIDES = [
  slide1, slide2, slide3, slide4,
  slide5, slide6, slide7, slide8,
  slide9, slide10, slide11, slide12,
  slide13,
];