import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Store, UserCircle, LogOut } from 'lucide-react';
import { BrandLogo } from '../layout/BrandLogo';
import { Button } from '../ui/button';
import { BuyerAuthModal } from '../Auth/BuyerAuthModal';
import { authApi } from '../../api/authAPI';
import { getAvatarSrc } from '../../utils/avatar';

export function Header() {
  const [authOpen, setAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
      authApi.getMe()
        .then((response) => {
          if (!mounted) return;
          setProfile(response.data?.data || response.data);
        })
        .catch(() => {
          if (!mounted) return;
          setIsLoggedIn(false);
          setProfile(null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        });
    }
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('vendorInfo');
    setIsLoggedIn(false);
    setProfile(null);
    window.location.reload(); // Tải lại trang
  };

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

              {/* 5. PHẦN RENDER NÚT HIỂN THỊ */}
              {isLoggedIn ? (
                /* NẾU ĐÃ LOGIN -> Hiện Avatar + Nút Đăng xuất */
                <div className="flex items-center gap-4 shrink-0">
                  <Link
                    to="/buyer"
                    className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center shadow-sm transition-transform hover:scale-105"
                    title="Tài khoản của tôi"
                  >
                    <img
                      src={getAvatarSrc(profile?.avatarUrl)}
                      alt={profile?.fullName || 'Tài khoản'}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Đăng xuất</span>
                  </button>
                </div>
              ) : (
                /* NẾU CHƯA LOGIN -> Hiện nút Đăng nhập như cũ */
                <Button
                  variant="dark"
                  className="shrink-0"
                  onClick={() => setAuthOpen(true)}
                >
                  <UserCircle className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Đăng nhập</span>
                  <span className="sm:hidden">Tài khoản</span>
                </Button>
              )}

            </div>
          </div>
        </div>
      </header>

      <BuyerAuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
