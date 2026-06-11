import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Eye,
  Heart,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { Header } from '../components/Home/Header';
import { Footer } from '../components/layout/Footer';
import { ProductCard } from '../components/Home/ProductCard';
import { BuyerAuthModal } from '../components/Auth/BuyerAuthModal';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { productApi } from '../api/productAPI';
import { buyerMessageApi } from '../api/buyerMessageAPI';
import { marketResearchApi } from '../api/marketResearchAPI';
import { wishlistApi } from '../api/wishlistAPI';
import { recordViewedCategory } from '../utils/viewedCategories';
import { sellerApi } from '../api/sellerAPI';
import { cn } from '../lib/utils';

const MESSAGE_DRAFT_PREFIX = 'productMessageDraft:';
const PUBLIC_PRODUCTS_CACHE_KEY = 'publicProductsCache:v1';
const MARKET_CACHE_PREFIX = 'productMarketResearchCache:';
const CACHE_TTL_MS = 5 * 60 * 1000;
const MARKET_CACHE_TTL_MS = 30 * 60 * 1000;

function readTimedCache(key, ttlMs) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > ttlMs) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeTimedCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Ignore storage quota/private mode failures.
  }
}

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN').format(Number(value || 0));
}

function formatCompactPrice(value) {
  const number = Number(value || 0);
  if (number >= 1000000) {
    return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(number / 1000000)} tr`;
  }
  if (number >= 1000) {
    return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(number / 1000)} k`;
  }
  return new Intl.NumberFormat('vi-VN').format(number);
}

function formatDate(value) {
  if (!value) return 'Đang cập nhật';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

function getVariantPrices(product) {
  return (product?.variants || [])
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price) && price > 0);
}

function getMainPrice(product) {
  const prices = getVariantPrices(product);
  return prices.length ? Math.min(...prices) : 0;
}

function getProductImage(product) {
  const images = (product?.mediaList || [])
    .filter((media) => (media.mediaType || media.media_type) === 'image')
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return images[0]?.mediaUrl || product?.variants?.find((variant) => variant.imageUrl)?.imageUrl || '';
}

function mapProductCard(product) {
  const price = getMainPrice(product);
  return {
    id: product.id,
    title: product.name,
    price: formatPrice(price),
    oldPrice: null,
    sold: formatPrice(product.soldCount || 0),
    rating: product.avgRating ? Number(product.avgRating).toFixed(1) : '0.0',
    image: getProductImage(product),
    badge: product.vendorName || product.categoryName || 'ShopVN',
    isPremiumHighlighted: Boolean(product.premiumHighlighted),
    vendorId: product.vendorId || product.vendor_id || null,
  };
}

function isLoggedIn() {
  return Boolean(
    localStorage.getItem('buyerAccessToken') ||
      sessionStorage.getItem('buyerAccessToken') ||
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('accessToken')
  );
}

function buildMarketRange(products, product) {
  if (!product?.categoryId) return null;
  const prices = products
    .filter((item) => String(item.categoryId) === String(product.categoryId))
    .flatMap(getVariantPrices);

  if (!prices.length) return null;

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  return { min, max, avg, samples: prices.length };
}

function buildExternalMarketRange(marketResearch) {
  const sources = (marketResearch?.sources || []).filter(
    (source) => source.status === 'OK' && Number(source.min) > 0 && Number(source.max) > 0
  );
  if (!sources.length) return null;

  const minSource = sources.reduce((lowest, source) => Number(source.min) < Number(lowest.min) ? source : lowest, sources[0]);
  const maxSource = sources.reduce((highest, source) => Number(source.max) > Number(highest.max) ? source : highest, sources[0]);
  const allPrices = sources.flatMap((source) => (source.products || []).map((item) => Number(item.price)).filter((price) => price > 0));
  const avg = allPrices.length
    ? allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length
    : Number(marketResearch?.selectedCategory?.marketAverage || 0);

  return {
    min: Number(minSource.min),
    max: Number(maxSource.max),
    avg,
    samples: allPrices.length || sources.reduce((sum, source) => sum + Number(source.productCount || 0), 0),
    sourceCount: sources.length,
    external: true,
    minSource: minSource.source,
    maxSource: maxSource.source,
    sources,
    updatedAt: marketResearch?.updatedAt,
  };
}

