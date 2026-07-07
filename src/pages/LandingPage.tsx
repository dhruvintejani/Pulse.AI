import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import {
  Sparkles, ArrowRight, MessageSquare, FileText, BarChart3,
  Shield, Zap, Globe, ChevronDown, Star, Check, Quote,
  Brain, Layers, Cpu, TrendingUp, Users, Clock
} from 'lucide-react';
import NeuralBackground from '@/components/backgrounds/NeuralBackground';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';


// Hero Stats
const stats = [
  { value: '10M+', label: 'Messages Processed', icon: MessageSquare },
  { value: '99.9%', label: 'Uptime SLA', icon: Shield },
  { value: '50ms', label: 'Avg Response', icon: Zap },
  { value: '150+', label: 'Countries', icon: Globe },
];

// Features
const features = [
  {
    icon: Brain,
    title: 'Intelligent Chat',
    description: 'Engage with our multi-model AI for research, writing, coding, and complex analysis with context memory.',
    gradient: 'from-orange-100 to-amber-50',
    iconBg: 'bg-orange-100',
    iconColor: 'text-[#E9A24C]',
  },
  {
    icon: FileText,
    title: 'Document Intelligence',
    description: 'Upload PDFs, docs, and spreadsheets. Ask questions, extract insights, and get instant summaries.',
    gradient: 'from-blue-50 to-indigo-50',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description: 'Visualize AI usage patterns, conversation insights, and productivity metrics in beautiful dashboards.',
    gradient: 'from-purple-50 to-pink-50',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
  },
  {
    icon: Layers,
    title: 'Smart Workspace',
    description: 'Organize projects, collaborate with teams, and manage AI workflows in one unified workspace.',
    gradient: 'from-green-50 to-emerald-50',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
  },
  {
    icon: Cpu,
    title: 'Multiple AI Models',
    description: 'Access GPT-4, Claude, Gemini, and Llama. Switch models mid-conversation for optimal results.',
    gradient: 'from-amber-50 to-yellow-50',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 compliant with end-to-end encryption, SSO, audit logs, and data residency controls.',
    gradient: 'from-slate-50 to-gray-50',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-500',
  },
];

// How it works
const steps = [
  {
    step: '01',
    title: 'Connect Your Workspace',
    description: 'Import documents, connect tools, and set up your AI preferences in minutes.',
  },
  {
    step: '02',
    title: 'Chat with Intelligence',
    description: 'Ask questions, generate content, and analyze data using natural conversation.',
  },
  {
    step: '03',
    title: 'Amplify Your Output',
    description: 'Get 10x more done with AI-powered workflows that adapt to your style.',
  },
];

// Pricing
const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'Perfect for individuals exploring AI.',
    features: ['50 AI messages/month', '1 workspace', '100MB document storage', 'Access to GPT-3.5', 'Community support'],
    cta: 'Get Started Free',
    variant: 'secondary' as const,
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'For power users and professionals.',
    features: ['Unlimited AI messages', '10 workspaces', '10GB document storage', 'All AI models', 'Priority support', 'Advanced analytics', 'API access'],
    cta: 'Start Pro Trial',
    variant: 'primary' as const,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$89',
    period: 'per seat/month',
    description: 'For teams that need the best.',
    features: ['Everything in Pro', 'Unlimited workspaces', 'Unlimited storage', 'Custom AI models', 'Dedicated support', 'SSO & SAML', 'SLA guarantee', 'Audit logs'],
    cta: 'Contact Sales',
    variant: 'outline' as const,
    popular: false,
  },
];

