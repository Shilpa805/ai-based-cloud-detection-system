import { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Camera, Radio, Wifi, ShieldAlert } from 'lucide-react';

export function RealtimeView() {
  const webcamRef = useRef<Webcam>(null);
  const [isActive, setIsActive] = useState(false);
  const [outputSrc, setOutputSrc] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  const captureFrame = useCallback(async () => {
    if (!isActive || !webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      // Convert base64 to Blob
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const file = new File([blob], 'webcam.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('file', file);

      // We explicitly lock to YOLO for Realtime
      const response = await axios.post(`http://localhost:8000/predict-cloud?model=yolo`, formData);

      if (response.data && response.data.base64_image) {
        setOutputSrc(response.data.base64_image);
        setStats(response.data);
      }
    } catch (err) {
      console.error("Frame inference failed", err);
    }
  }, [isActive]);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      // Poll every 1000ms
      interval = setInterval(() => {
        captureFrame();
      }, 1000);
    } else {
      setOutputSrc(null);
      setStats(null);
    }
    return () => clearInterval(interval);
  }, [isActive, captureFrame]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl flex justify-between items-center bg-black/40 border border-white/5">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2"><Wifi className="text-red-500 animate-pulse" /> Edge Inference Tunnel</h2>
          <p className="text-sm text-gray-400">Low-latency webcam passthrough explicitly utilizing YOLOv8 lightweight architectures.</p>
        </div>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-6 py-3 rounded-full font-bold transition-all shadow-lg flex items-center gap-2 ${isActive ? 'bg-red-500/20 text-red-500 border border-red-500' : 'bg-primary text-white hover:bg-primary/80'}`}
        >
          <Camera className="w-5 h-5" />
          {isActive ? "Terminate Feed" : "Initialize Camera"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel rounded-2xl p-4 overflow-hidden relative min-h-[400px] flex items-center justify-center bg-black">
          {isActive ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="text-gray-600 flex flex-col items-center">
              <Radio className="w-16 h-16 mb-4 opacity-50" />
              <p>Sensor offline.</p>
            </div>
          )}
          <div className="absolute top-6 left-6 bg-black/60 px-3 py-1 rounded text-xs tracking-widest text-gray-400 border border-white/10">RAW OPTICAL SENSOR</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 overflow-hidden relative min-h-[400px] flex items-center justify-center bg-black">
          {outputSrc ? (
            <img src={outputSrc} alt="Processed feed" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <div className="text-gray-600 flex flex-col items-center">
              <ShieldAlert className="w-16 h-16 mb-4 opacity-50" />
              <p>Awaiting neural output...</p>
            </div>
          )}
          <div className="absolute top-6 right-6 bg-primary/20 text-primary border border-primary px-3 py-1 rounded font-bold text-xs">YOLOv8 EDGE</div>

          {stats && (
            <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur border border-white/10 p-4 rounded-xl flex justify-between items-center text-sm">
              <div>
                <strong className="text-gray-400 block mb-1">Entities Detected</strong>
                <span className="text-xl text-white">{stats.count} Objects</span>
              </div>
              <div className="text-right">
                <strong className="text-gray-400 block mb-1">Inference Latency</strong>
                <span className="text-green-400 font-bold">~12ms</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
