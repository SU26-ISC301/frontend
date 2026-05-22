import { Header } from '../components/Home/Header';
import { Card, CardContent } from '../components/ui/card';
import { Flame, Percent, Truck } from 'lucide-react';

const highlights = [
  {
    icon: Percent,
    title: 'Flash Sale',
    desc: 'Giảm đến 50% mỗi ngày',
  },
  {
    icon: Truck,
    title: 'Freeship',
    desc: 'Đơn từ 0đ – giao nhanh 2h',
  },
  {
    icon: Flame,
    title: 'Hot Deal',
    desc: 'Săn voucher mỗi giờ',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero banner placeholder */}
        <section className="mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-shopee to-orange-400 p-6 text-white sm:p-10">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Chào mừng đến ShopVN
          </h1>
          <p className="mt-2 max-w-lg text-sm text-white/90 sm:text-base">
            Mua sắm trực tuyến – giao diện Module 1: Xác thực &amp; Tài khoản
            (Buyer Auth Modal).
          </p>
        </section>

        {/* Feature cards */}
        <section className="grid gap-4 sm:grid-cols-3">
          {highlights.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-start gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-shopee-light">
                  <Icon className="h-5 w-5 text-shopee" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Product grid placeholder */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Gợi ý hôm nay
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-gray-200" />
                <CardContent className="p-3">
                  <div className="mb-2 h-3 rounded bg-gray-200" />
                  <div className="h-3 w-2/3 rounded bg-gray-200" />
                  <p className="mt-2 text-sm font-semibold text-shopee">
                    ₫{(99 + i) * 1000}.000
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
