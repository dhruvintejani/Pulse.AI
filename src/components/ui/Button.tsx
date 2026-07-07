import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading,
  children,
  className,
  disabled,
  ...props
}, ref) => {
  const variants = {
    primary: 'btn-primary text-white rounded-xl',
    secondary: 'btn-secondary rounded-xl',
    ghost: 'bg-transparent hover:bg-black/5 text-[#1F1F1F] rounded-xl transition-all duration-200',
    outline: 'bg-transparent border border-[rgba(0,0,0,0.12)] hover:border-[#E9A24C] hover:text-[#E9A24C] text-[#666666] rounded-xl transition-all duration-200',
    danger: 'bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
    md: 'px-4 py-2.5 text-sm font-medium gap-2',
    lg: 'px-6 py-3 text-base font-semibold gap-2',
    xl: 'px-8 py-4 text-lg font-semibold gap-3',
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={cn(
        'inline-flex items-center justify-center select-none cursor-pointer',
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children && <span>{children}</span>}
      {iconRight && !loading && <span className="shrink-0 ml-auto">{iconRight}</span>}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;
