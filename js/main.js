(function () {
  "use strict";

  const data = window.BABY_DISCOVERY_DATA;
  if (!data) return;

  const profile = data.profile;
  const stream = document.getElementById("journeyStream");
  const journeyNow = document.getElementById("journeyNow");
  const bgA = document.getElementById("bgA");
  const bgB = document.getElementById("bgB");
  const ageRail = document.querySelector(".age-rail__track");
  const ageRailLabel = document.getElementById("ageRailLabel");
  const ageRailMax = document.getElementById("ageRailMax");
  const mobileAge = document.getElementById("mobileAge");
  const viewer = document.getElementById("mediaViewer");
  const viewerContent = document.getElementById("mediaViewerContent");

  document.documentElement.style.setProperty("--accent", profile.accent);
  document.documentElement.style.setProperty("--accent-warm", profile.accentWarm);

  document.getElementById("profileName").textContent = profile.name;
  document.getElementById("profileHanzi").textContent = profile.hanzi || "";
  document.getElementById("profileInitials").textContent = profile.initials || profile.name.split(/\s+/).map(function (part) { return part[0]; }).join("").slice(0, 2).toUpperCase();
  document.getElementById("profileSeal").textContent = profile.initials || profile.name.split(/\s+/).map(function (part) { return part[0]; }).join("").slice(0, 2).toUpperCase();
  document.getElementById("profileAlias").textContent = "Dữ liệu nguồn: " + profile.sourceAlias;
  document.getElementById("profileBio").textContent = profile.shortBio;
  document.getElementById("profileMeaning").textContent = profile.nameMeaning || "";
  (data.sisters || []).forEach(function (sister) {
    const el = document.getElementById("sister" + (sister.id === "yen" ? "Yen" : "Ca") + "Age");
    if (!el) return;
    const months = getMonthIndex(sister.birthDate, new Date());
    el.textContent = formatAge(Math.max(0, months));
    el.style.color = sister.accent;
  });
  document.getElementById("journeyIntro").textContent = "Những bức ảnh, đoạn video và cột mốc của " + profile.name + " được nối lại theo tuổi, để mỗi lần cuộn xuống là một đoạn của hành trình lớn lên.";
  document.getElementById("profileTraits").innerHTML = profile.personality
    .slice(0, 5)
    .map(function (trait) { return '<span class="trait-chip">' + escapeHtml(trait) + "</span>"; })
    .join("");

  const currentMonth = Math.max(0, getMonthIndex(profile.birthDate, new Date()));
  document.querySelectorAll(".sister-card__age").forEach(function () {});
  const journeyNowText = (data.sisters || []).map(function (sister) {
    const months = Math.max(0, getMonthIndex(sister.birthDate, new Date()));
    return sister.name + " " + formatAge(months);
  }).join(" · ");
  const journeyNowPara = document.querySelector("#journeyNow p");
  if (journeyNowPara) journeyNowPara.textContent = journeyNowText + " — những hình ảnh mới sẽ tiếp tục được nối vào hành trình này."
  ageRailMax.textContent = currentMonth + "m";

  let activeBg = "a";
  let activeStageId = null;
  let anchors = [];
  let anchorRefreshFrame = 0;
  const railShell = document.querySelector('.age-rail');
  let contents, contentsEntries = [], activeContents = null, closeContentsTimer;
  let navigationFrame = 0;
  function jumpToScene(el) {
    cancelAnimationFrame(navigationFrame);
    const until = performance.now() + 1000;
    function align() {
      window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'instant'});
      if (performance.now() < until) navigationFrame = requestAnimationFrame(align);
    }
    align();
  }
  ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function (name) {
    window.addEventListener(name, function () { cancelAnimationFrame(navigationFrame); }, {passive: true});
  });

  function showContents(open) {
    clearTimeout(closeContentsTimer);
    contents.hidden = !open;
    railShell.classList.toggle('is-open', open);
    ageRailLabel.setAttribute('aria-expanded', String(open));
    mobileAge.setAttribute('aria-expanded', String(open));
    if (open && activeContents) activeContents.scrollIntoView({block: 'nearest'});
  }

  function buildContents() {
    contents = document.createElement('nav');
    contents.id = 'journeyContents';
    contents.className = 'journey-contents';
    contents.setAttribute('aria-label', 'Mục lục hành trình');
    contents.hidden = true;
    contents.innerHTML = '<div class="journey-contents__heading"><strong>Hành trình của ' + profile.name + '</strong><button type="button" aria-label="Đóng mục lục">×</button></div><div class="journey-contents__list"></div>';
    const list = contents.lastElementChild;
    let year = -1;
    document.querySelectorAll('.scene[data-month]').forEach(function (el) {
      const month = Number(el.dataset.month), nextYear = Math.floor(month / 12);
      if (year !== nextYear) {
        year = nextYear;
        const heading = document.createElement('h3');
        heading.textContent = year === 0 ? 'Năm đầu đời' : year + ' tuổi';
        list.appendChild(heading);
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'journey-contents__item';
      button.innerHTML = '<span>' + escapeHtml(formatAge(month)) + '</span><strong>' + escapeHtml(el.querySelector('h2').textContent) + '</strong>';
      button.dataset.targetScene = el.dataset.sceneId;
      button.addEventListener('click', function () {
        showContents(false);
        el.setAttribute('tabindex', '-1');
        el.focus({preventScroll: true});
        jumpToScene(el);
      });
      list.appendChild(button);
      contentsEntries.push({el: el, button: button});
    });
    railShell.appendChild(contents);
    contents.querySelector('.journey-contents__heading button').addEventListener('click', function () { showContents(false); mobileAge.offsetParent ? mobileAge.focus() : ageRailLabel.focus(); });
    railShell.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && innerWidth > 900) showContents(true); });
    railShell.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') closeContentsTimer = setTimeout(function () { showContents(false); }, 220); });
    ageRailLabel.addEventListener('click', function () { showContents(contents.hidden); });
    mobileAge.addEventListener('click', function () { showContents(contents.hidden); });
    document.addEventListener('click', function (e) { if (!railShell.contains(e.target) && e.target !== mobileAge) showContents(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !contents.hidden) { showContents(false); (innerWidth <= 900 ? mobileAge : ageRailLabel).focus(); } });
    railShell.addEventListener('focusout', function () { setTimeout(function () { if (!railShell.contains(document.activeElement)) showContents(false); }, 0); });
    ageRail.setAttribute('aria-valuemax', String(currentMonth));
    function seek(month) {
      buildAnchors();
      const target = anchors.reduce(function (best, a) { return Math.abs(a.month - month) < Math.abs(best.month - month) ? a : best; }, anchors[0]);
      window.scrollTo({top: Math.max(0, target.top - innerHeight * .46), behavior: 'instant'});
    }
    function seekPointer(e) {
      const rect = ageRail.getBoundingClientRect();
      seek(Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)) * currentMonth);
    }
    ageRail.addEventListener('pointerdown', function (e) { if (e.button !== 0) return; e.preventDefault(); showContents(false); ageRail.setPointerCapture(e.pointerId); seekPointer(e); });
    ageRail.addEventListener('pointermove', function (e) { if (ageRail.hasPointerCapture(e.pointerId)) seekPointer(e); });
    ageRail.addEventListener('pointerup', function (e) { if (ageRail.hasPointerCapture(e.pointerId)) ageRail.releasePointerCapture(e.pointerId); });
    ageRail.addEventListener('keydown', function (e) {
      let month = Number(ageRail.getAttribute('aria-valuenow'));
      if (e.key === 'Home') month = 0;
      else if (e.key === 'End') month = currentMonth;
      else if (['ArrowDown','ArrowRight'].includes(e.key)) {
        const next = anchors.find(function (a) { return a.month > month; });
        month = next ? next.month : currentMonth;
      }
      else if (['ArrowUp','ArrowLeft'].includes(e.key)) {
        const previous = anchors.slice().reverse().find(function (a) { return a.month < month; });
        month = previous ? previous.month : 0;
      }
      else return;
      e.preventDefault(); seek(Math.max(0, Math.min(currentMonth, month)));
    });
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function parseISO(value) {
    const parts = String(value).split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function formatDate(value) {
    const d = parseISO(value);
    return String(d.getDate()).padStart(2, "0") + "/" +
      String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
  }

  function getMonthIndex(birthISO, dateValue) {
    const birth = parseISO(birthISO);
    const d = dateValue instanceof Date ? dateValue : parseISO(dateValue);
    let months = (d.getFullYear() - birth.getFullYear()) * 12 + d.getMonth() - birth.getMonth();
    if (d.getDate() < birth.getDate()) months -= 1;
    return months;
  }

  function formatAge(monthValue) {
    const total = Math.max(0, Math.floor(monthValue));
    if (total < 12) return total + " tháng";
    const years = Math.floor(total / 12);
    const months = total % 12;
    return years + " tuổi" + (months ? " " + months + " tháng" : "");
  }

  function monthLabel(month) {
    return String(month).padStart(2, "0") + "m";
  }

  function healthByMonth(month) {
    return data.health.find(function (item) { return item.month === month; }) || null;
  }

  function spacingForMonth(month) {
    if (month < 12) return 90;
    if (month < 36) return 66;
    return 48;
  }

  function spacerHeight(fromMonth, toMonth) {
    if (toMonth <= fromMonth) return 26;
    let total = 0;
    for (let month = fromMonth; month < toMonth; month++) total += spacingForMonth(month);
    return Math.min(total, 720);
  }

  function sceneMinHeight(scene) {
    if (scene.type === "chapter") return 620;
    const map = { 1: 220, 2: 270, 3: 340, 4: 430, 5: 540 };
    return map[scene.importance] || 320;
  }

  function renderHealthCard(record) {
    if (!record) return "";
    return '<p class="gallery-date-range">Ngày đo: ' + escapeHtml(record.date.split("-").reverse().join("/")) + '</p><div class="health-card" aria-label="Số đo sức khỏe">' +
      '<div class="health-stat"><strong>' + escapeHtml(record.heightCm) + ' cm</strong><span>Chiều cao</span></div>' +
      '<div class="health-stat"><strong>' + escapeHtml(record.weightKg) + ' kg</strong><span>Cân nặng</span></div>' +
      '<div class="health-stat"><strong>' + escapeHtml(record.bmi) + '</strong><span>BMI</span></div>' +
      '</div>';
  }

  function renderHealthSequence(months) {
    const rows = (months || []).map(healthByMonth).filter(Boolean);
    if (!rows.length) return "";
    return '<div class="health-sequence">' + rows.map(function (record) {
      return '<div class="health-row">' +
        '<strong>' + monthLabel(record.month) + '<br><small>' + escapeHtml(record.date.split("-").reverse().join("/")) + '</small></strong>' +
        '<span>' + escapeHtml(record.heightCm) + ' cm</span>' +
        '<span>' + escapeHtml(record.weightKg) + ' kg</span>' +
        '</div>';
    }).join("") + '</div>';
  }

  function renderMediaItem(media) {
    const roleClass = media.role === "hero" ? " media-slot--hero" : "";
    if (!media.src) {
      return '<div class="media-slot' + roleClass + '" data-media-id="' + escapeHtml(media.id) + '">' +
        '<div class="media-slot__placeholder">' +
          '<span class="media-slot__icon">' + (media.prefer === "video" ? "▶" : "▧") + '</span>' +
          '<div class="media-slot__label">' + escapeHtml(media.label || "Media") + '</div>' +
          '<div class="media-slot__expected">Chờ map: ' + escapeHtml((media.expected || []).join(" · ")) + '</div>' +
        '</div>' +
      '</div>';
    }

    const isVideo = media.type === "video" || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(media.src);
    if (isVideo) {
      return '<button type="button" class="media-slot media-slot--loaded' + roleClass + '" data-open-media data-src="' + escapeHtml(media.src) + '" data-type="video" data-poster="' + escapeHtml(media.poster || "") + '" aria-label="Mở video ' + escapeHtml(media.label || "") + '">' +
        '<video src="' + escapeHtml(media.src) + '"' + (media.poster ? ' poster="' + escapeHtml(media.poster) + '"' : "") + ' muted playsinline preload="metadata"></video>' +
      '</button>';
    }

    return '<button type="button" class="media-slot media-slot--loaded' + roleClass + '" data-open-media data-src="' + escapeHtml(media.src) + '" data-type="image" aria-label="Mở ảnh ' + escapeHtml(media.label || "") + '">' +
      '<img src="' + escapeHtml(media.src) + '" alt="' + escapeHtml(media.label || sceneTitleFallback(media)) + '" loading="lazy" decoding="async">' +
    '</button>';
  }

  function sceneTitleFallback(media) {
    return media && media.id ? media.id : "Baby media";
  }

  function renderMedia(scene) {
    const media = scene.media || [];
    if (!media.length) return "";
    return '<div class="media-grid" data-count="' + Math.min(media.length, 4) + '">' + media.slice(0, 4).map(renderMediaItem).join("") + '</div>';
  }

  function renderScene(scene) {
    const section = document.createElement("section");
    const sceneClass = "scene scene--" + escapeHtml(scene.layout || scene.type || "standard");
    section.className = sceneClass;
    section.dataset.sceneId = scene.id;
    section.dataset.month = String(scene.month);
    section.dataset.align = scene.align || "center";
    section.dataset.monthLabel = monthLabel(scene.month);
    section.style.setProperty("--scene-min", sceneMinHeight(scene) + "px");

    let content = '<div class="scene__card">';
    if (scene.eyebrow) content += '<div class="scene__eyebrow">' + escapeHtml(scene.eyebrow) + '</div>';
    content += '<h2 class="scene__title">' + escapeHtml(scene.title || "") + '</h2>';
    if (scene.subtitle) content += '<p class="scene__subtitle">' + escapeHtml(scene.subtitle) + '</p>';
    if (scene.description) content += '<p class="scene__description">' + escapeHtml(scene.description) + '</p>';
    if (scene.bullets && scene.bullets.length) {
      content += '<ul class="scene__bullets">' + scene.bullets.map(function (item) {
        return '<li>' + escapeHtml(item) + '</li>';
      }).join("") + '</ul>';
    }
    if (scene.healthMonth != null) content += renderHealthCard(healthByMonth(scene.healthMonth));
    if (scene.healthMonths) content += renderHealthSequence(scene.healthMonths);
    if (scene.mediaContext) content += '<p class="gallery-date-range">' + escapeHtml(scene.mediaContext) + '</p>';
    content += renderMedia(scene);
    content += '</div>';
    section.innerHTML = content;
    return section;
  }

  function buildJourney() {
    const scenes = data.scenes.slice().sort(function (a, b) {
      if (a.month !== b.month) return a.month - b.month;
      return (a.order || 0) - (b.order || 0);
    });

    let previousMonth = 0;
    scenes.forEach(function (scene, index) {
      if (index > 0) {
        const spacer = document.createElement("div");
        spacer.className = "month-spacer";
        spacer.style.setProperty("--spacer", spacerHeight(previousMonth, scene.month) + "px");
        stream.appendChild(spacer);
      }
      stream.appendChild(renderScene(scene));
      previousMonth = scene.month;
    });
  }

  function buildAnchors() {
    anchors = Array.prototype.slice.call(document.querySelectorAll(".scene[data-month]")).map(function (el) {
      return { month: Number(el.dataset.month), top: el.getBoundingClientRect().top + window.scrollY + el.offsetHeight * 0.35 };
    });
    anchors.push({ month: currentMonth, top: journeyNow.getBoundingClientRect().top + window.scrollY + journeyNow.offsetHeight * 0.25 });
    anchors.sort(function (a, b) { return a.top - b.top; });
  }

  function scheduleAnchorRefresh() {
    cancelAnimationFrame(anchorRefreshFrame);
    anchorRefreshFrame = requestAnimationFrame(function () {
      buildAnchors();
      updateScrollState();
    });
  }

  function monthAtScroll() {
    if (!anchors.length) return 0;
    const point = window.scrollY + window.innerHeight * 0.46;
    if (point <= anchors[0].top) return anchors[0].month;
    if (point >= anchors[anchors.length - 1].top) return anchors[anchors.length - 1].month;

    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];
      if (point >= a.top && point <= b.top) {
        const range = Math.max(1, b.top - a.top);
        const t = (point - a.top) / range;
        return a.month + (b.month - a.month) * t;
      }
    }
    return 0;
  }

  function stageForMonth(month) {
    return data.backgrounds.find(function (stage) {
      return month >= stage.fromMonth && month < stage.toMonth;
    }) || data.backgrounds[data.backgrounds.length - 1];
  }

  function applyStage(stage) {
    if (!stage || activeStageId === stage.id) return;
    activeStageId = stage.id;
    const incoming = activeBg === "a" ? bgB : bgA;
    const outgoing = activeBg === "a" ? bgA : bgB;
    incoming.style.background = stage.asset ? 'url("' + stage.asset + '") center / cover no-repeat' : stage.gradient;
    incoming.style.opacity = "1";
    outgoing.style.opacity = "0";
    activeBg = activeBg === "a" ? "b" : "a";
  }

  function updateScrollState() {
    const month = Math.min(currentMonth, Math.max(0, monthAtScroll()));
    const progress = currentMonth > 0 ? Math.min(100, (month / currentMonth) * 100) : 0;
    const label = formatAge(month);
    ageRail.style.setProperty("--progress", progress + "%");
    ageRailLabel.textContent = label;
    ageRail.setAttribute('aria-valuenow', String(Math.round(month)));
    ageRail.setAttribute('aria-valuetext', label);
    let active = contentsEntries[0];
    contentsEntries.forEach(function (entry) { if (entry.el.getBoundingClientRect().top <= innerHeight * .46) active = entry; });
    if (active && activeContents !== active.button) {
      if (activeContents) activeContents.removeAttribute('aria-current');
      activeContents = active.button;
      activeContents.setAttribute('aria-current', 'location');
    }
    mobileAge.textContent = label;
    applyStage(stageForMonth(month));
  }

  function setParentContentModal(open) {
    try {
      if (!window.parent || window.parent === window) return;
      const parentStage = window.parent.document.getElementById("discoveryStage");
      if (parentStage) parentStage.classList.toggle("has-content-modal", !!open);
    } catch (err) {
      // Standalone/cross-origin fallback: Baby vẫn hoạt động bình thường.
    }
  }

  function syncParentModalState() {
    setParentContentModal(!viewer.hidden);
  }

  function openMedia(button) {
    const src = button.dataset.src;
    const type = button.dataset.type;
    const poster = button.dataset.poster || "";
    if (!src) return;
    viewerContent.innerHTML = type === "video"
      ? '<video src="' + escapeHtml(src) + '"' + (poster ? ' poster="' + escapeHtml(poster) + '"' : "") + ' controls autoplay playsinline></video>'
      : '<img src="' + escapeHtml(src) + '" alt="">';
    viewer.hidden = false;
    document.body.style.overflow = "hidden";
    syncParentModalState();
  }

  function closeMedia() {
    viewer.hidden = true;
    viewerContent.innerHTML = "";
    document.body.style.overflow = "";
    syncParentModalState();
  }

  document.addEventListener("click", function (event) {
    const mediaButton = event.target.closest("[data-open-media]");
    if (mediaButton) openMedia(mediaButton);
    if (event.target.closest("[data-close-viewer]")) closeMedia();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !viewer.hidden) closeMedia();
  });

  buildJourney();
  buildContents();
  bgA.style.background = data.backgrounds[0].gradient;
  activeStageId = data.backgrounds[0].id;

  requestAnimationFrame(function () {
    buildAnchors();
    updateScrollState();
  });

  if (typeof ResizeObserver === "function") {
    const layoutObserver = new ResizeObserver(function () {
      scheduleAnchorRefresh();
    });
    layoutObserver.observe(stream);
    layoutObserver.observe(journeyNow);
  } else {
    document.querySelectorAll(".media-grid img, .media-grid video").forEach(function (mediaEl) {
      mediaEl.addEventListener("load", scheduleAnchorRefresh, { once: true });
      mediaEl.addEventListener("loadedmetadata", scheduleAnchorRefresh, { once: true });
    });
  }

  if (typeof MutationObserver === "function") {
    const viewerObserver = new MutationObserver(syncParentModalState);
    viewerObserver.observe(viewer, { attributes: true, attributeFilter: ["hidden"] });
  }
  syncParentModalState();

  let ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateScrollState();
      ticking = false;
    });
  }, { passive: true });

  let resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      buildAnchors();
      updateScrollState();
    }, 120);
  });
})();
