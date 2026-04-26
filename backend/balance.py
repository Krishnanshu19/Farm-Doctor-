import os

base = "data/raw/maize"

for cls in os.listdir(base):
    print(cls, len(os.listdir(os.path.join(base, cls))))