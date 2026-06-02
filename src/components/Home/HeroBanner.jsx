import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Play, ShieldCheck, Sparkles, Truck, Zap } from 'lucide-react';
import { Button } from '../ui/button';

export function HeroBanner() {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -14;
    setTilt({ x, y });
  };

  return (
    <section className="hero-market relative mb-8 overflow-hidden rounded-[1.25rem] bg-[#13252f] p-5 text-white shadow-[0_30px_90px_-48px_rgba(15,23,42,0.9)] sm:p-8 lg:p-10">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_35%,rgba(255,138,61,0.16))]" />
      <img
        src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1800&q=82"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-screen"
      />
      <div className="pointer-events-none absolute -right-20 top-8 h-64 w-64 rounded-full bg-[#ff8a3d]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-[#2dd4bf]/20 blur-3xl" />

      <div className="relative grid min-w-0 gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="min-w-0 max-w-2xl">
          <span className="pill mb-4 border border-white/15 bg-white/10 text-white shadow-sm backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#5eead4]" />
            Siêu sale cuối tuần · giao nhanh trong ngày
          </span>
          <h1 className="max-w-xl text-[2rem] font-extrabold leading-tight text-white sm:text-5xl lg:text-[3.45rem]">
            Mua sắm đẹp mắt, chạm là muốn thêm vào giỏ
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/76 sm:text-base">
            Khám phá sản phẩm nổi bật với hình ảnh chân thật, deal rõ ràng, thao tác nhanh
            và trải nghiệm lướt mua sinh động trên mọi thiết bị.
          </p>
          <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
            <Button size="lg" className="w-full rounded-full bg-[#ff5a2f] shadow-[0_18px_40px_-18px_rgba(255,90,47,0.95)] hover:bg-[#ff6a3d] sm:w-auto">
              Khám phá ngay
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Link to="/seller" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full rounded-full border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/18 hover:text-white sm:w-auto">
                <Play className="h-4 w-4 fill-current" />
                Mở gian hàng
              </Button>
            </Link>
          </div>

          <div className="mt-7 grid max-w-lg grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
            {[
              { icon: Truck, label: '2h nội thành' },
              { icon: ShieldCheck, label: 'Đổi trả dễ' },
              { icon: BadgeCheck, label: 'Shop xác minh' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-3 py-3 text-center backdrop-blur-md sm:block">
                <Icon className="h-4 w-4 shrink-0 text-[#7dd3fc] sm:mx-auto sm:mb-1.5" />
                <p className="text-xs font-semibold text-white/80">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-perspective min-w-0">
          <div
            ref={cardRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setTilt({ x: 0, y: 0 })}
            className="hero-tilt relative mx-auto w-full min-w-0 max-w-[34rem]"
            style={{ transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }}
          >
            <div className="absolute -left-4 top-8 z-20 hidden rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-[#16202a] shadow-2xl backdrop-blur sm:block">
              <p className="text-xs font-bold text-slate-500">Đang giảm</p>
              <p className="text-2xl font-black text-[#ff4d2e]">-48%</p>
            </div>
            <div className="absolute bottom-6 right-3 z-20 rounded-2xl border border-white/20 bg-[#111827]/92 px-3 py-2.5 text-white shadow-2xl backdrop-blur sm:bottom-8 sm:right-4 sm:px-3.5 sm:py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#5eead4] text-[#0f172a]">
                  <Zap className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs text-white/60">Flash live</p>
                  <p className="text-sm font-extrabold">12:00 - 14:00</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.2rem] border border-white/18 bg-white/12 p-3 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.95)] backdrop-blur-xl">
              <div className="grid min-w-0 gap-3 sm:grid-cols-[1.1fr_0.9fr]">
                <img
                  src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=900&q=82"
                  alt="Bộ sản phẩm mua sắm nổi bật"
                  className="h-64 w-full rounded-2xl object-cover sm:h-80"
                />
                <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-1">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=82"
                    alt="Đồng hồ giảm giá"
                    className="h-36 w-full min-w-0 rounded-2xl object-cover sm:h-full sm:min-h-0"
                  />
                  <div className="rounded-2xl bg-white p-3 text-[#16202a] sm:p-4">
                    <p className="text-xs font-bold uppercase text-[#ff4d2e]">Combo hôm nay</p>
                    <p className="mt-1 text-xl font-black">₫699K</p>
                    <div className="mt-3 h-2 rounded-full bg-slate-100">
                      <div className="h-full w-3/4 rounded-full bg-[#ff5a2f]" />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Còn 24 suất</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:gap-6">
        {[
          { value: '2M+', label: 'Sản phẩm chọn lọc' },
          { value: '50K+', label: 'Shop đang bán' },
          { value: '4.9★', label: 'Điểm hài lòng' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-lg font-extrabold text-white sm:text-xl">{stat.value}</p>
            <p className="text-xs text-white/50">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
