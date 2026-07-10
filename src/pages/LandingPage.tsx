import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  FileText,
  Github,
  Layers3,
  Lock,
  MessageSquare,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import NeuralBackground from '@/components/backgrounds/NeuralBackground';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { blurReveal, staggerContainer, staggerItem } from '@/lib/motion';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Product', id: 'product' },
  { label: 'Architecture', id: 'architecture' },
  { label: 'Quality', id: 'quality' },
  { label: 'Roadmap', id: 'roadmap' },
];

const highlights = [
  { label: 'Frontend', value: 'React 19 + TypeScript', icon: Layers3 },
  { label: 'Backend', value: 'FastAPI + MongoDB', icon: Server },
  { label: 'Auth', value: 'Clerk JWT', icon: ShieldCheck },
  { label: 'Experience', value: 'PWA + A11y', icon: Sparkles },
];

const productModules = [
  { title: 'AI Chat', description: 'Conversation history, message actions, streaming-ready UI, model selection, reactions, and polished empty states.', icon: MessageSquare },
  { title: 'Documents', description: 'Upload flow, previews, tags, categories, recent documents, metadata storage, and Cloudinary-ready architecture.', icon: FileText },
  { title: 'Analytics', description: 'Usage summaries, charts, activity timeline, recent work, and dashboard views built with reusable components.', icon: BarChart3 },
  { title: 'Global Search', description: 'Search across chats, messages, documents, users, and settings with filters and recent search persistence.', icon: Search },
  { title: 'Admin Console', description: 'Admin-only dashboards for users, documents, chats, feedback, logs, notifications, roles, and permissions.', icon: Lock },
  { title: 'Design System', description: 'Buttons, cards, dialogs, tables, tabs, toasts, skeletons, tooltips, forms, motion tokens, and accessibility patterns.', icon: Sparkles },
];

const qualitySignals = [
  'Clerk is the single authentication provider; the backend verifies Clerk JWTs before protected access.',
  'FastAPI backend follows API versioning, rate limiting, security headers, request logging, and global exception handling.',
  'MongoDB models include timestamps, soft delete support, indexes, validation, search fields, and pagination-ready responses.',
  'Frontend includes route-level loading, error recovery, offline state, command palette, keyboard shortcuts, and optimistic interactions.',
  'Documentation covers setup, architecture, APIs, deployment, contribution workflow, and a professional commit plan.',
];

