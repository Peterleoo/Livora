import React from 'react';
import { Icon } from '../components/Icon';

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
  currentMode: 'SEEKER' | 'TENANT';
  onSwitchMode: (mode: 'SEEKER' | 'TENANT') => void;
  onChangeCity: () => void;
  currentCity: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onLogout,
  currentMode,
  onSwitchMode,
  onChangeCity,
  currentCity,
  isDarkMode,
  onToggleDarkMode
}) => {
  const MenuItem = ({ icon, label, subtext, onClick }: { icon: string, label: string, subtext?: string, onClick?: () => void }) => (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-4 bg-white dark:bg-[#1a1a1a] border-b border-slate-50 dark:border-slate-800 last:border-none transition-colors ${onClick ? 'active:bg-slate-50 cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-3">
        <Icon name={icon} size={22} className="text-slate-500" />
        <span className="text-sm font-medium text-slate-900 dark:text-white">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {subtext && <span className="text-xs text-slate-400">{subtext}</span>}
        <Icon name="chevron_right" size={18} className="text-slate-300" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#f2f2f7] dark:bg-[#000]">
      {/* Header */}
      <div className="px-4 py-3 pt-safe-top bg-white dark:bg-[#1a1a1a] sticky top-0 z-10 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">
          <Icon name="arrow_back" className="text-slate-900 dark:text-white" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">设置</h1>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">

        {/* Mode Switching */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase ml-2 mb-2">当前身份</h3>
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-2 shadow-sm flex gap-2">
            <button
              onClick={() => onSwitchMode('SEEKER')}
              className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${currentMode === 'SEEKER'
                ? 'bg-primary text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
            >
              <Icon name="search" size={20} />
              <span className="text-sm font-bold">找房模式</span>
            </button>
            <button
              onClick={() => onSwitchMode('TENANT')}
              className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${currentMode === 'TENANT'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
            >
              <Icon name="home_work" size={20} />
              <span className="text-sm font-bold">租客模式</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 ml-2 mt-1.5">
            {currentMode === 'SEEKER' ? '正在浏览房源，寻找心仪的家' : '已进入租务管理中心，管理当前租约'}
          </p>
        </div>

        {/* Location Settings (New) */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase ml-2 mb-2">个性化</h3>
          <div className="rounded-xl overflow-hidden shadow-sm">
            <MenuItem icon="location_city" label="切换城市" subtext={currentCity} onClick={onChangeCity} />
          </div>
        </div>

        {/* App Settings */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase ml-2 mb-2">应用</h3>
          <div className="rounded-xl overflow-hidden shadow-sm">
            <MenuItem icon="language" label="语言" subtext="简体中文" />
            <MenuItem icon="contrast" label="外观" subtext={isDarkMode ? '夜间模式' : '日间模式'} onClick={onToggleDarkMode} />
            <MenuItem icon="notifications" label="通知设置" />
          </div>
        </div>

        {/* Support & About */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase ml-2 mb-2">关于</h3>
          <div className="rounded-xl overflow-hidden shadow-sm">
            <MenuItem icon="update" label="检查更新" subtext="v1.2.0" />
            <MenuItem icon="description" label="服务协议" />
            <MenuItem icon="privacy_tip" label="隐私政策" />
            <MenuItem icon="help" label="帮助与反馈" />
          </div>
        </div>

        {/* Danger Zone */}
        <button
          onClick={onLogout}
          className="w-full bg-white dark:bg-[#1a1a1a] text-red-500 font-medium py-3.5 rounded-xl shadow-sm active:bg-slate-50 transition-colors"
        >
          退出登录
        </button>

        <div className="text-center text-[10px] text-slate-300 mt-4">
          Version 1.2.0
        </div>
      </div>
    </div>
  );
};
