/**
 * Le assets/data/linkedin-posts.json e monta os cards da secao "Direto do LinkedIn".
 * Para publicar um post novo, basta adicionar um objeto nesse JSON:
 * { "date": "2026-09-20", "text": "...", "url": "https://www.linkedin.com/posts/...", "image": "assets/images/linkedin/arquivo.webp" }
 * O campo "image" e opcional.
 */
(function () {
    "use strict";

    var container = document.getElementById("linkedinPosts");
    var emptyState = document.getElementById("linkedinEmpty");
    if (!container) return;

    fetch("assets/data/linkedin-posts.json", { cache: "no-store" })
        .then(function (res) {
            return res.ok ? res.json() : [];
        })
        .then(function (posts) {
            renderPosts(Array.isArray(posts) ? posts : []);
        })
        .catch(function () {
            renderPosts([]);
        });

    function renderPosts(posts) {
        var valid = posts
            .filter(function (post) {
                return post && post.url && post.text;
            })
            .sort(function (a, b) {
                return new Date(b.date) - new Date(a.date);
            })
            .slice(0, 6);

        if (valid.length === 0) {
            container.innerHTML = "";
            if (emptyState) emptyState.style.display = "";
            return;
        }

        if (emptyState) emptyState.style.display = "none";
        container.innerHTML = valid.map(renderCard).join("");
    }

    function renderCard(post) {
        var date = formatDate(post.date);
        var image = post.image
            ? '<div class="post-image"><img loading="lazy" src="' + escapeHtml(post.image) + '" alt=""></div>'
            : "";

        return (
            '<a class="wg-post" href="' + escapeHtml(post.url) + '" target="_blank" rel="noopener noreferrer">' +
                image +
                '<div class="post-content">' +
                    '<div class="post-top text-caption">' +
                        (date ? '<span class="post-date">' + date + "</span>" : "<span></span>") +
                        '<span class="post-tag"><i class="icon icon-arrow-top-right"></i>LinkedIn</span>' +
                    "</div>" +
                    '<p class="post-text text-body-2">' + escapeHtml(post.text) + "</p>" +
                "</div>" +
            "</a>"
        );
    }

    function formatDate(value) {
        if (!value) return "";
        var parsed = new Date(value);
        if (isNaN(parsed.getTime())) return "";
        return parsed.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
    }

    function escapeHtml(value) {
        var map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
        return String(value).replace(/[&<>"']/g, function (ch) {
            return map[ch];
        });
    }
})();
