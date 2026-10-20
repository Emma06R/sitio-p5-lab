/* Proyecto: Estrella en el cielo nocturno
 * Código original de Khan Academy adaptado a p5.js estándar:
 * se crea el lienzo de 400 x 400 px dentro de setup() y un botón
 * cambia las variables xPos e yPos para mover la estrella.
 */

var xPos = 200;
var yPos = 200;

function setup() {
  var lienzo = createCanvas(400, 400);
  lienzo.parent('lienzo');

  var boton = document.getElementById('btn-mover');
  boton.addEventListener('click', function () {
    xPos = round(random(10, 390));
    yPos = round(random(10, 390));
  });
  document.getElementById('btn-centro').addEventListener('click', function () {
    xPos = 200;
    yPos = 200;
  });
}

function draw() {
  background(29, 40, 115);
  fill(255, 242, 0);
  ellipse(xPos, yPos, 10, 10);
}
