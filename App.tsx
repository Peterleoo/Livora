import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './components/Icon';
import { HomeScreen } from './screens/HomeScreen';
import { ExploreScreen } from './screens/ExploreScreen';
// import { ManagementScreen } from './screens/ManagementScreen'; // Removed
import { BillsScreen } from './screens/BillsScreen'; // New
import { BillDetailsScreen } from './screens/BillDetailsScreen'; // New
import { ContractsScreen } from './screens/ContractsScreen'; // New
import { ContractDetailsScreen } from './screens/ContractDetailsScreen'; // New
import { TenantHomeScreen } from './screens/TenantHomeScreen'; // New Tenant Home
import { ProfileScreen } from './screens/ProfileScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { LoginScreen } from './screens/LoginScreen';
import { VRViewScreen } from './screens/VRViewScreen';
import { SigningFlow } from './screens/SigningFlow';
import { PropertyDetailsScreen } from './screens/PropertyDetailsScreen';
import { ChatScreen } from './screens/ChatScreen';
import { CitySelectionScreen } from './screens/CitySelectionScreen'; // New
import { FavoritesScreen } from './screens/FavoritesScreen'; // New
import { AIOnboardingOverlay } from './components/AIOnboardingOverlay'; // New
import {
  Property,
  BillItem,
  ContractItem,
  UserPreferences,
  ScreenName,
  ChatSession,
  Message
} from './types';

// Mock Data (Expanded with Cities)
const ALL_PROPERTIES: Property[] = [
  {
    id: '1',
    city: '深圳市',
    title: '华润城润府 · 现代轻奢双卫复式',
    location: '南山区 · 科技园',
    subway: '距1号线高新园站 200m',
    price: 16500,
    paymentType: '押一付三',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-living-room-with-a-fireplace-and-christmas-decoration-39744-large.mp4',
    matchScore: 98,
    tags: ['VR看房', '随时看房', '近地铁'],
    direction: '南',
    floor: '22/38层',
    specs: { beds: 2, baths: 2, area: 120 },
    features: { sunlight: 8, noise: 35, commute: 15 },
    facilities: ['Wifi', 'AirConditioner', 'Washer', 'TV', 'Fridge', 'Elevator', 'Gym']
  },
  {
    id: '2',
    city: '杭州市',
    title: '滨江壹号 · 一线江景艺术大宅',
    location: '滨江区 · 奥体中心',
    subway: '距6号线江汉路站 500m',
    price: 12800,
    paymentType: '押一付一',
    image: 'https://images.unsplash.com/photo-1505691938271-46433cecd818?auto=format&fit=crop&w=1200&q=80',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-a-view-of-the-city-39749-large.mp4',
    matchScore: 94,
    tags: ['艺术街区', '全景落地窗'],
    direction: '东南',
    floor: '18/24层',
    specs: { beds: 1, baths: 1, area: 85 },
    features: { sunlight: 9, noise: 40, commute: 25 },
    facilities: ['Wifi', 'AirConditioner', 'Washer', 'Fridge', 'Elevator', 'Parking']
  },
  {
    id: '3',
    city: '长沙市',
    title: '城市绿洲 · 阳光三居',
    location: '芙蓉区 · 芙蓉广场',
    subway: '距2号线芙蓉广场站 400m',
    price: 4200,
    paymentType: '押一付三',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    matchScore: 89,
    tags: ['公园旁', '采光好'],
    direction: '南',
    floor: '8/32层',
    specs: { beds: 3, baths: 2, area: 110 },
    features: { sunlight: 9, noise: 30, commute: 20 },
    facilities: ['Wifi', 'AirConditioner', 'Kitchen', 'Gym']
  },
  {
    id: '3b',
    city: '长沙市',
    title: '雨花中心 · 舒适两居',
    location: '雨花区 · 洞井',
    subway: '距地铁洞井站 300m',
    price: 2800,
    paymentType: '押一付一',
    image: 'https://images.unsplash.com/photo-1522771753035-4a50423a5a63?auto=format&fit=crop&w=1200&q=80',
    matchScore: 95,
    tags: ['近商圈', '性价比'],
    direction: '南',
    floor: '12/18层',
    specs: { beds: 2, baths: 1, area: 88 },
    features: { sunlight: 8, noise: 35, commute: 10 },
    facilities: ['Wifi', 'AirConditioner', 'Washer', 'Fridge']
  },
  {
    id: '4',
    city: '深圳市',
    title: '南山中心 · 极简主义单身公寓',
    location: '南山区 · 后海',
    subway: '距2号线后海站 300m',
    price: 7800,
    paymentType: '押一付一',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    matchScore: 92,
    tags: ['独卫', '可养宠', '落地窗'],
    direction: '北',
    floor: '12/30层',
    specs: { beds: 1, baths: 1, area: 45 },
    features: { sunlight: 7, noise: 25, commute: 10 },
    facilities: ['Wifi', 'AirConditioner', 'Washer', 'Fridge', 'PetFriendly']
  },
  {
    id: '5',
    city: '深圳市',
    title: '福田CBD · 精装两室一厅',
    location: '福田区 · 会展中心',
    subway: '距1号线会展中心站 100m',
    price: 9500,
    paymentType: '半年付',
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80',
    matchScore: 88,
    tags: ['近商圈', '新装修'],
    direction: '东',
    floor: '15/28层',
    specs: { beds: 2, baths: 1, area: 78 },
    features: { sunlight: 6, noise: 45, commute: 5 },
    facilities: ['Wifi', 'AirConditioner', 'TV', 'Elevator', 'Gym']
  },
  {
    id: '6',
    city: '深圳市',
    title: '深圳湾 · 海景大平层',
    location: '南山区 · 深圳湾',
    subway: '距2号线湾厦站 600m',
    price: 25000,
    paymentType: '押二付一',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    matchScore: 96,
    tags: ['海景', '豪宅', '双车位'],
    direction: '南',
    floor: '28/32层',
    specs: { beds: 4, baths: 3, area: 180 },
    features: { sunlight: 10, noise: 20, commute: 20 },
    facilities: ['Wifi', 'AirConditioner', 'SmartHome', 'Parking', 'Pool']
  }
];

