import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Send, X, Minus, Bot } from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { getTranslation } from '../i18n';
import { GoogleGenAI } from "@google/genai";

interface ChatWidgetProps {
  lang: Language;
  onTriggerLeadModal?: () => void;
}

const SYSTEM_PROMPT = `You are "Nexi", the friendly AI assistant for SinoNexus, a Singapore immigration eligibility platform.

YOUR OBJECTIVES (in priority order):
1. BE WARM AND FRIENDLY - Use emojis, be conversational, make user comfortable
2. QUALIFY THE USER - Determine if they need:
   - Immigration help (EP, S Pass, PR, Student Pass, LTVP)
   - Corporate services (company incorporation, hiring foreign talent, HR consulting)
   - General information
3. PUSH TO APP DOWNLOAD - For immigration users, say the full eligibility check is ONLY available on our mobile app
4. CAPTURE CORPORATE LEADS - For corporate users, offer to connect them with our team

WHAT YOU MUST NOT DO:
- Give free immigration advice or eligibility assessments
- Provide specific salary thresholds or requirements
- Do document checks or application reviews
- Give legal advice

RESPONSE STYLE:
- Short, punchy messages (1-2 sentences)
- Use emojis naturally 😊
- Ask follow-up questions to keep conversation going
- Always steer toward: "Download our app for full check" or "Let me connect you with our team"`;

function detectUserType(message: string, history: ChatMessage[]) {
  const msg = message.toLowerCase();
  const corporateKeywords = ['company', 'incorporate', 'business', 'hire', 'employee', 'hr', 'recruit', 'foreign worker', 'sponsor', 'employer', 'enterprise', 'corporate', 'firm'];
  const immigrationKeywords = ['pass', 'ep', 's pass', 'pr', 'permanent resident', 'student pass', 'ltvp', 'work permit', 'visa', 'immigration', 'move to singapore', 'relocate', 'job in singapore'];
  
  const hasCorporate = corporateKeywords.some(k => msg.includes(k));
  const hasImmigration = immigrationKeywords.some(k => msg.includes(k));
  
  if (hasCorporate && !hasImmigration) return 'corporate';
  if (hasImmigration && !hasCorporate) return 'immigration';
  
  return null;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ lang, onTriggerLeadModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', parts: [{ text: "Hi! I'm Nexi! 👋 Welcome to SinoNexus! How can I help you today?" }] }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'unknown' | 'immigration' | 'corporate'>('unknown');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = getTranslation(lang);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', parts: [{ text: input }] };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("API Key missing");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";

      const response = await ai.models.generateContent({
        model,
        contents: newMessages.filter((m, i) => !(i === 0 && m.role === 'model')),
        config: { systemInstruction: SYSTEM_PROMPT }
      });

      const botReply = response.text || "I'm here to help! Could you tell me more about what you're looking for? 😊";
      const modelMsg: ChatMessage = { role: 'model', parts: [{ text: botReply }] };
      setMessages(prev => [...prev, modelMsg]);

      // Detect user type
      const detected = detectUserType(input, newMessages);
      if (detected && userType === 'unknown') {
        setUserType(detected as any);
      }

      // Trigger lead modal if corporate and enough history
      if ((detected === 'corporate' || userType === 'corporate') && newMessages.length >= 4 && onTriggerLeadModal) {
        setTimeout(() => {
          onTriggerLeadModal();
        }, 1500);
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Oops! I'm having a moment 😅 Please try again or download our app for the best experience!" }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 h-[500px] flex flex-col overflow-hidden border border-black/5 mb-4"
          >
            {/* Header */}
            <div className="bg-brand-teal p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-lg relative">
                  <Bot size={20} />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-orange rounded-full border border-brand-teal" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Nexi</h3>
                  <p className="text-[10px] opacity-80">Online | SinoNexus AI</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-md transition-colors">
                <Minus size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-brand-teal text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
                  }`}>
                    {msg.parts[0].text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="w-full bg-slate-100 rounded-xl py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-brand-teal hover:bg-brand-teal/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-teal text-white p-4 rounded-full shadow-lg flex items-center gap-2"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && <span className="font-medium pr-2 hidden sm:inline">{t.chatWithNexi}</span>}
      </motion.button>
    </div>
  );
};
