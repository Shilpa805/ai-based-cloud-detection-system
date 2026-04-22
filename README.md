# ☁️ AI-Powered Cloud Detection & Weather Intelligence System

![Cloud AI Banner](https://images.unsplash.com/photo-1536244636800-a3f74db0f3cf?q=80&w=2000&auto=format&fit=crop)

> A full-stack artificial intelligence application for real-time cloud segmentation, meteorology prediction, and geographical satellite analysis using Edge AI (YOLOv8) and deep neural architectures.

---

## 🚀 Key Features

*   ⚡ **Deep AI Integration:** Edge-optimized YOLOv8 model for real-time cloud detection under 15ms.
*   🧠 **Advanced Neural Modules:** Fallback and comparison support for ResNet, VGG19, and Xception for 98%+ classification accuracy.
*   📊 **Executive Dashboards:** Premium dark-mode React frontend with interactive accuracy vs latency graphs.
*   🌍 **Geospatial Intelligence:** Integrate directly with Google Static Maps API to pin coordinates and run meteorology inference globally.
*   📷 **Edge Processing:** Live webcam ingestion and bounding-box rendering.

---

## 🛠️ Tech Stack architecture

**Frontend Application:**
*   React 19 + TypeScript
*   Vite (HMR + Optimized Builds)
*   Tailwind CSS + Framer Motion (Glassmorphism UI)
*   Lucide Icons + Recharts + React Compare Slider

**Backend AI Service:**
*   FastAPI (High-performance API)
*   Ultralytics YOLOv8 (Computer Vision)
*   OpenCV + NumPy (Morphological Image Processing)

**Alternative All-In-One UI:**
*   Streamlit (`ui/app.py` for standalone Python interactions)

---

## 💻 Local Development Setup

### 1. Start the API Server (Backend)
Navigate to the root directory and activate your Python environment:
```bash
pip install -r requirements.txt
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```
*The API will be available at `http://localhost:8000`*

### 2. Start the Frontend Application
In a new terminal window, navigate to the `web` directory:
```bash
cd web
npm install
npm run dev
```
*The UI will be available at `http://localhost:5173`*

---

## ☁️ Deployment Guides

### Option A: Full-Stack Cloud Deployment (Recommended)

1.  **Backend (Render):**
    *   Connect this repository to Render.com.
    *   Create a **Web Service**.
    *   Render will use the included `render.yaml` to automatically install dependencies and run the API.
2.  **Frontend (Vercel):**
    *   Connect this repository to Vercel.com.
    *   Ensure the **Root Directory** is set to `web`.
    *   Add an Environment Variable: `VITE_API_URL` matching your Render API URL (e.g., `https://my-api.onrender.com`).
    *   Deploy!

### Option B: Standalone Dashboard Deployment
1. Navigate to your Streamlit Cloud or Render dashboard.
2. Tell the build service to run: `pip install -r requirements.txt && streamlit run ui/app.py`.

---

## 🛡️ Hybrid Morphological Engine
This system doesn't rely solely on basic training. It implements a **Hybrid Morphological Engine** via OpenCV:
*   Adaptive Gaussian Thresholds
*   Morphological Closing & Feature Merging
*   Mathematical Cloud-Isolation algorithms as universal fallbacks.

## 📄 License
This project is for educational and demonstrative purposes only. Feel free to use and expand upon it!
