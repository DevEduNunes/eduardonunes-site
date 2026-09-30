(function () {
  "use strict";

  var root = document.documentElement;
  var animated = root.classList.contains("js");
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* =====================================================================
     Idioma (BR / EN). Padrão: o que a pessoa escolheu antes; senão, o idioma do navegador.
     ===================================================================== */
  var lang = "pt";
  try {
    var qs = /[?&]lang=(en|pt)/.exec(location.search);
    var saved = qs ? qs[1] : localStorage.getItem("lang");
    if (saved === "en" || saved === "pt") lang = saved;
    else lang = /^pt/i.test((navigator.languages && navigator.languages[0]) || navigator.language || "pt") ? "pt" : "en";
  } catch (e) { lang = "pt"; }

  var META = {
    pt: { title: "Eduardo Nunes | Analista de dados", desc: "Eduardo Nunes, analista e consultor de dados em Anápolis, GO. Painéis em Power BI, pipelines no Microsoft Fabric e automações em Python." },
    en: { title: "Eduardo Nunes | Data Analyst", desc: "Eduardo Nunes, data analyst and consultant in Anápolis, Brazil. Power BI dashboards, Microsoft Fabric pipelines and Python automation." }
  };
  var langBtn = $("#lang"), langLabel = $("#langLabel");

  function applyLang() {
    root.lang = lang === "en" ? "en" : "pt-BR";
    $$("[data-en]").forEach(function (el) {
      if (!el.hasAttribute("data-pt")) el.setAttribute("data-pt", el.innerHTML);
      el.innerHTML = lang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-pt");
    });
    $$("[data-en-alt]").forEach(function (el) {
      if (!el.hasAttribute("data-pt-alt")) el.setAttribute("data-pt-alt", el.getAttribute("alt") || "");
      el.setAttribute("alt", lang === "en" ? el.getAttribute("data-en-alt") : el.getAttribute("data-pt-alt"));
    });
    document.title = META[lang].title;
    var md = $('meta[name="description"]'); if (md) md.setAttribute("content", META[lang].desc);
    if (langLabel) langLabel.textContent = lang === "en" ? "EN" : "BR";
    if (langBtn) langBtn.title = lang === "en" ? "Mudar para português" : "Switch to English";
    renderDashes(); renderPosts();
    var active = $(".prow.on"); if (active) playDash(active.getAttribute("data-i"), true);
  }
  function setLang(next) {
    if (next === lang) return;
    lang = next;
    try { localStorage.setItem("lang", lang); } catch (e) {}
    document.body.classList.add("sw");
    setTimeout(function () { applyLang(); document.body.classList.remove("sw"); }, animated ? 170 : 0);
  }
  if (langBtn) langBtn.addEventListener("click", function () {
    hideHint();
    try { localStorage.setItem("langPicked", "1"); } catch (e) {}
    setLang(lang === "pt" ? "en" : "pt");
  });

  /* Aviso discreto: mostra onde trocar o idioma, uma vez, na primeira visita */
  var hint = $("#langHint"), hintTimer = null, hintShown = false;
  function hideHint() {
    if (!hint) return;
    clearTimeout(hintTimer);
    if (langBtn) langBtn.classList.remove("hinting");
    hint.classList.remove("show");
    setTimeout(function () { hint.hidden = true; }, 700);
    try { sessionStorage.setItem("hint", "1"); } catch (e) {}
    window.removeEventListener("scroll", onHintScroll);
  }
  function onHintScroll() { if (window.scrollY > 240) hideHint(); }
  function showHint() {
    var seen = false;
    var force = /[?&]hint\b/.test(location.search);
    try { seen = !!localStorage.getItem("langPicked") || !!sessionStorage.getItem("hint"); } catch (e) {}
    if (!hint || (seen && !force) || hintShown) return;
    hintShown = true;
    hint.hidden = false;
    if (langBtn) langBtn.classList.add("hinting");
    setTimeout(function () { hint.classList.add("show"); }, 80);
    hintTimer = setTimeout(hideHint, 12000);
    hint.addEventListener("click", hideHint);
    window.addEventListener("scroll", onHintScroll, { passive: true });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") hideHint(); }, { once: true });
  }
  setTimeout(showHint, animated ? 2200 : 600);

  /* =====================================================================
     Painéis animados (recriados a partir dos painéis reais de Power BI)
     ===================================================================== */
  function L(pt, en) { return { pt: pt, en: en }; }
  function K(pt, en, v, d, p, upt, uen) { return { l: L(pt, en), v: v, d: d || 0, p: p || "", u: L(upt || "", uen == null ? (upt || "") : uen) }; }
  var LOC = { pt: "pt-BR", en: "en-US" };
  function nf(n, d) { return Number(n).toLocaleString(LOC[lang], { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
  function T(o) { return typeof o === "string" ? o : o[lang]; }
  var PAL = ["#8a5bd8", "#3fb7a8", "#e9a23b", "#e0607e", "#6f8bd8"];

  var DASH = {
    vendas: {
      title: L("Painel de Vendas · Comercial", "Sales dashboard · Commercial"),
      img: "assets/images/work/dashboard-vendas.webp",
      kpis: [K("Faturamento Total", "Total Revenue", 9.6, 1, "$", " Mi", "M"), K("Ticket Médio", "Average Ticket", 1.1, 1, "$", " Mil", "K"), K("Margem", "Margin", 4.1, 1, "$", " Mi", "M"), K("% Margem", "Margin %", 42.86, 2, "", "%"), K("Crescimento % AA", "YoY Growth %", 78.86, 2, "", "%")],
      charts: [
        { t: "line", title: L("Faturamento por mês", "Revenue by month"), s: [[0.25, 0.25, 0.23, 0.14, 0.19, 0.27, 0.33, 0.31, 0.22, 0.18, 0.29, 0.39, 0.36, 0.25, 0.2, 0.25, 0.37, 0.38, 0.35, 0.27, 0.22, 0.4, 0.4, 0.39, 0.3]] },
        { t: "hbar", title: L("Faturamento por categoria", "Revenue by category"), p: "$", u: L(" Mi", "M"), d: 1, rows: [[L("Eletrônicos", "Electronics"), 2.9], [L("Esporte", "Sports"), 1.75], [L("Casa e Decoração", "Home & Decor"), 1.62], [L("Moda", "Fashion"), 1.35], [L("Beleza", "Beauty"), 0.95], [L("Alimentos", "Food"), 0.92]] },
        { t: "hbar", title: L("Faturamento por vendedor", "Revenue by seller"), p: "$", u: L(" Mi", "M"), d: 2, rows: [[L("Vendedor 10", "Seller 10"), 0.87], [L("Vendedor 04", "Seller 04"), 0.82], [L("Vendedor 02", "Seller 02"), 0.8], [L("Vendedor 07", "Seller 07"), 0.74], [L("Vendedor 01", "Seller 01"), 0.7]] },
        { t: "donut", title: L("Faturamento por segmento", "Revenue by segment"), rows: [[L("E-commerce", "E-commerce"), 27.0], [L("Varejo", "Retail"), 26.0], [L("Atacado", "Wholesale"), 23.7], [L("Corporativo", "Corporate"), 23.3]] }
      ]
    },
    financeiro: {
      title: L("Painel Financeiro · Fluxo de Caixa e DRE", "Finance dashboard · Cash flow and P&L"),
      img: "assets/images/work/dashboard-financeiro.webp",
      kpis: [K("Receita Total", "Total Revenue", 8.4, 1, "$", " Mi", "M"), K("Despesa Total", "Total Expenses", 5.0, 1, "$", " Mi", "M"), K("Resultado", "Result", 3.4, 1, "$", " Mi", "M"), K("% Margem Financeira", "Financial Margin %", 40.18, 2, "", "%")],
      charts: [
        { t: "line", title: L("Receita e despesa por mês", "Revenue and expenses by month"), legend: [L("Receita", "Revenue"), L("Despesa", "Expenses")],
          s: [[0.23, 0.18, 0.23, 0.22, 0.21, 0.24, 0.22, 0.27, 0.26, 0.25, 0.23, 0.25, 0.28, 0.27, 0.26, 0.27, 0.24, 0.27, 0.29, 0.26, 0.3, 0.29, 0.38, 0.36, 0.34],
              [0.12, 0.125, 0.13, 0.135, 0.14, 0.14, 0.145, 0.15, 0.15, 0.155, 0.16, 0.16, 0.165, 0.17, 0.17, 0.175, 0.175, 0.18, 0.18, 0.185, 0.185, 0.19, 0.19, 0.19, 0.195]] },
        { t: "vbar", title: L("Despesa por categoria", "Expenses by category"), p: "$", u: L(" Mi", "M"), d: 2, rows: [[L("Folha", "Payroll"), 0.85], [L("Fornecedores", "Suppliers"), 0.78], [L("Impostos", "Taxes"), 0.75], [L("Aluguel", "Rent"), 0.7], [L("Software", "Software"), 0.68], [L("Manutenção", "Upkeep"), 0.65], [L("Marketing", "Marketing"), 0.62]] },
        { t: "donut", title: L("Despesa por centro de custo", "Expenses by cost center"), rows: [[L("Operações", "Operations"), 23.4], [L("Comercial", "Commercial"), 22.0], [L("TI", "IT"), 19.9], [L("Administrativo", "Administrative"), 17.8], [L("Outros", "Other"), 16.7]] },
        { t: "vbar", title: L("Receita por categoria", "Revenue by category"), p: "$", u: L(" Mi", "M"), d: 1, rows: [[L("Financeiras", "Financial"), 2.8], [L("Serviços", "Services"), 2.7], [L("Produtos", "Products"), 2.6]] }
      ]
    },
    rh: {
      title: L("Painel de RH · Turnover e Headcount", "HR dashboard · Turnover and Headcount"),
      img: "assets/images/work/dashboard-rh.webp",
      kpis: [K("Colaboradores Ativos", "Active Employees", 212), K("Total Colaboradores", "Total Employees", 260), K("Salário Médio", "Average Salary", 6, 0, "$", " Mil", "K"), K("Desligamentos", "Terminations", 48), K("Idade Média", "Average Age", 38)],
      charts: [
        { t: "vbar", title: L("Ativos por departamento", "Active by department"), d: 0, rows: [[L("TI", "IT"), 57], [L("Administrativo", "Admin"), 52], [L("Comercial", "Sales"), 38], [L("Marketing", "Marketing"), 35], [L("Operações", "Operations"), 33]] },
        { t: "hbar", title: L("Salário médio por cargo", "Average salary by role"), p: "$", u: L(" Mil", "K"), d: 1, rows: [[L("Gerente Administrativo", "Admin Manager"), 12.8], [L("Desenvolvedor", "Developer"), 9.0], [L("Coord. Comercial", "Sales Coord."), 8.6], [L("Coord. de TI", "IT Coord."), 8.0], [L("Coord. de Marketing", "Marketing Coord."), 7.9], [L("Sup. de Operações", "Ops Supervisor"), 7.2]] },
        { t: "donut", title: L("Ativos por gênero", "Active by gender"), rows: [[L("Masculino", "Male"), 50.9], [L("Feminino", "Female"), 49.1]] },
        { t: "hbar", title: L("Desligamentos por motivo", "Terminations by reason"), d: 0, rows: [[L("Pedido de demissão", "Resignation"), 13], [L("Aposentadoria", "Retirement"), 12], [L("Sem justa causa", "Without cause"), 12]] }
      ]
    },
    estoque: {
      title: L("Painel de Estoque · Giro e Ruptura", "Inventory dashboard · Turnover and Stockouts"),
      img: "assets/images/work/dashboard-estoque.webp",
      kpis: [K("Estoque Atual", "Current Stock", 3, 0, "", " Mil", "K"), K("Total Entradas", "Total Inflows", 42, 0, "", " Mil", "K"), K("Total Saídas", "Total Outflows", 43, 0, "", " Mil", "K"), K("Giro de Estoque", "Stock Turnover", 16.6, 2), K("Valor em Estoque", "Stock Value", 192, 0, "R$ ", " Mil", "K")],
      charts: [
        { t: "line", title: L("Estoque final por mês", "Ending stock by month"), s: [[3.7, 3.2, 3.2, 2.9, 2.8, 2.7, 2.3, 2.6, 3.1, 3.2, 2.8, 2.7, 2.9, 3.0, 3.2, 3.2, 3.0, 3.2, 3.4, 3.1, 3.4, 3.3]] },
        { t: "vbar", title: L("Estoque por categoria", "Stock by category"), d: 0, rows: [[L("Esporte", "Sports"), 750], [L("Casa", "Home"), 550], [L("Eletrônicos", "Electronics"), 450], [L("Alimentos", "Food"), 420], [L("Beleza", "Beauty"), 250], [L("Moda", "Fashion"), 240]] },
        { t: "donut", title: L("Estoque por depósito", "Stock by warehouse"), rows: [[L("CD São Paulo", "DC São Paulo"), 60.2], [L("CD Anápolis", "DC Anápolis"), 23.8], [L("CD Recife", "DC Recife"), 16.0]] },
        { t: "vbar", title: L("Saídas por categoria", "Outflows by category"), p: "", u: L(" Mil", "K"), d: 1, rows: [[L("Esporte", "Sports"), 8], [L("Alimentos", "Food"), 7.5], [L("Beleza", "Beauty"), 7.5], [L("Casa", "Home"), 7.2], [L("Moda", "Fashion"), 6.9], [L("Eletrônicos", "Electronics"), 6.6]] }
      ]
    }
  };

  function money(c, v) { return (c.p || "") + nf(v, c.d) + (c.u ? T(c.u) : ""); }

  function chartLine(c) {
    var all = [].concat.apply([], c.s), mn = Math.min.apply(null, all), mx = Math.max.apply(null, all);
    var pad = (mx - mn) * 0.15 || 1; mn -= pad; mx += pad;
    function pt(v, i, n) { return (i / (n - 1) * 100).toFixed(2) + "," + (36 - (v - mn) / (mx - mn) * 34).toFixed(2); }
    var grid = "";
    for (var g = 0; g < 4; g++) grid += '<line x1="0" x2="100" y1="' + (2 + g * 11.3).toFixed(1) + '" y2="' + (2 + g * 11.3).toFixed(1) + '"/>';
    var paths = c.s.map(function (s, si) {
      var d = "M" + s.map(function (v, i) { return pt(v, i, s.length); }).join(" L");
      var col = si === 0 ? "var(--accent)" : "#3fb7a8";
      var area = si === 0 && c.s.length === 1 ? '<path class="area" d="' + d + ' L100,38 L0,38 Z"/>' : "";
      return area + '<path class="series" pathLength="1" d="' + d + '" style="stroke:' + col + ';--d:' + (si * 0.25) + 's"/>';
    }).join("");
    var legend = c.legend ? '<div class="lg2">' + c.legend.map(function (l, i) { return '<span><i style="background:' + (i ? "#3fb7a8" : "var(--accent)") + '"></i>' + esc(T(l)) + "</span>"; }).join("") + "</div>" : "";
    return '<div class="plot">' + legend + '<svg viewBox="0 0 100 38" preserveAspectRatio="none" class="lineplot"><g class="gl">' + grid + "</g>" + paths + "</svg></div>";
  }
  function chartHbar(c) {
    var mx = Math.max.apply(null, c.rows.map(function (r) { return r[1]; }));
    return '<div class="plot hb">' + c.rows.map(function (r, i) {
      return '<div class="r"><span class="lb" title="' + esc(T(r[0])) + '">' + esc(T(r[0])) + '</span><span class="bar"><i style="--w:' + (r[1] / mx * 100).toFixed(1) + "%;--d:" + (0.1 + i * 0.09).toFixed(2) + 's"></i></span><span class="v">' + esc(money(c, r[1])) + "</span></div>";
    }).join("") + "</div>";
  }
  function chartVbar(c) {
    var mx = Math.max.apply(null, c.rows.map(function (r) { return r[1]; }));
    return '<div class="plot vb">' + c.rows.map(function (r, i) {
      return '<div class="c" title="' + esc(T(r[0]) + ": " + money(c, r[1])) + '"><span class="v">' + esc(nf(r[1], c.d)) + '</span><div class="bw"><i style="--h:' + (r[1] / mx * 100).toFixed(1) + "%;--d:" + (0.1 + i * 0.09).toFixed(2) + 's"></i></div><span class="lb">' + esc(T(r[0])) + "</span></div>";
    }).join("") + "</div>";
  }
  function chartDonut(c) {
    var tot = c.rows.reduce(function (a, r) { return a + r[1]; }, 0), cum = 0, segs = "", leg = "";
    c.rows.forEach(function (r, i) {
      var len = r[1] / tot * 100;
      segs += '<circle class="seg" r="15.9155" cx="18" cy="18" style="stroke:' + PAL[i % PAL.length] + ";--l:" + len.toFixed(2) + ";--o:" + (-cum).toFixed(2) + ";--d:" + (0.1 + i * 0.2).toFixed(2) + 's"/>';
      leg += '<li><i style="background:' + PAL[i % PAL.length] + '"></i><span>' + esc(T(r[0])) + "</span><b>" + nf(len, 1) + "%</b></li>";
      cum += len;
    });
    return '<div class="plot dn"><svg viewBox="0 0 36 36" class="donut"><circle class="ring" r="15.9155" cx="18" cy="18"/>' + segs + "</svg><ul>" + leg + "</ul></div>";
  }
  function renderDash(id) {
    var D = DASH[id], host = $('.pv-item[data-dash="' + id + '"]');
    if (!D || !host) return;
    var kp = D.kpis.map(function (k) {
      return '<div class="kpi"><small>' + esc(T(k.l)) + '</small><b data-v="' + k.v + '" data-d="' + k.d + '" data-p="' + esc(k.p) + '" data-u="' + esc(T(k.u)) + '">' + esc(k.p + nf(k.v, k.d) + T(k.u)) + "</b></div>";
    }).join("");
    var ch = D.charts.map(function (c) {
      var body = c.t === "line" ? chartLine(c) : c.t === "hbar" ? chartHbar(c) : c.t === "vbar" ? chartVbar(c) : chartDonut(c);
      var unit = (c.t === "vbar" && (c.p || c.u)) ? " (" + ((c.p || "") + (c.u ? T(c.u) : "")).trim() + ")" : "";
      return '<div class="card"><h4>' + esc(T(c.title) + unit) + "</h4>" + body + "</div>";
    }).join("");
    host.innerHTML = '<div class="dash"><div class="dash-h"><span>' + esc(T(D.title)) + '</span><button type="button" class="real" data-zoom="' + D.img + '" data-title="' + esc(T(D.title)) + '">' + (lang === "en" ? "See real dashboard" : "Ver painel real") + ' ↗</button></div><div class="kpis" style="--n:' + D.kpis.length + '">' + kp + '</div><div class="grid4">' + ch + "</div></div>";
    var real = $(".real", host);
    if (real) real.addEventListener("click", function () { openZoom(real.getAttribute("data-zoom"), real.getAttribute("data-title")); });
  }
  function renderDashes() { Object.keys(DASH).forEach(renderDash); }

  function countUp(el) {
    var to = parseFloat(el.getAttribute("data-v")), d = parseInt(el.getAttribute("data-d"), 10) || 0;
    var p = el.getAttribute("data-p") || "", u = el.getAttribute("data-u") || "";
    if (!animated) return;
    var t0 = null, dur = 1300;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = p + nf(to * e, d) + u;
      if (k < 1) requestAnimationFrame(step); else el.textContent = p + nf(to, d) + u;
    }
    el.textContent = p + nf(0, d) + u;
    requestAnimationFrame(step);
  }
  var playTimer = null;
  function playDash(i, force) {
    var item = $('.pv-item[data-i="' + i + '"]');
    if (!item) return;
    var dash = $(".dash", item);
    if (!dash) return;
    dash.classList.remove("play");
    void dash.offsetWidth;
    clearTimeout(playTimer);
    playTimer = setTimeout(function () {
      dash.classList.add("play");
      $$(".kpi b", dash).forEach(countUp);
    }, force ? 60 : 160);
  }

  /* =====================================================================
     Ampliar o painel real
     ===================================================================== */
  var dlg = $("#lightbox");
  function openZoom(src, title) {
    if (!dlg || !dlg.showModal || !src) return;
    $("img", dlg).src = src; $("img", dlg).alt = title || ""; $("span", dlg).textContent = title || "";
    dlg.showModal();
  }
  if (dlg) dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

  /* =====================================================================
     Lista de projetos
     ===================================================================== */
  var rows = $$(".prow"), items = $$(".pv-item"), current = "0";
  function setProject(i) {
    i = String(i);
    rows.forEach(function (r) { r.classList.toggle("on", r.getAttribute("data-i") === i); });
    items.forEach(function (it) { it.classList.toggle("on", it.getAttribute("data-i") === i); });
    if (i !== current) { current = i; playDash(i); }
  }
  rows.forEach(function (r) {
    var i = r.getAttribute("data-i");
    r.addEventListener("mouseenter", function () { setProject(i); });
    r.addEventListener("focus", function () { setProject(i); });
    r.addEventListener("click", function () { setProject(i); });
  });
  $$(".mimg").forEach(function (img) {
    img.addEventListener("click", function () { var r = img.closest(".prow"); openZoom(r.getAttribute("data-zoom"), $(".t", r).textContent); });
  });

  /* =====================================================================
     Posts do LinkedIn (assets/data/linkedin-posts.json)
     ===================================================================== */
  var POSTS = [], list = $("#linkedinPosts");
  function renderPosts() {
    if (!list) return;
    if (!POSTS.length) { list.closest("section").hidden = true; return; }
    list.closest("section").hidden = false;
    list.innerHTML = POSTS.map(function (p) {
      var d = new Date(p.date + "T12:00:00");
      var date = isNaN(d) ? "" : d.toLocaleDateString(LOC[lang], { day: "2-digit", month: "2-digit", year: "numeric" });
      var title = (lang === "en" && p.title_en) ? p.title_en : String(p.text).split("\n")[0].trim();
      if (title.length > 110) title = title.slice(0, 107).replace(/\s+\S*$/, "") + "...";
      var tag = lang === "en" ? " · PT" : "";
      return '<li><a href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer"><span class="dt">' + date + tag + '</span><span class="tt">' + esc(title) + "</span></a></li>";
    }).join("");
  }
  if (list) {
    fetch("assets/data/linkedin-posts.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : []; })
      .catch(function () { return []; })
      .then(function (posts) {
        POSTS = (Array.isArray(posts) ? posts : []).filter(function (p) { return p && p.url && p.text; })
          .sort(function (a, b) { return new Date(b.date) - new Date(a.date); }).slice(0, 5);
        renderPosts();
      });
  }

  /* =====================================================================
     Objeto de fundo: rede em aramado que muda a cada cena
     ===================================================================== */
  var cv = $("#art");
  var ctx = cv && cv.getContext ? cv.getContext("2d") : null;
  var W = 0, H = 0, DPR = Math.min(2, window.devicePixelRatio || 1);
  var small = function () { return W < 900; };
  var TARGETS = {
    home:     { x: 0.70, y: 0.52, s: 1.0,  a: 1.0,  v: 1.0 },
    sobre:    { x: 0.74, y: 0.50, s: 0.85, a: 0.85, v: 0.7 },
    projetos: { x: 0.50, y: 0.50, s: 1.5,  a: 0.07, v: 0.4 },
    linkedin: { x: 0.80, y: 0.58, s: 0.75, a: 0.65, v: 1.2 },
    contato:  { x: 0.50, y: 0.50, s: 1.25, a: 0.45, v: 0.8 }
  };
  var cur = { x: 0.7, y: 0.52, s: 1, a: 0, v: 1 }, tgt = TARGETS.home;
  var mouse = { x: 0, y: 0, tx: 0, ty: 0 }, ry = 0.6, t0 = 0;
  var N = 62, pts = [], edges = [], seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  for (var i = 0; i < N; i++) {
    var yy = 1 - (i / (N - 1)) * 2, rr = Math.sqrt(1 - yy * yy), th = i * 2.399963, kk = 0.82 + rnd() * 0.36;
    pts.push([Math.cos(th) * rr * kk, yy * kk, Math.sin(th) * rr * kk]);
  }
  (function () {
    var seen = {};
    for (var a = 0; a < N; a++) {
      var d = [];
      for (var b = 0; b < N; b++) if (b !== a) {
        var dx = pts[a][0] - pts[b][0], dy = pts[a][1] - pts[b][1], dz = pts[a][2] - pts[b][2];
        d.push([dx * dx + dy * dy + dz * dz, b]);
      }
      d.sort(function (p, q) { return p[0] - q[0]; });
      for (var n = 0; n < 3; n++) { var j = d[n][1], key = a < j ? a + "-" + j : j + "-" + a; if (!seen[key]) { seen[key] = 1; edges.push([a, j]); } }
    }
  })();
  function resize() { if (!cv) return; W = innerWidth; H = innerHeight; cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
  function draw(time) {
    if (!ctx) return;
    var dt = Math.min(0.05, (time - t0) / 1000 || 0.016); t0 = time;
    var tx = tgt.x, ty = tgt.y, ta = tgt.a, ts = tgt.s;
    if (small()) { tx = 0.5; ty = 0.36; ta *= 0.45; ts *= 0.7; }
    var f = 1 - Math.pow(0.0016, dt);
    cur.x += (tx - cur.x) * f; cur.y += (ty - cur.y) * f; cur.s += (ts - cur.s) * f; cur.a += (ta - cur.a) * f; cur.v += (tgt.v - cur.v) * f;
    mouse.x += (mouse.tx - mouse.x) * f * 0.6; mouse.y += (mouse.ty - mouse.y) * f * 0.6;
    if (animated) ry += dt * 0.16 * cur.v;
    var rx = 0.42 + mouse.y * 0.25, ay = ry + mouse.x * 0.35;
    var cy_ = Math.cos(ay), sy_ = Math.sin(ay), cx_ = Math.cos(rx), sx_ = Math.sin(rx);
    var R = Math.min(W, H) * 0.34 * cur.s, cx = W * cur.x, cy = H * cur.y;
    ctx.clearRect(0, 0, W, H);
    var P = new Array(N), k;
    for (k = 0; k < N; k++) {
      var p = pts[k], x1 = p[0] * cy_ + p[2] * sy_, z1 = -p[0] * sy_ + p[2] * cy_;
      var y2 = p[1] * cx_ - z1 * sx_, z2 = p[1] * sx_ + z1 * cx_, pe = 1 / (1 + z2 * 0.28);
      P[k] = [cx + x1 * R * pe, cy + y2 * R * pe, z2];
    }
    ctx.lineWidth = 1;
    for (k = 0; k < edges.length; k++) {
      var a = P[edges[k][0]], b = P[edges[k][1]], depth = ((a[2] + b[2]) / 2 + 1) / 2;
      ctx.strokeStyle = "rgba(138,91,216," + (cur.a * (0.07 + depth * 0.34)).toFixed(3) + ")";
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
    for (k = 0; k < N; k++) {
      var q = P[k], dq = (q[2] + 1) / 2;
      ctx.fillStyle = "rgba(165,139,230," + (cur.a * (0.12 + dq * 0.6)).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(q[0], q[1], 0.9 + dq * 1.6, 0, 6.2832); ctx.fill();
    }
  }
  function loop(time) { draw(time); requestAnimationFrame(loop); }
  if (ctx) {
    resize();
    window.addEventListener("resize", function () { resize(); if (!animated) draw(0); });
    window.addEventListener("pointermove", function (e) { mouse.tx = (e.clientX / innerWidth - 0.5) * 2; mouse.ty = (e.clientY / innerHeight - 0.5) * 2; }, { passive: true });
    if (animated) requestAnimationFrame(function (t) { t0 = t; loop(t); });
    else { cur.a = 1; cur.x = tgt.x; cur.y = tgt.y; draw(0); }
  }

  /* =====================================================================
     Cenas: entrada, menu ativo, objeto de fundo e início dos painéis
     ===================================================================== */
  var scenes = $$(".scene"), links = $$("[data-nav]"), activeId = "", projectsPlayed = false;
  function update() {
    var mid = innerHeight * 0.5, vh = innerHeight;
    scenes.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top < vh * 0.7 && r.bottom > vh * 0.3 && !s.classList.contains("on")) {
        s.classList.add("on");
        if (s.id === "projetos" && !projectsPlayed) { projectsPlayed = true; playDash(current, true); }
      }
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

  /* início */
  renderDashes();
  applyLang();
  if (!animated) { scenes.forEach(function (s) { s.classList.add("on"); }); $$(".dash").forEach(function (d) { d.classList.add("play"); }); }
  function begin() { update(); }
  if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 800); })]).then(function () { requestAnimationFrame(begin); });
  else begin();
  setTimeout(update, 0);
})();
