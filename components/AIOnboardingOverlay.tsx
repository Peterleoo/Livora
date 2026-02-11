import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';
import { UserPreferences } from '../types';

interface AIOnboardingOverlayProps {
  onComplete: (prefs: UserPreferences) => void;
  onSkip: () => void;
}

const LIFESTYLE_TAGS = [
  '🐱 养宠家庭', '🍳 热爱烹饪', '🏋️ 健身达人', '🧘 独居安静',
  '🎮 电竞房', '☀️ 阳光充足', '🌳 公园漫步', '🚇 地铁直达'
];

export const AIOnboardingOverlay: React.FC<AIOnboardingOverlayProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(0);
  const [workLocation, setWorkLocation] = useState('');
  const [budget, setBudget] = useState(5000);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      startAnalysis();
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      onComplete({
        workLocation,
        budgetRange: [budget - 1000, budget + 1000],
        lifestyleTags: selectedTags,
        commuteMethod: 'SUBWAY',
        dimensions: {
          priceSensitivity: 80,
          commuteImportance: 90,
          comfortRequirement: 70,
          amenityPreference: 60,
          socialVibe: 50
        }
      });
    }, 2500); // Fake analysis delay
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30">
              <Icon name="smart_toy" className="text-white text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">我是您的 AI 租房顾问</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              为了帮您找到最完美的家，我想了解几个关于您的核心偏好。<br/>只需 30 秒，绝不繁琐。
            </p>
            <button onClick={handleNext} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all">
              开始个性化定制
            </button>
            <button onClick={onSkip} className="mt-4 text-slate-400 text-xs font-medium">
              跳过，我先随便看看
            </button>
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">您在哪里工作/上学？</h2>
            <p className="text-slate-500 text-xs mb-6">AI 将为您计算最佳通勤路线</p>
            
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-2 flex items-center gap-2 mb-4">
              <Icon name="search" className="text-slate-400 ml-2" />
              <input 
                type="text" 
                value={workLocation}
                onChange={(e) => setWorkLocation(e.target.value)}
                placeholder="输入地址或公司名称" 
                className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white py-2"
                autoFocus
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {['腾讯滨海大厦', '万象天地', '车公庙', '高新园'].map(loc => (
                <button 
                  key={loc} 
                  onClick={() => setWorkLocation(loc)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-600 dark:text-slate-300"
                >
                  {loc}
                </button>
              ))}
            </div>

            <button onClick={handleNext} disabled={!workLocation} className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
              下一步
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">您的月租预算大约是？</h2>
            <p className="text-slate-500 text-xs mb-8">我们将为您匹配性价比最高的房源</p>
            
            <div className="text-center mb-8">
              <span className="text-4xl font-bold text-slate-900 dark:text-white font-display">¥{budget}</span>
              <span className="text-slate-400 text-sm"> /月</span>
            </div>

            <input 
              type="range" 
              min="2000" 
              max="20000" 
              step="500" 
              value={budget} 
              onChange={(e) => setBudget(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary mb-8"
            />

            <div className="flex justify-between text-xs text-slate-400 mb-8">
               <span>¥2,000</span>
               <span>¥20,000+</span>
            </div>

            <button onClick={handleNext} className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg">
              下一步
            </button>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">您的生活方式关键词</h2>
            <p className="text-slate-500 text-xs mb-6">AI 将基于此推荐符合您气质的社区</p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {LIFESTYLE_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all ${
                    selectedTags.includes(tag) 
                    ? 'bg-primary text-white border-primary shadow-md transform scale-105' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <button onClick={handleNext} className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold py-4 rounded-xl shadow-lg">
              生成我的专属画像
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-[#101010] flex flex-col items-center justify-center p-8 text-center">
         <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             rotate: [0, 180, 360],
             borderRadius: ["20%", "50%", "20%"]
           }}
           transition={{ duration: 2, repeat: Infinity }}
           className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 blur-xl opacity-50 absolute"
         />
         <div className="relative z-10">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
               <Icon name="auto_awesome" className="text-primary text-4xl animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">正在构建 AI 画像...</h2>
            <div className="h-1 w-48 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto overflow-hidden mt-4">
               <motion.div 
                 className="h-full bg-primary"
                 initial={{ width: 0 }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 2.5 }}
               />
            </div>
            <motion.p 
               className="text-slate-400 text-sm mt-4"
               animate={{ opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 1.5, repeat: Infinity }}
            >
               正在分析通勤距离...<br/>正在筛选 {budget}元 左右的房源...
            </motion.p>
         </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="bg-white dark:bg-[#101010] w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Progress Bar */}
        {step > 0 && (
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        {/* Back Button */}
        {step > 0 && step < 4 && (
          <button onClick={() => setStep(step - 1)} className="absolute top-6 left-6 p-2 -ml-2 text-slate-400 hover:text-slate-600">
            <Icon name="arrow_back" />
          </button>
        )}

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
