// ==============================================================================
// Elaborado por: Ramírez Cruz Josué Emmanuel
// Práctica: Pipeline 3D (vértices, aristas, transformaciones y proyección)
// ==============================================================================

// ==============================================================================
// 1. CONFIGURACIÓN DEL CANVAS Y CENTRO DE PANTALLA
// ==============================================================================
const canvas = document.getElementById('lienzo3D');
const ctx = canvas.getContext('2d');
const CENTRO_X = canvas.width / 2;
const CENTRO_Y = canvas.height / 2;

// ==============================================================================
// PARTE 3: PALETA DE COLORES PROPIA (atardecer neón: violeta, rosa y ámbar)
// ==============================================================================
const PALETA = {
    ejes:        '#3b2f5c',   // ejes cartesianos de guía
    aristaLejos: '#7c6cf0',   // arista más lejana de la cámara (violeta)
    aristaCerca: '#ff5fa2',   // arista más cercana a la cámara (rosa)
    vertice:     '#ffc857'    // vértices (ámbar)
};

// ==============================================================================
// 2. TEMAS 3.1 & 3.2: GEOMETRÍA TRIDIMENSIONAL (CATÁLOGO DE FIGURAS LOCALES)
// ==============================================================================
// Cada figura se define con dos estructuras:
//   - vertices: lista de puntos {x, y, z} centrados en el origen (0,0,0)
//   - aristas:  pares de índices [i, j] que indican qué vértices se unen con una línea
// En el eje Y, un valor positivo apunta ARRIBA (se invierte al proyectar, ver sección 4).

// Constantes auxiliares para el prisma triangular (triángulo equilátero de lado L)
const L_PRISMA = 160;
const H_PRISMA = L_PRISMA * Math.sqrt(3) / 2;   // altura del triángulo ≈ 138.56

const FIGURAS = {

    // ----- Cubo original (8 vértices, 12 aristas) -----
    cubo: {
        nombre: 'Cubo',
        vertices: [
            {x: -80, y: -80, z: -80}, // V0
            {x:  80, y: -80, z: -80}, // V1
            {x:  80, y:  80, z: -80}, // V2
            {x: -80, y:  80, z: -80}, // V3
            {x: -80, y: -80, z:  80}, // V4
            {x:  80, y: -80, z:  80}, // V5
            {x:  80, y:  80, z:  80}, // V6
            {x: -80, y:  80, z:  80}  // V7
        ],
        aristas: [
            [0, 1], [1, 2], [2, 3], [3, 0],     // cara Z = -80
            [4, 5], [5, 6], [6, 7], [7, 4],     // cara Z = +80
            [0, 4], [1, 5], [2, 6], [3, 7]      // aristas que unen ambas caras
        ]
    },

    // ----- OPCIÓN A: Pirámide de base cuadrada (5 vértices, 8 aristas) -----
    // Base cuadrada de lado 160 y altura 160. El origen es el centroide:
    // en una pirámide el centroide queda a 1/4 de la altura desde la base,
    // por eso la base está en y = -40 y el vértice (ápice) en y = +120.
    piramide: {
        nombre: 'Pirámide de base cuadrada',
        vertices: [
            {x: -80, y: -40, z: -80}, // V0: base trasera izquierda
            {x:  80, y: -40, z: -80}, // V1: base trasera derecha
            {x:  80, y: -40, z:  80}, // V2: base frontal derecha
            {x: -80, y: -40, z:  80}, // V3: base frontal izquierda
            {x:   0, y: 120, z:   0}  // V4: ápice (punta)
        ],
        aristas: [
            [0, 1], [1, 2], [2, 3], [3, 0],     // 4 aristas de la base
            [0, 4], [1, 4], [2, 4], [3, 4]      // 4 aristas laterales hacia el ápice
        ]
    },

    // ----- OPCIÓN B: Prisma triangular (6 vértices, 9 aristas) -----
    // Dos triángulos equiláteros (lado 160) separados 160 en el eje Z.
    // El origen es el centroide: el triángulo tiene su centro a 1/3 de la altura.
    prisma: {
        nombre: 'Prisma triangular',
        vertices: [
            {x:    0,       y:  2 * H_PRISMA / 3, z: -80}, // V0: triángulo trasero, punta
            {x: -L_PRISMA/2, y: -H_PRISMA / 3,    z: -80}, // V1: triángulo trasero, izquierda
            {x:  L_PRISMA/2, y: -H_PRISMA / 3,    z: -80}, // V2: triángulo trasero, derecha
            {x:    0,       y:  2 * H_PRISMA / 3, z:  80}, // V3: triángulo frontal, punta
            {x: -L_PRISMA/2, y: -H_PRISMA / 3,    z:  80}, // V4: triángulo frontal, izquierda
            {x:  L_PRISMA/2, y: -H_PRISMA / 3,    z:  80}  // V5: triángulo frontal, derecha
        ],
        aristas: [
            [0, 1], [1, 2], [2, 0],             // triángulo trasero
            [3, 4], [4, 5], [5, 3],             // triángulo frontal
            [0, 3], [1, 4], [2, 5]              // 3 aristas que unen ambos triángulos
        ]
    },

    // ----- OPCIÓN C: Octaedro (6 vértices, 12 aristas) -----
    // Un vértice sobre cada semieje (±X, ±Y, ±Z) a distancia 110 del origen.
    // Cada vértice se une con los 4 que NO son su opuesto (4 × 6 / 2 = 12 aristas).
    octaedro: {
        nombre: 'Octaedro',
        vertices: [
            {x:  110, y:    0, z:    0}, // V0: +X
            {x: -110, y:    0, z:    0}, // V1: -X
            {x:    0, y:  110, z:    0}, // V2: +Y (arriba)
            {x:    0, y: -110, z:    0}, // V3: -Y (abajo)
            {x:    0, y:    0, z:  110}, // V4: +Z
            {x:    0, y:    0, z: -110}  // V5: -Z
        ],
        aristas: [
            [2, 0], [2, 4], [2, 1], [2, 5],     // 4 aristas desde el vértice de arriba
            [3, 0], [3, 4], [3, 1], [3, 5],     // 4 aristas desde el vértice de abajo
            [0, 4], [4, 1], [1, 5], [5, 0]      // 4 aristas del "ecuador" (cuadrado en XZ)
        ]
    }
};

