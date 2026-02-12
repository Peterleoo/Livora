import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/Icon';
import { Property } from '../types';

interface PropertyDetailsScreenProps {
   property: Property;
   onBack: () => void;
   onEnterVR: () => void;
   onSign: () => void;
   onConsult: () => void;
   isFavorite: boolean;
   onToggleFavorite: () => void;
   isSigned?: boolean;
}

export const PropertyDetailsScreen: React.FC<PropertyDetailsScreenProps> = ({
   property,
   onBack,
   onEnterVR,
   onSign,
   onConsult,
   isFavorite,
   onToggleFavorite,
   isSigned = false
}) => {
   const [activeTab, setActiveTab] = useState<'INFO' | 'AI' | 'LOCATION'>('INFO');

   const AIInsights = () => (
      <motion.div
         key="ai" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
         className="space-y-6"
      >
         <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
               <Icon name="psychology" className="text-indigo-600 dark:text-indigo-400" size={20} />
               AI 定制分析报告
            </h3>
            <div className="space-y-4">
               {[
                  { label: "通勤指数", score: property.features.commute, desc: "步行至地铁站仅需 5 分钟，职住平衡极佳。", icon: "directions_subway", color: "text-blue-500", bg: "bg-blue-50" },
                  { label: "采光条件", score: property.features.sunlight, desc: "南向采光，每日有效日照时长超过 6 小时。", icon: "wb_sunny", color: "text-orange-500", bg: "bg-orange-50" },
                  { label: "静谧程度", score: property.features.noise, desc: "双层隔音玻璃，卧室实测噪音低于 35 分贝。", icon: "volume_off", color: "text-emerald-500", bg: "bg-emerald-50" },
               ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                     <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                        <Icon name={item.icon} size={20} />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-sm font-bold text-slate-800">{item.label}</span>
                           <span className="text-xs font-bold text-indigo-600">{item.score}% 优选</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         <div className="bg-indigo-600 dark:bg-indigo-700 rounded-3xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
               <Icon name="auto_awesome" size={18} />
               <span className="text-xs font-bold uppercase tracking-wider">AI 推荐理由</span>
            </div>
            <p className="text-sm leading-relaxed opacity-90">
               该房源高度契合您的“高效率通勤”标签。不仅通勤便利，社区配套的 24h 健身房也满足了您对健康生活的追求。
            </p>
         </div>
      </motion.div>
   );

   const LocationDetails = () => (
      <motion.div
         key="location" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
         className="space-y-6"
      >
         <div className="bg-slate-200 h-48 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
               <Icon name="map" size={48} className="text-slate-400 opacity-20" />
               <span className="absolute text-slate-500 text-xs font-bold">地图数据加载中...</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white dark:border-slate-700">
               <div className="flex items-center gap-2">
                  <Icon name="location_on" className="text-red-500" size={16} />
                  <span className="text-xs font-bold text-slate-800 truncate">{property.location}</span>
               </div>
            </div>
         </div>
         <div className="grid grid-cols-1 gap-4">
            {[
               { title: "交通枢纽", items: [`距离 ${property.subway} 350米`, "公交科技园站 200米"], icon: "train" },
               { title: "生活配套", items: ["华润万家超市 500米", "大涌生态公园 1.2公里"], icon: "shopping_basket" },
               { title: "医疗教育", items: ["南山医院科技园分院", "实验学校科技园校区"], icon: "local_hospital" },
            ].map((section, idx) => (
               <div key={idx} className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                     <Icon name={section.icon} size={20} />
                  </div>
                  <div>
                     <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{section.title}</h4>
                     {section.items.map((item, i) => (
                        <p key={i} className="text-xs text-slate-500 dark:text-slate-400">{item}</p>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </motion.div>
   );

   return (
      <div className="flex flex-col h-[100dvh] bg-[#f8fafc] dark:bg-[#101922] relative overflow-hidden">
         {/* Top Icons Container */}
         <div className="fixed top-0 left-0 right-0 px-6 pb-6 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] z-50 flex items-center justify-between pointer-events-none bg-gradient-to-b from-black/40 to-transparent">
            <motion.button
               whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
               onClick={onBack}
               className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 pointer-events-auto"
            >
               <Icon name="arrow_back" />
            </motion.button>
            <div className="flex gap-4 pointer-events-auto">
               <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={onEnterVR}
                  className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20"
               >
                  <Icon name="360" size={20} />
               </motion.button>
               <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={onToggleFavorite}
                  className={`w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center border border-white/20 ${isFavorite ? 'bg-rose-500 text-white border-rose-500' : 'bg-black/20 text-white'}`}
               >
                  <Icon name={isFavorite ? "favorite" : "favorite_border"} />
               </motion.button>
               <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20"
               >
                  <Icon name="share" />
               </motion.button>
            </div>
         </div>

         {/* 1. Immersive Image Gallery & Content - Scrollable Content */}
         <div className="flex-1 overflow-y-auto scroll-smooth pb-44 no-scrollbar">
            <div className="relative h-[50vh] w-full shrink-0">
               <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5 }}
                  src={property.image}
                  className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] dark:from-[#101922] via-transparent to-transparent" />

               {/* Immersive Tag */}
               <div className="absolute bottom-8 left-6 right-6">
                  <motion.div
                     initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                     className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold tracking-widest uppercase rounded-full mb-3 inline-block shadow-lg"
                  >
                     Premium Collection
                  </motion.div>
                  <motion.h1
                     initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                     className="text-3xl font-bold text-slate-900 dark:text-white"
                  >
                     {property.title}
                  </motion.h1>
               </div>
            </div>

            <div className="px-6 relative z-10">
               {/* AI Insight Highlight Row */}
               <motion.div
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-3xl p-5 shadow-xl shadow-slate-200/50 dark:shadow-none mb-6 flex items-center gap-6"
               >
                  <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                     <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                        <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-indigo-600" strokeDasharray={151} strokeDashoffset={151 * (1 - property.matchScore / 100)} />
                     </svg>
                     <Icon name="auto_awesome" className="text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">AI 匹配度 {property.matchScore}%</div>
                     <div className="text-slate-600 text-sm leading-tight line-clamp-2">基于您的数据，该房源是该片区最符合您居住习惯的选择。</div>
                  </div>
               </motion.div>

               {/* Tabs */}
               <div className="flex bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-2xl mb-8 sticky top-0 z-20 backdrop-blur-md border border-white dark:border-slate-800">
                  {(['INFO', 'AI', 'LOCATION'] as const).map(tab => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500'}`}
                     >
                        {tab === 'INFO' ? '房源详情' : tab === 'AI' ? 'AI 洞察' : '地理周边'}
                     </button>
                  ))}
               </div>

               {/* Content per Tab */}
               <AnimatePresence mode="wait">
                  {activeTab === 'INFO' && (
                     <motion.div
                        key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                     >
                        {/* Features Grid */}
                        <div className="grid grid-cols-4 gap-4">
                           {[
                              { name: "面积", val: `${property.specs.area}㎡`, icon: "straighten" },
                              { name: "朝向", val: property.direction, icon: "explore" },
                              { name: "楼层", val: property.floor, icon: "layers" },
                              { name: "车位", val: "充足", icon: "local_parking" }
                           ].map((f, i) => (
                              <div key={i} className="bg-white rounded-2xl p-4 flex flex-col items-center gap-1 border border-slate-50 shadow-sm">
                                 <Icon name={f.icon} size={18} className="text-slate-400 mb-1" />
                                 <div className="text-[10px] text-slate-400 font-bold uppercase">{f.name}</div>
                                 <div className="text-xs font-bold text-slate-800">{f.val}</div>
                              </div>
                           ))}
                        </div>
                        <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-3xl border border-slate-50 dark:border-slate-800 shadow-sm">
                           <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">房源简介</h3>
                           <p className="text-slate-500 leading-relaxed text-sm">
                              此房源位于高档社区，环境优雅，安保严格。室内设计注重自然采光，通风极佳。配有全套品牌家电，拎包入住。为您打造高品质的居家生活。
                           </p>
                           <div className="mt-4 flex flex-wrap gap-2">
                              {property.tags.map(tag => (
                                 <span key={tag} className="px-2 py-1 bg-slate-50 text-slate-400 rounded text-[10px] font-bold">{tag}</span>
                              ))}
                           </div>
                        </div>
                     </motion.div>
                  )}

                  {activeTab === 'AI' && <AIInsights />}
                  {activeTab === 'LOCATION' && <LocationDetails />}
               </AnimatePresence>
            </div>

            {/* 3. Sticky Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] bg-gradient-to-t from-white dark:from-[#101922] via-white/95 dark:via-[#101922]/95 to-transparent z-40 border-t border-slate-50 dark:border-slate-800 backdrop-blur-xl">
               <div className="flex items-center gap-4 pb-safe-bottom">
                  <div className="flex-1">
                     <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">月租金</div>
                     <div className="text-2xl font-black text-slate-900 dark:text-white">¥{property.price.toLocaleString()}<span className="text-sm font-medium text-slate-400">/月</span></div>
                  </div>

                  <motion.button
                     whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                     onClick={onConsult}
                     className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200"
                  >
                     <Icon name="chat" />
                  </motion.button>

                  <motion.button
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={onSign}
                     className={`flex-1 h-14 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all ${isSigned
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                        : 'bg-indigo-600 text-white shadow-indigo-600/30'
                        }`}
                  >
                     <Icon name={isSigned ? "verified" : "edit_note"} />
                     <span>{isSigned ? '查看合同' : '立即签约'}</span>
                  </motion.button>
               </div>
            </div>

         </div>
      </div>
   );
};
