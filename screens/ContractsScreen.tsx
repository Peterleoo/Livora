import React from 'react';
import { Icon } from '../components/Icon';
import { ContractItem } from '../types';

interface ContractsScreenProps {
  onBack: () => void;
  contracts: ContractItem[];
  onSelectContract: (contract: ContractItem) => void;
}

export const ContractsScreen: React.FC<ContractsScreenProps> = ({ onBack, contracts, onSelectContract }) => {
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#101010]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#f8fafc]/90 dark:bg-[#101010]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3 pt-safe-top flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-[#202020]">
             <Icon name="arrow_back_ios" className="text-slate-900 dark:text-white" size={20} />
          </button>
          <div className="font-bold text-lg text-slate-900 dark:text-white">租房合同</div>
          <button className="p-2 -mr-2 rounded-full hover:bg-slate-200 dark:hover:bg-[#202020]">
             <Icon name="add" className="text-slate-900 dark:text-white" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6">
         <div className="space-y-4">
            {contracts.map((item, i) => (
                 <div key={i} onClick={() => onSelectContract(item)} className="w-full bg-white rounded-2xl p-5 shadow-sm border border-slate-50 active:scale-[0.98] transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
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

                    <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                <Icon name="date_range" size={18} />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-slate-500">合约周期</p>
                                <p className="text-sm font-bold text-slate-900">{item.startDate} - {item.endDate}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                        <span className="text-xs font-bold text-slate-400">查看详情</span>
                        <Icon name="chevron_right" size={16} className="text-slate-300" />
                    </div>
                 </div>
            ))}
         </div>
      </div>
    </div>
  );
};