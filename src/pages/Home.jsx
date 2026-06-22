import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/Home/Header';
import { HeroBanner } from '../components/Home/HeroBanner';
import { CategoryStrip } from '../components/Home/CategoryStrip';
import { ProductCard } from '../components/Home/ProductCard';
import { Footer } from '../components/layout/Footer';
import { Card, CardContent } from '../components/ui/card';
import { BarChart3, Clock3, Flame, ShieldCheck, Truck } from 'lucide-react';
import { productApi } from '../api/productAPI';
import { categoryApi } from '../api/categoryAPI';

const highlights = [
  {
    icon: BarChart3,
    title: 'Giá tham khảo rõ ràng',
    desc: 'Xem khoảng giá thị trường trước khi liên hệ shop',
    accent: 'from-[#ff4d2e] to-[#ff8a3d]',
  },
  {
    icon: Truck,
    title: 'Giao nhanh trong ngày',
    desc: 'Theo dõi đơn mượt, cập nhật liên tục',
    accent: 'from-[#0ea5a3] to-[#22c55e]',
  },
  {
    icon: ShieldCheck,
    title: 'Mua hàng an tâm',
    desc: 'Đổi trả dễ dàng, shop đã xác minh',
    accent: 'from-[#2563eb] to-[#7c3aed]',
  },
];

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN').format(Number(value || 0));
}

const APPROVED_PRODUCT_STATUSES = new Set(['active', 'approved', 'đã duyệt', 'da duyet']);
const ACTIVE_PROMOTION_STATUSES = new Set(['active', 'scheduled']);
const PRODUCTS_PAGE_SIZE = 20;

const defaultPageMeta = {
  page: 0,
  size: PRODUCTS_PAGE_SIZE,
  totalPages: 1,
  totalElements: 0,
  first: true,
  last: true,
};

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function normalizeStatus(value) {
  return normalizeText(value);
}

function isApprovedProduct(product) {
  const status = normalizeStatus(product?.status);
  return !status || APPROVED_PRODUCT_STATUSES.has(status);
}

function getPromotionId(product) {
  return product?.promotionId
    ?? product?.postPromotionId
    ?? product?.promotion?.id
    ?? product?.postPromotion?.id
    ?? null;
}

function getPromotionStatus(product) {
  return normalizeStatus(
    product?.promotionStatus
      ?? product?.promotion?.status
      ?? product?.postPromotion?.status
      ?? ''
  );
}

function getPromotionRoi(product) {
  return toNumber(
    product?.roiPerClick
      ?? product?.promotion?.roiPerClick
      ?? product?.postPromotion?.roiPerClick
      ?? product?.promotion?.roiAmount
      ?? product?.postPromotion?.roiAmount
  );
}

function isPromotedProduct(product) {
  const promotionId = getPromotionId(product);
  const promotionStatus = getPromotionStatus(product);
  const hasActiveStatus = !promotionStatus || ACTIVE_PROMOTION_STATUSES.has(promotionStatus);
  return Boolean((product?.isPromoted || promotionId) && hasActiveStatus);
}

function mapProductCard(product) {
  const images = (product.mediaList || [])
    .filter((media) => (media.mediaType || media.media_type) === 'image')
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const variants = product.variants || [];
  const prices = variants.map((variant) => Number(variant.price)).filter((price) => Number.isFinite(price) && price > 0);
  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const roiPerClick = getPromotionRoi(product);

  return {
    id: product.id,
    title: product.name,
    price: formatPrice(lowestPrice),
    oldPrice: null,
    sold: formatPrice(product.soldCount || 0),
    rating: product.avgRating ? Number(product.avgRating).toFixed(1) : '0.0',
    image: images[0]?.mediaUrl || variants.find((variant) => variant.imageUrl)?.imageUrl || '',
    badge: product.vendorName || product.categoryName || 'ShopVN',
    categoryId: product.categoryId || product.category_id || null,
    categoryName: product.categoryName || '',
    isPremiumHighlighted: Boolean(product.premiumHighlighted),
    isPromoted: isPromotedProduct(product),
    roiPerClick,
    createdAt: product.createdAt || product.updatedAt || null,
    vendorId: product.vendorId || product.vendor_id || null,
  };
}

function sortPublicProducts(left, right) {
  const promotedDelta = Number(Boolean(right.isPromoted)) - Number(Boolean(left.isPromoted));
  if (promotedDelta !== 0) return promotedDelta;

  if (left.isPromoted && right.isPromoted) {
    const roiDelta = toNumber(right.roiPerClick) - toNumber(left.roiPerClick);
    if (roiDelta !== 0) return roiDelta;
  }

  return new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime();
}

