import { motion, useReducedMotion } from 'framer-motion';
import { forwardRef, memo } from 'react';
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';
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
  primary: 'btn-primary text-white rounded-xl',
  secondary: 'btn-secondary rounded-xl',
  ghost: 'bg-transparent hover:bg-black/5 text-[#1F1F1F] rounded-xl transition-all duration-200',
  outline: 'bg-transparent border border-[rgba(0,0,0,0.12)] hover:border-[#E9A24C] hover:text-[#E9A24C] text-[#666666] rounded-xl transition-all duration-200',
  danger: 'bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-medium gap-1.5 min-h-8',
  md: 'px-4 py-2.5 text-sm font-medium gap-2 min-h-10',
  lg: 'px-6 py-3 text-base font-semibold gap-2 min-h-11',
  xl: 'px-8 py-4 text-lg font-semibold gap-3 min-h-12',
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
  const hoverState = prefersReducedMotion ? undefined : { scale: isDisabled ? 1 : 1.02 };
  const tapState = prefersReducedMotion ? undefined : { scale: isDisabled ? 1 : 0.97 };

  return (
    <motion.button
      ref={ref}
      type={type}
      whileHover={hoverState}
      whileTap={tapState}
      className={cn(
        'inline-flex min-w-0 items-center justify-center select-none cursor-pointer whitespace-nowrap focus-ring transition-[transform,box-shadow,background-color,border-color,color] duration-200 motion-reduce:transition-none',
        variants[variant],
        sizes[size],
        isDisabled && 'opacity-50 cursor-not-allowed hover:translate-y-0',
        className
      )}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      {...(props as ComponentProps<typeof motion.button>)}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin motion-reduce:animate-none" aria-hidden="true" />
      ) : icon ? (
        <span className="shrink-0" aria-hidden="true">{icon}</span>
      ) : null}
      {children && <span className="min-w-0 truncate">{children}</span>}
      {loading && <span className="sr-only">{loadingLabel}</span>}
      {iconRight && !loading && <span className="shrink-0 ml-auto" aria-hidden="true">{iconRight}</span>}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default memo(Button);
