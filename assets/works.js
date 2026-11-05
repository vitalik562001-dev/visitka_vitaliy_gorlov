// Плеер работ: по клику на превью ролик открывается поверх страницы и разворачивается на весь экран.
// data-src — файл на сайте: играет сразу. data-video — id файла на Google Диске: плеер Диска, Play внутри него.
// Выход из полноэкранного режима (Esc) закрывает плеер. Без JS ссылка просто откроет ролик в новой вкладке.
(function () {
  var player = document.getElementById("player");
  if (!player) return;
  var frame = player.querySelector(".player-frame");
  var video = player.querySelector(".player-video");
  var close = player.querySelector(".player-close");
  var opener = null;

  function fsElement() { return document.fullscreenElement || document.webkitFullscreenElement; }

  function open(link) {
    opener = link;
    var title = link.querySelector(".work-title").textContent.trim();
    var src = link.dataset.src;
    frame.hidden = !!src;
    video.hidden = !src;
    if (src) {
      video.src = src;
      video.setAttribute("aria-label", title);
    } else {
      frame.src = "https://drive.google.com/file/d/" + link.dataset.video + "/preview";
      frame.title = title;
    }
    player.hidden = false;
    document.documentElement.classList.add("player-open");
    close.focus();

    var req = player.requestFullscreen || player.webkitRequestFullscreen;
    if (req) {
      var p = req.call(player);
      if (p && p.catch) p.catch(function () {});
    } else if (src && video.webkitEnterFullscreen) {
      // iPhone: полноэкранный режим есть только у самого видео
      video.addEventListener("loadedmetadata", function once() {
        video.removeEventListener("loadedmetadata", once);
        video.webkitEnterFullscreen();
      });
    }
    if (src) {
      var playing = video.play();
      if (playing && playing.catch) playing.catch(function () {});
    }
  }

  function shut() {
    if (player.hidden) return;
    player.hidden = true;
    video.pause();
    video.removeAttribute("src");
    video.load();
    frame.src = "about:blank";
    document.documentElement.classList.remove("player-open");
    if (fsElement()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    if (opener) opener.focus();
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest("[data-src], [data-video]");
    if (!link) return;
    e.preventDefault();
    open(link);
  });
  close.addEventListener("click", shut);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") shut();
  });
  function onFsChange() { if (!fsElement()) shut(); }
  document.addEventListener("fullscreenchange", onFsChange);
  document.addEventListener("webkitfullscreenchange", onFsChange);
  // iPhone: закрыли системный полноэкранный плеер — закрываем и наш
  video.addEventListener("webkitendfullscreen", shut);
})();
