import requests
import numpy as np
from PIL import Image
import io

# Create a dummy image
img = Image.new('RGB', (640, 640), color = 'white')
buf = io.BytesIO()
img.save(buf, format='JPEG')
buf.seek(0)

# test YOLO
res = requests.post("http://localhost:8000/predict-cloud?model=yolo", files={"file": ("test.jpg", buf, "image/jpeg")})
print("YOLO response:")
print(res.json())

buf.seek(0)
res_vgg = requests.post("http://localhost:8000/predict-cloud?model=vgg", files={"file": ("test.jpg", buf, "image/jpeg")})
print("VGG response:")
print(res_vgg.json())
