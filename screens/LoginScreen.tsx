import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../components/Icon';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onGuestMode: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onGuestMode }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleLogin = () => {
    if (!isChecked) {
      // In a real app, use a toast. Here standard alert for simplicity.
      alert('请先阅读并同意用户协议');
      return;
    }
    // Simulate loading
    setTimeout(onLoginSuccess, 500);
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden font-sans text-slate-900">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center px-5 pt-safe-top py-4 z-10">
        <button 
          onClick={onGuestMode}
          className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          先去逛逛
        </button>
        <button className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
          帮助
        </button>
      </div>

      {/* Logo Area (Hidden/Subtle Treatment) */}
      <div className="flex flex-col items-center mt-24 mb-12">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
           <Icon name="smart_toy" size={24} className="text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display mb-1">
          欢迎回来
        </h1>
        <p className="text-xs text-slate-400 mt-1">登录以继续使用智能服务</p>
      </div>

      {/* Phone Number Display */}
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-center gap-3 mb-2">
           <span className="text-[28px] font-bold text-slate-900 tracking-wide font-display">181****0809</span>
           <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium">更换</span>
        </div>
        <span className="text-xs text-slate-400">中国电信提供认证服务</span>
      </div>

      {/* Action Buttons */}
      <div className="w-full px-6 space-y-4">
        {/* Primary Button */}
        <button 
          onClick={handleLogin}
          className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-bold h-12 rounded-full text-[15px] shadow-[0_4px_14px_rgba(59,130,246,0.3)] active:scale-[0.98] transition-all flex items-center justify-center"
        >
          手机号一键登录
        </button>

        {/* WeChat */}
        <button className="w-full bg-white hover:bg-slate-50 text-slate-900 font-bold h-12 rounded-full text-[15px] border border-slate-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
           <Icon name="chat" className="text-[#07c160]" size={20} />
           微信登录
        </button>

        {/* Apple */}
        <button className="w-full bg-white hover:bg-slate-50 text-slate-900 font-bold h-12 rounded-full text-[15px] border border-slate-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
           {/* Fallback icon for Apple if specific one not available in font */}
           <Icon name="phone_iphone" className="text-slate-900" size={20} />
           Apple 登录
        </button>

        {/* Password */}
        <button className="w-full bg-white hover:bg-slate-50 text-slate-900 font-bold h-12 rounded-full text-[15px] border border-slate-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
           <Icon name="lock" className="text-slate-900" size={20} />
           密码登录
        </button>
      </div>

      {/* Footer Agreement */}
      <div className="mt-auto pb-safe-bottom mb-8 px-6">
        <div className="flex items-start justify-center gap-2">
           <button 
             onClick={() => setIsChecked(!isChecked)}
             className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ${isChecked ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-slate-300'}`}
           >
             {isChecked && <Icon name="check" size={12} className="text-white font-bold" />}
           </button>
           <p className="text-xs text-slate-400 leading-tight">
             我已阅读并同意 <span className="text-slate-900 font-bold">用户协议</span> 与 <span className="text-slate-900 font-bold">隐私政策</span>，以及中国电信认证服务条款
           </p>
        </div>
      </div>

    </div>
  );
};