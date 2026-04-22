import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const performanceData = [
  { name: 'Epoch 1', ResNet50: 45, VGG19: 50, Xception: 55, YOLOv8: 52 },
  { name: 'Epoch 5', ResNet50: 60, VGG19: 65, Xception: 75, YOLOv8: 70 },
  { name: 'Epoch 10', ResNet50: 68, VGG19: 75, Xception: 87, YOLOv8: 78 },
  { name: 'Epoch 15', ResNet50: 72, VGG19: 79, Xception: 93, YOLOv8: 81 },
  { name: 'Epoch 20', ResNet50: 75.0, VGG19: 82.0, Xception: 98.4, YOLOv8: 83.3 }
];

const latencyData = [
  { name: 'YOLOv8 Edge', ms: 12, category: 'Real-Time' },
  { name: 'ResNet50', ms: 120, category: 'Classification' },
  { name: 'VGG19', ms: 145, category: 'Classification' },
  { name: 'Xception', ms: 180, category: 'Deep Classification' }
];

export function DashboardView() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="glass-panel p-8 rounded-2xl">
        <h2 className="text-xl font-bold mb-1">Executive Performance Matrix</h2>
        <p className="text-gray-400 text-sm mb-8">Comprehensive validation accuracy trajectories across active AI architectures.</p>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" domain={[40, 100]} label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft', fill: '#888' }} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(21,27,46,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Legend verticalAlign="top" height={36}/>
              <Line type="monotone" dataKey="Xception" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="YOLOv8" stroke="#eab308" strokeWidth={3} />
              <Line type="monotone" dataKey="VGG19" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="ResNet50" stroke="#f43f5e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="glass-panel p-8 rounded-2xl">
          <h2 className="text-lg font-bold mb-4">Inference Latency (Lower is Better)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                <XAxis type="number" stroke="#888" unit="ms" />
                <YAxis dataKey="name" type="category" stroke="#ccc" width={100} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(21,27,46,0.9)', borderColor: 'rgba(255,255,255,0.1)' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                <Bar dataKey="ms" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-2xl flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-4">Architectural Conclusion</h3>
            <p className="text-gray-300 leading-relaxed text-sm mb-4">
              <strong>Xception</strong> achieves the highest validation accuracy (98.4%) due to its powerful depthwise separable convolutions, making it ideal for deep offline analysis.
            </p>
            <p className="text-gray-300 leading-relaxed text-sm">
              <strong>YOLOv8</strong> dominates the real-time sector with an inference latency of ~12ms while retaining an 83.3% structural bounding accuracy, qualifying it as the mandatory edge-deployment architecture.
            </p>
        </div>
      </div>
    </motion.div>
  );
}
