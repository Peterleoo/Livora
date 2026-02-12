import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/Icon';
import { Property, Message, UserPreferences } from '../types';
import { GoogleGenAI } from "@google/genai";
import { AIFluidOrbs, AIThinkingDots } from '../components/AIVisualization';

interface HomeScreenProps {
  onPropertyClick: (id: string) => void;
  properties: Property[];
  onOpenMenu: () => void;
  onStartSigning: (id: string) => void;
  signedPropertyId?: string | null;
  onViewBills?: () => void;
  pendingBillCount?: number;
  currentCity: string;
  userPreferences?: UserPreferences;
  onSaveSession: (messages: Message[], sessionId?: string) => string;
  onExploreMore: () => void;
  initialMessages?: Message[];
  initialSessionId?: string;
  autoRespond?: boolean;
  contextProperty?: Property;
}

// 1. Property Card (Premium Light Version)
const PropertyCard: React.FC<{ item: Property; onClick: () => void }> = ({ item, onClick }) => (
  <motion.div
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden border border-white/40 dark:border-slate-800 min-w-[240px] shrink-0 transition-all"
  >
    <div className="h-32 relative">
      <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] text-indigo-600 font-bold flex items-center gap-1 shadow-sm">
        <Icon name="bolt" size={10} className="text-amber-400" />
        {item.matchScore}%
      </div>
    </div>
    <div className="p-3">
      <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">{item.title}</h4>
      <div className="flex justify-between items-center mt-2">
        <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">¥{item.price}<span className="text-xs font-normal text-slate-400">/月</span></span>
        <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-md">{item.specs.area}㎡</span>
      </div>
    </div>
  </motion.div>
);

