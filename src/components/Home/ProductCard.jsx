import { Heart, Star } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

const GRADIENTS = [
  'from-orange-200 via-rose-100 to-amber-100',
  'from-violet-200 via-purple-100 to-fuchsia-100',
  'from-cyan-200 via-sky-100 to-blue-100',
  'from-emerald-200 via-teal-100 to-green-100',
  'from-amber-200 via-yellow-100 to-orange-100',
];

export function ProductCard({ index, title, price, sold, rating }) {
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <Card className="card-interactive group overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br transition-transform duration-500 group-hover:scale-105',
            gradient
          )}
        />
        <button
          type="button"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-400 shadow-sm transition-colors hover:text-brand-secondary"
          aria-label="Yêu thích"
        >
          <Heart className="h-4 w-4" />
        </button>
        {index % 3 === 0 && (
          <span className="pill absolute left-2 top-2 bg-gradient-brand text-white shadow-glow">
            HOT
          </span>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-brand-dark">
          {title}
        </h3>
        <div className="mt-2 flex items-center gap-1 text-xs text-amber-500">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="font-semibold">{rating}</span>
          <span className="text-brand-muted">| Đã bán {sold}</span>
        </div>
        <p className="mt-1.5 text-base font-extrabold text-brand-primary">
          ₫{price}
        </p>
      </CardContent>
    </Card>
  );
}
