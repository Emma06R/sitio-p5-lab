/* Proyecto: Nave vectorial y proyectiles 2D
 * VERSIÓN WEB (p5.js) del programa original de Python + Pygame
 * (ver python/trabajos_graficacion.py). Usa la misma lógica:
 * modelo local del triángulo -> escala -> rotación -> traslación,
 * avance vectorial con seno y coseno, pantalla envolvente y disparos con cooldown.
 */

var ANCHO = 800;
var ALTO = 600;

// Modelo de la nave: triángulo en coordenadas LOCALES (centrado en el origen)
var modeloTriangulo = [[0, -25], [-15, 15], [15, 15]];

// Variables de estado de la nave
var posX = 400.0;
var posY = 300.0;
var angulo = 0.0;
var VELOCIDAD_NAVE = 4.0;
var VELOCIDAD_GIRO = 4.5;
var ESCALA = 1.0;

// Estructura y control de disparo
var proyectiles = [];
var ultimoDisparo = 0;
var COOLDOWN_DISPARO = 250; // milisegundos entre disparos
var VELOCIDAD_PROYECTIL = 9.0;

// Los controles solo se activan después de hacer clic en el lienzo,
// para que las flechas y la barra espaciadora no desplacen la página.
var controlesActivos = false;

// Transformación geométrica 2D: escala, rotación y traslación de un vértice
function transformarVertice(vertice, px, py, anguloGrados, escala) {
  var x = vertice[0] * escala;           // escalamiento
  var y = vertice[1] * escala;
  var rad = radians(anguloGrados);       // rotación
  var xRot = x * Math.cos(rad) - y * Math.sin(rad);
  var yRot = x * Math.sin(rad) + y * Math.cos(rad);
  return [xRot + px, yRot + py];         // traslación a la pantalla
}

// Módulo que siempre da un resultado positivo (como el % de Python)
function modulo(a, n) {
  return ((a % n) + n) % n;
}

function setup() {
  var lienzo = createCanvas(ANCHO, ALTO);
  lienzo.parent('lienzo');
  lienzo.elt.setAttribute('tabindex', '0');

  lienzo.mousePressed(function () { controlesActivos = true; actualizarAviso(); });
  document.addEventListener('mousedown', function (e) {
    if (e.target !== lienzo.elt) { controlesActivos = false; actualizarAviso(); }
  });
  // Evita el desplazamiento de la página con las teclas del juego
  window.addEventListener('keydown', function (e) {
    if (controlesActivos && [32, 37, 38, 39, 40].indexOf(e.keyCode) !== -1) e.preventDefault();
  });
  document.getElementById('btn-reiniciar').addEventListener('click', function () {
    posX = 400.0; posY = 300.0; angulo = 0.0; proyectiles = [];
  });
  actualizarAviso();
}

function actualizarAviso() {
  var aviso = document.getElementById('aviso-controles');
  if (aviso) {
    aviso.textContent = controlesActivos
      ? 'Controles activados. Haz clic fuera del lienzo para soltarlos.'
      : 'Haz clic en el lienzo para activar los controles.';
  }
}

function draw() {
  // 1. Limpieza de pantalla (fondo oscuro)
  background(25, 25, 35);

  // 2. Lectura de controles por teclado
  var tiempoActual = millis();
  var izquierda = keyIsDown(65) || keyIsDown(LEFT_ARROW);   // A o flecha izquierda
  var derecha = keyIsDown(68) || keyIsDown(RIGHT_ARROW);    // D o flecha derecha
  var avanzar = keyIsDown(87) || keyIsDown(UP_ARROW);       // W o flecha arriba
  var disparar = keyIsDown(32);                             // barra espaciadora

  if (controlesActivos) {
    // Rotación sobre su propio centro
    if (izquierda) angulo -= VELOCIDAD_GIRO;
    if (derecha) angulo += VELOCIDAD_GIRO;

    // Avance vectorial continuo en la dirección de la proa
    if (avanzar) {
      var rad = radians(angulo);
      posX += Math.sin(rad) * VELOCIDAD_NAVE;
      posY -= Math.cos(rad) * VELOCIDAD_NAVE;
    }
  }

  // Pantalla envolvente (screen wrapping)
  posX = modulo(posX, ANCHO);
  posY = modulo(posY, ALTO);

  // Generación de proyectiles con tiempo de espera entre disparos
  if (controlesActivos && disparar && tiempoActual - ultimoDisparo >= COOLDOWN_DISPARO) {
    var punta = transformarVertice(modeloTriangulo[0], posX, posY, angulo, ESCALA);
    var r = radians(angulo);
    proyectiles.push({
      x: punta[0],
      y: punta[1],
      vx: Math.sin(r) * VELOCIDAD_PROYECTIL,
      vy: -Math.cos(r) * VELOCIDAD_PROYECTIL
    });
    ultimoDisparo = tiempoActual;
  }

  // 3. Actualización de proyectiles: se descartan los que salen del lienzo
  var activos = [];
  for (var i = 0; i < proyectiles.length; i++) {
    var p = proyectiles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x >= 0 && p.x <= ANCHO && p.y >= 0 && p.y <= ALTO) activos.push(p);
  }
  proyectiles = activos;

  // 4. Dibujo de la nave (solo contorno, 2 px)
  noFill();
  stroke(0, 255, 180);
  strokeWeight(2);
  beginShape();
  for (var k = 0; k < modeloTriangulo.length; k++) {
    var v = transformarVertice(modeloTriangulo[k], posX, posY, angulo, ESCALA);
    vertex(v[0], v[1]);
  }
  endShape(CLOSE);

  // Dibujo de proyectiles
  noStroke();
  fill(255, 220, 50);
  for (var j = 0; j < proyectiles.length; j++) {
    ellipse(Math.trunc(proyectiles[j].x), Math.trunc(proyectiles[j].y), 6, 6);
  }

  // Datos en vivo (fuera del lienzo)
  var datos = document.getElementById('datos');
  if (datos) {
    datos.textContent = 'x: ' + posX.toFixed(1) + ' · y: ' + posY.toFixed(1) +
      ' · ángulo: ' + angulo.toFixed(1) + '° · proyectiles activos: ' + proyectiles.length;
  }
}
