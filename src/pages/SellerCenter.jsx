import { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import { SellerLayout } from "../components/Seller/SellerLayout";
import { SellerLogin } from "../components/Seller/SellerLogin";
import { SellerRegister } from "../components/Seller/SellerRegister";

const TABS = {
  LOGIN: "login",
  REGISTER: "register",
};

export default function SellerCenter() {
  const [tab, setTab] = useState(TABS.LOGIN);

  return (
    <SellerLayout>
      <div className="seller-auth-heading mb-8 text-center">
        <span className="pill mb-3 border border-white/20 bg-white/10 text-white">
          <Sparkles className="h-3.5 w-3.5 text-brand-accent" />
          Trung tâm người bán
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Bán hàng cùng ShopVN
        </h1>
        <p className="mt-2 text-sm text-white/60 sm:text-base">
          Đăng nhập hoặc mở gian hàng mới — quy trình 3 bước đơn giản
        </p>
      </div>

      <div className="seller-auth-tabs mx-auto mb-6 flex max-w-md rounded-2xl border border-white/10 bg-white/10 p-1 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setTab(TABS.LOGIN)}
          className={cn(
            "seller-auth-tab flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all",
            tab === TABS.LOGIN
              ? "is-active bg-white text-brand-dark shadow-md"
              : "text-white/70 hover:text-white",
          )}
        >
          Đăng nhập
        </button>
        <button
          type="button"
          onClick={() => setTab(TABS.REGISTER)}
          className={cn(
            "seller-auth-tab flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all",
            tab === TABS.REGISTER
              ? "is-active bg-gradient-brand text-white shadow-glow"
              : "text-white/70 hover:text-white",
          )}
        >
          Đăng ký người bán
        </button>
      </div>

      {tab === TABS.LOGIN ? (
        <SellerLogin onSwitchToRegister={() => setTab(TABS.REGISTER)} />
      ) : (
        <SellerRegister onSwitchToLogin={() => setTab(TABS.LOGIN)} />
      )}
    </SellerLayout>
  );
}
