import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Sparkles, Copy, RefreshCw, ThumbsUp, ThumbsDown,
  Paperclip, Mic, Code2, MoreHorizontal, ChevronDown,
  Hash, Plus, Search, Zap, Brain, Pin, Star, Trash2, Pencil, Check, X
} from 'lucide-react';
import { ChatAttachmentPreview, CodeBlock, MarkdownRenderer, StreamingMessage } from '@/components/chat';
import { CODE_EXAMPLE, DEFAULT_ASSISTANT_REPLY, MODELS, REGENERATED_ASSISTANT_REPLY, SUGGESTIONS } from '@/constants/chat';
import { useChatMessages, useConversations } from '@/hooks/useChatHistory';
import { cn } from '@/lib/utils';
import type { ChatAttachment, ChatConversation, ChatMessage, MessageReaction } from '@/types/chat';

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const readImagePreview = (file: File) => new Promise<string | undefined>((resolve) => {
  if (!file.type.startsWith('image/')) {
    resolve(undefined);
    return;
  }

  const reader = new FileReader();
  reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : undefined);
  reader.onerror = () => resolve(undefined);
  reader.readAsDataURL(file);
});

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex gap-3 items-end"
    role="status"
    aria-live="polite"
    aria-label="Pulse AI is typing"
  >
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center shrink-0 shadow-premium-sm">
      <Sparkles size={14} className="text-white" aria-hidden="true" />
    </div>
    <div className="chat-bubble-ai px-4 py-3" aria-hidden="true">
      <div className="flex gap-1.5 items-center h-4">
        <span className="typing-dot w-2 h-2 rounded-full bg-[#E9A24C]" />
        <span className="typing-dot w-2 h-2 rounded-full bg-[#E9A24C]" />
        <span className="typing-dot w-2 h-2 rounded-full bg-[#E9A24C]" />
      </div>
    </div>
  </motion.div>
);

