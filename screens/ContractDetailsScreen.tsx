import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/Icon';
import { ContractItem } from '../types';

interface ContractDetailsScreenProps {
  contract: ContractItem;
  onBack: () => void;
}

export const ContractDetailsScreen: React.FC<ContractDetailsScreenProps> = ({ contract, onBack }) => {
  const [showDepositModal, setShowDepositModal] = useState(false);

  const DepositModal = ({ onClose }: { onClose: () => void }) => {
     const [step, setStep] = useState<'VIEW' | 'REFUND_CONFIRM' | 'SUCCESS'>('VIEW');
     const [loading, setLoading] = useState(false);

     const handleRefund = () => {
        setLoading(true);
        setTimeout(() => {
           setLoading(false);
           setStep('SUCCESS');
        }, 2000);
     };

     if (step === 'SUCCESS') {
        return (
            <div className="fixed inset-0 z-[70] bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <Icon name="check_circle" className="text-green-500 text-6xl" />
                </motion.div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">申请提交成功</h2>
                <p className="text-slate-500 mb-8">押金 ¥{contract.deposit} 将在 1-3 个工作日内<br/>原路退回至您的支付账户</p>
                <button onClick={onClose} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl">
                    完成
                </button>
            </div>
        );
     }

     return (
        <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className="fixed inset-0 z-[60] bg-[#f8fafc] dark:bg-slate-900 flex flex-col"
        >
            <div className="bg-white dark:bg-slate-800 p-4 shadow-sm relative">
                <button onClick={onClose} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 -ml-2"><Icon name="close" /></button>
                <h2 className="text-center font-bold text-lg">押金管理</h2>
            </div>
            
            <div className="flex-1 p-5 overflow-y-auto">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm text-center mb-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                    <p className="text-sm text-slate-500 mb-2">当前托管押金</p>
                    <div className="flex items-baseline justify-center gap-1 text-slate-900 dark:text-white">
                        <span className="text-2xl font-bold">¥</span>
                        <span className="text-5xl font-bold font-display tracking-tight">{contract.deposit}</span>
                    </div>
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mt-4 ${
                        contract.depositStatus === 'HOSTED' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                    }`}>
                        <Icon name={contract.depositStatus === 'HOSTED' ? 'lock' : 'check'} size={14} />
                        {contract.depositStatus === 'HOSTED' ? '平台安全托管中' : '已退还'}
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">资金流转记录</h3>
                        <div className="relative pl-4 space-y-6 before:content-[''] before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-700">
                             <div className="relative">
                                <div className="absolute -left-[15px] top-1 w-3 h-3 rounded-full bg-slate-200 border-2 border-white dark:border-slate-800"></div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">合约结束 & 验房</p>
                                        <p className="text-xs text-slate-400 mt-0.5">预计 {contract.endDate}</p>
                                    </div>
                                    <span className="text-xs font-bold text-slate-300">待完成</span>
                                </div>
                             </div>
                             <div className="relative">
                                <div className="absolute -left-[15px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-slate-800 shadow-sm shadow-blue-200"></div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">托管中</p>
                                        <p className="text-xs text-slate-400 mt-0.5">冻结至合约结束</p>
                                    </div>
                                    <span className="text-xs font-bold text-blue-500">进行中</span>
                                </div>
                             </div>
                             <div className="relative">
                                <div className="absolute -left-[15px] top-1 w-3 h-3 rounded-full bg-slate-200 border-2 border-white dark:border-slate-800"></div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">押金支付成功</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{contract.signDate}</p>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">已完成</span>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 pb-safe-bottom">
                 {contract.status === 'ACTIVE' ? (
                     <button disabled className="w-full bg-slate-100 text-slate-400 font-bold py-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                        <Icon name="lock_clock" /> 合约期内不可提取
                     </button>
                 ) : contract.depositStatus === 'REFUNDED' ? (
                     <button disabled className="w-full bg-green-50 text-green-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                        <Icon name="check" /> 已完成退款
                     </button>
                 ) : (
                     <button 
                        onClick={handleRefund}
                        disabled={loading}
                        className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                     >
                        {loading ? '处理中...' : '申请退还押金'}
                     </button>
                 )}
            </div>
        </motion.div>
     );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#101010]">
      {/* Header */}
      <div className="px-4 py-3 pt-safe-top flex items-center gap-2 bg-white dark:bg-[#1a1a1a] sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-50 dark:hover:bg-[#202020]">
           <Icon name="arrow_back" className="text-slate-900 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-slate-900 dark:text-white">合同详情</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
         {/* Property Card */}
         <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 shadow-sm">
             <div className="flex gap-4">
                 <div className="w-20 h-20 bg-slate-100 rounded-lg shrink-0">
                    {/* Placeholder image */}
                    <Icon name="apartment" className="w-full h-full flex items-center justify-center text-slate-300" size={32} />
                 </div>
                 <div>
                    <h2 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 mb-1">{contract.title}</h2>
                    <p className="text-xs text-slate-500 mb-2">{contract.propertyAddress}</p>
                    <div className="inline-block px-2 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-bold">
                        {contract.status === 'ACTIVE' ? '履约中' : '已到期'}
                    </div>
                 </div>
             </div>
         </div>

         {/* Deposit Action Card */}
         <div 
            onClick={() => setShowDepositModal(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 shadow-lg shadow-blue-200 text-white flex justify-between items-center cursor-pointer active:scale-[0.98] transition-transform"
         >
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                   <Icon name="savings" size={20} />
                </div>
                <div>
                   <p className="text-xs font-medium opacity-80">押金管理</p>
                   <p className="text-lg font-bold">¥{contract.deposit}</p>
                </div>
             </div>
             <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold border border-white/20">
                {contract.depositStatus === 'HOSTED' ? '托管中' : '已退还'}
                <Icon name="chevron_right" size={14} />
             </div>
         </div>

         {/* Info Grid */}
         <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 shadow-sm space-y-4">
             <div className="flex justify-between items-center py-2 border-b border-slate-50">
                 <span className="text-sm text-slate-500">合同编号</span>
                 <span className="text-sm font-medium text-slate-900 dark:text-white font-mono">{contract.id.toUpperCase()}</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-slate-50">
                 <span className="text-sm text-slate-500">租期开始</span>
                 <span className="text-sm font-medium text-slate-900 dark:text-white">{contract.startDate}</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-slate-50">
                 <span className="text-sm text-slate-500">租期结束</span>
                 <span className="text-sm font-medium text-slate-900 dark:text-white">{contract.endDate}</span>
             </div>
             
             {/* New Fields Added Here */}
             <div className="flex justify-between items-center py-2 border-b border-slate-50">
                 <span className="text-sm text-slate-500">付款方式</span>
                 <span className="text-sm font-bold text-slate-900 dark:text-white">{contract.paymentTerms}</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-slate-50">
                 <span className="text-sm text-slate-500">每月交租日</span>
                 <span className="text-sm font-bold text-slate-900 dark:text-white">每月 {contract.paymentDay} 号</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-slate-50">
                 <span className="text-sm text-slate-500">逾期违约金</span>
                 <span className="text-sm font-bold text-red-500">{contract.lateFeePolicy}</span>
             </div>

             <div className="flex justify-between items-center py-2 border-b border-slate-50">
                 <span className="text-sm text-slate-500">月租金</span>
                 <span className="text-sm font-bold text-slate-900 dark:text-white">¥{contract.rentAmount}</span>
             </div>
             <div className="flex justify-between items-center py-2">
                 <span className="text-sm text-slate-500">签约日期</span>
                 <span className="text-sm font-medium text-slate-900 dark:text-white">{contract.signDate}</span>
             </div>
         </div>

         {/* Actions */}
         <div className="grid grid-cols-2 gap-3">
             <button className="bg-white dark:bg-[#1a1a1a] py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-white shadow-sm flex items-center justify-center gap-2">
                 <Icon name="picture_as_pdf" size={18} className="text-red-500" /> 下载合同
             </button>
             <button className="bg-white dark:bg-[#1a1a1a] py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-white shadow-sm flex items-center justify-center gap-2">
                 <Icon name="support_agent" size={18} className="text-blue-500" /> 联系管家
             </button>
         </div>
      </div>

      <AnimatePresence>
        {showDepositModal && (
            <DepositModal onClose={() => setShowDepositModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};