// Testimonials
const testimonials = [
  {
    quote: "Pulse AI transformed how our team handles research. What used to take days now takes hours. The document intelligence feature alone is worth 10x the price.",
    author: "Sarah Chen",
    role: "VP Product, TechFlow",
    avatar: "SC",
    rating: 5,
  },
  {
    quote: "The most elegant AI interface I've ever used. Clean, fast, and incredibly powerful. Our engineering team's productivity jumped 40% in the first month.",
    author: "Marcus Rivera",
    role: "CTO, Nexus Labs",
    avatar: "MR",
    rating: 5,
  },
  {
    quote: "I've tried every AI tool out there. Pulse AI is the only one that actually understands my workflow. The multi-model switching is a game changer.",
    author: "Priya Sharma",
    role: "Lead Designer, Orbit Studio",
    avatar: "PS",
    rating: 5,
  },
];

// FAQ
const faqs = [
  {
    q: 'Which AI models does Pulse AI support?',
    a: 'We support GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, Llama 3, and more. New models are added regularly.',
  },
  {
    q: 'Is my data secure and private?',
    a: 'Absolutely. All data is encrypted at rest and in transit. We are SOC 2 Type II certified and never train on your data.',
  },
  {
    q: 'Can I import my existing documents?',
    a: 'Yes. We support PDF, DOCX, TXT, MD, CSV, XLSX, and more. You can also connect Notion, Google Drive, and Dropbox.',
  },
  {
    q: 'Do you offer a free trial?',
    a: 'Our Starter plan is free forever with no credit card required. Pro includes a 14-day free trial.',
  },
  {
    q: 'What is the refund policy?',
    a: 'We offer a 30-day money-back guarantee on all paid plans, no questions asked.',
  },
];

