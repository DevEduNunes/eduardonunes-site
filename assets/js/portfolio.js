(function () {
  "use strict";
  document.documentElement.classList.add("js");

  // Menu mobile
  var nav = document.querySelector(".nav");
  var btn = document.querySelector(".menu-btn");
  if (nav && btn) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Aparecer ao rolar
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // Ampliar prints dos projetos
  var dlg = document.getElementById("lightbox");
  if (dlg && dlg.showModal) {
    var img = dlg.querySelector("img");
    var cap = dlg.querySelector("span");
    document.querySelectorAll("[data-zoom]").forEach(function (b) {
      b.addEventListener("click", function () {
        var src = b.getAttribute("data-zoom");
        img.src = src;
        img.alt = b.getAttribute("data-title") || "";
        cap.textContent = b.getAttribute("data-title") || "";
        dlg.showModal();
      });
    });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  }

  // Posts do LinkedIn (assets/data/linkedin-posts.json)
  var box = document.getElementById("linkedinPosts");
  if (box) {
    fetch("assets/data/linkedin-posts.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : []; })
      .catch(function () { return []; })
      .then(function (posts) {
        posts = (Array.isArray(posts) ? posts : [])
          .filter(function (p) { return p && p.url && p.text; })
          .sort(function (a, b) { return new Date(b.date) - new Date(a.date); })
          .slice(0, 6);
        if (!posts.length) { box.closest("section").hidden = true; return; }
        box.innerHTML = posts.map(function (p) {
          var d = new Date(p.date + "T12:00:00");
          var date = isNaN(d) ? "" : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
          return '<a class="post reveal in" href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer">' +
            '<div class="post-top"><span>' + date + "</span><span>LinkedIn ↗</span></div>" +
            '<p class="post-text">' + esc(p.text) + "</p>" +
            '<span class="post-more">Ler no LinkedIn →</span></a>';
        }).join("");
      });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
})();
