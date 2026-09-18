// --- CONFIGURACIÓN DE ESCENA Y RENDERIZADOR ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, 55);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// --- ESTADO GLOBAL Y CONTROLES ---
let currentSlide = 1; // Presiona '1' o '2' para transicionar sin cortes

const TOTAL_PARTICLES = 5000;
const RAIL_COUNT = 2000;
const BRIDGE_COUNT = TOTAL_PARTICLES - RAIL_COUNT;

const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(TOTAL_PARTICLES * 3);
const targetPositions = new Float32Array(TOTAL_PARTICLES * 3);
const colors = new Float32Array(TOTAL_PARTICLES * 3);
const targetColors = new Float32Array(TOTAL_PARTICLES * 3);

// Paleta oficial (IMEX / Fórum)[cite: 2]
const blueColor = new THREE.Color(0x00a0e9);
const redColor = new THREE.Color(0xe30613);
const pinkColor = new THREE.Color(0xf078b4);

// Parámetros estáticos asignados por partícula
const railJitter = new Float32Array(RAIL_COUNT * 3);
const bridgeT = new Float32Array(BRIDGE_COUNT);
const bridgeIDs = new Int32Array(BRIDGE_COUNT);

// Parámetros para la gota y emisión (Slide 2)
const dropSeedR = new Float32Array(TOTAL_PARTICLES);
const dropSeedAngle = new Float32Array(TOTAL_PARTICLES);
const escapeProgress = new Float32Array(TOTAL_PARTICLES);

const TOTAL_BRIDGES = 14;

