(function () {
  "use strict";

  var gate = document.getElementById("babyAccessGate");
  var input = document.getElementById("babyAccessInput");
  var submit = document.getElementById("babyAccessSubmit");
  var error = document.getElementById("babyAccessError");
  var appRoot = document.getElementById("babyAppRoot");
  var unlocking = false;

  // Cùng mật khẩu với Soroban, nhưng không để nguyên chuỗi trong source.
  // Đây chỉ là lớp gây khó khi xem F12, không phải access control phía server.
  var _k = 91;
  var _p = [109, 106, 106, 104, 107, 107];

  function expectedPassword() {
    return _p.map(function (n) { return String.fromCharCode(n ^ _k); }).join("");
  }

  function asset(parts) {
    return parts.join("");
  }

  function loadStyle(href) {
    return new Promise(function (resolve, reject) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  function buildJourneyShell() {
    appRoot.innerHTML =
      '<div class="journey-bg" aria-hidden="true">' +
        '<div class="journey-bg__layer journey-bg__layer--a" id="bgA"></div>' +
        '<div class="journey-bg__layer journey-bg__layer--b" id="bgB"></div>' +
        '<div class="journey-bg__veil"></div>' +
      '</div>' +

      '<header class="baby-hero" id="babyHero">' +
        '<div class="baby-hero__shell">' +
          '<section class="baby-hero__identity" aria-label="Giới thiệu bé">' +
            '<div class="baby-hero__eyebrow">DISCOVERY · BABY</div>' +
            '<div class="baby-hero__identity-row">' +
              '<div class="baby-hero__avatar" aria-hidden="true"><span id="profileInitials">YC</span></div>' +
              '<div class="baby-hero__title-block">' +
                '<h1 class="baby-hero__name" id="profileName">Yên &amp; Cá</h1>' +
                '<div class="baby-hero__hanzi" id="profileHanzi" lang="zh-Hans"></div>' +
              '</div>' +
            '</div>' +
            '<p class="baby-hero__alias" id="profileAlias" hidden></p>' +
            '<p class="baby-hero__bio" id="profileBio"></p>' +
            '<p class="baby-hero__meaning" id="profileMeaning"></p>' +
            '<div class="baby-hero__traits" id="profileTraits"></div>' +
          '</section>' +

          '<aside class="baby-hero__memory-card" aria-label="Hồ sơ chị em">' +
            '<div class="memory-card__heading">' +
              '<p class="memory-card__kicker">Hồ sơ chị em</p>' +
              '<span class="memory-card__seal" id="profileSeal" aria-hidden="true">YC</span>' +
            '</div>' +
            '<div class="memory-card__sisters">' +
              '<div class="sister-card sister-card--yen">' +
                '<div class="sister-card__top"><strong>Yên</strong><span class="sister-card__hanzi">秦邃嫣</span></div>' +
                '<small>Sinh 04/04/2021 · 16:00</small>' +
                '<span class="sister-card__age" id="sisterYenAge"></span>' +
              '</div>' +
              '<div class="sister-card sister-card--ca">' +
                '<div class="sister-card__top"><strong>Cá</strong><span class="sister-card__hanzi">秦懿奎</span></div>' +
                '<small>Sinh 08/12/2022 · 07:10</small>' +
                '<span class="sister-card__age" id="sisterCaAge"></span>' +
              '</div>' +
            '</div>' +
          '</aside>' +
        '</div>' +
        '<div class="baby-hero__scroll-hint" aria-hidden="true"><span>CUỘN ĐỂ XEM HÀNH TRÌNH</span><i></i></div>' +
      '</header>' +

      '<aside class="age-rail" aria-label="Tuổi hiện tại trong hành trình">' +
        '<button type="button" class="age-rail__label" id="ageRailLabel" aria-expanded="false" aria-controls="journeyContents">0 tháng</button>' +
        '<div class="age-rail__track" tabindex="0" role="slider" aria-label="Chọn tuổi trong hành trình" aria-valuemin="0" aria-valuemax="65" aria-valuenow="0">' +
          '<span class="age-rail__fill" id="ageRailFill"></span>' +
          '<span class="age-rail__dot" id="ageRailDot"></span>' +
        '</div>' +
        '<div class="age-rail__ends"><span>0m</span><span id="ageRailMax">63m</span></div>' +
      '</aside>' +

      '<button type="button" class="mobile-age" id="mobileAge" aria-expanded="false" aria-controls="journeyContents">0 tháng</button>' +

      '<main class="journey" id="journey">' +
        '<div class="journey__intro">' +
          '<p id="journeyIntro">Những bức ảnh, đoạn video và cột mốc được nối lại theo tuổi, để mỗi lần cuộn xuống là một đoạn của hành trình lớn lên.</p>' +
        '</div>' +
        '<div class="journey__stream" id="journeyStream"></div>' +
        '<section class="journey-now" id="journeyNow">' +
          '<span class="journey-now__eyebrow">HIỆN TẠI</span>' +
          '<h2>Hành trình vẫn đang tiếp tục</h2>' +
          '<p>Những hình ảnh, video và cột mốc mới sẽ tiếp tục được nối vào cùng trục tháng tuổi này.</p>' +
        '</section>' +
      '</main>' +

      '<div class="media-viewer" id="mediaViewer" hidden>' +
        '<button class="media-viewer__backdrop" type="button" data-close-viewer aria-label="Đóng"></button>' +
        '<div class="media-viewer__panel" role="dialog" aria-modal="true" aria-label="Xem media">' +
          '<button class="media-viewer__close" type="button" data-close-viewer aria-label="Đóng">×</button>' +
          '<div class="media-viewer__content" id="mediaViewerContent"></div>' +
        '</div>' +
      '</div>';
  }

  async function bootJourney() {
    var cssBase = asset(["./", "css", "/"]);
    var dataBase = asset(["./", "data", "/"]);
    var jsBase = asset(["./", "js", "/"]);

    await Promise.all([
      loadStyle(cssBase + asset(["baby", ".css"])),
      loadStyle(cssBase + asset(["gallery", ".css"])),
      loadStyle(cssBase + asset(["media", "-ux", ".css"])),
      loadStyle(cssBase + asset(["hero", "-refresh", ".css?v=20260905b"]))
    ]);

    buildJourneyShell();

    await loadScript(dataBase + asset(["baby", "-data", ".js"]));
    await loadScript(dataBase + asset(["canonical", "-events", ".js"]));

    // Dùng ảnh thật hiện tại làm background chung. Engine stage vẫn giữ nguyên.
    if (window.BABY_DISCOVERY_DATA && Array.isArray(window.BABY_DISCOVERY_DATA.backgrounds)) {
      window.BABY_DISCOVERY_DATA.backgrounds.forEach(function (stage) {
        stage.asset = window.BABY_DISCOVERY_DATA.profile.backgroundAsset || null;
      });
    }

    await loadScript(dataBase + "media-manifest.js");
    await loadScript(dataBase + "story-observations.js");
    await loadScript(jsBase + asset(["story", "-enrichment-v2", ".js"]));
    await loadScript(jsBase + asset(["story", "-bridges", ".js"]));
    await loadScript(jsBase + asset(["media", "-ux-prep", ".js"]));
    await loadScript(jsBase + asset(["main", ".js"]));
    await loadScript(jsBase + asset(["product", "-copy-polish", ".js"]));
    await loadScript(jsBase + asset(["media", "-ux", ".js"]));
    await loadScript(jsBase + asset(["gallery", "-enhancer", ".js"]));
    await loadScript(jsBase + "media-filename.js");
  }

  function showError(message) {
    error.textContent = message || "Sai mật khẩu, thử lại";
    error.classList.add("is-visible");
  }

  function clearError() {
    error.classList.remove("is-visible");
  }

  async function unlock() {
    if (unlocking) return;
    var entered = input ? input.value : "";

    if (entered !== expectedPassword()) {
      showError("Sai mật khẩu, thử lại");
      if (input) {
        input.value = "";
        input.focus();
      }
      return;
    }

    unlocking = true;
    clearError();
    submit.disabled = true;
    submit.textContent = "Opening…";

    try {
      await bootJourney();
      document.body.classList.remove("baby-locked");
      gate.classList.add("is-leaving");
      setTimeout(function () {
        if (gate && gate.parentNode) gate.parentNode.removeChild(gate);
      }, 340);
    } catch (err) {
      unlocking = false;
      submit.disabled = false;
      submit.textContent = "Open";
      showError("Không thể tải hành trình. Hãy thử lại.");
      console.error("Baby boot failed", err);
    }
  }

  window.babyUnlockJourney = unlock;

  if (submit) submit.addEventListener("click", unlock);
  if (input) {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") unlock();
      if (event.key === "Escape") {
        input.value = "";
        clearError();
        input.blur();
      }
    });

    setTimeout(function () { input.focus(); }, 180);
  }
})();
