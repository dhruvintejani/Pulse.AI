import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Sparkles, Copy, RefreshCw, ThumbsUp, ThumbsDown,
  Paperclip, Mic, Code2, MoreHorizontal, ChevronDown,
  Hash, Plus, Search, Zap, Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';


interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isCode?: boolean;
  codeLanguage?: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm Pulse AI, your intelligent workspace companion. I can help you with research, writing, coding, analysis, and much more. What would you like to explore today?",
    timestamp: new Date(),
  },
  {
    id: '2',
    role: 'user',
    content: "Can you analyze the Q3 market research data and identify the top 3 growth opportunities?",
    timestamp: new Date(),
  },
  {
    id: '3',
    role: 'assistant',
    content: `Based on the Q3 market research data, here are the **top 3 growth opportunities** I've identified:

**1. 🌏 APAC Market Expansion**
The Asia-Pacific region shows a 47% YoY growth rate, significantly outpacing other markets. Mobile-first consumers in Southeast Asia represent an untapped segment worth approximately $2.3B.

**2. 📱 Mobile Experience Optimization**  
With 67% of traffic from mobile devices but only 34% of conversions, there's a clear gap. Optimizing the mobile funnel could yield a 40-60% conversion uplift based on industry benchmarks.

**3. 🤖 AI-Powered Personalization**
Competitors leveraging AI personalization are seeing 2.8x higher customer LTV. Implementing recommendation engines for your top 20% of users could drive $4.2M in incremental revenue.

Would you like me to dive deeper into any of these opportunities?`,
    timestamp: new Date(),
  },
];

const CODE_EXAMPLE = `// React component for AI Chat
const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const response = await pulseAI.chat({
      model: 'gpt-4o',
      messages: [...messages, { role: 'user', content: input }]
    });
    setMessages(prev => [...prev, response]);
  };

  return (
    <div className="chat-container">
      {messages.map(msg => <Message key={msg.id} {...msg} />)}
      <InputBox onSend={sendMessage} />
    </div>
  );
};`;

const MODELS = ['GPT-4o', 'Claude 3.5', 'Gemini Pro', 'Llama 3'];

const SUGGESTIONS = [
  '📊 Analyze my uploaded documents',
  '✍️ Write a compelling product brief',
  '🔬 Research latest AI trends',
  '💻 Debug this React component',
];

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex gap-3 items-end"
  >
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center shrink-0 shadow-premium-sm">
      <Sparkles size={14} className="text-white" />
    </div>
    <div className="chat-bubble-ai px-4 py-3">
      <div className="flex gap-1.5 items-center h-4">
        <span className="typing-dot w-2 h-2 rounded-full bg-[#E9A24C]" />
        <span className="typing-dot w-2 h-2 rounded-full bg-[#E9A24C]" />
        <span className="typing-dot w-2 h-2 rounded-full bg-[#E9A24C]" />
      </div>
    </div>
  </motion.div>
);

