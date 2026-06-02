import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Heart, LogOut, Search, ShoppingCart, Store, TicketPercent, UserCircle } from 'lucide-react';
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
        <div className="bg-[#13252f] text-white">
          <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs sm:px-6 lg:px-8">
            <Link
              to="/seller"
              className="inline-flex items-center gap-1.5 font-semibold text-white/90 transition-colors hover:text-[#5eead4]"
            >
              <Store className="h-3.5 w-3.5" />
              Kênh Người Bán
            </Link>
            <div className="hidden items-center gap-4 text-white/68 sm:flex">
              <span className="transition-colors hover:text-white">Freeship cho đơn từ 99K</span>
              <span className="h-3 w-px bg-white/20" />
              <span className="transition-colors hover:text-white">Tải app nhận voucher</span>
            </div>
          </div>
        </div>

        <div className="border-b border-white/70 bg-white/88 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.6)] backdrop-blur-xl">
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
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Tìm sản phẩm, thương hiệu, voucher..."
                  className="h-11 w-full rounded-full border border-slate-200 bg-white pl-11 pr-24 text-sm shadow-inner shadow-slate-100 outline-none transition-all placeholder:text-slate-400 focus:border-[#ff6a3d] focus:ring-4 focus:ring-[#ff6a3d]/15"
                />
                <Button
                  type="button"
                  size="sm"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-[#ff5a2f] px-5 hover:bg-[#ff6a3d]"
                >
                  Tìm
                </Button>
              </div>

              <div className="hidden items-center gap-1 lg:flex">
                {[
                  { icon: TicketPercent, label: 'Voucher' },
                  { icon: Heart, label: 'Yêu thích' },
                  { icon: ShoppingCart, label: 'Giỏ hàng' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    className="group relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-all hover:bg-[#fff1ed] hover:text-[#ff4d2e]"
                    title={label}
                  >
                    <Icon className="h-5 w-5" />
                    {label === 'Giỏ hàng' && (
                      <span className="absolute right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff4d2e] px-1 text-[10px] font-bold text-white">
                        2
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {isLoggedIn ? (
                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    className="hidden h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-colors hover:bg-[#fff1ed] hover:text-[#ff4d2e] sm:flex"
                    title="Thông báo"
                  >
                    <Bell className="h-5 w-5" />
                  </button>
                  <Link
                    to="/buyer"
                    className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-md shadow-slate-200 transition-transform hover:scale-105"
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
                    className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Đăng xuất</span>
                  </button>
                </div>
              ) : (
                <Button
                  className="shrink-0 rounded-full bg-[#13252f] shadow-md shadow-slate-200 hover:bg-[#203a48]"
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
