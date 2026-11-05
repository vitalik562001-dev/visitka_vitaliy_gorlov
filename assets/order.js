// Анкета заявки: окно открывается по кнопке с data-order, поля проверяются на странице,
// анкета уходит на почту владельца через Web3Forms (https://web3forms.com); ключ формы — в поле access_key в index.html.
(function () {
  var dialog = document.getElementById("order");
  if (!dialog || typeof dialog.showModal !== "function") return; // старый браузер: кнопка ведёт к контактам

  var ENDPOINT = "https://api.web3forms.com/submit";

  var form = dialog.querySelector(".order-form");
  var done = dialog.querySelector(".order-done");
  var send = dialog.querySelector(".order-send");
  var status = dialog.querySelector(".order-status");
  var name = form.querySelector("#f-name");
  var tg = form.querySelector("#f-tg");
  var vk = form.querySelector("#f-vk");
  var agree = form.querySelector("#f-agree");
  var opener = null;

  function open(e) {
    e.preventDefault();
    opener = e.currentTarget;
    form.hidden = false;
    done.hidden = true;
    status.textContent = "";
    document.documentElement.classList.add("order-open");
    dialog.showModal();
    name.focus();
  }
  function shut() { dialog.close(); }

  document.querySelectorAll("[data-order]").forEach(function (btn) { btn.addEventListener("click", open); });
  dialog.querySelector(".order-close").addEventListener("click", shut);
  dialog.querySelector(".order-ok").addEventListener("click", shut);
  // клик по затемнению вокруг окна закрывает его
  dialog.addEventListener("click", function (e) { if (e.target === dialog) shut(); });
  dialog.addEventListener("close", function () {
    document.documentElement.classList.remove("order-open");
    if (opener) opener.focus();
  });

  function setError(input, errId, text) {
    var err = document.getElementById(errId);
    err.textContent = text;
    [].concat(input).forEach(function (el) {
      if (text) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
    });
    return !text;
  }

  function validate() {
    var ok = true, first = null;
    function check(passed, inputs, errId, text) {
      setError(inputs, errId, passed ? "" : text);
      if (!passed) { ok = false; first = first || [].concat(inputs)[0]; }
    }
    check(name.value.trim().length >= 2, name, "e-name", "Напишите, как к вам обращаться.");
    check(tg.value.trim() || vk.value.trim(), [tg, vk], "e-contact", "Укажите Telegram или VK — иначе я не смогу ответить.");
    check(agree.checked, agree, "e-agree", "Без согласия на обработку данных я не могу принять анкету.");
    if (first) first.focus();
    return ok;
  }

  // ошибка исчезает, как только поле исправлено
  form.addEventListener("input", function (e) {
    if (e.target === name && name.value.trim().length >= 2) setError(name, "e-name", "");
    if ((e.target === tg || e.target === vk) && (tg.value.trim() || vk.value.trim())) setError([tg, vk], "e-contact", "");
    if (e.target === agree && agree.checked) setError(agree, "e-agree", "");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    if (!validate()) return;

    var data = {};
    new FormData(form).forEach(function (value, key) { data[key] = typeof value === "string" ? value.trim() : value; });
    if (data.botcheck) return; // отметил бот

    send.disabled = true;
    send.textContent = "Отправляю…";
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (res) {
        if (String(res.success) !== "true") throw new Error(res.message || "Web3Forms error");
        form.reset();
        form.hidden = true;
        done.hidden = false;
        dialog.querySelector(".order-ok").focus();
      })
      .catch(function (err) {
        if (window.console) console.warn("Анкета не отправлена:", err);
        status.textContent = "Не получилось отправить анкету. Попробуйте ещё раз или напишите мне в Telegram: @Vitaliy_Gorlov_Creator";
      })
      .then(function () {
        send.disabled = false;
        send.textContent = "Отправить анкету";
      });
  });
})();
