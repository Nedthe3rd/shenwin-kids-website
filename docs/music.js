/* ==============================
   GRADUATION SONG
   ==============================
   Starts playing as soon as the page opens.
   Most browsers block sound until the visitor touches the page,
   so if autoplay is blocked the song starts on the first tap, click,
   key press or scroll. The round button (bottom left) turns it on/off,
   and a visitor who turns it off is not forced to hear it again
   on the next page they open. To change the song, replace
   audio/graduation-song.mp3. */

(function () {

    const KEY = "shenwin-music-off";
    const song = new Audio("audio/graduation-song.mp3?v=2");
    song.loop = true;
    song.preload = "none";   // don't download the song until it actually plays
    song.volume = 0.8;

    let userOff = false;
    try { userOff = localStorage.getItem(KEY) === "1"; } catch (e) {}

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "music-toggle";
    document.body.appendChild(btn);

    function render() {
        const on = !song.paused;
        btn.innerHTML = on
            ? '<i class="fa-solid fa-volume-high"></i><span>Music on</span>'
            : '<i class="fa-solid fa-volume-xmark"></i><span>Play music</span>';
        btn.setAttribute("aria-pressed", on);
        btn.setAttribute("aria-label", on ? "Turn graduation music off" : "Play graduation music");
        btn.classList.toggle("is-on", on);
    }

    const unlockEvents = ["pointerdown", "keydown", "touchstart", "scroll"];

    function removeUnlock() {
        unlockEvents.forEach(function (ev) {
            window.removeEventListener(ev, unlock, true);
        });
    }

    function unlock(e) {
        if (e && e.target && btn.contains(e.target)) return;   // the button handles itself
        if (userOff || !song.paused) { removeUnlock(); return; }
        song.play().then(removeUnlock).catch(function () {});
    }

    function tryStart() {
        if (userOff) { render(); return; }
        song.play().catch(function () {
            unlockEvents.forEach(function (ev) {
                window.addEventListener(ev, unlock, { capture: true, passive: true });
            });
        });
    }

    btn.addEventListener("click", function () {
        if (song.paused) {
            userOff = false;
            try { localStorage.removeItem(KEY); } catch (e) {}
            song.play().catch(function () {});
        } else {
            userOff = true;
            try { localStorage.setItem(KEY, "1"); } catch (e) {}
            song.pause();
            removeUnlock();
        }
    });

    song.addEventListener("play", render);
    song.addEventListener("pause", render);

    render();

    // Wait until the page and its pictures have loaded before fetching the
    // song, so the photos appear first on slow connections.
    if (document.readyState === "complete") {
        tryStart();
    } else {
        window.addEventListener("load", tryStart, { once: true });
    }

})();
