// Плеер работ: по клику на превью ролик с Google Диска открывается поверх страницы и разворачивается на весь экран.
// Выход из полноэкранного режима (Esc) закрывает плеер. Без JS ссылка просто откроет ролик на Диске в новой вкладке.
(function () {
  var player = document.getElementById("player");
  if (!player) return;
  var frame = player.querySelector(".player-frame");
  var close = player.querySelector(".player-close");
  var opener = null;

  function fsElement() { return document.fullscreenElement || document.webkitFullscreenElement; }

  function open(id, link) {
    opener = link;
    frame.src = "https://drive.google.com/file/d/" + id + "/preview";
    frame.title = link.querySelector(".work-title").textContent.trim();
    player.hidden = false;
    document.documentElement.classList.add("player-open");
    close.focus();
    // на iPhone полноэкранный режим для блока недоступен — там плеер и так занимает весь экран
    var req = player.requestFullscreen || player.webkitRequestFullscreen;
    if (req) {
      var p = req.call(player);
      if (p && p.catch) p.catch(function () {});
    }
  }

  function shut() {
    if (player.hidden) return;
    player.hidden = true;
    frame.src = "about:blank";
    document.documentElement.classList.remove("player-open");
    if (fsElement()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    if (opener) opener.focus();
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest("[data-video]");
    if (!link) return;
    e.preventDefault();
    open(link.dataset.video, link);
  });
  close.addEventListener("click", shut);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") shut();
  });
  function onFsChange() { if (!fsElement()) shut(); }
  document.addEventListener("fullscreenchange", onFsChange);
  document.addEventListener("webkitfullscreenchange", onFsChange);
})();
