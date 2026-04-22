import { motion } from 'framer-motion';
import { Activity, CloudRain, Target } from 'lucide-react';

interface MetricsProps {
  coverage: number;
  confidence: number;
  model: string;
  weather: string;
}

export function MetricsPanel({ coverage, confidence, model, weather }: MetricsProps) {
  
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: any = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-4">
      <motion.div variants={item} className="glass-panel p-5 rounded-xl border-l-4 border-l-primary">
        <div className="flex items-center space-x-3 mb-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cloud Coverage</span>
        </div>
        <div className="flex items-end space-x-2">
          <span className="text-3xl font-bold text-white">{coverage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-black/40 h-1.5 rounded-full mt-3 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${coverage}%` }} 
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" 
          />
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-panel p-5 rounded-xl">
        <div className="flex items-center space-x-3 mb-2">
          <CloudRain className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Forecast</span>
        </div>
        <span className="text-xl font-bold text-white leading-tight">{weather}</span>
      </motion.div>

      <motion.div variants={item} className="glass-panel p-5 rounded-xl">
        <div className="flex items-center space-x-3 mb-2">
          <Target className="w-4 h-4 text-green-400" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Confidence</span>
        </div>
        <span className="text-2xl font-bold text-white">{(confidence * 100).toFixed(1)}%</span>
      </motion.div>

      <motion.div variants={item} className="glass-panel p-5 rounded-xl flex flex-col justify-center relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-5">
           {/* Decorative icon */}
           <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <div className="flex items-center space-x-3 mb-1 z-10">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Engine</span>
        </div>
        <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 z-10">{model}</span>
      </motion.div>
    </motion.div>
  );
}
