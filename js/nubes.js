/* Proyecto: Nubes que se separan
 * Código original de Khan Academy adaptado a p5.js estándar:
 * se crea el lienzo de 400 x 400 px dentro de setup() y los botones
 * permiten pausar y reiniciar la animación.
 */

var leftX = 150;
var rightX = 290;
var sunRadius = 90;

function setup() {
  var lienzo = createCanvas(400, 400);
  lienzo.parent('lienzo');
  noStroke();

  var pausa = document.getElementById('btn-pausa');
  pausa.addEventListener('click', function () {
    if (isLooping()) { noLoop(); pausa.textContent = 'Reanudar'; }
    else { loop(); pausa.textContent = 'Pausar'; }
  });

  document.getElementById('btn-reiniciar').addEventListener('click', function () {
    leftX = 150;
    rightX = 290;
    sunRadius = 90;
    if (!isLooping()) { redraw(); }
  });
}

function draw() {
  background(184, 236, 255);

  fill(255, 170, 0);
  ellipse(200, 100, sunRadius, sunRadius);

  // clouds
  fill(255, 255, 255);
  // left cloud
  ellipse(leftX, 150, 126, 97);
  ellipse(leftX + 62, 150, 70, 60);
  ellipse(leftX - 62, 150, 70, 60);

  // right cloud
  ellipse(rightX, 100, 126, 97);
  ellipse(rightX + 62, 100, 70, 60);
  ellipse(rightX - 62, 100, 70, 60);

  leftX -= 1;
  rightX += 1;
  sunRadius += 2;
}