function getPageContent(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getPageMeta(data, fallbackPage = 0) {
  if (Array.isArray(data)) {
    return {
      ...defaultPageMeta,
      page: fallbackPage,
      totalPages: 1,
      totalElements: data.length,
      first: true,
      last: true,
    };
  }

  return {
    page: Number(data?.number ?? data?.page ?? fallbackPage) || 0,
    size: Number(data?.size ?? PRODUCTS_PAGE_SIZE) || PRODUCTS_PAGE_SIZE,
    totalPages: Math.max(1, Number(data?.totalPages ?? 1) || 1),
    totalElements: Number(data?.totalElements ?? data?.total ?? getPageContent(data).length) || 0,
    first: Boolean(data?.first ?? (Number(data?.number ?? data?.page ?? fallbackPage) <= 0)),
    last: Boolean(data?.last ?? (Number(data?.number ?? data?.page ?? fallbackPage) >= (Number(data?.totalPages ?? 1) - 1))),
  };
}

function flattenCategories(categories = []) {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(category.children || []),
  ]);
}

function collectCategoryIds(category) {
  if (!category) return [];

  return [
    category.id,
    ...(category.categoryIds || []),
    ...(category.children || []).flatMap(collectCategoryIds),
  ].filter((id) => id !== undefined && id !== null);
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export default function Home() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsPage, setProductsPage] = useState(0);
  const [pageMeta, setPageMeta] = useState(defaultPageMeta);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const searchQuery = searchParams.get('search') || '';
  const normalizedSearchQuery = normalizeText(searchQuery);

  useEffect(() => {
    let isMounted = true;

    const params = {
      page: productsPage,
      size: PRODUCTS_PAGE_SIZE,
    };

    if (searchQuery.trim()) {
      params.keyword = searchQuery.trim();
    }
    if (selectedCategory?.id) {
      params.categoryId = selectedCategory.id;
    }

    setIsLoadingProducts(true);
    productApi.getPublicProducts(params)
      .then((data) => {
        if (!isMounted) return;
        const pageContent = getPageContent(data);
        const mapped = pageContent
              .filter(isApprovedProduct)
              .map(mapProductCard)
              .sort(sortPublicProducts);
        setProducts(mapped);
        setPageMeta(getPageMeta(data, productsPage));
      })
      .catch((error) => {
        console.warn('Không thể tải sản phẩm thật:', error);
        if (isMounted) setProducts([]);
        if (isMounted) setPageMeta({ ...defaultPageMeta, page: productsPage });
      })
      .finally(() => {
        if (isMounted) setIsLoadingProducts(false);
      });

    return () => {
      isMounted = false;
    };
  }, [productsPage, searchQuery, selectedCategory]);

  useEffect(() => {
    setProductsPage(0);
  }, [searchQuery, selectedCategory]);

  const allCategories = useMemo(() => flattenCategories(categories), [categories]);

  const selectedCategoryIds = useMemo(
    () => new Set(collectCategoryIds(selectedCategory).map((id) => String(id))),
    [selectedCategory]
  );

  const categoryProductCounts = useMemo(() => {
    const counts = {};

    allCategories.forEach((category) => {
      const categoryIds = new Set(collectCategoryIds(category).map((id) => String(id)));
      counts[String(category.id)] = products.filter((product) => categoryIds.has(String(product.categoryId))).length;
    });

    return counts;
  }, [allCategories, products]);

  const visibleProducts = useMemo(() => {
    const categoryProducts = selectedCategory
      ? products.filter((product) => selectedCategoryIds.has(String(product.categoryId)))
      : products;

    if (!normalizedSearchQuery) return categoryProducts;

    return categoryProducts.filter((product) => {
      const haystack = normalizeText([
        product.title,
        product.badge,
        product.categoryName,
      ].join(' '));
      return haystack.includes(normalizedSearchQuery);
    });
  }, [products, selectedCategory, selectedCategoryIds, normalizedSearchQuery]);

  const pageButtons = useMemo(() => {
    const totalPages = Math.max(1, pageMeta.totalPages || 1);
    const currentPage = Math.min(Math.max(0, pageMeta.page || 0), totalPages - 1);
    const start = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
    const end = Math.min(totalPages, start + 5);
    return Array.from({ length: end - start }, (_, index) => start + index);
  }, [pageMeta.page, pageMeta.totalPages]);

  useEffect(() => {
    let isMounted = true;

    categoryApi.getPublicCategories()
      .then((data) => {
        if (!isMounted) return;
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.warn('Không thể tải hạng mục thật:', error);
        if (isMounted) setCategories([]);
      })
      .finally(() => {
        if (isMounted) setIsLoadingCategories(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="shop-home min-h-screen bg-[#f6f4ef] text-[#16202a]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <HeroBanner />

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          {highlights.map(({ icon: Icon, title, desc, accent }) => (
            <Card key={title} className="card-interactive depth-card overflow-hidden rounded-[1rem] border-white/80 bg-white/90">
              <CardContent className="relative flex items-center gap-4 p-4 sm:p-5">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-md shadow-black/10`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#16202a]">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <CategoryStrip
          categories={categories}
          isLoading={isLoadingCategories}
          selectedCategoryId={selectedCategory?.id ?? null}
          onSelectCategory={setSelectedCategory}
          productCounts={categoryProductCounts}
          totalProductCount={pageMeta.totalElements || products.length}
        />

        <section className="pb-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#f05a35]">
                <Flame className="h-3.5 w-3.5" />
                Đang được săn
              </span>
              <h2 className="section-title">
                {searchQuery ? `Kết quả cho "${searchQuery}"` : selectedCategory ? selectedCategory.name : 'Gợi ý hôm nay'}
              </h2>
              <p className="text-sm text-slate-500">
                {searchQuery
                  ? `Đang lọc sản phẩm thật theo từ khóa ${searchQuery}.`
                  : selectedCategory
                  ? `Sản phẩm thuộc danh mục ${selectedCategory.name}.`
                  : 'Sản phẩm đẹp, giá rõ ràng, hình ảnh thật hơn khi lướt mua.'}
              </p>
            </div>
            <span className="pill hidden bg-white text-[#0e9f6e] shadow-sm ring-1 ring-emerald-100 sm:inline-flex">
              <Clock3 className="h-3.5 w-3.5" />
              Cập nhật trực tiếp
            </span>
          </div>
          {isLoadingProducts ? (
            <div className="rounded-2xl border border-white/80 bg-white/80 px-5 py-10 text-center text-sm font-semibold text-slate-500 shadow-sm">
              Đang tải sản phẩm thật...
            </div>
          ) : visibleProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {visibleProducts.map((product, i) => (
                  <ProductCard key={`${product.id || product.title}-${i}`} index={i} {...product} />
                ))}
              </div>
              {pageMeta.totalPages > 1 && (
                <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/85 px-4 py-4 shadow-sm sm:flex-row">
                  <p className="text-sm font-semibold text-slate-500">
                    Trang <span className="font-extrabold text-slate-800">{pageMeta.page + 1}</span> / {pageMeta.totalPages}
                    <span className="mx-2 text-slate-300">|</span>
                    {new Intl.NumberFormat('vi-VN').format(pageMeta.totalElements)} sản phẩm
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={pageMeta.first || isLoadingProducts}
                      onClick={() => setProductsPage((page) => Math.max(0, page - 1))}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 transition hover:border-[#ff4d2e]/40 hover:text-[#ff4d2e] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Trước
                    </button>
                    {pageButtons.map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        disabled={isLoadingProducts}
                        onClick={() => setProductsPage(pageNumber)}
                        className={`h-10 min-w-10 rounded-xl px-3 text-sm font-extrabold transition ${
                          pageNumber === pageMeta.page
                            ? 'bg-gradient-to-r from-[#ff4d2e] to-[#ff7a45] text-white shadow-md shadow-orange-500/20'
                            : 'border border-slate-200 bg-white text-slate-600 hover:border-[#ff4d2e]/40 hover:text-[#ff4d2e]'
                        }`}
                      >
                        {pageNumber + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={pageMeta.last || isLoadingProducts}
                      onClick={() => setProductsPage((page) => Math.min(pageMeta.totalPages - 1, page + 1))}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 transition hover:border-[#ff4d2e]/40 hover:text-[#ff4d2e] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-white/80 bg-white/80 px-5 py-10 text-center shadow-sm">
              <p className="text-base font-extrabold text-slate-700">
                {searchQuery
                  ? 'Không tìm thấy sản phẩm phù hợp'
                  : selectedCategory
                  ? 'Chưa có sản phẩm trong danh mục này'
                  : 'Chưa có sản phẩm thật đang bán'}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                {searchQuery
                  ? 'Bạn thử đổi từ khóa, tên shop hoặc chọn một danh mục gợi ý khác nhé.'
                  : selectedCategory
                  ? 'Bạn có thể chọn danh mục khác hoặc xem tất cả sản phẩm.'
                  : 'Sản phẩm sẽ xuất hiện ở đây sau khi Admin phê duyệt.'}
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
