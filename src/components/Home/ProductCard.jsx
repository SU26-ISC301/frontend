import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Crown, Heart, Megaphone, ShoppingBag, Star } from 'lucide-react';
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

export function ProductCard({ id, index, title, price, oldPrice, sold, rating, image, badge, isPremiumHighlighted, isPromoted, promotionId, initialFavorite = false, vendorId }) {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [favorite, setFavorite] = useState(initialFavorite);
  const [pendingFavorite, setPendingFavorite] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState('');

  const openProduct = () => {
    if (!id) return;
    navigate(`/products/${id}`, {
      state: {
        promotionId: isPromoted ? promotionId : null,
        promotionStatus: isPromoted ? 'ACTIVE' : null,
      },
    });
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
        'product-card group relative overflow-hidden rounded-[1.35rem] bg-white/95',
        id && 'cursor-pointer',
        isPremiumHighlighted
          ? 'border-amber-300 ring-2 ring-amber-300/45 shadow-lg shadow-amber-500/15'
          : 'border-white/80'
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            loading={index > 4 ? 'lazy' : 'eager'}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-orange-50 text-xs font-bold text-slate-400">
            Chưa có ảnh
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-950/78 via-slate-950/24 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={cn(
            'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/92 shadow-lg shadow-slate-950/10 backdrop-blur transition-all group-hover:scale-110',
            favorite ? 'text-[#ff2d6d]' : 'text-slate-400 hover:text-[#ff2d6d]'
          )}
          aria-label={favorite ? 'Đã thêm yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart className={cn('h-4 w-4', favorite && 'fill-current')} />
        </button>
        <span 
          className="absolute left-3 top-3 z-20 inline-flex max-w-[calc(100%-4.75rem)] items-center gap-1 rounded-2xl bg-white/92 px-2.5 py-1.5 text-[11px] font-black text-[#ff4d2e] shadow-lg shadow-slate-950/10 backdrop-blur transition-colors hover:bg-[#ff4d2e] hover:text-white"
          onClick={(event) => {
            event.stopPropagation();
            if (vendorId) {
              window.open(`/shop/${vendorId}`, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          {badge}
        </span>
        {(isPromoted || isPremiumHighlighted) && (
          <div className="absolute left-3 top-14 flex flex-col items-start gap-1.5">
            {isPromoted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#ff4d2e] to-[#ff7a45] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-orange-500/25">
                <Megaphone className="h-3 w-3" />
                Quảng bá
              </span>
            )}
            {isPremiumHighlighted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-orange-500/25">
                <Crown className="h-3 w-3" />
                Tin nổi bật
              </span>
            )}
          </div>
        )}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-black text-slate-950 shadow-xl shadow-slate-950/18">
            <ShoppingBag className="h-4 w-4 text-[#ff4d2e]" />
            Xem bài đăng
            <ArrowUpRight className="h-4 w-4 text-slate-400" />
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        {isPremiumHighlighted && (
          <p className="mb-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-700 ring-1 ring-amber-100">
            <Crown className="h-3 w-3" />
            Nổi bật
          </p>
        )}
        <h3 className="line-clamp-2 min-h-[2.75rem] text-[0.95rem] font-black leading-snug text-[#16202a]">
          {title}
        </h3>
        <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-1 text-xs text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="font-extrabold">{rating}</span>
          </div>
          <span className="text-xs font-bold text-slate-400">Đã bán {sold}</span>
        </div>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
          <p className="text-xl font-black tracking-tight text-[#ff4d2e]">₫{price}</p>
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
