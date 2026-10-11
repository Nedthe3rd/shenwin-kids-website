/* ==============================
   HEADER & NAVIGATION
   - mobile menu open/close (animated ☰ / ✕)
   - soft shadow on the header once the page scrolls
   - highlights the menu link for the section on screen
   ============================== */

(function () {

    const header = document.querySelector(".site-header");
    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("main-nav");
    if (!header || !toggle || !nav) return;

    /* ---------- mobile menu ---------- */

    function setOpen(open) {
        nav.classList.toggle("active", open);
        toggle.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    }

    toggle.addEventListener("click", function () {
        setOpen(!nav.classList.contains("active"));
    });

    nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () { setOpen(false); });
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") setOpen(false);
    });

    /* ---------- shadow on scroll ---------- */

    function onScroll() {
        header.classList.toggle("scrolled", window.scrollY > 10);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---------- active section (homepage only) ---------- */

    const links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.nav-cta)'));
    if (!links.length || !("IntersectionObserver" in window)) return;

    const byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });

    const sections = Object.keys(byId)
        .map(function (id) { return document.getElementById(id); })
        .filter(Boolean);

    function activate(id) {
        links.forEach(function (a) {
            const on = a === byId[id];
            a.classList.toggle("active", on);
            if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
    }

    const visible = {};
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0; });
        let best = null, bestRatio = 0;
        sections.forEach(function (sec) {
            if ((visible[sec.id] || 0) > bestRatio) { best = sec.id; bestRatio = visible[sec.id]; }
        });
        if (best) activate(best);
    }, { rootMargin: "-140px 0px -45% 0px", threshold: [0, 0.15, 0.4, 0.75] });

    sections.forEach(function (sec) { observer.observe(sec); });
    activate("home");

})();
