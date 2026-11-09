# rabolllo.github.io

Portafolio personal con estética **Windows 98 × vaporwave**, construido con [98.css](https://jdan.github.io/98.css) y JavaScript puro (sin build). Publicado con GitHub Pages.

## Editar contenido
Todo el contenido vive en `assets/js/data.js`:
- `PROJECTS` → carrusel de proyectos (título, descripción, tags, imagen opcional, repo, demo).
- `CERTIFICATIONS` → lista de certificaciones (nombre, emisor, fecha, url de credencial).

Capturas de proyectos: guárdalas en `assets/img/` y referencia la ruta en `image`.

## Estructura
```
index.html
assets/css/style.css      estilos vaporwave + overrides de 98.css
assets/js/data.js         contenido editable
assets/js/main.js         ventanas, carrusel, menú Inicio, animaciones
assets/vendor/98css/      98.css v0.1.21 + fuentes (MIT)
```

## Probar en local
Laragon, o: `python -m http.server` y abrir http://localhost:8000