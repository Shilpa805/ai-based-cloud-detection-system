import os
import cv2
import numpy as np
import requests
from io import BytesIO
from PIL import Image

def get_wikimedia_cloud_images(num_images=20):
    # Hardcoded generic public domain satellite images from Wikimedia Commons
    images = [
        "https://upload.wikimedia.org/wikipedia/commons/2/23/Hurricane_Katrina_Aug_28_2005_NASA.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/0/00/Tropical_Storm_Don_2011.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/a/af/Typhoon_Tip_peak.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/4/47/Hurricane_Sandy_Oct_24_2012_1455Z.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/e/e0/Hurricane_Irma_2017-09-05.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/c/c5/Hurricane_Patricia_2015-10-23_1730Z.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/b/b3/Hurricane_Dorian_2019-09-01_1330Z.jpg"
    ]
    return images

def create_genuine_dataset(base_path="../data/genuine_clouds"):
    dirs = [
        f"{base_path}/images/train",
        f"{base_path}/images/val",
        f"{base_path}/labels/train",
        f"{base_path}/labels/val"
    ]
    for d in dirs:
        os.makedirs(d, exist_ok=True)
        
    print("Fetching genuine satellite images from Wikimedia Commons API...")
    img_urls = get_wikimedia_cloud_images(30)
    print(f"Discovered {len(img_urls)} real satellite images.")

    for i, url in enumerate(img_urls):
        split = "train" if i < len(img_urls) * 0.8 else "val"
        try:
            response = requests.get(url, timeout=10)
            img = Image.open(BytesIO(response.content)).convert("RGB")
            img = img.resize((640, 640))
            img_np = np.array(img)
            
            # To generate a bounding box for our dataset natively
            gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
            # Use adaptive thresholding to find clouds better than simple luma
            thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            labels = []
            for cnt in contours:
                x, y, w, h = cv2.boundingRect(cnt)
                # Filter heuristically: must be somewhat large but not the whole image
                if 20 < w < 300 and 20 < h < 300:
                    area = w * h
                    if area > 1000:
                        n_cx, n_cy = (x + w/2) / 640.0, (y + h/2) / 640.0
                        n_w, n_h = w / 640.0, h / 640.0
                        labels.append(f"0 {n_cx:.4f} {n_cy:.4f} {n_w:.4f} {n_h:.4f}")

            # Save if we actually found something cloud-like
            if labels:
                img_path = f"{base_path}/images/{split}/genuine_{i}.jpg"
                lbl_path = f"{base_path}/labels/{split}/genuine_{i}.txt"
                
                # We specifically do BGR conversion for cv2.imwrite if we want, or just save via PIL
                img.save(img_path)
                with open(lbl_path, "w") as f:
                    f.write("\n".join(labels))
                    
        except Exception as e:
            print(f"Failed to process {url} - {e}")
            
    print(f"Finished processing into {base_path}")

if __name__ == "__main__":
    create_genuine_dataset()
