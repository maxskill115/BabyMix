(function () {
  "use strict";

  const data = window.BABY_DISCOVERY_DATA;
  if (!data || !data.profile) return;

  const alias = document.getElementById("profileAlias");
  if (alias) {
    alias.textContent = "";
    alias.hidden = true;
  }

  const intro = document.querySelector(".journey__intro p");
  if (intro) {
    intro.textContent = "Những bức ảnh, đoạn video và cột mốc của " + data.profile.name + " được nối lại theo tuổi, để mỗi lần cuộn xuống là một đoạn của hành trình lớn lên.";
  }
})();
