import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';

const links = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Kênh Người Bán', to: '/seller' },
];

export function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-[#e5beb6]/25 bg-white/72 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#db3417]/70 to-transparent" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#ffdad3]/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-6 h-64 w-64 rounded-full bg-[#71f8e4]/25 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <BrandLogo />
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-bold text-slate-500 transition-colors hover:text-[#db3417]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 text-center text-xs font-semibold text-slate-500 sm:text-left">
          © {new Date().getFullYear()} ShopVN - Sàn thương mại điện tử C2C thông minh, tiện lợi cho mọi nhà
        </p>
      </div>
    </footer>
  );
}
