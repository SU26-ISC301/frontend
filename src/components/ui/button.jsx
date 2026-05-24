import { cn } from '../../lib/utils';

const variants = {
  default:
    'bg-gradient-brand text-white shadow-glow hover:brightness-110 hover:shadow-glow disabled:opacity-50 disabled:pointer-events-none',
  dark:
    'bg-brand-dark text-white shadow-md hover:bg-brand-darker disabled:opacity-50',
  accent:
    'bg-brand-accent text-brand-dark font-semibold hover:brightness-105 disabled:opacity-50',
  outline:
    'border-2 border-gray-200 bg-white text-brand-dark hover:border-brand-primary/40 hover:bg-shopee-light disabled:opacity-50',
  ghost:
    'text-brand-muted hover:bg-gray-100 hover:text-brand-dark disabled:opacity-50',
  link: 'text-brand-primary hover:text-shopee-hover underline-offset-4 hover:underline p-0 h-auto shadow-none',
};

const sizes = {
  default: 'h-11 px-5 py-2 text-sm',
  sm: 'h-9 px-3.5 text-xs rounded-xl',
  lg: 'h-12 px-7 text-base rounded-2xl',
  icon: 'h-11 w-11 p-0 rounded-xl',
};

export function Button({
  className,
  variant = 'default',
  size = 'default',
  type = 'button',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
