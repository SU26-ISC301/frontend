import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Heart, LogOut, Search, Store, UserCircle } from 'lucide-react';
import { BrandLogo } from '../layout/BrandLogo';
import { Button } from '../ui/button';
import { BuyerAuthModal } from '../Auth/BuyerAuthModal';
import { authApi } from '../../api/authAPI';
import { getAvatarSrc } from '../../utils/avatar';
import { readViewedCategories } from '../../utils/viewedCategories';

export function Header({ categoryMenuSlot = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [authOpen, setAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [viewedCategories, setViewedCategories] = useState(() => readViewedCategories());
  const [pendingFavoritesNavigation, setPendingFavoritesNavigation] = useState(false);

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
          localStorage.removeItem('buyerAccessToken');
          localStorage.removeItem('buyerRefreshToken');
        });
    }
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const refreshViewedCategories = () => setViewedCategories(readViewedCategories());
    window.addEventListener('storage', refreshViewedCategories);
    window.addEventListener('viewed-categories-changed', refreshViewedCategories);
    return () => {
      window.removeEventListener('storage', refreshViewedCategories);
      window.removeEventListener('viewed-categories-changed', refreshViewedCategories);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchValue(params.get('search') || '');
  }, [location.search]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('buyerAccessToken');
    localStorage.removeItem('buyerRefreshToken');
    localStorage.removeItem('vendorInfo');
    setIsLoggedIn(false);
    setProfile(null);
    window.dispatchEvent(new CustomEvent('buyer-auth-changed', { detail: { loggedIn: false } }));
  };

  const handleAuthenticated = () => {
    setIsLoggedIn(true);
    window.dispatchEvent(new CustomEvent('buyer-auth-changed', { detail: { loggedIn: true } }));
    if (pendingFavoritesNavigation) {
      setPendingFavoritesNavigation(false);
      navigate('/favorites');
    }
    authApi.getMe()
      .then((response) => {
        setProfile(response.data?.data || response.data);
      })
      .catch(() => {
        setProfile(null);
      });
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const query = searchValue.trim();
    setSearchOpen(false);
    navigate(query ? `/?search=${encodeURIComponent(query)}` : '/');
  };

  const selectSuggestion = (category) => {
    setSearchValue(category.name);
    setSearchOpen(false);
    navigate(`/?search=${encodeURIComponent(category.name)}`);
  };

  const openFavorites = () => {
    if (!isLoggedIn) {
      setPendingFavoritesNavigation(true);
      setAuthOpen(true);
      return;
    }
    navigate('/favorites');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
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
              <span className="transition-colors hover:text-white">Tin đăng thật từ shop đã xác minh</span>
            </div>
          </div>
        </div>

        <div className="border-b border-white/80 bg-gradient-to-r from-[#fff3ef]/95 via-white/95 to-[#f2fff9]/95 shadow-[0_14px_40px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <div className="flex items-center justify-between sm:justify-start">
                <BrandLogo />
                <Link
                  to="/seller"
                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 sm:hidden"
                >
                  <Store className="h-3.5 w-3.5" />
                  Bán hàng
                </Link>
              </div>

              {categoryMenuSlot}

              <form className="relative flex-1" onSubmit={submitSearch}>
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  onFocus={() => {
                    setViewedCategories(readViewedCategories());
                    setSearchOpen(true);
                  }}
                  onBlur={() => window.setTimeout(() => setSearchOpen(false), 160)}
                  placeholder="Tìm sản phẩm, thương hiệu, shop..."
                  className="h-11 w-full rounded-full border border-slate-200 bg-white pl-11 pr-24 text-sm shadow-inner shadow-slate-100 outline-none transition-all placeholder:text-slate-400 focus:border-[#ff6b45] focus:ring-4 focus:ring-orange-100"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#ff315c] to-[#ff6b2c] px-5 text-white shadow-md shadow-orange-200/60 hover:from-[#ef244f] hover:to-[#f05a22]"
                >
                  Tìm
                </Button>
                {searchOpen && (
                  <div
                    className="absolute left-0 right-0 top-[calc(100%+0.65rem)] z-50 overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_24px_70px_-28px_rgba(15,23,42,0.55)]"
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    <div className="border-b border-slate-100 px-5 py-4">
                      <p className="text-sm font-extrabold text-slate-950">Gợi ý cho bạn</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Dựa trên các danh mục bạn thường mở xem trong chi tiết sản phẩm.
                      </p>
                    </div>
                    {viewedCategories.length > 0 ? (
                      <div className="grid max-h-[22rem] gap-1 overflow-y-auto p-2 sm:grid-cols-2">
                        {viewedCategories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => selectSuggestion(category)}
                            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-[#fff3ee]"
                          >
                            <span className="flex h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                              {category.image ? (
                                <img src={category.image} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <span className="flex h-full w-full items-center justify-center bg-[#eaf2ff] text-[#1d72e8]">
                                  <Search className="h-5 w-5" />
                                </span>
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="line-clamp-1 text-sm font-extrabold text-slate-800">{category.name}</span>
                              <span className="mt-0.5 block text-xs font-bold text-[#ff5a2f]">
                                Đã xem {category.count} lần
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-5 py-6 text-sm font-semibold text-slate-500">
                        Chưa có danh mục thường xem. Mở vài tin đăng, hệ thống sẽ gợi ý nhanh ở đây.
                      </div>
                    )}
                  </div>
                )}
              </form>

              <div className="hidden items-center gap-1 lg:flex">
                <button
                  type="button"
                  onClick={openFavorites}
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-100 transition-all hover:text-[#ff4d2e] hover:ring-orange-100"
                  title="Yêu thích"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              {isLoggedIn ? (
                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    className="hidden h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-100 transition-colors hover:text-[#ff4d2e] hover:ring-orange-100 sm:flex"
                    title="Thông báo"
                  >
                    <Bell className="h-5 w-5" />
                  </button>
                  <Link
                    to="/buyer"
                    className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-md shadow-slate-200/80 ring-1 ring-slate-100 transition-transform hover:scale-105"
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
                    className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-[#ff4d2e]"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Đăng xuất</span>
                  </button>
                </div>
              ) : (
                <Button
                  className="shrink-0 rounded-full bg-gradient-to-r from-[#ff315c] to-[#ff6b2c] text-white shadow-md shadow-orange-200/70 hover:from-[#ef244f] hover:to-[#f05a22]"
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

      <BuyerAuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuthenticated={handleAuthenticated} />
    </>
  );
}
