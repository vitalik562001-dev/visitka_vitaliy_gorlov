// Монтажные ленты «играют» при прокрутке страницы: указатель едет слева направо, тайм-код в окне бежит,
// а на узком экране сама лента прокручивается вправо вслед за указателем.
// data-seconds — длина ленты в секундах; data-steps — подсвечивать клип, над которым стоит указатель.
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var FPS = 25;
  var ticking = false;

  var editors = Array.prototype.map.call(document.querySelectorAll(".editor"), function (el) {
    return {
      el: el,
      playhead: el.querySelector(".playhead"),
      zone: el.querySelector(".tl-playzone"),
      scroller: el.querySelector(".tl-scroll"),
      tc: el.querySelector(".editor-tc"),
      seconds: Number(el.dataset.seconds) || 24,
      clips: el.hasAttribute("data-steps") ? el.querySelectorAll(".tl-clip") : []
    };
  });
  if (!editors.length) return;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function update() {
    ticking = false;
    var vh = window.innerHeight;
    editors.forEach(function (ed) {
      var r = ed.el.getBoundingClientRect();
      // старт — верх ленты на 85% высоты окна, финиш — низ ленты на 30%
      var p = (vh * 0.85 - r.top) / (r.height + vh * 0.55);
      p = Math.max(0, Math.min(1, p));

      ed.playhead.style.left = p * 100 + "%";
      var f = Math.round(p * ed.seconds * FPS);
      ed.tc.textContent = "00:00:" + pad(Math.floor(f / FPS)) + ":" + pad(f % FPS);
      var extra = ed.scroller.scrollWidth - ed.scroller.clientWidth;
      if (extra > 0) ed.scroller.scrollLeft = p * extra;

      if (ed.clips.length) {
        var x = ed.zone.getBoundingClientRect().left + ed.zone.clientWidth * p;
        Array.prototype.forEach.call(ed.clips, function (clip) {
          var c = clip.getBoundingClientRect();
          clip.classList.toggle("is-active", x >= c.left && x < c.right + 2);
        });
      }
    });
  }

  function request() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  update();
})();
