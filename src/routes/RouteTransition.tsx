import { memo } from 'react';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { blurReveal, reduceMotionTransition } from '@/lib/motion';

interface RouteTransitionProps {
  children: ReactNode;
}

const RouteTransition = ({ children }: RouteTransitionProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      layout="position"
      initial={prefersReducedMotion ? { opacity: 0 } : 'hidden'}
      animate={prefersReducedMotion ? { opacity: 1, transition: reduceMotionTransition } : 'visible'}
      exit={prefersReducedMotion ? { opacity: 0, transition: reduceMotionTransition } : 'exit'}
      variants={prefersReducedMotion ? undefined : blurReveal}
      className="h-full min-w-0 will-change-transform"
    >
      {children}
    </motion.div>
  );
};

export default memo(RouteTransition);
