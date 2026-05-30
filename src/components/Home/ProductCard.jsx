import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export function ProductCard({ index, title, price, oldPrice, sold, rating, image, badge }) {
  return (
    <Card className="product-card group overflow-hidden rounded-[1rem] border-white/80 bg-white">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          loading={index > 4 ? 'lazy' : 'eager'}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <button
          type="button"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/92 text-slate-400 shadow-sm backdrop-blur transition-all hover:scale-110 hover:text-[#ff2d6d]"
          aria-label="Yêu thích"
        >
          <Heart className="h-4 w-4" />
        </button>
        <span className="pill absolute left-2 top-2 bg-white/92 text-[#ff4d2e] shadow-sm backdrop-blur">
          {badge}
        </span>
        <button
          type="button"
          className="absolute bottom-3 left-3 right-3 flex translate-y-3 items-center justify-center gap-2 rounded-full bg-[#13252f] px-3 py-2 text-xs font-bold text-white opacity-0 shadow-xl shadow-black/20 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ShoppingCart className="h-4 w-4" />
          Thêm nhanh
        </button>
      </div>
      <CardContent className="p-3.5">
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
          <p className="text-xs text-slate-400 line-through">₫{oldPrice}</p>
        </div>
      </CardContent>
    </Card>
  );
}
