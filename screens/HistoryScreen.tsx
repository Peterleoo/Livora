import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { ChatSession } from '../types';

interface HistoryScreenProps {
  onBack: () => void;
  onSelectSession: (id: string) => void;
  sessions: ChatSession[];
  onDeleteSession: (id: string) => void;
  onDeleteSessions: (ids: string[]) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  onBack,
  onSelectSession,
  sessions,
  onDeleteSession,
  onDeleteSessions
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === sessions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sessions.map(s => s.id)));
    }
  };

  const handleDeleteSelected = () => {
    onDeleteSessions(Array.from(selectedIds));
    setSelectedIds(new Set());
    setIsEditMode(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#101010]">
      {/* Header */}
      <div className="flex items-center px-4 pt-safe-top pb-3 bg-white/90 dark:bg-[#101010]/90 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800 transition-all">
        {isEditMode ? (
          <button
            onClick={() => { setIsEditMode(false); setSelectedIds(new Set()); }}
            className="text-slate-600 dark:text-slate-400 font-medium text-sm px-2"
          >
            取消
          </button>
        ) : (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#202020] transition-colors"
          >
            <Icon name="arrow_back" className="text-slate-900 dark:text-white" />
          </button>
        )}

        <span className="font-bold text-lg text-slate-900 dark:text-white ml-2 flex-1 text-center pr-8">
          {isEditMode ? `已选择 ${selectedIds.size} 项` : '对话历史'}
        </span>

        <div className="ml-auto w-16 flex justify-end">
          {isEditMode ? (
            <button
              onClick={handleDeleteSelected}
              disabled={selectedIds.size === 0}
              className={`text-sm font-bold transition-colors ${selectedIds.size > 0 ? 'text-red-500 hover:text-red-600' : 'text-slate-300 cursor-not-allowed'}`}
            >
              删除
            </button>
          ) : (
            <button
              onClick={() => setIsEditMode(true)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#202020]"
            >
              <Icon name="edit" className="text-slate-900 dark:text-white" size={20} />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isEditMode && sessions.length > 0 && (
          <div className="flex justify-between items-center px-2 mb-2">
            <button
              onClick={handleSelectAll}
              className="text-sm text-indigo-600 font-bold"
            >
              {selectedIds.size === sessions.length ? '取消全选' : '全选'}
            </button>
          </div>
        )}

        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => {
              if (isEditMode) toggleSelect(session.id);
              else onSelectSession(session.id);
            }}
            className={`bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl shadow-sm border transition-all cursor-pointer group relative overflow-hidden ${selectedIds.has(session.id)
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                : 'border-slate-100 dark:border-slate-800'
              }`}
          >
            {isEditMode && (
              <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedIds.has(session.id) ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'
                }`}>
                {selectedIds.has(session.id) && <Icon name="check" size={12} className="text-white" />}
              </div>
            )}

            <div className={`transition-opacity ${isEditMode ? 'opacity-80' : 'opacity-100'}`}>
              <div className="flex justify-between items-start mb-2 pr-8">
                <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1 group-hover:text-primary transition-colors">
                  {session.title}
                </h3>
                <span className="text-[10px] text-slate-400 shrink-0 mt-1 absolute right-4 top-4 opacity-100 group-hover:opacity-0 transition-opacity">
                  {!isEditMode && session.date}
                </span>
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
          </div>
        ))}

        {sessions.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <Icon name="history" size={32} />
            </div>
            <p className="text-sm text-slate-400 font-medium">暂无对话记录</p>
          </div>
        )}

        {sessions.length > 0 && (
          <div className="text-center py-6">
            <p className="text-xs text-slate-300 dark:text-slate-700">仅展示最近 20 条对话记录</p>
          </div>
        )}
      </div>
    </div>
  );
};