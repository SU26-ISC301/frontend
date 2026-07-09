import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/Home/Header';
import { HeroBanner } from '../components/Home/HeroBanner';
import { ProductCard } from '../components/Home/ProductCard';
import { Footer } from '../components/layout/Footer';
import { Card, CardContent } from '../components/ui/card';
import {
  BadgePercent,
  BarChart3,
  Cable,
  Camera,
  ChevronDown,
  ChevronRight,
  Clock3,
  Flame,
  Grid2X2,
  Headphones,
  Laptop,
  MonitorSmartphone,
  Newspaper,
  PackageOpen,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Tv,
  Watch,
  X,
  Zap,
} from 'lucide-react';
import { productApi } from '../api/productAPI';
import { categoryApi } from '../api/categoryAPI';
import { TECH_BRANDS } from '../utils/productStorage';

const highlights = [
  {
    icon: BarChart3,
    title: 'Giá tham khảo rõ ràng',
    desc: 'Xem khoảng giá thị trường trước khi liên hệ shop',
    accent: 'from-[#ff4d2e] to-[#ff8a3d]',
  },
  {
    icon: Zap,
    title: 'Tìm kiếm tiện lợi',
    desc: 'Lọc sản phẩm nhanh, vào bài đăng chỉ một chạm',
    accent: 'from-[#0ea5a3] to-[#22c55e]',
  },
  {
    icon: ShieldCheck,
    title: 'Tin đăng đáng tin',
    desc: 'Ưu tiên shop xác minh và sản phẩm có dữ liệu rõ ràng',
    accent: 'from-[#2563eb] to-[#7c3aed]',
  },
];

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN').format(Number(value || 0));
}

const APPROVED_PRODUCT_STATUSES = new Set(['active', 'approved', 'đã duyệt', 'da duyet']);
const ACTIVE_PROMOTION_STATUSES = new Set(['active', 'scheduled']);
const PRODUCTS_PAGE_SIZE = 20;
const PRICE_FILTER_MAX = 73000000;
const MENU_SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất đến cũ nhất' },
  { value: 'oldest', label: 'Cũ nhất đến mới nhất' },
  { value: 'price-desc', label: 'Giá từ cao đến thấp' },
  { value: 'price-asc', label: 'Giá từ thấp đến cao' },
];

const MENU_PRICE_RANGES = [
  { label: 'Dưới 2 triệu', min: null, max: 2000000 },
  { label: 'Từ 2 - 4 triệu', min: 2000000, max: 4000000 },
  { label: 'Từ 4 - 7 triệu', min: 4000000, max: 7000000 },
  { label: 'Từ 7 - 13 triệu', min: 7000000, max: 13000000 },
  { label: 'Từ 13 - 20 triệu', min: 13000000, max: 20000000 },
  { label: 'Trên 20 triệu', min: 20000000, max: null },
];

const CATEGORY_ICON_PRESETS = [
  { icon: Smartphone, keywords: ['điện thoại', 'tablet', 'dien thoai', 'máy tính bảng', 'may tinh bang'] },
  { icon: Laptop, keywords: ['laptop', 'máy tính', 'may tinh', 'văn phòng', 'van phong'] },
  { icon: Headphones, keywords: ['âm thanh', 'am thanh', 'audio', 'mic', 'loa', 'tai nghe'] },
  { icon: Camera, keywords: ['camera', 'nhiếp ảnh', 'nhiep anh'] },
  { icon: Watch, keywords: ['đồng hồ', 'dong ho', 'thiết bị đeo', 'thiet bi deo'] },
  { icon: Cable, keywords: ['phụ kiện', 'phu kien', 'cáp', 'cap', 'sạc', 'sac'] },
  { icon: MonitorSmartphone, keywords: ['pc', 'màn hình', 'man hinh', 'máy in', 'may in'] },
  { icon: Tv, keywords: ['tivi', 'tv', 'điện máy', 'dien may', 'giải trí', 'giai tri'] },
  { icon: RefreshCw, keywords: ['thu cũ', 'thu cu', 'đổi mới', 'doi moi'] },
  { icon: PackageOpen, keywords: ['hàng cũ', 'hang cu'] },
  { icon: BadgePercent, keywords: ['khuyến mãi', 'khuyen mai'] },
  { icon: Newspaper, keywords: ['tin công nghệ', 'tin cong nghe'] },
];

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

