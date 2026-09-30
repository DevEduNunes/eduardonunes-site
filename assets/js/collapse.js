/**
 * Accordion / collapse leve (substitui o bootstrap.min.js de 127 KB).
 * Compatível com a marcação do Bootstrap 5 usada no FAQ:
 *   [data-bs-toggle="collapse"][data-bs-target="#id"] abre/fecha #id
 *   [data-bs-parent="#lista"] fecha os outros itens abertos do mesmo grupo
 * Usa as classes .collapse / .collapsing / .show e a classe .collapsed no gatilho,
 * então o CSS existente continua valendo.
 */
(function () {
    "use strict";

    var DURATION = 350; // igual à transição .collapsing do Bootstrap

    function triggersFor(target) {
        return document.querySelectorAll('[data-bs-toggle="collapse"][data-bs-target="#' + target.id + '"]');
    }

    function setTriggerState(target, open) {
        triggersFor(target).forEach(function (t) {
            t.classList.toggle("collapsed", !open);
            t.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    function afterTransition(el, fn) {
        var done = false;
        function finish() {
            if (done) return;
            done = true;
            el.removeEventListener("transitionend", finish);
            fn();
        }
        el.addEventListener("transitionend", finish);
        setTimeout(finish, DURATION + 50);
    }

    function show(target) {
        if (target.classList.contains("show") || target.classList.contains("collapsing")) return;

        var parentSel = target.getAttribute("data-bs-parent");
        if (parentSel) {
            var parent = document.querySelector(parentSel);
            if (parent) {
                parent.querySelectorAll(".collapse.show").forEach(function (other) {
                    if (other !== target && other.getAttribute("data-bs-parent") === parentSel) hide(other);
                });
            }
        }

        target.classList.remove("collapse");
        target.classList.add("collapsing");
        target.style.height = "0px";
        setTriggerState(target, true);

        // força o reflow antes de animar
        void target.offsetHeight;
        target.style.height = target.scrollHeight + "px";

        afterTransition(target, function () {
            target.classList.remove("collapsing");
            target.classList.add("collapse", "show");
            target.style.height = "";
        });
    }

    function hide(target) {
        if (!target.classList.contains("show") || target.classList.contains("collapsing")) return;

        target.style.height = target.getBoundingClientRect().height + "px";
        void target.offsetHeight;

        target.classList.add("collapsing");
        target.classList.remove("collapse", "show");
        target.style.height = "";
        setTriggerState(target, false);

        afterTransition(target, function () {
            target.classList.remove("collapsing");
            target.classList.add("collapse");
        });
    }

    document.addEventListener("click", function (e) {
        var trigger = e.target.closest('[data-bs-toggle="collapse"]');
        if (!trigger) return;
        var sel = trigger.getAttribute("data-bs-target") || trigger.getAttribute("href");
        if (!sel) return;
        var target = document.querySelector(sel);
        if (!target) return;
        e.preventDefault();
        if (target.classList.contains("show")) hide(target);
        else show(target);
    });
})();
