import splitfolders

splitfolders.ratio(
    "data/raw/maize",
    output="data/processed/maize",
    seed=42,
    ratio=(0.7, 0.15, 0.15)
)