const roadmap = [
  'Connect production AI provider keys and enable model routing through the provider abstraction.',
  'Add Cloudinary storage for document assets while keeping metadata in MongoDB.',
  'Add CI checks for frontend type safety, backend tests, and deployment smoke tests.',
  'Expand admin analytics with audit trails, retention controls, and workspace-level reporting.',
];

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F8F4EC] pb-24 text-[#1F1F1F]">
      <NeuralBackground />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_50%_0%,rgba(233,162,76,0.16),transparent_36%),radial-gradient(circle_at_80%_28%,rgba(215,185,142,0.15),transparent_34%)]" aria-hidden="true" />

      <motion.header initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="fixed inset-x-0 top-0 z-40">
        <div className="mx-auto max-w-6xl px-3 py-3 sm:px-6 sm:py-4">
          <div className="glass flex items-center justify-between rounded-2xl px-3 py-2.5 shadow-card sm:px-5 sm:py-3">
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5 rounded-xl ds-focus-ring">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#E9A24C] to-[#D4853A]">
                <Sparkles size={15} className="text-white" aria-hidden="true" />
              </div>
              <span className="text-sm font-black text-[#1F1F1F]">Pulse AI</span>
            </button>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Landing navigation">
              {navItems.map((item) => (
                <button key={item.id} type="button" onClick={() => scrollToSection(item.id)} className="rounded-lg px-3.5 py-2 text-sm font-semibold text-[#666] transition-colors hover:bg-[rgba(233,162,76,0.08)] hover:text-[#E9A24C] ds-focus-ring">
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="hidden sm:inline-flex">Sign in</Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/signup')} iconRight={<ArrowRight size={14} />}>Open app</Button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="relative z-[2]">
        <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-4 pb-16 pt-32 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:pt-28">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="min-w-0 text-center lg:text-left">
            <motion.div variants={staggerItem}>
              <Badge variant="accent" size="md" dot className="mb-6 px-4 py-1.5 text-xs sm:text-sm">Production-style AI SaaS portfolio</Badge>
            </motion.div>
            <motion.h1 variants={blurReveal} className="mx-auto max-w-4xl text-[clamp(2.75rem,8vw,6.5rem)] font-black leading-[1.02] tracking-[-0.07em] text-[#1F1F1F] lg:mx-0">
              An AI workspace built like a real product.
            </motion.h1>
            <motion.p variants={staggerItem} className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#666] sm:text-lg lg:mx-0">
              Pulse AI brings together chat, documents, analytics, global search, notifications, settings, admin controls, and a FastAPI backend in one polished full-stack experience.
            </motion.p>
            <motion.div variants={staggerItem} className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:justify-start">
              <Button variant="primary" size="xl" onClick={() => navigate('/signup')} className="shadow-premium-lg" iconRight={<ArrowRight size={18} />}>Create account</Button>
              <Button variant="secondary" size="xl" onClick={() => navigate('/dashboard')} icon={<Bot size={18} />}>View dashboard</Button>
            </motion.div>
            <motion.div variants={staggerItem} className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start" aria-label="Project quality badges">
              {['No separate auth system', 'Offline-ready shell', 'Accessible UI', 'Docker-ready API'].map((item) => <span key={item} className="rounded-full border border-[rgba(0,0,0,0.06)] bg-[#FFFDF8]/80 px-3 py-1.5 text-xs font-bold text-[#666] shadow-card">{item}</span>)}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 28, scale: 0.96, filter: 'blur(14px)' }} animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }} transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative">
            <div className="absolute -left-8 -top-8 h-36 w-36 rounded-full bg-[#E9A24C]/20 blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-10 -right-8 h-44 w-44 rounded-full bg-[#D7B98E]/20 blur-3xl" aria-hidden="true" />
            <div className="glass-card relative overflow-hidden rounded-[2rem] border border-white/70 shadow-float">
              <div className="flex items-center gap-2 border-b border-[rgba(0,0,0,0.06)] bg-white/45 px-4 py-3">
                <div className="flex gap-1.5" aria-hidden="true"><span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-yellow-400" /><span className="h-3 w-3 rounded-full bg-green-400" /></div>
                <div className="mx-auto rounded-lg bg-[rgba(0,0,0,0.04)] px-4 py-1 text-[10px] font-semibold text-[#999]">pulse-ai.app/workspace</div>
              </div>
              <div className="grid gap-4 p-4 sm:p-6">
                <div className="rounded-3xl bg-gradient-to-br from-[#1F1F1F] to-[#2D2D2D] p-5 text-white shadow-float">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">Workspace overview</p>
                      <p className="mt-1 text-2xl font-black tracking-tight">Build-ready SaaS</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E9A24C] text-white shadow-premium"><Zap size={18} aria-hidden="true" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {highlights.map((item) => {
                      const Icon = item.icon;
                      return <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-3"><Icon size={15} className="mb-2 text-[#E9A24C]" aria-hidden="true" /><p className="text-[10px] uppercase tracking-[0.16em] text-white/40">{item.label}</p><p className="mt-1 text-sm font-black text-white">{item.value}</p></div>;
                    })}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {['Command palette', 'Streaming chat', 'Document preview', 'Admin analytics'].map((item) => <div key={item} className="flex items-center gap-2 rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[#FFFDF8] p-3 shadow-card"><CheckCircle2 size={16} className="text-[#E9A24C]" aria-hidden="true" /><span className="text-sm font-bold text-[#1F1F1F]">{item}</span></div>)}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="product" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <Badge variant="accent" size="md" className="mb-4">Product surface</Badge>
              <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Every core SaaS module has a finished state.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#666]">The project is structured to show recruiters the pieces that matter in real production work: auth, data fetching, routing, feedback, empty states, loading states, error recovery, and responsive layouts.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {productModules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <Card key={module.title} hover delay={index * 0.04} className="h-full glass-shine">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(233,162,76,0.12)] text-[#E9A24C]"><Icon size={20} aria-hidden="true" /></div>
                    <h3 className="text-base font-black text-[#1F1F1F]">{module.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#666]">{module.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="architecture" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Badge variant="accent" size="md" className="mb-4">Architecture</Badge>
              <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Frontend polish backed by a real API architecture.</h2>
              <p className="mt-4 text-base leading-8 text-[#666]">The frontend is organized around reusable UI, route-level lazy loading, stateful hooks, design tokens, and accessibility patterns. The backend uses clean FastAPI modules, Beanie models, MongoDB indexes, Clerk verification, rate limiting, logging, and Docker-ready configuration.</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {['Clean architecture', 'API versioning', 'Soft delete models', 'Provider abstraction', 'Production docs'].map((item) => <span key={item} className="rounded-full bg-[#FFFDF8] px-3 py-1.5 text-xs font-bold text-[#666] shadow-card">{item}</span>)}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: 'Frontend', items: ['React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
                { title: 'Backend', items: ['FastAPI', 'Beanie ODM', 'MongoDB Atlas', 'Loguru'] },
                { title: 'Security', items: ['Clerk JWT', 'CORS', 'Rate limiting', 'Security headers'] },
                { title: 'Deployment', items: ['Vercel', 'Render', 'Docker', 'Health checks'] },
              ].map((group) => (
                <Card key={group.title} hover>
                  <h3 className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#999]">{group.title}</h3>
                  <div className="space-y-2">{group.items.map((item) => <div key={item} className="flex items-center gap-2 text-sm font-semibold text-[#1F1F1F]"><span className="h-1.5 w-1.5 rounded-full bg-[#E9A24C]" />{item}</div>)}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="quality" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
              <Badge variant="accent" size="md" className="mb-4">Hiring review</Badge>
              <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Signals a senior-quality product mindset.</h2>
            </div>
            <Card className="p-5 sm:p-7">
              <div className="grid gap-3">
                {qualitySignals.map((item, index) => (
                  <motion.div key={item} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="flex items-start gap-3 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[rgba(255,253,248,0.72)] p-4">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#E9A24C]" aria-hidden="true" />
                    <p className="text-sm leading-7 text-[#444]">{item}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section id="roadmap" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-5xl text-center">
            <Badge variant="accent" size="md" className="mb-4">Roadmap</Badge>
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Clear next steps for a real SaaS launch.</h2>
            <div className="mt-8 grid gap-4 text-left md:grid-cols-2">
              {roadmap.map((item, index) => <Card key={item} hover delay={index * 0.04}><p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#E9A24C]">Next {String(index + 1).padStart(2, '0')}</p><p className="text-sm leading-7 text-[#444]">{item}</p></Card>)}
            </div>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="primary" size="lg" onClick={() => navigate('/signup')} iconRight={<ArrowRight size={16} />}>Explore Pulse AI</Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/dashboard')} icon={<Github size={16} />}>Review dashboard</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-[2] border-t border-[rgba(0,0,0,0.06)] px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#E9A24C] to-[#D4853A]"><Sparkles size={15} className="text-white" aria-hidden="true" /></div><span className="text-sm font-black text-[#1F1F1F]">Pulse AI</span></div>
            <p className="max-w-md text-sm leading-7 text-[#666]">A portfolio-grade AI SaaS project focused on full-stack architecture, premium UX, accessibility, and deployment readiness.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => <button key={item.id} type="button" onClick={() => scrollToSection(item.id)} className="rounded-lg px-3 py-2 text-sm font-semibold text-[#666] hover:bg-[rgba(233,162,76,0.08)] hover:text-[#E9A24C] ds-focus-ring">{item.label}</button>)}
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-[rgba(0,0,0,0.05)] pt-6 sm:flex-row">
          <span className="text-xs text-[#999]">© 2026 Pulse AI. Built as a production-quality full-stack portfolio project.</span>
          <div className="flex items-center gap-2 text-xs text-[#999]"><Lock size={12} className="text-[#E9A24C]" aria-hidden="true" /> Secure by design</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