// Figura activa: se sustituye cuando el usuario elige otra en el menú.
// (modeloCuboLocal y aristasPrimitiva conservan los nombres de la práctica.)
let modeloCuboLocal  = FIGURAS.cubo.vertices;
let aristasPrimitiva = FIGURAS.cubo.aristas;

// ==============================================================================
// 3. TEMA 3.3: PIPELINE DE TRANSFORMACIONES TRIDIMENSIONALES
// ==============================================================================
function transformarVertice3D(v, params) {
    let { tx, ty, tz, sx, sy, sz, rx, ry, rz, shxy, shxz } = params;

    // Convertir ángulos a radianes
    let radX = rx * Math.PI / 180;
    let radY = ry * Math.PI / 180;
    let radZ = rz * Math.PI / 180;

    // --- 3.3.2 ESCALAMIENTO (S) ---
    let x1 = v.x * sx;
    let y1 = v.y * sy;
    let z1 = v.z * sz;

    // --- 3.3.4 SESGADO / SHEAR (Sh) ---
    let x2 = x1 + (shxy * y1) + (shxz * z1);
    let y2 = y1;
    let z2 = z1;

    // --- 3.3.3 ROTACIÓN EN EJE X (Pitch) ---
    let x3 = x2;
    let y3 = y2 * Math.cos(radX) - z2 * Math.sin(radX);
    let z3 = y2 * Math.sin(radX) + z2 * Math.cos(radX);

    // --- 3.3.3 ROTACIÓN EN EJE Y (Yaw) ---
    let x4 = x3 * Math.cos(radY) + z3 * Math.sin(radY);
    let y4 = y3;
    let z4 = -x3 * Math.sin(radY) + z3 * Math.cos(radY);

    // --- 3.3.3 ROTACIÓN EN EJE Z (Roll) ---
    let x5 = x4 * Math.cos(radZ) - y4 * Math.sin(radZ);
    let y5 = x4 * Math.sin(radZ) + y4 * Math.cos(radZ);
    let z5 = z4;

    // --- 3.3.1 TRASLACIÓN (T) ---
    let xFinal = x5 + tx;
    let yFinal = y5 + ty;
    let zFinal = z5 + tz;

    return { x: xFinal, y: yFinal, z: zFinal };
}

