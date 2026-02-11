import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/Icon';
import { BillItem } from '../types';

interface BillDetailsScreenProps {
   bill: BillItem;
   onBack: () => void;
   onPayBill: (id: string) => void;
}

export const BillDetailsScreen: React.FC<BillDetailsScreenProps> = ({ bill, onBack, onPayBill }) => {
   const [showPayment, setShowPayment] = useState(false);

   const PaymentModal = () => {
      const [loading, setLoading] = useState(false);
      const [success, setSuccess] = useState(false);

      const handlePayConfirm = () => {
         setLoading(true);
         setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            onPayBill(bill.id);
            setTimeout(() => {
               setShowPayment(false);
               onBack();
            }, 1500);
         }, 2000);
      };

      if (success) {
         return (
            <div className="fixed inset-0 z-[120] bg-white flex flex-col items-center justify-center">
               <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-indigo-100">
                     <Icon name="check" className="text-white" size={48} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">支付成功</h2>
                  <p className="text-slate-400 font-bold mt-2">电子账单已自动核销</p>
               </motion.div>
            </div>
         );
      }

      return (
         <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className="fixed inset-0 z-[110] bg-[#f8fafc] flex flex-col"
         >
            <div className="bg-white/80 backdrop-blur-xl p-4 pt-safe-top flex items-center justify-between border-b border-slate-100">
               <button onClick={() => setShowPayment(false)} className="w-10 h-10 rounded-full flex items-center justify-center">
                  <Icon name="close" />
               </button>
               <h2 className="font-black text-xl text-slate-900">收银台</h2>
               <div className="w-10" />
            </div>
            <div className="flex-1 p-8 flex flex-col items-center justify-center">
               <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Final Amount Duo</p>
               <div className="flex items-baseline justify-center gap-1 text-slate-900 mb-12">
                  <span className="text-3xl font-black">¥</span>
                  <span className="text-7xl font-black tracking-tighter">{bill.amount.replace('¥ ', '')}</span>
               </div>

               <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-50 space-y-4 mb-12">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                     <span>Payment Method</span>
                     <span className="text-slate-900">Wallet / Balance</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                     <span>Transaction Security</span>
                     <span className="text-emerald-500 flex items-center gap-1"><Icon name="verified_user" size={14} /> Encrypted</span>
                  </div>
               </div>

               <button
                  onClick={handlePayConfirm}
                  disabled={loading}
                  className="w-full h-16 bg-slate-900 text-white font-black text-lg rounded-2xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
               >
                  {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : '立即确认支付'}
               </button>
            </div>
         </motion.div>
      );
   };

   return (
      <div className="flex flex-col h-[100dvh] bg-[#f8fafc]">
         <header className="bg-white/80 backdrop-blur-xl px-6 py-4 pt-safe-top flex items-center justify-between border-b border-slate-100">
            <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-all active:scale-90">
               <Icon name="arrow_back" className="text-slate-900" size={24} />
            </button>
            <h1 className="font-black text-xl text-slate-900">电子账单明细</h1>
            <div className="w-10" />
         </header>

         <div className="flex-1 overflow-y-auto px-6 py-10 space-y-10">
            <div className="flex flex-col items-center relative">
               <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center mb-6 shadow-2xl rotate-3 ${bill.status === 'PAID' ? 'bg-slate-100 text-slate-300' : 'bg-indigo-600 text-white shadow-indigo-100'
                  }`}>
                  <Icon name="receipt_long" size={32} />
               </div>

               <div className="text-center space-y-1">
                  <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{bill.title}</h2>
                  <div className="flex items-baseline justify-center gap-0.5 text-slate-900">
                     <span className="text-2xl font-black">¥</span>
                     <span className="text-5xl font-black tracking-tighter">{bill.amount.replace('¥ ', '')}</span>
                  </div>
               </div>

               <div className="mt-6">
                  {bill.status === 'PAID' ? (
                     <div className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <Icon name="verified" size={14} />
                        <span>Completed</span>
                     </div>
                  ) : (
                     <div className="flex items-center gap-1.5 px-4 py-1.5 bg-red-50 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <Icon name="pending_actions" size={14} />
                        <span>Outstanding</span>
                     </div>
                  )}
               </div>

               {/* Receipt Edge Decor */}
               <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                  <Icon name="watermark" size={120} />
               </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-slate-50 px-4 py-1 rounded-bl-2xl text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">
                  Financial Statement
               </div>

               <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Cost Breakdown</h3>
                  <div className="space-y-6">
                     <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500">基础租金 / Base Rent</span>
                        <span className="text-sm font-black text-slate-900">¥{bill.details.rent}</span>
                     </div>

                     {bill.details.deposit && (
                        <div className="flex justify-between items-center group">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                 <Icon name="shield" size={16} />
                              </div>
                              <div>
                                 <span className="text-xs font-bold text-slate-600 block">房屋押金 / Security Deposit</span>
                                 <span className="text-[9px] text-orange-600 font-black uppercase tracking-widest">Fully Refundable</span>
                              </div>
                           </div>
                           <span className="text-sm font-black text-slate-900">¥{bill.details.deposit}</span>
                        </div>
                     )}

                     <div className="h-px bg-slate-50 w-full" />

                     <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Total Duo</span>
                        <span className="text-xl font-black text-slate-900 font-display">{bill.amount}</span>
                     </div>
                  </div>
               </div>

               <div className="pt-4 border-t border-dashed border-slate-100">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Meta Data</h3>
                  <div className="grid grid-cols-1 gap-4">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Properties</span>
                        <span className="text-[10px] font-black text-slate-900 text-right uppercase">{bill.contractTitle}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Cycle Range</span>
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{bill.billingCycle}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Issued Date</span>
                        <span className="text-[10px] font-black text-slate-900 uppercase">{bill.date}</span>
                     </div>
                     <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Invoice ID</span>
                        <span className="text-[10px] font-mono font-black text-indigo-600">INV-2024-{(Math.random() * 10000).toFixed(0)}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Bottom Action Bar */}
         <div className="p-8 bg-white border-t border-slate-100 pb-safe-bottom">
            {bill.status === 'PENDING' ? (
               <button
                  onClick={() => setShowPayment(true)}
                  className="w-full h-16 bg-slate-900 text-white rounded-2xl text-lg font-black shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
               >
                  <Icon name="bolt" size={24} />
                  立即支付账单推送
               </button>
            ) : (
               <div className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center gap-2 opacity-60">
                  <Icon name="check" size={20} className="text-slate-400" />
                  <span className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Settled</span>
               </div>
            )}
         </div>

         <AnimatePresence>
            {showPayment && <PaymentModal />}
         </AnimatePresence>
      </div>
   );
};