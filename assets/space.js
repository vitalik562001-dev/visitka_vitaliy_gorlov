// Сцена за страницей: прокрутка передаётся в CSS (--p и --y).
(function () {
  var root = document.documentElement;

  var queued = false;
  function update() {
    var y = window.scrollY;
    root.style.setProperty("--p", Math.min(1, y / (window.innerHeight * 1.5)).toFixed(3));
    root.style.setProperty("--y", (y * 0.35).toFixed(1));
    queued = false;
  }
  window.addEventListener("scroll", function () {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
