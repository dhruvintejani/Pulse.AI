import { motion } from 'framer-motion';
import { CreditCard, Check, ArrowRight, Download, Zap, Shield, Sparkles } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const invoices = [
  { id: 'INV-2025-12', date: 'Dec 1, 2025', amount: '$19.00', status: 'paid' },
  { id: 'INV-2025-11', date: 'Nov 1, 2025', amount: '$19.00', status: 'paid' },
  { id: 'INV-2025-10', date: 'Oct 1, 2025', amount: '$19.00', status: 'paid' },
  { id: 'INV-2025-09', date: 'Sep 1, 2025', amount: '$19.00', status: 'paid' },
];

const BillingPage = () => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-3xl mx-auto p-6 pb-32 space-y-5">
        <FadeIn>
          <h1 className="text-2xl font-black text-[#1F1F1F] tracking-tight mb-1">Billing</h1>
          <p className="text-sm text-[#999]">Manage your subscription and payment methods</p>
        </FadeIn>

        {/* Current Plan */}
        <FadeIn delay={0.05}>
          <div className="bg-gradient-to-br from-[#1F1F1F] to-[#2D2D2D] rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[rgba(233,162,76,0.08)] blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={16} className="text-[#E9A24C]" />
                    <span className="text-xs font-semibold text-[#E9A24C] uppercase tracking-wider">Current Plan</span>
                  </div>
                  <h2 className="text-2xl font-black">Pro Plan</h2>
                  <p className="text-white/50 text-sm mt-0.5">Renews January 15, 2026</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black">$19</p>
                  <p className="text-white/40 text-xs">/month</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {['Unlimited messages', 'All AI models', '10GB storage', 'Priority support'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[rgba(233,162,76,0.2)] flex items-center justify-center">
                      <Check size={9} className="text-[#E9A24C]" strokeWidth={3} />
                    </div>
                    <span className="text-xs text-white/70">{f}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" className="flex-1">
                  Upgrade to Enterprise <ArrowRight size={13} />
                </Button>
                <Button variant="secondary" size="sm">Cancel plan</Button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Usage */}
        <FadeIn delay={0.1}>
          <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
            <h2 className="text-sm font-bold text-[#1F1F1F] mb-4">Usage This Billing Period</h2>
            <div className="space-y-4">
              {[
                { label: 'AI Messages', used: 2847, total: '∞', percent: 0, color: '#E9A24C' },
                { label: 'Document Storage', used: 4.2, total: 10, unit: 'GB', percent: 42, color: '#3B82F6' },
                { label: 'API Requests', used: 12400, total: 50000, percent: 24.8, color: '#8B5CF6' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-semibold text-[#1F1F1F]">{item.label}</span>
                    <span className="text-[#999]">
                      {item.used}{item.unit || ''} / {item.total}{item.unit || ''}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[rgba(0,0,0,0.06)]">
                    {item.percent > 0 && (
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: item.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percent}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                      />
                    )}
                    {item.percent === 0 && (
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-[#E9A24C] via-[#D7B98E] to-[#E9A24C] opacity-30" />
                    )}
                  </div>
                  {item.percent === 0 && (
                    <p className="text-[10px] text-[#BBB] mt-0.5">Unlimited on Pro plan</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Payment Method */}
        <FadeIn delay={0.15}>
          <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#1F1F1F]">Payment Method</h2>
              <Button variant="outline" size="sm">Update</Button>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.01)]">
              <div className="w-12 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <CreditCard size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1F1F1F]">•••• •••• •••• 4242</p>
                <p className="text-xs text-[#999]">Visa · Expires 12/27</p>
              </div>
              <Badge variant="success" size="sm" dot>Default</Badge>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-[#BBB]">
              <Shield size={12} />
              <span>Secured by Stripe · PCI DSS compliant</span>
            </div>
          </div>
        </FadeIn>

        {/* Invoice history */}
        <FadeIn delay={0.2}>
          <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#1F1F1F]">Invoice History</h2>
              <button className="text-xs font-semibold text-[#E9A24C] hover:underline">Download all</button>
            </div>
            <div className="space-y-2">
              {invoices.map((inv, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-[rgba(0,0,0,0.04)] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Check size={14} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1F1F1F]">{inv.id}</p>
                      <p className="text-xs text-[#999]">{inv.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="success" size="sm">Paid</Badge>
                    <span className="text-sm font-bold text-[#1F1F1F]">{inv.amount}</span>
                    <button className="p-1.5 rounded-lg hover:bg-[rgba(0,0,0,0.04)] transition-colors">
                      <Download size={13} className="text-[#CCC]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Enterprise CTA */}
        <FadeIn delay={0.25}>
          <div className="rounded-2xl p-5 bg-gradient-to-br from-[rgba(233,162,76,0.08)] to-[rgba(215,185,142,0.05)] border border-[rgba(233,162,76,0.2)]">
            <div className="flex items-center gap-3 mb-3">
              <Zap size={18} className="text-[#E9A24C]" />
              <h3 className="text-sm font-bold text-[#1F1F1F]">Need more? Go Enterprise.</h3>
            </div>
            <p className="text-xs text-[#666] mb-4 leading-relaxed">
              Get unlimited everything, custom AI models, SSO, dedicated support, and SLA guarantees.
              Starting at $89/seat/month.
            </p>
            <Button variant="primary" size="sm">
              Talk to sales <ArrowRight size={13} />
            </Button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default BillingPage;