const MessageBubble = ({ message }: { message: Message }) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<null | boolean>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.role === 'user';

  const renderContent = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-[#1F1F1F]">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex gap-3 group', isUser && 'flex-row-reverse')}
    >
      {/* Avatar */}
      <div className={cn(
        'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1',
        isUser
          ? 'bg-[#1F1F1F] text-white text-xs font-bold'
          : 'bg-gradient-to-br from-[#E9A24C] to-[#D4853A] shadow-premium-sm'
      )}>
        {isUser ? 'A' : <Sparkles size={14} className="text-white" />}
      </div>

      {/* Bubble */}
      <div className={cn('max-w-[78%] flex flex-col', isUser && 'items-end')}>
        <div className={cn(isUser ? 'chat-bubble-user' : 'chat-bubble-ai', 'px-4 py-3 shadow-card')}>
          <p className={cn(
            'text-sm leading-relaxed whitespace-pre-wrap',
            isUser ? 'text-white' : 'text-[#1F1F1F]'
          )}>
            {renderContent(message.content)}
          </p>
        </div>

        {/* Actions (AI only) */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-[#999] hover:text-[#666] hover:bg-[rgba(0,0,0,0.04)] transition-all"
            >
              <Copy size={11} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button className="p-1.5 rounded-lg hover:bg-[rgba(0,0,0,0.04)] transition-all">
              <RefreshCw size={11} className="text-[#999]" />
            </button>
            <button
              onClick={() => setLiked(true)}
              className={cn('p-1.5 rounded-lg transition-all', liked === true ? 'text-[#E9A24C]' : 'text-[#999] hover:text-[#666] hover:bg-[rgba(0,0,0,0.04)]')}
            >
              <ThumbsUp size={11} />
            </button>
            <button
              onClick={() => setLiked(false)}
              className={cn('p-1.5 rounded-lg transition-all', liked === false ? 'text-red-400' : 'text-[#999] hover:text-[#666] hover:bg-[rgba(0,0,0,0.04)]')}
            >
              <ThumbsDown size={11} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CodeBlock = () => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex gap-3"
  >
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center shrink-0 mt-1">
      <Sparkles size={14} className="text-white" />
    </div>
    <div className="max-w-[85%] w-full">
      <div className="chat-bubble-ai px-4 py-3 mb-2 shadow-card">
        <p className="text-sm text-[#1F1F1F]">Here's a React component for the AI chat interface you requested:</p>
      </div>
      <div className="code-block overflow-hidden shadow-card">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8">
          <div className="flex items-center gap-2">
            <Code2 size={13} className="text-[#E9A24C]" />
            <span className="text-xs font-mono text-white/60">typescript</span>
          </div>
          <button className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1">
            <Copy size={11} />
            Copy
          </button>
        </div>
        <pre className="px-4 py-4 overflow-x-auto no-scrollbar">
          <code className="text-sm font-mono text-[#E9A24C]/80 leading-relaxed">
            {CODE_EXAMPLE.split('\n').map((line, i) => (
              <div key={i} className="flex">
                <span className="text-white/20 select-none w-7 shrink-0 text-right mr-4 text-xs">{i + 1}</span>
                <span className="text-green-300/80">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  </motion.div>
);

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('GPT-4o');
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setShowCode(false);

    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "That's a great question! I've analyzed your request thoroughly. Based on the context and data available, here's my comprehensive response: The key insights suggest that focusing on user experience improvements, combined with data-driven decision making, will yield the best results. I recommend starting with a phased approach that prioritizes quick wins while building toward longer-term strategic goals.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full">
      {/* Conversations Sidebar */}
      <div className="hidden xl:flex flex-col w-64 border-r border-[rgba(0,0,0,0.06)] bg-[#FFFDF8]/50 backdrop-blur-sm">
        <div className="p-4 border-b border-[rgba(0,0,0,0.05)]">
          <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#E9A24C] to-[#D4853A] text-white text-sm font-medium hover:shadow-premium transition-all duration-200">
            <Plus size={15} />
            New conversation
          </button>
        </div>
        <div className="p-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#CCC]" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.06)] text-[#666] placeholder:text-[#CCC] outline-none focus:border-[rgba(233,162,76,0.3)]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-2 pb-4">
          <p className="text-[10px] font-semibold text-[#CCC] uppercase tracking-widest px-2 mb-2">Today</p>
          {['Market Research Analysis', 'React Architecture', 'Content Strategy', 'Product Roadmap'].map((chat, i) => (
            <motion.button
              key={i}
              whileHover={{ x: 2 }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left mb-0.5 ${i === 0 ? 'bg-[rgba(233,162,76,0.1)] text-[#E9A24C]' : 'text-[#666] hover:bg-[rgba(0,0,0,0.03)]'}`}
            >
              <Hash size={12} className="shrink-0 opacity-60" />
              <span className="text-xs font-medium truncate">{chat}</span>
            </motion.button>
          ))}
          <p className="text-[10px] font-semibold text-[#CCC] uppercase tracking-widest px-2 mb-2 mt-4">Yesterday</p>
          {['SEO Optimization Plan', 'Brand Voice Guide', 'Investor Pitch Deck'].map((chat, i) => (
            <motion.button
              key={i}
              whileHover={{ x: 2 }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left mb-0.5 text-[#666] hover:bg-[rgba(0,0,0,0.03)]"
            >
              <Hash size={12} className="shrink-0 opacity-60" />
              <span className="text-xs font-medium truncate">{chat}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(0,0,0,0.06)] bg-[#FFFDF8]/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1F1F1F]">Market Research Analysis</p>
              <p className="text-[11px] text-[#999]">24 messages · 2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Model Selector */}
            <div className="relative">
              <button
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[rgba(233,162,76,0.08)] border border-[rgba(233,162,76,0.2)] text-xs font-semibold text-[#E9A24C] hover:bg-[rgba(233,162,76,0.12)] transition-all"
              >
                <Brain size={13} />
                {selectedModel}
                <ChevronDown size={12} className={cn('transition-transform', showModelMenu && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {showModelMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute right-0 top-full mt-2 w-40 glass-card rounded-xl shadow-float border border-white/70 z-50 overflow-hidden"
                  >
                    {MODELS.map((model) => (
                      <button
                        key={model}
                        onClick={() => { setSelectedModel(model); setShowModelMenu(false); }}
                        className={cn(
                          'w-full text-left px-3.5 py-2.5 text-xs font-medium transition-colors hover:bg-[rgba(233,162,76,0.06)]',
                          model === selectedModel ? 'text-[#E9A24C] bg-[rgba(233,162,76,0.06)]' : 'text-[#666]'
                        )}
                      >
                        {model}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="p-2 rounded-xl hover:bg-[rgba(0,0,0,0.04)] transition-colors">
              <MoreHorizontal size={17} className="text-[#999]" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-6 space-y-5">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {showCode && <CodeBlock />}
          <AnimatePresence>
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 3 && (
          <div className="px-5 pb-3 flex gap-2 flex-wrap">
            {SUGGESTIONS.map((s, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setInput(s.slice(2))}
                className="text-xs text-[#666] px-3 py-1.5 rounded-xl border border-[rgba(0,0,0,0.08)] hover:border-[rgba(233,162,76,0.3)] hover:text-[#E9A24C] transition-all font-medium bg-white/60"
              >
                {s}
              </motion.button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-5 pb-6 pt-2 shrink-0">
          <div className="glass-card rounded-2xl shadow-float border-[rgba(255,255,255,0.8)] overflow-hidden">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Pulse AI... (Shift+Enter for new line)"
              rows={1}
              className="w-full px-4 pt-4 pb-2 text-sm text-[#1F1F1F] placeholder:text-[#CCC] bg-transparent outline-none resize-none leading-relaxed"
              style={{ minHeight: '52px', maxHeight: '160px' }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, 160) + 'px';
              }}
            />
            <div className="flex items-center justify-between px-4 pb-3 pt-1">
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-xl hover:bg-[rgba(0,0,0,0.04)] transition-colors text-[#CCC] hover:text-[#999]">
                  <Paperclip size={16} />
                </button>
                <button className="p-2 rounded-xl hover:bg-[rgba(0,0,0,0.04)] transition-colors text-[#CCC] hover:text-[#999]">
                  <Mic size={16} />
                </button>
                <button className="p-2 rounded-xl hover:bg-[rgba(0,0,0,0.04)] transition-colors text-[#CCC] hover:text-[#999]">
                  <Code2 size={16} />
                </button>
                <div className="mx-1 h-4 w-px bg-[rgba(0,0,0,0.08)]" />
                <div className="flex items-center gap-1.5 text-[11px] text-[#CCC]">
                  <Zap size={11} className="text-[#E9A24C]" />
                  <span>{selectedModel}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                onClick={handleSend}
                disabled={!input.trim()}
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200',
                  input.trim()
                    ? 'bg-gradient-to-br from-[#E9A24C] to-[#D4853A] text-white shadow-premium-sm hover:shadow-premium'
                    : 'bg-[rgba(0,0,0,0.06)] text-[#CCC]'
                )}
              >
                <Send size={14} />
              </motion.button>
            </div>
          </div>
          <p className="text-center text-[10px] text-[#CCC] mt-2">
            Pulse AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
