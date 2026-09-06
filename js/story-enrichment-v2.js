(function () {
  "use strict";
  const data = window.BABY_DISCOVERY_DATA, manifest = window.BABY_MEDIA_MANIFEST;
  const review = window.BABY_STORY_OBSERVATIONS || { months: [], events: [] };
  if (!data || !manifest) return;
  const birth = data.profile.birthDate.split("-").map(Number);
  const dayNumber = iso => Date.parse(iso + "T00:00:00Z") / 86400000;
  const dateLabel = iso => iso.split("-").reverse().join("/");
  function monthAt(iso) {
    const p = iso.split("-").map(Number);
    return (p[0] - birth[0]) * 12 + p[1] - birth[1] - (p[2] < birth[2] ? 1 : 0);
  }
  function ageAt(iso) {
    const m = monthAt(iso);
    if (m < 0) return "Trước sinh";
  }
  function compactMonths(months) {
    if (months < 0) return "chưa sinh";
    const y = Math.floor(months / 12), m = months % 12;
    if (y && m) return y + "t" + m + "m";
    if (y) return y + "t";
    return m + "m";
  }
  function sisterAgeText(iso) {
    const day = dayNumber(iso);
    const p = iso.split("-").map(Number);
    return (data.sisters || []).map(function (sister) {
      const b = sister.birthDate.split("-").map(Number);
      const months = (p[0] - b[0]) * 12 + p[1] - b[1] - (p[2] < b[2] ? 1 : 0);
      return sister.name + " " + compactMonths(months);
    }).join(" · ");
    const anchor = new Date(Date.UTC(birth[0], birth[1] - 1 + m, birth[2])).toISOString().slice(0, 10);
    const d = dayNumber(iso) - dayNumber(anchor);
    return [m >= 12 ? Math.floor(m / 12) + " tuổi" : "", m % 12 || m < 12 ? m % 12 + " tháng" : "", d ? d + " ngày" : ""].filter(Boolean).join(" ");
  }
  function countLabel(items) {
    return [items.filter(i => i.type === "image").length + " ảnh", items.filter(i => i.type === "video").length + " video"].join(" · ");
  }
  const media = manifest.items.map(item => Object.assign({}, item, {
    sourceDate: item.date, ageMonth: monthAt(item.date), ageText: ageAt(item.date),
    sourceLayer: item.group === "digestion" ? "user-confirmed" : item.type,
    label: (item.type === "image" ? "Ảnh" : "Video") + " · " + dateLabel(item.date) + " · " + sisterAgeText(item.date)
  })).sort((a, b) => a.date.localeCompare(b.date) || a.src.localeCompare(b.src, "vi", { numeric: true }));
  const bySrc = new Map(media.map(item => [item.src, item])), claimed = new Set();
  const unsafe = new Set(review.excludePreview || []);
  const approvedPreview = new Set(review.previewCandidates || []);
  function daysFor(items) {
    const groups = new Map();
    items.forEach(item => {
      if (!groups.has(item.date)) groups.set(item.date, []);
      groups.get(item.date).push(item);
    });
    return Array.from(groups).sort(([a], [b]) => a.localeCompare(b)).map(([date, list]) => ({
      date, dateLabel: dateLabel(date), ageMonth: monthAt(date), ageText: ageAt(date), media: list,
      mediaLabel: countLabel(list), story: "Ngày " + dateLabel(date) + " · " + sisterAgeText(date) + "."
    }));
  }
  function attach(scene, items, featured) {
    scene.galleryMedia = items;
    scene.timelineDays = daysFor(items);
    scene.galleryLabel = (scene.sensitive ? "Mở album riêng · " : "Xem album · ") + countLabel(items);
    const dates = scene.timelineDays;
    if (dates.length) scene.dateRange = dateLabel(dates[0].date) + " → " + dateLabel(dates[dates.length - 1].date);
    const approved = review.previewCandidates || [];
    const eligible = scene.sensitive ? [] : items.filter(item =>
      !unsafe.has(item.src) && (approved.length ? approved.has(item.src) : item.type === "image"));
    const selected = [], used = new Set();
    const add = item => { if (item && !used.has(item.src) && selected.length < 4) { selected.push(item); used.add(item.src); } };
    (featured || []).forEach(src => add(eligible.find(i => i.src === src)));
    if (!selected.length) add(eligible.find(i => i.type === "image") || eligible[0]);
    if (!selected.some(s => s.type === "video")) add(eligible.find(i => i.type === "video"));
    [eligible[eligible.length - 1], eligible[Math.floor(eligible.length / 2)]].forEach(add);
    eligible.forEach(add);
    scene.media = selected.map((item, index) => Object.assign({}, item, { role: index ? "featured" : "hero" }));
    scene.previewPolicy = "reviewed-evidence + type-diversity + date-spread";
  }
  data.scenes.forEach(scene => {
    if (scene.date) { scene.ageAtEvent = ageAt(scene.date); scene.dateRange = dateLabel(scene.date); }
  });
  (review.events || []).concat(review.milestones || []).forEach(event => {
    let scene = data.scenes.find(s => s.id === event.sceneId);
    const items = event.media.map(src => {
      if (!bySrc.has(src)) { console.warn("[story] reviewed media missing on disk, skipped: " + src); return null; }
      if (claimed.has(src)) { console.warn("[story] duplicate event ownership, skipped: " + src); return null; }
      claimed.add(src);
      return bySrc.get(src);
    }).filter(Boolean);
    if (!scene) {
      scene = { id: event.sceneId, month: monthAt(event.date), order: 50, date: event.date, type: "memory",
        layout: "gallery-preview", align: "center", title: event.title, description: event.story,
        sourceRole: "visually-reviewed", narrativeSource: "visual-evidence", importance: 3 };
      data.scenes.push(scene);
    }
    scene.storyEvidence = event.evidence;
    if (event.importance) scene.importance = event.importance;
    scene.sensitive = !!event.sensitive;
    if (scene.date) scene.ageAtEvent = ageAt(scene.date);
    if (event.context) scene.mediaContext = event.context;
    scene.mediaPolicy = "explicit";
    attach(scene, items, event.featured);
  });
  const health = media.filter(i => i.group === "digestion");
  if (health.length) {
    health.forEach(i => claimed.add(i.src));
    const scene = { id: "ca-health-digestion-library", month: monthAt(health[0].date), order: 65,
      type: "health-story", layout: "health-story", align: "center", sensitive: true, sourceRole: "user-confirmed",
      title: "Nhật ký theo dõi tiêu hóa", description: "Những ảnh và video gia đình lưu riêng để theo dõi tiêu hóa của " + data.profile.name + ". Mở nhật ký để xem theo ngày; các hình ảnh này không xuất hiện trên hành trình chung." };
    attach(scene, health);
    data.scenes.push(scene);
  }
  const groups = new Map();
  media.forEach(item => {
    if (claimed.has(item.src)) return;
    if (!groups.has(item.ageMonth)) groups.set(item.ageMonth, []);
    groups.get(item.ageMonth).push(item);
  });
  Array.from(groups).sort(([a], [b]) => a - b).forEach(([month, items], index) => {
    const relevant = (review.months || []).filter(o => o.ageMonth === month && o.evidence.some(src => items.some(i => i.src === src)));
    const age = month < 0 ? "Trước sinh" : month < 12 ? month + " tháng" : Math.floor(month / 12) + " tuổi" + (month % 12 ? " " + month % 12 + " tháng" : "");
    const scene = { id: "ca-" + String(month).padStart(2, "0") + "m-media-diary-v2", month, order: 70,
      type: "gallery", layout: "gallery-preview", align: index % 2 ? "right" : "left", importance: 3,
      eyebrow: age + " · NHẬT KÝ GIA ĐÌNH", title: relevant.length ? relevant[0].title : age + " · Những ngày được giữ lại",
      subtitle: countLabel(items), description: relevant.length ? Array.from(new Set(relevant.map(o => o.story))).join(" ") :
        "Những khoảnh khắc của " + data.profile.name + " từ " + dateLabel(items[0].date) + " đến " + dateLabel(items[items.length - 1].date) + ". Mỗi ngày trong album đều có tuổi của bé ở thời điểm ấy.",
      narrativeSource: relevant.length ? "visual-evidence" : "dated-media-only",
      storyEvidence: relevant.flatMap(o => o.evidence) };
    attach(scene, items, relevant.flatMap(o => o.featured || o.evidence.slice(0, 1)));
    data.scenes.push(scene);
  });
  data.mediaSummary = { imageCount: media.filter(i => i.type === "image").length, videoCount: media.filter(i => i.type === "video").length,
    linkedEventMediaCount: claimed.size, diaryDayCount: daysFor(media.filter(i => !claimed.has(i.src))).length,
    rule: "image-video-event-independent", storyRule: "visual-evidence-or-date-age-only" };
})();