// ==============================================================================
// 4. TEMA 3.1: PROYECCIÓN PERSPECTIVA (3D A PANTALLA 2D)
// ==============================================================================
// distanciaCamara ahora es una variable global para poder modificarla con el
// deslizador "Distancia de la cámara" (Parte 2, pregunta 1). Valor original: 500.
let distanciaCamara = 500;

function proyectar3Da2D(v3d) {
    let zAjustado = v3d.z + distanciaCamara;
    if (zAjustado < 1) zAjustado = 1;

    // Factor de escala por perspectiva (división entre Z)
    let factorProyeccion = distanciaCamara / zAjustado;

    // Mapeo a píxeles en el lienzo
    let x2d = CENTRO_X + (v3d.x * factorProyeccion);
    let y2d = CENTRO_Y - (v3d.y * factorProyeccion); // Inversión en eje Y

    // Además de (x, y) se devuelven z y el factor: sirven para colorear y
    // para variar el grosor de las líneas según la distancia (Parte 3).
    return { x: x2d, y: y2d, z: v3d.z, factor: factorProyeccion };
}

// ==============================================================================
// PARTE 3 (auxiliares de estilo)
// ==============================================================================
// Mezcla lineal entre dos colores hexadecimales. t = 0 → colorA, t = 1 → colorB.
function mezclarColores(colorA, colorB, t) {
    const a = parseInt(colorA.slice(1), 16);
    const b = parseInt(colorB.slice(1), 16);
    const canal = (desplazamiento) => {
        const ca = (a >> desplazamiento) & 255;
        const cb = (b >> desplazamiento) & 255;
        return Math.round(ca + (cb - ca) * t);
    };
    return `rgb(${canal(16)}, ${canal(8)}, ${canal(0)})`;
}

// ==============================================================================
// 5. BUCLE DE RENDERIZADO EN TIEMPO REAL
// ==============================================================================
function renderizar() {
    // 1. Obtener parámetros del panel
    const params = {
        tx: parseFloat(document.getElementById('tx').value),
        ty: parseFloat(document.getElementById('ty').value),
        tz: parseFloat(document.getElementById('tz').value),
        sx: parseFloat(document.getElementById('sx').value),
        sy: parseFloat(document.getElementById('sy').value),
        sz: parseFloat(document.getElementById('sz').value),
        rx: parseFloat(document.getElementById('rx').value),
        ry: parseFloat(document.getElementById('ry').value),
        rz: parseFloat(document.getElementById('rz').value),
        shxy: parseFloat(document.getElementById('shxy').value),
        shxz: parseFloat(document.getElementById('shxz').value)
    };
    distanciaCamara = parseFloat(document.getElementById('dist').value);

    // 2. Actualizar indicadores numéricos
    document.getElementById('valTx').innerText = params.tx;
    document.getElementById('valTy').innerText = params.ty;
    document.getElementById('valTz').innerText = params.tz;
    document.getElementById('valSx').innerText = params.sx.toFixed(1);
    document.getElementById('valSy').innerText = params.sy.toFixed(1);
    document.getElementById('valSz').innerText = params.sz.toFixed(1);
    document.getElementById('valRx').innerText = params.rx + '°';
    document.getElementById('valRy').innerText = params.ry + '°';
    document.getElementById('valRz').innerText = params.rz + '°';
    document.getElementById('valShXY').innerText = params.shxy.toFixed(1);
    document.getElementById('valShXZ').innerText = params.shxz.toFixed(1);
    document.getElementById('valDist').innerText = distanciaCamara;

    // 3. Limpiar lienzo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 4. Dibujar ejes cartesianos de guía
    ctx.strokeStyle = PALETA.ejes;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(CENTRO_X, 0); ctx.lineTo(CENTRO_X, canvas.height);
    ctx.moveTo(0, CENTRO_Y); ctx.lineTo(canvas.width, CENTRO_Y);
    ctx.stroke();

    // 5. Aplicar transformaciones 3D
    let verticesTransformados = modeloCuboLocal.map(v => transformarVertice3D(v, params));

    // 6. Proyectar a coordenadas 2D
    let vertices2D = verticesTransformados.map(proyectar3Da2D);

    // 7. Renderizar aristas
    //    - Color: se mezcla entre violeta (lejos) y rosa (cerca) según la profundidad.
    //    - Grosor: proporcional al factor de proyección (escala): lo cercano se ve más grueso.
    //    Se dibujan primero las más lejanas para que las cercanas queden encima.
    const zMin = Math.min(...verticesTransformados.map(v => v.z));
    const zMax = Math.max(...verticesTransformados.map(v => v.z));
    const rangoZ = (zMax - zMin) || 1;

    const aristasOrdenadas = aristasPrimitiva
        .map(([i, j]) => ({ i, j, zProm: (vertices2D[i].z + vertices2D[j].z) / 2 }))
        .sort((a, b) => b.zProm - a.zProm);      // de la más lejana a la más cercana

    for (let { i, j, zProm } of aristasOrdenadas) {
        let p1 = vertices2D[i];
        let p2 = vertices2D[j];
        let cercania = 1 - (zProm - zMin) / rangoZ;   // 0 = lejos, 1 = cerca (z menor = más cerca)
        let factorProm = (p1.factor + p2.factor) / 2;

        ctx.strokeStyle = mezclarColores(PALETA.aristaLejos, PALETA.aristaCerca, cercania);
        ctx.lineWidth = Math.max(1, 3 * factorProm);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }

    // 8. Renderizar vértices (círculos ámbar; el radio también depende de la escala)
    ctx.fillStyle = PALETA.vertice;
    for (let p of vertices2D) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(2, 4.5 * p.factor), 0, Math.PI * 2);
        ctx.fill();
    }
}

