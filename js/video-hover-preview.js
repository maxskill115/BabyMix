/* Video hover/touch-hold preview — kiểu YouTube.
   Desktop: rê chuột vào thumbnail video ~0.4s → phát preview tắt tiếng, rời chuột → dừng.
   Mobile: chạm giữ ~0.4s → preview; thả tay → dừng. Gõ nhanh (<0.4s) → click mở viewer như bình thường.
   Video gắn preload="metadata", tắt tiếng, phát từ đầu, tối đa 6 giây rồi tự loop. */
(function () {
  "use strict";

  var HOLD_MS = 400;
  var MAX_PREVIEW_S = 6;
  var holdTimer = null;
  var activeThumb = null;
  var activeVideo = null;
  var suppressedClick = false;
  var startedAt = 0;

  var STYLE = document.createElement("style");
  STYLE.textContent = [
    ".gallery-thumb{position:relative;overflow:hidden}",
    ".gallery-thumb__preview{position:absolute;inset:0;z-index:4;width:100%;height:100%;",
    "object-fit:cover;background:#000;display:none}",
    ".gallery-thumb.is-previewing .gallery-thumb__preview{display:block}",
    ".gallery-thumb.is-previewing .gallery-thumb__poster,",
    ".gallery-thumb.is-previewing img{opacity:0}",
    ".gallery-thumb.is-previewing .gallery-thumb__play{opacity:.9}",
    ".gallery-thumb.is-previewing{cursor:pointer}"
  ].join("");
  document.head.appendChild(STYLE);

  function thumbOfMedia(media) {
    return media.closest ? media.closest(".gallery-thumb") : null;
  }

  function findVideoThumb(target) {
    var thumb = target && (target.closest ? target.closest(".gallery-thumb") : null);
    if (!thumb) return null;
    if (thumb.getAttribute("data-media-kind") !== "video") return null;
    if (thumb.getAttribute("data-video-thumb-src") || thumb.getAttribute("data-src")) return thumb;
    return null;
  }

  function stopPreview() {
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    if (activeVideo) {
      try { activeVideo.pause(); activeVideo.removeAttribute("src"); activeVideo.load(); } catch (error) {}
      if (activeVideo.parentNode) activeVideo.parentNode.removeChild(activeVideo);
      activeVideo = null;
    }
    if (activeThumb) {
      activeThumb.classList.remove("is-previewing");
      activeThumb = null;
    }
  }

  function startPreview(thumb) {
    if (thumb === activeThumb) return;
    stopPreview();
    var src = thumb.getAttribute("data-video-thumb-src") || thumb.getAttribute("data-src");
    if (!src) return;
    var video = document.createElement("video");
    video.className = "gallery-thumb__preview";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = src;
    thumb.appendChild(video);
    activeThumb = thumb;
    activeVideo = video;
    startedAt = performance.now();
    video.play().catch(function () { stopPreview(); });
    video.addEventListener("timeupdate", function () {
      if (video.currentTime >= MAX_PREVIEW_S) video.currentTime = 0;
    });
    thumb.classList.add("is-previewing");
  }

  function isTouchLike(event) {
    return event.pointerType === "touch" || (event.touches && event.touches.length > 0);
  }

  var hoverThumb = null;

  document.addEventListener("pointerover", function (event) {
    if (isTouchLike(event)) return;
    var thumb = findVideoThumb(event.target);
    if (!thumb) { return; }
    if (hoverThumb === thumb) return;
    hoverThumb = thumb;
    if (holdTimer) clearTimeout(holdTimer);
    holdTimer = setTimeout(function () { startPreview(thumb); }, HOLD_MS);
  }, true);

  document.addEventListener("pointerout", function (event) {
    if (isTouchLike(event)) return;
    var thumb = findVideoThumb(event.target);
    if (!thumb) return;
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    if (thumb === activeThumb || thumb === hoverThumb) {
      hoverThumb = null;
      stopPreview();
    }
  }, true);

  // Mobile: chạm giữ
  document.addEventListener("touchstart", function (event) {
    var thumb = findVideoThumb(event.target);
    if (!thumb) return;
    if (holdTimer) clearTimeout(holdTimer);
    holdTimer = setTimeout(function () { startPreview(thumb); }, HOLD_MS);
  }, { passive: true });

  document.addEventListener("touchend", function (event) {
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    var wasPreviewing = !!activeVideo;
    stopPreview();
    if (wasPreviewing) {
      // đã preview bằng chạm giữ → chặn click mở viewer theo sau
      suppressedClick = true;
      setTimeout(function () { suppressedClick = false; }, 500);
      if (event.cancelable) event.preventDefault();
    }
  }, { passive: false });

  // desktop click khi đang preview: coi như đã xem, không mở viewer
  document.addEventListener("click", function (event) {
    if (suppressedClick) {
      event.stopPropagation();
      event.preventDefault();
    }
  }, true);
})();
