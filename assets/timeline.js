// Лента услуг «играет» при прокрутке страницы: указатель едет слева направо, тайм-код в окне бежит,
// а на узком экране сама лента прокручивается вправо вслед за указателем.
(function () {
  var editor = document.querySelector(".editor");
  if (!editor) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var playhead = editor.querySelector(".playhead");
  var scroller = editor.querySelector(".tl-scroll");
  var tc = editor.querySelector(".editor-tc");
  var SECONDS = 24, FPS = 25;
  var ticking = false;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function update() {
    ticking = false;
    var r = editor.getBoundingClientRect();
    var vh = window.innerHeight;
    // старт — верх ленты на 85% высоты окна, финиш — низ ленты на 30%
    var p = (vh * 0.85 - r.top) / (r.height + vh * 0.55);
    p = Math.max(0, Math.min(1, p));

    playhead.style.left = p * 100 + "%";
    var f = Math.round(p * SECONDS * FPS);
    tc.textContent = "00:00:" + pad(Math.floor(f / FPS)) + ":" + pad(f % FPS);
    var extra = scroller.scrollWidth - scroller.clientWidth;
    if (extra > 0) scroller.scrollLeft = p * extra;
  }

  function request() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  update();
})();
