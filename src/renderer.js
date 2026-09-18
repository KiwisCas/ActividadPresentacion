// ─────────────────────────────────────────────
//  RENDERER — Escena Three.js y loop principal
// ─────────────────────────────────────────────

import * as THREE from 'three';
import { CONFIG } from './config.js';
import { initParticles, integrateParticles } from './particles.js';
import { updateSlides } from './slideManager.js';

export const clock = new THREE.Clock();

let scene;
let camera;
let renderer;
let animationFrame;

export function initRenderer(container) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x04060e);

  camera = new THREE.PerspectiveCamera(
    CONFIG.CAMERA_FOV,
    window.innerWidth / window.innerHeight,
    CONFIG.CAMERA_NEAR,
    CONFIG.CAMERA_FAR,
  );
  camera.position.set(0, CONFIG.CAMERA_Y, CONFIG.CAMERA_Z);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  initParticles(scene);
  window.addEventListener('resize', _handleResize);
}

export function startLoop() {
  function frame() {
    animationFrame = requestAnimationFrame(frame);
    const time = clock.getElapsedTime();
    updateSlides(time);
    integrateParticles();
    renderer.render(scene, camera);
  }

  frame();
}

function _handleResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

export function stopLoop() {
  if (animationFrame) cancelAnimationFrame(animationFrame);
}
