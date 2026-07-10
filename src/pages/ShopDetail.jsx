import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Mail,
  Phone,
  ShieldCheck,
  Star,
  Store,
  Loader2,
  AlertTriangle,
  Flag,
  SlidersHorizontal,
} from 'lucide-react';
import { Header } from '../components/Home/Header';
import { Footer } from '../components/layout/Footer';
import { ProductCard } from '../components/Home/ProductCard';
import { BuyerAuthModal } from '../components/Auth/BuyerAuthModal';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { sellerApi } from '../api/sellerAPI';
import { productApi } from '../api/productAPI';
import { ReportDialog } from '../components/Report/ReportDialog';

const PRODUCT_PAGE_SIZE = 20;
const SHOP_PRODUCTS_PAGE_SIZE = 10;

const sortOptions = [
  { value: 'newest', label: 'Mới nhất đến cũ nhất' },
  { value: 'oldest', label: 'Cũ nhất đến mới nhất' },
  { value: 'price-desc', label: 'Giá từ cao đến thấp' },
  { value: 'price-asc', label: 'Giá từ thấp đến cao' },
];

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

function getPageContent(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
}

function getPageMeta(data) {
  if (Array.isArray(data)) {
    return { totalPages: 1 };
  }
  return { totalPages: Math.max(1, Number(data?.totalPages || 1)) };
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
    priceValue: price,
    oldPrice: null,
    sold: formatPrice(product.soldCount || 0),
    rating: product.avgRating ? Number(product.avgRating).toFixed(1) : '0.0',
    image: getProductImage(product),
    badge: product.vendorName || product.categoryName || 'ShopVN',
    isPremiumHighlighted: Boolean(product.premiumHighlighted),
    vendorId: product.vendorId || product.vendor_id || null,
  };
}

function hasBuyerSession() {
  return Boolean(
    localStorage.getItem('buyerAccessToken') ||
      sessionStorage.getItem('buyerAccessToken') ||
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('accessToken')
  );
}

