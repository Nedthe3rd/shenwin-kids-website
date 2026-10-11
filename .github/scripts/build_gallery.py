"""Build the photo gallery from the folders in docs/events/.

Each folder in docs/events/ is one event. The folder name is the event title.
Inside a folder:
  - photos (JPG, PNG or HEIC from an iPhone), any names, any size
  - optional about.txt: line 1 = short description, line 2 = small label above the title

This script:
  1. shrinks every new photo to a web-friendly JPG (max 1600 px, location data removed)
  2. writes docs/events/events.json, which gallery.html reads to show the events

New events are added at the TOP of the gallery. Existing events keep their order.
"""

import json
import os
import re
from pathlib import Path

from PIL import Image, ImageOps

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:  # HEIC support is optional when running locally
    pass

EVENTS_DIR = Path(__file__).resolve().parents[2] / "docs" / "events"
LIST_FILE = EVENTS_DIR / "events.json"

PHOTO_EXTS = {".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp"}
MAX_SIZE = 1600
QUALITY = 78


def natural_key(name):
    return [int(p) if p.isdigit() else p.lower() for p in re.split(r"(\d+)", name)]


def is_web_ready(path):
    """A photo is already done if it is a small .jpg we produced (or equivalent)."""
    if path.suffix != ".jpg":
        return False
    try:
        with Image.open(path) as im:
            return max(im.size) <= MAX_SIZE and path.stat().st_size <= 900_000
    except Exception:
        return False


def process_photo(path):
    """Convert/shrink one photo in place. Returns the final path, or None if unreadable."""
    if is_web_ready(path):
        return path
    try:
        with Image.open(path) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            im.thumbnail((MAX_SIZE, MAX_SIZE))
            target = path.with_suffix(".jpg")
            if target != path and target.exists():
                target = path.with_name(path.stem + "-web.jpg")
            im.save(target, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    except Exception as error:
        print(f"  ! could not read {path.name}: {error}")
        return None
    if target != path:
        path.unlink()
    print(f"  shrunk {path.name} -> {target.name}")
    return target


def read_about(folder):
    about = folder / "about.txt"
    if not about.exists():
        return "", ""
    lines = [l.strip() for l in about.read_text(encoding="utf-8", errors="ignore").splitlines() if l.strip()]
    description = lines[0] if lines else ""
    label = lines[1] if len(lines) > 1 else ""
    return description, label


def main():
    EVENTS_DIR.mkdir(parents=True, exist_ok=True)

    previous_order = []
    if LIST_FILE.exists():
        try:
            previous_order = [e["folder"] for e in json.loads(LIST_FILE.read_text(encoding="utf-8"))]
        except Exception:
            previous_order = []

    folders = [f for f in EVENTS_DIR.iterdir() if f.is_dir() and not f.name.startswith(".")]
    by_name = {f.name: f for f in folders}

    new_folders = sorted((n for n in by_name if n not in previous_order), key=natural_key)
    order = new_folders + [n for n in previous_order if n in by_name]

    events = []
    for name in order:
        folder = by_name[name]
        print(f"Event: {name}")
        photos = []
        for item in sorted(folder.iterdir(), key=lambda p: natural_key(p.name)):
            if item.is_file() and item.suffix.lower() in PHOTO_EXTS:
                done = process_photo(item)
                if done:
                    photos.append(done.name)
        photos = sorted(set(photos), key=natural_key)
        if not photos:
            print("  (no photos yet, skipped)")
            continue
        description, label = read_about(folder)
        events.append({
            "folder": name,
            "title": name,
            "label": label,
            "description": description,
            "photos": photos,
        })

    LIST_FILE.write_text(json.dumps(events, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {LIST_FILE.relative_to(EVENTS_DIR.parents[1])} with {len(events)} events")


if __name__ == "__main__":
    main()