function formatCurrencyInput(value) {
  const number = Number(value || 0);
  if (!number) return '';
  return new Intl.NumberFormat('vi-VN').format(number);
}

function parseCurrencyInput(value) {
  return String(value || '').replace(/\D/g, '');
}

function getProductLowestPrice(product) {
  const variants = product?.variants || [];
  const prices = variants
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price) && price > 0);
  return prices.length ? Math.min(...prices) : 0;
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

function getProductBrandName(product) {
  const directBrand = product?.brandName
    ?? product?.brand_name
    ?? product?.brand?.name
    ?? product?.brand;

  if (directBrand && Number.isNaN(Number(directBrand))) {
    return String(directBrand);
  }

  const brandAttribute = (product?.attributes || []).find((attribute) => {
    const name = normalizeText(attribute?.name);
    return name.includes('brand') || name.includes('hang') || name.includes('thuong hieu');
  });

  return brandAttribute?.values?.[0]?.value || '';
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
  const lowestPrice = getProductLowestPrice(product);
  const roiPerClick = getPromotionRoi(product);

  return {
    id: product.id,
    promotionId: getPromotionId(product),
    title: product.name,
    price: formatPrice(lowestPrice),
    priceValue: lowestPrice,
    oldPrice: null,
    sold: formatPrice(product.soldCount || 0),
    rating: product.avgRating ? Number(product.avgRating).toFixed(1) : '0.0',
    image: images[0]?.mediaUrl || variants.find((variant) => variant.imageUrl)?.imageUrl || '',
    badge: product.vendorName || product.categoryName || 'ShopVN',
    categoryId: product.categoryId || product.category_id || null,
    categoryName: product.categoryName || '',
    brandName: getProductBrandName(product),
    isPremiumHighlighted: Boolean(product.premiumHighlighted),
    isPromoted: isPromotedProduct(product),
    roiPerClick,
    createdAt: product.createdAt || product.updatedAt || null,
    vendorId: product.vendorId || product.vendor_id || null,
  };
}

function isProductInPriceRange(product, priceRange) {
  const min = Number(priceRange?.min || 0);
  const max = Number(priceRange?.max || 0);
  if (!min && !max) return true;

  const price = getProductLowestPrice(product);
  if (!price) return false;
  if (min && price < min) return false;
  if (max && price > max) return false;
  return true;
}

function compareByMenuSort(left, right, sortMode) {
  if (sortMode === 'price-desc') {
    return toNumber(right.priceValue) - toNumber(left.priceValue);
  }

  if (sortMode === 'price-asc') {
    return toNumber(left.priceValue) - toNumber(right.priceValue);
  }

  const leftTime = new Date(left.createdAt || 0).getTime();
  const rightTime = new Date(right.createdAt || 0).getTime();

  if (sortMode === 'oldest') {
    return leftTime - rightTime;
  }

  return rightTime - leftTime;
}

