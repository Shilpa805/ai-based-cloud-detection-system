import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadDropzone } from '../components/UploadDropzone';
import { MetricsPanel } from '../components/MetricsPanel';
import { Cloud, Zap, ShieldCheck, Box, Server } from 'lucide-react';
import axios from 'axios';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

export function AnalysisView() {
  const [model, setModel] = useState<'yolo' | 'xception' | 'resnet' | 'vgg'>('yolo');
  const [, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setPreviewUrl(URL.createObjectURL(uploadedFile));
    setIsProcessing(true);
    setResults(null);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await axios.post(`${apiUrl}/predict-cloud?model=${model}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTimeout(() => {
        setResults(res.data);
        setIsProcessing(false);
      }, 600);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: UI Controls & Dropzone */}
      <div className="lg:col-span-4 flex flex-col space-y-6">
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 blur-2xl rounded-full"></div>
          <h2 className="text-lg font-semibold mb-4">Neural Architecture Selector</h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Select the active model to process the upcoming geospatial query.
          </p>
          
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setModel('yolo')} className={`py-3 text-sm font-medium flex items-center justify-center gap-2 rounded-xl transition-all ${model === 'yolo' ? 'bg-primary/20 border border-primary text-white shadow-lg' : 'bg-black/30 border border-white/5 text-gray-500 hover:text-gray-300'}`}>
              <Zap className={`w-4 h-4 ${model === 'yolo' ? 'text-yellow-400' : ''}`} /> YOLOv8 Edge
            </button>
            <button onClick={() => setModel('xception')} className={`py-3 text-sm font-medium flex items-center justify-center gap-2 rounded-xl transition-all ${model === 'xception' ? 'bg-green-500/20 border border-green-500 text-white shadow-lg' : 'bg-black/30 border border-white/5 text-gray-500 hover:text-gray-300'}`}>
              <ShieldCheck className={`w-4 h-4 ${model === 'xception' ? 'text-green-400' : ''}`} /> Xception
            </button>
            <button onClick={() => setModel('resnet')} className={`py-3 text-sm font-medium flex items-center justify-center gap-2 rounded-xl transition-all ${model === 'resnet' ? 'bg-blue-500/20 border border-blue-500 text-white shadow-lg' : 'bg-black/30 border border-white/5 text-gray-500 hover:text-gray-300'}`}>
              <Server className={`w-4 h-4 ${model === 'resnet' ? 'text-blue-400' : ''}`} /> ResNet50
            </button>
            <button onClick={() => setModel('vgg')} className={`py-3 text-sm font-medium flex items-center justify-center gap-2 rounded-xl transition-all ${model === 'vgg' ? 'bg-purple-500/20 border border-purple-500 text-white shadow-lg' : 'bg-black/30 border border-white/5 text-gray-500 hover:text-gray-300'}`}>
              <Box className={`w-4 h-4 ${model === 'vgg' ? 'text-purple-400' : ''}`} /> VGG19
            </button>
          </div>
        </div>
        <UploadDropzone onUpload={handleUpload} isProcessing={isProcessing} />
      </div>

      {/* Right Column: Output & Action Metrics */}
      <div className="lg:col-span-8 flex flex-col space-y-6">
        <AnimatePresence mode="wait">
          {!previewUrl ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-panel rounded-2xl p-8 h-full min-h-[400px] flex flex-col items-center justify-center text-gray-500 border-dashed">
              <Cloud className="w-16 h-16 mb-4 opacity-20" />
              <p>Awaiting satellite or terrestrial ingestion...</p>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col space-y-6 h-full">
              {/* Image Canvas Panel */}
              <div className="glass-panel rounded-2xl overflow-hidden relative flex-1 min-h-[300px] border border-white/10">
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-20">
                    <div className="flex space-x-2 mb-4">
                      <motion.div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_#6366f1]" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                      <motion.div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_#6366f1]" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} />
                      <motion.div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_#6366f1]" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} />
                    </div>
                  </div>
                )}
                <div className="relative w-full h-[40vh] md:h-[45vh] bg-black">
                  {!isProcessing && results && results.base64_image ? (
                    <ReactCompareSlider
                      className="w-full h-full object-contain"
                      itemOne={<ReactCompareSliderImage src={previewUrl} alt="Original" style={{ objectFit: 'contain' }} />}
                      itemTwo={<ReactCompareSliderImage src={results.base64_image} alt="Detections" style={{ objectFit: 'contain' }} />}
                    />
                  ) : (
                    <img src={previewUrl} alt="Source Data" className={`object-contain h-full w-full transition-all duration-700 ${isProcessing ? 'filter blur-xl brightness-50 opacity-50' : 'opacity-100'}`} />
                  )}
                </div>
              </div>
              
              {/* Metrics Panel */}
              <div className="h-[200px]">
                {results && !isProcessing && (
                  <MetricsPanel 
                    coverage={results.coverage_percent} 
                    confidence={results.detections && results.detections.length > 0 ? results.detections[0].confidence : (results.mocked ? 0.95 : 0.98)} 
                    model={results.mode} 
                    weather={results.weather_forecast} 
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