const FadeInView = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div className="relative min-h-screen overflow-x-hidden pb-32">
      <NeuralBackground />

      {/* Gradient overlays */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(233,162,76,0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(215,185,142,0.08) 0%, transparent 50%)',
        }} />
      </div>

      {/* Top Nav */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-40"
      >
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="glass rounded-2xl px-5 py-3 flex items-center justify-between shadow-card">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold text-[#1F1F1F]">Pulse AI</span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {['Features', 'How it Works', 'Pricing', 'FAQ'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-3.5 py-2 text-sm font-medium text-[#666] hover:text-[#E9A24C] transition-colors rounded-lg hover:bg-[rgba(233,162,76,0.06)]"
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign in</Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
                Get started
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-16" style={{ zIndex: 2 }}>
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="flex flex-col items-center text-center max-w-5xl mx-auto"
        >
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge variant="accent" size="md" dot className="mb-8 text-sm px-4 py-1.5">
              Introducing Pulse AI 2.0 — Now with Vision & Voice
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-[#1F1F1F] leading-[1.05] tracking-tight mb-6"
          >
            The AI workspace
            <br />
            <span className="gradient-text">built for flow</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-lg md:text-xl text-[#666] max-w-2xl leading-relaxed mb-10"
          >
            Chat with the world's best AI models, analyze documents, track insights,
            and supercharge your team's productivity — all in one beautiful workspace.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-3 mb-14"
          >
            <Button
              variant="primary"
              size="xl"
              onClick={() => navigate('/signup')}
              className="shadow-premium-lg"
            >
              Start for free
              <ArrowRight size={18} className="ml-1" />
            </Button>
            <Button
              variant="secondary"
              size="xl"
              onClick={() => navigate('/dashboard')}
            >
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[rgba(233,162,76,0.2)] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#E9A24C]" />
                </span>
                View live demo
              </span>
            </Button>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-4xl"
          >
            {/* Main UI Preview */}
            <div className="glass-card rounded-3xl overflow-hidden shadow-float border border-white/70">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[rgba(0,0,0,0.06)] bg-white/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-5 rounded-md bg-[rgba(0,0,0,0.04)] w-full max-w-xs mx-auto flex items-center justify-center">
                    <span className="text-[10px] text-[#999]">app.pulseai.com/chat</span>
                  </div>
                </div>
              </div>
              
              {/* Mock Chat Interface */}
              <div className="p-6 bg-gradient-to-br from-[#FFFDF8] to-[#F8F4EC] min-h-[320px] flex flex-col gap-4">
                {/* AI Message */}
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center shrink-0">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <div className="chat-bubble-ai px-4 py-3 shadow-card">
                    <p className="text-sm text-[#1F1F1F] leading-relaxed">
                      I've analyzed your Q3 market research document. Here are the key insights:
                    </p>
                    <div className="mt-2 space-y-1.5">
                      {['Revenue grew 34% YoY across all segments', 'Mobile users represent 67% of traffic', 'APAC market shows highest growth potential'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#666]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E9A24C] shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* User Message */}
                <div className="flex gap-3 ml-auto flex-row-reverse max-w-[70%]">
                  <div className="w-8 h-8 rounded-xl bg-[#1F1F1F] flex items-center justify-center shrink-0 text-white text-xs font-bold">A</div>
                  <div className="chat-bubble-user px-4 py-3 shadow-premium">
                    <p className="text-sm leading-relaxed">Can you create a summary presentation for the board?</p>
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center shrink-0">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <div className="chat-bubble-ai px-4 py-3">
                    <div className="flex gap-1.5 items-center h-4">
                      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#E9A24C]" />
                      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#E9A24C]" />
                      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#E9A24C]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-8 top-12 glass-card rounded-2xl p-3.5 shadow-float hidden lg:flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center">
                <TrendingUp size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1F1F1F]">Productivity</p>
                <p className="text-lg font-black text-[#E9A24C]">+340%</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -right-8 top-20 glass-card rounded-2xl p-3.5 shadow-float hidden lg:flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users size={16} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1F1F1F]">Active Teams</p>
                <p className="text-lg font-black text-[#1F1F1F]">12,450</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute -right-6 bottom-16 glass-card rounded-2xl p-3.5 shadow-float hidden lg:flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Clock size={16} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1F1F1F]">Hours Saved</p>
                <p className="text-lg font-black text-[#1F1F1F]">8.4/week</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
        >
          <span className="text-xs text-[#666] font-medium">Scroll to explore</span>
          <ChevronDown size={16} className="text-[#666]" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-5xl mx-auto">
          <div className="glass-card rounded-3xl p-8 shadow-card">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <FadeInView key={i} delay={i * 0.1} className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-[rgba(233,162,76,0.1)] flex items-center justify-center mb-1">
                        <Icon size={18} className="text-[#E9A24C]" />
                      </div>
                      <span className="text-3xl md:text-4xl font-black text-[#1F1F1F]">{stat.value}</span>
                      <span className="text-sm text-[#999] font-medium">{stat.label}</span>
                    </div>
                  </FadeInView>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-6xl mx-auto">
          <FadeInView className="text-center mb-16">
            <Badge variant="accent" size="md" className="mb-4">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-[#1F1F1F] mb-4 tracking-tight">
              Everything you need to work
              <br />
              <span className="gradient-text">smarter, not harder</span>
            </h2>
            <p className="text-lg text-[#666] max-w-xl mx-auto">
              A complete AI toolkit designed for the way modern teams actually work.
            </p>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <FadeInView key={i} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-6 border border-white/80 shadow-card cursor-pointer group`}
                  >
                    <div className={`w-11 h-11 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon size={20} className={feature.iconColor} />
                    </div>
                    <h3 className="text-base font-bold text-[#1F1F1F] mb-2">{feature.title}</h3>
                    <p className="text-sm text-[#666] leading-relaxed">{feature.description}</p>
                  </motion.div>
                </FadeInView>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-5xl mx-auto">
          <FadeInView className="text-center mb-16">
            <Badge variant="accent" size="md" className="mb-4">How It Works</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-[#1F1F1F] mb-4 tracking-tight">
              Up and running in
              <br />
              <span className="gradient-text">under 5 minutes</span>
            </h2>
          </FadeInView>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-px bg-gradient-to-r from-[#E9A24C] via-[#D7B98E] to-[#E9A24C] opacity-30" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, i) => (
                <FadeInView key={i} delay={i * 0.15}>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center shadow-premium">
                        <span className="text-white font-black text-base">{step.step}</span>
                      </div>
                      {i < 2 && (
                        <div className="md:hidden absolute top-1/2 -right-4 w-8 h-px bg-[#E9A24C]/30" />
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-[#1F1F1F] mb-2">{step.title}</h3>
                    <p className="text-sm text-[#666] leading-relaxed">{step.description}</p>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Showcase */}
      <section className="relative py-24 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-5xl mx-auto">
          <FadeInView className="glass-card rounded-3xl overflow-hidden shadow-float">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-10 flex flex-col justify-center">
                <Badge variant="accent" size="md" className="mb-6 w-fit">AI Showcase</Badge>
                <h2 className="text-3xl md:text-4xl font-black text-[#1F1F1F] mb-4 leading-tight tracking-tight">
                  Multi-model AI
                  <br />
                  <span className="gradient-text">at your fingertips</span>
                </h2>
                <p className="text-[#666] leading-relaxed mb-6">
                  Switch between GPT-4o, Claude, Gemini, and more — mid-conversation.
                  Each model has unique strengths. Use the right one for every task.
                </p>
                <div className="space-y-3">
                  {['Analyze complex documents instantly', 'Generate code in any language', 'Create stunning content and copy', 'Research with real-time web access'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[rgba(233,162,76,0.15)] flex items-center justify-center shrink-0">
                        <Check size={11} className="text-[#E9A24C]" strokeWidth={3} />
                      </div>
                      <span className="text-sm text-[#1F1F1F] font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Button variant="primary" onClick={() => navigate('/dashboard/chat')}>
                    Try it now <ArrowRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#1F1F1F] to-[#2D2D2D] p-8 flex flex-col justify-center">
                <div className="space-y-3">
                  {[
                    { model: 'GPT-4o', color: '#10B981', tag: 'Best for reasoning' },
                    { model: 'Claude 3.5', color: '#8B5CF6', tag: 'Best for writing' },
                    { model: 'Gemini Pro', color: '#3B82F6', tag: 'Best for analysis' },
                    { model: 'Llama 3', color: '#F59E0B', tag: 'Fast & efficient' },
                  ].map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${i === 0 ? 'border-[rgba(233,162,76,0.4)] bg-[rgba(233,162,76,0.06)]' : 'border-white/8 hover:border-white/20 bg-white/3'}`}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${m.color}20` }}>
                        <Cpu size={14} style={{ color: m.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{m.model}</p>
                        <p className="text-xs text-white/40">{m.tag}</p>
                      </div>
                      {i === 0 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(233,162,76,0.2)] text-[#E9A24C]">
                          Active
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-24 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-5xl mx-auto">
          <FadeInView className="text-center mb-16">
            <Badge variant="accent" size="md" className="mb-4">Pricing</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-[#1F1F1F] mb-4 tracking-tight">
              Simple, transparent
              <br />
              <span className="gradient-text">pricing for everyone</span>
            </h2>
            <p className="text-lg text-[#666]">Start free, scale as you grow. No hidden fees.</p>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan, i) => (
              <FadeInView key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className={`relative rounded-2xl p-7 flex flex-col h-full ${
                    plan.popular
                      ? 'bg-gradient-to-br from-[#1F1F1F] to-[#2D2D2D] text-white shadow-float'
                      : 'bg-[#FFFDF8] border border-[rgba(0,0,0,0.06)] shadow-card'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-[#E9A24C] to-[#D4853A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-premium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className={`text-base font-bold mb-1 ${plan.popular ? 'text-white' : 'text-[#1F1F1F]'}`}>{plan.name}</h3>
                    <p className={`text-xs mb-4 ${plan.popular ? 'text-white/50' : 'text-[#999]'}`}>{plan.description}</p>
                    <div className="flex items-end gap-1">
                      <span className={`text-4xl font-black ${plan.popular ? 'text-white' : 'text-[#1F1F1F]'}`}>{plan.price}</span>
                      <span className={`text-sm mb-1 ${plan.popular ? 'text-white/50' : 'text-[#999]'}`}>/{plan.period}</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2.5 mb-7">
                    {plan.features.map((feat, j) => (
                      <div key={j} className="flex items-center gap-2.5">
                        <div className={`w-4.5 h-4.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-[rgba(233,162,76,0.2)]' : 'bg-[rgba(233,162,76,0.1)]'}`}>
                          <Check size={10} className="text-[#E9A24C]" strokeWidth={3} />
                        </div>
                        <span className={`text-sm ${plan.popular ? 'text-white/80' : 'text-[#666]'}`}>{feat}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant={plan.popular ? 'primary' : plan.variant}
                    className="w-full"
                    onClick={() => navigate('/signup')}
                  >
                    {plan.cta}
                  </Button>
                </motion.div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative py-24 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-5xl mx-auto">
          <FadeInView className="text-center mb-16">
            <Badge variant="accent" size="md" className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-[#1F1F1F] mb-4 tracking-tight">
              Loved by
              <br />
              <span className="gradient-text">thousands of teams</span>
            </h2>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <FadeInView key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="bg-[#FFFDF8] rounded-2xl p-6 border border-[rgba(0,0,0,0.05)] shadow-card flex flex-col gap-4"
                >
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} className="text-[#E9A24C] fill-[#E9A24C]" />
                    ))}
                  </div>
                  <Quote size={20} className="text-[#E9A24C]/30" />
                  <p className="text-sm text-[#444] leading-relaxed flex-1">{t.quote}</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-[rgba(0,0,0,0.05)]">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1F1F1F]">{t.author}</p>
                      <p className="text-xs text-[#999]">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-24 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-3xl mx-auto">
          <FadeInView className="text-center mb-16">
            <Badge variant="accent" size="md" className="mb-4">FAQ</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-[#1F1F1F] mb-4 tracking-tight">
              Questions?
              <br />
              <span className="gradient-text">We've got answers</span>
            </h2>
          </FadeInView>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FadeInView key={i} delay={i * 0.06}>
                <details className="group bg-[#FFFDF8] rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-card overflow-hidden">
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
                    <span className="text-sm font-semibold text-[#1F1F1F]">{faq.q}</span>
                    <ChevronDown size={16} className="text-[#999] transition-transform duration-200 group-open:rotate-180 shrink-0 ml-4" />
                  </summary>
                  <div className="px-6 pb-5">
                    <p className="text-sm text-[#666] leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-3xl mx-auto text-center">
          <FadeInView>
            <div className="glass-card rounded-3xl p-12 shadow-float relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-[rgba(233,162,76,0.15)] to-transparent" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-[rgba(215,185,142,0.1)] to-transparent" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center mx-auto mb-6 shadow-premium-lg">
                  <Sparkles size={28} className="text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#1F1F1F] mb-4 tracking-tight">
                  Ready to work at the
                  <br />
                  <span className="gradient-text">speed of thought?</span>
                </h2>
                <p className="text-[#666] mb-8 text-base">
                  Join 12,000+ teams already using Pulse AI to do their best work.
                  Start free, no credit card required.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button variant="primary" size="lg" onClick={() => navigate('/signup')} className="shadow-premium-lg">
                    Get started for free <ArrowRight size={16} className="ml-1" />
                  </Button>
                  <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>
                    Sign in to dashboard
                  </Button>
                </div>
                <p className="text-xs text-[#999] mt-4">No credit card required • 14-day Pro trial • Cancel anytime</p>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-[rgba(0,0,0,0.06)]" style={{ zIndex: 2 }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold text-[#1F1F1F]">Pulse AI</span>
              <span className="text-xs text-[#CCC] ml-2">© 2025 Pulse AI Inc.</span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              {['Privacy', 'Terms', 'Security', 'Blog', 'Docs', 'Status'].map((link) => (
                <a key={link} href="#" className="text-xs text-[#999] hover:text-[#E9A24C] transition-colors font-medium">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
