import json
from pathlib import Path
import requests

SCRIPTS_DIR = Path(__file__).resolve().parent
DATA_DIR = SCRIPTS_DIR / "data"
OUT_DIR = SCRIPTS_DIR.parent / "public" / "images" / "items"

OUT_DIR.mkdir(parents=True, exist_ok=True)

DATA_FILES = [
    DATA_DIR / "arc_raiders_items_enriched.json",
    DATA_DIR / "augment_items_enriched.json",
    DATA_DIR / "grenade_items_enriched.json",
    DATA_DIR / "healing_items_enriched.json",
    DATA_DIR / "quick_use_items_enriched.json",
    DATA_DIR / "trap_items_enriched.json",
    DATA_DIR / "shields.json",
    DATA_DIR / "weapon_items_enriched.json",
    DATA_DIR / "modification_items_enriched.json",
]

for data_file in DATA_FILES:
    if not data_file.exists():
        print(f"Skipping missing file: {data_file}")
        continue

    items = json.loads(data_file.read_text())
    print(f"Processing {data_file.relative_to(SCRIPTS_DIR.parent)}")

    for item in items:
        item_id = item.get("id")
        url = item.get("image")
        if not item_id or not url:
            continue

        file_path = OUT_DIR / f"{item_id}.webp"

        try:
            resp = requests.get(url, timeout=30)
            resp.raise_for_status()
        except requests.RequestException as exc:
            print(f"Failed {item_id}: {exc}")
            continue

        file_path.write_bytes(resp.content)
        print(f"Saved {file_path}")