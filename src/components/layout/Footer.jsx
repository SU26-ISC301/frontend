import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';

const links = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Kênh Người Bán', to: '/seller' },
  { label: 'Admin', to: '/admin' },
];

export function Footer() {
  return (
    <footer className="relative mt-16 border-t border-gray-200/80 bg-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-brand opacity-60" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <BrandLogo />
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-brand-muted transition-colors hover:text-brand-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 text-center text-xs text-brand-muted sm:text-left">
          © {new Date().getFullYear()} ShopVN — Nền tảng thương mại điện tử đa kênh
        </p>
      </div>
    </footer>
  );
}
