import { cn } from '../../lib/utils';

const variants = {
  default:
    'border border-transparent bg-gradient-to-r from-[#ff315c] via-[#ff4d2e] to-[#ff7a2f] text-white shadow-[0_14px_30px_-18px_rgba(255,77,46,0.85)] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-20px_rgba(255,77,46,0.95)] disabled:pointer-events-none disabled:opacity-50',
  dark:
    'border border-[#13252f] bg-[#13252f] text-white shadow-[0_14px_28px_-18px_rgba(19,37,47,0.8)] hover:-translate-y-0.5 hover:bg-[#203a48] disabled:opacity-50',
  accent:
    'border border-amber-200 bg-amber-100 text-amber-950 font-semibold hover:-translate-y-0.5 hover:bg-amber-200 disabled:opacity-50',
  outline:
    'border border-orange-100 bg-white/92 text-slate-800 shadow-sm hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:text-[#f05a22] disabled:opacity-50',
  ghost:
    'text-slate-500 hover:bg-orange-50 hover:text-[#f05a22] disabled:opacity-50',
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
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b45] focus-visible:ring-offset-2 active:scale-[0.98]',
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
