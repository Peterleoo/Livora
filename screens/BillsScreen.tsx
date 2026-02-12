import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/Icon';
import { BillItem, Property } from '../types';

interface BillsScreenProps {
    onBack: () => void;
    bills: BillItem[];
    properties: Property[];
    onSelectBill: (bill: BillItem) => void;
    onPayBills: (billIds: string[]) => void;
}

export const BillsScreen: React.FC<BillsScreenProps> = ({ onBack, bills, properties, onSelectBill, onPayBills }) => {
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const [selectedBillIds, setSelectedBillIds] = useState<Set<string>>(new Set());

    // State for Modals
    const [showPayment, setShowPayment] = useState(false);
    const [showAutoPaySetup, setShowAutoPaySetup] = useState(false);
    const [showPaymentHistory, setShowPaymentHistory] = useState(false);

    // Derive Signed Properties
    const signedProperties = useMemo(() => {
        return properties.filter(p => p.tags.includes('已签约'));
    }, [properties]);

    const activeProperty = signedProperties.find(p => p.id === selectedPropertyId);

    // Filter bills
    const currentPropertyBills = useMemo(() => {
        if (!activeProperty) return [];
        return bills.filter(b => b.contractTitle === activeProperty.title);
    }, [bills, activeProperty]);

    const pendingBills = currentPropertyBills.filter(b => b.status === 'PENDING');

    const toggleBillSelect = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newSet = new Set(selectedBillIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedBillIds(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedBillIds.size === pendingBills.length && pendingBills.length > 0) {
            setSelectedBillIds(new Set());
        } else {
            setSelectedBillIds(new Set(pendingBills.map(b => b.id)));
        }
    };

    const totalAmountRaw = useMemo(() => {
        let total = 0;
        selectedBillIds.forEach(id => {
            const bill = currentPropertyBills.find(b => b.id === id);
            if (bill) {
                total += parseFloat(bill.amount.replace(/[¥, ]/g, ''));
            }
        });
        return total;
    }, [selectedBillIds, currentPropertyBills]);

    const totalAmountFormatted = totalAmountRaw.toLocaleString('zh-CN', { minimumFractionDigits: 2 });

    // --- REDESIGNED SUB-COMPONENTS ---

    const PaymentHistoryModal = () => (
        <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className="fixed inset-0 z-[100] bg-[#f8fafc] dark:bg-[#000] flex flex-col"
        >
            <div className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-xl p-4 pt-safe-top flex items-center gap-4 border-b border-slate-100 dark:border-slate-800">
                <button onClick={() => setShowPaymentHistory(false)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all text-slate-900 dark:text-white">
                    <Icon name="arrow_back" />
                </button>
                <h2 className="font-black text-xl text-slate-900 dark:text-white">缴费流水记录</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {bills.filter(b => b.status === 'PAID').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((record) => (
                    <div key={record.id} className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-5 shadow-sm border border-slate-50 dark:border-slate-800 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <Icon name="payments" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{record.title}</h4>
                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{record.contractTitle}</p>
                                </div>
                            </div>
                            <span className="font-black text-slate-900 dark:text-white text-lg">-{record.amount}</span>
                        </div>
                        <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Icon name="schedule" size={12} /> {record.date}</span>
                            <span className="text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">支付成功</span>
                        </div>
                    </div>
                ))}
                {bills.filter(b => b.status === 'PAID').length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 opacity-30">
                        <Icon name="history_toggle_off" size={64} className="text-slate-300 mb-4" />
                        <p className="text-sm font-bold text-slate-400">暂无任何缴费历史</p>
                    </div>
                )}
            </div>
        </motion.div>
    );

    const AutoPaySetupModal = () => {
        const [method, setMethod] = useState<'WECHAT' | 'ALIPAY'>('WECHAT');
        const [agreed, setAgreed] = useState(false);
        const [loading, setLoading] = useState(false);
        const [success, setSuccess] = useState(false);

        const handleActivate = () => {
            if (!agreed) return;
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setSuccess(true);
                setTimeout(() => setShowAutoPaySetup(false), 1500);
            }, 1200);
        };

        if (success) {
            return (
                <div className="fixed inset-0 z-[110] bg-white dark:bg-[#000] flex flex-col items-center justify-center">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-200">
                            <Icon name="verified_user" className="text-white" size={48} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white text-center">开通自动代扣</h2>
                        <p className="text-slate-400 mt-2 text-center font-bold">下期账单起将由 AI 自动缴纳</p>
                    </motion.div>
                </div>
            );
        }

        return (
            <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                className="fixed inset-0 z-[100] bg-[#f8fafc] dark:bg-[#000] flex flex-col"
            >
                <div className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-xl p-4 pt-safe-top flex items-center gap-4 border-b border-slate-100 dark:border-slate-800">
                    <button onClick={() => setShowAutoPaySetup(false)} className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95">
                        <Icon name="arrow_back" className="text-slate-900 dark:text-white" />
                    </button>
                    <h2 className="font-black text-xl text-slate-900 dark:text-white">自动代扣设置</h2>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-8">
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-[32px] p-6 shadow-sm border border-slate-50 dark:border-slate-800">
                        <div className="flex gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 shrink-0 overflow-hidden ring-4 ring-slate-50">
                                <img src={activeProperty?.image} className="w-full h-full object-cover" alt="Property" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-black text-slate-900 dark:text-white text-lg truncate">{activeProperty?.title}</h3>
                                <p className="text-xs text-slate-400 font-medium truncate mt-1">{activeProperty?.location}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex flex-col items-center gap-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">当前状态</span>
                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">合约正常</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex flex-col items-center gap-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">代扣周期</span>
                                <span className="text-xs font-bold text-slate-800 dark:text-white">月结</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">选择支付渠道</h4>
                        <div className="space-y-3">
                            {[
                                { id: 'WECHAT', title: '微信支付分', subtitle: '先用后付，额度充足', icon: 'chat', color: 'bg-[#07c160]' },
                                { id: 'ALIPAY', title: '支付宝芝麻信用', subtitle: '信用先享，自动代扣', icon: 'account_balance_wallet', color: 'bg-[#1677ff]' }
                            ].map((pay) => (
                                <button
                                    key={pay.id}
                                    onClick={() => setMethod(pay.id as any)}
                                    className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 transition-all ${method === pay.id ? 'bg-white dark:bg-[#1a1a1a] border-indigo-600 dark:border-indigo-500 shadow-xl shadow-indigo-100 dark:shadow-none' : 'bg-white/50 dark:bg-[#1a1a1a]/50 border-transparent text-slate-400'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl ${pay.color} flex items-center justify-center text-white shadow-lg`}>
                                            <Icon name={pay.icon} size={24} />
                                        </div>
                                        <div className="text-left">
                                            <span className="block font-black text-slate-900 dark:text-white text-base">{pay.title}</span>
                                            <span className="block text-xs font-medium text-slate-400 mt-0.5">{pay.subtitle}</span>
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${method === pay.id ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-600 dark:bg-indigo-500' : 'border-slate-200 dark:border-slate-700'}`}>
                                        {method === pay.id && <Icon name="check" size={16} className="text-white" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-white dark:bg-[#1a1a1a]/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 pb-safe-bottom">
                    <div className="flex items-start gap-3 mb-6">
                        <button
                            onClick={() => setAgreed(!agreed)}
                            className={`mt-1 w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${agreed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200'}`}
                        >
                            {agreed && <Icon name="check" size={14} className="text-white" />}
                        </button>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            勾选即代表您已同意 <span className="text-slate-900 dark:text-white font-bold">《智慧租房自动扣缴协议》</span>。平台将在账单到期日前 1 天尝试扣除应缴金额。
                        </p>
                    </div>

                    <button
                        onClick={handleActivate}
                        disabled={!agreed || loading}
                        className="w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl shadow-2xl shadow-slate-200 dark:shadow-none active:scale-95 transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-2"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/20 dark:border-slate-900/20 border-t-white dark:border-t-slate-900 rounded-full animate-spin" /> : '确认开通并授权'}
                    </button>
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
                // Call global pay
                onPayBills(Array.from(selectedBillIds));
                setTimeout(() => {
                    setShowPayment(false);
                    setSelectedBillIds(new Set());
                }, 1500);
            }, 1800);
        };

        if (success) {
            return (
                <div className="fixed inset-0 z-[120] bg-white dark:bg-[#000] flex flex-col items-center justify-center">
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-indigo-200">
                            <Icon name="check" className="text-white" size={48} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">缴费成功</h2>
                        <p className="text-slate-400 mt-2 font-bold dark:text-slate-500">账单已实时核销，感谢您的配合</p>
                    </motion.div>
                </div>
            );
        }

        return (
            <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                className="fixed inset-0 z-[110] bg-[#f8fafc] dark:bg-[#000] flex flex-col"
            >
                <div className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-xl p-4 pt-safe-top flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                    <button onClick={() => setShowPayment(false)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-900 dark:text-white">
                        <Icon name="close" />
                    </button>
                    <h2 className="font-black text-xl text-slate-900 dark:text-white">收银台结算</h2>
                    <div className="w-10" />
                </div>

                <div className="flex-1 p-8 space-y-10 overflow-y-auto pt-16">
                    <div className="text-center">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">本次应支付总额</p>
                        <div className="flex items-baseline justify-center gap-1 text-slate-900 dark:text-white">
                            <span className="text-3xl font-black">¥</span>
                            <span className="text-7xl font-black tracking-tighter">{totalAmountFormatted}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">支付方式</h4>
                        {[
                            { id: 'WECHAT', title: '微信支付', icon: 'chat', color: 'bg-[#07c160]' },
                            { id: 'ALIPAY', title: '支付宝', icon: 'account_balance_wallet', color: 'bg-[#1677ff]' }
                        ].map(pay => (
                            <button
                                key={pay.id}
                                onClick={() => setPaymentMethod(pay.id as any)}
                                className={`w-full flex items-center justify-between p-5 rounded-[28px] border-2 transition-all ${paymentMethod === pay.id ? 'bg-white dark:bg-[#1a1a1a] border-slate-900 dark:border-white shadow-xl' : 'bg-transparent border-transparent opacity-50'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl ${pay.color} flex items-center justify-center text-white`}>
                                        <Icon name={pay.icon} size={20} />
                                    </div>
                                    <span className="font-black text-slate-900 dark:text-white text-lg">{pay.title}</span>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === pay.id ? 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white' : 'border-slate-200 dark:border-slate-700'}`}>
                                    {paymentMethod === pay.id && <Icon name="check" size={16} className="text-white dark:text-black" />}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-2xl flex items-center gap-3">
                        <Icon name="verified_user" className="text-indigo-600 dark:text-indigo-400" size={18} />
                        <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold leading-tight">
                            您的交易正在进行高强度加密保护，支付成功后将由平台托管至房东确认。
                        </p>
                    </div>
                </div>

                <div className="p-8 bg-white dark:bg-[#1a1a1a] border-t border-slate-100 dark:border-slate-800 pb-safe-bottom">
                    <button
                        onClick={handlePayConfirm}
                        disabled={loading}
                        className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-lg rounded-2xl shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70"
                    >
                        {loading ? '处理中...' : `立即确认支付 ¥${totalAmountFormatted}`}
                    </button>
                </div>
            </motion.div>
        );
    };

    // --- MAIN VIEWS ---

    if (!selectedPropertyId) {
        return (
            <div className="flex flex-col h-[100dvh] bg-[#f8fafc] dark:bg-[#101922]">
                <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#101922]/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
                    <div className="px-6 py-4 pt-safe-top flex items-center justify-between">
                        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-90">
                            <Icon name="arrow_back" className="text-slate-900 dark:text-white" size={24} />
                        </button>
                        <h1 className="font-black text-xl text-slate-900 dark:text-white">我的数字化账单</h1>
                        <button onClick={() => setShowPaymentHistory(true)} className="text-xs font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full active:scale-95 transition-all">
                            缴费记录
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
                    {signedProperties.map(prop => {
                        const propBills = bills.filter(b => b.contractTitle === prop.title);
                        const pendingAmount = propBills
                            .filter(b => b.status === 'PENDING')
                            .reduce((sum, b) => sum + parseFloat(b.amount.replace(/[¥, ]/g, '')), 0);
                        const isCleared = pendingAmount === 0;

                        return (
                            <div key={prop.id} className="group relative">
                                <div className="absolute inset-0 bg-indigo-600 rounded-[32px] translate-y-2 opacity-10 group-active:translate-y-1 transition-all" />
                                <div className="relative bg-white dark:bg-[#1a1a1a] rounded-[32px] p-6 shadow-sm border border-slate-50 dark:border-slate-800 flex flex-col gap-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h3 className="font-black text-slate-900 dark:text-white text-lg truncate flex items-center gap-2">
                                                <Icon name="apartment" size={20} className="text-indigo-600" />
                                                {prop.title}
                                            </h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 truncate">{prop.location}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isCleared ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500' : 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400'}`}>
                                            {isCleared ? '已缴清' : '有待缴额'}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">待缴合计</span>
                                            <span className={`text-2xl font-black ${isCleared ? 'text-slate-300 dark:text-slate-600' : 'text-slate-900 dark:text-white'}`}>
                                                ¥ {pendingAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        {!isCleared && <Icon name="warning" className="text-red-500 animate-pulse" size={20} />}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedPropertyId(prop.id)}
                                            className="flex-1 h-12 rounded-xl text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
                                        >
                                            费用明细
                                        </button>
                                        <button
                                            onClick={() => { setSelectedPropertyId(prop.id); setShowAutoPaySetup(true); }}
                                            className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 active:scale-95 transition-all"
                                        >
                                            <Icon name="auto_awesome" size={20} />
                                        </button>
                                        <button
                                            disabled={isCleared}
                                            onClick={() => { setSelectedPropertyId(prop.id); }}
                                            className={`flex-[1.5] h-12 rounded-xl text-xs font-black shadow-lg transition-all ${isCleared ? 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 shadow-none' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:shadow-xl active:scale-95'}`}
                                        >
                                            立即缴纳
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {signedProperties.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1a1a1a] rounded-[40px] border-2 border-dashed border-slate-100 dark:border-slate-800 p-10 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6">
                                <Icon name="credit_card_off" size={32} className="text-slate-200 dark:text-slate-700" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">暂无待收账单</h3>
                            <p className="text-xs text-slate-400 font-medium mt-2 leading-relaxed">数字化租约启动后，AI 将自动为您规划每月的缴费日程与账单流水。</p>
                        </div>
                    )}
                </div>

                <AnimatePresence>{showPaymentHistory && <PaymentHistoryModal />}</AnimatePresence>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[100dvh] bg-[#f8fafc] dark:bg-[#101922]">
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#101922]/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
                <div className="px-6 py-4 pt-safe-top flex items-center gap-4">
                    <button onClick={() => setSelectedPropertyId(null)} className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 text-slate-900 dark:text-white">
                        <Icon name="arrow_back" size={24} />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="font-black text-xl text-slate-900 dark:text-white truncate">房源账单清单</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">{activeProperty?.title}</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 pb-40">
                {currentPropertyBills.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onSelectBill(item)}
                        className={`group relative bg-white dark:bg-[#1a1a1a] rounded-[28px] p-5 flex items-center justify-between border-2 transition-all ${item.status === 'PENDING' && selectedBillIds.has(item.id) ? 'border-indigo-600 shadow-xl shadow-indigo-50 dark:shadow-none' : 'border-transparent shadow-sm'}`}
                    >
                        <div className="flex items-center gap-5">
                            {item.status === 'PENDING' ? (
                                <div
                                    onClick={(e) => toggleBillSelect(e, item.id)}
                                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedBillIds.has(item.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
                                >
                                    {selectedBillIds.has(item.id) && <Icon name="check" size={16} className="text-white" />}
                                </div>
                            ) : (
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <Icon name="check_circle" className="text-emerald-500/20" size={20} />
                                </div>
                            )}
                            <div className="text-left">
                                <h4 className={`font-black text-base ${item.status === 'PAID' ? 'text-slate-300 dark:text-slate-600 line-through' : 'text-slate-900 dark:text-white'}`}>{item.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{item.month}度</span>
                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{item.date}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-slate-900 dark:text-white text-lg mb-1">{item.amount}</p>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${item.status === 'PAID' ? 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                                {item.status === 'PAID' ? '已核销' : '未缴纳'}
                            </span>
                        </div>
                    </div>
                ))}
                {currentPropertyBills.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 opacity-20">
                        <Icon name="folder_off" size={64} />
                        <p className="text-sm font-bold mt-4">该租赁合同下暂无出账</p>
                    </div>
                )}
            </div>

            {/* Float Action Bar */}
            <AnimatePresence>
                {pendingBills.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-6 right-6 z-40"
                    >
                        <div className="bg-slate-900 rounded-[32px] p-4 pl-6 flex items-center justify-between shadow-2xl shadow-indigo-900/20 ring-1 ring-white/10">
                            <div onClick={toggleSelectAll} className="flex items-center gap-3 cursor-pointer">
                                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${selectedBillIds.size === pendingBills.length ? 'bg-indigo-500 border-indigo-500' : 'border-white/20 hover:border-white/40'}`}>
                                    {selectedBillIds.size === pendingBills.length && <Icon name="check" size={14} className="text-white" />}
                                </div>
                                <span className="text-xs font-black text-white uppercase tracking-widest">全选</span>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none mb-1">合计应付</p>
                                    <p className="text-xl font-black text-white tracking-tight">¥{totalAmountFormatted}</p>
                                </div>
                                <button
                                    onClick={() => setShowPayment(true)}
                                    disabled={selectedBillIds.size === 0}
                                    className="h-14 px-8 bg-white text-slate-900 rounded-2xl font-black text-sm active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
                                >
                                    结算推送({selectedBillIds.size})
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>{showPayment && <PaymentModal />}</AnimatePresence>
            <AnimatePresence>{showAutoPaySetup && <AutoPaySetupModal />}</AnimatePresence>
        </div>
    );
};