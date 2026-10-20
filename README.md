# p5.js Lab

Sitio web con HTML, CSS y JavaScript que reúne proyectos de dibujo creados en Khan Academy y adaptados a p5.js.

## Contenido

| Página | Descripción |
|---|---|
| `index.html` | Página principal con tarjetas de los proyectos |
| `rana.html`, `conejo.html`, `cena.html`, `dia-nevado.html`, `muneco.html` | Los cinco dibujos con su código y captura original |
| `sol-explota.html`, `nubes.html` | Dos animaciones con `draw()`: el sol que explota y las nubes que se separan |
| `teoria-canvas.html` | La etiqueta `<canvas>` y el contexto de renderizado 2D |
| `teoria-p5.html` | Fundamentos de p5.js |
| `dom-inspector.html` | Árbol gráfico del DOM de cada página |

## Estructura

```
.
├── index.html, rana.html, conejo.html, cena.html, dia-nevado.html, muneco.html,
│   sol-explota.html, nubes.html
├── teoria-canvas.html, teoria-p5.html, dom-inspector.html
├── css/styles.css
├── js/            (un archivo por dibujo + dom-inspector.js + dom-snapshot.js)
├── img/           (capturas originales y miniaturas)
└── tools/generar_snapshot.py
```

## Ejecutar en local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Proyectos originales (Khan Academy)

- [Rana loca](https://es.khanacademy.org/computer-programming/derivado-de-desafo-rana-loca/6140049511792640)
- [Dientes de conejo](https://es.khanacademy.org/computer-programming/derivado-de-desafo-dientes-de-conejo/4845496641110016)
- [¿Qué hay de cena?](https://es.khanacademy.org/computer-programming/derivado-de-proyecto-qu-hay-de-cena/5857955858464768)
- [Día nevado soleado](https://es.khanacademy.org/computer-programming/derivado-de-desafo-da-nevado-soleado/6285240126259200)
- [Muñeco de nieve que saluda](https://es.khanacademy.org/computer-programming/derivado-de-desafo-mueco-de-nieve-que-saluda/6410851293446144)
- [El sol que explota](https://es.khanacademy.org/computer-programming/derivado-de-desafo-el-sol-que-explota/4679321755959296)
- [Nubes que se separan](https://es.khanacademy.org/computer-programming/derivado-de-desafo-nubes-que-se-separan/5952585010626560)
