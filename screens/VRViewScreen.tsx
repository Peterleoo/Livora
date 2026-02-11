import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/Icon';

interface VRViewScreenProps {
  onBack: () => void;
  onSign: () => void;
}

export const VRViewScreen: React.FC<VRViewScreenProps> = ({ onBack, onSign }) => {
  const [showMeasurements, setShowMeasurements] = useState(false);

  return (
    <div className="relative h-full w-full bg-black overflow-hidden flex flex-col">
      {/* Background VR Image (Simulated) */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear hover:scale-110"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop')`
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-20 flex items-center justify-between p-4 pt-safe">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10">
          <Icon name="arrow_back" />
        </button>
        <h1 className="text-white font-medium drop-shadow-md">720° 沉浸式看房</h1>
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10">
          <Icon name="share" />
        </button>
      </div>

      {/* AI Assistant Bubble */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-24 right-4 z-10 flex flex-col items-end gap-2 max-w-[280px]"
      >
        <div className="flex items-start gap-2">
           <div className="bg-slate-900/80 backdrop-blur-md text-white text-sm p-3 rounded-2xl rounded-tr-none border border-white/10 shadow-xl">
            <span className="block text-blue-400 font-bold text-xs mb-1">AI 讲解员</span>
            <p className="leading-relaxed text-xs">
              请留意这扇朝南的大落地窗，清晨采光极佳。点击地面可查看详细尺寸。
            </p>
          </div>
          <div className="relative shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-[2px]">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" 
                className="w-full h-full rounded-full object-cover"
                alt="AI Avatar"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
          </div>
        </div>
      </motion.div>

      {/* Interactive Hotspots */}
      <div 
        className="absolute top-1/2 left-1/3 z-10 cursor-pointer group"
        onClick={() => setShowMeasurements(!showMeasurements)}
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping"></div>
          <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] border-2 border-blue-500 z-10"></div>
          <AnimatePresence>
            {showMeasurements && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur px-2 py-1 rounded text-white text-xs whitespace-nowrap"
              >
                墙长: 4.2米
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="mt-auto relative z-20 bg-dark-surface rounded-t-3xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full"></div>
        </div>
        
        {/* Environment Stats */}
        <div className="px-5 py-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {[
              { icon: 'wb_sunny', label: '日照时长', value: '4.5小时', color: 'text-amber-400' },
              { icon: 'graphic_eq', label: '分贝值', value: '32dB', color: 'text-blue-400' },
              { icon: 'thermostat', label: '室内温度', value: '22°C', color: 'text-orange-400' }
            ].map((stat, i) => (
              <div key={i} className="flex-1 min-w-[100px] bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col items-center gap-1.5 backdrop-blur-sm">
                <Icon name={stat.icon} className={`${stat.color}`} />
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{stat.label}</p>
                  <p className="text-white text-sm font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-5 pb-8 pt-2 border-t border-white/5 flex gap-3">
          <button className="flex-1 h-12 rounded-xl border border-white/20 bg-transparent text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition-all">
            <Icon name="calendar_today" size={20} />
            预约看房
          </button>
          <button 
            onClick={onSign}
            className="flex-[1.5] h-12 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 flex items-center justify-center gap-2 hover:bg-primary-dark active:scale-95 transition-all"
          >
            <Icon name="edit_document" size={20} />
            立即签约
          </button>
        </div>
      </div>
    </div>
  );
};