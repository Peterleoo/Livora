import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/Icon';
import { ContractItem } from '../types';

interface TenantHomeScreenProps {
   onSwitchToSeeker: () => void;
   onNavigate: (screen: any) => void;
   pendingBillCount?: number;
   onOpenMenu: () => void;
   onSaveSession: (messages: any[]) => void;
}

export const TenantHomeScreen: React.FC<TenantHomeScreenProps> = ({ onSwitchToSeeker, onNavigate, pendingBillCount = 0, onOpenMenu, onSaveSession }) => {
   const [doorState, setDoorState] = useState<'LOCKED' | 'UNLOCKING' | 'UNLOCKED'>('LOCKED');

   // Mock Contract for the current rented house
   const currentContract: ContractItem = {
      id: 'c2023',
      title: '华润城润府 3期 · 现代轻奢',
      propertyTitle: '2栋 A座 304室',
      propertyAddress: '深圳市南山区科技园',
      status: 'ACTIVE',
      startDate: '2023.11.01',
      endDate: '2024.10.31',
      rentAmount: '8,500',
      deposit: '8,500.00',
      depositStatus: 'HOSTED',
      signDate: '2023.10.25',
      landlord: '管家小李',
      tenant: 'Peterleo',
      paymentTerms: '押一付一',
      paymentDay: 5,
      lateFeePolicy: '日租金 0.1% / 天',
      timeline: []
   };

   const handleOpenDoor = () => {
      if (doorState !== 'LOCKED') return;
      setDoorState('UNLOCKING');
      setTimeout(() => {
         setDoorState('UNLOCKED');
         // Auto lock after 3 seconds
         setTimeout(() => {
            setDoorState('LOCKED');
         }, 3000);
      }, 1500);
   };

   return (
      <div className="flex flex-col h-full bg-[#f4f6f8] dark:bg-[#000] relative">
         {/* Background Decor */}
         <div className="absolute top-0 left-0 right-0 h-72 bg-emerald-600 dark:bg-emerald-900 rounded-b-[40px] z-0"></div>

         {/* Header */}
         <header className="px-5 pt-safe-top pb-6 flex justify-between items-center z-10 text-white">
            <div className="flex items-center gap-3">
               <button
                  onClick={onOpenMenu}
                  className="w-10 h-10 rounded-full border-2 border-emerald-400/30 p-[2px] transition-transform active:scale-95"
               >
                  <img
                     src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80"
                     className="w-full h-full rounded-full object-cover"
                     alt="Profile"
                  />
               </button>
               <div onClick={() => onNavigate('PROFILE')}>
                  <h1 className="text-xl font-bold font-display tracking-tight">我的家</h1>
                  <p className="text-emerald-100 text-xs opacity-80">智寓 · 租客服务中心</p>
               </div>
            </div>
            <div className="flex gap-3">
               <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-colors">
                  <Icon name="notifications" className="text-white" size={20} />
               </button>
               <button
                  onClick={() => onNavigate('SETTINGS')}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-colors"
               >
                  <Icon name="settings" className="text-white" size={20} />
               </button>
            </div>
         </header>

         {/* Pending Bill Notification */}
         {pendingBillCount > 0 && (
            <div
               onClick={() => onNavigate('BILLS')}
               className="mx-5 -mt-3 mb-4 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-lg relative z-20 cursor-pointer animate-pulse"
            >
               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                     <Icon name="priority_high" size={16} className="text-red-500" />
                  </div>
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">您有 {pendingBillCount} 笔账单待支付</span>
               </div>
               <Icon name="chevron_right" size={16} className="text-red-400" />
            </div>
         )}

         {/* Main Content */}
         <div className="flex-1 overflow-y-auto px-5 z-10 pb-safe-bottom no-scrollbar min-h-0">

            {/* 1. Renting Card */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-5 shadow-xl shadow-emerald-900/10 mb-6 relative overflow-hidden">
               <div className="flex items-start justify-between mb-4">
                  <div>
                     <div className="flex items-center gap-2 mb-1">
                        <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                           租赁中
                        </span>
                        <span className="text-slate-400 text-[10px]">还有 286 天到期</span>
                     </div>
                     <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                        {currentContract.propertyTitle}
                     </h2>
                     <p className="text-sm text-slate-500 mt-1">{currentContract.propertyAddress}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" />
                  </div>
               </div>

               {/* Door Key Section */}
               <div className="bg-[#f8fafc] dark:bg-[#202020] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden border border-slate-100 dark:border-slate-800">
                  <button
                     onClick={handleOpenDoor}
                     className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 relative z-10 ${doorState === 'UNLOCKED'
                        ? 'bg-green-500 shadow-green-500/40 scale-105'
                        : doorState === 'UNLOCKING'
                           ? 'bg-emerald-600 shadow-emerald-600/40 animate-pulse'
                           : 'bg-white dark:bg-slate-700 shadow-slate-200 dark:shadow-black/50 active:scale-95'
                        }`}
                  >
                     <Icon
                        name={doorState === 'UNLOCKED' ? 'lock_open' : 'lock'}
                        size={36}
                        className={`transition-colors ${doorState === 'UNLOCKED' ? 'text-white' :
                           doorState === 'UNLOCKING' ? 'text-white/80' : 'text-emerald-600 dark:text-emerald-400'
                           }`}
                     />
                     {/* Ripple Effect */}
                     {doorState === 'UNLOCKING' && (
                        <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 animate-ping"></div>
                     )}
                  </button>
                  <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                     {doorState === 'UNLOCKED' ? '门已开启' : doorState === 'UNLOCKING' ? '连接中...' : '点击开门'}
                  </p>
                  <p className="text-[10px] text-slate-300 mt-1">蓝牙连接正常</p>
               </div>
            </div>

            {/* 2. Service Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
               {/* Bill Card */}
               <button
                  onClick={() => onNavigate('BILLS')}
                  className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-800 text-left active:scale-[0.98] transition-transform relative overflow-hidden"
               >
                  <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 mb-3">
                     <Icon name="receipt_long" size={24} />
                  </div>
                  {pendingBillCount > 0 && <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full"></div>}
                  <h3 className="font-bold text-slate-900 dark:text-white">生活缴费</h3>
                  <p className={`text-xs mt-1 ${pendingBillCount > 0 ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
                     {pendingBillCount > 0 ? `${pendingBillCount} 笔待支付` : '暂无待缴'}
                  </p>
               </button>

               {/* Report Card */}
               <button
                  className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-800 text-left active:scale-[0.98] transition-transform"
               >
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 mb-3">
                     <Icon name="build" size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">报事报修</h3>
                  <p className="text-xs text-slate-500 mt-1">设施损坏 / 投诉</p>
               </button>

               {/* Contract Card */}
               <button
                  onClick={() => onNavigate('CONTRACTS')}
                  className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-800 text-left active:scale-[0.98] transition-transform"
               >
                  <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 mb-3">
                     <Icon name="description" size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">租赁合同</h3>
                  <p className="text-xs text-slate-500 mt-1">查看 / 下载 PDF</p>
               </button>

               {/* Butler Service Card */}
               <button
                  className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-800 text-left active:scale-[0.98] transition-transform"
               >
                  <div className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-500 mb-3">
                     <Icon name="support_agent" size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">联系管家</h3>
                  <p className="text-xs text-slate-500 mt-1">专属管家服务</p>
               </button>
            </div>

            {/* 3. Community / Notice */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-800 flex gap-4 items-center mb-6">
               <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                  <Icon name="campaign" size={24} />
               </div>
               <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">社区公告</h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">关于国庆假期期间门禁系统升级维护的通知...</p>
               </div>
               <Icon name="chevron_right" size={16} className="text-slate-300" />
            </div>

            {/* 4. Switch Mode Banner */}
            <div
               onClick={onSwitchToSeeker}
               className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-5 text-white flex justify-between items-center shadow-lg active:scale-[0.99] transition-transform cursor-pointer"
            >
               <div>
                  <h3 className="font-bold text-base">想换个环境？</h3>
                  <p className="text-xs text-slate-400 mt-1">切换至找房模式，探索更多可能</p>
               </div>
               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Icon name="arrow_forward" />
               </div>
            </div>

         </div>
      </div>
   );
};