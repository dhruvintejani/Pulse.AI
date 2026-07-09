import type { Transition, Variants } from 'framer-motion';

type CubicBezier = [number, number, number, number];

export const motionEasing: Record<'premium' | 'crisp' | 'soft', CubicBezier> = {
  premium: [0.22, 1, 0.36, 1],
  crisp: [0.16, 1, 0.3, 1],
  soft: [0.2, 0, 0, 1],
};

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 34,
  mass: 0.85,
};

export const softSpringTransition: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
  mass: 0.9,
};

export const routeTransition: Transition = {
  duration: 0.38,
  ease: motionEasing.premium,
};

export const blurReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: 'blur(14px)',
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: routeTransition,
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(10px)',
    scale: 0.992,
    transition: { duration: 0.22, ease: motionEasing.crisp },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.04,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: softSpringTransition,
  },
};

export const premiumHover = {
  y: -4,
  scale: 1.012,
  transition: springTransition,
};

export const premiumTap = {
  y: 0,
  scale: 0.985,
  transition: { type: 'spring', stiffness: 520, damping: 34 },
};

export const reduceMotionTransition: Transition = {
  duration: 0.12,
  ease: 'linear',
};
