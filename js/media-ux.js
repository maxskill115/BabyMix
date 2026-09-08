(function () {
  "use strict";

  const data = window.BABY_DISCOVERY_DATA;
  const viewer = document.getElementById("mediaViewer");
  const viewerContent = document.getElementById("mediaViewerContent");
  if (!data || !viewer || !viewerContent) return;

  let galleryContext = null;
  let lazyObserver = null;


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

  function videoPosterMarkup(media, compact) {
    if (media.poster) {
      return '<img class="b3-video-poster__image" src="' + escapeHtml(media.poster) + '" alt="" loading="lazy" decoding="async">' +
        '<span class="b3-video-poster__play" aria-hidden="true">▶</span>';
    }

    return '<span class="b3-video-poster' + (compact ? " b3-video-poster--compact" : "") + '" aria-hidden="true">' +
      '<i>▶</i><strong>VIDEO</strong><small>Đang tạo ảnh xem trước</small>' +
    '</span>';
  }

  function findMediaSlotById(id) {
    const slots = document.querySelectorAll(".media-slot[data-media-id]");
    for (let i = 0; i < slots.length; i += 1) {
      if (slots[i].dataset.mediaId === id) return slots[i];
    }
    return null;
  }

  function decorateDeferredPreviews() {
    const deferred = {};

    data.scenes.forEach(function (scene) {
      (scene.media || []).forEach(function (media) {
        if (media && media.b3DeferredVideo && media.deferredSrc && media.id) deferred[media.id] = media;
      });
    });

    Object.keys(deferred).forEach(function (id) {
      const old = findMediaSlotById(id);
      if (!old || old.dataset.b3Ready === "1") return;

      const media = deferred[id];
      const button = document.createElement("button");
      button.type = "button";
      button.className = old.className + " media-slot--loaded media-slot--video-shell";
      button.dataset.b3Ready = "1";
      button.dataset.openMedia = "";
      button.dataset.src = media.deferredSrc;
      button.dataset.type = "video";
      if (media.poster) button.dataset.poster = media.poster;
      else button.dataset.videoThumbSrc = media.deferredSrc;
      button.setAttribute("aria-label", "Mở video " + (media.label || ""));
      button.innerHTML = videoPosterMarkup(media, false);
      old.replaceWith(button);
    });
  }

  function findScene(sceneId) {
    return data.scenes.find(function (scene) { return scene.id === sceneId; }) || null;
  }

  function findDay(scene, date) {
    const days = scene && Array.isArray(scene.timelineDays) ? scene.timelineDays : [];
    return days.find(function (day) { return day.date === date; }) || null;
  }

  function renderViewerMedia(media) {
    const src = media.src || media.deferredSrc || "";
    if (isVideo(media)) {
      return '<video src="' + escapeHtml(src) + '"' +
        (media.poster ? ' poster="' + escapeHtml(media.poster) + '"' : "") +
        ' controls autoplay playsinline preload="metadata"></video>';
    }
    return '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(media.label || "Ảnh của Yên & Cá") + '">';
  }

  function openGalleryMedia(scene, day, index) {
    if (!scene || !day || !Array.isArray(day.media) || !day.media.length) return;

    const safeIndex = Math.max(0, Math.min(day.media.length - 1, Number(index) || 0));
    const media = day.media[safeIndex];
    galleryContext = {
      sceneId: scene.id,
      dayDate: day.date,
      index: safeIndex
    };

    viewerContent.innerHTML =
      '<div class="b3-viewer" data-gallery-scene="' + escapeHtml(scene.id) + '">' +
        '<div class="b3-viewer__stage">' + renderViewerMedia(media) + '</div>' +
        '<div class="b3-viewer__meta">' +
          '<div><strong>' + escapeHtml(day.dateLabel || day.date || "") + '</strong>' +
            (day.ageText ? '<span>' + escapeHtml(day.ageText) + '</span>' : "") + '</div>' +
          '<small>' + escapeHtml((safeIndex + 1) + " / " + day.media.length) + '</small>' +
        '</div>' +
        '<button type="button" class="b3-viewer__nav b3-viewer__nav--prev" data-b3-nav="prev"' + (safeIndex <= 0 ? " disabled" : "") + ' aria-label="Media trước">‹</button>' +
        '<button type="button" class="b3-viewer__nav b3-viewer__nav--next" data-b3-nav="next"' + (safeIndex >= day.media.length - 1 ? " disabled" : "") + ' aria-label="Media tiếp theo">›</button>' +
      '</div>';

    viewer.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function stepGalleryMedia(direction) {
    if (!galleryContext) return;
    const scene = findScene(galleryContext.sceneId);
    const day = findDay(scene, galleryContext.dayDate);
    if (!day) return;
    const delta = direction === "prev" ? -1 : 1;
    openGalleryMedia(scene, day, galleryContext.index + delta);
  }

  function installLazyImages(root) {
    if (lazyObserver) {
      lazyObserver.disconnect();
      lazyObserver = null;
    }

    const images = Array.prototype.slice.call(root.querySelectorAll("img[data-lazy-src]"));
    if (!images.length) return;

    function hydrate(img) {
      if (!img || !img.dataset.lazySrc || img.hasAttribute("src")) return;
      img.setAttribute("src", img.dataset.lazySrc);
      img.removeAttribute("data-lazy-src");
    }

    if (typeof IntersectionObserver !== "function") {
      images.forEach(hydrate);
      return;
    }

    lazyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        hydrate(entry.target);
        lazyObserver.unobserve(entry.target);
      });
    }, {
      root: root,
      rootMargin: "420px 0px",
      threshold: 0.01
    });

    images.forEach(function (img) { lazyObserver.observe(img); });
  }

  function applyFilter(view, filter) {
    const thumbs = Array.prototype.slice.call(view.querySelectorAll(".gallery-thumb[data-media-kind]"));
    thumbs.forEach(function (thumb) {
      thumb.hidden = filter !== "all" && thumb.dataset.mediaKind !== filter;
    });

    Array.prototype.slice.call(view.querySelectorAll(".gallery-day")).forEach(function (day) {
      const visible = Array.prototype.slice.call(day.querySelectorAll(".gallery-thumb[data-media-kind]")).some(function (thumb) {
        return !thumb.hidden;
      });
      day.hidden = !visible;
    });

    Array.prototype.slice.call(view.querySelectorAll("[data-gallery-filter]")).forEach(function (button) {
      const active = button.dataset.galleryFilter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  let currentGalleryFilter = "all";

  function onViewerContentChanged() {
    const galleryView = viewerContent.querySelector(".gallery-view");
    if (galleryView) {
      installLazyImages(galleryView);
      applyFilter(galleryView, currentGalleryFilter);
    }
  }

  document.addEventListener("click", function (event) {
    const thumb = event.target.closest("[data-gallery-media]");
    if (thumb) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const scene = findScene(thumb.dataset.galleryScene);
      const day = findDay(scene, thumb.dataset.galleryDay);
      openGalleryMedia(scene, day, Number(thumb.dataset.galleryIndex || 0));
      return;
    }

    const nav = event.target.closest("[data-b3-nav]");
    if (nav) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!nav.disabled) stepGalleryMedia(nav.dataset.b3Nav);
      return;
    }

    const filter = event.target.closest("[data-gallery-filter]");
    if (filter) {
      event.preventDefault();
      const view = filter.closest(".gallery-view");
      currentGalleryFilter = filter.dataset.galleryFilter || "all";
      if (view) applyFilter(view, currentGalleryFilter);
      return;
    }

    if (event.target.closest("[data-close-viewer]")) {
      if (galleryContext && viewerContent.querySelector(".b3-viewer")) {
        // đang xem 1 ảnh/video trong album → quay về sảnh album, không thoát hẳn
        const scene = findScene(galleryContext.sceneId);
        const back = scene && scene.galleryMedia ? scene : null;
        galleryContext = null;
        if (back && typeof window.__reopenGallery === "function") {
          event.preventDefault();
          event.stopImmediatePropagation();
          window.__reopenGallery(back.id);
          return;
        }
      }
      galleryContext = null;
      if (lazyObserver) {
        lazyObserver.disconnect();
        lazyObserver = null;
      }
    }
  }, true);

  document.addEventListener("keydown", function (event) {
    if (viewer.hidden || !galleryContext) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepGalleryMedia("prev");
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      stepGalleryMedia("next");
    }
  });

  if (typeof MutationObserver === "function") {
    const observer = new MutationObserver(onViewerContentChanged);
    observer.observe(viewerContent, { childList: true, subtree: true });
  }

  decorateDeferredPreviews();

  data.mediaUx = Object.assign({}, data.mediaUx, {
    galleryVideoPolicy: "static-poster-until-click",
    galleryImagePolicy: "intersection-lazy-src",
    viewerNavigation: "same-day-prev-next",
    galleryFilters: ["all", "image", "video"],
    mobileCompatibility: "no-css-escape + attribute-src-check",
    videoThumbnailPolicy: "static-ffmpeg-webp",
  });
})();