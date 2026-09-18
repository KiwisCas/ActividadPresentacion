// ─────────────────────────────────────────────
//  ABSTRACT CLOSING FORM
//  Construye una forma cromática abstracta sin texto ni
//  geometría legible y la convierte en partículas.
// ─────────────────────────────────────────────

import { CONFIG } from './config.js';
import { setClosingForm } from './slideManager.js';

const N = CONFIG.TOTAL_PARTICLES;

function smoothstep(edge0, edge1, value) {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function loadClosingForm() {
  const { positions, colors } = _buildMark();
  setClosingForm(positions, colors);
  return Promise.resolve(positions);
}

function _buildMark() {
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const palette = [
    [0.00, 0.63, 0.91],
    [0.93, 0.16, 0.22],
    [0.94, 0.47, 0.71],
  ];
  const armCount = 3;
  const particlesPerArm = Math.ceil(N / armCount);

  for (let i = 0; i < N; i++) {
    const arm = i % armCount;
    const along = Math.floor(i / armCount) / particlesPerArm;
    const radius = 1.2 + along * 21;
    const angle = arm * (Math.PI * 2 / armCount) + along * Math.PI * 2.35;
    const thickness = (Math.sin(i * 12.9898) * 0.5 + 0.5) * 2.8 - 1.4;
    const depth = (Math.cos(i * 78.233) * 0.5 + 0.5) * 3.5 - 1.75;
    const centerGlow = 1 - smoothstep(0.02, 0.25, along);
    const px = Math.cos(angle) * (radius + thickness);
    const py = Math.sin(angle) * (radius + thickness) * 0.62;

    positions[i * 3] = px;
    positions[i * 3 + 1] = py;
    positions[i * 3 + 2] = depth + Math.sin(angle * 2) * centerGlow * 2;

    const color = palette[arm];
    colors[i * 3] = color[0] + (0.95 - color[0]) * centerGlow * 0.7;
    colors[i * 3 + 1] = color[1] + (0.95 - color[1]) * centerGlow * 0.7;
    colors[i * 3 + 2] = color[2] + (0.95 - color[2]) * centerGlow * 0.7;
  }

  return { positions, colors };
}
