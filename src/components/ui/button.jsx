import { cn } from '../../lib/utils';

const variants = {
  default:
    'bg-shopee text-white hover:bg-shopee-hover shadow-sm disabled:opacity-50 disabled:pointer-events-none',
  outline:
    'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50',
  ghost: 'text-gray-700 hover:bg-gray-100 disabled:opacity-50',
  link: 'text-shopee hover:text-shopee-hover underline-offset-4 hover:underline p-0 h-auto',
};

const sizes = {
  default: 'h-10 px-4 py-2 text-sm',
  sm: 'h-8 px-3 text-xs',
  lg: 'h-11 px-6 text-base',
  icon: 'h-10 w-10 p-0',
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
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shopee focus-visible:ring-offset-2',
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