for (let i = 0; i < TOTAL_PARTICLES; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    dropSeedR[i] = Math.random();
    dropSeedAngle[i] = Math.random() * Math.PI * 2;
    escapeProgress[i] = Math.random();

    if (i < RAIL_COUNT) {
        let r = Math.random() * 0.7;
        let theta = Math.random() * Math.PI * 2;
        railJitter[i * 3] = Math.cos(theta) * r;
        railJitter[i * 3 + 1] = Math.sin(theta) * r;
        railJitter[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    } else {
        let bIdx = i - RAIL_COUNT;
        bridgeIDs[bIdx] = bIdx % TOTAL_BRIDGES;
        bridgeT[bIdx] = Math.random(); // Distribución fija a lo largo del puente para no romper la barra
    }

    colors[i * 3] = blueColor.r;
    colors[i * 3 + 1] = blueColor.g;
    colors[i * 3 + 2] = blueColor.b;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Textura suave circular
const canvas = document.createElement('canvas');
canvas.width = 64;
canvas.height = 64;
const ctx = canvas.getContext('2d');
const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
grad.addColorStop(0, 'rgba(255,255,255,1)');
grad.addColorStop(0.3, 'rgba(255,255,255,0.8)');
grad.addColorStop(1, 'rgba(255,255,255,0)');
ctx.fillStyle = grad;
ctx.beginPath();
ctx.arc(32, 32, 32, 0, Math.PI * 2);
ctx.fill();

const particleMaterial = new THREE.PointsMaterial({
    size: 0.9,
    vertexColors: true,
    map: new THREE.CanvasTexture(canvas),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const particleSystem = new THREE.Points(geometry, particleMaterial);
scene.add(particleSystem);

const clock = new THREE.Clock();

// --- LÓGICA DE DIAPOSITIVAS ---
function updateParticleTargets(time) {
    if (currentSlide === 1) {
        updateSlide1(time);
    } else {
        updateSlide2(time);
    }
}

// -------------------------------------------------------------
// IDEA 1: ADN CON RIELES Y PUENTES SOLIDOS (REPARADO)
// -------------------------------------------------------------
function updateSlide1(time) {
    const lengthX = 46;
    const baseAmplitude = 9.5;
    const frequency = 0.20;
    const rollSpeed = time * 0.35;

    for (let i = 0; i < TOTAL_PARTICLES; i++) {
        let tx, ty, tz;
        let pColor = new THREE.Color();

        if (i < RAIL_COUNT) {
            // RIELES AZULES UNIFICADOS
            let normIndex = i / RAIL_COUNT;
            let x = (normIndex - 0.5) * lengthX;
            let isStrandA = i % 2 === 0;

            let phase = x * frequency + (isStrandA ? 0 : Math.PI);
            let rawY = Math.sin(phase) * baseAmplitude;
            let rawZ = Math.cos(phase) * baseAmplitude;

            tx = x + railJitter[i * 3];
            ty = (rawY + railJitter[i * 3 + 1]) * Math.cos(rollSpeed) - (rawZ + railJitter[i * 3 + 2]) * Math.sin(rollSpeed);
            tz = (rawY + railJitter[i * 3 + 1]) * Math.sin(rollSpeed) + (rawZ + railJitter[i * 3 + 2]) * Math.cos(rollSpeed);

            pColor.copy(blueColor);
        } else {
            // PUENTES REPARADOS (CONEXIÓN LÍNEA SÓLIDA RIEL A -> RIEL B)
            let bIdx = i - RAIL_COUNT;
            let bID = bridgeIDs[bIdx];
            let x = -lengthX * 0.40 + (bID / (TOTAL_BRIDGES - 1)) * (lengthX * 0.80);
            let phase = x * frequency;

            // Extremo Riel A
            let yA_raw = Math.sin(phase) * baseAmplitude;
            let zA_raw = Math.cos(phase) * baseAmplitude;
            let yA = yA_raw * Math.cos(rollSpeed) - zA_raw * Math.sin(rollSpeed);
            let zA = yA_raw * Math.sin(rollSpeed) + zA_raw * Math.cos(rollSpeed);

            // Extremo Riel B
            let yB_raw = Math.sin(phase + Math.PI) * baseAmplitude;
            let zB_raw = Math.cos(phase + Math.PI) * baseAmplitude;
            let yB = yB_raw * Math.cos(rollSpeed) - zB_raw * Math.sin(rollSpeed);
            let zB = yB_raw * Math.sin(rollSpeed) + zB_raw * Math.cos(rollSpeed);

            // Posicionamiento continuo sin ruptura
            let t = bridgeT[bIdx];
            tx = x;
            ty = THREE.MathUtils.lerp(yA, yB, t);
            tz = THREE.MathUtils.lerp(zA, zB, t);

            if (bID % 3 === 0) pColor.copy(redColor);
            else if (bID % 3 === 1) pColor.copy(pinkColor);
            else pColor.copy(t < 0.5 ? redColor : pinkColor);
        }

        targetPositions[i * 3] = tx + Math.sin(time * 2.0 + tx * 0.4) * 0.12;
        targetPositions[i * 3 + 1] = ty + Math.cos(time * 2.5 + ty * 0.6) * 0.12;
        targetPositions[i * 3 + 2] = tz + Math.sin(time * 1.8 + tz * 0.6) * 0.12;

        targetColors[i * 3] = pColor.r;
        targetColors[i * 3 + 1] = pColor.g;
        targetColors[i * 3 + 2] = pColor.b;
    }
}

// -------------------------------------------------------------
// IDEA 2: BOLA/GOTA DE PLASMA EN ÓRBITA + EMISIÓN EN ANILLO (REPARADO)[cite: 1]
// -------------------------------------------------------------
function updateSlide2(time) {
    const orbitRX = 20.0; // Radio mayor elíptico
    const orbitRZ = 10.0; // Radio menor elíptico (inclinación)
    const orbitSpeed = time * 0.4;

    for (let i = 0; i < TOTAL_PARTICLES; i++) {
        let tx, ty, tz;
        let pColor = new THREE.Color();

        // Escasez: Solo un par de partículas escapan (2%)[cite: 1]
        let isEscapingParticle = (i % 45 === 0);

        if (isEscapingParticle) {
            // --- PARTÍCULAS ROSAS QUE SALEN DE ÓRBITA HACIA AFUERA ---[cite: 1]
            escapeProgress[i] = (escapeProgress[i] + 0.0025) % 1.0;
            let progress = escapeProgress[i];

            let escapeAngle = dropSeedAngle[i] + orbitSpeed * 0.5;
            let currentRX = THREE.MathUtils.lerp(orbitRX * 0.4, orbitRX * 1.3, progress);
            let currentRZ = THREE.MathUtils.lerp(orbitRZ * 0.4, orbitRZ * 1.3, progress);

            tx = Math.cos(escapeAngle) * currentRX;
            ty = Math.sin(progress * Math.PI) * 2.0; // Vuelo leve en Y
            tz = Math.sin(escapeAngle) * currentRZ;

            pColor.copy(pinkColor); // Se vuelven rosa al desprenderse[cite: 1]

        } else {
            // --- GOTA / LÁGRIMA DE PLASMA AZUL VOLUMÉTRICA 3D ---[cite: 1]
            let dropAngle = orbitSpeed; // Posición de la gota en la órbita
            let u = dropSeedR[i]; // 0.0 (cola afilada) a 1.0 (cabeza ancha)

            // Geometría 3D de lágrima
            let dropLength = (u - 0.5) * 12.0;
            let dropRadius = Math.sin(u * Math.PI) * Math.pow(u, 0.5) * 3.5;

            // Orientación a lo largo de la tangente elíptica
            let cx = Math.cos(dropAngle) * orbitRX;
            let cz = Math.sin(dropAngle) * orbitRZ;

            let tanX = -Math.sin(dropAngle) * orbitRX;
            let tanZ = Math.cos(dropAngle) * orbitRZ;
            let len = Math.sqrt(tanX * tanX + tanZ * tanZ);
            tanX /= len; tanZ /= len;

            let normX = -tanZ;
            let normZ = tanX;

            // Volumen radial interno (Cuerpo esférico/gotiforme 3D)
            let localAngle = dropSeedAngle[i];
            let rVol = Math.sqrt(Math.random()) * dropRadius;
            let offsetX = Math.cos(localAngle) * rVol;
            let offsetY = Math.sin(localAngle) * rVol;

            tx = cx + tanX * dropLength + normX * offsetX;
            ty = offsetY;
            tz = cz + tanZ * dropLength + normZ * offsetX;

            pColor.copy(blueColor); // Azul plasma constante[cite: 1]
        }

        // Turbulencia interna fluida
        targetPositions[i * 3] = tx + Math.sin(time * 2.5 + i) * 0.15;
        targetPositions[i * 3 + 1] = ty + Math.cos(time * 3.0 + i) * 0.15;
        targetPositions[i * 3 + 2] = tz + Math.sin(time * 2.0 + i) * 0.15;

        targetColors[i * 3] = pColor.r;
        targetColors[i * 3 + 1] = pColor.g;
        targetColors[i * 3 + 2] = pColor.b;
    }
}

// --- BUCLE DE ANIMACIÓN E INTERPOLACIÓN ---
function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();
    updateParticleTargets(time);

    const posAttr = geometry.attributes.position;
    const colAttr = geometry.attributes.color;
    const currentPos = posAttr.array;
    const currentCol = colAttr.array;

    for (let i = 0; i < TOTAL_PARTICLES * 3; i++) {
        currentPos[i] += (targetPositions[i] - currentPos[i]) * 0.07;
        currentCol[i] += (targetColors[i] - currentCol[i]) * 0.07;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    renderer.render(scene, camera);
}

// Teclas 1 y 2 para transicionar
window.addEventListener('keydown', (e) => {
    if (e.key === '1') currentSlide = 1;
    if (e.key === '2') currentSlide = 2;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();