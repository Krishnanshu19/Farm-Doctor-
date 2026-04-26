import os
from PIL import Image

def clean_images(folder):
    removed = 0
    checked = 0

    for root, dirs, files in os.walk(folder):
        for file in files:
            path = os.path.join(root, file)
            checked += 1
            try:
                img = Image.open(path)
                img.verify()
            except:
                os.remove(path)
                removed += 1
                print(f"Removed: {path}")

    print(f"\nChecked: {checked} images")
    print(f"Removed: {removed} corrupted images")

clean_images("data/raw/maize")