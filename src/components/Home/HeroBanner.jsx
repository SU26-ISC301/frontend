import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Gauge,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Zap,
} from "lucide-react";
import { Button } from "../ui/button";

function getDisplayPrice(product) {
  if (!product?.price) return "Liên hệ";
  return `₫${product.price}`;
}

function getProductLabel(product) {
  if (product?.isPromoted) return "Đang quảng bá";
  if (product?.isPremiumHighlighted) return "Tin tiêu biểu";
  return product?.badge || product?.categoryName || "ShopVN";
}

function getFeatureScore(product) {
  return (
    Number(Boolean(product?.isPromoted)) * 100 +
    Number(Boolean(product?.isPremiumHighlighted)) * 80 +
    Number(Boolean(product?.image)) * 30 +
    Number(product?.rating || 0) * 5 +
    Number(String(product?.sold || "0").replace(/\D/g, "") || 0) / 1000
  );
}

function ProductImage({ src, alt, className = "", fit = "cover" }) {
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-slate-100 to-orange-50 text-center text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400 ${className}`}
      >
        Chưa có ảnh sản phẩm
      </div>
    );
  }

  return <img src={src} alt={alt} className={`${fitClass} ${className}`} />;
}

function ProductPill({ product, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(product)}
      className="group flex min-w-0 items-center gap-3 rounded-2xl border border-white/80 bg-white/88 p-2.5 text-left shadow-[0_18px_42px_-32px_rgba(15,23,42,0.65)] backdrop-blur transition hover:-translate-y-1 hover:border-orange-200 hover:bg-white"
    >
      <ProductImage
        src={product.image}
        alt={product.title}
        className="h-16 w-16 shrink-0 rounded-xl bg-white"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#f05a22]">
          {getProductLabel(product)}
        </p>
        <p className="mt-1 line-clamp-1 text-sm font-black text-slate-950">
          {product.title}
        </p>
        <p className="mt-1 text-sm font-black text-[#ff4d2e]">
          {getDisplayPrice(product)}
        </p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#ff4d2e]" />
    </button>
  );
}

export function HeroBanner({
  products = [],
  isLoading = false,
  totalProducts = 0,
}) {
  const navigate = useNavigate();
  const featuredProducts = useMemo(
    () =>
      products
        .filter(Boolean)
        .slice()
        .sort((left, right) => getFeatureScore(right) - getFeatureScore(left)),
    [products]
  );
  const [mainProduct, ...sideProducts] = featuredProducts;

  const openProduct = (product) => {
    if (!product?.id) return;
    navigate(`/products/${product.id}`, {
      state: {
        promotionId: product.isPromoted ? product.promotionId : null,
        promotionStatus: product.isPromoted ? "ACTIVE" : null,
      },
    });
  };

  const scrollToCatalog = () => {
    document
      .getElementById("catalog-products")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="hero-market hero-reveal relative mb-10 overflow-hidden rounded-[2rem] border border-orange-100/80 bg-[linear-gradient(135deg,#ffffff_0%,#fff7f1_48%,#eefdf8_100%)] text-slate-950 shadow-[0_36px_90px_-58px_rgba(15,23,42,0.68)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#ff315c] via-[#ff6b2c] to-[#14b8a6]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.78),rgba(255,255,255,0.28))]" />

      <div className="relative grid min-h-[500px] gap-8 p-5 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10 xl:p-12">
        <div className="flex min-w-0 flex-col justify-between">
          <div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-100 bg-white/90 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#f05a22] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              ShopVN Live Commerce
            </span>
            <h1 className="mt-6 max-w-2xl text-[2.45rem] font-black leading-[1.02] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.65rem]">
              Sàn thương mại điện tử thông minh, tiện lợi cho mọi nhà.
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
              { icon: Gauge, title: "Gợi ý thông minh", text: "Ưu tiên sản phẩm phù hợp" },
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
                className="rounded-2xl border border-white/80 bg-white/72 p-3 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.55)] transition hover:-translate-y-1 hover:bg-white"
              >
                <Icon className="h-5 w-5 text-[#f05a22]" />
                <p className="mt-3 text-sm font-black text-slate-950">{title}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <div className="grid h-full min-h-[440px] gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <button
              type="button"
              onClick={() => openProduct(mainProduct)}
              disabled={!mainProduct}
              className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-[1.75rem] border border-white/90 bg-white text-left shadow-[0_28px_80px_-50px_rgba(15,23,42,0.88)] transition enabled:hover:-translate-y-1 enabled:hover:shadow-[0_38px_90px_-48px_rgba(255,107,44,0.72)]"
            >
              <div className="relative flex min-h-0 flex-1 items-center justify-center bg-gradient-to-br from-slate-50 via-white to-orange-50 p-6">
                {isLoading ? (
                  <div className="h-full min-h-[270px] w-full animate-pulse rounded-3xl bg-slate-100" />
                ) : (
                  <ProductImage
                    src={mainProduct?.image}
                    alt={mainProduct?.title}
                    fit="contain"
                    className="max-h-[315px] w-full transition duration-700 group-enabled:group-hover:scale-[1.035]"
                  />
                )}
                {mainProduct?.isPromoted && (
                  <span className="absolute left-5 top-5 inline-flex items-center gap-1 rounded-full bg-[#ff4d2e] px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-orange-500/25">
                    <Sparkles className="h-3 w-3" />
                    Đang quảng bá
                  </span>
                )}
              </div>

              <div className="border-t border-orange-50 bg-white p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f05a22]">
                  {mainProduct ? getProductLabel(mainProduct) : "Sản phẩm tiêu biểu"}
                </p>
                <p className="mt-2 line-clamp-2 text-2xl font-black leading-tight text-slate-950">
                  {mainProduct?.title ||
                    (isLoading
                      ? "Đang tải sản phẩm thật"
                      : "Chưa có sản phẩm phù hợp")}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-black text-[#ff4d2e]">
                    {mainProduct ? getDisplayPrice(mainProduct) : ""}
                  </span>
                  {mainProduct && (
                    <>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-600">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {mainProduct.rating || "0.0"}
                      </span>
                      <span className="text-sm font-bold text-slate-400">
                        Đã bán {mainProduct.sold || 0}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </button>

            <div className="grid content-start gap-3">
              <div className="rounded-2xl border border-white/80 bg-white/78 p-4 shadow-[0_18px_46px_-36px_rgba(15,23,42,0.55)]">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Sản phẩm nổi bật
                </p>
                <p className="mt-2 text-3xl font-black text-slate-950">
                  {totalProducts || featuredProducts.length || "--"}
                </p>
                <p className="mt-1 text-xs font-bold text-slate-500">
                  Đang hiển thị từ dữ liệu thật
                </p>
              </div>

              {isLoading ? (
                <div className="grid gap-3">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-[86px] animate-pulse rounded-2xl bg-white/70"
                    />
                  ))}
                </div>
              ) : sideProducts.length > 0 ? (
                sideProducts
                  .slice(0, 3)
                  .map((product) => (
                    <ProductPill
                      key={product.id || product.title}
                      product={product}
                      onOpen={openProduct}
                    />
                  ))
              ) : (
                <div className="rounded-2xl border border-dashed border-orange-200 bg-white/70 p-4 text-sm font-bold leading-6 text-slate-500">
                  Khi có thêm sản phẩm quảng bá hoặc tiêu biểu, khu vực này sẽ
                  tự cập nhật.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
