import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/Icon';
import { Property } from '../types';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatScreenProps {
  onClose: () => void;
  initialProperty?: Property | null;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ onClose, initialProperty }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '你好！我是您的专属 AI 智寓。请问有什么可以帮您？',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);

  // Handle initial property context
  useEffect(() => {
    if (initialProperty) {
      const initialMsg = `我对 "${initialProperty.title}" 很感兴趣，想了解更多细节。`;
      handleSendMessage(initialMsg);
    }
  }, []);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsAiTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      let aiResponseText = "我明白了，这就为您查找相关信息。";
      
      if (text.includes("感兴趣") && initialProperty) {
        aiResponseText = `收到！${initialProperty.title} 位于${initialProperty.location}，月租 ${initialProperty.price}元。这套房源最大的亮点是${initialProperty.tags[0]}，非常适合您。您想预约线下看房还是先进行 VR 带看？`;
      } else if (text.includes("价格") || text.includes("多少钱")) {
        aiResponseText = "这套房源的租金在同地段非常有竞争力，且支持押一付一。如果您长租（一年以上），我可以帮您申请 95 折优惠。";
      } else if (text.includes("看房")) {
        aiResponseText = "好的，我已经为您生成了预约单。本周六下午 2 点或者周日上午 10 点，您哪个时间方便？";
      }

      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAiMsg]);
      setIsAiTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative z-50">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm px-4 py-3 flex items-center justify-between pt-safe-top z-10">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <Icon name="close" size={24} className="text-slate-600 dark:text-slate-300" />
        </button>
        <div className="flex flex-col items-center">
           <h1 className="font-bold text-slate-900 dark:text-white">AI 智能顾问</h1>
           <div className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] text-slate-400">Online</span>
           </div>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <Icon name="more_horiz" size={24} className="text-slate-600 dark:text-slate-300" />
        </button>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 dark:bg-slate-900">
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
               {/* Avatar */}
               <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'ai' ? 'bg-gradient-to-tr from-blue-500 to-cyan-500' : 'bg-slate-200'}`}>
                  {msg.sender === 'ai' ? (
                    <Icon name="smart_toy" size={16} className="text-white" />
                  ) : (
                    <Icon name="person" size={16} className="text-slate-500" />
                  )}
               </div>

               {/* Bubble */}
               <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                 msg.sender === 'user' 
                   ? 'bg-primary text-white rounded-br-none' 
                   : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-700'
               }`}>
                 {msg.text}
               </div>
            </div>
          </motion.div>
        ))}
        
        {isAiTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
             <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Icon name="smart_toy" size={16} className="text-white" />
                </div>
                <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-none border border-slate-100 dark:border-slate-700 flex gap-1">
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
             </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 p-4 pb-safe">
         {/* Quick Suggestion Chips */}
         {!isAiTyping && messages.length < 5 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
               {['我想预约看房', '这附近交通怎么样？', '租金可以便宜吗？', '有停车位吗？'].map((chip, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSendMessage(chip)}
                    className="whitespace-nowrap px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    {chip}
                  </button>
               ))}
            </div>
         )}

         <div className="flex items-center gap-3">
            <button className="text-slate-400 hover:text-primary transition-colors">
              <Icon name="add_circle" size={28} />
            </button>
            <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full px-4 py-2 flex items-center">
               <input 
                 type="text" 
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                 placeholder="输入消息..."
                 className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400"
               />
               <button className="text-slate-400">
                  <Icon name="mic" size={20} />
               </button>
            </div>
            <button 
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim()}
              className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
            >
               <Icon name="send" size={18} className="ml-0.5" />
            </button>
         </div>
      </div>
    </div>
  );
};