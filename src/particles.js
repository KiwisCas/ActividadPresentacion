// ─────────────────────────────────────────────
//  PARTICLES — Pool global de partículas
//  Todo el estado vive en typed arrays.
//  Cero objetos THREE.* creados en el loop.
// ─────────────────────────────────────────────

import * as THREE from 'three';
import { CONFIG } from './config.js';

const N = CONFIG.TOTAL_PARTICLES;
const N3 = N * 3;

// ── Arrays de estado (actuales) ──────────────
export const positions  = new Float32Array(N3);
export const velocities = new Float32Array(N3); // velocidad residual
export const colors     = new Float32Array(N3);

// ── Arrays de destino ────────────────────────
export const targetPositions = new Float32Array(N3);
export const targetColors    = new Float32Array(N3);

// ── Semillas estáticas por partícula ─────────
// Se asignan UNA VEZ en init y nunca cambian.
export const seed_r0 = new Float32Array(N); // rand [0,1]
export const seed_r1 = new Float32Array(N);
export const seed_r2 = new Float32Array(N);
export const seed_theta = new Float32Array(N); // ángulo aleatorio
export const seed_phi   = new Float32Array(N); // ángulo elevación
export const seed_delay = new Float32Array(N); // delay de emisión
export const clusterID  = new Uint8Array(N);   // subcluster 0-3
export const groupID    = new Uint8Array(N);   // grupo mayor (0, 1, 2)

// ── Geometría Three.js ───────────────────────
export let geometry, particleMaterial, particleSystem;

export function initParticles(scene) {
  const n = N;

  // Posiciones iniciales: nube dispersa aleatoria
  // PRNG determinista para reproducibilidad
  let s = 123456789;
  function rng() {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  }

  for (let i = 0; i < n; i++) {
    const r0 = rng(), r1 = rng(), r2 = rng();
    positions[i * 3]     = (r0 - 0.5) * 60;
    positions[i * 3 + 1] = (r1 - 0.5) * 30;
    positions[i * 3 + 2] = (r2 - 0.5) * 30;

    seed_r0[i]    = rng();
    seed_r1[i]    = rng();
    seed_r2[i]    = rng() * 2 - 1; // signed
    seed_theta[i] = rng() * Math.PI * 2;
    seed_phi[i]   = Math.acos(2 * rng() - 1); // distribución esférica uniforme
    seed_delay[i] = rng();
    clusterID[i]  = Math.floor(rng() * 4);
    groupID[i]    = Math.floor(rng() * 3);

    const C = CONFIG.COLORS.BLUE;
    colors[i * 3]     = C[0];
    colors[i * 3 + 1] = C[1];
    colors[i * 3 + 2] = C[2];
  }

  // ── Textura de partícula: círculo suave ──────
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0,    'rgba(255,255,255,1)');
  grad.addColorStop(0.30, 'rgba(255,255,255,0.80)');
  grad.addColorStop(0.70, 'rgba(255,255,255,0.20)');
  grad.addColorStop(1,    'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  particleMaterial = new THREE.PointsMaterial({
    size: CONFIG.PARTICLE_SIZE,
    vertexColors: true,
    map: new THREE.CanvasTexture(canvas),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.88,
  });

  particleSystem = new THREE.Points(geometry, particleMaterial);
  scene.add(particleSystem);
}

// ── Integrador principal ─────────────────────
// Interpola posiciones y colores hacia sus targets con inercia.
export function integrateParticles() {
  const lerpSpeed = CONFIG.LERP_SPEED;
  const damping   = CONFIG.VELOCITY_DAMPING;
  const posArr = geometry.attributes.position.array;
  const colArr = geometry.attributes.color.array;

  for (let i = 0; i < N3; i++) {
    const delta = targetPositions[i] - posArr[i];
    velocities[i] = velocities[i] * damping + delta * lerpSpeed;
    posArr[i] += velocities[i];
    colArr[i] += (targetColors[i] - colArr[i]) * 0.06;
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.color.needsUpdate    = true;
}