import {
  Gamepad2,
  Gem,
  Shirt,
  Smartphone,
  Sofa,
  UtensilsCrossed,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const categories = [
  { icon: Smartphone, label: 'Điện tử', color: 'from-violet-500 to-purple-600' },
  { icon: Shirt, label: 'Thời trang', color: 'from-pink-500 to-rose-500' },
  { icon: Sofa, label: 'Nhà cửa', color: 'from-amber-500 to-orange-500' },
  { icon: UtensilsCrossed, label: 'Ẩm thực', color: 'from-emerald-500 to-teal-500' },
  { icon: Gem, label: 'Làm đẹp', color: 'from-fuchsia-500 to-pink-600' },
  { icon: Gamepad2, label: 'Giải trí', color: 'from-blue-500 to-cyan-500' },
];

export function CategoryStrip() {
  return (
    <section className="mb-8">
      <h2 className="section-title mb-4">Danh mục nổi bật</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-3 sm:overflow-visible md:grid-cols-6">
        {categories.map(({ icon: Icon, label, color }) => (
          <button
            key={label}
            type="button"
            className={cn(
              'card-interactive flex min-w-[5.5rem] shrink-0 flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-card sm:min-w-0'
            )}
          >
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md',
                color
              )}
            >
              <Icon className="h-6 w-6" strokeWidth={2} />
            </div>
            <span className="text-xs font-semibold text-brand-dark">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
