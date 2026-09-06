(function () {
  "use strict";
  const data = window.BABY_DISCOVERY_DATA;
  if (!data) return;
  data.scenes.forEach(scene => { scene.media = []; delete scene.galleryMedia; delete scene.timelineDays; });
})();
