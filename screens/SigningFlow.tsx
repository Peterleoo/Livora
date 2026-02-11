import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/Icon';
import { SignStep, Property } from '../types';

interface SigningFlowProps {
  property: Property;
  onComplete: () => void;
  onCancel: () => void;
}

export const SigningFlow: React.FC<SigningFlowProps> = ({ property, onComplete, onCancel }) => {
  const [step, setStep] = useState<SignStep>('CONTRACT');
  const [signed, setSigned] = useState(false);

  // State for Lease Start Date (Default to today)
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  // State for Lease Duration
  const [leaseTerm, setLeaseTerm] = useState<number | 'custom'>(12); // Months
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Contract Step
  const ContractView = () => {
    // Calculate dates based on selection
    const start = new Date(startDate);

    let endDateStr = '';

    if (leaseTerm === 'custom') {
      endDateStr = customEndDate;
    } else {
      const end = new Date(start);
      end.setMonth(end.getMonth() + (leaseTerm as number));
      end.setDate(end.getDate() - 1);
      endDateStr = end.toISOString().split('T')[0];
    }

    // Payment Day (e.g., 15th of every month)
    const paymentDay = start.getDate();

    const durationOptions = [
      { label: '半年', value: 6 },
      { label: '一年', value: 12 },
      { label: '两年', value: 24 },
      { label: '三年', value: 36 },
      { label: '五年', value: 60 },
      { label: '自定义', value: 'custom' },
    ];

    const rentAmount = property.price;
    const depositAmount = property.price;

    return (
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
        <div className="p-4 bg-white dark:bg-slate-800 shadow-sm z-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">合同条款确认</h2>
          <p className="text-sm text-slate-500">请设定租期并核对关键信息</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Rent & Deposit Card */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">月租金 (含物业费)</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">¥{rentAmount.toLocaleString()}</span>
                  <span className="text-sm text-slate-500">/月</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                <Icon name="payments" size={28} />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                  <Icon name="savings" size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">房屋押金 (付一押一)</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">¥{depositAmount.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-medium text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                  合约期满可退
                </span>
              </div>
            </div>
          </div>

          {/* Duration Selection */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="date_range" className="text-blue-500" size={20} />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">租期时长</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {durationOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    setLeaseTerm(opt.value as number | 'custom');
                    // If switching to custom and empty, maybe set a default?
                    if (opt.value === 'custom' && !customEndDate) {
                      // Default to 1 year from now just to have something
                      const d = new Date(startDate);
                      d.setFullYear(d.getFullYear() + 1);
                      setCustomEndDate(d.toISOString().split('T')[0]);
                    }
                  }}
                  className={`py-2.5 rounded-lg text-xs font-bold border transition-all ${leaseTerm === opt.value
                    ? 'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-400'
                    : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Start Date Picker */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 relative">
              <Icon name="event_available" className="text-blue-500 mb-2" />
              <p className="text-xs text-slate-500 mb-1">起租日期</p>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-primary transition-colors"
              />
            </div>
            {/* End Date Display/Input */}
            <div className={`bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 ${leaseTerm !== 'custom' ? 'opacity-80' : ''}`}>
              <Icon name="event_busy" className="text-slate-400 mb-2" />
              <p className="text-xs text-slate-500 mb-1">{leaseTerm === 'custom' ? '到期日期 (请选择)' : '到期日期 (自动计算)'}</p>
              {leaseTerm === 'custom' ? (
                <input
                  type="date"
                  value={endDateStr}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-primary transition-colors"
                />
              ) : (
                <div className="w-full bg-transparent px-1 py-1.5 text-sm font-bold text-slate-500 dark:text-slate-400">
                  {endDateStr}
                </div>
              )}
            </div>
          </div>

          {/* Payment Rules Card */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="schedule" className="text-orange-500" size={20} />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">付款周期定义</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-700 pb-2">
                <span className="text-slate-500">押金方式</span>
                <span className="font-bold text-slate-900 dark:text-white">付一押一 (¥{depositAmount})</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-700 pb-2">
                <span className="text-slate-500">首期付款日</span>
                <span className="font-bold text-primary">{startDate} (签约当日)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">每周期付款日</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 dark:text-white">每月 {paymentDay} 号</span>
                  <Icon name="info" size={14} className="text-slate-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Contract Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-3 bg-slate-50 dark:bg-slate-700/30 flex justify-between items-center border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Icon name="smart_toy" className="text-primary text-sm" />
                <span className="text-xs font-bold text-primary uppercase">AI Generated Contract</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">ID: CTR-2023-8392</span>
            </div>
            <div className="p-4 flex gap-4">
              <div className="w-16 h-20 bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 flex flex-col items-center justify-center">
                <Icon name="description" className="text-red-500" size={32} />
                <span className="text-[8px] font-bold text-slate-500">PDF</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">深圳市南山区科技园华润城304室租赁协议.pdf</h3>
                <button className="mt-2 text-xs font-medium text-primary flex items-center gap-1">
                  <Icon name="visibility" size={14} /> 预览全文
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 pb-safe-bottom">
          <button
            onClick={() => setStep('FACE_ID')}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            确认条款并继续 <Icon name="arrow_forward" />
          </button>
        </div>
      </div>
    );
  };

  // Face ID Step
  const FaceIDView = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">人脸识别</h2>
        <p className="text-slate-500">请正对屏幕，保持光线充足</p>
      </div>

      <div className="relative w-72 h-72">
        {/* Scanning Animation */}
        <div className="absolute inset-0 rounded-full border-[6px] border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
            alt="User Face"
            className="w-full h-full object-cover scale-110 opacity-80 grayscale-[30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-scan"></div>
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 w-full">
          <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <Icon name="videocam" size={16} /> 识别中...
          </div>
          {/* Added Verification Text */}
          <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <Icon name="badge" size={12} />
            正在与实名身份证信息(440******995)比对
          </p>
        </div>
      </div>

      <button
        onClick={() => setStep('SIGNATURE')}
        className="mt-16 px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        模拟认证通过
      </button>
    </div>
  );

  // Signature Step
  const SignatureView = () => (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">手写电子签名</h2>
        <p className="text-sm text-slate-500">请在下方区域签署您的姓名</p>
      </div>

      <div className="flex-1 px-4 pb-4">
        <div
          className="w-full h-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden cursor-crosshair"
          onClick={() => setSigned(true)}
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-4xl font-bold text-slate-200 dark:text-slate-700 -rotate-12">Sign Here</span>
          </div>

          {signed && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300">
              <path
                d="M50,150 Q100,50 150,150 T250,150 T350,100"
                fill="none"
                stroke="#137fec"
                strokeWidth="4"
                strokeLinecap="round"
                className="animate-[dash_1s_ease-out_forwards]"
                style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
              >
                <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="1.5s" fill="freeze" />
              </path>
            </svg>
          )}

          {!signed && <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-slate-400 animate-bounce">点击空白处模拟签名</div>}
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-3">
        <button
          onClick={() => setSigned(false)}
          className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-xl"
        >
          重写
        </button>
        <button
          onClick={() => setStep('SUCCESS')}
          disabled={!signed}
          className="flex-[2] bg-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
        >
          确认签署 <Icon name="draw" />
        </button>
      </div>
    </div>
  );

  // Success Step
  const SuccessView = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring" }}
        className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6"
      >
        <Icon name="check_circle" className="text-green-500 text-6xl" />
      </motion.div>

      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">签约成功</h2>
      <div className="flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-8">
        <Icon name="verified_user" className="text-primary text-sm" />
        <span className="text-xs font-mono text-primary font-medium">Hash: 0x7a...8f92</span>
      </div>

      <div className="w-full space-y-3">
        <button
          onClick={() => setStep('PAYMENT')}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-between px-6 group"
        >
          <div className="text-left">
            <div className="text-sm opacity-80 font-normal">下一步</div>
            <div className="text-lg">预存租金 (享95折)</div>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <Icon name="arrow_forward" />
          </div>
        </button>

        <button onClick={onComplete} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl flex items-center justify-center gap-2">
          返回首页
        </button>
      </div>
    </div>
  );

  // Payment Step (Simulated)
  const PaymentView = () => {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'WECHAT' | 'ALIPAY'>('WECHAT');
    const [success, setSuccess] = useState(false);

    const handlePay = () => {
      setLoading(true);
      // Simulate Network Delay
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        // Wait a bit to show success message then close
        setTimeout(() => {
          onComplete();
        }, 1500);
      }, 2000);
    };

    if (success) {
      return (
        <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-slate-900">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-200">
              <Icon name="check" className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">支付成功</h2>
            <p className="text-slate-500 mt-2">正在返回首页...</p>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-slate-900 relative">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 p-4 shadow-sm z-10 text-center relative">
          <button onClick={() => setStep('SUCCESS')} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 -ml-2 text-slate-400">
            <Icon name="arrow_back" />
          </button>
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">收银台</h2>
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Amount Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm text-center">
            <p className="text-sm text-slate-500 mb-2">支付金额 (年付95折)</p>
            <div className="flex items-baseline justify-center gap-1 text-slate-900 dark:text-white">
              <span className="text-2xl font-bold">¥</span>
              <span className="text-5xl font-bold font-display tracking-tight">{(property.price * 12 * 0.95).toLocaleString()}</span>
              <span className="text-xl">.00</span>
            </div>
            <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-500 rounded-full text-xs font-bold">
              <Icon name="savings" size={14} /> 已优惠 ¥{(property.price * 12 * 0.05).toLocaleString()}
            </div>
          </div>

          {/* Method Selection */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => setPaymentMethod('WECHAT')}
              className="w-full flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-700 active:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#07c160] flex items-center justify-center text-white">
                  <Icon name="chat" size={20} />
                </div>
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
                <div className="w-8 h-8 rounded bg-[#1677ff] flex items-center justify-center text-white">
                  <Icon name="account_balance_wallet" size={20} />
                </div>
                <span className="font-bold text-slate-900 dark:text-white">支付宝</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'ALIPAY' ? 'border-[#1677ff] bg-[#1677ff]' : 'border-slate-300'}`}>
                {paymentMethod === 'ALIPAY' && <Icon name="check" size={14} className="text-white" />}
              </div>
            </button>
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 pb-safe-bottom">
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                安全支付中...
              </>
            ) : (
              <>确认支付 ¥{(property.price * 12 * 0.95).toLocaleString()}</>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col">
      {/* Header for flow */}
      {step !== 'SUCCESS' && step !== 'PAYMENT' && (
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <button onClick={onCancel} className="p-2 -ml-2"><Icon name="close" /></button>
          <div className="flex gap-1">
            {['CONTRACT', 'FACE_ID', 'SIGNATURE'].map((s, i) => (
              <div key={s} className={`w-2 h-2 rounded-full ${step === s ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`} />
            ))}
          </div>
          <div className="w-8" />
        </div>
      )}

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full w-full"
          >
            {step === 'CONTRACT' && <ContractView />}
            {step === 'FACE_ID' && <FaceIDView />}
            {step === 'SIGNATURE' && <SignatureView />}
            {step === 'SUCCESS' && <SuccessView />}
            {step === 'PAYMENT' && <PaymentView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};