import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Sparkles, Copy, RefreshCw, ThumbsUp, ThumbsDown,
  Paperclip, Mic, Code2, MoreHorizontal, ChevronDown,
  Hash, Plus, Search, Zap, Brain, Pin, Star, Trash2, Pencil, Check, X
} from 'lucide-react';
import CodeBlock from '@/components/chat/CodeBlock';
import MarkdownRenderer from '@/components/chat/MarkdownRenderer';
import { CODE_EXAMPLE, MODELS, SUGGESTIONS } from '@/constants/chat';
import { useChatMessages, useConversations } from '@/hooks/useChatHistory';
import { cn } from '@/lib/utils';
import type { ChatConversation, ChatMessage } from '@/types/chat';

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

const MessageBubble = ({ message, onRegenerate }: { message: ChatMessage; onRegenerate: () => void }) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<null | boolean>(null);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <MarkdownRenderer
            content={message.content}
            tone={isUser ? 'user' : 'assistant'}
            className={cn(isUser ? 'text-white' : 'text-[#1F1F1F]')}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-[#999] hover:text-[#666] hover:bg-[rgba(0,0,0,0.04)] transition-all"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          {!isUser && (
            <button onClick={onRegenerate} className="p-1.5 rounded-lg hover:bg-[rgba(0,0,0,0.04)] transition-all">
              <RefreshCw size={11} className="text-[#999]" />
            </button>
          )}
          {!isUser && (
            <>
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
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const CodeExampleBlock = () => (
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
      <CodeBlock code={CODE_EXAMPLE} language="typescript" />
    </div>
  </motion.div>
);

interface ConversationRowProps {
  conversation: ChatConversation;
  active: boolean;
  onSelect: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
  onTogglePinned: () => void;
  onToggleFavorite: () => void;
}

const ConversationRow = ({ conversation, active, onSelect, onRename, onDelete, onTogglePinned, onToggleFavorite }: ConversationRowProps) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(conversation.title);

  const stop = (event: MouseEvent) => event.stopPropagation();

  const submitRename = () => {
    onRename(title);
    setEditing(false);
  };

  return (
    <motion.button
      whileHover={{ x: 2 }}
      onClick={onSelect}
      className={cn(
        'group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left mb-0.5',
        active ? 'bg-[rgba(233,162,76,0.1)] text-[#E9A24C]' : 'text-[#666] hover:bg-[rgba(0,0,0,0.03)]'
      )}
    >
      <Hash size={12} className="shrink-0 opacity-60" />
      {editing ? (
        <input
          value={title}
          autoFocus
          onClick={stop}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') submitRename();
            if (event.key === 'Escape') setEditing(false);
          }}
          className="min-w-0 flex-1 bg-transparent text-xs font-medium outline-none border-b border-[rgba(233,162,76,0.4)]"
        />
      ) : (
        <span className="text-xs font-medium truncate flex-1">{conversation.title}</span>
      )}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={stop}>
        {editing ? (
          <>
            <button onClick={submitRename} className="text-[#999] hover:text-[#E9A24C]"><Check size={12} /></button>
            <button onClick={() => setEditing(false)} className="text-[#999] hover:text-red-400"><X size={12} /></button>
          </>
        ) : (
          <>
            <button onClick={onTogglePinned} className={cn('text-[#999] hover:text-[#E9A24C]', conversation.pinned && 'text-[#E9A24C]')}><Pin size={12} /></button>
            <button onClick={onToggleFavorite} className={cn('text-[#999] hover:text-[#E9A24C]', conversation.favorite && 'text-[#E9A24C]')}><Star size={12} /></button>
            <button onClick={() => setEditing(true)} className="text-[#999] hover:text-[#666]"><Pencil size={12} /></button>
            <button onClick={onDelete} className="text-[#999] hover:text-red-400"><Trash2 size={12} /></button>
          </>
        )}
      </div>
    </motion.button>
  );
};

