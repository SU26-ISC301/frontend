import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { cn } from '../../lib/utils';

export function BrandLogo({ to = '/', className, size = 'default', light = false }) {
  const sizes = {
    sm: { box: 'h-8 w-8', icon: 'h-4 w-4', text: 'text-lg' },
    default: { box: 'h-10 w-10', icon: 'h-5 w-5', text: 'text-xl' },
    lg: { box: 'h-12 w-12', icon: 'h-6 w-6', text: 'text-2xl' },
  };

  const s = sizes[size] || sizes.default;

  return (
    <Link to={to} className={cn('group flex shrink-0 items-center gap-2.5', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl bg-gradient-brand shadow-glow transition-transform duration-300 group-hover:scale-105',
          s.box
        )}
      >
        <ShoppingBag className={cn('text-white', s.icon)} strokeWidth={2.5} />
      </div>
      <div className="leading-tight">
        <span
          className={cn(
            'font-extrabold tracking-tight',
            s.text,
            light ? 'text-white' : 'gradient-text'
          )}
        >
          ShopVN
        </span>
        <p
          className={cn(
            'text-[10px] font-medium uppercase tracking-widest',
            light ? 'text-white/60' : 'text-brand-muted'
          )}
        >
          Live Commerce
        </p>
      </div>
    </Link>
  );
}
