import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
  delay?: number;
  animate?: boolean;
}

const Card = ({ children, className, hover = false, glass = false, onClick, delay = 0, animate = true }: CardProps) => {
  const Component = animate ? motion.div : 'div';
  const motionProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] },
    ...(hover && {
      whileHover: { y: -4, scale: 1.01 },
    }),
  } : {};

  return (
    <Component
      className={cn(
        'rounded-2xl',
        glass
          ? 'glass-card shadow-card'
          : 'bg-[#FFFDF8] shadow-card border border-[rgba(0,0,0,0.05)]',
        hover && 'cursor-pointer transition-all duration-300',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

export default Card;
