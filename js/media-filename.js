/* Hiển thị tên file gốc khi mở ảnh/video trong viewer.
   Tên lấy trực tiếp từ file đang hiển thị nên tự đồng bộ khi thêm/xóa media. */
(function () {
  "use strict";

  var STYLE = document.createElement("style");
  STYLE.textContent = [
    "#mediaFilenameTag{position:absolute;left:16px;bottom:56px;z-index:5;display:none;",
    "max-width:min(72vw,560px);padding:7px 14px;border-radius:999px;",
    "background:rgba(10,14,12,.72);color:#f2f7f4;font:600 12.5px/1.35 'Segoe UI',system-ui,sans-serif;",
    "letter-spacing:.01em;border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(6px);",
    "pointer-events:auto;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
    "#mediaFilenameTag.mft-copied{background:rgba(79,146,113,.92);border-color:transparent;}",
    "#mediaFilenameTag .mft-type{opacity:.72;font-weight:500;margin-left:8px}",
    "@media (max-width:640px){#mediaFilenameTag{left:10px;bottom:10px;max-width:86vw;font-size:11.5px;padding:6px 11px}}"
  ].join("");
  document.head.appendChild(STYLE);

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function basename(src) {
    try {
      var path = decodeURIComponent(new URL(src, location.href).pathname);
      return path.split("/").pop() || "";
    } catch (error) {
      return String(src || "").split(/[\\/]/).pop();
    }
  }

  function friendlyDate(name) {
    if (!/^\d{4}-\d{2}-\d{2}/.test(name)) return "";
    var p = name.split("-");
    return p[2].slice(0, 2) + "/" + p[1] + "/" + p[0];
  }

  function captionFor(media) {
    if (!media) return "";
    var isVideo = media.tagName === "VIDEO";
    var name = basename(media.currentSrc || media.getAttribute("src") || media.getAttribute("data-src") || "");
    if (!name) return "";
    var parts = [escapeHtml(name)];
    if (!/^\d{4}-\d{2}-\d{2}/.test(name)) {
      var date = friendlyDate(name);
      if (date) parts.push(escapeHtml(date));
    }
    return parts.join(" · ") + '<span class="mft-type">' + (isVideo ? "Video" : "Ảnh") + "</span>";
  }

  function mount() {
    var viewer = document.getElementById("mediaViewer");
    var content = document.getElementById("mediaViewerContent");
    if (!viewer || !content) return false;
    var tag = document.getElementById("mediaFilenameTag");
    if (!tag) {
      tag = document.createElement("div");
      tag.id = "mediaFilenameTag";
      (viewer.querySelector(".media-viewer__panel") || viewer).appendChild(tag);
    }
    var currentName = "";
    function copyText(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      var helper = document.createElement("textarea");
      helper.value = text;
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      try { document.execCommand("copy"); } catch (error) {}
      document.body.removeChild(helper);
      return Promise.resolve();
    }
    tag.title = "Bấm để copy tên file";
    tag.addEventListener("click", function () {
      if (!currentName) return;
      copyText(currentName).then(function () {
        tag.classList.add("mft-copied");
        var restore = tag.innerHTML;
        tag.textContent = "Đã copy: " + currentName + " ✓";
        setTimeout(function () {
          tag.classList.remove("mft-copied");
          tag.innerHTML = restore;
        }, 1200);
      });
    });
    function refresh() {
      var media = content.querySelector("video, img");
      var html = captionFor(media);
      if (html) {
        tag.innerHTML = html;
        currentName = basename(media.currentSrc || media.getAttribute("src") || media.getAttribute("data-src") || "");
        tag.style.display = "block";
      } else {
        currentName = "";
        tag.style.display = "none";
      }
    }
    new MutationObserver(refresh).observe(content, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
    refresh();
    return true;
  }

  if (!mount()) {
    var bootObserver = new MutationObserver(function () {
      if (mount()) bootObserver.disconnect();
    });
    bootObserver.observe(document.body, { childList: true, subtree: true });
  }
})();
