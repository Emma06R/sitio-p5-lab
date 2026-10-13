/* Proyecto: Muñeco de nieve que saluda
 * Código original de Khan Academy adaptado a p5.js estándar:
 * se envuelve en setup() y se crea el lienzo de 400 x 400 px.
 */

var saludando = false;

// Dibuja la escena; (manoX, manoY) es el punto donde se juntan los brazos.
function escena(manoX, manoY) {
  background(255);
  rect(0, 330, 400, 100);
  ellipse(200, 300, 150, 150);
  ellipse(200, 200, 100, 100);
  ellipse(200, 120, 75, 75);
  line(160, 200, manoX, manoY);
  line(240, 200, manoX, manoY);
}

function setup() {
  var lienzo = createCanvas(400, 400);
  lienzo.parent('lienzo');
  noLoop();

  var boton = document.getElementById('btn-saludar');
  boton.addEventListener('click', function () {
    saludando = !saludando;
    boton.textContent = saludando ? 'Detener saludo' : 'Saludar';
    if (saludando) { loop(); } else { redraw(); }
  });
}

function draw() {
  if (!saludando) {
    escena(50, 50);              // dibujo original
    return;
  }
  var t = frameCount * 0.12;
  escena(50 + 30 * sin(t), 50 + 12 * cos(t * 2));   // la mano se mueve
}
