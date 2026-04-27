import cv2
import os

def is_simple_background(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return False
    variance = img.var()
    return variance < 5000  # lower = simpler image

src = "data/raw/maize/leaf_spot"
dst = "data/raw/maize_clean/leaf_spot"

os.makedirs(dst, exist_ok=True)

for file in os.listdir(src):
    path = os.path.join(src, file)
    if is_simple_background(path):
        os.rename(path, os.path.join(dst, file))