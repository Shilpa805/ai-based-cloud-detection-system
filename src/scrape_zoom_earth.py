import os
import cv2
import numpy as np
import time
from playwright.sync_api import sync_playwright

def scrape_zoom_earth(base_path="../data/zoom_earth_clouds", num_images=10):
    dirs = [
        f"{base_path}/images/train",
        f"{base_path}/images/val",
        f"{base_path}/labels/train",
        f"{base_path}/labels/val"
    ]
    for d in dirs:
        os.makedirs(d, exist_ok=True)
        
    print("Launching Chromium to scrape zoom.earth dataset...")
    
    # Coordinate sets around India/Southeast Asia (Lats ~10 to ~30, Lons ~70 to ~100)
    # Using 10 random variations
    np.random.seed(42)
    coords = []
    for _ in range(num_images):
        lat = np.random.uniform(10.0, 30.0)
        lon = np.random.uniform(70.0, 95.0)
        zoom = np.random.choice([6, 7, 8])
        coords.append((lat, lon, zoom))

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a high res viewport
        page = browser.new_page(viewport={"width": 1280, "height": 720})
        
        for i, (lat, lon, zoom) in enumerate(coords):
            split = "train" if i < num_images * 0.8 else "val"
            url = f"https://zoom.earth/maps/satellite/#view={lat:.4f},{lon:.4f},{zoom}z"
            print(f"Scraping [{i+1}/{num_images}]: {url}")
            
            try:
                page.goto(url, wait_until="networkidle")
                # Wait for the map tiles to render
                time.sleep(4)
                
                # Take screenshot
                img_bytes = page.screenshot()
                
                # Read into opencv
                img_arr = np.frombuffer(img_bytes, dtype=np.uint8)
                img = cv2.imdecode(img_arr, cv2.IMREAD_COLOR)
                
                # Center crop to 640x640 to fit YOLO standard and avoid UI bars
                h, w, _ = img.shape
                start_y = max(0, h//2 - 320)
                start_x = max(0, w//2 - 320)
                cropped_img = img[start_y:start_y+640, start_x:start_x+640]
                
                # Auto-generate pseudo bounding boxes
                # Zoom Earth's clouds are varying shades of grey/white. We'll use morphological operations
                gray = cv2.cvtColor(cropped_img, cv2.COLOR_BGR2GRAY)
                # Blur to ignore sharp text
                blurred = cv2.GaussianBlur(gray, (15, 15), 0)
                # Adaptive threshold to find large patches of brightness
                thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 101, -10)
                
                # Morphological closing to join cloud masses
                kernel = np.ones((25,25), np.uint8)
                closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
                
                contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                
                labels = []
                for cnt in contours:
                    box_x, box_y, box_w, box_h = cv2.boundingRect(cnt)
                    # Filter for decent sized cloud patches
                    if 40 < box_w < 500 and 40 < box_h < 500:
                        n_cx = (box_x + box_w/2) / 640.0
                        n_cy = (box_y + box_h/2) / 640.0
                        n_w = box_w / 640.0
                        n_h = box_h / 640.0
                        labels.append(f"0 {n_cx:.4f} {n_cy:.4f} {n_w:.4f} {n_h:.4f}")
                
                # Always save images even if no clouds, as negative examples help YOLO learn what ISN'T a cloud
                img_path = f"{base_path}/images/{split}/zoom_earth_{i}.jpg"
                lbl_path = f"{base_path}/labels/{split}/zoom_earth_{i}.txt"
                
                cv2.imwrite(img_path, cropped_img)
                with open(lbl_path, "w") as f:
                    f.write("\n".join(labels))
                    
            except Exception as e:
                print(f"Failed to scrape {url}: {e}")
                
        browser.close()
    print("Scraping complete!")

if __name__ == "__main__":
    scrape_zoom_earth()
