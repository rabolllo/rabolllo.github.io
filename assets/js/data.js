/* ==========================================================
   CONTENIDO DEL SITIO — edita solo este archivo.
   ----------------------------------------------------------
   PROYECTOS (carrusel):
     title       Nombre del proyecto
     description Descripción corta (1–3 líneas)
     tags        Tecnologías usadas, ej. ["JavaScript", "PDF.js"]
     image       (opcional) ruta a captura, ej. "assets/img/compresor.png"
                 Si no hay imagen se genera una portada vaporwave.
     repo        (opcional) URL del repositorio
     demo        (opcional) URL de la demo en vivo
   CERTIFICACIONES (lista):
     name, issuer, date ("2025-06" o "2025"), url (credencial, opcional)
   ========================================================== */

window.SITE = {
  name: "Eduardo Rabiella",
  fullName: "Eduardo Rabiella Macias",
  github: "https://github.com/rabolllo",
  intro:
    "Hola, soy Eduardo. Aquí encontrarás los proyectos que he construido y las certificaciones que he obtenido.",
};

window.PROJECTS = [
  {
    title: "Compresor de PDF",
    description:
      "Compresor de PDF que reduce el tamaño de tus archivos directamente en el navegador.",
    tags: [],
    image: "",
    repo: "https://github.com/rabolllo/Compresor-De-PDF",
    demo: "",
  },
  {
    title: "Polkadot Workshop",
    description:
      "Material didáctico y ejercicios prácticos para un workshop sobre los fundamentos de Polkadot, su arquitectura y cómo empezar a construir en su ecosistema.",
    tags: ["Polkadot", "Shell"],
    image: "",
    repo: "https://github.com/rabolllo/Polkadot_Workshop",
    demo: "",
  },
  {
    title: "rabolllo.github.io",
    description:
      "Este sitio: portafolio personal con estética Windows 98 + vaporwave, hecho con 98.css y JavaScript puro.",
    tags: ["HTML", "CSS", "JavaScript", "98.css"],
    image: "",
    repo: "https://github.com/rabolllo/rabolllo.github.io",
    demo: "https://rabolllo.github.io",
  },
];

/* ⚠ EJEMPLOS — reemplázalos por tus certificaciones reales */
window.CERTIFICATIONS = [
  {
    name: "Certificación de ejemplo 1",
    issuer: "Emisor",
    date: "2025",
    url: "",
  },
  {
    name: "Certificación de ejemplo 2",
    issuer: "Emisor",
    date: "2024",
    url: "",
  },
  {
    name: "Certificación de ejemplo 3",
    issuer: "Emisor",
    date: "2024",
    url: "",
  },
];
