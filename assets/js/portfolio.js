(function () {
  "use strict";

  // Ampliar os prints dos projetos
  var dlg = document.getElementById("lightbox");
  if (dlg && dlg.showModal) {
    var img = dlg.querySelector("img");
    var cap = dlg.querySelector("span");
    document.querySelectorAll("[data-zoom]").forEach(function (b) {
      b.addEventListener("click", function () {
        var title = b.getAttribute("data-title") || "";
        img.src = b.getAttribute("data-zoom");
        img.alt = title;
        cap.textContent = title;
        dlg.showModal();
      });
    });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  }

  // Posts do LinkedIn: assets/data/linkedin-posts.json
  // Para publicar um novo, acrescente { "date": "AAAA-MM-DD", "text": "...", "url": "..." }
  var list = document.getElementById("linkedinPosts");
  if (list) {
    fetch("assets/data/linkedin-posts.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : []; })
      .catch(function () { return []; })
      .then(function (posts) {
        posts = (Array.isArray(posts) ? posts : [])
          .filter(function (p) { return p && p.url && p.text; })
          .sort(function (a, b) { return new Date(b.date) - new Date(a.date); })
          .slice(0, 6);
        if (!posts.length) { list.closest("section").hidden = true; return; }
        list.innerHTML = posts.map(function (p) {
          var d = new Date(p.date + "T12:00:00");
          var date = isNaN(d) ? "" : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
          var title = String(p.text).split("\n")[0].trim();
          if (title.length > 120) title = title.slice(0, 117).replace(/\s+\S*$/, "") + "...";
          return '<li><a href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer">' +
            '<span class="mono">' + date + "</span><span>" + esc(title) + "</span></a></li>";
        }).join("");
      });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
})();
