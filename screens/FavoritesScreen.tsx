import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/Icon';
import { Property } from '../types';

interface FavoritesScreenProps {
  onBack: () => void;
  properties: Property[]; // Full list of properties
  favoriteIds: Set<string>;
  onToggleFavorite: (id: string, e?: React.MouseEvent) => void;
  onPropertyClick: (id: string) => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ 
  onBack, 
  properties, 
  favoriteIds, 
  onToggleFavorite,
  onPropertyClick
}) => {
  // Filter only favorited properties
  const favoritedProperties = properties.filter(p => favoriteIds.has(p.id));

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#101010]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#f8fafc]/90 dark:bg-[#101010]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3 pt-safe-top flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-[#202020]">
             <Icon name="arrow_back" className="text-slate-900 dark:text-white" size={20} />
          </button>
          <div className="font-bold text-lg text-slate-900 dark:text-white">我的收藏</div>
          <div className="w-8"></div> {/* Spacer */}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {favoritedProperties.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
                {favoritedProperties.map((item) => (
                    <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={() => onPropertyClick(item.id)}
                        className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-3 shadow-sm border border-slate-100 dark:border-slate-800 flex gap-3 cursor-pointer active:scale-[0.98] transition-transform"
                    >
                        <div className="w-28 h-28 rounded-xl overflow-hidden shrink-0 relative">
                            <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                            <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-white font-bold flex items-center gap-0.5">
                                <Icon name="bolt" size={10} className="text-yellow-400" />
                                {item.matchScore}%
                            </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-tight mb-1 pr-6">
                                        {item.title}
                                    </h3>
                                    <button 
                                        onClick={(e) => onToggleFavorite(item.id, e)}
                                        className="text-red-500 hover:scale-110 transition-transform -mt-1 -mr-1 p-1"
                                    >
                                        <Icon name="favorite" size={20} className="font-variation-settings-filled" />
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 truncate">{item.location}</p>
                            </div>

                            <div>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {item.tags.slice(0, 2).map((tag, i) => (
                                        <span key={i} className="px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-500 text-[10px] rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-baseline gap-0.5 text-red-500">
                                    <span className="text-xs font-bold">¥</span>
                                    <span className="text-lg font-bold font-display">{item.price}</span>
                                    <span className="text-xs text-slate-400 font-normal">/月</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-24">
             <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-300 dark:text-slate-600">
                <Icon name="favorite_border" size={40} />
             </div>
             <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">暂无收藏房源</h3>
             <p className="text-slate-500 text-sm text-center max-w-[200px] mb-8">
                点击房源卡片上的爱心图标，<br/>将心仪的家加入收藏夹
             </p>
             <button 
                onClick={onBack}
                className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95"
             >
                去发现房源
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