const SIDEBAR_SESSIONS: ChatSession[] = [
  {
    id: '1',
    title: '寻找南山科技园附近的房源',
    preview: '已为您筛选出 3 套符合通勤 30 分钟内的房源...',
    date: '刚刚',
    tags: ['找房']
  },
  {
    id: '2',
    title: '咨询租房合同违约金条款',
    preview: '根据《民法典》相关规定...',
    date: '昨天',
    tags: ['合同']
  },
  {
    id: '3',
    title: '8月份电费异常查询',
    preview: '已调取 8 月份智能电表数据...',
    date: '8/15',
    tags: ['账单']
  }
];

// Mock Data for Bills and Contracts
const HISTORY_BILLS: BillItem[] = [
  {
    id: 'b1',
    month: '9月',
    title: '9月租金及押金(首月)',
    date: '2023-09-02 14:30',
    amount: '¥ 9,000.00',
    status: 'PAID',
    contractTitle: '华润城万象天地 3栋 1802室',
    billingCycle: '2023.09.01 - 2023.09.30',
    details: {
      rent: '4,500.00',
      deposit: '4,500.00',
      total: '9,000.00'
    }
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
  {
    id: 'b3',
    month: '10月',
    title: '10月租金',
    date: '2023-10-01 09:00',
    amount: '¥ 4,500.00',
    status: 'PENDING',
    contractTitle: '华润城万象天地 3栋 1802室',
    billingCycle: '2023.10.01 - 2023.10.31',
    details: { rent: '4,500.00', total: '4,500.00' }
  }
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
    paymentTerms: '押一付三',
    paymentDay: 5,
    lateFeePolicy: '日租金 0.1% / 天',
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
    paymentTerms: '押一付一',
    paymentDay: 1,
    lateFeePolicy: '固定 ¥100 / 天',
    timeline: [
      { date: '2023.10.30', event: '合同自然到期', icon: 'event_busy' },
      { date: '2023.11.02', event: '押金已退还', icon: 'price_check' },
    ]
  },
];

