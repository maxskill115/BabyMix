"""Create static WebP posters for BabyMix display MP4s; resume safely."""
from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
VIDEOS = ROOT / "BabyMix" / "assets" / "babymix" / "videos"

for video in sorted(VIDEOS.rglob("*.mp4")) if VIDEOS.exists() else []:
    poster = Path(str(video).replace("\\videos\\", "\\posters\\")).with_suffix(".webp")
    if poster.exists() and poster.stat().st_size > 32:
        continue
    poster.parent.mkdir(parents=True, exist_ok=True)
    for seek in ("0.15", "0"):
        result = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", seek, "-i", str(video), "-frames:v", "1", "-vf", "scale=640:-2:force_original_aspect_ratio=decrease", "-c:v", "libwebp", "-quality", "76", str(poster)], capture_output=True)
        if result.returncode == 0 and poster.exists() and poster.stat().st_size > 32:
            break
    else:
        raise RuntimeError(f"Poster failed: {video}")
print("Posters complete")
