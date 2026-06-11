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

function mapProductCard(product) {
  const images = (product.mediaList || [])
    .filter((media) => (media.mediaType || media.media_type) === 'image')
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const variants = product.variants || [];
  const prices = variants.map((variant) => Number(variant.price)).filter((price) => Number.isFinite(price) && price > 0);
  const lowestPrice = prices.length ? Math.min(...prices) : 0;

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
    vendorId: product.vendorId || product.vendor_id || null,
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
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const searchQuery = searchParams.get('search') || '';
  const normalizedSearchQuery = normalizeText(searchQuery);

  useEffect(() => {
    let isMounted = true;

    productApi.getPublicProducts()
      .then((data) => {
        if (!isMounted) return;
        const mapped = Array.isArray(data) ? data.map(mapProductCard) : [];
        mapped.sort((a, b) => Number(b.isPremiumHighlighted) - Number(a.isPremiumHighlighted));
        setProducts(mapped);
      })
      .catch((error) => {
        console.warn('Không thể tải sản phẩm thật:', error);
        if (isMounted) setProducts([]);
      })
      .finally(() => {
        if (isMounted) setIsLoadingProducts(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
          totalProductCount={products.length}
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {visibleProducts.map((product, i) => (
                <ProductCard key={`${product.id || product.title}-${i}`} index={i} {...product} />
              ))}
            </div>
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