function MarketPriceBand({ range, currentPrice, isLoading }) {
  if (isLoading) {
    return (
      <div className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
        <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
        Đang lấy giá thật từ CellPhoneS, FPT Shop, Điện Máy Xanh, Di Động Việt và TopZone...
      </div>
    );
  }

  if (!range) {
    return (
      <div className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
        Chưa đủ dữ liệu thật để tính khoảng giá thị trường.
      </div>
    );
  }

  const width = Math.max(range.max - range.min, 1);
  const position = Math.min(92, Math.max(8, ((currentPrice - range.min) / width) * 100));
  const sourceSummary = range.sources?.length
    ? range.sources.map((source) => source.source).slice(0, 5).join(', ')
    : null;

  return (
    <div className="rounded-2xl bg-[#f2f2f2] p-4">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(18rem,1.35fr)] md:items-center">
        <div>
          <p className="flex items-center gap-1.5 text-base font-extrabold text-slate-950">
            Khoảng giá thị trường
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-500 text-[10px] font-black text-slate-600">
              i
            </span>
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {range.external
              ? `Theo dữ liệu public mới nhất từ ${range.sourceCount} nguồn`
              : `Tạm tính theo ${range.samples} mức giá sản phẩm thật cùng danh mục trong hệ thống`}
          </p>
          {sourceSummary && (
            <p className="mt-2 line-clamp-1 text-[11px] font-bold text-slate-400">
              Nguồn: {sourceSummary}
            </p>
          )}
        </div>

        <div className="pt-7">
          <div className="relative">
            <div className="h-1.5 rounded-full bg-white shadow-inner" />
            <div className="absolute inset-y-0 left-[18%] right-[10%] rounded-full bg-[#2563eb]" />
            <div
              className="absolute top-1/2 h-6 w-px -translate-y-1/2 bg-slate-300"
              style={{ left: '18%' }}
            />
            <div
              className="absolute top-1/2 h-6 w-px -translate-y-1/2 bg-slate-300"
              style={{ right: '10%' }}
            />
            <div
              className="absolute -top-8 -translate-x-1/2 rounded-md bg-[#2563eb] px-2.5 py-1 text-xs font-black text-white shadow-sm after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-x-[5px] after:border-t-[5px] after:border-x-transparent after:border-t-[#2563eb]"
              style={{ left: `${position}%` }}
            >
              {formatCompactPrice(currentPrice)}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 text-xs font-bold text-slate-600">
            <span>{formatCompactPrice(range.min)}</span>
            <span className="text-center text-slate-500">TB {formatCompactPrice(Math.round(range.avg))}</span>
            <span className="text-right">{formatCompactPrice(range.max)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [marketResearch, setMarketResearch] = useState(null);
  const [isLoadingMarket, setIsLoadingMarket] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [message, setMessage] = useState(() => localStorage.getItem(`${MESSAGE_DRAFT_PREFIX}${id}`) || '');
  const [sendStatus, setSendStatus] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState('');
  const [pendingFavorite, setPendingFavorite] = useState(false);

  useEffect(() => {
    const handleAuthChanged = (event) => {
      const nextLoggedIn = Boolean(event.detail?.loggedIn);
      setLoggedIn(nextLoggedIn);
      if (!nextLoggedIn) {
        setProduct((current) => current ? { ...current, vendorPhone: current.vendorPhoneMasked } : current);
      } else {
        productApi.getPublicProductById(id)
          .then((data) => {
            setProduct(data);
            setSelectedImage((current) => current || getProductImage(data));
          })
          .catch((error) => console.warn('Không thể tải lại thông tin liên hệ:', error));
      }
    };
    window.addEventListener('buyer-auth-changed', handleAuthChanged);
    return () => window.removeEventListener('buyer-auth-changed', handleAuthChanged);
  }, [id]);

  const loadProduct = async () => {
    const data = await productApi.getPublicProductById(id);
    setProduct(data);
    setSelectedImage(getProductImage(data));
  };

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setProduct(null);

    productApi.getPublicProductById(id)
      .then((detail) => {
        if (!mounted) return;
        setProduct(detail);
        setSelectedImage(getProductImage(detail));
      })
      .catch((error) => {
        console.warn('Không thể tải chi tiết sản phẩm:', error);
        if (mounted) setProduct(null);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    let mounted = true;
    const cached = readTimedCache(PUBLIC_PRODUCTS_CACHE_KEY, CACHE_TTL_MS);
    if (cached) {
      setAllProducts(Array.isArray(cached) ? cached : []);
      return () => {
        mounted = false;
      };
    }

    productApi.getPublicProducts()
      .then((list) => {
        if (!mounted) return;
        const normalized = Array.isArray(list) ? list : [];
        setAllProducts(normalized);
        writeTimedCache(PUBLIC_PRODUCTS_CACHE_KEY, normalized);
      })
      .catch((error) => {
        console.warn('Không thể tải sản phẩm liên quan:', error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(`${MESSAGE_DRAFT_PREFIX}${id}`, message);
  }, [id, message]);

  useEffect(() => {
    if (!product?.categoryId || !product?.categoryName) return;
    recordViewedCategory({
      id: product.categoryId,
      name: product.categoryName,
      image: getProductImage(product),
    });
  }, [product]);

  useEffect(() => {
    if (!product?.id || !product?.vendorId) return;
    
    // Ghi nhận lượt truy cập vào bài đăng (product post)
    sellerApi.recordVisit(product.vendorId, product.id)
      .catch((err) => console.warn('Lỗi ghi nhận lượt truy cập sản phẩm:', err));
  }, [product?.id, product?.vendorId]);

  useEffect(() => {
    if (!id || !loggedIn) {
      setFavorite(false);
      return;
    }

    let mounted = true;
    wishlistApi.isFavorite(id)
      .then((response) => {
        if (mounted) setFavorite(Boolean(response?.favorite));
      })
      .catch(() => {
        if (mounted) setFavorite(false);
      });

    return () => {
      mounted = false;
    };
  }, [id, loggedIn]);

  const images = useMemo(() => {
    const mediaImages = (product?.mediaList || [])
      .filter((media) => (media.mediaType || media.media_type) === 'image')
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map((media) => media.mediaUrl);
    const variantImages = (product?.variants || []).map((variant) => variant.imageUrl).filter(Boolean);
    return Array.from(new Set([...mediaImages, ...variantImages]));
  }, [product]);

  const currentPrice = useMemo(() => getMainPrice(product), [product]);
  const fallbackMarketRange = useMemo(() => buildMarketRange(allProducts, product), [allProducts, product]);
  const externalMarketRange = useMemo(() => buildExternalMarketRange(marketResearch), [marketResearch]);
  const marketRange = externalMarketRange || fallbackMarketRange;
  const relatedProducts = useMemo(
    () =>
      allProducts
        .filter((item) => String(item.categoryId) === String(product?.categoryId) && String(item.id) !== String(product?.id))
        .slice(0, 5)
        .map(mapProductCard),
    [allProducts, product]
  );

  const requireLogin = () => {
    setSendStatus('Vui lòng đăng nhập để xem đầy đủ số điện thoại hoặc gửi tin nhắn. Nội dung bạn đã nhập vẫn được giữ lại.');
    setAuthOpen(true);
  };

  const addFavorite = async () => {
    try {
      await wishlistApi.addFavorite(id);
      setFavorite(true);
      setFavoriteMessage('Đã thêm tin đăng vào mục yêu thích.');
    } catch (error) {
      setFavoriteMessage(error?.response?.data?.message || 'Chưa thể thêm vào mục yêu thích. Vui lòng thử lại.');
    }
  };

  const handleFavorite = async () => {
    setFavoriteMessage('');
    if (!loggedIn) {
      setPendingFavorite(true);
      setAuthOpen(true);
      return;
    }
    await addFavorite();
  };

  useEffect(() => {
    if (!product?.name) return;

    let mounted = true;
    setMarketResearch(null);
    const cacheKey = `${MARKET_CACHE_PREFIX}${product.id}:${product.name}`;
    const cached = readTimedCache(cacheKey, MARKET_CACHE_TTL_MS);
    if (cached) {
      setMarketResearch(cached);
      setIsLoadingMarket(false);
      return () => {
        mounted = false;
      };
    }

    setIsLoadingMarket(true);
    marketResearchApi.getPublicProductMarketResearch({
      query: product.name,
      categoryName: product.categoryName,
    })
      .then((data) => {
        if (!mounted) return;
        setMarketResearch(data);
        writeTimedCache(cacheKey, data);
      })
      .catch((error) => {
        console.warn('Không thể tải giá thị trường thật:', error);
        if (mounted) setMarketResearch(null);
      })
      .finally(() => {
        if (mounted) setIsLoadingMarket(false);
      });

    return () => {
      mounted = false;
    };
  }, [product?.id, product?.name, product?.categoryName]);

  const handlePhoneClick = () => {
    if (!loggedIn) {
      requireLogin();
      return;
    }
    if (product?.vendorPhone) {
      window.location.href = `tel:${product.vendorPhone}`;
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setSendStatus('Vui lòng nhập nội dung tin nhắn trước khi gửi.');
      return;
    }
    if (!loggedIn) {
      requireLogin();
      return;
    }

    setIsSending(true);
    setSendStatus('');
    try {
      const conversation = await buyerMessageApi.startConversation(product.vendorId);
      await buyerMessageApi.sendMessage(conversation.id, message.trim());
      setMessage('');
      localStorage.removeItem(`${MESSAGE_DRAFT_PREFIX}${id}`);
      setSendStatus('Đã gửi tin nhắn cho shop.');
    } catch (error) {
      setSendStatus(error?.response?.data?.message || 'Không gửi được tin nhắn. Vui lòng thử lại.');
    } finally {
      setIsSending(false);
    }
  };

  const handleAuthenticated = async () => {
    setAuthOpen(false);
    setLoggedIn(true);
    setSendStatus('Đăng nhập thành công. Tin nhắn bạn đã nhập vẫn còn, bạn có thể gửi ngay.');
    try {
      await loadProduct();
    } catch (error) {
      console.warn('Không thể tải lại thông tin liên hệ:', error);
    }
    if (pendingFavorite) {
      setPendingFavorite(false);
      await addFavorite();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f4ef]">
        <Header />
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-20 text-slate-500">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Đang tải chi tiết sản phẩm...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f6f4ef]">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <p className="text-lg font-extrabold text-slate-800">Không tìm thấy tin đăng</p>
          <Link to="/" className="mt-4 inline-flex text-sm font-bold text-[#ff4d2e]">Quay lại trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-[#16202a]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link to="/" className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#ff4d2e]">
          <ArrowLeft className="h-4 w-4" />
          Quay lại trang chủ
        </Link>

        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-white/80 bg-white/95 lg:sticky lg:top-28 lg:self-start">
            <CardContent className="p-3 sm:p-4">
              <div className="overflow-hidden rounded-[28px] bg-slate-950 p-2 shadow-2xl shadow-slate-950/10">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-slate-900">
                  {selectedImage ? (
                    <img src={selectedImage} alt={product.name} className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-400">Chưa có ảnh</div>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4">
                    <p className="line-clamp-1 text-sm font-extrabold text-white">{product.name}</p>
                    <p className="mt-1 text-xs font-semibold text-white/70">{images.length || 1} ảnh sản phẩm</p>
                  </div>
                </div>
              </div>

              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {images.slice(0, 8).map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={cn(
                        'relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-slate-100 transition-all',
                        selectedImage === image
                          ? 'border-[#ff5a2f] ring-4 ring-orange-100'
                          : 'border-white hover:border-orange-200'
                      )}
                      aria-label={`Xem ảnh ${index + 1}`}
                    >
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-white/80 bg-white/95">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[#ff5a2f]">{product.categoryName || 'Sản phẩm'}</p>
                    <h1 className="mt-2 text-2xl font-extrabold leading-tight text-slate-950">{product.name}</h1>
                  </div>
                  {product.premiumHighlighted && (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700 ring-1 ring-amber-100">
                      Tin nổi bật
                    </span>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'rounded-full px-4 font-extrabold',
                      favorite && 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-50'
                    )}
                    onClick={handleFavorite}
                  >
                    <Heart className={cn('h-4 w-4', favorite && 'fill-current')} />
                    {favorite ? 'Đã lưu' : 'Lưu tin'}
                  </Button>
                </div>
                {favoriteMessage && (
                  <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
                    {favoriteMessage}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <p className="text-3xl font-black text-[#ff4d2e]">₫{formatPrice(currentPrice)}</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {product.avgRating ? Number(product.avgRating).toFixed(1) : '0.0'}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">Đã bán {formatPrice(product.soldCount || 0)}</span>
                </div>

                <div className="mt-4 grid gap-2 text-sm font-semibold text-slate-600 sm:grid-cols-2">
                  <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-slate-400" />Đăng ngày {formatDate(product.createdAt)}</span>
                  <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" />Tình trạng: {product.condition || 'Đang cập nhật'}</span>
                  <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" />Xuất xứ: {product.originCountry || 'Đang cập nhật'}</span>
                  <span className="inline-flex items-center gap-2"><Eye className="h-4 w-4 text-slate-400" />Bảo hành: {product.warrantyType || 'Đang cập nhật'}</span>
                </div>

                <div className="mt-5">
                  <MarketPriceBand range={marketRange} currentPrice={currentPrice} isLoading={isLoadingMarket} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/80 bg-white/95">
              <CardContent className="p-5">
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition-opacity group/shop"
                  onClick={() => window.open(`/shop/${product.vendorId}`, '_blank', 'noopener,noreferrer')}
                >
                  <img
                    src={product.vendorLogoUrl || '/logo192.png'}
                    alt={product.vendorName}
                    className="h-14 w-14 rounded-2xl border border-white object-cover shadow-sm group-hover/shop:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-extrabold text-slate-950 group-hover/shop:text-[#ff5a2f] transition-colors">{product.vendorName || 'Shop'}</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{product.vendorDescription || product.vendorCategory || 'Shop đã được xác minh'}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">
                    {product.vendorPlanType || 'free'}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Button type="button" variant="outline" className="h-12 rounded-2xl" onClick={handlePhoneClick}>
                    <Phone className="h-4 w-4" />
                    {product.vendorPhone || product.vendorPhoneMasked || 'Chưa có SĐT'}
                  </Button>
                  <Button type="button" className="h-12 rounded-2xl bg-[#ffcf20] text-slate-950 shadow-none hover:bg-[#ffd84d]" onClick={() => document.getElementById('detail-message-box')?.focus()}>
                    <MessageCircle className="h-4 w-4" />
                    Nhắn tin
                  </Button>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                  <textarea
                    id="detail-message-box"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder={loggedIn ? 'Nhập tin nhắn cho shop...' : 'Đăng nhập để gửi tin nhắn, nội dung nhập ở đây vẫn được giữ lại...'}
                    className="min-h-24 w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold outline-none focus:border-[#ff6a3d] focus:ring-4 focus:ring-[#ff6a3d]/15"
                  />
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-slate-500">
                      {!loggedIn && 'Số điện thoại đang được che 4 số cuối cho đến khi bạn đăng nhập.'}
                    </p>
                    <Button type="button" disabled={isSending} onClick={handleSendMessage} className="rounded-full bg-[#ffcf20] px-5 text-slate-950 shadow-none hover:bg-[#ffd84d]">
                      {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Gửi
                    </Button>
                  </div>
                  {sendStatus && (
                    <p className="mt-3 flex items-start gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {sendStatus}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.75fr]">
          <Card className="border-white/80 bg-white/95">
            <CardContent className="p-5">
              <h2 className="text-lg font-extrabold text-slate-950">Mô tả chi tiết</h2>
              <p className="mt-3 whitespace-pre-line text-sm font-semibold leading-7 text-slate-600">
                {product.description || 'Tin đăng chưa có mô tả chi tiết.'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/80 bg-white/95">
            <CardContent className="p-5">
              <h2 className="text-lg font-extrabold text-slate-950">Thông tin bài đăng</h2>
              <dl className="mt-3 space-y-2 text-sm">
                {[
                  ['Danh mục', product.categoryName],
                  ['SKU', product.variants?.[0]?.sku],
                  ['Cân nặng', product.parcelWeightG ? `${product.parcelWeightG}g` : null],
                  ['Kích thước', product.parcelWidth && product.parcelLength && product.parcelHeight ? `${product.parcelWidth} x ${product.parcelLength} x ${product.parcelHeight} cm` : null],
                  ['Hàng nguy hiểm', product.containsDangerousGoods === 'yes' ? 'Có' : 'Không'],
                  ['Cập nhật', formatDate(product.updatedAt)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                    <dt className="font-bold text-slate-500">{label}</dt>
                    <dd className="text-right font-extrabold text-slate-800">{value || 'Đang cập nhật'}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-8">
            <h2 className="section-title mb-4">Sản phẩm cùng danh mục</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {relatedProducts.map((item, index) => (
                <ProductCard key={item.id} index={index} {...item} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <BuyerAuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuthenticated={handleAuthenticated} />
    </div>
  );
}
