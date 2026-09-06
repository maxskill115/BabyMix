"""Copy-checked display build for BabyMix (Yên & Cá).

Source: BabyMix/IMG_checked (WebP) + BabyMix/Video_checked (MP4) — the
user-processed set. Copies into assets/babymix/{images,videos}/YYYY/MM with
SHA-256 audit; idempotent (existing matching files are skipped, mismatches
raise).
"""
from __future__ import annotations

import datetime as dt
import hashlib
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "BabyMix"
ASSETS = BASE / "assets" / "babymix"
AUDIT = BASE / "data" / "media-display-audit.json"
IMAGE_EXT = {".webp"}
VIDEO_EXT = {".mp4"}


def sha256(path: Path) -> str:
    with path.open("rb") as handle:
        return hashlib.file_digest(handle, "sha256").hexdigest()


def ym(stem: str) -> Path:
    return Path(stem[:4]) / stem[5:7]


def main() -> None:
    """Nguồn IMG_checked/Video_checked đã hợp nhất vào assets/babymix (xóa bản trùng
    sau khi verify hash). Chạy script này giờ chỉ re-verify display + refresh audit."""
    rows = []
    for folder, kind in (("assets/babymix/images", "images"), ("assets/babymix/videos", "videos")):
        source_dir = BASE / folder
        for source in sorted(source_dir.rglob("*")):
            if not source.is_file() or source.suffix.lower() not in (IMAGE_EXT | VIDEO_EXT):
                continue
            stem = source.stem
            if not re.match(r"\d{4}-\d{2}-\d{2}", stem):
                print(f"[display] skip (filename needs YYYY-MM-DD prefix): {source.name}")
                continue
            try:
                dt.date.fromisoformat(stem[:10])
            except ValueError:
                print(f"[display] skip (invalid date): {source.name}")
                continue
            dest = ASSETS / kind / ym(stem) / source.name
            status = "existing"
            if dest.exists():
                if sha256(dest) != sha256(source):
                    raise RuntimeError(f"Display conflict with different content: {dest}")
            else:
                dest.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, dest)
                if sha256(dest) != sha256(source):
                    raise RuntimeError(f"Checksum mismatch after copy: {dest}")
                status = "copied"
            rows.append({"source": source.relative_to(BASE).as_posix(), "kind": kind,
                         "destination": dest.relative_to(ROOT).as_posix(),
                         "sha256": sha256(dest), "status": status})
    AUDIT.parent.mkdir(parents=True, exist_ok=True)
    AUDIT.write_text(json.dumps({"version": 1, "profileId": "babymix", "files": rows},
                                ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    images = sum(1 for r in rows if r["kind"] == "images")
    videos = sum(1 for r in rows if r["kind"] == "videos")
    print(f"Display ready: {images} images + {videos} videos")


if __name__ == "__main__":
    main()
