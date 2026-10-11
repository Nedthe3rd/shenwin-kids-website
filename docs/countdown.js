/* ==============================
   TOP BAR: GRADUATION COUNTDOWN + CURRENT TIME
   ==============================
   To change the date, edit GRADUATION below.
   Times are Zimbabwe time (UTC+2, no daylight saving). */

(function () {

    // 28 November 2026, 00:00 Zimbabwe time (= 27 Nov 22:00 UTC)
    const GRADUATION = Date.UTC(2026, 10, 27, 22, 0, 0);
    const GRADUATION_DAY_END = GRADUATION + 24 * 60 * 60 * 1000;

    const countdownEl = document.getElementById("grad-countdown");
    const countdownWrap = document.getElementById("grad-countdown-wrap");
    const clockEl = document.getElementById("current-time");

    if (!countdownEl || !clockEl) return;

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

    function unit(value, label) {
        return '<span class="cd-unit"><b>' + value + '</b> ' + label + '</span>';
    }

    function update() {

        const now = Date.now();

        clockEl.textContent = timeFormat.format(new Date(now));

        if (now < GRADUATION) {
            let left = Math.floor((GRADUATION - now) / 1000);
            const days = Math.floor(left / 86400); left %= 86400;
            const hours = Math.floor(left / 3600); left %= 3600;
            const minutes = Math.floor(left / 60);
            const seconds = left % 60;

            countdownEl.innerHTML =
                unit(days, days === 1 ? "day" : "days") +
                unit(pad(hours), "hrs") +
                unit(pad(minutes), "min") +
                unit(pad(seconds), "sec");

        } else if (now < GRADUATION_DAY_END) {
            countdownEl.textContent = "It's Graduation Day! Congratulations, graduates! 🎉";

        } else if (countdownWrap) {
            // After graduation day, only the clock stays.
            countdownWrap.style.display = "none";
        }
    }

    update();
    setInterval(update, 1000);

})();