export default function ShopDetail() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [sortMode, setSortMode] = useState('newest');
  const [productPage, setProductPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        const vendorData = await sellerApi.getVendorById(id);
        if (!mounted) return;
        setVendor(vendorData);

        const firstPage = await productApi.getPublicProducts({
          page: 0,
          size: PRODUCT_PAGE_SIZE,
        });
        const allProducts = [...getPageContent(firstPage)];
        const { totalPages } = getPageMeta(firstPage);

        if (totalPages > 1) {
          const remainingPages = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, index) =>
              productApi.getPublicProducts({
                page: index + 1,
                size: PRODUCT_PAGE_SIZE,
              }).catch(() => null)
            )
          );
          remainingPages.forEach((page) => {
            allProducts.push(...getPageContent(page));
          });
        }

        if (!mounted) return;
        setProducts(allProducts.filter((product) => String(product.vendorId || product.vendor_id) === String(id)));

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

  const activeProducts = useMemo(
    () => products.filter((product) => product.isActive !== false),
    [products]
  );

  const categoryOptions = useMemo(() => {
    const categoryMap = new Map();
    activeProducts.forEach((product) => {
      const categoryId = product.categoryId || product.category_id;
      if (categoryId == null) return;
      categoryMap.set(String(categoryId), {
        id: String(categoryId),
        name: product.categoryName || `Danh mục #${categoryId}`,
      });
    });
    return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  }, [activeProducts]);

  const visibleProducts = useMemo(() => {
    const filtered = selectedCategoryId === 'all'
      ? activeProducts
      : activeProducts.filter((product) => String(product.categoryId || product.category_id) === String(selectedCategoryId));

    return [...filtered].sort((left, right) => {
      if (sortMode === 'price-desc') {
        return getMainPrice(right) - getMainPrice(left);
      }
      if (sortMode === 'price-asc') {
        return getMainPrice(left) - getMainPrice(right);
      }
      const leftTime = new Date(left.createdAt || left.updatedAt || 0).getTime();
      const rightTime = new Date(right.createdAt || right.updatedAt || 0).getTime();
      if (sortMode === 'oldest') {
        return leftTime - rightTime;
      }
      return rightTime - leftTime;
    });
  }, [activeProducts, selectedCategoryId, sortMode]);

  const totalProductPages = Math.max(1, Math.ceil(visibleProducts.length / SHOP_PRODUCTS_PAGE_SIZE));
  const pagedProducts = useMemo(
    () => visibleProducts.slice(
      productPage * SHOP_PRODUCTS_PAGE_SIZE,
      (productPage + 1) * SHOP_PRODUCTS_PAGE_SIZE
    ),
    [visibleProducts, productPage]
  );

  const pageButtons = useMemo(() => {
    const currentPage = Math.min(Math.max(0, productPage), totalProductPages - 1);
    const start = Math.max(0, Math.min(currentPage - 2, totalProductPages - 5));
    const end = Math.min(totalProductPages, start + 5);
    return Array.from({ length: end - start }, (_, index) => start + index);
  }, [productPage, totalProductPages]);

  const openShopReport = () => {
    if (!hasBuyerSession()) {
      setNotice('Vui lòng đăng nhập để gửi báo cáo shop.');
      setAuthOpen(true);
      return;
    }
    setNotice('');
    setReportOpen(true);
  };

  useEffect(() => {
    setProductPage(0);
  }, [selectedCategoryId, sortMode]);

  useEffect(() => {
    if (productPage > totalProductPages - 1) {
      setProductPage(Math.max(0, totalProductPages - 1));
    }
  }, [productPage, totalProductPages]);

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
              <Button
                type="button"
                variant="outline"
                className="shrink-0 rounded-2xl border-red-100 text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={openShopReport}
              >
                <Flag className="h-4 w-4" />
                Báo cáo shop
              </Button>
            </div>

            {notice && (
              <p className="mb-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
                {notice}
              </p>
            )}

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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
                <Store className="h-5 w-5 text-orange-500" />
                Sản phẩm đang bán ({activeProducts.length})
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Đang hiển thị {pagedProducts.length}/{visibleProducts.length} sản phẩm phù hợp.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-sm sm:flex-row sm:items-center">
              <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                <SlidersHorizontal className="h-4 w-4 text-orange-500" />
                Bộ lọc
              </span>
              <label className="sr-only" htmlFor="shop-category-filter">Lọc theo danh mục</label>
              <select
                id="shop-category-filter"
                value={selectedCategoryId}
                onChange={(event) => setSelectedCategoryId(event.target.value)}
                className="h-11 min-w-48 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              >
                <option value="all">Tất cả danh mục</option>
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>

              <label className="sr-only" htmlFor="shop-sort-filter">Sắp xếp</label>
              <select
                id="shop-sort-filter"
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value)}
                className="h-11 min-w-52 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {visibleProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white/50 p-12 text-center text-slate-400 font-semibold">
              {activeProducts.length === 0
                ? 'Cửa hàng hiện tại chưa đăng bán sản phẩm nào.'
                : 'Không có sản phẩm phù hợp với bộ lọc hiện tại.'}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {pagedProducts.map((p, index) => {
                const mapped = mapProductCard(p);
                return (
                  <ProductCard key={p.id} index={index} {...mapped} />
                );
              })}
            </div>
          )}
          {visibleProducts.length > SHOP_PRODUCTS_PAGE_SIZE && (
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/85 px-4 py-4 shadow-sm sm:flex-row">
              <p className="text-sm font-semibold text-slate-500">
                Trang <span className="font-extrabold text-slate-800">{productPage + 1}</span> / {totalProductPages}
                <span className="mx-2 text-slate-300">|</span>
                {new Intl.NumberFormat('vi-VN').format(visibleProducts.length)} sản phẩm
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={productPage === 0}
                  onClick={() => setProductPage((page) => Math.max(0, page - 1))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 transition hover:border-[#ff4d2e]/40 hover:text-[#ff4d2e] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Trước
                </button>
                {pageButtons.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setProductPage(pageNumber)}
                    className={`h-10 min-w-10 rounded-xl px-3 text-sm font-extrabold transition ${
                      pageNumber === productPage
                        ? 'bg-gradient-to-r from-[#ff4d2e] to-[#ff7a45] text-white shadow-md shadow-orange-500/20'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-[#ff4d2e]/40 hover:text-[#ff4d2e]'
                    }`}
                  >
                    {pageNumber + 1}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={productPage >= totalProductPages - 1}
                  onClick={() => setProductPage((page) => Math.min(totalProductPages - 1, page + 1))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 transition hover:border-[#ff4d2e]/40 hover:text-[#ff4d2e] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
      <BuyerAuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthenticated={() => {
          setAuthOpen(false);
          setNotice('');
          setReportOpen(true);
        }}
      />
      <ReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        targetType="VENDOR"
        targetId={id}
        targetLabel={vendor.shopName}
      />
    </div>
  );
}
