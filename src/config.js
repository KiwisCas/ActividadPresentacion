// ─────────────────────────────────────────────
//  CONFIG — Parámetros globales del sistema
//  Todos los valores tuneables están aquí.
// ─────────────────────────────────────────────

export const CONFIG = {
  // Partículas
  TOTAL_PARTICLES: 6500,
  PARTICLE_SIZE: 1.15,

  // Interpolación
  LERP_SPEED: 0.055,         // Qué tan rápido siguen los targets (0.01 lento – 0.15 rápido)
  VELOCITY_DAMPING: 0.88,    // Amortiguación de la velocidad residual (inercia)

  // Transiciones
  TRANSITION_DURATION: 1.8,  // Segundos que dura el blend entre slides

  // Cámara
  CAMERA_FOV: 60,
  CAMERA_NEAR: 0.1,
  CAMERA_FAR: 1000,
  CAMERA_Z: 52,
  CAMERA_Y: 18,

  // Ruido Perlin (semilla fija para reproducibilidad)
  NOISE_SEED: 42,

  // Paleta corporativa Fórum UPB
  COLORS: {
    BLUE:       [0.000, 0.627, 0.914],  // #00A0E9 – Academia / estructura
    RED:        [0.890, 0.024, 0.075],  // #E30613 – Industria / energía
    PINK:       [0.941, 0.471, 0.706],  // #F078B4 – Nueva generación / emergencia
    DARK_BLUE:  [0.000, 0.267, 0.467],  // #004477 – Trayectoria / marco
    WHITE:      [0.950, 0.970, 1.000],  // Blanco puro brillante
    VIOLET:     [0.518, 0.173, 0.729],  // #8440BA – Mezcla / co-creación
    NEAR_BLACK: [0.035, 0.055, 0.090],  // Masa rígida / resistencia
  },

  // Número de slides (13 slides según el guión oficial TED Talk)
  SLIDE_COUNT: 13,
};