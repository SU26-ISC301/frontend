import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Heart, Megaphone, ShoppingBag } from 'lucide-react';
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

export function ProductCard({ id, index, title, price, oldPrice, image, badge, isPromoted, promotionId, initialFavorite = false, vendorId }) {
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
        'product-card premium-glow-hover group relative overflow-hidden rounded-[1.35rem] bg-white/95',
        id && 'cursor-pointer',
        isPromoted
          ? 'border-orange-300 ring-2 ring-orange-300/35 shadow-lg shadow-orange-500/15'
          : 'border-white/80'
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[linear-gradient(135deg,#f8fafc,#fff7ed)]">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading={index > 4 ? 'lazy' : 'eager'}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-orange-50 text-xs font-bold text-slate-400">
            Chưa có ảnh
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-950/74 via-slate-950/18 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={cn(
            'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/90 shadow-lg shadow-slate-950/10 ring-1 ring-white/80 backdrop-blur transition-all group-hover:scale-110',
            favorite ? 'text-[#ff2d6d]' : 'text-slate-400 hover:text-[#ff2d6d]'
          )}
          aria-label={favorite ? 'Đã thêm yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart className={cn('h-4 w-4', favorite && 'fill-current')} />
        </button>
        <span 
          className="absolute left-3 top-3 z-20 inline-flex max-w-[calc(100%-4.75rem)] items-center gap-1 rounded-2xl bg-white/90 px-2.5 py-1.5 text-[11px] font-black text-[#db3417] shadow-lg shadow-slate-950/10 ring-1 ring-white/80 backdrop-blur transition-colors hover:bg-[#db3417] hover:text-white"
          onClick={(event) => {
            event.stopPropagation();
            if (vendorId) {
              navigate(`/shop/${vendorId}`);
            }
          }}
        >
          {badge}
        </span>
        {isPromoted && (
          <div className="absolute left-3 top-14 flex flex-col items-start gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#ff4d2e] to-[#ff7a45] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-orange-500/25">
              <Megaphone className="h-3 w-3" />
              Quảng bá
            </span>
          </div>
        )}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-white/95 text-sm font-black text-slate-950 shadow-xl shadow-slate-950/18 ring-1 ring-white/80 backdrop-blur">
            <ShoppingBag className="h-4 w-4 text-[#db3417]" />
            Xem bài đăng
            <ArrowUpRight className="h-4 w-4 text-slate-400" />
          </span>
        </div>
      </div>
      <CardContent className="relative p-4">
        <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
        <h3 className="line-clamp-2 min-h-[2.75rem] text-[0.95rem] font-black leading-snug text-[#16202a]">
          {title}
        </h3>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
          <p className="text-xl font-black tracking-tight text-[#db3417]">₫{price}</p>
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
