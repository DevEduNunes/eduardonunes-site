(function () {
  "use strict";

  var root = document.documentElement;
  var animated = root.classList.contains("js");

  /* ---------- Ampliar prints ---------- */
  var dlg = document.getElementById("lightbox");
  function openZoom(src, title) {
    if (!dlg || !dlg.showModal || !src) return;
    dlg.querySelector("img").src = src;
    dlg.querySelector("img").alt = title || "";
    dlg.querySelector("span").textContent = title || "";
    dlg.showModal();
  }
  if (dlg) dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  document.querySelectorAll(".pv-item [data-zoom]").forEach(function (b) {
    b.addEventListener("click", function () { openZoom(b.getAttribute("data-zoom"), b.getAttribute("data-title")); });
  });

  /* ---------- Lista de projetos com prévia ---------- */
  var rows = Array.prototype.slice.call(document.querySelectorAll(".prow"));
  var items = Array.prototype.slice.call(document.querySelectorAll(".pv-item"));
  function setProject(i) {
    rows.forEach(function (r) { r.classList.toggle("on", r.getAttribute("data-i") === String(i)); });
    items.forEach(function (it) { it.classList.toggle("on", it.getAttribute("data-i") === String(i)); });
  }
  rows.forEach(function (r) {
    var i = r.getAttribute("data-i");
    r.addEventListener("mouseenter", function () { setProject(i); });
    r.addEventListener("focus", function () { setProject(i); });
    r.addEventListener("click", function () {
      setProject(i);
      if (r.getAttribute("data-zoom") && window.matchMedia("(min-width: 901px)").matches) openZoom(r.getAttribute("data-zoom"), r.getAttribute("data-title"));
    });
    r.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && r.getAttribute("data-zoom")) { e.preventDefault(); openZoom(r.getAttribute("data-zoom"), r.getAttribute("data-title")); }
    });
  });
  document.querySelectorAll(".mimg").forEach(function (img) {
    img.addEventListener("click", function () {
      var r = img.closest(".prow");
      openZoom(r.getAttribute("data-zoom"), r.getAttribute("data-title"));
    });
  });

  /* ---------- Posts do LinkedIn (assets/data/linkedin-posts.json) ---------- */
  var list = document.getElementById("linkedinPosts");
  if (list) {
    fetch("assets/data/linkedin-posts.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : []; })
      .catch(function () { return []; })
      .then(function (posts) {
        posts = (Array.isArray(posts) ? posts : [])
          .filter(function (p) { return p && p.url && p.text; })
          .sort(function (a, b) { return new Date(b.date) - new Date(a.date); })
          .slice(0, 5);
        if (!posts.length) { list.closest("section").hidden = true; return; }
        list.innerHTML = posts.map(function (p) {
          var d = new Date(p.date + "T12:00:00");
          var date = isNaN(d) ? "" : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
          var title = String(p.text).split("\n")[0].trim();
          if (title.length > 110) title = title.slice(0, 107).replace(/\s+\S*$/, "") + "...";
          return '<li><a href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer"><span class="dt">' + date + '</span><span class="tt">' + esc(title) + "</span></a></li>";
        }).join("");
      });
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }

  /* ---------- Objeto de fundo: rede em aramado que muda a cada cena ---------- */
  var cv = document.getElementById("art");
  var ctx = cv && cv.getContext ? cv.getContext("2d") : null;
  var W = 0, H = 0, DPR = Math.min(2, window.devicePixelRatio || 1);
  var small = function () { return W < 900; };
  var TARGETS = {
    home:     { x: 0.70, y: 0.52, s: 1.0,  a: 1.0,  v: 1.0 },
    sobre:    { x: 0.74, y: 0.50, s: 0.85, a: 0.85, v: 0.7 },
    projetos: { x: 0.50, y: 0.50, s: 1.5,  a: 0.09, v: 0.4 },
    linkedin: { x: 0.80, y: 0.58, s: 0.75, a: 0.65, v: 1.2 },
    contato:  { x: 0.50, y: 0.50, s: 1.25, a: 0.45, v: 0.8 }
  };
  var cur = { x: 0.7, y: 0.52, s: 1, a: 0, v: 1 };
  var tgt = TARGETS.home;
  var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  var ry = 0.6, t0 = 0;

  // pontos numa esfera (espiral de Fibonacci) com leve irregularidade
  var N = 62, pts = [], edges = [];
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  for (var i = 0; i < N; i++) {
    var yy = 1 - (i / (N - 1)) * 2, rr = Math.sqrt(1 - yy * yy), th = i * 2.399963;
    var k = 0.82 + rnd() * 0.36;
    pts.push([Math.cos(th) * rr * k, yy * k, Math.sin(th) * rr * k]);
  }
  (function () {
    var seen = {};
    for (var i = 0; i < N; i++) {
      var d = [];
      for (var j = 0; j < N; j++) if (j !== i) {
        var dx = pts[i][0] - pts[j][0], dy = pts[i][1] - pts[j][1], dz = pts[i][2] - pts[j][2];
        d.push([dx * dx + dy * dy + dz * dz, j]);
      }
      d.sort(function (a, b) { return a[0] - b[0]; });
      for (var n = 0; n < 3; n++) {
        var j2 = d[n][1], key = i < j2 ? i + "-" + j2 : j2 + "-" + i;
        if (!seen[key]) { seen[key] = 1; edges.push([i, j2]); }
      }
    }
  })();

  function resize() {
    if (!cv) return;
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function draw(time) {
    if (!ctx) return;
    var dt = Math.min(0.05, (time - t0) / 1000 || 0.016); t0 = time;
    var tx = tgt.x, ty = tgt.y, ta = tgt.a, ts = tgt.s;
    if (small()) { tx = 0.5; ty = 0.36; ta *= 0.45; ts *= 0.7; }
    var f = 1 - Math.pow(0.0016, dt);          // suavização independente de fps
    cur.x += (tx - cur.x) * f; cur.y += (ty - cur.y) * f;
    cur.s += (ts - cur.s) * f; cur.a += (ta - cur.a) * f; cur.v += (tgt.v - cur.v) * f;
    mouse.x += (mouse.tx - mouse.x) * f * 0.6; mouse.y += (mouse.ty - mouse.y) * f * 0.6;
    if (animated) ry += dt * 0.16 * cur.v;
    var rx = 0.42 + mouse.y * 0.25, ay = ry + mouse.x * 0.35;
    var cy_ = Math.cos(ay), sy_ = Math.sin(ay), cx_ = Math.cos(rx), sx_ = Math.sin(rx);
    var R = Math.min(W, H) * 0.34 * cur.s, cx = W * cur.x, cy = H * cur.y;

    ctx.clearRect(0, 0, W, H);
    var P = new Array(N);
    for (var i = 0; i < N; i++) {
      var p = pts[i];
      var x1 = p[0] * cy_ + p[2] * sy_, z1 = -p[0] * sy_ + p[2] * cy_;
      var y2 = p[1] * cx_ - z1 * sx_, z2 = p[1] * sx_ + z1 * cx_;
      var pe = 1 / (1 + z2 * 0.28);
      P[i] = [cx + x1 * R * pe, cy + y2 * R * pe, z2];
    }
    ctx.lineWidth = 1;
    for (var e = 0; e < edges.length; e++) {
      var a = P[edges[e][0]], b = P[edges[e][1]];
      var depth = ((a[2] + b[2]) / 2 + 1) / 2;         // 0 (longe) a 1 (perto)
      ctx.strokeStyle = "rgba(138,91,216," + (cur.a * (0.07 + depth * 0.34)).toFixed(3) + ")";
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
    for (var n = 0; n < N; n++) {
      var q = P[n], dq = (q[2] + 1) / 2;
      ctx.fillStyle = "rgba(165,139,230," + (cur.a * (0.12 + dq * 0.6)).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(q[0], q[1], 0.9 + dq * 1.6, 0, 6.2832); ctx.fill();
    }
  }
  function loop(time) { draw(time); requestAnimationFrame(loop); }

  if (ctx) {
    resize();
    window.addEventListener("resize", function () { resize(); if (!animated) draw(0); });
    window.addEventListener("pointermove", function (e) {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
    if (animated) requestAnimationFrame(function (t) { t0 = t; loop(t); });
    else { cur.a = 1; cur.x = tgt.x; cur.y = tgt.y; draw(0); }
  }

  /* ---------- Cenas: entrada, menu ativo e objeto de fundo ---------- */
  var scenes = Array.prototype.slice.call(document.querySelectorAll(".scene"));
  var links = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var activeId = "";
  var ticking = false;

  function update() {
    ticking = false;
    var mid = window.innerHeight * 0.5, vh = window.innerHeight;
    scenes.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top < vh * 0.7 && r.bottom > vh * 0.3) s.classList.add("on");
      if (r.top <= mid && r.bottom > mid && s.id !== activeId) {
        activeId = s.id;
        links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("data-nav") === activeId); });
        tgt = TARGETS[activeId] || TARGETS.home;
        if (ctx && !animated) { cur.x = tgt.x; cur.y = tgt.y; cur.s = tgt.s; cur.a = tgt.a; draw(0); }
      }
    });
  }
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);

  function begin() { update(); }
  setTimeout(update, 0);
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 800); })]).then(function () { requestAnimationFrame(begin); });
  } else { begin(); }
  if (!animated) scenes.forEach(function (s) { s.classList.add("on"); });
})();