// ==============================================================================
// 6. SELECTOR DE FIGURA (PARTE 1)
// ==============================================================================
const selectorFigura = document.getElementById('figura');

function cambiarFigura() {
    const figura = FIGURAS[selectorFigura.value];
    modeloCuboLocal  = figura.vertices;
    aristasPrimitiva = figura.aristas;
    document.getElementById('infoFigura').innerText =
        `${figura.nombre}: ${figura.vertices.length} vértices y ${figura.aristas.length} aristas`;
    renderizar();
}
selectorFigura.addEventListener('change', cambiarFigura);

// ==============================================================================
// 7. RETO: BOTÓN DE AUTO-ROTACIÓN (requestAnimationFrame)
// ==============================================================================
const botonAuto = document.getElementById('btnAuto');
const deslizadorYaw = document.getElementById('ry');
const VELOCIDAD_YAW = 60;          // grados por segundo
let autoRotando = false;
let anguloYaw = 0;                 // ángulo con decimales (el deslizador solo guarda enteros)
let tiempoAnterior = 0;
let idAnimacion = null;

function animarYaw(tiempoActual) {
    if (!autoRotando) return;
    // Se usa el tiempo transcurrido para que la velocidad sea igual en cualquier pantalla
    const delta = (tiempoActual - tiempoAnterior) / 1000;
    tiempoAnterior = tiempoActual;

    anguloYaw += VELOCIDAD_YAW * delta;
    if (anguloYaw > 180) anguloYaw -= 360;       // el deslizador va de -180 a 180
    deslizadorYaw.value = Math.round(anguloYaw);
    renderizar();

    idAnimacion = requestAnimationFrame(animarYaw);
}

function alternarAutoRotacion() {
    autoRotando = !autoRotando;
    botonAuto.innerText = autoRotando ? '⏸ Detener auto-rotación' : '▶ Auto-rotación (Yaw)';
    botonAuto.classList.toggle('activo', autoRotando);
    if (autoRotando) {
        anguloYaw = parseFloat(deslizadorYaw.value);   // continúa desde donde está el deslizador
        tiempoAnterior = performance.now();
        idAnimacion = requestAnimationFrame(animarYaw);
    } else {
        cancelAnimationFrame(idAnimacion);
    }
}
botonAuto.addEventListener('click', alternarAutoRotacion);

// Si el usuario mueve el deslizador Yaw a mano durante la animación, se continúa desde ahí
deslizadorYaw.addEventListener('input', () => { anguloYaw = parseFloat(deslizadorYaw.value); });

// ==============================================================================
// 8. EVENTOS Y EJECUCIÓN INICIAL
// ==============================================================================
// Escuchar cambios en los deslizadores para refrescar en tiempo real
document.querySelectorAll('input[type=range]').forEach(input => {
    input.addEventListener('input', renderizar);
});

// Ejecución inicial
cambiarFigura();
