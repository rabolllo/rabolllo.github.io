# rabolllo.github.io

Portafolio personal con estética **Windows 98 × vaporwave**, construido con [98.css](https://jdan.github.io/98.css) y JavaScript puro (sin build).

## Editar contenido
Todo el contenido vive en `assets/js/data.js`:
- `PROJECTS` → carrusel de proyectos (título, descripción, tags, imagen opcional, repo, demo).
- `CERTIFICATIONS` → lista de certificaciones (nombre, emisor, fecha, url de credencial).

Capturas de proyectos: guárdalas en `assets/img/` y referencia la ruta en `image`.

## Idiomas
El sitio detecta el idioma del navegador (español → ES, otro → EN). El botón ES/EN de la barra de tareas cambia el idioma y guarda la elección. Para probar: `?lang=en` o `?lang=es`.

## Estructura
```
index.html
assets/css/style.css      estilos vaporwave + overrides de 98.css
assets/js/data.js         contenido editable (textos ES/EN)
assets/js/i18n.js         textos de la interfaz ES/EN + detección de idioma
assets/js/main.js         ventanas, carrusel, menú Inicio, animaciones
assets/vendor/98css/      98.css v0.1.21 + fuentes (MIT)
```
