/* =========================================================
   Idiomas / Languages (ES ⇄ EN)
   - Detecta el idioma del navegador: español → "es", cualquier otro → "en".
   - La elección manual (botón ES/EN) se guarda en localStorage y tiene prioridad.
   - También acepta ?lang=es o ?lang=en en la URL.
   ========================================================= */
(() => {
  "use strict";

  const STRINGS = {
    es: {
      "meta.title": "Eduardo Rabiella · Portafolio 98",
      "meta.description": "Portafolio de proyectos y certificaciones de Eduardo Rabiella — edición Windows 98 / vaporwave.",

      "boot.skip": "Haz clic o presiona una tecla para omitir",
      "boot.mem": "Memoria: 640K OK ... más que suficiente",
      "boot.projects": "Cargando {n} proyecto(s) ............ OK",
      "boot.certs": "Cargando {n} certificación(es) ......... OK",
      "boot.sync": "Sincronizando ＡＥＳＴＨＥＴＩＣ ............ OK",
      "boot.start": "Iniciando escritorio...",

      "nav.shortcuts": "Accesos directos",
      "desk.pc": "Mi PC",
      "desk.github": "GitHub",
      "desk.telegram": "Telegram",
      "desk.mail": "Correo",

      "win.welcome": "Bienvenido.exe",
      "win.portfolio": "Portafolio.exe",
      "win.portfolioPath": "C:\\Proyectos\\Portafolio.exe",
      "win.certs": "Certificaciones",
      "win.min": "Minimizar",
      "win.max": "Maximizar",
      "win.close": "Cerrar",

      "hero.projects": "Ver proyectos",
      "hero.certs": "Certificaciones",
      "status.ready": "Listo",
      "status.marquee": "★ ＡＥＳＴＨＥＴＩＣ ★ bienvenido a mi escritorio ★ explora los proyectos ★ ＡＥＳＴＨＥＴＩＣ ★",

      "term.projects": "  {n} proyecto(s) encontrados",
      "term.certs": "  {n} certificación(es)",
      "term.dirProjects": "dir proyectos",
      "term.dirCerts": "dir certificaciones",
      "term.start": "start portafolio.exe",
      "term.ready": "  ✓ listo. ＡＥＳＴＨＥＴＩＣ",

      "car.region": "Proyectos",
      "car.prev": "◀ Atrás",
      "car.next": "Siguiente ▶",
      "car.prevAria": "Proyecto anterior",
      "car.nextAria": "Proyecto siguiente",
      "car.dots": "Seleccionar proyecto",
      "car.goto": "Ir a {name}",
      "car.autoplay": "Reproducción automática",
      "car.status": "Proyecto {i} de {n}",
      "car.hint": "← → para navegar",
      "car.kicker": "proyecto_{i}.exe",
      "car.code": "Ver código ↗",
      "car.demo": "Abrir demo ↗",
      "car.shot": "Captura de {name}",
      "car.slide": "{i} de {n}: {name}",

      "certs.name": "Certificación",
      "certs.issuer": "Emisor",
      "certs.date": "Fecha",
      "certs.details": "Detalles",
      "certs.select": "Selecciona una certificación.",
      "certs.count": "{n} objeto(s)",
      "certs.empty": "Aún no hay certificaciones.",
      "certs.dName": "Nombre",
      "certs.view": "Ver credencial ↗",
      "certs.noLink": "Sin enlace de credencial",
      "certs.zoom": "Ampliar imagen",
      "certs.imgAlt": "Certificado: {name}",
      "certs.noImg": "Sin imagen",

      "viewer.title": "Visor de imágenes",
      "viewer.hint": "Esc o clic fuera para cerrar",

      "menu.welcome": "Bienvenido",
      "menu.projects": "Proyectos",
      "menu.certs": "Certificaciones",
      "menu.mail": "Correo",
      "menu.motionOn": "Animaciones: Sí",
      "menu.motionOff": "Animaciones: No",
      "menu.lang": "Language: English",
      "menu.shutdown": "Apagar el sistema…",
      "task.start": "Inicio",
      "task.lang": "Cambiar idioma a inglés",

      "shutdown.msg": "Ya es seguro apagar<br />su equipo.",
      "shutdown.back": "(haz clic para volver)",

      "ad.title": "¡Oferta!.exe",
      "ad.burst": "¡NUEVO!",
      "ad.text": "¿Necesitas un diseño para tu marca? ¡Contáctame!",
      "ad.cta": "Haz click aquí",
      "ad.sub": "@shiroashuri en Instagram",
    },

    en: {
      "meta.title": "Eduardo Rabiella · Portfolio 98",
      "meta.description": "Eduardo Rabiella's projects and certifications — Windows 98 / vaporwave edition.",

      "boot.skip": "Click or press any key to skip",
      "boot.mem": "Memory: 640K OK ... ought to be enough",
      "boot.projects": "Loading {n} project(s) .............. OK",
      "boot.certs": "Loading {n} certification(s) ........ OK",
      "boot.sync": "Syncing ＡＥＳＴＨＥＴＩＣ ................ OK",
      "boot.start": "Starting desktop...",

      "nav.shortcuts": "Shortcuts",
      "desk.pc": "My Computer",
      "desk.github": "GitHub",
      "desk.telegram": "Telegram",
      "desk.mail": "Email",

      "win.welcome": "Welcome.exe",
      "win.portfolio": "Portfolio.exe",
      "win.portfolioPath": "C:\\Projects\\Portfolio.exe",
      "win.certs": "Certifications",
      "win.min": "Minimize",
      "win.max": "Maximize",
      "win.close": "Close",

      "hero.projects": "View projects",
      "hero.certs": "Certifications",
      "status.ready": "Ready",
      "status.marquee": "★ ＡＥＳＴＨＥＴＩＣ ★ welcome to my desktop ★ explore the projects ★ ＡＥＳＴＨＥＴＩＣ ★",

      "term.projects": "  {n} project(s) found",
      "term.certs": "  {n} certification(s)",
      "term.dirProjects": "dir projects",
      "term.dirCerts": "dir certifications",
      "term.start": "start portfolio.exe",
      "term.ready": "  ✓ ready. ＡＥＳＴＨＥＴＩＣ",

      "car.region": "Projects",
      "car.prev": "◀ Back",
      "car.next": "Next ▶",
      "car.prevAria": "Previous project",
      "car.nextAria": "Next project",
      "car.dots": "Select project",
      "car.goto": "Go to {name}",
      "car.autoplay": "Autoplay",
      "car.status": "Project {i} of {n}",
      "car.hint": "← → to navigate",
      "car.kicker": "project_{i}.exe",
      "car.code": "View code ↗",
      "car.demo": "Open demo ↗",
      "car.shot": "Screenshot of {name}",
      "car.slide": "{i} of {n}: {name}",

      "certs.name": "Certification",
      "certs.issuer": "Issuer",
      "certs.date": "Date",
      "certs.details": "Details",
      "certs.select": "Select a certification.",
      "certs.count": "{n} object(s)",
      "certs.empty": "No certifications yet.",
      "certs.dName": "Name",
      "certs.view": "View credential ↗",
      "certs.noLink": "No credential link",
      "certs.zoom": "Enlarge image",
      "certs.imgAlt": "Certificate: {name}",
      "certs.noImg": "No image",

      "viewer.title": "Image Viewer",
      "viewer.hint": "Esc or click outside to close",

      "menu.welcome": "Welcome",
      "menu.projects": "Projects",
      "menu.certs": "Certifications",
      "menu.mail": "Email",
      "menu.motionOn": "Animations: On",
      "menu.motionOff": "Animations: Off",
      "menu.lang": "Idioma: Español",
      "menu.shutdown": "Shut Down…",
      "task.start": "Start",
      "task.lang": "Switch language to Spanish",

      "shutdown.msg": "It's now safe to turn off<br />your computer.",
      "shutdown.back": "(click to return)",

      "ad.title": "Special offer!.exe",
      "ad.burst": "NEW!",
      "ad.text": "Need a design for your brand? Contact me!",
      "ad.cta": "Click here",
      "ad.sub": "@shiroashuri on Instagram",
    },
  };

  const MONTHS = {
    es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  };

  function detect() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "es" || q === "en") return q;
    const saved = localStorage.getItem("lang");
    if (saved === "es" || saved === "en") return saved;
    const nav = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
    return /^es\b/i.test(nav) ? "es" : "en";
  }

  const listeners = [];
  const I18N = {
    lang: detect(),
    months: () => MONTHS[I18N.lang],
    /** Texto de interfaz: t("car.status", { i: 1, n: 3 }) */
    t(key, vars) {
      let s = STRINGS[I18N.lang][key] ?? STRINGS.es[key] ?? key;
      if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
      return s;
    },
    /** Contenido de data.js: acepta "texto" o { es: "...", en: "..." } */
    tr(v) {
      if (v && typeof v === "object" && !Array.isArray(v)) return v[I18N.lang] ?? v.es ?? v.en ?? "";
      return v ?? "";
    },
    set(lang) {
      if (lang !== "es" && lang !== "en") return;
      I18N.lang = lang;
      localStorage.setItem("lang", lang);
      listeners.forEach((fn) => fn(lang));
    },
    toggle() { I18N.set(I18N.lang === "es" ? "en" : "es"); },
    onChange(fn) { listeners.push(fn); },
  };

  document.documentElement.lang = I18N.lang;
  window.I18N = I18N;
})();
