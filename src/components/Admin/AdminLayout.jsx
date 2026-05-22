import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-slate-900 text-white shadow-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold">Admin Panel</span>
              <p className="text-xs text-slate-300">Quản trị hệ thống</p>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Về trang chủ</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
