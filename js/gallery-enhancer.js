(function () {
  "use strict";

  const data = window.BABY_DISCOVERY_DATA;
  const viewer = document.getElementById("mediaViewer");
  const viewerContent = document.getElementById("mediaViewerContent");
  if (!data || !viewer || !viewerContent) return;

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function isVideo(media) {
    return media && (media.type === "video" || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(media.src || media.deferredSrc || ""));
  }

  function countMedia(media) {
    let images = 0;
    let videos = 0;
    (media || []).forEach(function (item) {
      if (isVideo(item)) videos += 1;
      else images += 1;
    });
    return { image: images, video: videos };
  }

  function countLabel(media) {
    const counts = countMedia(media);
    const parts = [];
    if (counts.image) parts.push(counts.image + " ảnh");
    if (counts.video) parts.push(counts.video + " video");
    return parts.join(" · ") || "0 media";
  }

  function attachButtons() {
    data.scenes.forEach(function (scene) {
      const section = document.querySelector('[data-scene-id="' + scene.id + '"]');
      if (!section) return;
      const card = section.querySelector(".scene__card");
      if (!card) return;

      if ((scene.dateRange || scene.ageAtEvent) && !card.querySelector(".gallery-date-range")) {
        const range = document.createElement("div");
        range.className = "gallery-date-range";
        const parts = [];
        if (scene.dateRange) parts.push(scene.dateRange);
        if (scene.ageAtEvent) parts.push(scene.ageAtEvent);
        range.textContent = parts.join(" · ");
        card.appendChild(range);
      }

      const album = scene.galleryTarget ? data.scenes.find(s => s.id === scene.galleryTarget) : scene;
      if (!album || !album.galleryMedia || (!scene.galleryTarget && album.galleryMedia.length <= (scene.media || []).length) || card.querySelector("[data-open-gallery]")) return;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-open-button";
      button.dataset.openGallery = album.id;
      button.innerHTML = '<span>▦</span><strong>' + escapeHtml(album.galleryLabel || ("Xem " + countLabel(album.galleryMedia))) + '</strong>';
      card.appendChild(button);
    });
  }

  function renderVideoVisual(media) {
    if (media.poster) {
      return '<img class="gallery-thumb__poster" data-lazy-src="' + escapeHtml(media.poster) + '" alt="" decoding="async">' +
        '<i class="gallery-thumb__play" aria-hidden="true">▶</i>';
    }

    return '<span class="gallery-thumb__video-shell" aria-hidden="true">' +
      '<i>▶</i><strong>VIDEO</strong><small>Đang tạo ảnh xem trước</small>' +
    '</span>';
  }

  function renderThumb(media, sceneId, dayDate, index) {
    const video = isVideo(media);
    const type = video ? "video" : "image";
    const src = media.src || media.deferredSrc || "";
    const common = ' data-open-media data-gallery-media data-gallery-scene="' + escapeHtml(sceneId) + '"' +
      ' data-gallery-day="' + escapeHtml(dayDate || "") + '" data-gallery-index="' + String(index) + '"' +
      ' data-media-kind="' + type + '" data-src="' + escapeHtml(src) + '" data-type="' + type + '"' +
      (media.poster ? ' data-poster="' + escapeHtml(media.poster) + '"' : "") +
      (video && !media.poster ? ' data-video-thumb-src="' + escapeHtml(src) + '"' : "") +
      ' title="' + escapeHtml(media.label || "") + '"';

    const visual = video
      ? renderVideoVisual(media)
      : '<img data-lazy-src="' + escapeHtml(src) + '" alt="' + escapeHtml(media.label || "Ảnh của Yên & Cá") + '" decoding="async">';

    return '<button type="button" class="gallery-thumb gallery-thumb--' + type + '"' + common + '>' +
      visual +
      '<span class="gallery-thumb__type">' + (video ? "VIDEO" : "ẢNH") + '</span>' +
    '</button>';
  }

  function fallbackTimelineDays(scene) {
    const grouped = {};
    (scene.galleryMedia || []).forEach(function (media) {
      const date = media.sourceDate || "unknown";
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(media);
    });

    return Object.keys(grouped).sort().map(function (date) {
      return {
        date: date,
        dateLabel: date === "unknown" ? "Chưa rõ ngày" : date,
        ageText: grouped[date][0] && grouped[date][0].ageText || "",
        media: grouped[date],
        mediaLabel: countLabel(grouped[date]),
        story: ""
      };
    });
  }

  function renderDay(day, sceneId) {
    const media = day.media || [];
    return '<section class="gallery-day">' +
      '<div class="gallery-day__head">' +
        '<div class="gallery-day__when">' +
          '<strong>' + escapeHtml(day.dateLabel || day.date || "") + '</strong>' +
          (day.ageText ? '<span>' + escapeHtml(day.ageText) + '</span>' : "") +
        '</div>' +
        '<span class="gallery-day__count">' + escapeHtml(day.mediaLabel || countLabel(media)) + '</span>' +
      '</div>' +
      (day.story ? '<p class="gallery-day__story">' + escapeHtml(day.story) + '</p>' : "") +
      '<div class="gallery-view__grid">' + media.map(function (item, index) {
        return renderThumb(item, sceneId, day.date || "", index);
      }).join("") + '</div>' +
    '</section>';
  }

  function renderFilters(scene) {
    const counts = countMedia(scene.galleryMedia || []);
    if (!counts.image || !counts.video) return "";

    return '<div class="gallery-filter" role="group" aria-label="Lọc media">' +
      '<button type="button" class="gallery-filter__button is-active" data-gallery-filter="all" aria-pressed="true">Tất cả</button>' +
      '<button type="button" class="gallery-filter__button" data-gallery-filter="image" aria-pressed="false">Ảnh <span>' + counts.image + '</span></button>' +
      '<button type="button" class="gallery-filter__button" data-gallery-filter="video" aria-pressed="false">Video <span>' + counts.video + '</span></button>' +
    '</div>';
  }

  function openGallery(scene) {
    if (!scene || !scene.galleryMedia) return;
    const days = scene.timelineDays && scene.timelineDays.length ? scene.timelineDays : fallbackTimelineDays(scene);

    viewerContent.innerHTML =
      '<div class="gallery-view" data-gallery-scene-id="' + escapeHtml(scene.id) + '">' +
        '<div class="gallery-view__head">' +
          '<div><span class="gallery-view__eyebrow">NHẬT KÝ THEO NGÀY</span><h3>' + escapeHtml(scene.title || "Album") + '</h3></div>' +
          '<strong>' + escapeHtml(days.length + " ngày · " + countLabel(scene.galleryMedia)) + '</strong>' +
        '</div>' +
        renderFilters(scene) +
        '<div class="gallery-view__days">' + days.map(function (day) { return renderDay(day, scene.id); }).join("") + '</div>' +
      '</div>';

    viewer.hidden = false;
    document.body.style.overflow = "hidden";
  }

  document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-open-gallery]");
    if (!button) return;
    const scene = data.scenes.find(function (item) { return item.id === button.dataset.openGallery; });
    openGallery(scene);
  });

  attachButtons();
})();
