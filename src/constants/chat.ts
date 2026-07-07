import type { ChatConversation, ChatMessage } from '@/types/chat';

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm Pulse AI, your intelligent workspace companion. I can help you with research, writing, coding, analysis, and much more. What would you like to explore today?",
    timestamp: new Date(),
  },
  {
    id: '2',
    role: 'user',
    content: 'Can you analyze the Q3 market research data and identify the top 3 growth opportunities?',
    timestamp: new Date(),
  },
  {
    id: '3',
    role: 'assistant',
    content: `Based on the Q3 market research data, here are the **top 3 growth opportunities** I've identified:

**1. APAC Market Expansion**
The Asia-Pacific region shows a 47% YoY growth rate, significantly outpacing other markets. Mobile-first consumers in Southeast Asia represent an untapped segment worth approximately $2.3B.

**2. Mobile Experience Optimization**
With 67% of traffic from mobile devices but only 34% of conversions, there's a clear gap. Optimizing the mobile funnel could yield a 40-60% conversion uplift based on industry benchmarks.

**3. AI-Powered Personalization**
Competitors leveraging AI personalization are seeing 2.8x higher customer LTV. Implementing recommendation engines for your top 20% of users could drive $4.2M in incremental revenue.

Would you like me to dive deeper into any of these opportunities?`,
    timestamp: new Date(),
  },
];

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: '1',
    title: 'Market Research Analysis',
    time: '2m ago',
    period: 'today',
    messages: INITIAL_MESSAGES,
    pinned: true,
    favorite: true,
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'React Architecture Review',
    time: '1h ago',
    period: 'today',
    messages: [
      {
        id: '2-1',
        role: 'assistant',
        content: 'Share your React structure and I can help review state boundaries, routing, and reusable components.',
        timestamp: new Date(),
      },
    ],
    pinned: false,
    favorite: true,
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Content Strategy Draft',
    time: '3h ago',
    period: 'today',
    messages: [
      {
        id: '3-1',
        role: 'assistant',
        content: 'I can help turn your rough positioning into a clear content calendar and campaign outline.',
        timestamp: new Date(),
      },
    ],
    pinned: false,
    favorite: false,
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: 'Product Roadmap',
    time: '4h ago',
    period: 'today',
    messages: [],
    pinned: false,
    favorite: false,
    updatedAt: new Date(),
  },
  {
    id: '5',
    title: 'SEO Optimization Plan',
    time: '1d ago',
    period: 'yesterday',
    messages: [],
    pinned: false,
    favorite: false,
    updatedAt: new Date(),
  },
  {
    id: '6',
    title: 'Brand Voice Guide',
    time: '1d ago',
    period: 'yesterday',
    messages: [],
    pinned: false,
    favorite: true,
    updatedAt: new Date(),
  },
  {
    id: '7',
    title: 'Investor Pitch Deck',
    time: '1d ago',
    period: 'yesterday',
    messages: [],
    pinned: false,
    favorite: false,
    updatedAt: new Date(),
  },
];

export const CODE_EXAMPLE = `// React component for AI Chat
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

export const DEFAULT_ASSISTANT_REPLY = `That's a great question! I've analyzed your request thoroughly.

Here is a small example of how we can structure the next frontend-only step:

\`\`\`tsx
const nextStep = {
  goal: 'Keep the UI unchanged',
  work: ['state', 'hooks', 'components'],
};
\`\`\`

The key is to keep the experience stable while making the internal chat flow easier to connect to a backend later.`;

export const REGENERATED_ASSISTANT_REPLY = `Here is a regenerated version with a cleaner breakdown:

**Recommended approach**

1. Keep conversation state isolated.
2. Render messages from one active conversation.
3. Use reusable controls for copy, regenerate, rename, delete, pin, and favorite.
4. Replace the local service with backend APIs later without changing the UI.`;

export const MODELS = ['GPT-4o', 'Claude 3.5', 'Gemini Pro', 'Llama 3'];

export const SUGGESTIONS = [
  'Analyze my uploaded documents',
  'Write a compelling product brief',
  'Research latest AI trends',
  'Debug this React component',
];
