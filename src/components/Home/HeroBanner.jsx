import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { Button } from '../ui/button';

export function HeroBanner() {
  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-dark p-6 sm:p-10 lg:p-12">
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 right-0 h-72 w-72 rounded-full bg-brand-secondary/25 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/2 h-40 w-40 rounded-full bg-brand-accent/20 blur-2xl animate-pulse-soft" />

      <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="pill mb-4 border border-white/20 bg-white/10 text-white backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-brand-accent" />
            Siêu sale cuối tuần
          </span>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Mua sắm{' '}
            <span className="bg-gradient-to-r from-brand-primary via-orange-300 to-brand-secondary bg-clip-text text-transparent">
              cực chất
            </span>
            , giao siêu tốc
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
            Hàng triệu sản phẩm, deal sốc mỗi giờ — trải nghiệm mua bán linh hoạt
            cho người mua, người bán và quản trị viên trên một nền tảng.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" className="shadow-glow">
              Khám phá ngay
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Link to="/seller">
              <Button variant="outline" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                Mở gian hàng
              </Button>
            </Link>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="relative mx-auto h-64 w-64 animate-float">
            <div className="absolute inset-0 rounded-3xl bg-gradient-brand opacity-90 shadow-glow" />
            <div className="absolute inset-4 flex flex-col items-center justify-center rounded-2xl bg-brand-dark/40 text-center backdrop-blur-sm">
              <Zap className="mb-2 h-10 w-10 text-brand-accent" />
              <p className="text-3xl font-extrabold text-white">-50%</p>
              <p className="text-sm font-medium text-white/80">Flash Sale</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:gap-6">
        {[
          { value: '2M+', label: 'Sản phẩm' },
          { value: '50K+', label: 'Gian hàng' },
          { value: '4.9★', label: 'Đánh giá' },
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
