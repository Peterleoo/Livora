import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/Icon';
import { BillDetails } from '../types';

interface BillItem {
  id: string;
  month: string;
  title: string;
  date: string;
  amount: string;
  status: 'PAID' | 'PENDING';
  contractTitle: string;
  billingCycle: string;
  details: BillDetails;
}

interface ContractItem {
  id: string;
  title: string;
  propertyTitle: string;
  propertyAddress: string;
  status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  startDate: string;
  endDate: string;
  rentAmount: string;
  deposit: string;
  depositStatus: 'HOSTED' | 'REFUNDING' | 'REFUNDED';
  signDate: string;
  landlord: string;
  tenant: string;
  timeline: { date: string; event: string; icon: string }[];
}

const HISTORY_BILLS: BillItem[] = [
  { 
    id: 'b1', 
    month: '9月', 
    title: '9月租金及押金', 
    date: '2023-09-02 14:30', 
    amount: '¥ 9,000.00', 
    status: 'PAID',
    contractTitle: '华润城万象天地 3栋 1802室',
    billingCycle: '2023.09.01 - 2023.09.30',
    details: { rent: '4,500.00', deposit: '4,500.00', total: '9,000.00' }
  },
  { 
    id: 'b2', 
    month: '8月', 
    title: '8月租金', 
    date: '2023-08-01 09:15', 
    amount: '¥ 4,500.00', 
    status: 'PAID',
    contractTitle: '华润城万象天地 3栋 1802室',
    billingCycle: '2023.08.01 - 2023.08.31',
    details: { rent: '4,500.00', total: '4,500.00' }
  },
];

const HISTORY_CONTRACTS: ContractItem[] = [
  {
    id: 'c2023',
    title: '2023-2024 房屋租赁合同',
    propertyTitle: '华润城润府 3期 2栋 304室',
    propertyAddress: '深圳市南山区科技园',
    status: 'ACTIVE',
    startDate: '2023.11.01',
    endDate: '2024.10.31',
    rentAmount: '4,500',
    deposit: '4,500.00',
    depositStatus: 'HOSTED',
    signDate: '2023.10.25',
    landlord: '管家小李',
    tenant: 'Peterleo',
    timeline: [
      { date: '2023.10.25', event: '合同签署成功', icon: 'draw' },
      { date: '2023.11.01', event: '租期开始', icon: 'check_circle' },
    ]
  },
  {
    id: 'c2022',
    title: '2022-2023 房屋租赁合同',
    propertyTitle: '华润城万象天地 3栋 1802室',
    propertyAddress: '深圳市南山区科技园北区',
    status: 'EXPIRED',
    startDate: '2022.10.31',
    endDate: '2023.10.30',
    rentAmount: '5,000',
    deposit: '5,000.00',
    depositStatus: 'REFUNDED',
    signDate: '2022.10.25',
    landlord: '管家小李',
    tenant: 'Peterleo',
    timeline: [
      { date: '2023.10.30', event: '合同自然到期', icon: 'event_busy' },
      { date: '2023.11.02', event: '押金已退还', icon: 'price_check' },
    ]
  },
];

interface ManagementScreenProps {
  onBack: () => void;
  initialTab?: 'BILLS' | 'CONTRACTS';
}