const MessageBubble = ({
  message,
  onRegenerate,
  onReact,
}: {
  message: ChatMessage;
  onRegenerate: () => void;
  onReact: (messageId: string, reaction: MessageReaction) => void;
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReaction = (reaction: Exclude<MessageReaction, null>) => {
    onReact(message.id, message.reaction === reaction ? null : reaction);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex gap-3 group', isUser && 'flex-row-reverse')}
      role="article"
      aria-label={isUser ? 'Your message' : 'Pulse AI message'}
    >
      <div className={cn(
        'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1',
        isUser
          ? 'bg-[#1F1F1F] text-white text-xs font-bold'
          : 'bg-gradient-to-br from-[#E9A24C] to-[#D4853A] shadow-premium-sm'
      )} aria-hidden="true">
        {isUser ? 'A' : <Sparkles size={14} className="text-white" />}
      </div>

      <div className={cn('max-w-[78%] flex flex-col', isUser && 'items-end')}>
        <div className={cn(isUser ? 'chat-bubble-user' : 'chat-bubble-ai', 'px-4 py-3 shadow-card space-y-3')}>
          {message.content && (
            <MarkdownRenderer
              content={message.content}
              tone={isUser ? 'user' : 'assistant'}
              className={cn(isUser ? 'text-white' : 'text-[#1F1F1F]')}
            />
          )}
          {message.attachments?.length ? (
            <ChatAttachmentPreview attachments={message.attachments} compact={message.attachments.length === 1} />
          ) : null}
        </div>

        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150">
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? 'Message copied' : 'Copy message'}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-[#999] hover:text-[#666] hover:bg-[rgba(0,0,0,0.04)] transition-all focus-ring"
          >
            {copied ? <Check size={11} aria-hidden="true" /> : <Copy size={11} aria-hidden="true" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          {!isUser && (
            <button type="button" onClick={onRegenerate} aria-label="Regenerate response" className="p-1.5 rounded-lg hover:bg-[rgba(0,0,0,0.04)] transition-all focus-ring">
              <RefreshCw size={11} className="text-[#999]" aria-hidden="true" />
            </button>
          )}
          {!isUser && (
            <>
              <button
                type="button"
                onClick={() => handleReaction('like')}
                aria-label="Mark response as helpful"
                aria-pressed={message.reaction === 'like'}
                className={cn('p-1.5 rounded-lg transition-all focus-ring', message.reaction === 'like' ? 'text-[#E9A24C]' : 'text-[#999] hover:text-[#666] hover:bg-[rgba(0,0,0,0.04)]')}
              >
                <ThumbsUp size={11} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => handleReaction('dislike')}
                aria-label="Mark response as not helpful"
                aria-pressed={message.reaction === 'dislike'}
                className={cn('p-1.5 rounded-lg transition-all focus-ring', message.reaction === 'dislike' ? 'text-red-400' : 'text-[#999] hover:text-[#666] hover:bg-[rgba(0,0,0,0.04)]')}
              >
                <ThumbsDown size={11} aria-hidden="true" />
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
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center shrink-0 mt-1" aria-hidden="true">
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

  const stop = (event: MouseEvent<HTMLElement>) => event.stopPropagation();

  const submitRename = () => {
    const nextTitle = title.trim();
    if (nextTitle) {
      onRename(nextTitle);
    } else {
      setTitle(conversation.title);
    }
    setEditing(false);
  };

  const cancelRename = () => {
    setTitle(conversation.title);
    setEditing(false);
  };

  const handleRowKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (editing) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-current={active ? 'page' : undefined}
      aria-label={`Open conversation ${conversation.title}`}
      whileHover={{ x: 2 }}
      onClick={onSelect}
      onKeyDown={handleRowKeyDown}
      className={cn(
        'group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left mb-0.5 cursor-pointer focus-ring',
        active ? 'bg-[rgba(233,162,76,0.1)] text-[#E9A24C]' : 'text-[#666] hover:bg-[rgba(0,0,0,0.03)]'
      )}
    >
      <Hash size={12} className="shrink-0 opacity-60" aria-hidden="true" />
      {editing ? (
        <input
          value={title}
          autoFocus
          aria-label="Conversation title"
          onClick={stop}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') submitRename();
            if (event.key === 'Escape') cancelRename();
          }}
          className="min-w-0 flex-1 bg-transparent text-xs font-medium outline-none border-b border-[rgba(233,162,76,0.4)]"
        />
      ) : (
        <span className="text-xs font-medium truncate flex-1">{conversation.title}</span>
      )}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity" onClick={stop}>
        {editing ? (
          <>
            <button type="button" aria-label="Save conversation title" onClick={submitRename} className="text-[#999] hover:text-[#E9A24C] focus-ring rounded-md"><Check size={12} aria-hidden="true" /></button>
            <button type="button" aria-label="Cancel rename" onClick={cancelRename} className="text-[#999] hover:text-red-400 focus-ring rounded-md"><X size={12} aria-hidden="true" /></button>
          </>
        ) : (
          <>
            <button type="button" aria-label={conversation.pinned ? 'Unpin conversation' : 'Pin conversation'} aria-pressed={conversation.pinned} onClick={onTogglePinned} className={cn('text-[#999] hover:text-[#E9A24C] focus-ring rounded-md', conversation.pinned && 'text-[#E9A24C]')}><Pin size={12} aria-hidden="true" /></button>
            <button type="button" aria-label={conversation.favorite ? 'Remove from favorites' : 'Add to favorites'} aria-pressed={conversation.favorite} onClick={onToggleFavorite} className={cn('text-[#999] hover:text-[#E9A24C] focus-ring rounded-md', conversation.favorite && 'text-[#E9A24C]')}><Star size={12} aria-hidden="true" /></button>
            <button type="button" aria-label="Rename conversation" onClick={() => setEditing(true)} className="text-[#999] hover:text-[#666] focus-ring rounded-md"><Pencil size={12} aria-hidden="true" /></button>
            <button type="button" aria-label="Delete conversation" onClick={onDelete} className="text-[#999] hover:text-red-400 focus-ring rounded-md"><Trash2 size={12} aria-hidden="true" /></button>
          </>
        )}
      </div>
    </motion.div>
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
    updateMessageReaction,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
    isRegenerating,
  } = useChatMessages();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('GPT-4o');
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamMode, setStreamMode] = useState<'reply' | 'regenerate' | null>(null);
  const [streamConversationId, setStreamConversationId] = useState<string | null>(null);
  const streamFinalizedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, activeConversation?.id, streamingContent]);

  const activeConversationId = activeConversation?.id;

  const startStreaming = useCallback((conversationId: string, content: string, mode: 'reply' | 'regenerate') => {
    setStreamingContent('');
    setStreamMode(null);
    setStreamConversationId(null);
    setIsTyping(true);
    streamFinalizedRef.current = false;

    window.setTimeout(() => {
      setIsTyping(false);
      setStreamConversationId(conversationId);
      setStreamMode(mode);
      setStreamingContent(content);
    }, 520);
  }, []);

  const handleStreamingComplete = useCallback(() => {
    if (!streamConversationId || !streamMode || streamFinalizedRef.current) return;
    streamFinalizedRef.current = true;

    const complete = async () => {
      if (streamMode === 'regenerate') {
        await regenerateLastAssistantMessage(streamConversationId);
      } else {
        await addAssistantReply(streamConversationId);
      }
      setStreamingContent('');
      setStreamMode(null);
      setStreamConversationId(null);
    };

    void complete();
  }, [addAssistantReply, regenerateLastAssistantMessage, streamConversationId, streamMode]);

  const handleAttachmentChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const nextAttachments = await Promise.all(files.slice(0, 6).map(async (file) => ({
      id: `${file.name}-${file.lastModified}-${file.size}`,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type.startsWith('image/') ? 'image' as const : 'file' as const,
      mimeType: file.type || 'application/octet-stream',
      previewUrl: await readImagePreview(file),
    })));

    setAttachments((current) => [...current, ...nextAttachments]);
    event.target.value = '';
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments((current) => current.filter((attachment) => attachment.id !== attachmentId));
  };

  const handleSend = async () => {
    const content = input.trim();
    if ((!content && !attachments.length) || !activeConversationId || streamingContent) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      attachments: attachments.length ? attachments : undefined,
    };

    await addMessage({ conversationId: activeConversationId, message: userMsg });
    setInput('');
    setAttachments([]);
    setShowCode(false);
    startStreaming(activeConversationId, DEFAULT_ASSISTANT_REPLY, 'reply');
  };

  const handleRegenerate = async () => {
    if (!activeConversationId || streamingContent) return;
    startStreaming(activeConversationId, REGENERATED_ASSISTANT_REPLY, 'regenerate');
  };

  const handleReact = (messageId: string, reaction: MessageReaction) => {
    if (!activeConversationId) return;
    void updateMessageReaction({ conversationId: activeConversationId, messageId, reaction });
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
      <aside className="hidden xl:flex flex-col w-64 border-r border-[rgba(0,0,0,0.06)] bg-[#FFFDF8]/50 backdrop-blur-sm" aria-label="Conversation history">
        <div className="p-4 border-b border-[rgba(0,0,0,0.05)]">
          <button
            type="button"
            onClick={() => void createConversation()}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#E9A24C] to-[#D4853A] text-white text-sm font-medium hover:shadow-premium transition-all duration-200 focus-ring"
          >
            <Plus size={15} aria-hidden="true" />
            New conversation
          </button>
        </div>
        <div className="p-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#CCC]" aria-hidden="true" />
            <label className="sr-only" htmlFor="conversation-search">Search conversations</label>
            <input
              id="conversation-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search chats..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.06)] text-[#666] placeholder:text-[#CCC] outline-none focus:border-[rgba(233,162,76,0.3)]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-2 pb-4" aria-live="polite">
          {isConversationsLoading && <p className="text-xs text-[#999] px-3 py-2" role="status">Loading chats...</p>}
          {isConversationsError && <p className="text-xs text-red-400 px-3 py-2" role="alert">Unable to load chats.</p>}
          {!isConversationsLoading && !isConversationsError && (
            <>
              {renderConversationGroup('Pinned', groupedConversations.pinned)}
              {renderConversationGroup('Favorites', groupedConversations.favorites)}
              {renderConversationGroup('Today', groupedConversations.today)}
              {renderConversationGroup('Yesterday', groupedConversations.yesterday)}
            </>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(0,0,0,0.06)] bg-[#FFFDF8]/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center shrink-0" aria-hidden="true">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#1F1F1F] truncate">{activeConversation?.title || 'New conversation'}</p>
              <p className="text-[11px] text-[#999]">{messages.length} messages · {activeConversation?.time || 'now'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowModelMenu(!showModelMenu)}
                aria-haspopup="menu"
                aria-expanded={showModelMenu}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[rgba(233,162,76,0.08)] border border-[rgba(233,162,76,0.2)] text-xs font-semibold text-[#E9A24C] hover:bg-[rgba(233,162,76,0.12)] transition-all focus-ring"
              >
                <Brain size={13} aria-hidden="true" />
                {selectedModel}
                <ChevronDown size={12} className={cn('transition-transform', showModelMenu && 'rotate-180')} aria-hidden="true" />
              </button>
              <AnimatePresence>
                {showModelMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute right-0 top-full mt-2 w-40 glass-card rounded-xl shadow-float border border-white/70 z-50 overflow-hidden"
                    role="menu"
                  >
                    {MODELS.map((model) => (
                      <button
                        key={model}
                        type="button"
                        role="menuitemradio"
                        aria-checked={model === selectedModel}
                        onClick={() => { setSelectedModel(model); setShowModelMenu(false); }}
                        className={cn(
                          'w-full text-left px-3.5 py-2.5 text-xs font-medium transition-colors hover:bg-[rgba(233,162,76,0.06)] focus-ring',
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
            <button type="button" aria-label="Open conversation options" className="p-2 rounded-xl hover:bg-[rgba(0,0,0,0.04)] transition-colors focus-ring">
              <MoreHorizontal size={17} className="text-[#999]" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-5 py-6 space-y-5" role="log" aria-live="polite" aria-relevant="additions text">
          {isMessagesLoading && <TypingIndicator />}
          {isMessagesError && (
            <div className="chat-bubble-ai px-4 py-3 shadow-card text-sm text-red-400" role="alert">Unable to load chat messages.</div>
          )}
          {!isMessagesLoading && !isMessagesError && messages.map((message) => (
            <MessageBubble key={message.id} message={message} onRegenerate={handleRegenerate} onReact={handleReact} />
          ))}
          {showCode && <CodeExampleBlock />}
          <AnimatePresence>
            {(isTyping || isRegenerating) && <TypingIndicator />}
          </AnimatePresence>
          <AnimatePresence>
            {streamingContent && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center shrink-0 mt-1 shadow-premium-sm" aria-hidden="true">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div className="max-w-[78%] chat-bubble-ai px-4 py-3 shadow-card">
                  <StreamingMessage content={streamingContent} onComplete={handleStreamingComplete} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 3 && !streamingContent && (
          <div className="px-4 sm:px-5 pb-3 flex gap-2 flex-wrap" aria-label="Suggested prompts">
            {SUGGESTIONS.map((s, i) => (
              <motion.button
                key={i}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setInput(s)}
                className="text-xs text-[#666] px-3 py-1.5 rounded-xl border border-[rgba(0,0,0,0.08)] hover:border-[rgba(233,162,76,0.3)] hover:text-[#E9A24C] transition-all font-medium bg-white/60 focus-ring"
              >
                {s}
              </motion.button>
            ))}
          </div>
        )}

        <div className="px-4 sm:px-5 pb-6 pt-2 shrink-0">
          <div className="glass-card rounded-2xl shadow-float border-[rgba(255,255,255,0.8)] overflow-hidden">
            {attachments.length > 0 && (
              <div className="px-4 pt-4">
                <ChatAttachmentPreview attachments={attachments} removable onRemove={removeAttachment} />
              </div>
            )}
            <label className="sr-only" htmlFor="chat-message-input">Message Pulse AI</label>
            <textarea
              id="chat-message-input"
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
            <div className="flex items-center justify-between px-4 pb-3 pt-1 gap-3">
              <div className="flex items-center gap-1 min-w-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt,.md,.csv,.xlsx"
                  onChange={handleAttachmentChange}
                  className="hidden"
                />
                <button type="button" onClick={() => fileInputRef.current?.click()} aria-label="Attach file" className="p-2 rounded-xl hover:bg-[rgba(0,0,0,0.04)] transition-colors text-[#CCC] hover:text-[#999] focus-ring">
                  <Paperclip size={16} aria-hidden="true" />
                </button>
                <button type="button" aria-label="Start voice input" className="p-2 rounded-xl hover:bg-[rgba(0,0,0,0.04)] transition-colors text-[#CCC] hover:text-[#999] focus-ring">
                  <Mic size={16} aria-hidden="true" />
                </button>
                <button type="button" aria-label="Insert code snippet" onClick={() => setInput((current) => `${current}${current ? '\n\n' : ''}\`\`\`tsx\n\n\`\`\``)} className="p-2 rounded-xl hover:bg-[rgba(0,0,0,0.04)] transition-colors text-[#CCC] hover:text-[#999] focus-ring">
                  <Code2 size={16} aria-hidden="true" />
                </button>
                <div className="mx-1 h-4 w-px bg-[rgba(0,0,0,0.08)]" aria-hidden="true" />
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#CCC] min-w-0">
                  <Zap size={11} className="text-[#E9A24C] shrink-0" aria-hidden="true" />
                  <span className="truncate">{selectedModel}</span>
                </div>
              </div>
              <motion.button
                type="button"
                aria-label="Send message"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => void handleSend()}
                disabled={(!input.trim() && !attachments.length) || !activeConversationId || Boolean(streamingContent)}
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 focus-ring shrink-0',
                  (input.trim() || attachments.length) && activeConversationId && !streamingContent
                    ? 'bg-gradient-to-br from-[#E9A24C] to-[#D4853A] text-white shadow-premium-sm hover:shadow-premium'
                    : 'bg-[rgba(0,0,0,0.06)] text-[#CCC]'
                )}
              >
                <Send size={14} aria-hidden="true" />
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
