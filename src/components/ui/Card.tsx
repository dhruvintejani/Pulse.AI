import { forwardRef, memo } from 'react';
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'glass' | 'subtle' | 'elevated';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
  delay?: number;
  animate?: boolean;
}

const cardVariants: Record<CardVariant, string> = {
  default: 'ds-card',
  glass: 'ds-glass rounded-[var(--ds-radius-2xl)] shadow-[var(--ds-shadow-sm)]',
  subtle: 'rounded-[var(--ds-radius-2xl)] border border-[var(--ds-color-border)] bg-[var(--ds-color-surface-muted)]',
  elevated: 'ds-card shadow-[var(--ds-shadow-md)]',
};

const cardPadding: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-5',
  lg: 'p-5 sm:p-6',
};

const CardRoot = forwardRef<HTMLDivElement, CardProps>(({
  children,
  className,
  variant = 'default',
  padding = 'md',
  interactive,
  hover = false,
  glass = false,
  onClick,
  delay = 0,
  animate = true,
  role,
  tabIndex,
  onKeyDown,
  ...props
}, ref) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animate && !prefersReducedMotion;
  const resolvedVariant = glass ? 'glass' : variant;
  const isInteractive = Boolean(interactive || hover || onClick);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (!onClick || event.defaultPrevented) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      ref={ref}
      role={role ?? (onClick ? 'button' : undefined)}
      tabIndex={tabIndex ?? (onClick ? 0 : undefined)}
      initial={shouldAnimate ? { opacity: 0, y: 14 } : false}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      transition={shouldAnimate ? { duration: 0.32, delay, ease: [0.2, 0, 0, 1] } : undefined}
      whileHover={shouldAnimate && isInteractive ? { y: -3, scale: 1.005 } : undefined}
      className={cn(cardVariants[resolvedVariant], cardPadding[padding], isInteractive && 'ds-card-interactive cursor-pointer ds-focus-ring', className)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </motion.div>
  );
});
CardRoot.displayName = 'Card';

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardHeader = memo(({ className, children, ...props }: CardSectionProps) => (
  <div className={cn('mb-4 flex min-w-0 flex-col gap-1.5', className)} {...props}>{children}</div>
));
CardHeader.displayName = 'CardHeader';

const CardTitle = memo(({ className, children, ...props }: CardSectionProps) => (
  <div className={cn('ds-text-title text-base leading-tight sm:text-lg', className)} {...props}>{children}</div>
));
CardTitle.displayName = 'CardTitle';

const CardDescription = memo(({ className, children, ...props }: CardSectionProps) => (
  <div className={cn('ds-text-subtle text-sm leading-relaxed', className)} {...props}>{children}</div>
));
CardDescription.displayName = 'CardDescription';

const CardContent = memo(({ className, children, ...props }: CardSectionProps) => (
  <div className={cn('min-w-0', className)} {...props}>{children}</div>
));
CardContent.displayName = 'CardContent';

const CardFooter = memo(({ className, children, ...props }: CardSectionProps) => (
  <div className={cn('mt-5 flex flex-col gap-3 border-t border-[var(--ds-color-border)] pt-4 sm:flex-row sm:items-center sm:justify-end', className)} {...props}>{children}</div>
));
CardFooter.displayName = 'CardFooter';

const Card = memo(CardRoot);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;
