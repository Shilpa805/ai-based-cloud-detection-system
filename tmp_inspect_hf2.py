from datasets import load_dataset
try:
    ds = load_dataset("SimonSongHit/fengyun4A-cloud-detection-dataset", split="train[:1]")
    print("Features Simon:", ds.features)
except Exception as e:
    print("Error:", e)
