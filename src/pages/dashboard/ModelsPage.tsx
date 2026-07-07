import { motion } from 'framer-motion';
import { Cpu, Zap, Brain, Star, Check, ArrowRight, Sparkles } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

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
      <div className="max-w-5xl mx-auto p-6 pb-32 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-[#1F1F1F] tracking-tight">AI Models</h1>
              <Badge variant="accent" size="sm">New</Badge>
            </div>
            <p className="text-sm text-[#999]">Choose and configure AI models for your workspace</p>
          </div>
        </motion.div>

        {/* Hero model card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-gradient-to-br from-[#1F1F1F] to-[#2D2D2D] rounded-3xl p-7 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[rgba(233,162,76,0.06)] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-[rgba(16,185,129,0.04)] blur-2xl" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[rgba(16,185,129,0.15)] flex items-center justify-center">
                  <Brain size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-white/40 font-medium">Currently Active</p>
                  <p className="text-sm font-bold">GPT-4o by OpenAI</p>
                </div>
                <Badge variant="success" size="sm" dot className="ml-2">Active</Badge>
              </div>
              <h2 className="text-xl font-black mb-2">
                The most capable AI model
                <br />
                <span className="text-[#E9A24C]">in your workspace</span>
              </h2>
              <p className="text-sm text-white/50 leading-relaxed">
                GPT-4o combines text, vision, and audio understanding with industry-leading reasoning capabilities.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 lg:w-64 shrink-0">
              {[
                { label: 'Context', value: '128K', icon: Sparkles },
                { label: 'Speed', value: 'Fast', icon: Zap },
                { label: 'Quality', value: '★★★★★', icon: Star },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-white/5 rounded-xl p-3 text-center border border-white/8">
                    <Icon size={14} className="text-[#E9A24C] mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-white">{stat.value}</p>
                    <p className="text-[10px] text-white/40">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Model grid */}
        <div>
          <h2 className="text-sm font-bold text-[#1F1F1F] mb-4">All Available Models</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {models.map((model, i) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                whileHover={{ y: -5 }}
                className={`bg-gradient-to-br ${model.colorBg} rounded-2xl p-5 border border-white/80 shadow-card relative ${model.locked ? 'opacity-70' : 'cursor-pointer'}`}
              >
                {model.featured && (
                  <div className="absolute -top-2.5 left-4">
                    <Badge variant="accent" size="sm">⚡ Featured</Badge>
                  </div>
                )}
                {model.locked && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="neutral" size="sm">Enterprise</Badge>
                  </div>
                )}

                <div className="flex items-start justify-between mb-3 mt-2">
                  <div>
                    <p className="text-base font-black text-[#1F1F1F]">{model.name}</p>
                    <p className="text-xs text-[#999] font-medium">{model.provider}</p>
                  </div>
                  {model.active && (
                    <div className="w-6 h-6 rounded-full bg-[rgba(233,162,76,0.15)] flex items-center justify-center shrink-0">
                      <Check size={12} className="text-[#E9A24C]" strokeWidth={3} />
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#666] leading-relaxed mb-4">{model.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {model.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/60 text-[#666]">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                  {[
                    { label: 'Speed', value: model.speed },
                    { label: 'Context', value: model.context },
                  ].map((stat, j) => (
                    <div key={j} className="text-center">
                      <p className="text-xs font-bold text-[#1F1F1F]">{stat.value}</p>
                      <p className="text-[10px] text-[#999]">{stat.label}</p>
                    </div>
                  ))}
                  <div className="h-8 w-px bg-[rgba(0,0,0,0.06)]" />
                  <div className="text-center">
                    <p className="text-xs font-bold text-[#1F1F1F]">{model.quality}</p>
                    <p className="text-[10px] text-[#999]">Quality</p>
                  </div>
                </div>

                {model.locked ? (
                  <Button variant="outline" size="sm" className="w-full">
                    Upgrade to use <ArrowRight size={12} />
                  </Button>
                ) : model.active ? (
                  <div className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/60 text-[11px] font-semibold text-[#E9A24C]">
                    <Check size={12} strokeWidth={3} />
                    Currently active
                  </div>
                ) : (
                  <Button variant="secondary" size="sm" className="w-full">
                    <Cpu size={13} /> Activate model
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelsPage;