// Sidebar Component
const Sidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName, params?: any) => void;
  isLoggedIn: boolean;
  sessions: ChatSession[];
}> = ({ isOpen, onClose, currentScreen, onNavigate, isLoggedIn, sessions }) => {

  const SidebarMenuButton = ({ icon, label, onClick, badge }: { icon: string, label: string, onClick: () => void, badge?: boolean }) => (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-3 group"
    >
      <div className="mt-0.5 text-slate-400 group-hover:text-primary transition-colors relative">
        <Icon name={icon} size={22} />
        {badge && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-[#f8fafc] rounded-full"></span>
        )}
      </div>
      <div className="flex-1 flex items-center justify-between min-w-0">
        <span className="text-sm font-medium text-slate-700 truncate group-hover:text-slate-900">{label}</span>
      </div>
    </button>
  );

  const HistoryItem: React.FC<{ item: ChatSession }> = ({ item }) => (
    <button
      onClick={() => { onNavigate('HOME', { session: item }); onClose(); }}
      className="w-full text-left p-3 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-3 group"
    >
      <span className="text-sm font-medium text-slate-700 truncate group-hover:text-slate-900 flex-1">{item.title}</span>
    </button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-[#f8fafc] z-50 shadow-2xl flex flex-col"
          >
            <div className="h-safe-top w-full"></div>
            <div className="h-8 w-full"></div>

            <div className="flex-1 overflow-y-auto pb-safe px-4 no-scrollbar">
              <div className="flex flex-col gap-1 mb-6 mt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">常用功能</h3>
                <SidebarMenuButton
                  icon="smart_toy"
                  label="智寓"
                  onClick={() => { onNavigate('HOME', { reset: true }); }}
                />
                <SidebarMenuButton
                  icon="explore"
                  label="发现房源"
                  onClick={() => { onNavigate('EXPLORE'); }}
                />
                {/* Corrected Navigation */}
                <SidebarMenuButton
                  icon="favorite"
                  label="我的收藏"
                  onClick={() => { onNavigate('FAVORITES'); }}
                />
                {/* Separated Bills and Contracts */}
                <SidebarMenuButton
                  icon="receipt_long"
                  label="我的账单"
                  badge={true}
                  onClick={() => { onNavigate('BILLS'); }}
                />
                <SidebarMenuButton
                  icon="description"
                  label="租房合同"
                  onClick={() => { onNavigate('CONTRACTS'); }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between px-3 mb-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">对话历史</h3>
                </div>
                {isLoggedIn ? (
                  <div className="space-y-1">
                    {sessions.slice(0, 10).map(s => <HistoryItem key={s.id} item={s} />)}
                    {sessions.length > 0 && (
                      <button
                        onClick={() => { onNavigate('HISTORY'); }}
                        className="w-full py-3 text-xs text-slate-400 font-medium hover:text-slate-600 transition-colors flex items-center justify-center gap-1"
                      >
                        查看全部 <Icon name="chevron_right" size={14} />
                      </button>
                    )}
                    {sessions.length === 0 && (
                      <p className="text-xs text-slate-400 px-3 py-2 italic text-center">暂无对话记录</p>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => { onNavigate('LOGIN'); }}
                    className="bg-slate-100 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-200 transition-colors"
                  >
                    <p className="text-sm font-bold text-slate-500 mb-1">登录查看历史记录</p>
                    <p className="text-xs text-slate-400">AI 帮您记忆所有看房偏好</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white/50 backdrop-blur-sm pb-safe-bottom">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { onNavigate('PROFILE'); }}
                    className="flex-1 flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors text-left min-w-0"
                  >
                    <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-slate-200 to-slate-400 shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80"
                        className="w-full h-full rounded-full object-cover border-2 border-white"
                        alt="Avatar"
                      />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm font-bold text-slate-900 truncate">Peterleo</h2>
                      <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">已登录</p>
                    </div>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('SETTINGS');
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
                  >
                    <Icon name="settings" size={22} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { onNavigate('LOGIN'); }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                    <Icon name="person" size={24} />
                  </div>
                  <div className="text-left">
                    <h2 className="text-sm font-bold text-slate-900">点击登录/注册</h2>
                    <p className="text-slate-500 text-[10px]">登录解锁完整 AI 服务</p>
                  </div>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(() => {
    return localStorage.getItem('isLoggedIn') === 'true' ? 'HOME' : 'LOGIN';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<ScreenName | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('themeMode') as 'light' | 'dark' | 'system') || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isDark = themeMode === 'dark' || (themeMode === 'system' && mediaQuery.matches);
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();
    localStorage.setItem('themeMode', themeMode);

    if (themeMode === 'system') {
      const handler = () => applyTheme();
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [themeMode]);

  // Chat Sessions Storage
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('chatSessions');
    return saved ? JSON.parse(saved) : [];
  });

  // Dynamic Data State
  const [properties, setProperties] = useState<Property[]>(ALL_PROPERTIES);
  const [bills, setBills] = useState<BillItem[]>(HISTORY_BILLS);
  const [contracts, setContracts] = useState<ContractItem[]>(HISTORY_CONTRACTS);

  // User Mode State: 'SEEKER' (Finding home) or 'TENANT' (Living in home)
  const [userMode, setUserMode] = useState<'SEEKER' | 'TENANT'>(() => {
    return (localStorage.getItem('userMode') as 'SEEKER' | 'TENANT') || 'SEEKER';
  });

  // Global City State
  const [currentCity, setCurrentCity] = useState<string>(() => localStorage.getItem('currentCity') || '');

  // Favorites State (Global)
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // AI Personalization State
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => localStorage.getItem('hasCompletedOnboarding') === 'true');
  const [userPreferences, setUserPreferences] = useState<UserPreferences | undefined>(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : undefined;
  });
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Navigation Data State
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [signedPropertyId, setSignedPropertyId] = useState<string | null>(null);
  const [selectedBill, setSelectedBill] = useState<BillItem | null>(null);
  const [selectedContract, setSelectedContract] = useState<ContractItem | null>(null);

  // Home Screen Reset & History State
  const [homeKey, setHomeKey] = useState(0);
  const [homeInitialMessages, setHomeInitialMessages] = useState<Message[]>([]);
  const [homeSessionId, setHomeSessionId] = useState<string | undefined>(undefined);
  const [homeAutoRespond, setHomeAutoRespond] = useState(false);
  const [homeContextProperty, setHomeContextProperty] = useState<Property | undefined>(undefined);

  // Overlays
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [showVR, setShowVR] = useState(false);
  const [showSigning, setShowSigning] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Derived State
  const pendingBillCount = bills.filter(b => b.status === 'PENDING').length;

  const getSelectedProperty = () => properties.find(p => p.id === selectedPropertyId);

  // Filter Properties based on City
  const filteredProperties = useMemo(() => {
    return properties.filter(p => p.city === currentCity);
  }, [properties, currentCity]);

  // Toggle Favorite
  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');

    if (redirectAfterLogin) {
      setCurrentScreen(redirectAfterLogin);
      setRedirectAfterLogin(null);
      return;
    }

    if (!currentCity) {
      setCurrentScreen('CITY_SELECTION');
    } else {
      checkOnboardingStatus();
    }
  };

  const handleGuestMode = () => {
    setIsLoggedIn(false);
    // Guest mode also needs city selection context if not set
    if (!currentCity) {
      setCurrentScreen('CITY_SELECTION');
    } else {
      checkOnboardingStatus();
    }
  };

  const checkOnboardingStatus = () => {
    // Logic: If user hasn't done onboarding, show it overlaying HOME
    if (userMode === 'SEEKER' && !hasCompletedOnboarding) {
      setCurrentScreen('HOME');
      setShowOnboarding(true);
    } else {
      setCurrentScreen(userMode === 'TENANT' ? 'TENANT_HOME' : 'HOME');
    }
  };

  const handleCitySelect = (city: string) => {
    setCurrentCity(city);
    localStorage.setItem('currentCity', city);
    // After city select, assume onboarding check
    checkOnboardingStatus();
  };

  const handleOnboardingComplete = (prefs: UserPreferences) => {
    setUserPreferences(prefs);
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
    setHasCompletedOnboarding(true);
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
  };

  const navigate = (screen: ScreenName, params?: any) => {
    const protectedScreens: ScreenName[] = ['FAVORITES', 'BILLS', 'CONTRACTS', 'PROFILE', 'TENANT_HOME'];

    if (protectedScreens.includes(screen) && !isLoggedIn) {
      setRedirectAfterLogin(screen);
      setCurrentScreen('LOGIN');
      setIsSidebarOpen(false);
      return;
    }

    // Handle Home Reset or History Loading
    if (screen === 'HOME') {
      if (params?.reset) {
        setHomeKey(prev => prev + 1);
        setHomeInitialMessages([]);
        setHomeSessionId(undefined); // Reset session ID for new chat
        setHomeAutoRespond(false);
        setHomeContextProperty(undefined);
      } else if (params?.session) {
        setHomeKey(prev => prev + 1);
        setHomeInitialMessages(params.session.messages || []);
        setHomeSessionId(params.session.id); // Set session ID for history loading
        setHomeAutoRespond(false);
        setHomeContextProperty(undefined);
      } else if (params?.autoRespond) {
        setHomeKey(prev => prev + 1);
        setHomeInitialMessages(params.initialMessages || []);
        setHomeSessionId(undefined);
        setHomeAutoRespond(true);
        setHomeContextProperty(params.contextProperty);
      }
    }

    if (screen === 'HOME' && userMode === 'TENANT') {
      setCurrentScreen('TENANT_HOME');
    } else {
      setCurrentScreen(screen);
    }

    setIsSidebarOpen(false);
    setShowPropertyDetails(false);
    setShowVR(false);
    setShowSigning(false);
    setShowChat(false);
  };

  // Switch Mode Logic
  const handleSwitchMode = (mode: 'SEEKER' | 'TENANT') => {
    setUserMode(mode);
    localStorage.setItem('userMode', mode);
    if (mode === 'SEEKER') {
      navigate('HOME');
    } else {
      navigate('TENANT_HOME');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    navigate('LOGIN');
  };

  const handlePayBills = (billIds: string[]) => {
    setBills(prev => prev.map(b =>
      billIds.includes(b.id) ? { ...b, status: 'PAID', date: new Date().toLocaleString('zh-CN') } : b
    ));
  };

  const handleSaveSession = React.useCallback((messages: Message[], currentSessionId?: string) => {
    if (messages.length === 0) return '';

    let savedSessionId = currentSessionId;

    setSessions(prev => {
      // Find if we have an "active" session (by ID) or create a new one
      const existingIndex = prev.findIndex(s => s.id === currentSessionId);

      const firstUserMsg = messages.find(m => m.sender === 'user')?.text || '';
      const lastAIMsg = [...messages].reverse().find(m => m.sender === 'ai')?.text || '';

      const title = firstUserMsg.length > 15 ? firstUserMsg.substring(0, 15) + '...' : (firstUserMsg || '新对话');
      const preview = lastAIMsg.length > 30 ? lastAIMsg.substring(0, 30) + '...' : (lastAIMsg || '点击查看详情');

      if (existingIndex !== -1) {
        // Update existing session
        const updatedSession = {
          ...prev[existingIndex],
          title: prev[existingIndex].title === '新对话' ? title : prev[existingIndex].title, // Keep original title unless it was generic? Or update dynamic? Let's keep dynamic for now or user preference. The user prompt says "history is one record per conversation". Updating title dynamically is fine.
          preview: preview,
          messages: messages,
          date: '刚刚' // Update date on interaction
        };

        const next = [...prev];
        next[existingIndex] = updatedSession;
        // Move to top?
        next.splice(existingIndex, 1);
        next.unshift(updatedSession);

        localStorage.setItem('chatSessions', JSON.stringify(next));
        return next;

      } else {
        // Create new session
        const newSessionId = `sess-${Date.now()}`;
        savedSessionId = newSessionId; // Capture for return

        const newSession: ChatSession = {
          id: newSessionId,
          title: title,
          preview: preview,
          date: '今天',
          tags: ['AI 推荐'],
          messages: messages
        };

        const next = [newSession, ...prev];
        if (next.length > 20) next.pop();

        localStorage.setItem('chatSessions', JSON.stringify(next));
        return next;
      }
    });

    return savedSessionId || '';
  }, []);

  const handleDeleteSession = (id: string) => {
    setSessions(prev => {
      const next = prev.filter(s => s.id !== id);
      localStorage.setItem('chatSessions', JSON.stringify(next));
      return next;
    });
  };

  const handleDeleteSessions = (ids: string[]) => {
    setSessions(prev => {
      const next = prev.filter(s => !ids.includes(s.id));
      localStorage.setItem('chatSessions', JSON.stringify(next));
      return next;
    });
  };

  const handleConfirmSigning = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    const now = new Date();
    const todayStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
    const nextYearDate = new Date();
    nextYearDate.setFullYear(now.getFullYear() + 1);
    const nextYearStr = nextYearDate.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');

    // 1. Update Property Status
    setProperties(prev => prev.map(p =>
      p.id === propertyId ? { ...p, tags: [...p.tags, '已签约'] } : p
    ));

    // 2. Add New Contract (Consistent with Property)
    const newContract: ContractItem = {
      id: `c${Date.now()}`,
      title: `${now.getFullYear()} 房屋租赁合同`,
      propertyTitle: property.title,
      propertyAddress: property.location,
      status: 'ACTIVE',
      startDate: todayStr,
      endDate: nextYearStr,
      rentAmount: property.price.toLocaleString(),
      deposit: property.price.toLocaleString(),
      depositStatus: 'HOSTED',
      signDate: todayStr,
      landlord: '智寓管家',
      tenant: 'Peterleo',
      paymentTerms: property.paymentType,
      paymentDay: 5,
      lateFeePolicy: '日租金 0.1% / 天',
      timeline: [
        { date: todayStr, event: '合同签署成功', icon: 'draw' },
        { date: todayStr, event: '租期开始', icon: 'check_circle' },
      ]
    };
    setContracts(prev => [...prev, newContract]); // Changed to append

    // 3. Add Initial Bill (Rent + Deposit = Price * 2)
    const totalAmount = property.price * 2;
    const newBill: BillItem = {
      id: `b${Date.now()}`,
      month: `${now.getMonth() + 1}月`,
      title: `${now.getMonth() + 1}月租金及押金`,
      date: new Date().toLocaleString('zh-CN'),
      amount: `¥ ${totalAmount.toLocaleString()}`,
      status: 'PENDING',
      contractTitle: property.title,
      billingCycle: `${todayStr} - ${new Date(now.getFullYear(), now.getMonth() + 1, 0).toLocaleDateString('zh-CN').replace(/\//g, '.')}`,
      details: {
        rent: property.price.toLocaleString(),
        deposit: property.price.toLocaleString(),
        total: totalAmount.toLocaleString()
      }
    };
    setBills(prev => [...prev, newBill]); // Changed to append

    // 4. Update Global State and Navigate
    setSignedPropertyId(propertyId);
    navigate('CONTRACTS');
  };

  return (
    <div className="h-full w-full bg-white dark:bg-[#101922] overflow-hidden relative font-sans flex flex-col transition-colors duration-300">
      <div className="flex-1 w-full bg-white dark:bg-[#101922] overflow-hidden relative">
        <AnimatePresence mode="wait">
          {currentScreen === 'LOGIN' && (
            <motion.div key="login" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoginScreen onLoginSuccess={handleLoginSuccess} onGuestMode={handleGuestMode} />
            </motion.div>
          )}

          {currentScreen === 'CITY_SELECTION' && (
            <motion.div key="city_select" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CitySelectionScreen
                onSelectCity={handleCitySelect}
                currentCity={currentCity}
              />
            </motion.div>
          )}

          {currentScreen === 'HOME' && (
            <HomeScreen
              key={`home-${homeKey}`} // Key force remount for reset/history
              initialMessages={homeInitialMessages} // Pass history messages
              initialSessionId={homeSessionId} // Pass initial session ID
              properties={filteredProperties} // Use filtered properties
              onPropertyClick={(id) => { setSelectedPropertyId(id); setShowPropertyDetails(true); }}
              onOpenMenu={() => setIsSidebarOpen(true)}
              onStartSigning={(id) => { setSelectedPropertyId(id); setShowSigning(true); }}
              signedPropertyId={signedPropertyId}
              onViewBills={() => navigate('BILLS')}
              pendingBillCount={pendingBillCount}
              currentCity={currentCity}
              userPreferences={userPreferences} // Pass prefs to Home for visual feedback
              onSaveSession={handleSaveSession}
              onExploreMore={() => navigate('EXPLORE')}
              autoRespond={homeAutoRespond}
              contextProperty={homeContextProperty}
            />
          )}

          {currentScreen === 'TENANT_HOME' && (
            <TenantHomeScreen
              onSwitchToSeeker={() => handleSwitchMode('SEEKER')}
              onNavigate={navigate}
              pendingBillCount={pendingBillCount}
              onOpenMenu={() => setIsSidebarOpen(true)}
              onSaveSession={handleSaveSession}
            />
          )}

          {currentScreen === 'EXPLORE' && (
            <ExploreScreen
              properties={filteredProperties} // Use filtered properties
              onPropertyClick={(id) => { setSelectedPropertyId(id); setShowPropertyDetails(true); }}
              onBack={() => navigate('HOME')}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
              currentCity={currentCity}
            />
          )}

          {currentScreen === 'FAVORITES' && (
            <motion.div key="favorites" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FavoritesScreen
                onBack={() => navigate('HOME')}
                properties={properties} // Pass dynamic properties to filter
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
                onPropertyClick={(id) => { setSelectedPropertyId(id); setShowPropertyDetails(true); }}
              />
            </motion.div>
          )}

          {currentScreen === 'BILLS' && (
            <BillsScreen
              bills={bills}
              properties={properties}
              onBack={() => navigate('HOME')}
              onSelectBill={(bill) => { setSelectedBill(bill); navigate('BILL_DETAILS'); }}
              onPayBills={handlePayBills}
            />
          )}

          {currentScreen === 'BILL_DETAILS' && selectedBill && (
            <BillDetailsScreen
              bill={selectedBill}
              onBack={() => navigate('BILLS')}
              onPayBill={(id) => handlePayBills([id])}
            />
          )}

          {currentScreen === 'CONTRACTS' && (
            <ContractsScreen
              contracts={contracts}
              onBack={() => navigate('HOME')}
              onSelectContract={(contract) => { setSelectedContract(contract); navigate('CONTRACT_DETAILS'); }}
            />
          )}

          {currentScreen === 'CONTRACT_DETAILS' && selectedContract && (
            <ContractDetailsScreen contract={selectedContract} onBack={() => navigate('CONTRACTS')} />
          )}

          {currentScreen === 'PROFILE' && (
            <ProfileScreen
              onBack={() => navigate('HOME')}
              userPreferences={userPreferences}
              onUpdatePreferences={setUserPreferences}
            />
          )}

          {currentScreen === 'HISTORY' && (
            <HistoryScreen
              sessions={sessions}
              onBack={() => navigate('HOME')}
              onSelectSession={(id) => {
                const session = sessions.find(s => s.id === id);
                if (session) navigate('HOME', { session });
              }}
              onDeleteSession={handleDeleteSession}
              onDeleteSessions={handleDeleteSessions}
            />
          )}

          {currentScreen === 'SETTINGS' && (
            <SettingsScreen
              onBack={() => navigate('HOME')}
              onLogout={handleLogout}
              currentMode={userMode}
              onSwitchMode={handleSwitchMode}
              onChangeCity={() => navigate('CITY_SELECTION')}
              currentCity={currentCity}
              themeMode={themeMode}
              onThemeChange={setThemeMode}
            />
          )}

        </AnimatePresence>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {showOnboarding && (
          <AIOnboardingOverlay
            onComplete={handleOnboardingComplete}
            onSkip={() => { setHasCompletedOnboarding(true); setShowOnboarding(false); }}
          />
        )}

        {showPropertyDetails && selectedPropertyId && (
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className="fixed inset-0 z-30 bg-white"
          >
            <PropertyDetailsScreen
              property={getSelectedProperty()!}
              onBack={() => setShowPropertyDetails(false)}
              onEnterVR={() => setShowVR(true)}
              isFavorite={getSelectedProperty() ? favoriteIds.has(getSelectedProperty()!.id) : false}
              onToggleFavorite={() => handleToggleFavorite(selectedPropertyId!)}
              isSigned={selectedPropertyId === signedPropertyId}
              onSign={() => {
                if (selectedPropertyId === signedPropertyId) {
                  setShowPropertyDetails(false);
                  navigate('CONTRACTS');
                } else {
                  setShowSigning(true);
                }
              }}
              onConsult={() => {
                const prop = getSelectedProperty();
                if (prop) {
                  setShowPropertyDetails(false);
                  navigate('HOME', {
                    autoRespond: true,
                    contextProperty: prop,
                    initialMessages: [{
                      id: Date.now().toString(),
                      type: 'TEXT',
                      text: `帮我介绍一下这套房源：${prop.title}`,
                      sender: 'user',
                      timestamp: new Date()
                    }]
                  });
                } else {
                  setShowChat(true);
                }
              }}
            />
          </motion.div>
        )}

        {showVR && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black"
          >
            <VRViewScreen onBack={() => setShowVR(false)} onSign={() => { setShowVR(false); setShowSigning(true); }} />
          </motion.div>
        )}

        {showSigning && (
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className="fixed inset-0 z-40 bg-white"
          >
            <SigningFlow
              property={getSelectedProperty()!}
              onComplete={() => {
                setShowSigning(false);
                setShowPropertyDetails(false);
                if (selectedPropertyId) {
                  setSignedPropertyId(selectedPropertyId);
                  handleConfirmSigning(selectedPropertyId);
                }
              }}
              onCancel={() => setShowSigning(false)}
            />
          </motion.div>
        )}

        {showChat && (
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className="fixed inset-0 z-50 bg-white"
          >
            <ChatScreen
              onClose={() => setShowChat(false)}
              initialProperty={getSelectedProperty()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentScreen={currentScreen}
        onNavigate={navigate}
        isLoggedIn={isLoggedIn}
        sessions={sessions}
      />
    </div>
  );
};

export default App;