// 2. Contract Card (Premium Light Version)
const ContractCard: React.FC<{ item: Property; onSign: () => void; isSigned?: boolean; onPay?: () => void }> = ({ item, onSign, isSigned, onPay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-xl rounded-[24px] shadow-xl overflow-hidden border mt-2 transition-all duration-500 ${isSigned ? 'border-emerald-200 dark:border-emerald-900/30' : 'border-indigo-100 dark:border-indigo-900/30'} max-w-[300px]`}
  >
    <div className="p-4 flex gap-4">
      <img src={item.image} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt={item.title} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{item.title}</h4>
          {isSigned && <Icon name="check_circle" size={16} className="text-emerald-500" />}
        </div>
        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">{item.location}</p>
        <div className="text-indigo-600 dark:text-indigo-400 font-bold text-xs mt-1">¥{item.price}<span className="text-slate-400 font-normal">/月</span></div>
      </div>
    </div>

    <div className={`p-3 pt-0`}>
      {isSigned ? (
        <button
          onClick={onPay}
          className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all"
        >
          <Icon name="credit_card" size={14} />
          已签约，立即支付
        </button>
      ) : (
        <button
          onClick={onSign}
          className="w-full bg-indigo-600 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all"
        >
          <Icon name="edit_document" size={14} />
          立即在线签约
        </button>
      )}
    </div>
  </motion.div>
);

// 3. Daily Pick Card (Premium Light Carousel)
const DailyPickSmallCard: React.FC<{ item: Property; onClick: () => void }> = ({ item, onClick }) => (
  <motion.div
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    className="inline-block w-[260px] whitespace-normal align-top mr-4 bg-white dark:bg-[#1a1a1a] rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-800 cursor-pointer snap-center relative overflow-hidden group"
  >
    <div className="w-full h-36 rounded-2xl overflow-hidden relative mb-3">
      <motion.img
        initial={{ scale: 1.1 }}
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.6 }}
        src={item.image}
        className="w-full h-full object-cover"
        alt="Daily Pick"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      <div className="absolute top-2 left-2 bg-white/30 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] text-white font-bold border border-white/30">
        AI 严选
      </div>
      <div className="absolute bottom-2 right-2 flex items-center gap-1 text-white">
        <Icon name="bolt" size={12} className="text-amber-400" />
        <span className="text-xs font-bold">{item.matchScore}%</span>
      </div>
    </div>

    <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate mb-1">{item.title}</h3>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-1">
        <Icon name="location_on" size={10} className="text-slate-400" />
        <span className="text-[10px] text-slate-400 font-medium">{item.location}</span>
      </div>
      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">¥{item.price}</span>
    </div>
  </motion.div>
);

const SUGGESTION_SCENARIOS = [
  {
    label: "通勤优先",
    items: [
      { icon: 'train', text: '近地铁一号线' },
      { icon: 'work', text: '科技园通勤30分' },
      { icon: 'paid', text: '预算8000以内' },
      { icon: 'electric_bolt', text: '民水民电' }
    ]
  },
  {
    label: "爱宠生活",
    items: [
      { icon: 'pets', text: '允许养猫狗' },
      { icon: 'balcony', text: '带大阳台' },
      { icon: 'park', text: '附近有公园' },
      { icon: 'cleaning_services', text: '含保洁服务' }
    ]
  },
  {
    label: "高性价比",
    items: [
      { icon: 'group', text: '青年社群合租' },
      { icon: 'verified', text: '押一付一' },
      { icon: 'security', text: '高安全性小区' },
      { icon: 'local_shipping', text: '可短租' }
    ]
  }
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPropertyClick,
  properties,
  onOpenMenu,
  onStartSigning,
  signedPropertyId,
  onViewBills,
  pendingBillCount = 0,
  currentCity,
  userPreferences,
  onSaveSession,
  onExploreMore,
  initialMessages = [],
  initialSessionId,
  autoRespond = false,
  contextProperty
}) => {
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastRecommended, setLastRecommended] = useState<Property[]>(contextProperty ? [contextProperty] : []);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (signedPropertyId) {
      setMessages(prevMessages => prevMessages.map(msg => {
        if (msg.type === 'CONTRACT_CARD' && msg.data?.id === signedPropertyId) {
          return { ...msg, text: `恭喜您！**${msg.data.title}** 签约成功。请及时支付相关费用。` };
        }
        return msg;
      }));
    }
  }, [signedPropertyId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (messages.length > 0) {
      const newId = onSaveSession(messages, sessionId);
      if (newId && newId !== sessionId) {
        setSessionId(newId);
      }
    }
  }, [messages, isTyping, onSaveSession, sessionId]);

  // Restore context from history on load
  useEffect(() => {
    const lastCardMsg = [...messages].reverse().find(m => m.type === 'PROPERTY_CARDS' && m.data);
    if (lastCardMsg && Array.isArray(lastCardMsg.data)) {
      setLastRecommended(lastCardMsg.data as Property[]);
    }
  }, []); // Run once on mount to restore context


  const formatMessageText = (text: string) => {
    if (!text) return null;
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-indigo-700">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleStartListening = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setInputValue("帮我找南山科技园附近，租金8000左右的两室一厅");
    }, 3000);
  };

  const retrieveContext = (query: string): Property[] => {
    const q = query.toLowerCase();
    return properties.filter(p => {
      const searchContent = `${p.title} ${p.location} ${p.tags.join(' ')} ${p.facilities.join(' ')} ${p.price}`.toLowerCase();
      if (q.includes('南山') && p.location.includes('南山')) return true;
      if (q.includes('福田') && p.location.includes('福田')) return true;
      if (q.includes('两室') && p.specs.beds === 2) return true;
      if (q.includes('三室') && p.specs.beds === 3) return true;
      if (q.includes('便宜') && p.price < 9000) return true;
      if (q.includes('海景') && p.tags.includes('海景')) return true;
      if (q.includes('宠物') && (p.tags.includes('可养宠') || p.facilities.includes('PetFriendly'))) return true;
      return searchContent.includes(q) || (q.length > 2 && searchContent.includes(q.substring(0, 2)));
    });
  };

  const generateResponse = async (userText: string, currentMessages: Message[]) => {
    try {
      const lowerInput = userText.toLowerCase();
      const signKeywords = ['签', '租', '定', 'sign', 'book', 'contract'];
      const isSignIntent = signKeywords.some(k => lowerInput.includes(k));

      if (isSignIntent && lastRecommended.length > 0) {
        let targetIndex = -1;
        if (lowerInput.includes('第一') || lowerInput.includes('1') || lowerInput.includes('first') || lowerInput.includes('这套')) targetIndex = 0;
        else if (lowerInput.includes('第二') || lowerInput.includes('2') || lowerInput.includes('second')) targetIndex = 1;
        else if (lowerInput.includes('第三') || lowerInput.includes('3') || lowerInput.includes('third')) targetIndex = 2;
        else if (lastRecommended.length === 1) targetIndex = 0;

        if (targetIndex !== -1 && lastRecommended[targetIndex]) {
          const targetProp = lastRecommended[targetIndex];
          return {
            type: 'CONTRACT_CARD' as const,
            text: `好的，已为您准备好**${targetProp.title}**的电子合约。请确认房源信息无误后，点击下方按钮开始签约。`,
            data: targetProp
          };
        }
      }

      const relevantProperties = retrieveContext(userText);
      if (relevantProperties.length > 0) {
        setLastRecommended(relevantProperties);
      }

      const contextData = relevantProperties.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        location: p.location,
        features: p.tags.join(', ')
      }));

      const contextString = relevantProperties.length > 0
        ? `\n\n[检索到的相关房源数据 (参考这些数据回答，如果合适请推荐)]: ${JSON.stringify(contextData)}`
        : `\n\n`;

      const systemPrompt = `你是一个专业的AI租房顾问“智寓AI”。
      用户当前的城市是：${currentCity}。你的所有推荐必须严格限制在这个城市。
      请语气亲切、专业。回答请简练，不要长篇大论。
      **重要**：如果用户询问之前推荐过的房源（如“这套”、“第一套”），请根据上下文历史中的[User was shown properties]信息进行回答。`;

      const historyPayload = currentMessages.slice(-10).map(msg => {
        let content = msg.text || '';
        if (msg.sender === 'ai' && msg.type === 'PROPERTY_CARDS' && Array.isArray(msg.data)) {
          const props = msg.data as Property[];
          content += `\n[System: User was shown these properties: ${JSON.stringify(props.map(p => ({ id: p.id, title: p.title, price: p.price, location: p.location })))}]`;
        }
        return {
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: content
        };
      });

      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
      const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || "https://generativelanguage.googleapis.com";

      let aiResponseText = "";
      const maxRetries = 3;

      let response;
      for (let i = 0; i < maxRetries; i++) {
        try {
          response = await fetch(`${baseUrl}/v1/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: 'gemini-1.5-flash',
              messages: [
                { role: 'system', content: systemPrompt },
                ...historyPayload,
                { role: 'user', content: userText + contextString }
              ],
              stream: false
            })
          });

          if (response.status === 503) {
            await new Promise(resolve => setTimeout(resolve, 1500 * (i + 1)));
            continue;
          }

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || `HTTP ${response.status}`);
          }

          const data = await response.json();
          aiResponseText = data.choices[0]?.message?.content || "";
          break;
        } catch (networkErr: any) {
          if (i === maxRetries - 1) throw networkErr;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return {
        type: 'TEXT' as const,
        text: aiResponseText || '抱歉，我现在有点繁忙，请稍后再试。',
        data: relevantProperties.length > 0 ? relevantProperties : undefined
      };

    } catch (err: any) {
      console.error("AI Error:", err);
      let errorMsg = "抱歉，通讯出现状况，请稍后再试。";
      if (err.message?.includes('429')) errorMsg = "抱歉，AI 思考次数已达上限。请稍后再试。";
      return { type: 'TEXT' as const, text: errorMsg };
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userText = inputValue;
    setInputValue('');

    const newUserMsg: Message = {
      id: Date.now().toString(),
      type: 'TEXT',
      text: userText,
      sender: 'user',
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    const result = await generateResponse(userText, updatedMessages);
    setIsTyping(false);

    const aiMsgs: Message[] = [{
      id: (Date.now() + 1).toString(),
      type: result.type,
      text: result.text,
      sender: 'ai',
      timestamp: new Date(),
      data: result.data
    }];

    if (result.type === 'TEXT' && result.data && Array.isArray(result.data)) {
      aiMsgs.push({
        id: (Date.now() + 2).toString(),
        type: 'PROPERTY_CARDS',
        sender: 'ai',
        timestamp: new Date(),
        data: result.data
      });
    }

    setMessages(prev => [...prev, ...aiMsgs]);
  };

  useEffect(() => {
    if (autoRespond && messages.length > 0 && messages.some(m => m.sender === 'user')) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === 'user' && !messages.some(m => m.sender === 'ai' && m.id > lastMsg.id)) {
        const triggerAuto = async () => {
          setIsTyping(true);
          const result = await generateResponse(lastMsg.text, messages);
          setIsTyping(false);
          const aiMsgs: Message[] = [{
            id: (Date.now() + 1).toString(),
            type: result.type,
            text: result.text,
            sender: 'ai',
            timestamp: new Date(),
            data: result.data
          }];
          if (result.type === 'TEXT' && result.data && Array.isArray(result.data)) {
            aiMsgs.push({
              id: (Date.now() + 2).toString(),
              type: 'PROPERTY_CARDS',
              sender: 'ai',
              timestamp: new Date(),
              data: result.data
            });
          }
          setMessages(prev => [...prev, ...aiMsgs]);
        };
        triggerAuto();
      }
    }
  }, [autoRespond]);

  const VoiceOverlay = () => (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-white/40 backdrop-blur-md flex items-end justify-center"
      onClick={() => setIsListening(false)}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        className="w-full bg-white rounded-t-[40px] p-10 pb-16 flex flex-col items-center relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-12 h-16 flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 bg-indigo-500 rounded-full"
              animate={{ height: [15, 60, 15] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">正在听...</h3>
        <p className="text-slate-400 text-sm">“我想找南山区的两房”</p>
        <div className="mt-10">
          <button
            onClick={() => setIsListening(false)}
            className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-200 active:scale-90 transition-all"
          >
            <Icon name="mic_off" className="text-white" size={28} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  const AI_SUGGESTIONS = [
    "帮我找南山科技园附近，租金8000左右的两室一厅",
    "想要一个带大阳台的房子，一定要可以养宠物",
    "推荐几个高性价比的合租房，最好全是女生",
    "我在福田上班，通勤时间30分钟内的房源有哪些？"
  ];

  const SuggestionPills = () => (
    <div className="w-full px-6 mt-2">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Icon name="auto_awesome" size={14} className="text-indigo-500" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">
          AI 猜你想问
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {AI_SUGGESTIONS.map((text, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setInputValue(text); }}
            className="w-full bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700 px-5 py-4 rounded-xl text-left shadow-sm hover:shadow-md transition-all group"
          >
            <span className="text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed group-hover:text-indigo-900 dark:group-hover:text-white transition-colors">
              {text}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const DailyPickCarousel = () => (
    <div className="w-full mb-8 mt-4">
      <div className="px-6 mb-4 flex justify-between items-end">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">今日精选</h2>
        <button onClick={onExploreMore} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 active:opacity-70">查看更多</button>
      </div>
      <div className="overflow-x-auto no-scrollbar px-6 pb-2 snap-x snap-mandatory whitespace-nowrap">
        {properties.length > 0 ? properties.map(p => (
          <DailyPickSmallCard key={p.id} item={p} onClick={() => onPropertyClick(p.id)} />
        )) : (
          <div className="w-full text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-400">该城市暂无房源</p>
          </div>
        )}
        <div className="inline-block w-[20px] h-1"></div>
      </div>
    </div>
  );

  const Header = () => (
    <header className="flex justify-between items-center px-6 pt-[calc(0.5rem+env(safe-area-inset-top,0px))] pb-4 sticky top-0 left-0 w-full bg-[#f8fafc]/80 dark:bg-[#101922]/80 backdrop-blur-xl z-30 border-b border-slate-100 dark:border-slate-800">
      <button
        onClick={onOpenMenu}
        className="group flex flex-col justify-center items-start gap-1 p-3 -ml-3 rounded-full hover:bg-white/40 transition-all active:scale-95"
      >
        <span className="w-6 h-0.5 bg-slate-900 dark:bg-white rounded-full group-hover:w-7 transition-all"></span>
        <span className="w-4 h-0.5 bg-slate-900 dark:bg-white rounded-full group-hover:w-6 transition-all"></span>
      </button>

      {userPreferences && (
        <div className="flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50 dark:border-slate-700 shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
            寻找: {userPreferences.budgetRange[1] < 100000 ? `${userPreferences.budgetRange[1]}元以内` : '不限'}
          </span>
        </div>
      )}
      <div className="w-8"></div>
    </header>
  );

  if (messages.length > 0) {
    return (
      <div className="flex flex-col h-[100dvh] bg-[#f8fafc] dark:bg-[#101922] relative overflow-hidden">
        <Header />

        <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar pb-6 px-5 min-h-0">
          <div className="py-4 space-y-8">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex flex-col max-w-[90%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.sender === 'user' ? (
                    <div className="bg-indigo-600 text-white px-5 py-4 rounded-[28px] rounded-br-lg text-[15px] leading-relaxed shadow-lg shadow-indigo-100 dark:shadow-none">
                      {msg.text}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-indigo-500">
                          <Icon name="smart_toy" size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">智寓 AI</span>
                      </div>
                      {msg.text && (
                        <div className="text-slate-800 dark:text-slate-100 text-[15.5px] leading-8 mb-4 px-2">
                          {formatMessageText(msg.text)}
                        </div>
                      )}
                      {msg.type === 'PROPERTY_CARDS' && msg.data && (
                        <div className="flex gap-4 overflow-x-auto no-scrollbar w-full pb-4 -ml-2 pl-2">
                          {(msg.data as Property[]).map(p => (
                            <PropertyCard key={p.id} item={p} onClick={() => onPropertyClick(p.id)} />
                          ))}
                        </div>
                      )}
                      {msg.type === 'CONTRACT_CARD' && msg.data && (
                        <ContractCard
                          item={msg.data}
                          onSign={() => onStartSigning(msg.data.id)}
                          isSigned={msg.data.id === signedPropertyId}
                          onPay={onViewBills}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-3 px-2">
                <AIFluidOrbs />
                <AIThinkingDots />
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-2-safe bg-[#f8fafc] dark:bg-[#101922] flex-shrink-0 pt-2 pb-safe-bottom">
          <motion.div
            layoutId="orb-input"
            className="flex items-end gap-3 bg-white dark:bg-slate-800 rounded-[32px] px-3 py-2.5 shadow-xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-700 mb-2"
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`在${currentCity}找房...`}
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-500 text-[16px] py-3 pl-3 max-h-24 resize-none"
              rows={1}
            />
            <div className="flex items-center gap-2 mb-1 shrink-0">
              {inputValue.trim() ? (
                <button onClick={handleSend} className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-all shrink-0">
                  <Icon name="arrow_upward" size={20} />
                </button>
              ) : (
                <button onClick={handleStartListening} className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors shrink-0">
                  <Icon name="mic" size={22} />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        <AnimatePresence>{isListening && <VoiceOverlay />}</AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#f8fafc] dark:bg-[#101922] relative">
      <Header />

      <div className="flex-1 overflow-y-auto no-scrollbar w-full min-h-0">
        <div className="min-h-full flex flex-col items-center justify-center py-6">
          <div className="mb-8 flex flex-col items-center mt-12">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">你好，我是智寓</h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">您的 AI 租房专家</p>
          </div>

          <DailyPickCarousel />
          <SuggestionPills />
        </div>
      </div>

      <div className="px-6 pb-safe-bottom flex-shrink-0">
        <motion.div
          layoutId="orb-input"
          className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-white dark:border-slate-700 p-2.5 pl-8 flex items-center gap-3 relative group overflow-hidden mb-6 transition-all duration-300 ${isVoiceMode ? 'pl-2.5' : 'pl-8'}`}
        >
          {/* Neon Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-cyan-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />

          {isVoiceMode ? (
            <div className="flex-1 flex gap-2 w-full">
              <button
                onClick={handleStartListening}
                className="flex-1 h-14 bg-slate-900 rounded-full flex items-center justify-center gap-2 text-white font-bold shadow-xl active:scale-95 transition-all"
              >
                <Icon name="mic" size={20} className="animate-pulse" />
                <span>点击发语音</span>
              </button>
              <button
                onClick={() => setIsVoiceMode(false)}
                className="w-14 h-14 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
              >
                <Icon name="keyboard" size={24} />
              </button>
            </div>
          ) : (
            <>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={userPreferences ? `寻找 ${userPreferences.workLocation} 附近...` : `输入任意找房需求...`}
                className="flex-1 min-w-0 text-[16px] font-medium placeholder-slate-300 dark:placeholder-slate-500 text-slate-900 dark:text-white outline-none h-14 bg-transparent"
              />

              <div className="flex items-center gap-3 pr-3 shrink-0">
                {!inputValue.trim() && (
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-900 transition-colors shrink-0">
                    <Icon name="add_circle" size={24} />
                  </button>
                )}

                {inputValue.trim() ? (
                  <button
                    onClick={handleSend}
                    className="w-12 h-12 rounded-[22px] bg-indigo-600 flex items-center justify-center text-white shadow-xl active:scale-90 transition-all shrink-0"
                  >
                    <Icon name="arrow_upward" size={24} />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsVoiceMode(true)}
                    className="w-12 h-12 rounded-[22px] bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-xl active:scale-90 transition-all shrink-0"
                  >
                    <Icon name="mic" size={20} />
                  </button>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>

      <AnimatePresence>{isListening && <VoiceOverlay />}</AnimatePresence>
    </div>
  );
};

