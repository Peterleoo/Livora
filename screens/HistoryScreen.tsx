import React from 'react';
import { Icon } from '../components/Icon';
import { ChatSession } from '../types';

interface HistoryScreenProps {
  onBack: () => void;
  onSelectSession: (id: string) => void;
}

const MOCK_SESSIONS: ChatSession[] = [
  {
    id: '1',
    title: '寻找南山科技园附近的房源',
    preview: '已为您筛选出 3 套符合通勤 30 分钟内的房源...',
    date: '刚刚',
    tags: ['找房', '南山']
  },
  {
    id: '2',
    title: '咨询租房合同违约金条款',
    preview: '根据《民法典》相关规定，押金通常作为违约金...',
    date: '昨天',
    tags: ['法律', '合同']
  },
  {
    id: '3',
    title: '8月份电费异常查询',
    preview: '已调取 8 月份智能电表数据，主要峰值出现在...',
    date: '8月15日',
    tags: ['生活服务', '账单']
  },
  {
    id: '4',
    title: '适合养猫的小区推荐',
    preview: '为您推荐“华润城”，该小区绿化率高且有宠物公园...',
    date: '8月10日',
    tags: ['找房', '宠物友好']
  }
];

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack, onSelectSession }) => {
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#101010]">
      {/* Header */}
      <div className="flex items-center px-4 pt-safe-top pb-3 bg-white/90 dark:bg-[#101010]/90 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={onBack} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#202020] transition-colors"
        >
           <Icon name="arrow_back" className="text-slate-900 dark:text-white" />
        </button>
        <span className="font-bold text-lg text-slate-900 dark:text-white ml-2">对话历史</span>
        <div className="ml-auto">
           <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#202020]">
             <Icon name="search" className="text-slate-900 dark:text-white" />
           </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {MOCK_SESSIONS.map((session) => (
          <div 
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1 group-hover:text-primary transition-colors">
                {session.title}
              </h3>
              <span className="text-[10px] text-slate-400 shrink-0 mt-1">{session.date}</span>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
              {session.preview}
            </p>

            <div className="flex gap-2">
              {session.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] rounded font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center py-6">
          <p className="text-xs text-slate-300 dark:text-slate-700">仅展示最近 30 天的对话记录</p>
        </div>
      </div>
    </div>
  );
};