from ultralytics import YOLO
import os

def train():
    print("Starting YOLOv8 training for robust Cloud Detection...")
    
    # 1. Load a pre-trained base model
    model = YOLO("yolov8n.pt")
    
    # 2. Get absolute path to the dataset yaml to avoid path resolution errors
    yaml_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "zoom_earth_dataset.yaml"))
    
    # 3. Train the model
    results = model.train(
        data=yaml_path,
        epochs=10,        # Increase to 100+ for real datasets
        imgsz=640,
        batch=4,          # Adjust based on your GPU RAM
        project="../models",
        name="cloud_yolo",
        exist_ok=True,    # Overwrite previous run if exists
        device="cpu"      # Change to device=0 if you have an NVIDIA GPU
    )
    
    print("Training complete! Model saved to models/cloud_yolo/weights/best.pt")
    
    # Optional: copy it to a more accessible location
    import shutil
    src = "../models/cloud_yolo/weights/best.pt"
    dst = "../models/best_cloud_yolo.pt"
    if os.path.exists(src):
        shutil.copy(src, dst)
        print(f"Copied optimal weights to {dst}")

if __name__ == "__main__":
    train()
