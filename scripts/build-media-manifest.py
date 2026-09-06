"""Build the BabyMix runtime manifest from display files."""
from __future__ import annotations

import datetime as dt
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "BabyMix"
ASSETS = BASE / "assets" / "babymix"
YEN = dt.date(2021, 4, 4)
CA = dt.date(2022, 12, 8)


def main() -> None:
    items = []
    for kind, suffix in (("images", ".webp"), ("videos", ".mp4")):
        folder = ASSETS / kind
        for path in sorted(folder.rglob(f"*{suffix}")) if folder.exists() else []:
            try:
                date = dt.date.fromisoformat(path.name[:10])
            except ValueError:
                print(f"[manifest] skip (filename needs YYYY-MM-DD prefix): {path.name}", file=sys.stderr)
                continue
            rel = path.relative_to(BASE).as_posix()
            item = {"id": rel, "src": "./" + rel, "originalFilename": path.name, "date": date.isoformat(),
                    "type": "image" if kind == "images" else "video", "group": "prenatal-ca" if date < CA else "diary"}
            if kind == "videos":
                item["poster"] = "./" + rel.replace("/videos/", "/posters/").rsplit(".", 1)[0] + ".webp"
            items.append(item)
    items.sort(key=lambda item: (item["date"], item["src"]))
    manifest = {"version": 1, "profileId": "babymix", "items": items,
                "counts": {"images": sum(i["type"] == "image" for i in items),
                           "videos": sum(i["type"] == "video" for i in items),
                           "prenatalCa": sum(i["group"] == "prenatal-ca" for i in items)}}
    output = BASE / "data" / "media-manifest.js"
    output.write_text("window.BABY_MEDIA_MANIFEST = " + json.dumps(manifest, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    print(manifest["counts"])


if __name__ == "__main__":
    main()
