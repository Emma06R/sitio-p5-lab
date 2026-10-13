/* Proyecto: Dientes de conejo
 * Código original de Khan Academy adaptado a p5.js estándar:
 * se envuelve en setup() y se crea el lienzo de 400 x 400 px.
 */

function setup() {
  var lienzo = createCanvas(400, 400);
  lienzo.parent('lienzo');
  background(255);
  noLoop();

  var eyeSize = 20;
  var toothLenght = 30;
  ellipse(150, 70, 60, 120);  // left ear
  ellipse(240, 70, 60, 120);  // right ear

  ellipse(200, 170, 150, 150);    // face

  fill(0, 0, 0);
  ellipse(170, 150, eyeSize, eyeSize);  // left eye
  ellipse(230, 150, eyeSize, eyeSize);  // right eye

  line(150, 200, 250, 200);   // mouth

  noFill();
  rect(185, 200, 15, toothLenght); // left tooth
  rect(200, 200, 15, toothLenght); // right tooth
}
