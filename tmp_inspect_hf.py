from datasets import load_dataset
try:
    ds = load_dataset("Wisp-y/storm-cloud-detection", split="train[:5]")
    print("Features:", ds.features)
    print("Sample:", ds[0])
except Exception as e:
    print("Error loading:", e)