function sortPublicProducts(left, right, sortMode = 'newest') {
  const promotedDelta = Number(Boolean(right.isPromoted)) - Number(Boolean(left.isPromoted));
  if (promotedDelta !== 0) return promotedDelta;

  if (left.isPromoted && right.isPromoted) {
    const roiDelta = toNumber(right.roiPerClick) - toNumber(left.roiPerClick);
    if (roiDelta !== 0) return roiDelta;
  }

  return compareByMenuSort(left, right, sortMode);
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

function dedupeProducts(products = []) {
  return Array.from(
    products.reduce((map, product) => {
      if (product?.id != null) {
        map.set(String(product.id), product);
      }
      return map;
    }, new Map()).values()
  );
}

function normalizeCategory(category) {
  if (!category) return null;

  return {
    ...category,
    id: category.id,
    name: category.name || category.categoryName || category.slug || `Danh mục #${category.id}`,
    slug: category.slug || '',
    imageUrl: category.imageUrl || category.image_url || '',
    parentId: category.parentId ?? category.parent_id ?? category.parent?.id ?? null,
    isActive: category.isActive ?? category.is_active ?? true,
    children: (category.children || category.subCategories || category.sub_categories || [])
      .map(normalizeCategory)
      .filter(Boolean),
  };
}

function buildCategoryTree(categories = []) {
  const normalized = categories
    .map(normalizeCategory)
    .filter((category) => category && category.isActive !== false);

  const hasTreeChildren = normalized.some((category) => category.children?.length);
  if (hasTreeChildren) return normalized;

  const categoryById = new Map();
  normalized.forEach((category) => {
    categoryById.set(String(category.id), { ...category, children: [] });
  });

  const roots = [];
  categoryById.forEach((category) => {
    const parentKey = category.parentId == null ? null : String(category.parentId);
    const parent = parentKey ? categoryById.get(parentKey) : null;
    if (parent) {
      parent.children.push(category);
    } else {
      roots.push(category);
    }
  });

  return roots;
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

function getCategoryMenuIcon(category, index = 0) {
  const text = normalizeText(`${category?.name || ''} ${category?.slug || ''}`);
  const preset = CATEGORY_ICON_PRESETS.find((item) =>
    item.keywords.some((keyword) => text.includes(normalizeText(keyword)))
  );
  return preset?.icon || CATEGORY_ICON_PRESETS[index % CATEGORY_ICON_PRESETS.length]?.icon || Grid2X2;
}

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [allMatchedProducts, setAllMatchedProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsPage, setProductsPage] = useState(0);
  const [pageMeta, setPageMeta] = useState(defaultPageMeta);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceDraft, setPriceDraft] = useState({ min: '', max: '' });
  const [appliedPrice, setAppliedPrice] = useState({ min: null, max: null });
  const [menuSortMode, setMenuSortMode] = useState('newest');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [activeRootCategoryId, setActiveRootCategoryId] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const categoryMenuRef = useRef(null);
  const searchQuery = searchParams.get('search') || '';
  const hasPriceFilter = Boolean(Number(appliedPrice.min || 0) || Number(appliedPrice.max || 0));

  const rootCategories = categories;
  const activeRootCategory = rootCategories.find((category) => String(category.id) === String(activeRootCategoryId))
    || rootCategories[0]
    || null;

  const brandOptions = useMemo(() => {
    const productBrands = allMatchedProducts
      .map((product) => product.brandName)
      .filter(Boolean);
    const brands = productBrands.length ? productBrands : TECH_BRANDS;
    return Array.from(new Set(brands)).slice(0, 16);
  }, [allMatchedProducts]);

  useEffect(() => {
    let isMounted = true;

    const filterParams = {};

    if (searchQuery.trim()) {
      filterParams.keyword = searchQuery.trim();
    }
    if (selectedCategory?.id) {
      filterParams.categoryId = selectedCategory.id;
    }

    setIsLoadingProducts(true);

    const loadProducts = async () => {
      const firstPage = await productApi.getPublicProducts({
        ...filterParams,
        page: 0,
        size: PRODUCTS_PAGE_SIZE,
      });
      const firstMeta = getPageMeta(firstPage, 0);
      const allContent = [...getPageContent(firstPage)];

      if (firstMeta.totalPages > 1) {
        const remainingPages = await Promise.all(
          Array.from({ length: firstMeta.totalPages - 1 }, (_, index) =>
            productApi.getPublicProducts({
              ...filterParams,
              page: index + 1,
              size: PRODUCTS_PAGE_SIZE,
            }).catch(() => null)
          )
        );
        remainingPages.forEach((page) => {
          allContent.push(...getPageContent(page));
        });
      }

      const uniqueProducts = dedupeProducts(allContent);

      const filteredContent = uniqueProducts
        .filter(isApprovedProduct)
        .filter((product) => !hasPriceFilter || isProductInPriceRange(product, appliedPrice))
        .map(mapProductCard)
        .sort((left, right) => sortPublicProducts(left, right, menuSortMode));
      const totalElements = filteredContent.length;
      const totalPages = Math.max(1, Math.ceil(totalElements / PRODUCTS_PAGE_SIZE));
      const safePage = Math.min(productsPage, totalPages - 1);

      return {
        allContent: filteredContent,
        content: filteredContent.slice(safePage * PRODUCTS_PAGE_SIZE, (safePage + 1) * PRODUCTS_PAGE_SIZE),
        number: safePage,
        size: PRODUCTS_PAGE_SIZE,
        totalElements,
        totalPages,
        first: safePage === 0,
        last: safePage >= totalPages - 1,
      };
    };

    loadProducts()
      .then((data) => {
        if (!isMounted) return;
        setAllMatchedProducts(data.allContent || []);
        setProducts(getPageContent(data));
        setPageMeta(getPageMeta(data, productsPage));
      })
      .catch((error) => {
        console.warn('Không thể tải sản phẩm thật:', error);
        if (isMounted) setProducts([]);
        if (isMounted) setAllMatchedProducts([]);
        if (isMounted) setPageMeta({ ...defaultPageMeta, page: productsPage });
      })
      .finally(() => {
        if (isMounted) setIsLoadingProducts(false);
      });

    return () => {
      isMounted = false;
    };
  }, [productsPage, searchQuery, selectedCategory, appliedPrice, hasPriceFilter, menuSortMode]);

  useEffect(() => {
    setProductsPage(0);
  }, [searchQuery, selectedCategory, appliedPrice, menuSortMode]);

  useEffect(() => {
    if (!activeRootCategoryId && rootCategories.length > 0) {
      setActiveRootCategoryId(rootCategories[0].id);
    }
  }, [activeRootCategoryId, rootCategories]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setIsCategoryMenuOpen(false);
      }
    };

    if (isCategoryMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCategoryMenuOpen]);

  const visibleProducts = products;

  const pageButtons = useMemo(() => {
    const totalPages = Math.max(1, pageMeta.totalPages || 1);
    const currentPage = Math.min(Math.max(0, pageMeta.page || 0), totalPages - 1);
    const start = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
    const end = Math.min(totalPages, start + 5);
    return Array.from({ length: end - start }, (_, index) => start + index);
  }, [pageMeta.page, pageMeta.totalPages]);

  const updatePriceDraft = (field, value) => {
    const normalizedValue = Math.max(0, Math.min(PRICE_FILTER_MAX, Number(parseCurrencyInput(value) || 0)));
    setPriceDraft((current) => {
      const next = { ...current, [field]: normalizedValue ? String(normalizedValue) : '' };
      const min = Number(next.min || 0);
      const max = Number(next.max || 0);
      if (field === 'min' && max && min > max) {
        next.max = String(min);
      }
      if (field === 'max' && max && min > max) {
        next.min = String(max);
      }
      return next;
    });
  };

  const applyPriceFilter = () => {
    setAppliedPrice({
      min: Number(priceDraft.min || 0) || null,
      max: Number(priceDraft.max || 0) || null,
    });
  };

  const applyMenuPriceRange = (range) => {
    const min = range.min || null;
    const max = range.max || null;
    setPriceDraft({
      min: min ? String(min) : '',
      max: max ? String(max) : '',
    });
    setAppliedPrice({ min, max });
    setIsCategoryMenuOpen(false);
  };

  const clearPriceFilter = () => {
    setPriceDraft({ min: '', max: '' });
    setAppliedPrice({ min: null, max: null });
  };

  const selectMenuCategory = (category) => {
    setSelectedCategory(category);
    if (category?.id) {
      const root = rootCategories.find((rootCategory) =>
        collectCategoryIds(rootCategory).map(String).includes(String(category.id))
      );
      setActiveRootCategoryId(root?.id || category.id);
    }
    setIsCategoryMenuOpen(false);
  };

  const selectMenuBrand = (brand) => {
    setSelectedBrand(brand);
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set('search', brand);
      return next;
    });
    setIsCategoryMenuOpen(false);
  };

  useEffect(() => {
    let isMounted = true;

    categoryApi.getPublicCategories()
      .then((data) => {
        if (!isMounted) return;
        setCategories(buildCategoryTree(Array.isArray(data) ? data : []));
      })
      .catch((error) => {
        console.warn('Không thể tải hạng mục thật:', error);
        if (isMounted) setCategories([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryMenuSlot = (
    <div ref={categoryMenuRef} className="relative order-3 sm:order-none">
      <button
        type="button"
        onClick={() => setIsCategoryMenuOpen((open) => !open)}
        className="flex h-11 w-full items-center justify-between gap-2 rounded-2xl border border-orange-100 bg-white px-3 text-left text-sm font-extrabold text-[#f05a22] shadow-sm shadow-orange-100/60 transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 focus:outline-none focus:ring-4 focus:ring-orange-100 sm:w-[160px]"
        aria-expanded={isCategoryMenuOpen}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Grid2X2 className="h-5 w-5 shrink-0" strokeWidth={2.5} />
          <span className="truncate">{selectedCategory?.name || 'Danh mục'}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
      </button>

      {isCategoryMenuOpen && (
        <div className="absolute left-0 top-full z-50 mt-3 w-[min(94vw,780px)] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-900/18 sm:left-1/2 sm:-translate-x-[36%]">
          <div className="grid max-h-[560px] grid-cols-1 overflow-hidden md:grid-cols-[280px_minmax(0,1fr)]">
            <div className="border-b border-slate-100 bg-white py-2 md:border-b-0 md:border-r">
              <button
                type="button"
                onClick={() => selectMenuCategory(null)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-red-50 ${
                  !selectedCategory ? 'bg-red-50 text-red-600' : 'text-slate-700'
                }`}
              >
                <Grid2X2 className="h-6 w-6 shrink-0 text-red-500" />
                <span className="flex-1 text-base font-extrabold">Tất cả danh mục</span>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </button>

              <div className="max-h-[480px] overflow-y-auto py-1">
                {rootCategories.map((category, index) => {
                  const Icon = getCategoryMenuIcon(category, index);
                  const isActive = String(activeRootCategory?.id) === String(category.id);

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onMouseEnter={() => setActiveRootCategoryId(category.id)}
                      onFocus={() => setActiveRootCategoryId(category.id)}
                      onClick={() => setActiveRootCategoryId(category.id)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                        isActive ? 'bg-red-50 text-red-600' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      <Icon className="h-7 w-7 shrink-0 text-red-500" strokeWidth={1.9} />
                      <span className="min-w-0 flex-1 truncate text-base font-extrabold">{category.name}</span>
                      <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid max-h-[560px] gap-6 overflow-y-auto p-5 md:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {activeRootCategory?.name || 'Danh mục con'}
                  </h3>
                  {activeRootCategory && (
                    <button
                      type="button"
                      onClick={() => selectMenuCategory(activeRootCategory)}
                      className="text-xs font-extrabold text-red-600 hover:text-red-700"
                    >
                      Xem tất cả
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  {(activeRootCategory?.children || []).length > 0 ? (
                    activeRootCategory.children.map((subcategory) => (
                      <button
                        key={subcategory.id}
                        type="button"
                        onClick={() => selectMenuCategory(subcategory)}
                        className={`block w-full rounded-xl px-3 py-2 text-left text-sm font-bold transition ${
                          String(selectedCategory?.id) === String(subcategory.id)
                            ? 'bg-red-50 text-red-600'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                        }`}
                      >
                        {subcategory.name}
                        {subcategory.children?.length > 0 && (
                          <span className="ml-2 text-xs font-semibold text-slate-400">
                            {subcategory.children.length} nhóm
                          </span>
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="rounded-xl bg-slate-50 px-3 py-4 text-sm font-semibold text-slate-400">
                      Danh mục này chưa có nhóm con.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-lg font-extrabold text-slate-900">Hãng</h3>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                    {brandOptions.map((brand) => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => selectMenuBrand(brand)}
                        className={`truncate rounded-lg px-2 py-1.5 text-left text-sm font-semibold transition ${
                          selectedBrand === brand
                            ? 'bg-red-50 text-red-600'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-extrabold text-slate-900">Mức giá</h3>
                  <div className="space-y-1">
                    {MENU_PRICE_RANGES.map((range) => (
                      <button
                        key={range.label}
                        type="button"
                        onClick={() => applyMenuPriceRange(range)}
                        className="block w-full rounded-lg px-2 py-1.5 text-left text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="shop-home min-h-screen bg-[#f6f4ef] text-[#16202a]">
      <Header categoryMenuSlot={categoryMenuSlot} />

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <HeroBanner
          products={(allMatchedProducts.length ? allMatchedProducts : visibleProducts).slice(0, 12)}
          isLoading={isLoadingProducts}
          totalProducts={pageMeta.totalElements || allMatchedProducts.length}
        />

        <section className="mb-10 grid gap-4 sm:grid-cols-3">
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

        <section id="catalog-products" className="scroll-mt-36 pb-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#f05a35]">
                <Flame className="h-3.5 w-3.5" />
                Đang được săn
              </span>
              <h2 className="section-title text-3xl">
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
          <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="h-fit overflow-hidden rounded-[1.5rem] border border-white/90 bg-[linear-gradient(180deg,#ffffff_0%,#fff8f3_100%)] p-4 shadow-[0_24px_70px_-54px_rgba(15,23,42,0.72)] ring-1 ring-orange-100/70 lg:sticky lg:top-32">
              <div className="rounded-[1.15rem] border border-orange-100 bg-white/85 p-4 shadow-[0_18px_46px_-38px_rgba(255,107,44,0.72)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff4d2e] to-[#ff8a3d] text-white shadow-lg shadow-orange-500/20">
                      <SlidersHorizontal className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#f05a22]">Bộ lọc cá nhân</p>
                      <h3 className="mt-1 text-base font-black text-slate-950">Xem theo ngân sách</h3>
                    </div>
                  </div>
                  {hasPriceFilter && (
                    <button
                      type="button"
                      onClick={clearPriceFilter}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#f05a22] transition hover:bg-orange-100"
                      aria-label="Xóa lọc giá"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">Chọn khoảng giá phù hợp để tìm nhanh sản phẩm C2C đang bán.</p>
              </div>

              <div className="px-1 pb-1 pt-5">
              <p className="text-sm font-extrabold text-slate-800">Khoảng giá mong muốn</p>

              <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <label className="sr-only" htmlFor="min-price-filter">Giá thấp nhất</label>
                <input
                  id="min-price-filter"
                  type="text"
                  inputMode="numeric"
                  value={formatCurrencyInput(priceDraft.min)}
                  onChange={(event) => updatePriceDraft('min', event.target.value)}
                  placeholder="0"
                  className="h-12 min-w-0 rounded-2xl border border-orange-100 bg-white px-3 text-right text-sm font-black text-slate-800 shadow-inner shadow-orange-50/50 outline-none transition placeholder:text-slate-300 focus:border-[#ff7a45] focus:ring-4 focus:ring-orange-100"
                />
                <span className="font-extrabold text-orange-300">-</span>
                <label className="sr-only" htmlFor="max-price-filter">Giá cao nhất</label>
                <input
                  id="max-price-filter"
                  type="text"
                  inputMode="numeric"
                  value={formatCurrencyInput(priceDraft.max)}
                  onChange={(event) => updatePriceDraft('max', event.target.value)}
                  placeholder={formatCurrencyInput(PRICE_FILTER_MAX)}
                  className="h-12 min-w-0 rounded-2xl border border-orange-100 bg-white px-3 text-right text-sm font-black text-slate-800 shadow-inner shadow-orange-50/50 outline-none transition placeholder:text-slate-300 focus:border-[#ff7a45] focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div className="mt-5 rounded-2xl border border-orange-100 bg-white/75 px-4 py-4 shadow-sm">
                <input
                  type="range"
                  min="0"
                  max={PRICE_FILTER_MAX}
                  step="10000"
                  value={Number(priceDraft.max || PRICE_FILTER_MAX)}
                  onChange={(event) => updatePriceDraft('max', event.target.value)}
                  className="h-2 w-full accent-[#ff6b2c]"
                  aria-label="Chọn giá cao nhất"
                />
                <div className="mt-3 flex justify-between text-xs font-black text-slate-400">
                  <span>0đ</span>
                  <span>{formatCurrencyInput(PRICE_FILTER_MAX)}đ</span>
                </div>
              </div>

              {hasPriceFilter && (
                <p className="mt-4 rounded-2xl border border-orange-100 bg-orange-50 px-3 py-2 text-xs font-bold text-[#f05a22]">
                  Đang lọc: {formatCurrencyInput(appliedPrice.min || 0)}đ - {appliedPrice.max ? `${formatCurrencyInput(appliedPrice.max)}đ` : 'không giới hạn'}
                </p>
              )}

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={clearPriceFilter}
                  className="h-12 rounded-2xl border border-orange-100 bg-white text-sm font-extrabold text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f05a22]"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={applyPriceFilter}
                  className="h-12 rounded-2xl bg-gradient-to-r from-[#ff315c] to-[#ff6b2c] text-sm font-extrabold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:shadow-orange-500/30"
                >
                  Xem kết quả
                </button>
              </div>
              </div>
            </aside>

            <div className="min-w-0">
              <div className="mb-5 flex w-full flex-col gap-3 rounded-[1.35rem] border border-white/80 bg-white/90 p-3 shadow-[0_18px_46px_-38px_rgba(15,23,42,0.58)] sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex shrink-0 items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  <SlidersHorizontal className="h-4 w-4 text-[#ff6b2c]" />
                  Bộ lọc
                </div>
                <div className="grid flex-1 gap-2 sm:max-w-sm">
                  <label className="sr-only" htmlFor="menu-sort-filter">Sắp xếp sản phẩm</label>
                  <select
                    id="menu-sort-filter"
                    value={menuSortMode}
                    onChange={(event) => setMenuSortMode(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-orange-100 bg-white px-4 text-sm font-extrabold text-slate-700 outline-none transition focus:border-[#ff7a45] focus:ring-4 focus:ring-orange-100"
                  >
                    {MENU_SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {isLoadingProducts ? (
                <div className="rounded-2xl border border-white/80 bg-white/80 px-5 py-10 text-center text-sm font-semibold text-slate-500 shadow-sm">
                  Đang tải sản phẩm thật...
                </div>
              ) : visibleProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
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
                    {hasPriceFilter
                      ? 'Không có sản phẩm trong khoảng giá này'
                      : searchQuery
                      ? 'Không tìm thấy sản phẩm phù hợp'
                      : selectedCategory
                      ? 'Chưa có sản phẩm trong danh mục này'
                      : 'Chưa có sản phẩm thật đang bán'}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    {hasPriceFilter
                      ? 'Bạn thử mở rộng khoảng giá hoặc xóa lọc để xem thêm sản phẩm.'
                      : searchQuery
                      ? 'Bạn thử đổi từ khóa, tên shop hoặc chọn một danh mục gợi ý khác nhé.'
                      : selectedCategory
                      ? 'Bạn có thể chọn danh mục khác hoặc xem tất cả sản phẩm.'
                      : 'Sản phẩm sẽ xuất hiện ở đây sau khi Admin phê duyệt.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
