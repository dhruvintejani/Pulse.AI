import { useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  ChevronDown,
  Clock,
  Cpu,
  FileText,
  Globe,
  Layers,
  Lock,
  Mail,
  MessageSquare,
  Quote,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import NeuralBackground from '@/components/backgrounds/NeuralBackground';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const stats = [
  { value: 10, suffix: 'M+', label: 'Messages Processed', icon: MessageSquare },
  { value: 99.9, suffix: '%', label: 'Uptime SLA', icon: Shield, decimals: 1 },
  { value: 50, suffix: 'ms', label: 'Avg Response', icon: Zap },
  { value: 150, suffix: '+', label: 'Countries', icon: Globe },
];

const features = [
  { icon: Brain, title: 'Intelligent Chat', description: 'Engage with multi-model AI for research, writing, coding, and complex analysis with context memory.', gradient: 'from-orange-100 to-amber-50', iconBg: 'bg-orange-100', iconColor: 'text-[#E9A24C]' },
  { icon: FileText, title: 'Document Intelligence', description: 'Upload PDFs, docs, and spreadsheets. Ask questions, extract insights, and get instant summaries.', gradient: 'from-blue-50 to-indigo-50', iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
  { icon: BarChart3, title: 'Deep Analytics', description: 'Visualize AI usage, conversation insights, and productivity metrics in beautiful dashboards.', gradient: 'from-purple-50 to-pink-50', iconBg: 'bg-purple-50', iconColor: 'text-purple-500' },
  { icon: Layers, title: 'Smart Workspace', description: 'Organize projects, collaborate with teams, and manage AI workflows in one unified workspace.', gradient: 'from-green-50 to-emerald-50', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  { icon: Cpu, title: 'Multiple AI Models', description: 'Access GPT-4, Claude, Gemini, and Llama. Switch models mid-conversation for optimal results.', gradient: 'from-amber-50 to-yellow-50', iconBg: 'bg-amber-50', iconColor: 'text-amber-500' },
  { icon: Shield, title: 'Enterprise Security', description: 'SOC 2-ready controls with encryption, SSO, audit logs, and data residency options.', gradient: 'from-slate-50 to-gray-50', iconBg: 'bg-slate-100', iconColor: 'text-slate-500' },
];

const steps = [
  { step: '01', title: 'Connect Your Workspace', description: 'Import documents, connect tools, and set up your AI preferences in minutes.' },
  { step: '02', title: 'Chat with Intelligence', description: 'Ask questions, generate content, and analyze data using natural conversation.' },
  { step: '03', title: 'Amplify Your Output', description: 'Get 10x more done with AI-powered workflows that adapt to your style.' },
];

const plans = [
  { name: 'Starter', monthly: 0, yearly: 0, description: 'Perfect for individuals exploring AI.', features: ['50 AI messages/month', '1 workspace', '100MB document storage', 'Access to GPT-3.5', 'Community support'], cta: 'Get Started Free', variant: 'secondary' as const, popular: false },
  { name: 'Pro', monthly: 19, yearly: 15, description: 'For power users and professionals.', features: ['Unlimited AI messages', '10 workspaces', '10GB document storage', 'All AI models', 'Priority support', 'Advanced analytics', 'API access'], cta: 'Start Pro Trial', variant: 'primary' as const, popular: true },
  { name: 'Enterprise', monthly: 89, yearly: 71, description: 'For teams that need the best.', features: ['Everything in Pro', 'Unlimited workspaces', 'Unlimited storage', 'Custom AI models', 'Dedicated support', 'SSO & SAML', 'SLA guarantee', 'Audit logs'], cta: 'Contact Sales', variant: 'outline' as const, popular: false },
];

const testimonials = [
  { quote: 'Pulse AI transformed how our team handles research. What used to take days now takes hours. The document intelligence feature alone is worth 10x the price.', author: 'Sarah Chen', role: 'VP Product, TechFlow', avatar: 'SC', rating: 5 },
  { quote: 'The most elegant AI interface I have ever used. Clean, fast, and incredibly powerful. Our engineering team productivity jumped 40% in the first month.', author: 'Marcus Rivera', role: 'CTO, Nexus Labs', avatar: 'MR', rating: 5 },
  { quote: 'I have tried every AI tool out there. Pulse AI is the only one that actually understands my workflow. Multi-model switching is a game changer.', author: 'Priya Sharma', role: 'Lead Designer, Orbit Studio', avatar: 'PS', rating: 5 },
];

const faqs = [
  { q: 'Which AI models does Pulse AI support?', a: 'Pulse AI supports GPT-4o, Claude 3.5, Gemini Pro, Llama, and more. New model options can be added without changing the workspace flow.' },
  { q: 'Is my data secure and private?', a: 'The product experience is designed around encrypted storage, team permissions, auditability, and enterprise-ready controls.' },
  { q: 'Can I import my existing documents?', a: 'Yes. The interface supports PDFs, DOCX, TXT, MD, CSV, XLSX, and future integrations such as Drive, Notion, and Dropbox.' },
  { q: 'Do you offer a free trial?', a: 'The Starter plan is free forever, and Pro includes a premium trial-style experience for teams evaluating advanced workflows.' },
  { q: 'Can my team collaborate in workspaces?', a: 'Yes. Workspaces organize chats, documents, analytics, and team activity into a focused project environment.' },
];

const navItems = ['Features', 'How It Works', 'Pricing', 'FAQ'];

const FadeInView = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] }} className={className}>
    {children}
  </motion.div>
);

