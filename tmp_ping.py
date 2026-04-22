import requests
import json

try:
    with open('yolov8n.pt', 'rb') as f:
        pass
    
    # Just to ping something, wait the get/ route
    r = requests.get('http://localhost:8000/')
    print("Root:", r.json())
    
except Exception as e:
    print(e)
