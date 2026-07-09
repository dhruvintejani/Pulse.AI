import { memo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import { blurReveal, staggerContainer, staggerItem } from '@/lib/motion';

const RouteLoadingFallback = () => (
  <div className="min-h-dvh bg-[#F8F4EC] px-4 py-6 text-[#1F1F1F]" role="status" aria-live="polite" aria-label="Loading page">
    <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-6xl items-center justify-center">
      <motion.div
        variants={blurReveal}
        initial="hidden"
        animate="visible"
        className="glass-card glass-shine w-full max-w-3xl overflow-hidden rounded-3xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] p-5 shadow-float sm:p-6"
      >
        <div className="mb-5 flex items-center gap-3">
          <motion.div
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] shadow-premium"
            animate={{ rotate: [0, -4, 4, 0], scale: [1, 1.04, 1] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles size={19} className="text-white" aria-hidden="true" />
            <span className="absolute inset-0 rounded-2xl animate-ping bg-[#E9A24C]/25 motion-reduce:animate-none" aria-hidden="true" />
          </motion.div>
          <div>
            <p className="text-sm font-black text-[#1F1F1F]">Loading Pulse AI</p>
            <p className="text-xs text-[#999]">Preparing your AI workspace...</p>
          </div>
        </div>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <motion.div variants={staggerItem} className="space-y-3">
            <Skeleton className="h-12 rounded-2xl" />
            <Skeleton className="h-12 rounded-2xl" />
            <Skeleton className="h-12 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </motion.div>
          <motion.div variants={staggerItem} className="space-y-3">
            <Skeleton className="h-32 rounded-2xl" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
            </div>
            <Skeleton className="h-16 rounded-2xl" />
          </motion.div>
        </motion.div>
        <span className="sr-only">Loading Pulse AI</span>
      </motion.div>
    </div>
  </div>
);

export default memo(RouteLoadingFallback);