const AnimatedStat = ({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;

    let animationFrame = 0;
    const start = performance.now();
    const duration = 1200;

    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * eased);
      if (progress < 1) animationFrame = requestAnimationFrame(update);
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [inView, value]);

  return <span ref={ref}>{displayValue.toFixed(decimals)}{suffix}</span>;
};

const LandingPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 80, damping: 24 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 80, damping: 24 });
  const mouseBackground = useMotionTemplate`radial-gradient(520px circle at ${smoothMouseX}px ${smoothMouseY}px, rgba(233,162,76,0.16), transparent 42%)`;
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const yearlySavings = useMemo(() => Math.round(((19 * 12 - 15 * 12) / (19 * 12)) * 100), []);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    mouseX.set(event.clientX);
    mouseY.set(event.clientY);
  };

  const scrollToSection = (section: string) => {
    const id = section.toLowerCase().replace(/\s+/g, '-');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div onMouseMove={handleMouseMove} className="relative min-h-screen overflow-x-hidden pb-28 text-[#1F1F1F]">
      <NeuralBackground />
      <motion.div className="pointer-events-none fixed inset-0 z-[1]" style={{ background: mouseBackground }} />
      <motion.div className="pointer-events-none fixed inset-0 z-[1]" style={{ y: orbY }}>
        <div className="absolute left-[8%] top-[18%] h-72 w-72 rounded-full bg-[rgba(233,162,76,0.08)] blur-3xl" />
        <div className="absolute right-[6%] top-[38%] h-80 w-80 rounded-full bg-[rgba(215,185,142,0.1)] blur-3xl" />
      </motion.div>

      <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="fixed inset-x-0 top-0 z-40">
        <div className="mx-auto max-w-6xl px-3 py-3 sm:px-6 sm:py-4">
          <div className="glass flex items-center justify-between rounded-2xl px-3 py-2.5 shadow-card sm:px-5 sm:py-3">
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5 rounded-xl focus-ring">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#E9A24C] to-[#D4853A]">
                <Sparkles size={15} className="text-white" aria-hidden="true" />
              </div>
              <span className="text-sm font-black text-[#1F1F1F]">Pulse AI</span>
            </button>
            <nav className="hidden items-center gap-1 md:flex" aria-label="Landing navigation">
              {navItems.map((item) => (
                <button key={item} type="button" onClick={() => scrollToSection(item)} className="rounded-lg px-3.5 py-2 text-sm font-medium text-[#666] transition-colors hover:bg-[rgba(233,162,76,0.06)] hover:text-[#E9A24C] focus-ring">
                  {item}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="hidden sm:inline-flex">Sign in</Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>Get started <ArrowRight size={14} className="ml-1" /></Button>
            </div>
          </div>
        </div>
      </motion.header>

      <section ref={heroRef} className="relative z-[2] flex min-h-screen flex-col items-center justify-center px-4 pb-14 pt-28 sm:px-6 sm:pt-32">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, scale: 0.82 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Badge variant="accent" size="md" dot className="mb-7 px-4 py-1.5 text-xs sm:text-sm">Introducing Pulse AI 2.0 — Vision, Voice & Workspaces</Badge>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 38 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }} className="mb-6 text-[clamp(2.7rem,9vw,6.8rem)] font-black leading-[1.02] tracking-[-0.06em] text-[#1F1F1F]">
            The AI workspace
            <br />
            <span className="gradient-text">built for flow</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="mb-9 max-w-2xl text-base leading-relaxed text-[#666] sm:text-lg md:text-xl">
            Chat with the best AI models, analyze documents, track insights, and supercharge your team’s productivity — all in one beautiful workspace.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="mb-12 flex w-full max-w-md flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center">
            <Button variant="primary" size="xl" onClick={() => navigate('/signup')} className="w-full shadow-premium-lg sm:w-auto">Start for free <ArrowRight size={18} className="ml-1" /></Button>
            <Button variant="secondary" size="xl" onClick={() => navigate('/dashboard')} className="w-full sm:w-auto">
              <span className="flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(233,162,76,0.2)]"><span className="h-2 w-2 rounded-full bg-[#E9A24C]" /></span>View live demo</span>
            </Button>
          </motion.div>

          <motion.div style={{ y: visualY }} initial={{ opacity: 0, y: 58, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.6, ease: [0.4, 0, 0.2, 1] }} className="relative w-full max-w-4xl px-0 sm:px-4">
            <motion.div animate={{ rotateX: [0, 1.5, 0], rotateY: [0, -1.5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="glass-card overflow-hidden rounded-3xl border border-white/70 shadow-float will-change-transform">
              <div className="flex items-center gap-2 border-b border-[rgba(0,0,0,0.06)] bg-white/50 px-4 py-3 sm:px-5">
                <div className="flex gap-1.5" aria-hidden="true"><span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-yellow-400" /><span className="h-3 w-3 rounded-full bg-green-400" /></div>
                <div className="mx-2 flex-1 sm:mx-4"><div className="mx-auto flex h-5 w-full max-w-xs items-center justify-center rounded-md bg-[rgba(0,0,0,0.04)]"><span className="truncate px-2 text-[10px] text-[#999]">app.pulseai.com/chat</span></div></div>
              </div>
              <div className="flex min-h-[300px] flex-col gap-4 bg-gradient-to-br from-[#FFFDF8] to-[#F8F4EC] p-4 sm:min-h-[330px] sm:p-6">
                <div className="flex max-w-[92%] gap-3 sm:max-w-[80%]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A]"><Sparkles size={14} className="text-white" aria-hidden="true" /></div>
                  <div className="chat-bubble-ai px-4 py-3 shadow-card"><p className="text-sm leading-relaxed text-[#1F1F1F]">I analyzed your Q3 market research document. Here are the key insights:</p><div className="mt-2 space-y-1.5">{['Revenue grew 34% YoY across all segments', 'Mobile users represent 67% of traffic', 'APAC shows highest growth potential'].map((item) => <div key={item} className="flex items-center gap-2 text-xs text-[#666]"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E9A24C]" />{item}</div>)}</div></div>
                </div>
                <div className="ml-auto flex max-w-[88%] flex-row-reverse gap-3 sm:max-w-[70%]"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#1F1F1F] text-xs font-bold text-white">A</div><div className="chat-bubble-user px-4 py-3 shadow-premium"><p className="text-sm leading-relaxed">Create a summary presentation for the board.</p></div></div>
                <div className="flex max-w-[80%] gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A]"><Sparkles size={14} className="text-white" aria-hidden="true" /></div><div className="chat-bubble-ai px-4 py-3"><div className="flex h-4 items-center gap-1.5"><span className="typing-dot h-1.5 w-1.5 rounded-full bg-[#E9A24C]" /><span className="typing-dot h-1.5 w-1.5 rounded-full bg-[#E9A24C]" /><span className="typing-dot h-1.5 w-1.5 rounded-full bg-[#E9A24C]" /></div></div></div>
              </div>
            </motion.div>

            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute -left-5 top-12 hidden items-center gap-3 rounded-2xl p-3.5 shadow-float glass-card lg:flex"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A]"><TrendingUp size={16} className="text-white" aria-hidden="true" /></div><div><p className="text-xs font-semibold text-[#1F1F1F]">Productivity</p><p className="text-lg font-black text-[#E9A24C]">+340%</p></div></motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute -right-5 top-20 hidden items-center gap-3 rounded-2xl p-3.5 shadow-float glass-card lg:flex"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100"><Users size={16} className="text-blue-500" aria-hidden="true" /></div><div><p className="text-xs font-semibold text-[#1F1F1F]">Active Teams</p><p className="text-lg font-black text-[#1F1F1F]">12,450</p></div></motion.div>
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }} className="absolute -right-4 bottom-16 hidden items-center gap-3 rounded-2xl p-3.5 shadow-float glass-card lg:flex"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100"><Clock size={16} className="text-emerald-500" aria-hidden="true" /></div><div><p className="text-xs font-semibold text-[#1F1F1F]">Hours Saved</p><p className="text-lg font-black text-[#1F1F1F]">8.4/week</p></div></motion.div>
          </motion.div>
        </motion.div>

        <motion.button type="button" onClick={() => scrollToSection('Features')} animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 rounded-xl opacity-50 focus-ring">
          <span className="text-xs font-medium text-[#666]">Scroll to explore</span><ChevronDown size={16} className="text-[#666]" aria-hidden="true" />
        </motion.button>
      </section>

      <section className="relative z-[2] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl p-5 shadow-card glass-card sm:p-8">
            <div className="grid grid-cols-2 gap-5 sm:gap-8 md:grid-cols-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <FadeInView key={stat.label} delay={index * 0.08} className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(233,162,76,0.1)]"><Icon size={18} className="text-[#E9A24C]" aria-hidden="true" /></div>
                      <span className="text-2xl font-black text-[#1F1F1F] sm:text-3xl md:text-4xl"><AnimatedStat value={stat.value} suffix={stat.suffix} decimals={stat.decimals ?? 0} /></span>
                      <span className="text-xs font-medium text-[#999] sm:text-sm">{stat.label}</span>
                    </div>
                  </FadeInView>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-[2] scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <FadeInView className="mb-12 text-center sm:mb-16">
            <Badge variant="accent" size="md" className="mb-4">Features</Badge>
            <h2 className="mb-4 text-3xl font-black tracking-tight text-[#1F1F1F] sm:text-4xl md:text-5xl">Everything you need to work<br /><span className="gradient-text">smarter, not harder</span></h2>
            <p className="mx-auto max-w-xl text-base text-[#666] sm:text-lg">A complete AI toolkit designed for the way modern teams actually work.</p>
          </FadeInView>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <FadeInView key={feature.title} delay={index * 0.06}>
                  <motion.div whileHover={{ y: -7, scale: 1.015 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.2 }} className={`group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br ${feature.gradient} p-6 shadow-card`}>
                    <div className="absolute inset-0 translate-y-full bg-gradient-to-t from-white/40 to-transparent opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" aria-hidden="true" />
                    <div className={`relative mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${feature.iconBg} transition-transform duration-200 group-hover:scale-110`}><Icon size={20} className={feature.iconColor} aria-hidden="true" /></div>
                    <h3 className="relative mb-2 text-base font-bold text-[#1F1F1F]">{feature.title}</h3>
                    <p className="relative text-sm leading-relaxed text-[#666]">{feature.description}</p>
                  </motion.div>
                </FadeInView>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative z-[2] scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <FadeInView className="mb-12 text-center sm:mb-16">
            <Badge variant="accent" size="md" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl font-black tracking-tight text-[#1F1F1F] sm:text-4xl md:text-5xl">Up and running in<br /><span className="gradient-text">under 5 minutes</span></h2>
          </FadeInView>
          <div className="relative">
            <div className="absolute left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] top-16 hidden h-px bg-gradient-to-r from-[#E9A24C] via-[#D7B98E] to-[#E9A24C] opacity-30 md:block" />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <FadeInView key={step.step} delay={index * 0.12}>
                  <motion.div whileHover={{ y: -4 }} className="flex flex-col items-center rounded-2xl p-4 text-center transition-colors hover:bg-white/30">
                    <div className="relative mb-6"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] shadow-premium"><span className="text-base font-black text-white">{step.step}</span></div></div>
                    <h3 className="mb-2 text-lg font-bold text-[#1F1F1F]">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-[#666]">{step.description}</p>
                  </motion.div>
                </FadeInView>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-[2] px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <FadeInView className="overflow-hidden rounded-3xl shadow-float glass-card">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="flex flex-col justify-center p-6 sm:p-10">
                <Badge variant="accent" size="md" className="mb-6 w-fit">AI Showcase</Badge>
                <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-[#1F1F1F] md:text-4xl">Multi-model AI<br /><span className="gradient-text">at your fingertips</span></h2>
                <p className="mb-6 leading-relaxed text-[#666]">Switch between GPT-4o, Claude, Gemini, and more — mid-conversation. Use the right model for every task.</p>
                <div className="space-y-3">{['Analyze complex documents instantly', 'Generate code in any language', 'Create stunning content and copy', 'Research with real-time context'].map((item) => <div key={item} className="flex items-center gap-2.5"><div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(233,162,76,0.15)]"><Check size={11} className="text-[#E9A24C]" strokeWidth={3} aria-hidden="true" /></div><span className="text-sm font-medium text-[#1F1F1F]">{item}</span></div>)}</div>
                <div className="mt-8"><Button variant="primary" onClick={() => navigate('/dashboard/chat')}>Try it now <ArrowRight size={16} className="ml-1" /></Button></div>
              </div>
              <div className="flex flex-col justify-center bg-gradient-to-br from-[#1F1F1F] to-[#2D2D2D] p-6 sm:p-8">
                <div className="space-y-3">{[{ model: 'GPT-4o', color: '#10B981', tag: 'Best for reasoning' }, { model: 'Claude 3.5', color: '#8B5CF6', tag: 'Best for writing' }, { model: 'Gemini Pro', color: '#3B82F6', tag: 'Best for analysis' }, { model: 'Llama 3', color: '#F59E0B', tag: 'Fast & efficient' }].map((model, index) => <motion.div key={model.model} initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className={cn('flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all duration-200', index === 0 ? 'border-[rgba(233,162,76,0.4)] bg-[rgba(233,162,76,0.06)]' : 'border-white/8 bg-white/3 hover:border-white/20')}><div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${model.color}20` }}><Cpu size={14} style={{ color: model.color }} aria-hidden="true" /></div><div className="flex-1"><p className="text-sm font-semibold text-white">{model.model}</p><p className="text-xs text-white/40">{model.tag}</p></div>{index === 0 && <span className="rounded-full bg-[rgba(233,162,76,0.2)] px-2 py-0.5 text-[10px] font-semibold text-[#E9A24C]">Active</span>}</motion.div>)}</div>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      <section id="pricing" className="relative z-[2] scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <FadeInView className="mb-10 text-center sm:mb-12">
            <Badge variant="accent" size="md" className="mb-4">Pricing</Badge>
            <h2 className="mb-4 text-3xl font-black tracking-tight text-[#1F1F1F] sm:text-4xl md:text-5xl">Simple, transparent<br /><span className="gradient-text">pricing for everyone</span></h2>
            <p className="text-base text-[#666] sm:text-lg">Start free, scale as you grow. No hidden fees.</p>
            <div className="mx-auto mt-6 inline-flex rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[#FFFDF8] p-1 shadow-card">
              {(['monthly', 'yearly'] as const).map((cycle) => <button key={cycle} type="button" onClick={() => setBillingCycle(cycle)} className={cn('rounded-xl px-4 py-2 text-sm font-bold capitalize transition-all focus-ring', billingCycle === cycle ? 'bg-[#1F1F1F] text-white shadow-card' : 'text-[#666] hover:text-[#E9A24C]')}>{cycle}{cycle === 'yearly' && <span className="ml-2 rounded-full bg-[rgba(233,162,76,0.18)] px-2 py-0.5 text-[10px] text-[#E9A24C]">Save {yearlySavings}%</span>}</button>)}
            </div>
          </FadeInView>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {plans.map((plan, index) => {
              const price = billingCycle === 'monthly' ? plan.monthly : plan.yearly;
              return (
                <FadeInView key={plan.name} delay={index * 0.08}>
                  <motion.div whileHover={{ y: -7 }} className={cn('relative flex h-full flex-col rounded-2xl p-6 sm:p-7', plan.popular ? 'bg-gradient-to-br from-[#1F1F1F] to-[#2D2D2D] text-white shadow-float' : 'border border-[rgba(0,0,0,0.06)] bg-[#FFFDF8] shadow-card')}>
                    {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="rounded-full bg-gradient-to-r from-[#E9A24C] to-[#D4853A] px-3 py-1 text-xs font-bold text-white shadow-premium">Most Popular</span></div>}
                    <div className="mb-6"><h3 className={cn('mb-1 text-base font-bold', plan.popular ? 'text-white' : 'text-[#1F1F1F]')}>{plan.name}</h3><p className={cn('mb-4 text-xs', plan.popular ? 'text-white/50' : 'text-[#999]')}>{plan.description}</p><div className="flex items-end gap-1"><span className={cn('text-4xl font-black', plan.popular ? 'text-white' : 'text-[#1F1F1F]')}>{price === 0 ? '$0' : `$${price}`}</span><span className={cn('mb-1 text-sm', plan.popular ? 'text-white/50' : 'text-[#999]')}>/{price === 0 ? 'forever' : billingCycle === 'monthly' ? 'month' : 'seat/month'}</span></div></div>
                    <div className="mb-7 flex-1 space-y-2.5">{plan.features.map((feature) => <div key={feature} className="flex items-center gap-2.5"><div className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full', plan.popular ? 'bg-[rgba(233,162,76,0.2)]' : 'bg-[rgba(233,162,76,0.1)]')}><Check size={10} className="text-[#E9A24C]" strokeWidth={3} aria-hidden="true" /></div><span className={cn('text-sm', plan.popular ? 'text-white/80' : 'text-[#666]')}>{feature}</span></div>)}</div>
                    <Button variant={plan.popular ? 'primary' : plan.variant} className="w-full" onClick={() => navigate('/signup')}>{plan.cta}</Button>
                  </motion.div>
                </FadeInView>
              );
            })}
          </div>
        </div>
      </section>

      <section id="testimonials" className="relative z-[2] px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <FadeInView className="mb-12 text-center sm:mb-16"><Badge variant="accent" size="md" className="mb-4">Testimonials</Badge><h2 className="text-3xl font-black tracking-tight text-[#1F1F1F] sm:text-4xl md:text-5xl">Loved by<br /><span className="gradient-text">thousands of teams</span></h2></FadeInView>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">{testimonials.map((item, index) => <FadeInView key={item.author} delay={index * 0.08}><motion.div whileHover={{ y: -7 }} className="flex h-full flex-col gap-4 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] p-6 shadow-card"><div className="flex gap-1">{Array.from({ length: item.rating }).map((_, starIndex) => <Star key={starIndex} size={14} className="fill-[#E9A24C] text-[#E9A24C]" aria-hidden="true" />)}</div><Quote size={20} className="text-[#E9A24C]/30" aria-hidden="true" /><p className="flex-1 text-sm leading-relaxed text-[#444]">{item.quote}</p><div className="flex items-center gap-3 border-t border-[rgba(0,0,0,0.05)] pt-2"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] text-xs font-bold text-white">{item.avatar}</div><div><p className="text-sm font-semibold text-[#1F1F1F]">{item.author}</p><p className="text-xs text-[#999]">{item.role}</p></div></div></motion.div></FadeInView>)}</div>
        </div>
      </section>

      <section id="faq" className="relative z-[2] scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <FadeInView className="mb-12 text-center sm:mb-16"><Badge variant="accent" size="md" className="mb-4">FAQ</Badge><h2 className="text-3xl font-black tracking-tight text-[#1F1F1F] sm:text-4xl md:text-5xl">Questions?<br /><span className="gradient-text">We’ve got answers</span></h2></FadeInView>
          <div className="space-y-3">{faqs.map((faq, index) => { const active = openFaq === index; return <FadeInView key={faq.q} delay={index * 0.04}><motion.div layout className="overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] shadow-card"><button type="button" onClick={() => setOpenFaq(active ? -1 : index)} aria-expanded={active} className="flex w-full items-center justify-between px-5 py-4 text-left focus-ring sm:px-6"><span className="text-sm font-semibold text-[#1F1F1F]">{faq.q}</span><ChevronDown size={16} className={cn('ml-4 shrink-0 text-[#999] transition-transform duration-200', active && 'rotate-180')} aria-hidden="true" /></button><AnimatePresence initial={false}>{active && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}><p className="px-5 pb-5 text-sm leading-relaxed text-[#666] sm:px-6">{faq.a}</p></motion.div>}</AnimatePresence></motion.div></FadeInView>; })}</div>
        </div>
      </section>

      <section className="relative z-[2] px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <FadeInView>
            <div className="relative overflow-hidden rounded-3xl p-8 shadow-float glass-card sm:p-12">
              <div className="absolute inset-0 overflow-hidden rounded-3xl" aria-hidden="true"><div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[rgba(233,162,76,0.16)] to-transparent" /><div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-gradient-to-tr from-[rgba(215,185,142,0.12)] to-transparent" /></div>
              <div className="relative z-10"><div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] shadow-premium-lg"><Sparkles size={28} className="text-white" aria-hidden="true" /></div><h2 className="mb-4 text-3xl font-black tracking-tight text-[#1F1F1F] md:text-4xl">Ready to work at the<br /><span className="gradient-text">speed of thought?</span></h2><p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-[#666]">Join teams already using Pulse AI to do their best work. Start free, no credit card required.</p><div className="flex flex-col items-center justify-center gap-3 sm:flex-row"><Button variant="primary" size="lg" onClick={() => navigate('/signup')} className="w-full shadow-premium-lg sm:w-auto">Get started for free <ArrowRight size={16} className="ml-1" /></Button><Button variant="secondary" size="lg" onClick={() => navigate('/login')} className="w-full sm:w-auto">Sign in to dashboard</Button></div><p className="mt-4 text-xs text-[#999]">No credit card required • 14-day Pro trial • Cancel anytime</p></div>
            </div>
          </FadeInView>
        </div>
      </section>

      <footer className="relative z-[2] border-t border-[rgba(0,0,0,0.06)] px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
            <div><div className="mb-3 flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#E9A24C] to-[#D4853A]"><Sparkles size={15} className="text-white" aria-hidden="true" /></div><span className="text-sm font-black text-[#1F1F1F]">Pulse AI</span></div><p className="max-w-xs text-sm leading-relaxed text-[#666]">A premium AI workspace for teams that want beautiful software and serious productivity.</p></div>
            {[{ title: 'Product', links: ['Features', 'Pricing', 'Docs', 'Status'] }, { title: 'Company', links: ['Blog', 'Security', 'Privacy', 'Terms'] }].map((group) => <div key={group.title}><p className="mb-3 text-xs font-black uppercase tracking-widest text-[#999]">{group.title}</p><div className="flex flex-col gap-2">{group.links.map((link) => <button key={link} type="button" onClick={() => link === 'Features' || link === 'Pricing' ? scrollToSection(link) : undefined} className="w-fit rounded-md text-sm font-medium text-[#666] transition-colors hover:text-[#E9A24C] focus-ring">{link}</button>)}</div></div>)}
            <div><p className="mb-3 text-xs font-black uppercase tracking-widest text-[#999]">Stay updated</p><p className="mb-3 text-sm text-[#666]">Get product updates and AI workflow tips.</p><div className="flex gap-2"><label className="sr-only" htmlFor="footer-email">Email address</label><input id="footer-email" type="email" placeholder="you@company.com" className="min-w-0 flex-1 rounded-xl border border-[rgba(0,0,0,0.06)] bg-[#FFFDF8] px-3 py-2.5 text-sm text-[#1F1F1F] outline-none placeholder:text-[#CCC] focus:border-[rgba(233,162,76,0.4)]" /><Button variant="primary" size="md" icon={<Mail size={14} />}>Join</Button></div></div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[rgba(0,0,0,0.05)] pt-6 sm:flex-row"><span className="text-xs text-[#999]">© 2026 Pulse AI Inc. All rights reserved.</span><div className="flex items-center gap-2 text-xs text-[#999]"><Lock size={12} className="text-[#E9A24C]" aria-hidden="true" /> Secure by design</div></div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
