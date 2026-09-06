(function () {
  "use strict";

  const data = window.BABY_DISCOVERY_DATA;
  if (!data || typeof document === "undefined") return;

  const MAX_WORKERS = 2;
  const queue = [];
  let workers = 0;
  let observer = null;

  function nearViewport(target, margin) {
    if (!target || typeof target.getBoundingClientRect !== "function") return false;
    const rect = target.getBoundingClientRect();
    const height = window.innerHeight || document.documentElement.clientHeight || 0;
    const extra = Number(margin) || 520;
    return rect.bottom >= -extra && rect.top <= height + extra;
  }

  function releaseWorker() {
    workers = Math.max(0, workers - 1);
    pump();
  }

  function markFailed(target, video) {
    if (video && video.parentNode) video.parentNode.removeChild(video);
    target.dataset.videoThumbState = "failed";
    target.dataset.fastThumbState = "failed";
    releaseWorker();
  }

  function startTarget(target) {
    if (!target || target.dataset.liveThumbStarted === "1") {
      releaseWorker();
      return;
    }

    const src = target.dataset.videoThumbSrc || "";
    if (!src) {
      releaseWorker();
      return;
    }

    target.dataset.liveThumbStarted = "1";
    target.dataset.videoThumbState = "loading";
    target.dataset.fastThumbState = "loading";

    const video = document.createElement("video");
    let settled = false;
    let timeoutId = 0;

    function ready() {
      if (settled) return;
      if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;

      settled = true;
      clearTimeout(timeoutId);
      video.onloadeddata = null;
      video.oncanplay = null;
      video.onerror = null;
      video.onstalled = null;

      try { video.pause(); } catch (err) {}
      target.classList.add("has-video-thumbnail", "has-live-video-thumbnail");
      target.dataset.videoThumbState = "ready";
      target.dataset.fastThumbState = "ready";
      releaseWorker();
    }

    function fail() {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      video.onloadeddata = null;
      video.oncanplay = null;
      video.onerror = null;
      video.onstalled = null;
      markFailed(target, video);
    }

    video.className = "b3-live-video-thumb";
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.autoplay = false;
    video.controls = false;
    video.loop = false;
    video.tabIndex = -1;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("aria-hidden", "true");
    video.setAttribute("disablepictureinpicture", "");

    video.onloadeddata = ready;
    video.oncanplay = ready;
    video.onerror = fail;
    video.onstalled = function () {
      if (video.readyState >= 2) ready();
    };

    target.insertBefore(video, target.firstChild);

    timeoutId = window.setTimeout(function () {
      if (video.readyState >= 2 && video.videoWidth && video.videoHeight) ready();
      else fail();
    }, 8000);

    video.src = src;
    try { video.load(); } catch (err) { fail(); }
  }

  function pump() {
    while (workers < MAX_WORKERS && queue.length) {
      const target = queue.shift();
      if (!target || target.dataset.liveThumbQueued !== "1") continue;
      target.dataset.liveThumbQueued = "0";
      workers += 1;
      startTarget(target);
    }
  }

  function enqueue(target) {
    if (!target || target.dataset.liveThumbQueued === "1" || target.dataset.liveThumbStarted === "1") return;
    if (!target.dataset.videoThumbSrc) return;

    target.dataset.liveThumbQueued = "1";
    target.dataset.videoThumbState = "loading";
    queue.push(target);
    pump();
  }

  function observeTarget(target) {
    if (!target || target.dataset.liveThumbObserved === "1") return;
    if (!target.dataset.videoThumbSrc) return;

    target.dataset.liveThumbObserved = "1";

    if (nearViewport(target, 520)) {
      enqueue(target);
      return;
    }

    if (observer) {
      observer.observe(target);
      return;
    }

    target.addEventListener("mouseenter", function () { enqueue(target); }, { once: true });
    target.addEventListener("focus", function () { enqueue(target); }, { once: true });
    target.addEventListener("touchstart", function () { enqueue(target); }, { once: true, passive: true });
  }

  function scan(root) {
    const scope = root && root.querySelectorAll ? root : document;
    if (scope.matches && scope.matches("[data-video-thumb-src]")) observeTarget(scope);
    Array.prototype.slice.call(scope.querySelectorAll("[data-video-thumb-src]")).forEach(observeTarget);
  }

  if (typeof IntersectionObserver === "function") {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        enqueue(entry.target);
      });
    }, {
      root: null,
      rootMargin: "520px 0px",
      threshold: 0.001
    });
  }

  scan(document);

  if (typeof MutationObserver === "function") {
    const mutationObserver = new MutationObserver(function (records) {
      records.forEach(function (record) {
        Array.prototype.slice.call(record.addedNodes || []).forEach(function (node) {
          if (node && node.nodeType === 1) scan(node);
        });
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  }

  data.mediaUx = Object.assign({}, data.mediaUx, {
    videoThumbnailFastPolicy: "lazy-live-video-element",
    videoThumbnailFastConcurrency: MAX_WORKERS,
    videoThumbnailFastPreload: "auto-only-near-viewport",
    videoThumbnailFastTimeoutMs: 8000,
    videoThumbnailNoCanvas: true,
    videoThumbnailNoSeek: true
  });
})();
