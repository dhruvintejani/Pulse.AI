import { motion, useReducedMotion } from 'framer-motion';
import { forwardRef, memo } from 'react';
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';
import { premiumTap, springTransition } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  children?: ReactNode;
}

const variants = {
  primary: 'btn-primary rounded-xl text-white shadow-[var(--ds-shadow-xs)]',
  secondary: 'btn-secondary rounded-xl text-[var(--ds-color-text)]',
  ghost: 'rounded-xl bg-transparent text-[var(--ds-color-text)] hover:bg-[var(--ds-color-accent-soft)]',
  outline: 'rounded-xl border border-[var(--ds-color-border)] bg-transparent text-[var(--ds-color-muted)] hover:border-[rgba(233,162,76,0.45)] hover:text-[var(--ds-color-accent)]',
  danger: 'rounded-xl bg-red-500 text-white hover:bg-red-600 shadow-[var(--ds-shadow-xs)]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-bold gap-1.5 min-h-9',
  md: 'px-4 py-2.5 text-sm font-bold gap-2 min-h-11',
  lg: 'px-6 py-3 text-base font-bold gap-2 min-h-12',
  xl: 'px-8 py-4 text-lg font-black gap-3 min-h-14',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading,
  loadingLabel = 'Loading',
  children,
  className,
  disabled,
  type = 'button',
  ...props
}, ref) => {
  const prefersReducedMotion = useReducedMotion();
  const isDisabled = disabled || loading;
  const hoverState = prefersReducedMotion || isDisabled ? undefined : { y: -2, scale: 1.018, transition: springTransition };
  const tapState = prefersReducedMotion || isDisabled ? undefined : premiumTap;

  return (
    <motion.button
      ref={ref}
      type={type}
      whileHover={hoverState}
      whileTap={tapState}
      className={cn(
        'premium-button inline-flex min-w-0 select-none items-center justify-center whitespace-nowrap transition-[transform,box-shadow,background-color,border-color,color,opacity,filter] duration-200 ds-focus-ring motion-reduce:transition-none',
        variants[variant],
        sizes[size],
        isDisabled && 'cursor-not-allowed opacity-50 hover:translate-y-0',
        className
      )}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      {...(props as ComponentProps<typeof motion.button>)}
    >
      {loading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin motion-reduce:animate-none" aria-hidden="true" />
      ) : icon ? (
        <span className="premium-button-icon shrink-0" aria-hidden="true">{icon}</span>
      ) : null}
      {children && <span className="min-w-0 truncate">{children}</span>}
      {loading && <span className="sr-only">{loadingLabel}</span>}
      {iconRight && !loading && <span className="premium-button-icon ml-auto shrink-0" aria-hidden="true">{iconRight}</span>}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default memo(Button);
