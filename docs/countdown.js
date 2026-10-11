/* ==============================
   GRADUATION COUNTDOWN, CURRENT TIME AND GRADUATES SLIDESHOW
   ==============================
   Used on both pages:
   - index.html: the big graduation banner (boxes + slideshow)
   - gallery.html: the slim top bar
   To change the date, edit GRADUATION below.
   Times are Zimbabwe time (UTC+2, no daylight saving). */

(function () {

    // 28 November 2026, 00:00 Zimbabwe time (= 27 Nov 22:00 UTC)
    const GRADUATION = Date.UTC(2026, 10, 27, 22, 0, 0);
    const GRADUATION_DAY_END = GRADUATION + 24 * 60 * 60 * 1000;

    const SLIDE_SECONDS = 3;

    const timeFormat = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Harare",
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    function pad(n) {
        return n < 10 ? "0" + n : String(n);
    }

    function all(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
    }

    /* ---------- countdown + clock ---------- */

    const compactEl = document.getElementById("grad-countdown");       // gallery bar
    const compactWrap = document.getElementById("grad-countdown-wrap");
    const boxes = all(".js-grad-boxes");                               // homepage banner
    const dayOfEls = all(".js-grad-dayof");
    const titleEls = all(".js-grad-title");
    const clocks = all(".js-clock").concat(all("#current-time"));

    function setBoxes(parts) {
        Object.keys(parts).forEach(function (key) {
            all('[data-cd="' + key + '"]').forEach(function (el) {
                el.textContent = parts[key];
            });
        });
    }

    function showMessage(text) {
        boxes.forEach(function (el) { el.hidden = true; });
        dayOfEls.forEach(function (el) { el.hidden = false; el.textContent = text; });
    }

    function update() {

        const now = Date.now();
        const clockText = timeFormat.format(new Date(now)) + " (Zimbabwe time)";
        clocks.forEach(function (el) { el.textContent = clockText; });

        if (now < GRADUATION) {
            let left = Math.floor((GRADUATION - now) / 1000);
            const days = Math.floor(left / 86400); left %= 86400;
            const hours = Math.floor(left / 3600); left %= 3600;
            const minutes = Math.floor(left / 60);
            const seconds = left % 60;

            setBoxes({ days: days, hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) });

            if (compactEl) {
                compactEl.innerHTML =
                    '<span class="cd-unit"><b>' + days + '</b> ' + (days === 1 ? "day" : "days") + '</span>' +
                    '<span class="cd-unit"><b>' + pad(hours) + '</b> hrs</span>' +
                    '<span class="cd-unit"><b>' + pad(minutes) + '</b> min</span>' +
                    '<span class="cd-unit"><b>' + pad(seconds) + '</b> sec</span>';
            }

        } else if (now < GRADUATION_DAY_END) {
            showMessage("🎉 It's Graduation Day! Congratulations, graduates! 🎉");
            if (compactEl) compactEl.textContent = "It's Graduation Day! Congratulations, graduates! 🎉";

        } else {
            titleEls.forEach(function (el) { el.textContent = "Congratulations to Our First Graduates!"; });
            showMessage("Thank you to every parent, teacher and friend who made our first graduation so special.");
            if (compactWrap) compactWrap.style.display = "none";
        }
    }

    update();
    setInterval(update, 1000);

    /* ---------- graduates slideshow ---------- */

    const slideBox = document.querySelector(".js-grad-slides");
    if (!slideBox) return;

    const slides = all(".js-grad-slides img");
    const counters = all(".js-grad-n");
    let current = 0;

    // Photos load one step ahead of the slideshow instead of all at once.
    function load(i) {
        const img = slides[(i + slides.length) % slides.length];
        if (img && img.dataset.src && !img.getAttribute("src")) {
            img.src = img.dataset.src;
        }
    }

    function show(index) {
        load(index + 1);
        slides[current].classList.remove("active");
        current = (index + slides.length) % slides.length;   // loops back to the first
        slides[current].classList.add("active");
        counters.forEach(function (el) { el.textContent = current + 1; });
    }

    load(1);

    if (slides.length > 1) {
        setInterval(function () {
            if (!document.hidden) show(current + 1);
        }, SLIDE_SECONDS * 1000);
    }

})();
