import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Store, UserCircle } from 'lucide-react';
import { BrandLogo } from '../layout/BrandLogo';
import { Button } from '../ui/button';
import { BuyerAuthModal } from '../Auth/BuyerAuthModal';

export function Header() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40">
        {/* Top strip */}
        <div className="bg-gradient-dark text-white">
          <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs sm:px-6 lg:px-8">
            <Link
              to="/seller"
              className="inline-flex items-center gap-1.5 font-semibold text-white/90 transition-colors hover:text-brand-accent"
            >
              <Store className="h-3.5 w-3.5" />
              Kênh Người Bán
            </Link>
            <div className="hidden items-center gap-4 text-white/60 sm:flex">
              <span className="transition-colors hover:text-white">Tải app</span>
              <span className="text-white/30">|</span>
              <Link to="/admin" className="transition-colors hover:text-white">
                Quản trị
              </Link>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div className="glass border-b border-gray-200/60">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <div className="flex items-center justify-between sm:justify-start">
                <BrandLogo />
                <Link
                  to="/seller"
                  className="inline-flex items-center gap-1 rounded-full bg-brand-dark px-3 py-1.5 text-xs font-semibold text-white sm:hidden"
                >
                  <Store className="h-3.5 w-3.5" />
                  Bán hàng
                </Link>
              </div>

              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
                <input
                  type="search"
                  placeholder="Tìm sản phẩm, thương hiệu, voucher..."
                  className="input-field h-11 pl-11 pr-24"
                />
                <Button
                  type="button"
                  size="sm"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg"
                >
                  Tìm
                </Button>
              </div>

              <Button
                variant="dark"
                className="shrink-0"
                onClick={() => setAuthOpen(true)}
              >
                <UserCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Đăng nhập</span>
                <span className="sm:hidden">Tài khoản</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <BuyerAuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
