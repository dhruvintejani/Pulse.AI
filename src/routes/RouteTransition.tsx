import { memo } from 'react';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface RouteTransitionProps {
  children: ReactNode;
}

const RouteTransition = ({ children }: RouteTransitionProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: prefersReducedMotion ? 0.12 : 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="h-full min-w-0"
    >
      {children}
    </motion.div>
  );
};

export default memo(RouteTransition);
