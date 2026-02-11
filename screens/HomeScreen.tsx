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
  onSaveSession: (messages: Message[]) => void;
}

// 1. Property Card (Premium Light Version)
const PropertyCard: React.FC<{ item: Property; onClick: () => void }> = ({ item, onClick }) => (
  <motion.div
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden border border-white/40 min-w-[240px] shrink-0 transition-all"
  >
    <div className="h-32 relative">
      <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] text-indigo-600 font-bold flex items-center gap-1 shadow-sm">
        <Icon name="bolt" size={10} className="text-amber-400" />
        {item.matchScore}%
      </div>
    </div>
    <div className="p-3">
      <h4 className="font-bold text-slate-800 text-sm truncate">{item.title}</h4>
      <div className="flex justify-between items-center mt-2">
        <span className="text-indigo-600 font-bold text-sm">¥{item.price}<span className="text-xs font-normal text-slate-400">/月</span></span>
        <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 bg-slate-50 rounded-md">{item.specs.area}㎡</span>
      </div>
    </div>
  </motion.div>
);

// 2. Contract Card (Premium Light Version)
const ContractCard: React.FC<{ item: Property; onSign: () => void; isSigned?: boolean; onPay?: () => void }> = ({ item, onSign, isSigned, onPay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`bg-white/80 backdrop-blur-xl rounded-[24px] shadow-xl overflow-hidden border mt-2 transition-all duration-500 ${isSigned ? 'border-emerald-200' : 'border-indigo-100'} max-w-[300px]`}
  >
    <div className="p-4 flex gap-4">
      <img src={item.image} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt={item.title} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-sm truncate">{item.title}</h4>
          {isSigned && <Icon name="check_circle" size={16} className="text-emerald-500" />}
        </div>
        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">{item.location}</p>
        <div className="text-indigo-600 font-bold text-xs mt-1">¥{item.price}<span className="text-slate-400 font-normal">/月</span></div>
      </div>
    </div>

    <div className={`p-3 pt-0`}>
      {isSigned ? (
        <button
          onClick={onPay}
          className="w-full bg-slate-900 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all"
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
    className="inline-block w-[260px] whitespace-normal align-top mr-4 bg-white rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 cursor-pointer snap-center relative overflow-hidden group"
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

    <h3 className="text-sm font-bold text-slate-800 truncate mb-1">{item.title}</h3>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-1">
        <Icon name="location_on" size={10} className="text-slate-400" />
        <span className="text-[10px] text-slate-400 font-medium">{item.location}</span>
      </div>
      <span className="text-xs font-bold text-indigo-600">¥{item.price}</span>
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
  onSaveSession
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastRecommended, setLastRecommended] = useState<Property[]>([]);
  const [currentScenario, setCurrentScenario] = useState(SUGGESTION_SCENARIOS[0]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const randomScenario = SUGGESTION_SCENARIOS[Math.floor(Math.random() * SUGGESTION_SCENARIOS.length)];
    setCurrentScenario(randomScenario);
  }, []);

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
      onSaveSession(messages);
    }
  }, [messages, isTyping, onSaveSession]);

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
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

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
          setIsTyping(false);
          const signMsg: Message = {
            id: Date.now() + 'sign',
            type: 'CONTRACT_CARD',
            sender: 'ai',
            text: `好的，已为您准备好**${targetProp.title}**的电子合约。请确认房源信息无误后，点击下方按钮开始签约。`,
            timestamp: new Date(),
            data: targetProp
          };
          setMessages(prev => [...prev, signMsg]);
          return;
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
        : `\n\n[未检索到特定房源，请根据通用知识回答，或询问用户更多需求]`;

      const systemPrompt = `你是一个专业的AI租房顾问“智寓AI”。
      用户当前的城市是：${currentCity}。你的所有推荐必须严格限制在这个城市。
      请语气亲切、专业。回答请简练，不要长篇大论。`;
      // 在 HomeScreen.tsx 约 293 行附近修改
      const apiKey = process.env.API_KEY || "";
      const baseUrl = process.env.API_BASE_URL || "";
      console.log("Using Proxy (OpenAI Format):", baseUrl);

      let aiResponseText = "";

      try {
        const response = await fetch(`${baseUrl}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gemini-3-flash-preview',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userText + contextString }
            ],
            stream: false
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        aiResponseText = data.choices[0]?.message?.content || "";

      } catch (err: any) {
        if (err.message?.includes('429')) {
          aiResponseText = "抱歉，AI 思考次数已达免费额度上限。请稍等一分钟后再试。";
        } else {
          console.error("Proxy Error:", err);
          aiResponseText = `抱歉，通讯出现状况: ${err.message}`;
        }
      }

      setIsTyping(false);
      let newMsgs: Message[] = [];
      newMsgs.push({
        id: Date.now() + '1',
        type: 'TEXT',
        text: aiResponseText || '抱歉，我现在有点繁忙，请稍后再试。',
        sender: 'ai',
        timestamp: new Date()
      });

      if (relevantProperties.length > 0) {
        newMsgs.push({
          id: Date.now() + '2',
          type: 'PROPERTY_CARDS',
          sender: 'ai',
          timestamp: new Date(),
          data: relevantProperties
        });
      }
      setMessages(prev => [...prev, ...newMsgs]);

    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 'err',
        type: 'TEXT',
        text: '网络连接似乎有点问题。',
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  };

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

  const SuggestionPills = () => (
    <div className="w-full px-6 mt-4">
      <div className="flex items-center gap-2 mb-4 px-1">
        <Icon name="auto_awesome" size={14} className="text-indigo-500" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">
          INSIGHTS · {currentScenario.label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {currentScenario.items.map((item, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.96 }}
            onClick={() => { setInputValue(item.text); }}
            className="bg-white/50 hover:bg-white border border-slate-100 flex items-center justify-start px-4 gap-3 text-slate-700 text-sm py-4 rounded-2xl transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
              <Icon name={item.icon} size={18} />
            </div>
            <span className="font-bold text-xs truncate">{item.text}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const DailyPickCarousel = () => (
    <div className="w-full mb-10 mt-6">
      <div className="px-6 mb-5 flex justify-between items-end">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">今日精选</h2>
        <span className="text-xs font-bold text-indigo-600">查看更多</span>
      </div>
      <div className="overflow-x-auto no-scrollbar px-6 pb-2 snap-x snap-mandatory whitespace-nowrap">
        {properties.length > 0 ? properties.map(p => (
          <DailyPickSmallCard key={p.id} item={p} onClick={() => onPropertyClick(p.id)} />
        )) : (
          <div className="w-full text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-400">该城市暂无房源</p>
          </div>
        )}
        <div className="inline-block w-[20px] h-1"></div>
      </div>
    </div>
  );

  const Header = () => (
    <header className="flex justify-between items-center px-6 py-5 pt-safe-top sticky top-0 bg-transparent z-30 transition-all">
      <button
        onClick={onOpenMenu}
        className="group flex flex-col justify-center items-start gap-1 p-3 -ml-3 rounded-full hover:bg-white/40 transition-all active:scale-95"
      >
        <span className="w-6 h-0.5 bg-slate-900 rounded-full group-hover:w-7 transition-all"></span>
        <span className="w-4 h-0.5 bg-slate-900 rounded-full group-hover:w-6 transition-all"></span>
      </button>

      {userPreferences && (
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-slate-600">
            寻找: {userPreferences.budgetRange[1] < 100000 ? `${userPreferences.budgetRange[1]}元以内` : '不限'}
          </span>
        </div>
      )}
      <div className="w-8"></div>
    </header>
  );

  if (messages.length > 0) {
    return (
      <div className="flex flex-col h-[100dvh] bg-[#f8fafc] relative overflow-hidden">
        <Header />

        <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar pb-6 px-5">
          <div className="py-4 space-y-8">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex flex-col max-w-[90%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.sender === 'user' ? (
                    <div className="bg-indigo-600 text-white px-5 py-4 rounded-[28px] rounded-br-lg text-[15px] leading-relaxed shadow-lg shadow-indigo-100">
                      {msg.text}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-500">
                          <Icon name="smart_toy" size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">智寓 AI</span>
                      </div>
                      {msg.text && (
                        <div className="text-slate-800 text-[15.5px] leading-8 mb-4 px-2">
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

        <div className="px-6 pb-safe-bottom bg-[#f8fafc]">
          <motion.div
            layoutId="orb-input"
            className="flex items-end gap-3 bg-white rounded-[32px] px-3 py-2.5 shadow-xl shadow-slate-200/50 border border-white mb-6"
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`在${currentCity}找房...`}
              className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-slate-300 text-[15px] py-3 pl-3 max-h-24 resize-none"
              rows={1}
            />
            <div className="flex items-center gap-2 mb-1">
              {inputValue.trim() ? (
                <button onClick={handleSend} className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-all">
                  <Icon name="arrow_upward" size={20} />
                </button>
              ) : (
                <button onClick={handleStartListening} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
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
    <div className="flex flex-col h-[100dvh] bg-[#f8fafc] relative">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center -mt-16">
        <div className="mb-10 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center mb-6 shadow-2xl shadow-slate-200 border border-slate-50"
          >
            <Icon name="smart_toy" className="text-indigo-600" size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">你好, Peterleo</h1>
          <p className="text-slate-400 text-sm mt-2">今天想去哪里看看？</p>
        </div>

        <DailyPickCarousel />
        <SuggestionPills />
      </div>

      <div className="px-6 pb-safe-bottom">
        <motion.div
          layoutId="orb-input"
          className="bg-white/80 backdrop-blur-2xl rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-white p-2.5 pl-8 flex items-center gap-3 relative group overflow-hidden mb-6"
        >
          {/* Neon Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-cyan-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={userPreferences ? `寻找 ${userPreferences.workLocation} 附近...` : `输入任意找房需求...`}
            className="flex-1 text-[17px] font-medium placeholder-slate-300 text-slate-900 outline-none h-14 bg-transparent"
          />

          <div className="flex items-center gap-3 pr-3">
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-900 transition-colors">
              <Icon name="add_circle" size={24} />
            </button>
            <button
              onClick={handleStartListening}
              className="w-12 h-12 rounded-[22px] bg-slate-900 flex items-center justify-center text-white shadow-xl active:scale-90 transition-all"
            >
              <Icon name="mic" size={20} />
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>{isListening && <VoiceOverlay />}</AnimatePresence>
    </div>
  );
};

