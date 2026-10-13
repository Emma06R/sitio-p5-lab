#!/usr/bin/env python3
"""Regenera js/dom-snapshot.js con el HTML actual de todas las páginas.
Úsalo si editas alguna página y quieres que el inspector funcione también
al abrir el sitio con doble clic (file://). Ejecutar desde la raíz del repo:
    python3 tools/generar_snapshot.py
"""
import glob, json, os

paginas = {}
for ruta in sorted(glob.glob("*.html")):
    with open(ruta, encoding="utf-8") as f:
        paginas[os.path.basename(ruta)] = f.read()

os.makedirs("js", exist_ok=True)
with open("js/dom-snapshot.js", "w", encoding="utf-8") as f:
    f.write("/* Generado por tools/generar_snapshot.py */\n")
    f.write("window.DOM_SNAPSHOT = " + json.dumps(paginas, ensure_ascii=False, indent=1) + ";\n")
print("Snapshot generado con", len(paginas), "páginas")
