import { Gamepad2, Grid2X2, Headphones, Laptop, MonitorSmartphone, Network, PackageOpen, Projector, Smartphone, Tv } from 'lucide-react';
import { cn } from '../../lib/utils';

const CARD_LIMIT = 7;

const stylePresets = [
  { icon: Smartphone, color: 'from-[#2563eb] to-[#06b6d4]' },
  { icon: Laptop, color: 'from-[#4f46e5] to-[#0ea5e9]' },
  { icon: Network, color: 'from-[#059669] to-[#14b8a6]' },
  { icon: Tv, color: 'from-[#7c3aed] to-[#2563eb]' },
  { icon: Headphones, color: 'from-[#111827] to-[#64748b]' },
  { icon: Gamepad2, color: 'from-[#f97316] to-[#ef4444]' },
  { icon: MonitorSmartphone, color: 'from-[#ec4899] to-[#8b5cf6]' },
  { icon: Projector, color: 'from-[#b45309] to-[#f59e0b]' },
];

function normalizeCategoryName(value = '') {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function buildFeaturedCategories(categories = []) {
  const rootGroups = new Map();

  categories
    .filter((category) => !category.parentId)
    .forEach((category) => {
      if (!category?.id) return;

      const key = normalizeCategoryName(category.name || category.slug || category.id);
      const existing = rootGroups.get(key);

      if (!existing) {
        rootGroups.set(key, {
          ...category,
          categoryIds: [category.id],
          children: [...(category.children || [])],
        });
        return;
      }

      existing.categoryIds = Array.from(new Set([...(existing.categoryIds || []), category.id]));
      existing.children = [...(existing.children || []), ...(category.children || [])];
    });

  return Array.from(rootGroups.values()).slice(0, CARD_LIMIT);
}

function getCategoryStyle(category, index) {
  const name = `${category?.name || ''} ${category?.slug || ''}`.toLowerCase();

  if (name.includes('điện thoại') || name.includes('dien-thoai')) return stylePresets[0];
  if (name.includes('máy tính') || name.includes('laptop') || name.includes('may-tinh')) return stylePresets[1];
  if (name.includes('mạng') || name.includes('wifi') || name.includes('network')) return stylePresets[2];
  if (name.includes('tv') || name.includes('giải trí') || name.includes('giai-tri')) return stylePresets[3];
  if (name.includes('âm thanh') || name.includes('tai nghe') || name.includes('audio')) return stylePresets[4];
  if (name.includes('game')) return stylePresets[5];
  if (name.includes('thông minh') || name.includes('tablet')) return stylePresets[6];
  if (name.includes('chiếu') || name.includes('projector')) return stylePresets[7];

  return stylePresets[index % stylePresets.length] || { icon: PackageOpen, color: 'from-[#ff4d2e] to-[#ff8a3d]' };
}

export function CategoryStrip({
  categories = [],
  isLoading = false,
  selectedCategoryId = null,
  onSelectCategory,
  productCounts = {},
  totalProductCount = 0,
}) {
  const featuredCategories = buildFeaturedCategories(categories);

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title">Danh mục nổi bật</h2>
          <p className="text-sm text-slate-500">Lối vào nhanh theo hạng mục đang có trong hệ thống.</p>
        </div>
        <button
          type="button"
          onClick={() => onSelectCategory?.(null)}
          className="hidden text-sm font-bold text-[#ff4d2e] hover:text-[#e63e20] sm:block"
        >
          Xem tất cả
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: CARD_LIMIT + 1 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-[18px] bg-white/75 shadow-card"
            />
          ))}
        </div>
      ) : featuredCategories.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => onSelectCategory?.(null)}
            className={cn(
              'category-filter-card group relative flex min-h-28 overflow-hidden rounded-[18px] border bg-white/95 p-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg',
              selectedCategoryId === null
                ? 'border-[#ff6b3d] ring-2 ring-orange-100'
                : 'border-white/80 hover:border-orange-100'
            )}
          >
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#ff4d2e] to-[#ff8a3d]" />
            <div className="flex min-w-0 flex-1 items-start gap-3 pl-1">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff4d2e] to-[#ff8a3d] text-white shadow-lg shadow-orange-500/20">
                <Grid2X2 className="h-5 w-5" strokeWidth={2.4} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-extrabold leading-snug text-slate-950">Tất cả danh mục</p>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-500">
                  {totalProductCount > 0 ? `${totalProductCount} sản phẩm đang bán` : 'Toàn bộ sản phẩm'}
                </p>
              </div>
            </div>
          </button>

          {featuredCategories.map((category, index) => {
            const { icon: Icon, color } = getCategoryStyle(category, index);
            const count = (category.categoryIds || [category.id]).reduce(
              (sum, categoryId) => sum + Number(productCounts[String(categoryId)] || 0),
              0
            );
            const isActive = String(selectedCategoryId) === String(category.id);
            const childCount = category.children?.length || 0;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategory?.(category)}
                className={cn(
                  'category-filter-card group relative flex min-h-28 overflow-hidden rounded-[18px] border bg-white/95 p-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg',
                  isActive
                    ? 'border-[#ff6b3d] bg-orange-50/80 ring-2 ring-orange-100'
                    : 'border-white/80 hover:border-orange-100'
                )}
              >
                <div className={cn('absolute inset-y-0 left-0 w-1 bg-gradient-to-b', color)} />
                <div className="flex min-w-0 flex-1 items-start gap-3 pl-1">
                  <div
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg shadow-black/10',
                      color
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.4} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-extrabold leading-snug text-slate-950">{category.name}</p>
                    <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-500">
                      {count > 0
                        ? `${count} sản phẩm`
                        : childCount > 0
                          ? `${childCount} nhóm sản phẩm`
                          : 'Đang cập nhật'}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/80 bg-white/80 px-5 py-8 text-center text-sm font-semibold text-slate-500 shadow-sm">
          Chưa có hạng mục nào trong dữ liệu.
        </div>
      )}
    </section>
  );
}
