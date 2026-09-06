(function () {
  "use strict";

  const data = window.BABY_DISCOVERY_DATA;
  if (!data || !data.profile || !Array.isArray(data.scenes)) return;

  function parseISO(value) {
    const p = String(value || "").split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }

  function toISO(date) {
    return date.getFullYear() + "-" +
      String(date.getMonth() + 1).padStart(2, "0") + "-" +
      String(date.getDate()).padStart(2, "0");
  }

  function labelDate(iso) {
    const d = parseISO(iso);
    return String(d.getDate()).padStart(2, "0") + "/" +
      String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
  }

  function addDays(iso, amount) {
    const d = parseISO(iso);
    d.setDate(d.getDate() + amount);
    return toISO(d);
  }

  function birthdayAfterYears(years) {
    const birth = parseISO(data.profile.birthDate);
    return toISO(new Date(birth.getFullYear() + years, birth.getMonth(), birth.getDate()));
  }

  function collectRecordedDates() {
    const dates = new Set();
    data.scenes.forEach(function (scene) {
      (scene.timelineDays || []).forEach(function (day) {
        if (day && day.date) dates.add(day.date);
      });
      if (scene.date && scene.galleryMedia && scene.galleryMedia.length) dates.add(scene.date);
    });
    return Array.from(dates).sort();
  }

  function hasRecordedDate(date) {
    return collectRecordedDates().indexOf(date) !== -1;
  }

  const firstBirthday = birthdayAfterYears(1);
  const windowStart = addDays(firstBirthday, -11);
  const recorded = collectRecordedDates().filter(function (date) {
    return date >= windowStart && date <= firstBirthday;
  });

  // Chỉ tạo bridge khi timeline thật đủ dày để đoạn chuyển cảnh có ý nghĩa.
  if (recorded.length < 4 || !hasRecordedDate(firstBirthday)) return;

  const bridgeId = data.technicalBabyId + "-11m-first-birthday-bridge";
  if (data.scenes.some(function (scene) { return scene.id === bridgeId; })) return;

  const ceremony = data.scenes.find(function (scene) {
    return scene.type === "family-event" && scene.date && scene.date < firstBirthday;
  });

  let description = "Từ " + labelDate(recorded[0]) + " đến " + labelDate(firstBirthday) +
    ", những ngày sát tuổi đầu tiên được giữ lại liên tục bằng ảnh và video.";

  if (ceremony) {
    description += " Giữa chuỗi ký ức ấy là " + String(ceremony.title || "một ngày đặc biệt").toLowerCase() +
      " vào " + labelDate(ceremony.date) + ".";
  }

  description += " Đến " + labelDate(firstBirthday) + ", " + data.profile.name + " tròn 1 tuổi.";

  data.scenes.push({
    id: bridgeId,
    month: 11,
    order: 60,
    type: "narrative-bridge",
    importance: 3,
    layout: "narrative-bridge",
    align: "center",
    sourceRole: "derived-from-dated-media",
    eyebrow: "NHỮNG NGÀY TIẾN GẦN TUỔI ĐẦU TIÊN",
    title: "Chỉ còn ít ngày nữa là 1 tuổi",
    subtitle: labelDate(recorded[0]) + " → " + labelDate(firstBirthday),
    description: description,
    derivedDates: recorded
  });
})();