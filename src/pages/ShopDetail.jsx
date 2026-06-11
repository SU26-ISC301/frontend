import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Mail,
  Phone,
  ShieldCheck,
  Star,
  Store,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Header } from '../components/Home/Header';
import { Footer } from '../components/layout/Footer';
import { ProductCard } from '../components/Home/ProductCard';
import { Card, CardContent } from '../components/ui/card';
import { sellerApi } from '../api/sellerAPI';

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN').format(Number(value || 0));
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

export default function ShopDetail() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        const vendorData = await sellerApi.getVendorById(id);
        if (!mounted) return;
        setVendor(vendorData);

        // Fetch products by vendor
        const productList = await sellerApi.getProductsByVendor(id);
        if (!mounted) return;
        setProducts(Array.isArray(productList) ? productList : []);

        // Record public shop profile visit
        try {
          await sellerApi.recordVisit(id);
        } catch (visitError) {
          console.warn('Lỗi ghi nhận lượt truy cập shop:', visitError);
        }

      } catch (err) {
        console.error('Lỗi khi tải thông tin cửa hàng:', err);
        if (mounted) {
          setError('Không thể tải thông tin cửa hàng. Vui lòng thử lại sau.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f4ef]">
        <Header />
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-20 text-slate-500">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-orange-500" />
          Đang tải thông tin cửa hàng...
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-[#f6f4ef]">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <p className="text-lg font-extrabold text-slate-800">{error || 'Không tìm thấy thông tin cửa hàng'}</p>
          <Link to="/" className="inline-flex text-sm font-bold text-[#ff4d2e]">Quay lại trang chủ</Link>
        </div>
      </div>
    );
  }

  const activeProducts = products.filter(p => p.isActive !== false);

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-[#16202a]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Shop Header Banner Card */}
        <Card className="border-white/80 bg-white/95 overflow-hidden shadow-sm">
          <div className="h-32 bg-gradient-to-r from-orange-400 via-amber-500 to-indigo-500 relative" />
          <CardContent className="p-6 relative pt-0">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-10 mb-2">
              <img
                src={vendor.logoUrl || '/logo192.png'}
                alt={vendor.shopName}
                className="h-24 w-24 rounded-3xl border-4 border-white object-cover bg-white shadow-md z-10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-black text-slate-950 truncate">{vendor.shopName}</h1>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-extrabold text-[#ff5a2f] ring-1 ring-orange-100 flex items-center gap-1">
                    <Store className="h-3 w-3" /> Cửa hàng đối tác
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500 font-semibold flex items-center gap-1">
                  Chuyên kinh doanh: <span className="text-slate-850 font-bold">{vendor.category || 'Tất cả sản phẩm'}</span>
                </p>
              </div>
              <div className="flex items-center gap-5 shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-amber-500 justify-center">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-lg font-black text-slate-800">
                      {vendor.avgRating ? Number(vendor.avgRating).toFixed(1) : '0.0'}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Đánh giá</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center">
                  <p className="text-lg font-black text-slate-800">{activeProducts.length}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Sản phẩm</p>
                </div>
              </div>
            </div>

            <hr className="my-5 border-slate-100" />

            <div className="grid gap-5 md:grid-cols-[1.5fr_1fr]">
              <div className="space-y-2">
                <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-wider">Giới thiệu cửa hàng</h3>
                <p className="text-sm font-semibold leading-relaxed text-slate-650">
                  {vendor.description || 'Cửa hàng chưa có mô tả giới thiệu cụ thể.'}
                </p>
              </div>
              <div className="space-y-3 bg-stone-50/50 p-4 rounded-2xl border border-stone-100/50">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Thông tin liên hệ</h3>
                <div className="space-y-2.5 text-sm font-semibold text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{vendor.phone || 'Chưa cập nhật số điện thoại'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{vendor.email || 'Chưa cập nhật email'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Trạng thái hoạt động: <span className="text-emerald-700 font-bold uppercase text-xs">Hoạt động</span></span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shop Products Listing */}
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <Store className="h-5 w-5 text-orange-500" />
            Sản phẩm đang bán ({activeProducts.length})
          </h2>

          {activeProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white/50 p-12 text-center text-slate-400 font-semibold">
              Cửa hàng hiện tại chưa đăng bán sản phẩm nào.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {activeProducts.map((p, index) => {
                const mapped = mapProductCard(p);
                return (
                  <ProductCard key={p.id} index={index} {...mapped} />
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
