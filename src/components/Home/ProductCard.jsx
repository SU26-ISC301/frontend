import { Link } from 'react-router-dom';
import { Crown, Heart, Star } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

export function ProductCard({ id, index, title, price, oldPrice, sold, rating, image, badge, isPremiumHighlighted }) {
  return (
    <Card className={cn(
      'product-card group overflow-hidden rounded-[1rem] bg-white',
      isPremiumHighlighted
        ? 'border-amber-300 ring-2 ring-amber-300/45 shadow-lg shadow-amber-500/15'
        : 'border-white/80'
    )}>
      <Link to={id ? `/products/${id}` : '#'} target={id ? '_blank' : undefined} rel={id ? 'noreferrer' : undefined} className="block h-full">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            loading={index > 4 ? 'lazy' : 'eager'}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs font-bold text-slate-400">
            Chưa có ảnh
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/92 text-slate-400 shadow-sm backdrop-blur transition-all group-hover:scale-110 group-hover:text-[#ff2d6d]"
          aria-hidden="true"
        >
          <Heart className="h-4 w-4" />
        </span>
        <span className="pill absolute left-2 top-2 bg-white/92 text-[#ff4d2e] shadow-sm backdrop-blur">
          {badge}
        </span>
        {isPremiumHighlighted && (
          <span className="absolute left-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-orange-500/25">
            <Crown className="h-3 w-3" />
            Tin nổi bật
          </span>
        )}
      </div>
      <CardContent className="p-3.5">
        {isPremiumHighlighted && (
          <p className="mb-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-700 ring-1 ring-amber-100">
            <Crown className="h-3 w-3" />
            Premium
          </p>
        )}
        <h3 className="line-clamp-2 min-h-[2.6rem] text-sm font-semibold leading-snug text-[#16202a]">
          {title}
        </h3>
        <div className="mt-2 flex items-center gap-1 text-xs text-amber-500">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="font-semibold">{rating}</span>
          <span className="text-slate-400">| Đã bán {sold}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
          <p className="text-base font-extrabold text-[#ff4d2e]">₫{price}</p>
          {oldPrice && <p className="text-xs text-slate-400 line-through">₫{oldPrice}</p>}
        </div>
      </CardContent>
      </Link>
    </Card>
  );
}
