/* Rabiella 98 — lógica del escritorio (vanilla JS, sin dependencias) */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const I = window.I18N;
  const t = I.t;
  const tr = I.tr;
  const SITE = window.SITE || {};
  const PROJECTS = window.PROJECTS || [];
  const CERTS = window.CERTIFICATIONS || [];
  const TG = SITE.telegram || "ERM_DEV1";
  const TG_URL = `https://t.me/${TG}`;
  const IG_URL = `https://www.instagram.com/${SITE.instagram || "shiroashuri"}/`;

  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const pad = (n) => String(n).padStart(2, "0");
  const isMobile = () => matchMedia("(max-width: 760px)").matches;

  /* ---------------- Movimiento (preferencias) ---------------- */
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const storedMotion = localStorage.getItem("motion");
  let motionOn = storedMotion ? storedMotion === "on" : !prefersReduced;

  function applyMotion() {
    root.classList.toggle("no-motion", !motionOn);
    root.classList.toggle("force-motion", motionOn && prefersReduced);
    $("#motion-label").textContent = t(motionOn ? "menu.motionOn" : "menu.motionOff");
  }

  /* =========================================================
     TEXTOS ESTÁTICOS (i18n)
     ========================================================= */
  function applyStatic() {
    root.lang = I.lang;
    document.title = t("meta.title");
    const desc = $('meta[name="description"]');
    if (desc) desc.content = t("meta.description");

    $$("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
    $$("[data-i18n-attr]").forEach((el) =>
      el.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      })
    );
    $$("[data-title-key]").forEach((w) => (w.dataset.title = t(w.dataset.titleKey)));

    if (SITE.name) {
      $("#hero-name").textContent = SITE.name;
      $("#hero-name").dataset.text = SITE.name;
    }
    $("#hero-intro").textContent = tr(SITE.intro);
    $("#shutdown-msg").innerHTML = t("shutdown.msg");
    $("#lang-btn").textContent = I.lang === "es" ? "ES" : "EN";
    $$('a[href*="t.me/"]').forEach((a) => (a.href = TG_URL));
    $("#ad-cta").href = IG_URL;
    applyMotion();
  }

  /* =========================================================
     ARRANQUE
     ========================================================= */
  const boot = $("#boot");
  const onDesktopReady = [];
  let desktopReady = false;
  function desktopIsReady() {
    if (desktopReady) return;
    desktopReady = true;
    onDesktopReady.forEach((fn) => fn());
  }

  function finishBoot() {
    if (boot.classList.contains("done")) return;
    boot.classList.add("done");
    root.classList.remove("booting");
    sessionStorage.setItem("booted", "1");
    setTimeout(() => boot.remove(), 600);
    startTerminal();
    desktopIsReady();
  }

  function runBoot() {
    if (!motionOn || sessionStorage.getItem("booted")) {
      boot.remove();
      startTerminal();
      desktopIsReady();
      return;
    }
    root.classList.add("booting");
    const lines = [
      "V A P O R W A V E BIOS v4.98  (c) 1998-∞",
      t("boot.mem"),
      t("boot.projects", { n: PROJECTS.length }),
      t("boot.certs", { n: CERTS.length }),
      t("boot.sync"),
      t("boot.start"),
    ];
    const log = $("#boot-log");
    const bar = $("#boot-progress");
    let i = 0;
    const step = () => {
      if (boot.classList.contains("done")) return;
      if (i < lines.length) {
        log.textContent += lines[i] + "\n";
        i++;
        bar.style.width = `${Math.round((i / lines.length) * 100)}%`;
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
  let termGen = 0;
  function startTerminal() {
    const gen = ++termGen;
    const term = $("#terminal");
    const script = () => [
      ["p", "C:\\> "], ["", "whoami\n"],
      ["ok", `${(SITE.fullName || SITE.name || "").toLowerCase().replace(/\s+/g, "_")}\n`],
      ["p", "C:\\> "], ["", t("term.dirProjects") + "\n"],
      ["ok", t("term.projects", { n: PROJECTS.length }) + "\n"],
      ["p", "C:\\> "], ["", t("term.dirCerts") + "\n"],
      ["ok", t("term.certs", { n: CERTS.length }) + "\n"],
      ["p", "C:\\> "], ["", t("term.start") + "\n"],
      ["ok", t("term.ready") + "\n"],
      ["p", "C:\\> "],
    ];
    const cursor = '<span class="cursor"></span>';
    const render = (parts) =>
      parts.map(([cls, txt]) => (cls ? `<span class="${cls}">${esc(txt)}</span>` : esc(txt))).join("") + cursor;

    if (!motionOn) {
      term.innerHTML = render(script());
      return;
    }
    let lines = script(), seg = 0, ch = 0;
    const done = [];
    const tick = () => {
      if (gen !== termGen) return;
      if (seg >= lines.length) {
        setTimeout(() => { if (gen !== termGen) return; lines = script(); seg = 0; ch = 0; done.length = 0; tick(); }, 5000);
        return;
      }
      const [cls, txt] = lines[seg];
      const instant = cls !== ""; // prompts y salidas aparecen de golpe; los comandos se teclean
      ch = instant ? txt.length : ch + 1;
      term.innerHTML = render([...done, [cls, txt.slice(0, ch)]]);
      if (ch >= txt.length) {
        done.push(lines[seg]);
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
     ARRASTRAR (ventanas y anuncio)
     ========================================================= */
  const canDrag = () => matchMedia("(min-width: 761px) and (pointer: fine)").matches;
  function makeDraggable(el, handle) {
    let sx, sy, ox, oy, dragging = false;
    handle.addEventListener("pointerdown", (e) => {
      if (!canDrag() || e.button !== 0 || e.target.closest("button") || el.classList.contains("maximized")) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      ox = parseFloat(el.style.getPropertyValue("--dx")) || 0;
      oy = parseFloat(el.style.getPropertyValue("--dy")) || 0;
      handle.setPointerCapture(e.pointerId);
      el.classList.add("dragging");
    });
    handle.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      el.style.setProperty("--dx", `${ox + e.clientX - sx}px`);
      el.style.setProperty("--dy", `${oy + e.clientY - sy}px`);
    });
    const stop = () => { dragging = false; el.classList.remove("dragging"); };
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
  }

  /* =========================================================
     GESTOR DE VENTANAS
     ========================================================= */
  const wins = $$(".win");
  const taskBar = $("#task-buttons");
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
      b.title = w.dataset.title;
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
    $('[data-act="max"]', w).setAttribute("aria-label", on ? "Restore" : "Maximize");
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
    const bar = $(".title-bar", w);
    bar.addEventListener("dblclick", (e) => {
      if (e.target.closest("button")) return;
      setMax(w, !w.classList.contains("maximized"));
    });
    makeDraggable(w, bar);
  });
  const syncDraggable = () => [...wins, $("#ad")].forEach((w) => w.classList.toggle("draggable", canDrag()));
  syncDraggable();
  addEventListener("resize", syncDraggable);

  $$("[data-open]").forEach((el) =>
    el.addEventListener("click", () => {
      $$(".desk-icon").forEach((i) => i.classList.toggle("selected", i === el));
      closeStart();
      openWin(el.dataset.open);
    })
  );

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
  let slides = [];
  let elapsed = 0;

  function renderCarousel() {
    const n = PROJECTS.length;
    track.innerHTML = PROJECTS.map((p, i) => {
      const title = tr(p.title);
      const [a1, a2, a3] = palettes[i % palettes.length];
      const art = p.image
        ? `<img src="${esc(p.image)}" alt="${esc(t("car.shot", { name: title }))}" decoding="async" />`
        : `<div class="art-gen" style="--a1:${a1};--a2:${a2};--a3:${a3}"></div><div class="art-title">${esc(title)}</div>`;
      const tags = (p.tags || []).length ? `<ul class="tags">${p.tags.map((tg) => `<li>${esc(tr(tg))}</li>`).join("")}</ul>` : "";
      const links = [
        p.repo ? `<a class="btn98" href="${esc(p.repo)}" target="_blank" rel="noopener">${t("car.code")}</a>` : "",
        p.demo ? `<a class="btn98" href="${esc(p.demo)}" target="_blank" rel="noopener">${t("car.demo")}</a>` : "",
      ].join("");
      return `
        <article class="slide" role="group" aria-roledescription="slide" aria-label="${esc(t("car.slide", { i: i + 1, n, name: title }))}">
          <div class="slide-art${p.image ? " has-img" : ""}">${art}<span class="art-index">${pad(i + 1)}/${pad(n)}</span></div>
          <div class="slide-info">
            <p class="slide-kicker">${esc(t("car.kicker", { i: pad(i + 1) }))}</p>
            <h2>${esc(title)}</h2>
            <p>${esc(tr(p.description))}</p>
            ${tags}
            <div class="slide-links">${links}</div>
          </div>
        </article>`;
    }).join("");

    dots.innerHTML = PROJECTS.map(
      (p, i) => `<button role="tab" aria-label="${esc(t("car.goto", { name: tr(p.title) }))}" data-i="${i}">${i + 1}</button>`
    ).join("");
    $$("button", dots).forEach((b) => b.addEventListener("click", () => go(+b.dataset.i)));
    slides = $$(".slide", track);
    go(idx, true, true);
  }

  function go(n, fromAuto = false, silent = false) {
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
    status.textContent = t("car.status", { i: idx + 1, n: slides.length });
    if (!silent && prev !== idx && motionOn) {
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
  let last = performance.now(), hovering = false;
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

  /* =========================================================
     CERTIFICACIONES
     ========================================================= */
  const tbody = $("#certs-body");
  const detail = $("#cert-detail-body");
  let certSel = 0;
  let rows = [];

  const fmtDate = (d) => {
    const m = /^(\d{4})-(\d{1,2})/.exec(d || "");
    return m ? `${I.months()[+m[2] - 1]} ${m[1]}` : esc(d || "—");
  };

  function renderCerts() {
    $("#certs-count").textContent = t("certs.count", { n: CERTS.length });
    if (!CERTS.length) {
      tbody.innerHTML = `<tr><td colspan="3">${esc(t("certs.empty"))}</td></tr>`;
      detail.textContent = "";
      return;
    }
    tbody.innerHTML = CERTS.map(
      (c, i) => `<tr tabindex="0" class="reveal" style="--i:${i}" data-i="${i}">
        <td><span class="cell-name"><span class="ico ico-cert"></span>${esc(tr(c.name))}</span></td>
        <td>${esc(tr(c.issuer))}</td>
        <td class="col-date">${fmtDate(c.date)}</td>
      </tr>`
    ).join("");
    rows = $$("tr[data-i]", tbody);
    rows.forEach((r, i) => {
      r.addEventListener("click", () => selectCert(i, false, true));
      r.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectCert(i, false, true); }
        if (e.key === "ArrowDown") { e.preventDefault(); selectCert(Math.min(rows.length - 1, i + 1), true); }
        if (e.key === "ArrowUp") { e.preventDefault(); selectCert(Math.max(0, i - 1), true); }
      });
    });
    selectCert(certSel);
  }

  function selectCert(i, focus = false, userAction = false) {
    const c = CERTS[i];
    if (!c) return;
    certSel = i;
    rows.forEach((r, j) => {
      r.classList.toggle("highlighted", j === i);
      r.setAttribute("aria-selected", String(j === i));
    });
    if (focus) rows[i].focus();
    const name = tr(c.name);
    const link = c.url
      ? `<a class="btn98" href="${esc(c.url)}" target="_blank" rel="noopener">${t("certs.view")}</a>`
      : `<span class="btn98 disabled" aria-disabled="true">${esc(t("certs.noLink"))}</span>`;
    const thumb = c.image
      ? `<button class="cert-thumb sunken-panel" data-zoom="${i}" aria-label="${esc(t("certs.zoom"))}">
           <img src="${esc(c.image)}" alt="${esc(t("certs.imgAlt", { name }))}" decoding="async" />
           <span class="cert-zoom-hint" aria-hidden="true">⤢</span>
         </button>`
      : `<div class="cert-thumb cert-thumb-empty sunken-panel">${esc(t("certs.noImg"))}</div>`;
    detail.innerHTML = `
      ${thumb}
      <dl>
        <dt>${esc(t("certs.dName"))}</dt><dd>${esc(name)}</dd>
        <dt>${esc(t("certs.issuer"))}</dt><dd>${esc(tr(c.issuer))}</dd>
        <dt>${esc(t("certs.date"))}</dt><dd>${fmtDate(c.date)}</dd>
      </dl>
      <div class="cert-actions">
        ${c.image ? `<button data-zoom="${i}">${esc(t("certs.zoom"))}</button>` : ""}
        ${link}
      </div>`;
    $$("[data-zoom]", detail).forEach((b) => b.addEventListener("click", () => openViewer(i)));
    // En celular, lleva la vista al detalle tras tocar una fila
    if (userAction && isMobile()) {
      $("#cert-detail").scrollIntoView({ behavior: motionOn ? "smooth" : "auto", block: "start" });
    }
  }

  /* ---------------- Visor de imágenes ---------------- */
  const viewer = $("#viewer");
  function openViewer(i) {
    const c = CERTS[i];
    if (!c || !c.image) return;
    const file = c.image.split("/").pop();
    $("#viewer-img").src = c.image;
    $("#viewer-img").alt = t("certs.imgAlt", { name: tr(c.name) });
    $("#viewer-title").textContent = `${file} - ${t("viewer.title")}`;
    $("#viewer-name").textContent = tr(c.name);
    if (typeof viewer.showModal === "function") viewer.showModal();
    else viewer.setAttribute("open", "");
  }
  const closeViewer = () => (viewer.close ? viewer.close() : viewer.removeAttribute("open"));
  $("#viewer-close").addEventListener("click", closeViewer);
  viewer.addEventListener("click", (e) => { if (e.target === viewer) closeViewer(); });

  /* =========================================================
     ANUNCIO (AD)
     ========================================================= */
  const ad = $("#ad");
  makeDraggable(ad, $(".title-bar", ad));
  function showAd() {
    if (sessionStorage.getItem("adClosed")) return;
    ad.hidden = false;
    ad.classList.remove("ad-out");
  }
  function closeAd() {
    sessionStorage.setItem("adClosed", "1");
    ad.classList.add("ad-out");
    setTimeout(() => (ad.hidden = true), motionOn ? 320 : 0);
  }
  $("#ad-close").addEventListener("click", closeAd);
  $("#ad-cta").addEventListener("click", () => setTimeout(closeAd, 300));
  onDesktopReady.push(() => setTimeout(showAd, 2500));

  /* =========================================================
     MENÚ INICIO, IDIOMA, RELOJ, APAGADO
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

  $("#lang-btn").addEventListener("click", () => I.toggle());
  $("#menu-lang").addEventListener("click", () => { closeStart(); I.toggle(); });
  I.onChange(() => {
    applyStatic();
    renderCarousel();
    renderCerts();
    renderTaskbar();
    startTerminal();
    if (viewer.open) closeViewer();
  });

  const shutdown = $("#shutdown-screen");
  $("#shutdown").addEventListener("click", () => { closeStart(); shutdown.hidden = false; });
  shutdown.addEventListener("click", () => (shutdown.hidden = true));

  const clock = $("#clock");
  const tickClock = () => {
    const d = new Date();
    clock.textContent = d.toLocaleTimeString(I.lang === "es" ? "es-MX" : "en-US", { hour: "2-digit", minute: "2-digit" });
    clock.dateTime = d.toISOString();
  };
  tickClock();
  setInterval(tickClock, 10000);
  I.onChange(tickClock);

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

  /* ---------------- Inicio ---------------- */
  applyStatic();
  renderCarousel();
  renderCerts();
  focusWin($("#win-welcome"));
  requestAnimationFrame(loop);
  runBoot();
})();
