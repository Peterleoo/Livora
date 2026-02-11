import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../components/Icon';

interface CitySelectionScreenProps {
  onSelectCity: (city: string) => void;
  currentCity?: string;
}

const CITIES = [
  { 
    name: '深圳市', 
    image: 'https://images.unsplash.com/photo-1545063914-81857182d67a?auto=format&fit=crop&w=800&q=80',
    desc: '科技之都'
  },
  { 
    name: '杭州市', 
    image: 'https://images.unsplash.com/photo-1596482181744-8d96d9333333?auto=format&fit=crop&w=800&q=80',
    desc: '人间天堂'
  },
  { 
    name: '长沙市', 
    image: 'https://images.unsplash.com/photo-1563812838043-4e0828303f83?auto=format&fit=crop&w=800&q=80',
    desc: '星城娱乐'
  },
  { 
    name: '北京市', 
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80',
    desc: '即将开通',
    disabled: true
  },
];

export const CitySelectionScreen: React.FC<CitySelectionScreenProps> = ({ onSelectCity, currentCity }) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#101010] p-6 pt-safe-top">
       <div className="mb-8 mt-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-display">
             选择您想居住的城市
          </h1>
          <p className="text-slate-500 text-sm">
             智寓 AI 将为您提供该城市的专属房源服务
          </p>
       </div>

       <div className="grid grid-cols-1 gap-4 overflow-y-auto pb-safe-bottom">
          {CITIES.map((city) => (
             <motion.button
                key={city.name}
                whileHover={{ scale: city.disabled ? 1 : 1.02 }}
                whileTap={{ scale: city.disabled ? 1 : 0.98 }}
                onClick={() => !city.disabled && onSelectCity(city.name)}
                disabled={city.disabled}
                className={`relative h-32 w-full rounded-2xl overflow-hidden group text-left ${city.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
             >
                <img 
                   src={city.image} 
                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   alt={city.name}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
                
                <div className="absolute inset-0 p-5 flex flex-col justify-center items-start">
                   <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2">
                      {city.name}
                      {currentCity === city.name && <Icon name="check_circle" className="text-green-400" size={24} />}
                   </h2>
                   <p className="text-white/80 text-sm font-medium mt-1">{city.desc}</p>
                </div>
                
                {city.disabled && (
                   <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-bold border border-white/10">
                      敬请期待
                   </div>
                )}
             </motion.button>
          ))}
       </div>
    </div>
  );
};
