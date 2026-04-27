import os

base = "data/processed/sugarcane/train"

for cls in os.listdir(base):
    print(cls, len(os.listdir(os.path.join(base, cls))))