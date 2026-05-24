import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-brand-surface bg-mesh-light">
      <header className="bg-gradient-dark shadow-elevated">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">Admin Panel</span>
              <p className="text-xs text-white/50">Quản trị hệ thống</p>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Trang chủ</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
