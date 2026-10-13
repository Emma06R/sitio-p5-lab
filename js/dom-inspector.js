/* Inspector del DOM
 * Carga cada página del sitio, la convierte en un documento DOM con DOMParser
 * y dibuja su jerarquía de etiquetas como un árbol gráfico.
 *
 * - En GitHub Pages (http/https) usa fetch() para leer la página real.
 * - Si se abre con doble clic (file://) fetch está bloqueado; entonces usa
 *   js/dom-snapshot.js, una copia del HTML de cada página.
 */
(function () {
  "use strict";

  var PAGINAS = [
    { archivo: "index.html", etiqueta: "Inicio" },
    { archivo: "rana.html", etiqueta: "Rana" },
    { archivo: "conejo.html", etiqueta: "Conejo" },
    { archivo: "cena.html", etiqueta: "Cena" },
    { archivo: "dia-nevado.html", etiqueta: "Día nevado" },
    { archivo: "muneco.html", etiqueta: "Muñeco" },
    { archivo: "teoria-canvas.html", etiqueta: "Teoría canvas" },
    { archivo: "teoria-p5.html", etiqueta: "Teoría p5.js" },
    { archivo: "dom-inspector.html", etiqueta: "DOM Inspector" }
  ];

  var NIVEL_INICIAL = 3; // profundidad hasta la que se muestra expandido

  var SEMANTICAS = ["header", "nav", "main", "section", "article", "aside",
                    "footer", "figure", "figcaption"];
  var CON_TEXTO = ["h1", "h2", "h3", "h4", "p", "a", "li", "button", "title",
                   "th", "td", "figcaption", "label", "strong", "em"];

  var contenedor = document.getElementById("arbol");
  var barra = document.getElementById("selector-paginas");
  var info = document.getElementById("insp-info");
  var estado = { archivo: PAGINAS[0].archivo, doc: null };
  var cache = {};

  /* ---------- Carga del HTML ---------- */
  function cargar(archivo) {
    if (cache[archivo]) { return Promise.resolve(cache[archivo]); }
    return fetch(archivo)
      .then(function (r) {
        if (!r.ok) { throw new Error("HTTP " + r.status); }
        return r.text();
      })
      .then(function (txt) { return { html: txt, origen: "página real (fetch)" }; })
      .catch(function (err) {
        if (window.DOM_SNAPSHOT && window.DOM_SNAPSHOT[archivo]) {
          return { html: window.DOM_SNAPSHOT[archivo], origen: "copia local (dom-snapshot.js)" };
        }
        throw err;
      })
      .then(function (res) { cache[archivo] = res; return res; });
  }

  /* ---------- Utilidades ---------- */
  function hijosElemento(el) {
    return Array.prototype.filter.call(el.childNodes, function (n) {
      return n.nodeType === 1;
    });
  }

  function categoria(el) {
    var t = el.tagName.toLowerCase();
    if (t === "html") { return "cat-raiz"; }
    if (t === "head" || el.parentNode && el.parentNode.tagName &&
        el.parentNode.tagName.toLowerCase() === "head") { return "cat-head"; }
    if (t === "body") { return "cat-raiz"; }
    if (SEMANTICAS.indexOf(t) !== -1) { return "cat-semantico"; }
    if (["h1", "h2", "h3", "h4", "p", "canvas", "img", "pre", "code", "ul", "ol",
         "li", "a", "button", "table"].indexOf(t) !== -1) { return "cat-contenido"; }
    return "cat-otro";
  }

  function subtitulo(el) {
    var t = el.tagName.toLowerCase();
    if (el.id) { return "#" + el.id; }
    if (t === "meta") {
      return el.getAttribute("name") || el.getAttribute("charset") ||
             el.getAttribute("http-equiv") || "";
    }
    if (t === "link") { return el.getAttribute("href") || ""; }
    if (t === "script") { return el.getAttribute("src") || "inline"; }
    if (t === "a") { return el.getAttribute("href") || ""; }
    if (t === "img") { return el.getAttribute("src") || ""; }
    if (CON_TEXTO.indexOf(t) !== -1 && hijosElemento(el).length === 0) {
      var txt = (el.textContent || "").replace(/\s+/g, " ").trim();
      return txt.length > 26 ? txt.slice(0, 25) + "…" : txt;
    }
    if (el.classList && el.classList.length) { return "." + el.classList[0]; }
    return "";
  }

  function contarDescendientes(el) {
    var n = 0;
    hijosElemento(el).forEach(function (h) { n += 1 + contarDescendientes(h); });
    return n;
  }

  function profundidadMax(el) {
    var max = 0;
    hijosElemento(el).forEach(function (h) {
      max = Math.max(max, 1 + profundidadMax(h));
    });
    return max;
  }

  /* ---------- Construcción del árbol ---------- */
  function construirNodo(el, nivel) {
    var li = document.createElement("li");
    var hijos = hijosElemento(el);

    var caja = document.createElement("div");
    caja.className = "nodo " + categoria(el) + (hijos.length ? " tiene-hijos" : "");
    caja.setAttribute("title", "<" + el.tagName.toLowerCase() + ">" +
      (hijos.length ? " — clic para expandir/colapsar" : ""));

    var b = document.createElement("b");
    b.textContent = "<" + el.tagName.toLowerCase() + ">";
    caja.appendChild(b);

    var sub = subtitulo(el);
    if (sub) {
      var s = document.createElement("small");
      s.textContent = sub;
      caja.appendChild(s);
    }

    if (hijos.length) {
      var mas = document.createElement("span");
      mas.className = "mas";
      mas.textContent = "+" + contarDescendientes(el);
      caja.appendChild(mas);
      caja.addEventListener("click", function () { li.classList.toggle("colapsado"); });
    }
    li.appendChild(caja);

    if (hijos.length) {
      var ul = document.createElement("ul");
      hijos.forEach(function (h) { ul.appendChild(construirNodo(h, nivel + 1)); });
      li.appendChild(ul);
      if (nivel >= NIVEL_INICIAL) { li.classList.add("colapsado"); }
    }
    return li;
  }

  function dibujar(doc, origen) {
    var raiz = doc.documentElement;
    contenedor.innerHTML = "";
    var wrapper = document.createElement("div");
    wrapper.className = "arbol";
    var ul = document.createElement("ul");
    ul.appendChild(construirNodo(raiz, 0));
    wrapper.appendChild(ul);
    contenedor.appendChild(wrapper);

    var total = 1 + contarDescendientes(raiz);
    info.innerHTML = "";
    [["Archivo", estado.archivo], ["Elementos", total],
     ["Profundidad máxima", profundidadMax(raiz)],
     ["<title>", doc.title || "(sin título)"], ["Origen", origen]]
      .forEach(function (par) {
        var span = document.createElement("span");
        var st = document.createElement("strong");
        st.textContent = par[0] + ": ";
        span.appendChild(st);
        span.appendChild(document.createTextNode(par[1]));
        info.appendChild(span);
      });
  }

  /* ---------- Interfaz ---------- */
  function mostrar(archivo) {
    estado.archivo = archivo;
    Array.prototype.forEach.call(barra.querySelectorAll("button"), function (b) {
      b.setAttribute("aria-pressed", b.dataset.archivo === archivo ? "true" : "false");
    });
    contenedor.textContent = "Cargando…";
    cargar(archivo)
      .then(function (res) {
        estado.doc = new DOMParser().parseFromString(res.html, "text/html");
        dibujar(estado.doc, res.origen);
      })
      .catch(function (err) {
        contenedor.innerHTML = "";
        var p = document.createElement("p");
        p.className = "error-insp";
        p.textContent = "No se pudo leer " + archivo + " (" + err.message + "). " +
          "Abre el sitio desde GitHub Pages o con un servidor local.";
        contenedor.appendChild(p);
      });
  }

  function expandirTodo(abrir) {
    Array.prototype.forEach.call(contenedor.querySelectorAll("li"), function (li) {
      if (li.querySelector(":scope > ul")) {
        li.classList.toggle("colapsado", !abrir);
      }
    });
  }

  function colapsarANivel() {
    function recorrer(li, nivel) {
      var ul = li.querySelector(":scope > ul");
      if (!ul) { return; }
      li.classList.toggle("colapsado", nivel >= NIVEL_INICIAL);
      Array.prototype.forEach.call(ul.children, function (h) { recorrer(h, nivel + 1); });
    }
    var primero = contenedor.querySelector(".arbol > ul > li");
    if (primero) { recorrer(primero, 0); }
  }

  PAGINAS.forEach(function (p) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = p.etiqueta;
    b.dataset.archivo = p.archivo;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", function () { mostrar(p.archivo); });
    barra.appendChild(b);
  });

  document.getElementById("btn-expandir").addEventListener("click", function () { expandirTodo(true); });
  document.getElementById("btn-colapsar").addEventListener("click", colapsarANivel);

  // Permite abrir una página concreta con dom-inspector.html?pagina=rana.html
  var pedida = new URLSearchParams(window.location.search).get("pagina");
  var existe = PAGINAS.some(function (p) { return p.archivo === pedida; });
  mostrar(existe ? pedida : PAGINAS[0].archivo);
})();
