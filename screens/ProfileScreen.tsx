import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/Icon';
import { UserPreferences } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ProfileScreenProps {
  onBack: () => void;
  userPreferences?: UserPreferences;
  onUpdatePreferences?: (newPrefs: UserPreferences) => void;
}

// --- Independent Sub-Components (Moved Outside) ---

const AuthModal = ({ 
    onVerify, 
    onClose 
}: { 
    onVerify: () => void, 
    onClose: () => void 
}) => {
    const [step, setStep] = useState<'UPLOAD' | 'SCANNING' | 'CONFIRM' | 'SUCCESS'>('UPLOAD');
    const [frontImage, setFrontImage] = useState<string | null>(null);
    const [backImage, setBackImage] = useState<string | null>(null);

    // Simulation of uploading an image
    const handleUpload = (side: 'FRONT' | 'BACK') => {
        // In a real app, this would trigger file picker
        if (side === 'FRONT') {
            setFrontImage('https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=500&q=80'); // Placeholder for ID Front
        } else {
            setBackImage('https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=500&q=80'); // Placeholder (reusing for demo)
        }
    };

    const startOCR = () => {
        if (!frontImage || !backImage) return;
        setStep('SCANNING');
        // Simulate OCR Process
        setTimeout(() => {
            setStep('CONFIRM');
        }, 2500);
    };

    const confirmInfo = () => {
        setStep('SUCCESS');
        setTimeout(() => {
            onVerify();
            onClose();
        }, 1500);
    };

    return (
        <motion.div 
            initial={{ y: '100%' }} 
            animate={{ y: 0 }} 
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-[#f8fafc] dark:bg-[#101010] flex flex-col"
        >
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 px-4 py-3 pt-safe-top flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
                <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Icon name="close" className="text-slate-900 dark:text-white" />
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">实名认证</h1>
                <div className="w-8"></div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
                
                {step === 'UPLOAD' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm">
                        <div className="text-center mb-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">上传身份证照片</h2>
                            <p className="text-sm text-slate-500">请拍摄二代身份证原件，确保边框完整、字体清晰</p>
                        </div>

                        {/* Front Side */}
                        <div className="mb-6">
                            <p className="text-xs font-bold text-slate-400 mb-2 uppercase">身份证 - 人像面</p>
                            <button 
                                onClick={() => handleUpload('FRONT')}
                                className="w-full aspect-[1.58] bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 relative overflow-hidden group hover:border-primary transition-colors"
                            >
                                {frontImage ? (
                                    <img src={frontImage} className="w-full h-full object-cover" alt="Front ID" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full gap-2">
                                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-primary">
                                            <Icon name="add_a_photo" size={24} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400">点击上传人像面</span>
                                    </div>
                                )}
                                {frontImage && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">点击重新上传</span>
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Back Side */}
                        <div className="mb-8">
                            <p className="text-xs font-bold text-slate-400 mb-2 uppercase">身份证 - 国徽面</p>
                            <button 
                                onClick={() => handleUpload('BACK')}
                                className="w-full aspect-[1.58] bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 relative overflow-hidden group hover:border-primary transition-colors"
                            >
                                {backImage ? (
                                    <img src={backImage} className="w-full h-full object-cover" alt="Back ID" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full gap-2">
                                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-primary">
                                            <Icon name="add_a_photo" size={24} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400">点击上传国徽面</span>
                                    </div>
                                )}
                                {backImage && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">点击重新上传</span>
                                    </div>
                                )}
                            </button>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl flex items-start gap-2 mb-8">
                            <Icon name="info" className="text-orange-500 mt-0.5" size={16} />
                            <p className="text-xs text-orange-700 dark:text-orange-400 leading-tight">
                                智寓承诺：您的身份信息仅用于核验用户真实身份，我们将严格加密存储，绝不外泄。
                            </p>
                        </div>

                        <button 
                            onClick={startOCR}
                            disabled={!frontImage || !backImage}
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                        >
                            提交并识别
                        </button>
                    </motion.div>
                )}

                {step === 'SCANNING' && (
                    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
                        <div className="relative w-full aspect-[1.58] bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl mb-8 border border-slate-200 dark:border-slate-700">
                             {/* Simulated Scanning Image */}
                             <img src="https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=500&q=80" className="w-full h-full object-cover opacity-50 grayscale" />
                             
                             {/* Scan Line Animation */}
                             <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan"></div>
                             
                             <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="bg-black/60 backdrop-blur px-4 py-2 rounded-full text-white text-xs font-bold flex items-center gap-2">
                                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                     AI 正在读取证件信息...
                                 </div>
                             </div>
                        </div>
                        <p className="text-slate-500 text-sm animate-pulse">正在核验身份真伪...</p>
                    </div>
                )}

                {step === 'CONFIRM' && (
                     <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                <Icon name="document_scanner" size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">识别成功</h2>
                            <p className="text-sm text-slate-500">请核对扫描结果是否准确</p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4 mb-8">
                             <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700">
                                 <span className="text-slate-500 text-sm">姓名</span>
                                 <span className="font-bold text-slate-900 dark:text-white">Peterleo</span>
                             </div>
                             <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700">
                                 <span className="text-slate-500 text-sm">身份证号</span>
                                 <span className="font-bold text-slate-900 dark:text-white">440305********1234</span>
                             </div>
                             <div className="flex justify-between items-center py-2">
                                 <span className="text-slate-500 text-sm">有效期</span>
                                 <span className="font-bold text-slate-900 dark:text-white">2030.12.31</span>
                             </div>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setStep('UPLOAD')}
                                className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 dark:bg-slate-800"
                            >
                                重新拍摄
                            </button>
                            <button 
                                onClick={confirmInfo}
                                className="flex-[2] py-3.5 rounded-xl font-bold text-white bg-primary shadow-lg active:scale-95 transition-transform"
                            >
                                确认无误
                            </button>
                        </div>
                     </motion.div>
                )}

                {step === 'SUCCESS' && (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center pb-20">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-200">
                            <Icon name="check" className="text-white" size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">认证已通过</h2>
                        <p className="text-slate-500">您的身份信息已归档，信用分提升 +20</p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

const DimensionTunerModal = ({ 
    preferences, 
    onUpdateDimension, 
    onClose 
}: { 
    preferences: UserPreferences, 
    onUpdateDimension: (key: keyof UserPreferences['dimensions'], value: number) => void, 
    onClose: () => void 
}) => (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
        {/* Backdrop */}
        <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        />
        
        {/* Modal Content */}
        <motion.div 
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-[32px] h-[75vh] sm:h-auto sm:max-h-[85vh] flex flex-col relative z-10 shadow-2xl border-t border-slate-100 dark:border-slate-800"
        onClick={e => e.stopPropagation()}
        >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">微调 AI 偏好模型</h3>
            <button onClick={onClose} className="p-2 -mr-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Icon name="close" size={20} />
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {[
                { label: '价格敏感度', key: 'priceSensitivity', icon: 'savings', desc: '越低越不在意价格，越高越追求性价比' },
                { label: '通勤便捷度', key: 'commuteImportance', icon: 'directions_subway', desc: '对距离地铁站和公司距离的要求' },
                { label: '居住舒适度', key: 'comfortRequirement', icon: 'weekend', desc: '对装修、采光、面积的要求' },
                { label: '周边配套', key: 'amenityPreference', icon: 'storefront', desc: '对商圈、餐饮、公园的依赖' },
                { label: '社交氛围', key: 'socialVibe', icon: 'groups', desc: '偏好热闹合租还是安静独居' },
            ].map((dim) => (
                <div key={dim.key}>
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <Icon name={dim.icon} size={18} className="text-primary" />
                            <span className="font-bold text-slate-900 dark:text-white text-sm">{dim.label}</span>
                        </div>
                        <span className="text-primary font-bold text-sm">
                            {preferences.dimensions[dim.key as keyof UserPreferences['dimensions']]}%
                        </span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={preferences.dimensions[dim.key as keyof UserPreferences['dimensions']]}
                        onChange={(e) => onUpdateDimension(dim.key as keyof UserPreferences['dimensions'], parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <p className="text-xs text-slate-400 mt-2">{dim.desc}</p>
                </div>
            ))}
        </div>
        </motion.div>
    </div>
);

const BudgetEditModal = ({ 
    currentRange, 
    onSave, 
    onClose 
}: { 
    currentRange: [number, number], 
    onSave: (min: number, max: number) => void, 
    onClose: () => void 
}) => {
    const [min, setMin] = useState(currentRange[0]);
    const [max, setMax] = useState(currentRange[1]);

    return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        />

        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-[#1a1a1a] w-full max-w-sm rounded-[24px] p-6 relative z-10 shadow-2xl" 
            onClick={e => e.stopPropagation()}
        >
            <div className="absolute top-4 right-4">
                    <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-slate-600">
                    <Icon name="close" size={20} />
                    </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 text-center">调整预算范围</h3>
            
            <div className="flex items-center justify-center gap-4 mb-8">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 flex-1">
                    <p className="text-xs text-slate-400 mb-1">最低 (¥)</p>
                    <input 
                        type="number" 
                        value={min} 
                        onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                        className="w-full bg-transparent font-bold text-xl outline-none text-slate-900 dark:text-white"
                    />
                </div>
                <div className="w-4 h-1 bg-slate-300 rounded-full"></div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 flex-1">
                    <p className="text-xs text-slate-400 mb-1">最高 (¥)</p>
                    <input 
                        type="number" 
                        value={max} 
                        onChange={(e) => setMax(parseInt(e.target.value) || 0)}
                        className="w-full bg-transparent font-bold text-xl outline-none text-slate-900 dark:text-white"
                    />
                </div>
            </div>

            <button 
                onClick={() => {
                    onSave(min, max);
                    onClose();
                }}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl shadow-lg active:scale-95 transition-all"
            >
                确认修改
            </button>
        </motion.div>
    </div>
    );
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  onBack, 
  userPreferences,
  onUpdatePreferences 
}) => {
  // Use passed preferences or default fallback
  const [preferences, setPreferences] = useState<UserPreferences>(userPreferences || {
    workLocation: '未设置',
    budgetRange: [0, 0],
    lifestyleTags: [],
    commuteMethod: 'SUBWAY',
    dimensions: {
      priceSensitivity: 50,
      commuteImportance: 50,
      comfortRequirement: 50,
      amenityPreference: 50,
      socialVibe: 50
    }
  });

  const [showEditLocation, setShowEditLocation] = useState(false);
  const [newLocation, setNewLocation] = useState(preferences.workLocation);
  
  // New State for Modals
  const [showDimensionTuner, setShowDimensionTuner] = useState(false);
  const [showBudgetEdit, setShowBudgetEdit] = useState(false);

  const [userInfo] = useState({
     city: '深圳市',
     location: '南山区',
     company: '未认证'
  });

  const [authStatus, setAuthStatus] = useState<'UNVERIFIED' | 'VERIFIED'>('UNVERIFIED');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Radar Chart Data Preparation
  const chartData = [
    { subject: '价格敏感', A: preferences.dimensions.priceSensitivity, fullMark: 100 },
    { subject: '通勤便捷', A: preferences.dimensions.commuteImportance, fullMark: 100 },
    { subject: '居住舒适', A: preferences.dimensions.comfortRequirement, fullMark: 100 },
    { subject: '周边配套', A: preferences.dimensions.amenityPreference, fullMark: 100 },
    { subject: '社交氛围', A: preferences.dimensions.socialVibe, fullMark: 100 },
  ];

  const handleUpdateTag = (tag: string) => {
    const currentTags = preferences.lifestyleTags;
    let newTags;
    if (currentTags.includes(tag)) {
        newTags = currentTags.filter(t => t !== tag);
    } else {
        newTags = [...currentTags, tag];
    }
    const newPrefs = { ...preferences, lifestyleTags: newTags };
    setPreferences(newPrefs);
    if (onUpdatePreferences) onUpdatePreferences(newPrefs);
  };

  const handleSaveLocation = () => {
      const newPrefs = { ...preferences, workLocation: newLocation };
      setPreferences(newPrefs);
      if (onUpdatePreferences) onUpdatePreferences(newPrefs);
      setShowEditLocation(false);
  };

  const handleUpdateDimension = (key: keyof UserPreferences['dimensions'], value: number) => {
      const newDimensions = { ...preferences.dimensions, [key]: value };
      const newPrefs = { ...preferences, dimensions: newDimensions };
      setPreferences(newPrefs);
      if (onUpdatePreferences) onUpdatePreferences(newPrefs);
  };

  const handleUpdateBudget = (min: number, max: number) => {
      const newPrefs = { ...preferences, budgetRange: [min, max] as [number, number] };
      setPreferences(newPrefs);
      if (onUpdatePreferences) onUpdatePreferences(newPrefs);
  };

  const InfoRow = ({ label, value, icon, onClick, action }: { label: string, value: string | React.ReactNode, icon: string, onClick?: () => void, action?: boolean }) => (
     <div 
        onClick={onClick}
        className={`flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-800 last:border-none ${onClick ? 'cursor-pointer active:opacity-60 transition-opacity' : ''}`}
     >
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <Icon name={icon} size={16} />
           </div>
           <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-sm font-bold text-slate-900 dark:text-white">{value}</span>
           {(action || onClick) && <Icon name="chevron_right" size={16} className="text-slate-300" />}
        </div>
     </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#101010] overflow-y-auto no-scrollbar relative">
      {/* Top Bar with Back Button */}
      <div className="flex justify-between items-center px-4 pt-safe-top pb-2 sticky top-0 bg-[#f8fafc]/90 dark:bg-[#101010]/90 backdrop-blur-md z-10">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-[#202020]">
           <Icon name="arrow_back" className="text-slate-900 dark:text-white" />
        </button>
        <div className="flex gap-4">
          <Icon name="settings" className="text-slate-600 dark:text-slate-400" size={24} />
        </div>
      </div>

      {/* User Identity */}
      <div className="px-6 pb-6 pt-4 flex items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-slate-700 to-slate-900">
            <img 
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80" 
              className="w-full h-full rounded-full object-cover border-4 border-[#f8fafc] dark:border-[#101010]" 
              alt="Avatar"
            />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Peterleo</h1>
          <p className="text-sm text-slate-500">信用分 {authStatus === 'VERIFIED' ? '780 · 极好' : '650 · 待认证'}</p>
        </div>
      </div>

      {/* AI Preference Hub (Visualized) */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
           <div className="flex items-center gap-2">
              <Icon name="smart_toy" className="text-primary" size={20} />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI 偏好中心</h2>
           </div>
           <button 
             onClick={() => setShowDimensionTuner(true)}
             className="text-[10px] bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-md active:scale-95 transition-transform"
           >
             <Icon name="tune" size={12} /> 微调模型
           </button>
        </div>
        
        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
           {/* Radar Chart */}
           <div className="h-48 w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Radar
                    name="My Preferences"
                    dataKey="A"
                    stroke="#137fec"
                    strokeWidth={2}
                    fill="#137fec"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
           </div>
           
           <div 
             onClick={() => setShowBudgetEdit(true)}
             className="absolute top-4 right-4 text-right cursor-pointer bg-slate-50 dark:bg-slate-800 p-2 rounded-lg active:scale-95 transition-transform border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
           >
              <div className="flex items-center justify-end gap-1 mb-0.5">
                 <p className="text-xs text-slate-400">预算范围</p>
                 <Icon name="edit" size={10} className="text-slate-400" />
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white font-display">
                 ¥{preferences.budgetRange[0]} - {preferences.budgetRange[1]}
              </p>
           </div>

           {/* Commute Setting */}
           <div className="mb-6 mt-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">通勤目的地</label>
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                       <Icon name="work" size={16} />
                    </div>
                    {showEditLocation ? (
                        <input 
                            type="text" 
                            value={newLocation} 
                            onChange={(e) => setNewLocation(e.target.value)}
                            className="bg-transparent outline-none text-sm font-bold text-slate-900 dark:text-white w-full border-b border-primary"
                            autoFocus
                        />
                    ) : (
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{preferences.workLocation}</p>
                            <p className="text-xs text-slate-400">地铁通勤 · 45分钟内</p>
                        </div>
                    )}
                 </div>
                 {showEditLocation ? (
                     <button onClick={handleSaveLocation} className="text-green-500 text-xs font-bold px-2">保存</button>
                 ) : (
                     <button onClick={() => setShowEditLocation(true)} className="text-primary text-xs font-bold px-2">修改</button>
                 )}
              </div>
           </div>

           {/* Lifestyle Tags */}
           <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">生活方式画像</label>
              <div className="flex flex-wrap gap-2">
                 {preferences.lifestyleTags.length > 0 ? preferences.lifestyleTags.map(tag => (
                    <button 
                        key={tag}
                        onClick={() => handleUpdateTag(tag)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
                    >
                        {tag} <Icon name="close" size={12} />
                    </button>
                 )) : (
                    <span className="text-xs text-slate-400 italic">暂无标签，AI 正在学习您的偏好...</span>
                 )}
                 <button 
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-400 border border-dashed border-slate-300 flex items-center gap-1 active:bg-slate-100"
                 >
                    <Icon name="add" size={12} /> 添加
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Personal Info Settings */}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-2 mb-3 px-1">
           <Icon name="person" className="text-slate-700" size={20} />
           <h2 className="text-lg font-bold text-slate-900 dark:text-white">个人信息</h2>
        </div>
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl px-5 py-2 shadow-sm border border-slate-100 dark:border-slate-800">
           <InfoRow 
                label="实名认证" 
                icon="badge"
                value={
                    authStatus === 'VERIFIED' ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">
                            <Icon name="verified" size={12} /> 已认证
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-slate-400 text-xs font-normal">
                             未认证
                        </span>
                    )
                } 
                onClick={() => setShowAuthModal(true)}
                action={true}
           />
           <InfoRow label="所在城市" value={userInfo.city} icon="location_city" />
           <InfoRow label="常驻区域" value={userInfo.location} icon="my_location" />
           <InfoRow label="任职公司" value={userInfo.company} icon="business" />
        </div>
      </div>

      {/* Modals for Editing (Rendered conditionally but defined externally) */}
      <AnimatePresence>
         {showDimensionTuner && (
            <DimensionTunerModal 
                preferences={preferences} 
                onUpdateDimension={handleUpdateDimension} 
                onClose={() => setShowDimensionTuner(false)}
            />
         )}
         {showBudgetEdit && (
            <BudgetEditModal 
                currentRange={preferences.budgetRange}
                onSave={handleUpdateBudget}
                onClose={() => setShowBudgetEdit(false)}
            />
         )}
         {showAuthModal && (
            <AuthModal 
               onVerify={() => setAuthStatus('VERIFIED')}
               onClose={() => setShowAuthModal(false)}
            />
         )}
      </AnimatePresence>
    </div>
  );
};
