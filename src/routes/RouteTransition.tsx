import { memo } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface RouteTransitionProps {
  children: ReactNode;
}

const RouteTransition = ({ children }: RouteTransitionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    className="h-full"
  >
    {children}
  </motion.div>
);

export default memo(RouteTransition);
