"""Watch Baby2 display media and auto-rebuild manifest + posters.

Copy a new dated image/video into Baby2/assets/y-khue/{images,videos} and the
site picks it up on the next browser refresh; deleting files also syncs.
Filenames must start with a calendar date (YYYY-MM-DD...); anything else is
reported and skipped. Run from anywhere and keep the window open:
    python Baby2/scripts/watch-media.py
"""
from __future__ import annotations

import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = ROOT / "BabyMix" / "scripts"
WATCH = [ROOT / "BabyMix" / "assets" / "babymix" / "images", ROOT / "BabyMix" / "assets" / "babymix" / "videos"]
POLL_SECONDS = 4
QUIET_SECONDS = 3


def snapshot() -> dict[str, tuple[float, int]]:
    state: dict[str, tuple[float, int]] = {}
    for folder in WATCH:
        if not folder.exists():
            continue
        for path in folder.rglob("*"):
            if path.is_file():
                try:
                    state[path.as_posix()] = (path.stat().st_mtime, path.stat().st_size)
                except OSError:
                    pass
    return state


def changed_files(before: dict, after: dict) -> tuple[list[str], list[str], list[str]]:
    added = sorted(set(after) - set(before))
    removed = sorted(set(before) - set(after))
    changed = sorted(k for k in set(before) & set(after) if before[k] != after[k])
    return added, changed, removed


def run_builder(args: list[str]) -> None:
    result = subprocess.run([sys.executable, *args], capture_output=True, text=True, cwd=ROOT)
    output = (result.stdout + result.stderr).strip()
    if output:
        print(output, flush=True)
    if result.returncode != 0:
        print(f"[watch] builder failed: {' '.join(args)}", flush=True)


def main() -> None:
    print(f"[watch] Baby2 media watcher on {WATCH}", flush=True)
    print("[watch] Copy/delete dated files (YYYY-MM-DD...) to auto-sync. Ctrl+C to stop.", flush=True)
    before = snapshot()
    while True:
        time.sleep(POLL_SECONDS)
        after = snapshot()
        added, changed, removed = changed_files(before, after)
        if not (added or changed or removed):
            continue
        # Debounce: wait until the copy batch settles before rebuilding.
        time.sleep(QUIET_SECONDS)
        after = snapshot()
        added, changed, removed = changed_files(before, after)
        before = after
        for path in added + changed:
            name = Path(path).name
            if name[:4].isdigit() and name[4] == "-":
                continue
            print(f"[watch] BỎ QUA (tên không có ngày YYYY-MM-DD): {path}", flush=True)
        new_videos = [p for p in added + changed if p.endswith(".mp4")]
        for video in new_videos:
            print(f"[watch] video mới: {Path(video).name}", flush=True)
        print(f"[watch] thay đổi: +{len(added)} ~{len(changed)} -{len(removed)} → tạo poster thiếu + rebuild manifest", flush=True)
        run_builder([str(SCRIPTS / "build-video-posters.py")])
        run_builder([str(SCRIPTS / "build-display.py")])
        run_builder([str(SCRIPTS / "build-media-manifest.py")])
        print("[watch] xong — refresh trình duyệt để thấy thay đổi.", flush=True)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("[watch] stopped", flush=True)
