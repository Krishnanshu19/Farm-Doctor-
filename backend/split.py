import splitfolders

splitfolders.ratio(
    "data/raw/maize",
    output="data/raw/maize",
    seed=42,
    ratio=(0.7, 0.15, 0.15)
)