/* Proyecto: ¿Qué hay de cena?
 * Código original de Khan Academy adaptado a p5.js estándar:
 * se envuelve en setup() y se crea el lienzo de 400 x 400 px.
 */

function setup() {
  var lienzo = createCanvas(400, 400);
  lienzo.parent('lienzo');
  background(255);
  noLoop();

  noStroke();
  background(200, 200, 200);

  //Plato
  fill(255, 225, 255);
  ellipse(200, 200, 300, 300);

  //Comida
  fill(139, 69, 19);
  rect(130, 180, 80, 40);
}
