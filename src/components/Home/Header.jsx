import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Store,
  UserCircle,
} from 'lucide-react';
import { Button } from '../ui/button';
import { BuyerAuthModal } from '../Auth/BuyerAuthModal';

export function Header() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        {/* Top bar */}
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-xs text-gray-600 sm:px-6 lg:px-8">
            <Link
              to="/seller"
              className="inline-flex items-center gap-1 font-medium text-gray-700 transition-colors hover:text-shopee"
            >
              <Store className="h-3.5 w-3.5" />
              Kênh Người Bán
            </Link>
            <div className="hidden items-center gap-4 sm:flex">
              <span>Tải ứng dụng</span>
              <span>|</span>
              <span>Kết nối</span>
            </div>
          </div>
        </div>

        {/* Main navbar */}
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {/* Logo + mobile seller link */}
            <div className="flex items-center justify-between sm:justify-start sm:gap-4">
              <Link to="/" className="flex shrink-0 items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-shopee text-white">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold text-shopee">ShopVN</span>
              </Link>
              <Link
                to="/seller"
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 sm:hidden"
              >
                <Store className="h-4 w-4" />
                Người Bán
              </Link>
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                className="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-24 text-sm focus:border-shopee focus:bg-white focus:outline-none focus:ring-2 focus:ring-shopee/20"
              />
              <Button
                type="button"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                Tìm
              </Button>
            </div>

            {/* Auth CTA */}
            <Button
              variant="outline"
              className="shrink-0 border-shopee/30 text-shopee hover:border-shopee hover:bg-shopee-light"
              onClick={() => setAuthOpen(true)}
            >
              <UserCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Đăng nhập / Đăng ký</span>
              <span className="sm:hidden">Đăng nhập</span>
            </Button>
          </div>
        </div>
      </header>

      <BuyerAuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
