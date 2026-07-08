import { motion } from 'framer-motion';
import { Cpu, Zap, Brain, Star, Check, ArrowRight, Sparkles } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const models = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Most capable for complex reasoning, analysis, and multimodal tasks including vision.',
    tags: ['Vision', 'Reasoning', 'Code'],
    speed: 'Fast',
    quality: 'Highest',
    context: '128K',
    active: true,
    featured: true,
    color: '#10B981',
    colorBg: 'from-emerald-50 to-green-50',
  },
  {
    id: 'claude-35',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Exceptional writing, nuanced understanding, and extremely long-context comprehension.',
    tags: ['Writing', 'Long-context', 'Analysis'],
    speed: 'Fast',
    quality: 'High',
    context: '200K',
    active: true,
    featured: false,
    color: '#8B5CF6',
    colorBg: 'from-purple-50 to-violet-50',
  },
  {
    id: 'gemini-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google DeepMind',
    description: 'Excellent for research, data analysis, and multimodal understanding at scale.',
    tags: ['Research', 'Multimodal', 'Data'],
    speed: 'Balanced',
    quality: 'High',
    context: '1M',
    active: true,
    featured: false,
    color: '#3B82F6',
    colorBg: 'from-blue-50 to-indigo-50',
  },
  {
    id: 'llama-3',
    name: 'Llama 3 70B',
    provider: 'Meta',
    description: 'Open-source powerhouse. Fastest responses with strong general capabilities.',
    tags: ['Fast', 'Open-source', 'General'],
    speed: 'Fastest',
    quality: 'Good',
    context: '128K',
    active: false,
    featured: false,
    color: '#F59E0B',
    colorBg: 'from-amber-50 to-yellow-50',
  },
  {
    id: 'mistral',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    description: 'European AI excellence with strong multilingual support and reasoning.',
    tags: ['Multilingual', 'Reasoning', 'EU'],
    speed: 'Fast',
    quality: 'High',
    context: '32K',
    active: false,
    featured: false,
    color: '#EC4899',
    colorBg: 'from-pink-50 to-rose-50',
  },
  {
    id: 'custom',
    name: 'Custom Model',
    provider: 'Enterprise',
    description: 'Fine-tune and deploy your own model with your proprietary data. Enterprise only.',
    tags: ['Custom', 'Fine-tuned', 'Private'],
    speed: 'Variable',
    quality: 'Custom',
    context: 'Custom',
    active: false,
    featured: false,
    color: '#6B7280',
    colorBg: 'from-gray-50 to-slate-50',
    locked: true,
  },
];

const ModelsPage = () => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="mx-auto max-w-5xl p-4 pb-32 sm:p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"
        >
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-[#1F1F1F]">AI Models</h1>
              <Badge variant="accent" size="sm">New</Badge>
            </div>
            <p className="text-sm text-[#999]">Choose and configure AI models for your workspace</p>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F1F1F] to-[#2D2D2D] p-5 text-white shadow-float sm:p-7"
          aria-labelledby="active-model-title"
        >
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[rgba(233,162,76,0.06)] blur-3xl" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-[rgba(16,185,129,0.04)] blur-2xl" aria-hidden="true" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(16,185,129,0.15)]">
                  <Brain size={20} className="text-emerald-400" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white/40">Currently Active</p>
                  <p className="text-sm font-bold text-white">GPT-4o by OpenAI</p>
                </div>
                <Badge variant="success" size="sm" dot className="sm:ml-2">Active</Badge>
              </div>
              <h2 id="active-model-title" className="mb-2 text-xl font-black leading-tight sm:text-2xl">
                The most capable AI model
                <br />
                <span className="text-[#E9A24C]">in your workspace</span>
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-white/55">
                GPT-4o combines text, vision, and audio understanding with industry-leading reasoning capabilities.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 lg:w-64 lg:shrink-0">
              {[
                { label: 'Context', value: '128K', icon: Sparkles },
                { label: 'Speed', value: 'Fast', icon: Zap },
                { label: 'Quality', value: '★★★★★', icon: Star },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-xl border border-white/8 bg-white/5 p-3 text-center">
                    <Icon size={14} className="mx-auto mb-1.5 text-[#E9A24C]" aria-hidden="true" />
                    <p className="text-xs font-bold text-white">{stat.value}</p>
                    <p className="text-[10px] text-white/40">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-[#1F1F1F]">All Available Models</h2>
            <span className="text-xs font-medium text-[#999]">{models.length} models</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((model, index) => (
              <motion.article
                key={model.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.06 }}
                whileHover={{ y: -5 }}
                className={cn('relative rounded-2xl border border-white/80 bg-gradient-to-br p-5 shadow-card', model.colorBg, model.locked ? 'opacity-75' : 'cursor-pointer')}
                aria-label={`${model.name} by ${model.provider}`}
              >
                {model.featured && (
                  <div className="absolute -top-2.5 left-4">
                    <Badge variant="accent" size="sm">⚡ Featured</Badge>
                  </div>
                )}
                {model.locked && (
                  <div className="absolute right-4 top-4">
                    <Badge variant="neutral" size="sm">Enterprise</Badge>
                  </div>
                )}

                <div className="mb-3 mt-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-base font-black text-[#1F1F1F]">{model.name}</p>
                    <p className="text-xs font-medium text-[#999]">{model.provider}</p>
                  </div>
                  {model.active && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(233,162,76,0.15)]">
                      <Check size={12} className="text-[#E9A24C]" strokeWidth={3} aria-hidden="true" />
                    </div>
                  )}
                </div>

                <p className="mb-4 text-xs leading-relaxed text-[#666]">{model.description}</p>

                <div className="mb-4 flex flex-wrap gap-1">
                  {model.tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-white/60 px-2 py-0.5 text-[10px] font-medium text-[#666]">{tag}</span>
                  ))}
                </div>

                <div className="mb-4 flex items-center justify-between gap-3">
                  {[
                    { label: 'Speed', value: model.speed },
                    { label: 'Context', value: model.context },
                  ].map((stat) => (
                    <div key={stat.label} className="min-w-0 text-center">
                      <p className="truncate text-xs font-bold text-[#1F1F1F]">{stat.value}</p>
                      <p className="text-[10px] text-[#999]">{stat.label}</p>
                    </div>
                  ))}
                  <div className="h-8 w-px bg-[rgba(0,0,0,0.06)]" aria-hidden="true" />
                  <div className="min-w-0 text-center">
                    <p className="truncate text-xs font-bold text-[#1F1F1F]">{model.quality}</p>
                    <p className="text-[10px] text-[#999]">Quality</p>
                  </div>
                </div>

                {model.locked ? (
                  <Button variant="outline" size="sm" className="w-full" iconRight={<ArrowRight size={12} />}>
                    Upgrade to use
                  </Button>
                ) : model.active ? (
                  <div className="flex items-center justify-center gap-1.5 rounded-xl bg-white/60 py-2 text-[11px] font-semibold text-[#E9A24C]" role="status">
                    <Check size={12} strokeWidth={3} aria-hidden="true" />
                    Currently active
                  </div>
                ) : (
                  <Button variant="secondary" size="sm" className="w-full" icon={<Cpu size={13} />}>
                    Activate model
                  </Button>
                )}
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ModelsPage;
