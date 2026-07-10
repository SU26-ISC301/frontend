import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Store,
  Zap,
} from "lucide-react";
import { Button } from "../ui/button";
import heroPoster from "../../assets/shopvn-menu-art.jpg";

export function HeroBanner() {
  const navigate = useNavigate();

  const scrollToCatalog = () => {
    document
      .getElementById("catalog-products")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="hero-market hero-reveal relative mb-10 overflow-hidden rounded-[2rem] border border-orange-100/80 bg-[linear-gradient(135deg,#ffffff_0%,#fff8f4_48%,#f2fffb_100%)] text-slate-950 shadow-[0_36px_90px_-58px_rgba(15,23,42,0.68)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#ff315c] via-[#ff6b2c] to-[#14b8a6]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.78),rgba(255,255,255,0.28))]" />

      <div className="relative grid min-h-[500px] gap-8 p-5 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10 xl:p-12">
        <div className="flex min-w-0 flex-col justify-between">
          <div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-100 bg-white/90 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#f05a22] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              ShopVN C2C Marketplace
            </span>
            <h1 className="mt-6 max-w-2xl text-[2.45rem] font-black leading-[1.02] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.65rem]">
              Sàn thương mại điện tử thông minh, tiện lợi cho mọi nhà
            </h1>
            <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-slate-600">
              Khám phá sản phẩm thật từ các gian hàng đang hoạt động, xem hình
              ảnh rõ ràng, giá minh bạch và vào thẳng bài đăng chỉ với một chạm.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                type="button"
                size="lg"
                onClick={scrollToCatalog}
                className="rounded-2xl px-6 shadow-[0_18px_38px_-22px_rgba(255,77,46,0.85)]"
              >
                Xem sản phẩm
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => navigate("/seller")}
                className="rounded-2xl border-orange-100 bg-white px-6 text-slate-800 shadow-sm hover:border-orange-200 hover:bg-orange-50 hover:text-[#f05a22]"
              >
                <Store className="h-4 w-4" />
                Tạo gian hàng
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: Lightbulb,
                title: "Gợi ý thông minh",
                text: "Ưu tiên sản phẩm phù hợp",
              },
              {
                icon: Zap,
                title: "Thao tác tiện lợi",
                text: "Xem tin, lưu tin, nhắn shop nhanh",
              },
              {
                icon: ShieldCheck,
                title: "Tin đăng rõ ràng",
                text: "Shop và thông tin sản phẩm minh bạch",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/80 bg-white/76 p-3 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.55)] transition hover:-translate-y-1 hover:bg-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-50 text-[#f05a22] ring-1 ring-orange-100">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-black text-slate-950">
                  {title}
                </p>
                <p className="mt-1 text-xs font-bold text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <div className="relative h-full min-h-[440px] overflow-hidden rounded-[1.9rem] border border-white/90 bg-white p-3 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.82)]">
            <div className="pointer-events-none absolute -left-12 top-16 h-32 w-32 rounded-full bg-[#ff6b2c]/18 blur-3xl" />
            <div className="pointer-events-none absolute -right-14 bottom-10 h-40 w-40 rounded-full bg-[#14b8a6]/18 blur-3xl" />
            <div className="group relative h-full min-h-[416px] overflow-hidden rounded-[1.55rem] bg-slate-950">
              <img
                src={heroPoster}
                alt="Không gian mua sắm công nghệ thông minh"
                className="absolute inset-0 h-full w-full object-cover transition duration-[1400ms] ease-out group-hover:scale-[1.045]"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.26),transparent_26%),linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.14)_45%,rgba(15,23,42,0.72)_100%)]" />
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/22 bg-white/14 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-slate-950/10 backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5 text-[#ffcf8a]" />
                Không gian mua sắm thông minh
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="max-w-md text-3xl font-black leading-tight">
                  Thông minh trong từng lựa chọn, thân thiện trong từng trải
                  nghiệm.
                </p>
                <p className="mt-3 max-w-sm text-sm font-semibold leading-6 text-white/76">
                  Một không gian mua bán hiện đại.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
