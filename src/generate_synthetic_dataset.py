import os
import cv2
import numpy as np

def create_synthetic_dataset(base_path="../data/synthetic_clouds", num_train=20, num_val=5):
    """
    Creates a small synthetic dataset of raw images and YOLO-format labels 
    to demonstrate and validate the training pipeline without needing a 
    massive download.
    """
    dirs = [
        f"{base_path}/images/train",
        f"{base_path}/images/val",
        f"{base_path}/labels/train",
        f"{base_path}/labels/val"
    ]
    
    for d in dirs:
        os.makedirs(d, exist_ok=True)
        
    def generate_image_and_label(split, index):
        # Create a mock nighttime satellite image
        img = np.zeros((640, 640, 3), dtype=np.uint8)
        
        # Add random "city lights" (bright spots)
        for _ in range(50):
            cx, cy = np.random.randint(0, 640, 2)
            cv2.circle(img, (cx, cy), np.random.randint(2, 8), (255, 255, 255), -1)
            
        # Add some "clouds" (grey blobs)
        labels = []
        for _ in range(np.random.randint(1, 4)):
            cx, cy = np.random.randint(100, 540, 2)
            w, h = np.random.randint(50, 150, 2)
            
            # Draw cloud
            cv2.ellipse(img, (cx, cy), (w, h), np.random.randint(0, 360), 0, 360, (150, 150, 150), -1)
            # Add some noise to make it look slightly realistic
            noise = np.random.normal(0, 10, (h*2, w*2, 3)).astype(np.uint8)
            # YOLO format: class x_center y_center width height (normalized)
            n_cx, n_cy = cx / 640.0, cy / 640.0
            n_w, n_h = (w * 2) / 640.0, (h * 2) / 640.0
            
            # Clip bounds
            n_cx = max(0.0, min(1.0, n_cx))
            n_cy = max(0.0, min(1.0, n_cy))
            n_w = max(0.0, min(1.0, n_w))
            n_h = max(0.0, min(1.0, n_h))
            
            labels.append(f"0 {n_cx:.4f} {n_cy:.4f} {n_w:.4f} {n_h:.4f}")

        # Save image
        img_path = f"{base_path}/images/{split}/synth_{index}.jpg"
        cv2.imwrite(img_path, img)
        
        # Save label
        lbl_path = f"{base_path}/labels/{split}/synth_{index}.txt"
        with open(lbl_path, "w") as f:
            f.write("\n".join(labels))

    print(f"Generating {num_train} training images...")
    for i in range(num_train):
        generate_image_and_label("train", i)
        
    print(f"Generating {num_val} validation images...")
    for i in range(num_val):
        generate_image_and_label("val", i)
        
    print(f"Synthetic dataset created successfully at {os.path.abspath(base_path)}")

if __name__ == "__main__":
    create_synthetic_dataset()
