/* Demostraciones con la API Canvas 2D pura (sin librerías). */
(function () {
  // ---------- 1) La rana, dibujada sin p5.js ----------
  var canvas = document.getElementById('demo-canvas');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');

    // Equivalente a ellipse(x, y, ancho, alto) de p5.js
    function elipse(x, y, ancho, alto) {
      ctx.beginPath();
      ctx.ellipse(x, y, ancho / 2, alto / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);   // background(255)

    ctx.fillStyle = 'rgb(30, 204, 91)';                // fill(30, 204, 91)
    elipse(200, 150, 200, 100);                        // cara
    elipse(150, 100, 40, 40);                          // cuenca izquierda
    elipse(250, 100, 40, 40);                          // cuenca derecha

    ctx.fillStyle = 'rgb(255, 255, 255)';
    elipse(150, 100, 30, 30);                          // ojo izquierdo
    elipse(250, 100, 30, 30);                          // ojo derecho

    ctx.fillStyle = 'rgb(0, 0, 0)';
    elipse(200, 150, 100, 50);                         // boca
    ctx.fillRect(145, 95, 10, 10);                     // pupila izquierda
    ctx.fillRect(245, 95, 10, 10);                     // pupila derecha
  }

  // ---------- 2) Animación con requestAnimationFrame ----------
  var lienzo2 = document.getElementById('demo-animacion');
  if (lienzo2 && lienzo2.getContext) {
    var c = lienzo2.getContext('2d');
    var x = 40, vx = 3, radio = 22;

    function cuadro() {
      c.clearRect(0, 0, lienzo2.width, lienzo2.height);   // borra el cuadro anterior
      c.fillStyle = '#38bdf8';
      c.beginPath();
      c.arc(x, lienzo2.height / 2, radio, 0, Math.PI * 2);
      c.fill();

      x += vx;
      if (x > lienzo2.width - radio || x < radio) { vx = -vx; }   // rebote
      requestAnimationFrame(cuadro);
    }
    cuadro();
  }
})();
