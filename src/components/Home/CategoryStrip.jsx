import {
  Armchair,
  CupSoda,
  Gamepad2,
  Gem,
  Headphones,
  Shirt,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const categories = [
  { icon: Smartphone, label: 'Điện tử', color: 'from-[#2563eb] to-[#06b6d4]', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=70' },
  { icon: Shirt, label: 'Thời trang', color: 'from-[#ec4899] to-[#f97316]', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=500&q=70' },
  { icon: Armchair, label: 'Nhà cửa', color: 'from-[#b45309] to-[#f59e0b]', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=70' },
  { icon: CupSoda, label: 'Đồ uống', color: 'from-[#059669] to-[#14b8a6]', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=70' },
  { icon: Gem, label: 'Làm đẹp', color: 'from-[#a855f7] to-[#ec4899]', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=70' },
  { icon: Headphones, label: 'Âm thanh', color: 'from-[#111827] to-[#64748b]', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=500&q=70' },
  { icon: Gamepad2, label: 'Giải trí', color: 'from-[#7c3aed] to-[#2563eb]', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=70' },
  { icon: Sparkles, label: 'Quà tặng', color: 'from-[#ff4d2e] to-[#ff2d6d]', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=500&q=70' },
];

export function CategoryStrip() {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title">Danh mục nổi bật</h2>
          <p className="text-sm text-slate-500">Lối vào nhanh theo nhu cầu mua sắm hằng ngày.</p>
        </div>
        <button type="button" className="hidden text-sm font-bold text-[#ff4d2e] hover:text-[#e63e20] sm:block">
          Xem tất cả
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible lg:grid-cols-8">
        {categories.map(({ icon: Icon, label, color, image }) => (
          <button
            key={label}
            type="button"
            className={cn(
              'category-card group relative min-h-[8.75rem] min-w-[8.25rem] shrink-0 overflow-hidden rounded-[1rem] border border-white/80 bg-white p-3 text-left shadow-card md:min-w-0'
            )}
          >
            <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative flex h-full flex-col justify-between">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg shadow-black/20',
                  color
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <span className="text-sm font-extrabold text-white drop-shadow">{label}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
