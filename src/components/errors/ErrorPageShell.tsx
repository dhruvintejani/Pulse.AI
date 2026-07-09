import { memo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import { blurReveal, staggerContainer, staggerItem } from '@/lib/motion';
import ErrorIllustration from './ErrorIllustration';
import type { ErrorIllustrationVariant } from './ErrorIllustration';

interface ErrorPageShellProps {
  variant: ErrorIllustrationVariant;
  eyebrow: string;
  title: string;
  description: string;
  details?: ReactNode;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  onHome?: () => void;
}

const ErrorPageShell = ({
  variant,
  eyebrow,
  title,
  description,
  details,
  primaryLabel = 'Try again',
  secondaryLabel = 'Go back',
  onPrimary,
  onSecondary,
  onHome,
}: ErrorPageShellProps) => (
  <main className="relative flex min-h-dvh items-center overflow-hidden bg-[#F8F4EC] px-4 py-10 text-[#1F1F1F] sm:px-6" role="main">
    <div className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#E9A24C]/15 blur-3xl" aria-hidden="true" />
    <div className="pointer-events-none absolute bottom-0 right-0 h-[24rem] w-[24rem] rounded-full bg-[#D7B98E]/16 blur-3xl" aria-hidden="true" />

    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="relative mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_0.92fr]"
      aria-labelledby="error-page-title"
    >
      <motion.div variants={staggerItem} className="order-2 min-w-0 lg:order-1">
        <div className="glass-card relative overflow-hidden rounded-[2rem] border border-white/60 bg-[#FFFDF8]/82 p-5 shadow-float backdrop-blur-xl sm:p-8">
          <motion.div
            variants={blurReveal}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(233,162,76,0.24)] bg-[rgba(233,162,76,0.1)] px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#A56018]"
          >
            Pulse AI system message
          </motion.div>

          <motion.p variants={staggerItem} className="text-xs font-black uppercase tracking-[0.24em] text-[#999]">
            {eyebrow}
          </motion.p>
          <motion.h1 variants={staggerItem} id="error-page-title" className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.06em] text-[#1F1F1F] sm:text-5xl">
            {title}
          </motion.h1>
          <motion.p variants={staggerItem} className="mt-4 max-w-xl text-sm leading-7 text-[#666] sm:text-base">
            {description}
          </motion.p>

          {details && (
            <motion.div variants={staggerItem} className="mt-5 rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.025)] p-4 text-sm leading-relaxed text-[#777]">
              {details}
            </motion.div>
          )}

          <motion.div variants={staggerItem} className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {onPrimary && <Button variant="primary" size="md" icon={<RefreshCw size={15} />} onClick={onPrimary}>{primaryLabel}</Button>}
            {onSecondary && <Button variant="secondary" size="md" icon={<ArrowLeft size={15} />} onClick={onSecondary}>{secondaryLabel}</Button>}
            {onHome && <Button variant="ghost" size="md" icon={<Home size={15} />} onClick={onHome}>Home</Button>}
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={staggerItem} className="order-1 lg:order-2">
        <ErrorIllustration variant={variant} />
      </motion.div>
    </motion.section>
  </main>
);

export default memo(ErrorPageShell);
