import { useEffect, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { Header } from '../components/Home/Header';
import { Footer } from '../components/layout/Footer';
import { ProductCard } from '../components/Home/ProductCard';
import { BuyerAuthModal } from '../components/Auth/BuyerAuthModal';
import { Button } from '../components/ui/button';
import { wishlistApi } from '../api/wishlistAPI';

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN').format(Number(value || 0));
}

function isLoggedIn() {
  return Boolean(
    localStorage.getItem('buyerAccessToken') ||
      sessionStorage.getItem('buyerAccessToken') ||
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('accessToken')
  );
}

function getProductImage(product) {
  const images = (product?.mediaList || [])
    .filter((media) => (media.mediaType || media.media_type) === 'image')
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return images[0]?.mediaUrl || product?.variants?.find((variant) => variant.imageUrl)?.imageUrl || '';
}

function mapProductCard(product) {
  const prices = (product.variants || [])
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price) && price > 0);
  const lowestPrice = prices.length ? Math.min(...prices) : 0;

  return {
    id: product.id,
    title: product.name,
    price: formatPrice(lowestPrice),
    oldPrice: null,
    sold: formatPrice(product.soldCount || 0),
    rating: product.avgRating ? Number(product.avgRating).toFixed(1) : '0.0',
    image: getProductImage(product),
    badge: product.vendorName || product.categoryName || 'ShopVN',
    isPremiumHighlighted: Boolean(product.premiumHighlighted),
    initialFavorite: true,
  };
}

export default function Favorites() {
  const [authOpen, setAuthOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  const loadFavorites = async () => {
    if (!isLoggedIn()) {
      setLoggedIn(false);
      setAuthOpen(true);
      setProducts([]);
      return;
    }

    setLoggedIn(true);
    setIsLoading(true);
    setError('');
    try {
      const data = await wishlistApi.getFavorites();
      setProducts(Array.isArray(data) ? data.map(mapProductCard) : []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể tải danh sách yêu thích.');
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setLoggedIn(false);
        setAuthOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleAuthenticated = () => {
    setAuthOpen(false);
    setLoggedIn(true);
    window.dispatchEvent(new CustomEvent('buyer-auth-changed', { detail: { loggedIn: true } }));
    loadFavorites();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f4ef] text-[#16202a]">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-white/80 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#ff4d2e]">
              <Heart className="h-4 w-4 fill-current" />
              Tin đã lưu
            </span>
            <h1 className="mt-2 text-2xl font-black text-slate-950">Mục yêu thích của bạn</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Những bài đăng bạn đã bấm trái tim sẽ được gom lại ở đây.
            </p>
          </div>
          {!loggedIn && (
            <Button className="rounded-full bg-[#13252f] hover:bg-[#203a48]" onClick={() => setAuthOpen(true)}>
              Đăng nhập để xem
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="rounded-3xl bg-white/85 px-5 py-12 text-center text-sm font-bold text-slate-500">
            <Loader2 className="mr-2 inline h-5 w-5 animate-spin" />
            Đang tải danh sách yêu thích...
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-white/85 px-5 py-12 text-center">
            <p className="font-extrabold text-slate-800">{error}</p>
            <Button className="mt-4 rounded-full bg-[#ff5a2f] hover:bg-[#ff6a3d]" onClick={loadFavorites}>
              Thử lại
            </Button>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product, index) => (
              <ProductCard key={product.id} index={index} {...product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white/85 px-5 py-14 text-center shadow-sm ring-1 ring-white/80">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-500">
              <Heart className="h-8 w-8" />
            </div>
            <p className="mt-4 text-lg font-black text-slate-900">
              {loggedIn ? 'Bạn chưa lưu bài đăng nào' : 'Vui lòng đăng nhập để xem tin đã lưu'}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Khi thấy sản phẩm muốn xem lại, bấm biểu tượng trái tim trên tin đăng.
            </p>
          </div>
        )}
      </main>
      <Footer />
      <BuyerAuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuthenticated={handleAuthenticated} />
    </div>
  );
}
