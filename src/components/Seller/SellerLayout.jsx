import { Link } from 'react-router-dom';
import { ArrowLeft, Store } from 'lucide-react';

export function SellerLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/seller" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-white">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800">Seller Center</span>
              <p className="text-xs text-gray-500">Quản lý gian hàng</p>
            </div>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-shopee"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Về Kênh Người Mua</span>
            <span className="sm:hidden">Trang mua</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>
    </div>
  );
}
