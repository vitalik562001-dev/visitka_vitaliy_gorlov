// Сцена за страницей: прокрутка передаётся в CSS (--p и --y), заголовок первого экрана проявляется по буквам.
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  // Буквы оборачиваются в span, слова держатся вместе, чтобы строки переносились как в обычном тексте.
  // Экранные дикторы читают заголовок целиком из aria-label.
  if (reduce) return;
  document.querySelectorAll(".reveal").forEach(function (el) {
    var text = el.textContent.trim();
    var i = 0;
    el.setAttribute("aria-label", text);
    el.textContent = "";
    text.split(" ").forEach(function (word, n) {
      if (n) el.appendChild(document.createTextNode(" "));
      var w = document.createElement("span");
      w.className = "w";
      w.setAttribute("aria-hidden", "true");
      Array.from(word).forEach(function (c) {
        var ch = document.createElement("span");
        ch.className = "ch";
        ch.style.setProperty("--i", i++);
        ch.textContent = c;
        w.appendChild(ch);
      });
      el.appendChild(w);
    });
  });
})();
