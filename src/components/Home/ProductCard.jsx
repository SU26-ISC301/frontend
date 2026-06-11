import { useState } from 'react';
import { Crown, Heart, Star } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { BuyerAuthModal } from '../Auth/BuyerAuthModal';
import { wishlistApi } from '../../api/wishlistAPI';
import { cn } from '../../lib/utils';

function hasBuyerSession() {
  return Boolean(
    localStorage.getItem('buyerAccessToken') ||
      sessionStorage.getItem('buyerAccessToken') ||
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('accessToken')
  );
}

export function ProductCard({ id, index, title, price, oldPrice, sold, rating, image, badge, isPremiumHighlighted, initialFavorite = false }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [favorite, setFavorite] = useState(initialFavorite);
  const [pendingFavorite, setPendingFavorite] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState('');

  const openProduct = () => {
    if (!id) return;
    window.open(`/products/${id}`, '_blank', 'noopener,noreferrer');
  };

  const addFavorite = async () => {
    if (!id) return;
    try {
      await wishlistApi.addFavorite(id);
      setFavorite(true);
      setFavoriteMessage('Đã thêm vào yêu thích');
      window.setTimeout(() => setFavoriteMessage(''), 1800);
    } catch (error) {
      setFavoriteMessage(error?.response?.data?.message || 'Chưa thể thêm vào yêu thích');
      window.setTimeout(() => setFavoriteMessage(''), 2200);
    }
  };

  const handleFavoriteClick = async (event) => {
    event.stopPropagation();
    if (!id) return;

    if (!hasBuyerSession()) {
      setPendingFavorite(true);
      setAuthOpen(true);
      return;
    }

    await addFavorite();
  };

  const handleAuthenticated = async () => {
    setAuthOpen(false);
    window.dispatchEvent(new CustomEvent('buyer-auth-changed', { detail: { loggedIn: true } }));
    if (pendingFavorite) {
      setPendingFavorite(false);
      await addFavorite();
    }
  };

  return (
    <>
    <Card
      role={id ? 'button' : undefined}
      tabIndex={id ? 0 : undefined}
      onClick={openProduct}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openProduct();
        }
      }}
      className={cn(
        'product-card group relative overflow-hidden rounded-[1rem] bg-white',
        id && 'cursor-pointer',
        isPremiumHighlighted
          ? 'border-amber-300 ring-2 ring-amber-300/45 shadow-lg shadow-amber-500/15'
          : 'border-white/80'
      )}
    >
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
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={cn(
            'absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/92 shadow-sm backdrop-blur transition-all group-hover:scale-110',
            favorite ? 'text-[#ff2d6d]' : 'text-slate-400 hover:text-[#ff2d6d]'
          )}
          aria-label={favorite ? 'Đã thêm yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart className={cn('h-4 w-4', favorite && 'fill-current')} />
        </button>
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
      {favoriteMessage && (
        <div className="absolute inset-x-3 bottom-3 rounded-xl bg-slate-950/88 px-3 py-2 text-center text-xs font-bold text-white shadow-lg">
          {favoriteMessage}
        </div>
      )}
    </Card>
    <BuyerAuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuthenticated={handleAuthenticated} />
    </>
  );
}
