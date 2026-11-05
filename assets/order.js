// Анкета заявки: по кнопке с data-order открывается окно «Давайте познакомимся»,
// внутри — Яндекс Форма. Ответы хранит Яндекс Формы и присылает владельцу на почту.
// FORM_URL — ссылка на форму из Яндекс Форм (кнопка «Опубликовать» → ссылка вида https://forms.yandex.ru/u/…/).
(function () {
  var FORM_URL = "https://forms.yandex.ru/u/6aece6a9c45c07a532aff536/";

  var dialog = document.getElementById("order");
  if (!dialog || typeof dialog.showModal !== "function") return; // старый браузер: кнопка ведёт к контактам

  var box = dialog.querySelector(".order-frame");
  var opener = null;
  var loaded = false;

  // встраиваем форму при первом открытии, чтобы не замедлять загрузку страницы
  function load() {
    if (loaded) return;
    loaded = true;
    var m = FORM_URL.match(/forms\.yandex\.ru\/(?:u|cloud)\/([^/?#]+)/);
    if (!m) {
      box.innerHTML = '<p class="todo">[ВСТАВИТЬ: ссылка на Яндекс Форму в assets/order.js]</p>';
      return;
    }
    var src = FORM_URL.split(/[?#]/)[0].replace(/\/?$/, "/") + "?iframe=1";
    var frame = document.createElement("iframe");
    frame.src = src;
    frame.name = "ya-form-" + m[1]; // по имени скрипт Яндекса подгоняет высоту окна под форму
    frame.title = "Анкета заявки";
    frame.setAttribute("frameborder", "0");
    box.appendChild(frame);
    var s = document.createElement("script");
    s.src = "https://forms.yandex.ru/_static/embed.js";
    s.async = true;
    document.body.appendChild(s);
  }

  function open(e) {
    e.preventDefault();
    opener = e.currentTarget;
    load();
    document.documentElement.classList.add("order-open");
    dialog.showModal();
  }
  function shut() { dialog.close(); }

  document.querySelectorAll("[data-order]").forEach(function (btn) { btn.addEventListener("click", open); });
  dialog.querySelector(".order-close").addEventListener("click", shut);
  // клик по затемнению вокруг окна закрывает его
  dialog.addEventListener("click", function (e) { if (e.target === dialog) shut(); });
  dialog.addEventListener("close", function () {
    document.documentElement.classList.remove("order-open");
    if (opener) opener.focus();
  });
})();
