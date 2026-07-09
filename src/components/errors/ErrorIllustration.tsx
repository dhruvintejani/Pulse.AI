import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { WifiOff, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ErrorIllustrationVariant = '404' | '500' | 'offline';

interface ErrorIllustrationProps {
  variant: ErrorIllustrationVariant;
  className?: string;
}

const variantCopy = {
  '404': {
    code: '404',
    label: 'Lost route',
    accent: 'from-[#E9A24C] to-[#D4853A]',
  },
  '500': {
    code: '500',
    label: 'System check',
    accent: 'from-red-400 to-orange-400',
  },
  offline: {
    code: 'OFF',
    label: 'Offline mode',
    accent: 'from-blue-400 to-cyan-400',
  },
};

const ErrorIllustration = ({ variant, className }: ErrorIllustrationProps) => {
  const prefersReducedMotion = useReducedMotion();
  const copy = variantCopy[variant];
  const Icon = variant === 'offline' ? WifiOff : Zap;

  return (
    <motion.div
      layoutId={`pulse-error-illustration-${variant}`}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: 'blur(12px)' }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.85 }}
      className={cn('relative mx-auto aspect-square w-full max-w-[22rem]', className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-[3.5rem] bg-gradient-to-br from-white/80 to-white/20 shadow-float backdrop-blur-xl" />
      <motion.div
        className="absolute inset-6 rounded-[2.75rem] border border-white/70 bg-[#FFFDF8]/82 shadow-[0_30px_90px_rgba(31,31,31,0.12)] backdrop-blur-xl"
        animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-8 top-8 h-24 w-24 rounded-full bg-[#E9A24C]/15 blur-2xl"
        animate={prefersReducedMotion ? undefined : { scale: [1, 1.18, 1], opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 right-8 h-28 w-28 rounded-full bg-[#D7B98E]/18 blur-2xl"
        animate={prefersReducedMotion ? undefined : { scale: [1.05, 0.92, 1.05], opacity: [0.45, 0.8, 0.45] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div className="relative w-full rounded-[2rem] border border-[rgba(0,0,0,0.06)] bg-white/70 p-5 shadow-card backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            </div>
            <div className="h-2 w-20 rounded-full bg-[rgba(0,0,0,0.06)]" />
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-[rgba(0,0,0,0.06)] bg-[#F8F4EC] p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(233,162,76,0.18),transparent_36%),radial-gradient(circle_at_78%_80%,rgba(31,31,31,0.08),transparent_38%)]" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#999]">{copy.label}</p>
                <p className="mt-1 text-5xl font-black tracking-[-0.08em] text-[#1F1F1F] sm:text-6xl">{copy.code}</p>
              </div>
              <motion.div
                className={cn('flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br text-white shadow-premium', copy.accent)}
                animate={prefersReducedMotion ? undefined : { rotate: [0, -3, 3, 0], scale: [1, 1.04, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Icon size={25} />
              </motion.div>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {[72, 92, 58].map((width, index) => (
              <motion.div
                key={width}
                className="h-2 rounded-full bg-[rgba(31,31,31,0.08)]"
                style={{ width: `${width}%` }}
                initial={prefersReducedMotion ? false : { scaleX: 0, transformOrigin: 'left' }}
                animate={prefersReducedMotion ? undefined : { scaleX: 1 }}
                transition={{ delay: 0.12 + index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ErrorIllustration);
