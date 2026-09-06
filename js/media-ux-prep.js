(function () {
  "use strict";

  const data = window.BABY_DISCOVERY_DATA;
  if (!data || !Array.isArray(data.scenes)) return;

  function isVideo(media) {
    return media && (media.type === "video" || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(media.src || ""));
  }

  let deferredPreviewVideos = 0;

  data.scenes.forEach(function (scene) {
    if (!Array.isArray(scene.media)) return;

    scene.media = scene.media.map(function (media) {
      if (!isVideo(media) || !media.src) return media;

      deferredPreviewVideos += 1;
      return Object.assign({}, media, {
        deferredSrc: media.src,
        src: "",
        b3DeferredVideo: true,
        prefer: "video",
        expected: []
      });
    });
  });

  data.mediaUx = Object.assign({}, data.mediaUx, {
    version: "b3-v1",
    previewVideoPolicy: "no-video-src-before-click",
    deferredPreviewVideos: deferredPreviewVideos
  });
})();
