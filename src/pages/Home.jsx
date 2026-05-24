import { Header } from '../components/Home/Header';
import { HeroBanner } from '../components/Home/HeroBanner';
import { CategoryStrip } from '../components/Home/CategoryStrip';
import { ProductCard } from '../components/Home/ProductCard';
import { Footer } from '../components/layout/Footer';
import { Card, CardContent } from '../components/ui/card';
import { Flame, Percent, Truck } from 'lucide-react';

const highlights = [
  {
    icon: Percent,
    title: 'Flash Sale',
    desc: 'Giảm đến 50% mỗi ngày',
    accent: 'from-brand-primary to-orange-400',
  },
  {
    icon: Truck,
    title: 'Freeship+',
    desc: 'Giao nhanh 2h nội thành',
    accent: 'from-brand-accent to-emerald-400',
  },
  {
    icon: Flame,
    title: 'Live Deal',
    desc: 'Săn voucher mỗi giờ',
    accent: 'from-brand-secondary to-pink-400',
  },
];

const products = Array.from({ length: 10 }).map((_, i) => ({
  title: `Sản phẩm trending #${i + 1} — Chất lượng cao, giá tốt`,
  price: `${((99 + i) * 1000).toLocaleString('vi-VN')}`,
  sold: `${(i + 1) * 1.2}k`,
  rating: (4.5 + (i % 5) * 0.1).toFixed(1),
}));

export default function Home() {
  return (
    <div className="page-mesh min-h-screen">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <HeroBanner />

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          {highlights.map(({ icon: Icon, title, desc, accent }) => (
            <Card key={title} className="card-interactive overflow-hidden">
              <CardContent className="relative flex items-center gap-4 p-5">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-md`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-dark">{title}</h3>
                  <p className="text-sm text-brand-muted">{desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <CategoryStrip />

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Gợi ý hôm nay</h2>
              <p className="text-sm text-brand-muted">Được tuyển chọn riêng cho bạn</p>
            </div>
            <span className="pill hidden bg-shopee-light text-brand-primary sm:inline-flex">
              Cập nhật liên tục
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product, i) => (
              <ProductCard key={i} index={i} {...product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
