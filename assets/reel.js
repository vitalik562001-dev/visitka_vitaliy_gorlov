// Лента отзывов: стрелки листают на одну карточку, одновременно играет только одно видео.
(function () {
  var smooth = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  document.querySelectorAll(".reel").forEach(function (reel) {
    var track = reel.querySelector(".reel-track");
    var prev = reel.querySelector('[data-dir="-1"]');
    var next = reel.querySelector('[data-dir="1"]');

    function step() {
      var item = track.querySelector(".reel-item");
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return item ? item.getBoundingClientRect().width + gap : track.clientWidth;
    }
    function update() {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    }

    [prev, next].forEach(function (btn) {
      btn.addEventListener("click", function () {
        track.scrollBy({ left: step() * Number(btn.dataset.dir), behavior: smooth ? "smooth" : "auto" });
      });
    });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  document.addEventListener("play", function (e) {
    document.querySelectorAll(".reel video").forEach(function (v) {
      if (v !== e.target) v.pause();
    });
  }, true);
})();