const ChatPage = () => {
  const {
    groupedConversations,
    activeConversation,
    searchQuery,
    setSearchQuery,
    isLoading: isConversationsLoading,
    isError: isConversationsError,
    createConversation,
    setActiveConversation,
    deleteConversation,
    renameConversation,
    togglePinned,
    toggleFavorite,
  } = useConversations();
  const {
    messages,
    addMessage,
    addAssistantReply,
    regenerateLastAssistantMessage,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
    isRegenerating,
  } = useChatMessages();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('GPT-4o');
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, activeConversation?.id]);

  const activeConversationId = activeConversation?.id;

  const handleSend = async () => {
    const content = input.trim();
    if (!content || !activeConversationId) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    await addMessage({ conversationId: activeConversationId, message: userMsg });
    setInput('');
    setIsTyping(true);
    setShowCode(false);

    setTimeout(() => {
      setIsTyping(false);
      void addAssistantReply(activeConversationId);
    }, 900);
  };

  const handleRegenerate = async () => {
    if (!activeConversationId) return;
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      void regenerateLastAssistantMessage(activeConversationId);
    }, 700);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  const renderConversationGroup = (label: string, conversations: ChatConversation[]) => {
    if (!conversations.length) return null;

    return (
      <>
        <p className="text-[10px] font-semibold text-[#CCC] uppercase tracking-widest px-2 mb-2 mt-4 first:mt-0">{label}</p>
        {conversations.map((conversation) => (
          <ConversationRow
            key={conversation.id}
            conversation={conversation}
            active={conversation.id === activeConversationId}
            onSelect={() => void setActiveConversation(conversation.id)}
            onRename={(title) => void renameConversation({ conversationId: conversation.id, title })}
            onDelete={() => void deleteConversation(conversation.id)}
            onTogglePinned={() => void togglePinned(conversation.id)}
            onToggleFavorite={() => void toggleFavorite(conversation.id)}
          />
        ))}
      </>
    );
  };

  return (
    <div className="flex h-full">
      {/* Conversations Sidebar */}
      <div className="hidden xl:flex flex-col w-64 border-r border-[rgba(0,0,0,0.06)] bg-[#FFFDF8]/50 backdrop-blur-sm">
        <div className="p-4 border-b border-[rgba(0,0,0,0.05)]">
          <button
            onClick={() => void createConversation()}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#E9A24C] to-[#D4853A] text-white text-sm font-medium hover:shadow-premium transition-all duration-200"
          >
            <Plus size={15} />
            New conversation
          </button>
        </div>
        <div className="p-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#CCC]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search chats..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.06)] text-[#666] placeholder:text-[#CCC] outline-none focus:border-[rgba(233,162,76,0.3)]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-2 pb-4">
          {isConversationsLoading && <p className="text-xs text-[#999] px-3 py-2">Loading chats...</p>}
          {isConversationsError && <p className="text-xs text-red-400 px-3 py-2">Unable to load chats.</p>}
          {!isConversationsLoading && !isConversationsError && (
            <>
              {renderConversationGroup('Pinned', groupedConversations.pinned)}
              {renderConversationGroup('Favorites', groupedConversations.favorites)}
              {renderConversationGroup('Today', groupedConversations.today)}
              {renderConversationGroup('Yesterday', groupedConversations.yesterday)}
            </>
          )}
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
              <p className="text-sm font-bold text-[#1F1F1F]">{activeConversation?.title || 'New conversation'}</p>
              <p className="text-[11px] text-[#999]">{messages.length} messages · {activeConversation?.time || 'now'}</p>
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
          {isMessagesLoading && <TypingIndicator />}
          {isMessagesError && (
            <div className="chat-bubble-ai px-4 py-3 shadow-card text-sm text-red-400">Unable to load chat messages.</div>
          )}
          {!isMessagesLoading && !isMessagesError && messages.map((message) => (
            <MessageBubble key={message.id} message={message} onRegenerate={handleRegenerate} />
          ))}
          {showCode && <CodeExampleBlock />}
          <AnimatePresence>
            {(isTyping || isRegenerating) && <TypingIndicator />}
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
                onClick={() => setInput(s)}
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
                onClick={() => void handleSend()}
                disabled={!input.trim() || !activeConversationId}
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200',
                  input.trim() && activeConversationId
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