export const ManagementScreen: React.FC<ManagementScreenProps> = ({ onBack, initialTab = 'BILLS' }) => {
  const [activeTab, setActiveTab] = useState<'BILLS' | 'CONTRACTS'>(initialTab);
  // Controls the main bill card status
  const [billStatus, setBillStatus] = useState<'PENDING' | 'PAID'>('PENDING');
  // Controls Modals
  const [showPayment, setShowPayment] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedContractDeposit, setSelectedContractDeposit] = useState<ContractItem | null>(null);
  
  const [viewingBill, setViewingBill] = useState<BillItem | null>(null);
  const [viewingContract, setViewingContract] = useState<ContractItem | null>(null);

  // Mock Data for the Pending Bill (Now strictly Rent + Optional Deposit)
  const pendingBillDetails = {
      total: '4,500.00', // Just rent for this pending bill example
      rent: '4,500.00',
      deposit: undefined // Or '4,500.00' if first month
  };

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // --- Components ---

  const DepositModal = ({ contract, onClose }: { contract: ContractItem, onClose: () => void }) => {
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

  const PaymentModal = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'WECHAT' | 'ALIPAY'>('WECHAT');

    const handlePayConfirm = () => {
       setLoading(true);
       setTimeout(() => {
          setLoading(false);
          setSuccess(true);
          setTimeout(() => {
             setBillStatus('PAID');
             setShowPayment(false);
          }, 1500);
       }, 2000);
    };

    if (success) {
      return (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-slate-900 flex flex-col items-center justify-center">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-200">
                   <Icon name="check" className="text-white" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">支付成功</h2>
                <p className="text-slate-500 mt-2">账单已更新</p>
            </motion.div>
        </div>
      );
    }

    return (
       <motion.div 
         initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
         className="fixed inset-0 z-[60] bg-[#f8fafc] dark:bg-slate-900 flex flex-col"
       >
          <div className="bg-white dark:bg-slate-800 p-4 shadow-sm z-10 text-center relative">
              <button onClick={() => setShowPayment(false)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 -ml-2 text-slate-400">
                 <Icon name="close" />
              </button>
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">收银台</h2>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm text-center">
                  <p className="text-sm text-slate-500 mb-2">本次支付金额 (含押金)</p>
                  <div className="flex items-baseline justify-center gap-1 text-slate-900 dark:text-white">
                      <span className="text-2xl font-bold">¥</span>
                      <span className="text-5xl font-bold font-display tracking-tight">{pendingBillDetails.total}</span>
                  </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  <button 
                     onClick={() => setPaymentMethod('WECHAT')}
                     className="w-full flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-700 active:bg-slate-50 transition-colors"
                  >
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-[#07c160] flex items-center justify-center text-white"><Icon name="chat" size={20} /></div>
                          <span className="font-bold text-slate-900 dark:text-white">微信支付</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'WECHAT' ? 'border-[#07c160] bg-[#07c160]' : 'border-slate-300'}`}>
                          {paymentMethod === 'WECHAT' && <Icon name="check" size={14} className="text-white" />}
                      </div>
                  </button>
                  <button 
                     onClick={() => setPaymentMethod('ALIPAY')}
                     className="w-full flex items-center justify-between p-4 active:bg-slate-50 transition-colors"
                  >
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1677ff] flex items-center justify-center text-white"><Icon name="account_balance_wallet" size={20} /></div>
                          <span className="font-bold text-slate-900 dark:text-white">支付宝</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'ALIPAY' ? 'border-[#1677ff] bg-[#1677ff]' : 'border-slate-300'}`}>
                          {paymentMethod === 'ALIPAY' && <Icon name="check" size={14} className="text-white" />}
                      </div>
                  </button>
              </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 pb-safe-bottom">
              <button 
                 onClick={handlePayConfirm}
                 disabled={loading}
                 className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                 {loading ? '安全支付中...' : `确认支付 ¥${pendingBillDetails.total}`}
              </button>
          </div>
       </motion.div>
    );
  };

  const renderBills = () => (
    <div className="space-y-6">
      {/* Dynamic Bill Card */}
      <div className={`transition-all duration-500 rounded-[32px] p-6 relative overflow-hidden ${
          billStatus === 'PAID' ? 'bg-slate-50 border border-slate-200' : 'bg-[#e0fadd]'
      }`}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${billStatus === 'PAID' ? 'bg-slate-300' : 'bg-[#ff4d4f]'}`}></div>
            <span className={`font-bold text-base ${billStatus === 'PAID' ? 'text-slate-400' : 'text-slate-900'}`}>
                {billStatus === 'PAID' ? '本月已结清' : '本月待缴'}
            </span>
          </div>
          <div className="bg-white/60 backdrop-blur px-3 py-1.5 rounded-lg border border-white/20 text-xs font-bold text-slate-600 shadow-sm">
            截止: 11-05
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-baseline text-slate-900 leading-none">
            <span className="text-3xl font-bold mr-1">¥</span>
            <span className="text-[64px] font-display font-bold tracking-tighter">
                {billStatus === 'PAID' ? '0' : pendingBillDetails.total.split('.')[0]}
            </span>
            <span className="text-3xl font-bold">.{pendingBillDetails.total.split('.')[1]}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-slate-500 text-xs font-medium">
              <Icon name="info" size={14} className="opacity-70" />
              <span>{pendingBillDetails.deposit ? '包含本月租金及房屋押金' : '包含本月租金'}</span>
          </div>
        </div>

        {/* Detailed Breakdown Grid - Simplified */}
        <div className={`grid ${billStatus === 'PENDING' ? 'grid-cols-2 gap-y-6 gap-x-4' : 'grid-cols-2 gap-6'} mb-8 px-1`}>
            {/* Rent */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
                    <Icon name="home" size={18} />
                    <span className="text-xs font-bold">租金</span>
                </div>
                <span className="font-bold text-slate-900 text-xl tracking-tight">¥{pendingBillDetails.rent}</span>
            </div>
            
            {/* Deposit - Only shown if it exists */}
            {billStatus === 'PENDING' && pendingBillDetails.deposit && (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
                        <Icon name="savings" size={18} className="text-orange-500" />
                        <span className="text-xs font-bold text-orange-600">押金 (可退)</span>
                    </div>
                    <span className="font-bold text-slate-900 text-xl tracking-tight">¥{pendingBillDetails.deposit}</span>
                </div>
            )}
        </div>

        <button 
          onClick={() => { if (billStatus === 'PENDING') setShowPayment(true); }}
          disabled={billStatus === 'PAID'}
          className={`w-full h-14 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all shadow-sm ${
             billStatus === 'PAID' 
             ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
             : 'bg-white text-slate-900 hover:bg-slate-50 active:scale-[0.98]'
          }`}
        >
          {billStatus === 'PAID' ? '暂无待缴账单' : <>立即支付 ¥{pendingBillDetails.total} <Icon name="arrow_forward" size={20} /></>}
        </button>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 opacity-60 font-medium">
            <Icon name="lock" size={12} />
            <span>AI风控守护您的资金安全</span>
        </div>
      </div>

      {/* History List */}
      <div>
        <div className="flex justify-between items-center px-1 mb-4 mt-8">
            <h3 className="text-lg font-bold text-slate-900">历史账单</h3>
            <button className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                2023年 <Icon name="expand_more" size={16} />
            </button>
        </div>
        <div className="space-y-3">
          {HISTORY_BILLS.map((item) => (
            <button key={item.id} onClick={() => setViewingBill(item)} className="w-full bg-white rounded-[24px] p-5 flex items-center justify-between shadow-sm border border-slate-100 active:bg-slate-50 transition-colors">
               <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-sm font-bold text-slate-600 border border-slate-100">
                   {item.month}
                 </div>
                 <div className="text-left">
                   <h4 className="font-bold text-slate-900 text-[15px]">{item.title}</h4>
                   <p className="text-xs text-slate-400 mt-1">支付于 {item.date}</p>
                 </div>
               </div>
               <div className="text-right">
                  <p className="font-bold text-slate-900 text-lg mb-1">- {item.amount}</p>
                  <div className="inline-flex items-center gap-1 bg-[#dcfce7] text-[#16a34a] px-2 py-0.5 rounded text-[10px] font-bold">
                    <Icon name="check_circle" size={12} /> 已支付
                  </div>
               </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContracts = () => (
     <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 px-1">我的合同</h3>
        {HISTORY_CONTRACTS.map((item, i) => (
             <div key={i} className="w-full bg-white rounded-2xl p-5 shadow-sm border border-slate-50">
                <div className="flex justify-between items-start mb-4" onClick={() => setViewingContract(item)}>
                    <div>
                        <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{item.propertyTitle}</p>
                    </div>
                    <div className={`px-2 py-1 text-[10px] font-bold rounded ${
                        item.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                        {item.status === 'ACTIVE' ? '履约中' : '已到期'}
                    </div>
                </div>

                {/* Deposit Row (Clickable) */}
                <button 
                    onClick={() => {
                        setSelectedContractDeposit(item);
                        setShowDepositModal(true);
                    }}
                    className="w-full flex items-center justify-between bg-slate-50 rounded-xl p-3 active:bg-slate-100 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-orange-500 shadow-sm">
                            <Icon name="savings" size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-slate-500">押金金额</p>
                            <p className="text-sm font-bold text-slate-900">¥{item.deposit}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${item.depositStatus === 'HOSTED' ? 'text-blue-500' : 'text-green-500'}`}>
                            {item.depositStatus === 'HOSTED' ? '托管中' : '已退还'}
                        </span>
                        <Icon name="chevron_right" size={16} className="text-slate-300" />
                    </div>
                </button>

                <div className="mt-4 flex gap-2">
                    <button onClick={() => setViewingContract(item)} className="flex-1 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">查看详情</button>
                    <button className="flex-1 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">下载 PDF</button>
                </div>
             </div>
        ))}
     </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#101010]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#f8fafc]/90 dark:bg-[#101010]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3 pt-safe-top flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-[#202020]">
             <Icon name="arrow_back_ios" className="text-slate-900 dark:text-white" size={20} />
          </button>
          <div className="font-bold text-lg text-slate-900 dark:text-white">账单与合同</div>
          <button className="p-2 -mr-2 rounded-full hover:bg-slate-200 dark:hover:bg-[#202020]">
             <Icon name="more_horiz" className="text-slate-900 dark:text-white" />
          </button>
        </div>
        
        <div className="flex gap-12 px-10 pt-2 justify-center">
            <button onClick={() => setActiveTab('BILLS')} className={`pb-2 text-sm font-bold relative transition-colors ${activeTab === 'BILLS' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
              账单管理
              {activeTab === 'BILLS' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#07c160] rounded-full" />}
            </button>
            <button onClick={() => setActiveTab('CONTRACTS')} className={`pb-2 text-sm font-bold relative transition-colors ${activeTab === 'CONTRACTS' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
              合同协议
              {activeTab === 'CONTRACTS' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#07c160] rounded-full" />}
            </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {activeTab === 'BILLS' ? renderBills() : renderContracts()}
      </div>
      
      {/* Detail Modals */}
      <AnimatePresence>
        {viewingBill && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-50 bg-white dark:bg-slate-900">
             <div className="p-4 pt-safe-top border-b dark:border-slate-800 flex items-center gap-2">
               <button onClick={() => setViewingBill(null)}><Icon name="arrow_back" /></button>
               <h2 className="font-bold dark:text-white">账单详情</h2>
             </div>
             <div className="p-6">
                <h1 className="text-3xl font-bold dark:text-white">{viewingBill.amount}</h1>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPayment && <PaymentModal />}
      </AnimatePresence>

      <AnimatePresence>
        {showDepositModal && selectedContractDeposit && (
            <DepositModal contract={selectedContractDeposit} onClose={() => setShowDepositModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};