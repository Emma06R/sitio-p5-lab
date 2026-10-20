/* Proyecto: El sol que explota
 * Código original de Khan Academy adaptado a p5.js estándar:
 * se crea el lienzo de 400 x 400 px dentro de setup() y los botones
 * permiten pausar y reiniciar la animación.
 */

var sunSize = 30;
var sunY = 298;

function setup() {
  var lienzo = createCanvas(400, 400);
  lienzo.parent('lienzo');

  var pausa = document.getElementById('btn-pausa');
  pausa.addEventListener('click', function () {
    if (isLooping()) { noLoop(); pausa.textContent = 'Reanudar'; }
    else { loop(); pausa.textContent = 'Pausar'; }
  });

  document.getElementById('btn-reiniciar').addEventListener('click', function () {
    sunSize = 30;
    sunY = 298;
    if (!isLooping()) { redraw(); }
  });
}

function draw() {
  noStroke();
  background(82, 222, 240);

  fill(255, 204, 0);
  ellipse(200, sunY, sunSize, sunSize);

  fill(76, 168, 67);
  rect(0, 300, 400, 100);

  sunY = sunY - 0.6;
  sunSize = sunSize + 1;
}
