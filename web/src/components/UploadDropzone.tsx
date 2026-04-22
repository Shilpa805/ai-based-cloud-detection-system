import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

interface UploadProps {
  onUpload: (file: File) => void;
  isProcessing: boolean;
}

export function UploadDropzone({ onUpload, isProcessing }: UploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${isDragOver ? 'border-primary bg-primary/5' : 'border-dashed'}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input type="file" ref={inputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files && onUpload(e.target.files[0])} />
      
      <div className="p-4 bg-white/5 rounded-full mb-4">
        {isProcessing ? (
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
             <UploadCloud className="w-8 h-8 text-primary" />
          </motion.div>
        ) : (
          <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">
        {isProcessing ? "Processing via Neural Engine..." : "Drop satellite imagery here"}
      </h3>
      <p className="text-sm text-gray-400 max-w-xs">
        Supports high-resolution PNG, JPG, or TIFF files. Or click to browse.
      </p>
    </motion.div>
  );
}
