/* Rabiella 98 — lógica del escritorio (vanilla JS, sin dependencias) */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const SITE = window.SITE || {};
  const PROJECTS = window.PROJECTS || [];
  const CERTS = window.CERTIFICATIONS || [];

  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  /* ---------------- Movimiento (preferencias) ---------------- */
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stored = localStorage.getItem("motion");
  let motionOn = stored ? stored === "on" : !prefersReduced;

  function applyMotion() {
    root.classList.toggle("no-motion", !motionOn);
    root.classList.toggle("force-motion", motionOn && prefersReduced);
    const label = $("#motion-label");
    if (label) label.textContent = `Animaciones: ${motionOn ? "Sí" : "No"}`;
  }
  applyMotion();

  /* ---------------- Contenido base ---------------- */
  if (SITE.name) {
    $("#hero-name").textContent = SITE.name;
    $("#hero-name").dataset.text = SITE.name;
  }
  $("#hero-intro").textContent = SITE.intro || "";

  /* =========================================================
     ARRANQUE
     ========================================================= */
  const boot = $("#boot");
  const bootLines = [
    "Rabiella BIOS v4.98  (c) 1998-∞",
    "Memoria: 640K OK ... más que suficiente",
    `Cargando ${PROJECTS.length} proyecto(s) ............ OK`,
    `Cargando ${CERTS.length} certificación(es) ......... OK`,
    "Sincronizando ＡＥＳＴＨＥＴＩＣ ............ OK",
    "Iniciando escritorio...",
  ];

  function finishBoot() {
    if (boot.classList.contains("done")) return;
    boot.classList.add("done");
    root.classList.remove("booting");
    sessionStorage.setItem("booted", "1");
    setTimeout(() => boot.remove(), 600);
    startTerminal();
  }

  function runBoot() {
    if (!motionOn || sessionStorage.getItem("booted")) {
      boot.remove();
      startTerminal();
      return;
    }
    root.classList.add("booting");
    const log = $("#boot-log");
    const bar = $("#boot-progress");
    let i = 0;
    const step = () => {
      if (boot.classList.contains("done")) return;
      if (i < bootLines.length) {
        log.textContent += bootLines[i] + "\n";
        i++;
        bar.style.width = `${Math.round((i / bootLines.length) * 100)}%`;
        setTimeout(step, 320 + Math.random() * 180);
      } else {
        setTimeout(finishBoot, 450);
      }
    };
    step();
    const skip = () => finishBoot();
    boot.addEventListener("click", skip, { once: true });
    addEventListener("keydown", skip, { once: true });
  }

  /* =========================================================
     TERMINAL DEL CRT
     ========================================================= */
  let terminalStarted = false;
  function startTerminal() {
    if (terminalStarted) return;
    terminalStarted = true;
    const term = $("#terminal");
    const script = [
      ["p", "C:\\> "], ["", "whoami\n"],
      ["ok", `${(SITE.fullName || SITE.name || "").toLowerCase().replace(/\s+/g, "_")}\n`],
      ["p", "C:\\> "], ["", "dir proyectos\n"],
      ["ok", `  ${PROJECTS.length} proyecto(s) encontrados\n`],
      ["p", "C:\\> "], ["", "dir certificaciones\n"],
      ["ok", `  ${CERTS.length} certificación(es)\n`],
      ["p", "C:\\> "], ["", "start portafolio.exe\n"],
      ["ok", "  ✓ listo. ＡＥＳＴＨＥＴＩＣ\n"],
      ["p", "C:\\> "],
    ];
    const cursor = '<span class="cursor"></span>';
    const render = (parts) =>
      parts.map(([cls, txt]) => (cls ? `<span class="${cls}">${esc(txt)}</span>` : esc(txt))).join("") + cursor;

    if (!motionOn) {
      term.innerHTML = render(script);
      return;
    }
    let seg = 0, ch = 0;
    const done = [];
    const tick = () => {
      if (seg >= script.length) {
        setTimeout(() => { seg = 0; ch = 0; done.length = 0; tick(); }, 5000);
        return;
      }
      const [cls, txt] = script[seg];
      const instant = cls !== ""; // prompts y salidas aparecen de golpe; los comandos se teclean
      ch = instant ? txt.length : ch + 1;
      term.innerHTML = render([...done, [cls, txt.slice(0, ch)]]);
      if (ch >= txt.length) {
        done.push(script[seg]);
        seg++;
        ch = 0;
        setTimeout(tick, instant ? 260 : 380);
      } else {
        setTimeout(tick, 55 + Math.random() * 60);
      }
    };
    tick();
  }

  /* =========================================================
     GESTOR DE VENTANAS
     ========================================================= */
  const wins = $$(".win");
  const taskBar = $("#task-buttons");
  const canDrag = () => matchMedia("(min-width: 761px) and (pointer: fine)").matches;

  wins.forEach((w) => (w.dataset.state = "open"));

  function iconClass(w) {
    const i = $(".title-bar-text .tb-ico", w);
    return i ? [...i.classList].find((c) => c.startsWith("ico-")) : "";
  }

  function renderTaskbar() {
    taskBar.innerHTML = "";
    wins.filter((w) => w.dataset.state !== "closed").forEach((w) => {
      const b = document.createElement("button");
      const active = w.dataset.state === "open" && w.classList.contains("is-front");
      b.className = active ? "active" : "";
      b.setAttribute("aria-pressed", String(active));
      b.innerHTML = `<span class="tb-ico ${iconClass(w)}"></span><span>${esc(w.dataset.title)}</span>`;
      b.addEventListener("click", () => {
        if (w.dataset.state === "min") openWin(w.id);
        else if (w.classList.contains("is-front")) minimizeWin(w);
        else focusWin(w);
      });
      taskBar.appendChild(b);
    });
  }

  function focusWin(w) {
    wins.forEach((o) => {
      const front = o === w;
      o.classList.toggle("is-front", front);
      $(".title-bar", o).classList.toggle("inactive", !front);
    });
    renderTaskbar();
  }

  function replayOpen(w) {
    w.style.setProperty("--delay", "0s");
    w.style.animation = "none";
    void w.offsetWidth;
    w.style.animation = "";
  }

  function hideWin(w, state) {
    if (w.classList.contains("is-closing")) return;
    w.classList.add("is-closing");
    const token = (w._tok = (w._tok || 0) + 1);
    let finished = false;
    const end = (e) => {
      if (finished || w._tok !== token || (e && e.target !== w)) return;
      finished = true;
      w.removeEventListener("animationend", end);
      w.classList.remove("is-closing");
      w.classList.add("is-closed");
      w.dataset.state = state;
      const next = wins.find((o) => o.dataset.state === "open");
      if (next) focusWin(next); else renderTaskbar();
    };
    w.addEventListener("animationend", end);
    setTimeout(end, 450); // respaldo si la pestaña está oculta o sin animaciones
  }
  const minimizeWin = (w) => hideWin(w, "min");
  const closeWin = (w) => {
    hideWin(w, "closed");
    setMax(w, false);
    w.style.removeProperty("--dx");
    w.style.removeProperty("--dy");
  };

  function setMax(w, on) {
    w.classList.toggle("maximized", on);
    const btn = $('[data-act="max"]', w);
    btn.setAttribute("aria-label", on ? "Restore" : "Maximize");
    if (on) { w.style.removeProperty("--dx"); w.style.removeProperty("--dy"); }
  }

  function openWin(id) {
    const w = document.getElementById(id);
    if (!w) return;
    if (w.dataset.state !== "open" || w.classList.contains("is-closing")) {
      w._tok = (w._tok || 0) + 1; // cancela un cierre en curso
      w.classList.remove("is-closed", "is-closing");
      w.dataset.state = "open";
      replayOpen(w);
    }
    focusWin(w);
    const top = w.getBoundingClientRect().top + scrollY - 16;
    scrollTo({ top, behavior: motionOn ? "smooth" : "auto" });
  }

  wins.forEach((w) => {
    w.addEventListener("pointerdown", () => { if (!w.classList.contains("is-front")) focusWin(w); });
    $$("[data-act]", w).forEach((b) =>
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        const act = b.dataset.act;
        if (act === "min") minimizeWin(w);
        if (act === "close") closeWin(w);
        if (act === "max") setMax(w, !w.classList.contains("maximized"));
      })
    );

    // Doble clic en la barra de título = maximizar
    const bar = $(".title-bar", w);
    bar.addEventListener("dblclick", (e) => {
      if (e.target.closest("button")) return;
      setMax(w, !w.classList.contains("maximized"));
    });

    // Arrastrar
    let sx, sy, ox, oy, dragging = false;
    bar.addEventListener("pointerdown", (e) => {
      if (!canDrag() || e.button !== 0 || e.target.closest("button") || w.classList.contains("maximized")) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      ox = parseFloat(w.style.getPropertyValue("--dx")) || 0;
      oy = parseFloat(w.style.getPropertyValue("--dy")) || 0;
      bar.setPointerCapture(e.pointerId);
      w.classList.add("dragging");
    });
    bar.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      w.style.setProperty("--dx", `${ox + e.clientX - sx}px`);
      w.style.setProperty("--dy", `${oy + e.clientY - sy}px`);
    });
    const stop = () => { dragging = false; w.classList.remove("dragging"); };
    bar.addEventListener("pointerup", stop);
    bar.addEventListener("pointercancel", stop);
  });
  const syncDraggable = () => wins.forEach((w) => w.classList.toggle("draggable", canDrag()));
  syncDraggable();
  addEventListener("resize", syncDraggable);

  // Cualquier elemento con data-open abre/enfoca su ventana
  $$("[data-open]").forEach((el) =>
    el.addEventListener("click", () => {
      $$(".desk-icon").forEach((i) => i.classList.toggle("selected", i === el));
      closeStart();
      openWin(el.dataset.open);
    })
  );

  focusWin($("#win-welcome"));

  /* =========================================================
     CARRUSEL DE PROYECTOS
     ========================================================= */
  const track = $("#carousel-track");
  const dots = $("#carousel-dots");
  const viewport = $(".carousel-viewport");
  const carousel = $("#carousel");
  const status = $("#carousel-status");
  const autoplayBox = $("#autoplay");
  const autoBar = $("#autoplay-bar");
  const palettes = [
    ["#2b0b4f", "#ff71ce", "#01cdfe"],
    ["#06263f", "#01cdfe", "#ff71ce"],
    ["#3a0a3f", "#b967ff", "#05ffa1"],
    ["#1d1150", "#ff9a3c", "#b967ff"],
    ["#05332b", "#05ffa1", "#ff71ce"],
  ];
  let idx = 0;

  track.innerHTML = PROJECTS.map((p, i) => {
    const [a1, a2, a3] = palettes[i % palettes.length];
    const art = p.image
      ? `<img src="${esc(p.image)}" alt="Captura de ${esc(p.title)}" loading="lazy" />`
      : `<div class="art-gen" style="--a1:${a1};--a2:${a2};--a3:${a3}"></div><div class="art-title">${esc(p.title)}</div>`;
    const tags = (p.tags || []).length ? `<ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : "";
    const links = [
      p.repo ? `<a class="btn98" href="${esc(p.repo)}" target="_blank" rel="noopener">Ver código ↗</a>` : "",
      p.demo ? `<a class="btn98" href="${esc(p.demo)}" target="_blank" rel="noopener">Abrir demo ↗</a>` : "",
    ].join("");
    return `
      <article class="slide" role="group" aria-roledescription="diapositiva" aria-label="${i + 1} de ${PROJECTS.length}: ${esc(p.title)}">
        <div class="slide-art">${art}<span class="art-index">${String(i + 1).padStart(2, "0")}/${String(PROJECTS.length).padStart(2, "0")}</span></div>
        <div class="slide-info">
          <p class="slide-kicker">proyecto_${String(i + 1).padStart(2, "0")}.exe</p>
          <h2>${esc(p.title)}</h2>
          <p>${esc(p.description)}</p>
          ${tags}
          <div class="slide-links">${links}</div>
        </div>
      </article>`;
  }).join("");

  dots.innerHTML = PROJECTS.map(
    (p, i) => `<button role="tab" aria-label="Ir a ${esc(p.title)}" data-i="${i}">${i + 1}</button>`
  ).join("");
  $$("button", dots).forEach((b) => b.addEventListener("click", () => go(+b.dataset.i)));

  const slides = $$(".slide", track);

  function go(n, fromAuto = false) {
    if (!slides.length) return;
    const prev = idx;
    idx = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    slides.forEach((s, i) => {
      const on = i === idx;
      s.classList.toggle("is-active", on);
      s.toggleAttribute("inert", !on);
      s.setAttribute("aria-hidden", String(!on));
    });
    $$("button", dots).forEach((b, i) => b.setAttribute("aria-selected", String(i === idx)));
    status.textContent = `Proyecto ${idx + 1} de ${slides.length}`;
    if (prev !== idx && motionOn) {
      viewport.classList.remove("glitching");
      void viewport.offsetWidth;
      viewport.classList.add("glitching");
    }
    if (!fromAuto) elapsed = 0;
  }
  viewport.addEventListener("animationend", (e) => { if (e.animationName === "glitch-flash") viewport.classList.remove("glitching"); });

  $("#prev").addEventListener("click", () => go(idx - 1));
  $("#next").addEventListener("click", () => go(idx + 1));
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(idx - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(idx + 1); }
  });

  // Deslizar en táctil
  let tx = null;
  viewport.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") tx = e.clientX; });
  viewport.addEventListener("pointerup", (e) => {
    if (tx === null) return;
    const dx = e.clientX - tx;
    if (Math.abs(dx) > 45) go(idx + (dx < 0 ? 1 : -1));
    tx = null;
  });

  // Reproducción automática con barra de progreso
  const AUTO_MS = 6500;
  let elapsed = 0, last = performance.now(), hovering = false;
  autoplayBox.checked = motionOn;
  carousel.addEventListener("pointerenter", () => (hovering = true));
  carousel.addEventListener("pointerleave", () => (hovering = false));
  autoplayBox.addEventListener("change", () => { elapsed = 0; autoBar.style.width = "0%"; });
  function loop(now) {
    const dt = now - last;
    last = now;
    const paused =
      !autoplayBox.checked || hovering || carousel.contains(document.activeElement) ||
      document.hidden || root.classList.contains("booting") ||
      $("#win-portfolio").dataset.state !== "open";
    if (!paused && slides.length > 1) {
      elapsed += dt;
      if (elapsed >= AUTO_MS) { elapsed = 0; go(idx + 1, true); }
    }
    autoBar.style.width = autoplayBox.checked ? `${Math.min(100, (elapsed / AUTO_MS) * 100)}%` : "0%";
    requestAnimationFrame(loop);
  }
  go(0);
  requestAnimationFrame(loop);

  /* =========================================================
     CERTIFICACIONES
     ========================================================= */
  const tbody = $("#certs-body");
  const detail = $("#cert-detail-body");
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const fmtDate = (d) => {
    const m = /^(\d{4})-(\d{1,2})/.exec(d || "");
    return m ? `${months[+m[2] - 1]} ${m[1]}` : esc(d || "—");
  };

  $("#certs-count").textContent = `${CERTS.length} objeto(s)`;
  if (!CERTS.length) {
    tbody.innerHTML = `<tr><td colspan="3">Aún no hay certificaciones.</td></tr>`;
  } else {
    tbody.innerHTML = CERTS.map(
      (c, i) => `<tr tabindex="0" class="reveal" style="--i:${i}" data-i="${i}">
        <td><span class="cell-name"><span class="ico ico-cert"></span>${esc(c.name)}</span></td>
        <td>${esc(c.issuer)}</td>
        <td>${fmtDate(c.date)}</td>
      </tr>`
    ).join("");
  }
  const rows = $$("tr[data-i]", tbody);

  function selectCert(i, focus = false) {
    const c = CERTS[i];
    if (!c) return;
    rows.forEach((r, j) => {
      r.classList.toggle("highlighted", j === i);
      r.setAttribute("aria-selected", String(j === i));
    });
    if (focus) rows[i].focus();
    const link = c.url
      ? `<a class="btn98" href="${esc(c.url)}" target="_blank" rel="noopener">Ver credencial ↗</a>`
      : `<span class="btn98 disabled" aria-disabled="true">Sin enlace de credencial</span>`;
    detail.innerHTML = `
      <dl>
        <dt>Nombre</dt><dd>${esc(c.name)}</dd>
        <dt>Emisor</dt><dd>${esc(c.issuer)}</dd>
        <dt>Fecha</dt><dd>${fmtDate(c.date)}</dd>
      </dl>
      <div>${link}</div>`;
  }
  rows.forEach((r, i) => {
    r.addEventListener("click", () => selectCert(i));
    r.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectCert(i); }
      if (e.key === "ArrowDown") { e.preventDefault(); selectCert(Math.min(rows.length - 1, i + 1), true); }
      if (e.key === "ArrowUp") { e.preventDefault(); selectCert(Math.max(0, i - 1), true); }
    });
  });
  if (rows.length) selectCert(0);

  /* =========================================================
     MENÚ INICIO, RELOJ, APAGADO
     ========================================================= */
  const startBtn = $("#start-btn");
  const startMenu = $("#start-menu");
  function closeStart() {
    startMenu.hidden = true;
    startBtn.setAttribute("aria-expanded", "false");
  }
  startBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = startMenu.hidden;
    startMenu.hidden = !open;
    startBtn.setAttribute("aria-expanded", String(open));
    if (open) $("button, a", startMenu).focus();
  });
  document.addEventListener("click", (e) => { if (!startMenu.contains(e.target)) closeStart(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeStart(); });

  $("#toggle-motion").addEventListener("click", () => {
    motionOn = !motionOn;
    localStorage.setItem("motion", motionOn ? "on" : "off");
    applyMotion();
    autoplayBox.checked = motionOn;
  });

  const shutdown = $("#shutdown-screen");
  $("#shutdown").addEventListener("click", () => { closeStart(); shutdown.hidden = false; });
  shutdown.addEventListener("click", () => (shutdown.hidden = true));

  const clock = $("#clock");
  const tickClock = () => {
    const d = new Date();
    clock.textContent = d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
    clock.dateTime = d.toISOString();
  };
  tickClock();
  setInterval(tickClock, 10000);

  /* =========================================================
     RASTRO DE CHISPAS DEL CURSOR
     ========================================================= */
  const sparkColors = ["#ff71ce", "#01cdfe", "#05ffa1", "#fffb96", "#b967ff"];
  let lastSpark = 0;
  addEventListener("pointermove", (e) => {
    if (!motionOn || e.pointerType !== "mouse") return;
    const now = performance.now();
    if (now - lastSpark < 45) return;
    lastSpark = now;
    const s = document.createElement("span");
    s.className = "spark";
    s.style.left = `${e.clientX + 6}px`;
    s.style.top = `${e.clientY + 6}px`;
    s.style.color = sparkColors[(Math.random() * sparkColors.length) | 0];
    s.addEventListener("animationend", () => s.remove());
    document.body.appendChild(s);
  }, { passive: true });

  runBoot();
})();
