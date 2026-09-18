// ─────────────────────────────────────────────
//  NOISE — Perlin 3D clásico
//  Implementación sobre enteros puros, sin objetos.
//  API: noise3(x, y, z) → [-1, 1]
// ─────────────────────────────────────────────

const P = new Uint8Array(512);

(function buildTable(seed) {
  const base = new Uint8Array(256);
  for (let i = 0; i < 256; i++) base[i] = i;
  // Fisher-Yates con PRNG determinista
  let s = seed >>> 0;
  function rand() {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return (s >>> 0) / 4294967296;
  }
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [base[i], base[j]] = [base[j], base[i]];
  }
  for (let i = 0; i < 512; i++) P[i] = base[i & 255];
})(42);

function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a, b, t) { return a + t * (b - a); }

function grad(hash, x, y, z) {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
}

export function noise3(x, y, z) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);
  const u = fade(x), v = fade(y), w = fade(z);
  const A = P[X] + Y, AA = P[A] + Z, AB = P[A + 1] + Z;
  const B = P[X + 1] + Y, BA = P[B] + Z, BB = P[B + 1] + Z;
  return lerp(
    lerp(
      lerp(grad(P[AA], x, y, z),     grad(P[BA], x - 1, y, z),     u),
      lerp(grad(P[AB], x, y - 1, z), grad(P[BB], x - 1, y - 1, z), u), v),
    lerp(
      lerp(grad(P[AA+1], x, y, z-1),     grad(P[BA+1], x-1, y, z-1),     u),
      lerp(grad(P[AB+1], x, y-1, z-1),   grad(P[BB+1], x-1, y-1, z-1),   u), v), w);
}

// Octavas de Perlin (más detalle)
export function fbm3(x, y, z, octaves = 3) {
  let val = 0, amp = 0.5, freq = 1, max = 0;
  for (let o = 0; o < octaves; o++) {
    val += noise3(x * freq, y * freq, z * freq) * amp;
    max += amp;
    amp *= 0.5;
    freq *= 2.0;
  }
  return val / max;
}