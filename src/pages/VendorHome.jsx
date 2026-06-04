import { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  Bell,
  Boxes,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Coins,
  CreditCard,
  Download,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  PackageCheck,
  PackageSearch,
  PenLine,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  TicketPercent,
  TrendingUp,
  Truck,
  Upload,
  Users,
  WalletCards,
  Warehouse,
  X,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { vendorMessageApi } from '../api/vendorMessageAPI';

const navItems = [
  { slug: 'trangchu', label: 'Tổng quan', icon: LayoutDashboard },
  { slug: 'don-hang', label: 'Đơn hàng', icon: ShoppingBag, badge: '12' },
  { slug: 'san-pham', label: 'Sản phẩm', icon: PackageSearch },
  { slug: 'van-chuyen', label: 'Vận chuyển', icon: Truck },
  { slug: 'kho-hang', label: 'Kho hàng', icon: Warehouse },
  { slug: 'tin-nhan', label: 'Tin nhắn', icon: MessageSquareText },
  { slug: 'marketing', label: 'Marketing', icon: TicketPercent },
  { slug: 'tai-chinh', label: 'Tài chính', icon: WalletCards },
  { slug: 'cai-dat-shop', label: 'Cài đặt shop', icon: Settings },
];

const pageTitles = {
  trangchu: ['Tổng quan cửa hàng', 'Theo dõi hiệu suất kinh doanh và các công việc cần xử lý hôm nay.'],
  'don-hang': ['Quản lý đơn hàng', 'Kiểm soát đơn mới, tiến độ xử lý và trải nghiệm giao nhận.'],
  'san-pham': ['Kho sản phẩm', 'Theo dõi tồn kho, chất lượng nội dung và hiệu suất bán hàng.'],
  'van-chuyen': ['Vận chuyển', 'Quản lý lịch bàn giao và hiệu suất của đối tác vận chuyển.'],
  'kho-hang': ['Quản lý Kho vận', 'Thiết lập địa chỉ lấy hàng và trả hàng của Shop.'],
  'tin-nhan': ['Tin nhắn khách hàng', 'Phản hồi nhanh để duy trì điểm chăm sóc khách hàng của shop.'],
  marketing: ['Marketing', 'Theo dõi chiến dịch và tối ưu doanh thu từ các hoạt động quảng bá.'],
  'tai-chinh': ['Tài chính', 'Kiểm soát dòng tiền, đối soát và tài khoản nhận thanh toán.'],
  'cai-dat-shop': ['Cài đặt shop', 'Cập nhật hồ sơ, bảo mật và cấu hình vận hành cửa hàng.'],
};

const orders = [
  { id: 'SPV-10291', buyer: 'Minh Anh', item: 'Áo khoác chống nắng UV', total: 389000, status: 'Chờ xác nhận', channel: 'TikTok Live', time: '09:28' },
  { id: 'SPV-10290', buyer: 'Gia Hân', item: 'Set son tint 3 màu', total: 259000, status: 'Đang xử lý', channel: 'ShopVN Mall', time: '09:12' },
  { id: 'SPV-10289', buyer: 'Hoàng Nam', item: 'Tai nghe bluetooth mini', total: 499000, status: 'Đang giao', channel: 'Web ShopVN', time: '08:44' },
  { id: 'SPV-10288', buyer: 'Thanh Vy', item: 'Bình giữ nhiệt 750ml', total: 189000, status: 'Hoàn tất', channel: 'Flash Sale', time: '08:02' },
  { id: 'SPV-10287', buyer: 'Bảo Trân', item: 'Máy xay sinh tố mini', total: 329000, status: 'Đang xử lý', channel: 'Web ShopVN', time: '07:54' },
  { id: 'SPV-10286', buyer: 'Tuấn Kiệt', item: 'Kem chống nắng SPF50+', total: 438000, status: 'Chờ xác nhận', channel: 'ShopVN Mall', time: '07:41' },
  { id: 'SPV-10285', buyer: 'Hà My', item: 'Túi tote canvas basic', total: 149000, status: 'Trả hàng', channel: 'TikTok Live', time: '07:26' },
  { id: 'SPV-10284', buyer: 'Đức Anh', item: 'Bàn phím cơ không dây', total: 899000, status: 'Hoàn tất', channel: 'Web ShopVN', time: '07:10' },
];

const products = [
  { name: 'Áo khoác chống nắng UV', sku: 'AK-UV-021', category: 'Thời trang', stock: 12, sold: 428, price: 389000, status: 'Đang bán', quality: 92 },
  { name: 'Set son tint 3 màu', sku: 'SON-T3-118', category: 'Làm đẹp', stock: 86, sold: 312, price: 259000, status: 'Đang bán', quality: 96 },
  { name: 'Tai nghe bluetooth mini', sku: 'AUDIO-MINI-09', category: 'Điện tử', stock: 24, sold: 205, price: 499000, status: 'Đang bán', quality: 88 },
  { name: 'Bình giữ nhiệt 750ml', sku: 'BN-750-4C', category: 'Gia dụng', stock: 7, sold: 188, price: 189000, status: 'Tồn thấp', quality: 90 },
  { name: 'Máy xay sinh tố mini', sku: 'BLD-MINI-11', category: 'Gia dụng', stock: 42, sold: 176, price: 329000, status: 'Đang bán', quality: 86 },
  { name: 'Kem chống nắng SPF50+', sku: 'SKIN-SPF-50', category: 'Làm đẹp', stock: 68, sold: 164, price: 219000, status: 'Đang bán', quality: 94 },
  { name: 'Bàn phím cơ không dây', sku: 'KEY-WL-87', category: 'Điện tử', stock: 5, sold: 128, price: 899000, status: 'Tồn thấp', quality: 84 },
  { name: 'Túi tote canvas basic', sku: 'BAG-TOTE-04', category: 'Thời trang', stock: 0, sold: 121, price: 149000, status: 'Tạm ẩn', quality: 89 },
];

const shipments = [
  { id: 'GHN-78422', order: 'SPV-10289', carrier: 'GHN Express', deadline: '15:00 hôm nay', status: 'Chờ bàn giao' },
  { id: 'SPX-48110', order: 'SPV-10288', carrier: 'SPX Express', deadline: 'Đang giao', status: 'Trên đường giao' },
  { id: 'GHTK-33918', order: 'SPV-10283', carrier: 'GHTK', deadline: '11:30 hôm nay', status: 'Cần in nhãn' },
  { id: 'VTP-55608', order: 'SPV-10280', carrier: 'Viettel Post', deadline: '16:30 hôm nay', status: 'Đã lên lịch' },
];

const campaigns = [
  { name: 'Flash Sale 20H', metric: '26 sản phẩm', progress: 72, budget: '2.500.000đ', revenue: '18.420.000đ' },
  { name: 'Voucher theo dõi shop', metric: '1.248 lượt dùng', progress: 58, budget: '1.200.000đ', revenue: '9.680.000đ' },
  { name: 'Livestream cuối tuần', metric: '18:30 hôm nay', progress: 36, budget: '800.000đ', revenue: '6.240.000đ' },
];

const mockWarehouses = [
  {
    id: 1,
    type: 'PICKUP',
    name: 'Kho Lấy Hàng Trung Tâm (HCM)',
    contact: 'Nguyễn Văn A',
    phone: '0901234567',
    address: '123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    isDefault: true,
    status: 'Đang hoạt động',
  },
  {
    id: 2,
    type: 'RETURN',
    name: 'Kho Trả Hàng (HN)',
    contact: 'Trần Thị B',
    phone: '0987654321',
    address: '456 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
    isDefault: true,
    status: 'Đang hoạt động',
  },
];

const salesTrend = Array.from({ length: 30 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - index));
  const weekdayFactor = [0.82, 0.92, 1.01, 1.06, 1.08, 1.24, 1.18][date.getDay()];
  const campaignBoost = index > 20 && index < 25 ? 1.15 : 1;
  const revenue = Math.round((12.6 + Math.sin(index / 2.9) * 2.5 + index * 0.17) * weekdayFactor * campaignBoost * 10) / 10;
  return {
    date,
    label: new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(date),
    revenue,
    orders: Math.round(revenue * 8.7),
  };
});

const sellerNotifications = [
  ['12 đơn mới cần xác nhận', 'Ưu tiên xử lý trước 11:00 để giữ SLA.', 'orange'],
  ['4 sản phẩm sắp hết hàng', 'Cập nhật tồn kho để không bỏ lỡ doanh thu.', 'red'],
  ['Flash Sale đạt 72% ngân sách', 'Chiến dịch đang mang về ROAS 5,8x.', 'teal'],
];

function getVendorInfo() {
  try {
    return JSON.parse(localStorage.getItem('vendorInfo') || '{}');
  } catch {
    return {};
  }
}

function formatCurrency(value) {
  return `${new Intl.NumberFormat('vi-VN').format(value)}đ`;
}

function getTodayLabel() {
  return new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
}

function getApiMessage(error) {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Không thể tải dữ liệu';
}

function getInitials(name = 'Khách hàng') {
  return name.split(' ').filter(Boolean).slice(-2).map((part) => part[0]).join('').toUpperCase();
}

function formatChatTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  return new Intl.DateTimeFormat('vi-VN', sameDay
    ? { hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: '2-digit' }).format(date);
}

function downloadCsv(filename, columns, rows) {
  const content = [columns, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function StatusBadge({ children, status, className }) {
  const tone = {
    'Đang bán': 'is-green',
    'Hoàn tất': 'is-green',
    'Đang hoạt động': 'is-green',
    'Đã xác minh': 'is-green',
    'Đang chạy': 'is-green',
    'Đang giao': 'is-blue',
    'Trên đường giao': 'is-blue',
    'Đã lên lịch': 'is-blue',
    'Đang xử lý': 'is-orange',
    'Chờ xác nhận': 'is-orange',
    'Chờ bàn giao': 'is-orange',
    'Cần in nhãn': 'is-orange',
    'Tồn thấp': 'is-red',
    'Trả hàng': 'is-red',
    'Tạm ẩn': 'is-gray',
    'Dự phòng': 'is-gray',
  }[status || children] || 'is-gray';
  return <span className={cn('vendor-status', tone, className)}>{children || status}</span>;
}

function VendorToast({ toast, onClose }) {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 3500);
    return () => window.clearTimeout(timeout);
  }, [onClose, toast]);

  return (
    <div className="vendor-toast fixed bottom-5 right-5 z-[70] flex max-w-sm items-start gap-3 rounded-xl border border-orange-100 bg-white p-4 shadow-xl shadow-orange-950/10">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
        <CheckCircle2 className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-extrabold text-stone-800">{toast.title}</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-stone-500">{toast.message}</p>
      </div>
      <button type="button" aria-label="Đóng thông báo" onClick={onClose} className="text-stone-400 hover:text-stone-700"><X className="h-4 w-4" /></button>
    </div>
  );
}

function VendorLayout({ activeSlug, children, onToast }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const vendorInfo = getVendorInfo();
  const navigate = useNavigate();
  const [title, subtitle] = pageTitles[activeSlug] || pageTitles.trangchu;
  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return [
      ...navItems.map((item) => ({ slug: item.slug, title: item.label, meta: 'Chức năng seller', icon: item.icon })),
      ...products.map((product) => ({ slug: 'san-pham', title: product.name, meta: product.sku, icon: Boxes })),
      ...orders.map((order) => ({ slug: 'don-hang', title: order.id, meta: order.buyer, icon: ShoppingBag })),
    ].filter((item) => `${item.title} ${item.meta}`.toLowerCase().includes(normalized)).slice(0, 5);
  }, [query]);

  useEffect(() => {
    setMobileOpen(false);
    setNotificationsOpen(false);
    setQuery('');
  }, [activeSlug]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('vendorInfo');
    navigate('/seller');
  };

  const navigateTo = (slug) => {
    navigate(`/vendor/${slug}`);
    setQuery('');
  };

  return (
    <div className="vendor-app min-h-screen">
      {mobileOpen && <button type="button" aria-label="Đóng menu" className="fixed inset-0 z-40 bg-stone-950/45 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={cn('vendor-sidebar fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform lg:translate-x-0', mobileOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-[72px] items-center gap-3 border-b border-white/10 px-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-950/20"><Store className="h-5 w-5" /></span>
          <div className="min-w-0">
            <p className="text-base font-extrabold tracking-tight text-white">Seller Studio</p>
            <p className="truncate text-xs font-semibold text-emerald-100/65">{vendorInfo.shopName || 'ShopVN Seller'}</p>
          </div>
          <button type="button" aria-label="Đóng menu" className="ml-auto text-emerald-100/60 lg:hidden" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <nav className="scrollbar-hide flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navItems.map(({ slug, label, icon: Icon, badge }) => (
            <NavLink key={slug} to={`/vendor/${slug}`} className={({ isActive }) => cn('vendor-nav-item', isActive && 'is-active')}>
              <Icon className="h-[18px] w-[18px]" />
              <span>{label}</span>
              {badge && <span className="ml-auto rounded-full bg-orange-400 px-2 py-0.5 text-[10px] font-extrabold text-stone-950">{badge}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="p-3">
          <div className="mb-2 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-400/20 text-xs font-extrabold text-orange-100">SS</span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white">{vendorInfo.shopName || 'ShopVN Seller'}</p>
                <p className="truncate text-[11px] font-medium text-emerald-100/55">Đang hoạt động</p>
              </div>
            </div>
          </div>
          <button type="button" className="vendor-nav-item w-full" onClick={() => navigate('/')}><ShoppingBag className="h-[18px] w-[18px]" />Về trang mua hàng</button>
          <button type="button" className="vendor-nav-item w-full text-red-200 hover:text-white" onClick={handleLogout}><LogOut className="h-[18px] w-[18px]" />Đăng xuất</button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="vendor-topbar sticky top-0 z-30 flex h-[72px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button type="button" aria-label="Mở menu" className="vendor-icon-button lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="relative max-w-xl flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setNotificationsOpen(false)} className="vendor-input h-10 w-full pl-10 pr-4 text-sm" placeholder="Tìm đơn hàng, SKU hoặc chức năng..." />
            {query && (
              <div className="vendor-dropdown absolute inset-x-0 top-12 overflow-hidden p-1">
                {searchResults.length > 0 ? searchResults.map(({ slug, title: resultTitle, meta, icon: Icon }) => (
                  <button key={`${slug}-${resultTitle}`} type="button" className="vendor-dropdown-item" onClick={() => navigateTo(slug)}>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600"><Icon className="h-4 w-4" /></span>
                    <span className="min-w-0 text-left"><span className="block truncate text-sm font-bold text-stone-700">{resultTitle}</span><span className="block truncate text-xs font-semibold text-stone-400">{meta}</span></span>
                  </button>
                )) : <p className="px-3 py-4 text-center text-xs font-semibold text-stone-400">Không tìm thấy kết quả phù hợp.</p>}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <div className="relative">
              <button type="button" aria-label="Thông báo" className="vendor-icon-button relative" onClick={() => { setQuery(''); setNotificationsOpen((current) => !current); }}>
                <Bell className="h-5 w-5" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-orange-500" />
              </button>
              {notificationsOpen && (
                <div className="vendor-dropdown absolute right-0 top-12 w-80 p-2">
                  <div className="flex items-center justify-between px-2 py-2"><p className="text-sm font-extrabold text-stone-900">Thông báo cửa hàng</p><span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-extrabold text-orange-700">3 mới</span></div>
                  {sellerNotifications.map(([notificationTitle, message, tone]) => (
                    <button key={notificationTitle} type="button" className="vendor-dropdown-item">
                      <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', tone === 'orange' ? 'bg-orange-400' : tone === 'red' ? 'bg-red-500' : 'bg-teal-500')} />
                      <span className="text-left"><span className="block text-xs font-extrabold text-stone-700">{notificationTitle}</span><span className="mt-1 block text-[11px] font-medium leading-4 text-stone-400">{message}</span></span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" aria-label="Trợ giúp" className="vendor-icon-button hidden sm:inline-flex"><CircleHelp className="h-5 w-5" /></button>
            <button type="button" className="vendor-primary-button hidden sm:inline-flex" onClick={() => navigate('/vendor/products/add')}><Plus className="h-4 w-4" />Thêm sản phẩm</button>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-teal-700">{getTodayLabel()}</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-stone-950 sm:text-3xl">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm font-medium text-stone-500">{subtitle}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

function Panel({ className, children }) {
  return <section className={cn('vendor-panel', className)}>{children}</section>;
}

function PanelHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div><h2 className="text-base font-extrabold text-stone-900">{title}</h2>{subtitle && <p className="mt-1 text-xs font-semibold text-stone-400">{subtitle}</p>}</div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

function StatCard({ stat, onClick }) {
  const Icon = stat.icon;
  return (
    <button type="button" onClick={onClick} className="vendor-panel vendor-stat-card group w-full p-5 text-left">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-xs font-extrabold uppercase tracking-[0.08em] text-stone-400">{stat.label}</p><p className="mt-3 text-2xl font-extrabold tracking-tight text-stone-950">{stat.value}</p></div>
        <span className={cn('vendor-stat-icon', stat.tone)}><Icon className="h-5 w-5" /></span>
      </div>
      <p className="mt-4 text-xs font-semibold text-stone-400"><span className="mr-1.5 font-extrabold text-teal-700">{stat.change}</span>{stat.note}</p>
      {onClick && <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-extrabold text-orange-600 opacity-0 transition-opacity group-hover:opacity-100">Xem chi tiết <ArrowUpRight className="h-3 w-3" /></span>}
    </button>
  );
}

function OverviewPage({ navigateTo, onToast }) {
  const [range, setRange] = useState(7);
  const trend = salesTrend.slice(-range);
  const latest = trend.at(-1);
  const previous = trend.at(-2);
  const change = ((latest.revenue - previous.revenue) / previous.revenue) * 100;
  const stats = [
    { label: 'Doanh thu hôm nay', value: `${latest.revenue.toFixed(1).replace('.', ',')} triệu`, change: `${change >= 0 ? '+' : ''}${change.toFixed(1).replace('.', ',')}%`, note: 'so với hôm qua', icon: Coins, tone: 'is-orange', target: 'tai-chinh' },
    { label: 'Đơn chờ xử lý', value: '34', change: '12 đơn', note: 'cần xác nhận trước 11:00', icon: PackageCheck, tone: 'is-teal', target: 'don-hang' },
    { label: 'Tỷ lệ chuyển đổi', value: '7,8%', change: '+1,2%', note: 'so với tuần trước', icon: TrendingUp, tone: 'is-green', target: 'marketing' },
    { label: 'Đánh giá shop', value: '4,8 / 5', change: '2.431', note: 'đánh giá đã xác minh', icon: Star, tone: 'is-yellow', target: 'cai-dat-shop' },
  ];

  const exportRevenue = () => {
    downloadCsv('seller-revenue.csv', ['Ngày', 'Doanh thu (triệu)', 'Số đơn'], trend.map((item) => [item.label, item.revenue, item.orders]));
    onToast({ title: 'Đã tải báo cáo', message: `Doanh thu ${range} ngày đã được xuất thành file CSV.` });
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <StatCard key={stat.label} stat={stat} onClick={() => navigateTo(stat.target)} />)}
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.65fr_0.85fr]">
        <Panel className="min-w-0 p-5">
          <PanelHeader title="Xu hướng doanh thu" subtitle={`Doanh thu và số đơn trong ${range} ngày gần nhất`}>
            {[7, 14, 30].map((period) => <button key={period} type="button" className={cn('vendor-tab', range === period && 'is-active')} onClick={() => setRange(period)}>{period} ngày</button>)}
            <button type="button" aria-label="Xuất báo cáo" className="vendor-icon-button" onClick={exportRevenue}><Download className="h-4 w-4" /></button>
          </PanelHeader>
          <VendorRevenueChart data={trend} />
        </Panel>
        <Panel className="p-5">
          <PanelHeader title="Việc cần làm" subtitle="Ưu tiên để duy trì hiệu suất shop" />
          <div className="mt-4 space-y-2.5">
            {[
              ['Xác nhận đơn mới', '12 đơn', PackageCheck, 'don-hang'],
              ['Trả lời chat khách hàng', '3 tin', MessageSquareText, 'tin-nhan'],
              ['Cập nhật tồn kho thấp', '4 SKU', Boxes, 'san-pham'],
              ['Tối ưu Flash Sale 20H', '72%', TicketPercent, 'marketing'],
            ].map(([label, value, Icon, target]) => (
              <button key={label} type="button" className="vendor-task" onClick={() => navigateTo(target)}>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600"><Icon className="h-4 w-4" /></span>
                <span className="min-w-0 flex-1 text-left text-sm font-bold text-stone-700">{label}</span>
                <span className="text-xs font-extrabold text-stone-500">{value}</span><ChevronRight className="h-4 w-4 text-stone-300" />
              </button>
            ))}
          </div>
        </Panel>
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel className="overflow-hidden">
          <div className="p-5"><PanelHeader title="Đơn hàng cần xử lý" subtitle="Cập nhật theo thời gian thực"><button type="button" className="vendor-link-button" onClick={() => navigateTo('don-hang')}>Xem tất cả <ChevronRight className="h-4 w-4" /></button></PanelHeader></div>
          <OrderTable rows={orders.slice(0, 4)} compact />
        </Panel>
        <Panel className="p-5">
          <PanelHeader title="Hiệu suất cửa hàng" subtitle="Mục tiêu vận hành trong tuần" />
          <div className="mt-5 space-y-4">
            <ProgressItem label="Phản hồi chat dưới 5 phút" value="94%" percent={94} />
            <ProgressItem label="Giao hàng đúng hạn" value="96,2%" percent={96.2} />
            <ProgressItem label="Tỷ lệ hủy đơn" value="1,4%" percent={82} />
            <ProgressItem label="Chất lượng nội dung" value="89/100" percent={89} />
          </div>
        </Panel>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <InsightCard title="Khách hàng quay lại" icon={Users} value="31%" label="Tăng 4,2% trong tuần" text="Tệp khách trung thành đang đóng góp 38% doanh thu." tone="is-teal" />
        <InsightCard title="Giao đúng hạn" icon={Truck} value="96,2%" label="3 đơn cần bàn giao sớm" text="Lịch bàn giao gần nhất là 11:30 với GHTK." tone="is-green" />
        <InsightCard title="Sức khỏe shop" icon={BadgeCheck} value="Tốt" label="Không có vi phạm mới" text="Duy trì tồn kho và tốc độ chat để tăng điểm shop." tone="is-yellow" />
      </section>
    </div>
  );
}

function VendorRevenueChart({ data }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const width = 760;
  const height = 230;
  const max = Math.ceil(Math.max(...data.map((item) => item.revenue)) / 5) * 5;
  const points = data.map((item, index) => ({ ...item, x: (index / (data.length - 1)) * width, y: height - (item.revenue / max) * height }));
  const line = points.map((point, index) => `${index ? 'L' : 'M'}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;
  const hovered = hoverIndex === null ? null : points[hoverIndex];
  const ticks = [0, Math.round((data.length - 1) * 0.25), Math.round((data.length - 1) * 0.5), Math.round((data.length - 1) * 0.75), data.length - 1];
  const onMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setHoverIndex(Math.max(0, Math.min(data.length - 1, Math.round(((event.clientX - bounds.left) / bounds.width) * (data.length - 1)))));
  };

  return (
    <div className="mt-5 grid grid-cols-[34px_1fr] gap-3">
      <div className="flex h-64 flex-col justify-between pb-6 text-[10px] font-bold text-stone-400">{[1, 0.75, 0.5, 0.25].map((ratio) => <span key={ratio}>{max * ratio}tr</span>)}<span>0</span></div>
      <div className="relative h-64">
        <div className="absolute inset-x-0 top-0 flex h-[calc(100%-24px)] flex-col justify-between">{[0, 1, 2, 3, 4].map((lineIndex) => <span key={lineIndex} className="block border-t border-dashed border-stone-200" />)}</div>
        <svg className="absolute inset-x-0 top-0 h-[calc(100%-24px)] w-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-label={`Biểu đồ doanh thu ${data.length} ngày`} onMouseMove={onMove} onMouseLeave={() => setHoverIndex(null)}>
          <defs><linearGradient id="seller-chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#f97316" stopOpacity="0.24" /><stop offset="100%" stopColor="#f97316" stopOpacity="0" /></linearGradient></defs>
          <path d={area} fill="url(#seller-chart-fill)" /><path d={line} fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          {hovered && <><line x1={hovered.x} x2={hovered.x} y1="0" y2={height} stroke="#fdba74" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" /><circle cx={hovered.x} cy={hovered.y} r="6" fill="#fff" stroke="#f97316" strokeWidth="4" vectorEffect="non-scaling-stroke" /></>}
        </svg>
        {hovered && <div className="vendor-chart-tooltip pointer-events-none absolute" style={{ left: `${(hovered.x / width) * 100}%`, top: `${Math.max(4, (hovered.y / height) * 88)}%` }}><p className="text-[10px] font-bold text-stone-400">{hovered.label}</p><p className="mt-1 text-sm font-extrabold text-stone-900">{hovered.revenue.toFixed(1).replace('.', ',')} triệu</p><p className="mt-1 text-[10px] font-semibold text-stone-500">{hovered.orders} đơn hàng</p></div>}
        <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] font-bold text-stone-400">{ticks.map((index) => <span key={`${data.length}-${index}`}>{data[index].label}</span>)}</div>
      </div>
    </div>
  );
}

function ProgressItem({ label, value, percent }) {
  return <div><div className="mb-2 flex items-center justify-between gap-3 text-xs"><p className="font-bold text-stone-500">{label}</p><p className="font-extrabold text-stone-800">{value}</p></div><div className="h-2 overflow-hidden rounded-full bg-stone-100"><div className="vendor-progress h-full rounded-full bg-teal-600" style={{ width: `${percent}%` }} /></div></div>;
}

function InsightCard({ title, icon: Icon, value, label, text, tone }) {
  return <Panel className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-extrabold text-stone-700">{title}</p><p className="mt-3 text-2xl font-extrabold text-stone-950">{value}</p></div><span className={cn('vendor-stat-icon', tone)}><Icon className="h-5 w-5" /></span></div><p className="mt-2 text-xs font-bold text-teal-700">{label}</p><p className="mt-4 text-xs font-semibold leading-5 text-stone-400">{text}</p></Panel>;
}

function OrderTable({ rows, compact = false }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="vendor-table-head"><tr>{['Mã đơn', 'Khách hàng', 'Sản phẩm', 'Giá trị', 'Trạng thái', 'Kênh'].map((column) => <th key={column} className="px-5 py-3.5">{column}</th>)}</tr></thead>
        <tbody className="divide-y divide-stone-100">{rows.map((order) => <tr key={order.id} className="vendor-table-row"><td className="px-5 py-4 font-extrabold text-stone-800">{order.id}<p className="mt-1 text-[11px] font-semibold text-stone-400">{order.time}</p></td><td className="px-5 py-4 font-bold text-stone-600">{order.buyer}</td><td className="px-5 py-4 font-semibold text-stone-500">{order.item}</td><td className="px-5 py-4 font-extrabold text-stone-700">{formatCurrency(order.total)}</td><td className="px-5 py-4"><StatusBadge status={order.status} /></td><td className="px-5 py-4 font-semibold text-stone-500">{order.channel}</td></tr>)}</tbody>
      </table>
      {!compact && rows.length === 0 && <EmptyState />}
    </div>
  );
}

function Toolbar({ query, onQueryChange, onReset, placeholder, children, onExport }) {
  return <div className="flex flex-col gap-2 lg:flex-row lg:items-center"><div className="relative min-w-0 lg:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" /><input value={query} onChange={(event) => onQueryChange(event.target.value)} className="vendor-input h-10 w-full pl-9 pr-3 text-sm" placeholder={placeholder} /></div>{children}<button type="button" className="vendor-secondary-button justify-center" onClick={onReset}><RefreshCw className="h-4 w-4" />Đặt lại</button>{onExport && <button type="button" className="vendor-secondary-button justify-center" onClick={onExport}><Download className="h-4 w-4" />Xuất file</button>}</div>;
}

function SelectFilter({ value, onChange, placeholder, options }) {
  return <label className="relative"><select value={value} onChange={(event) => onChange(event.target.value)} className="vendor-input h-10 min-w-40 appearance-none px-3 pr-9 text-sm font-semibold"><option value="">{placeholder}</option>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" /></label>;
}

function Pagination({ count, page, pageSize, onPageChange }) {
  const pages = Math.max(1, Math.ceil(count / pageSize));
  return <div className="flex flex-col gap-3 border-t border-stone-100 bg-stone-50/65 px-5 py-3 text-xs font-semibold text-stone-500 sm:flex-row sm:items-center sm:justify-between"><p>Hiển thị {count ? (page - 1) * pageSize + 1 : 0} đến {Math.min(page * pageSize, count)} trong {count} kết quả</p><div className="flex gap-1"><button type="button" className="vendor-page-button" disabled={page === 1} onClick={() => onPageChange(page - 1)}>‹</button>{Array.from({ length: pages }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} type="button" className={cn('vendor-page-button', page === pageNumber && 'is-active')} onClick={() => onPageChange(pageNumber)}>{pageNumber}</button>)}<button type="button" className="vendor-page-button" disabled={page === pages} onClick={() => onPageChange(page + 1)}>›</button></div></div>;
}

function EmptyState() {
  return <div className="px-5 py-12 text-center"><PackageSearch className="mx-auto h-8 w-8 text-stone-300" /><p className="mt-3 text-sm font-extrabold text-stone-700">Không có dữ liệu phù hợp</p><p className="mt-1 text-xs font-semibold text-stone-400">Thử thay đổi từ khóa hoặc đặt lại bộ lọc.</p></div>;
}

function OrdersPage({ onToast }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const filtered = orders.filter((order) => `${order.id} ${order.buyer} ${order.item}`.toLowerCase().includes(query.toLowerCase()) && (!status || order.status === status));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  return <div className="space-y-5"><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
    ['Đơn mới', '34', '12 cần xác nhận', ShoppingBag, 'is-orange'], ['Đang giao', '128', '96,2% đúng hạn', Truck, 'is-teal'], ['Hoàn tất hôm nay', '216', '+18% hôm qua', CheckCircle2, 'is-green'], ['Cần xử lý', '5', '2 yêu cầu trả hàng', Clock3, 'is-red'],
  ].map(([label, value, change, icon, tone]) => <StatCard key={label} stat={{ label, value, change, note: '', icon, tone }} />)}</section><Panel className="overflow-hidden"><div className="p-5"><PanelHeader title="Danh sách đơn hàng" subtitle="Theo dõi và cập nhật trạng thái xử lý"><Toolbar query={query} onQueryChange={(value) => { setQuery(value); setPage(1); }} onReset={() => { setQuery(''); setStatus(''); setPage(1); }} placeholder="Tìm mã đơn, khách hàng..." onExport={() => { downloadCsv('seller-orders.csv', ['Mã đơn', 'Khách hàng', 'Sản phẩm', 'Giá trị', 'Trạng thái'], filtered.map((order) => [order.id, order.buyer, order.item, formatCurrency(order.total), order.status])); onToast({ title: 'Đã xuất đơn hàng', message: `${filtered.length} đơn hàng đã được tải xuống.` }); }}><SelectFilter value={status} onChange={(value) => { setStatus(value); setPage(1); }} placeholder="Tất cả trạng thái" options={['Chờ xác nhận', 'Đang xử lý', 'Đang giao', 'Hoàn tất', 'Trả hàng']} /></Toolbar></PanelHeader></div><OrderTable rows={visible} /><Pagination count={filtered.length} page={page} pageSize={pageSize} onPageChange={setPage} /></Panel></div>;
}

function ProductsPage({ onToast, navigate }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const filtered = products.filter((product) => `${product.name} ${product.sku}`.toLowerCase().includes(query.toLowerCase()) && (!status || product.status === status));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  return <div className="space-y-5"><Panel className="overflow-hidden"><div className="p-5"><PanelHeader title="Danh sách sản phẩm" subtitle="8 sản phẩm đang được quản lý"><div><button type="button" className="vendor-secondary-button mr-2" onClick={() => onToast({ title: 'Nhập hàng loạt', message: 'Đã mở trình tải file danh sách sản phẩm.' })}><Upload className="h-4 w-4" />Nhập file</button><button type="button" className="vendor-primary-button" onClick={() => navigate('/vendor/products/add')}><Plus className="h-4 w-4" />Thêm sản phẩm</button></div></PanelHeader><div className="mt-4"><Toolbar query={query} onQueryChange={(value) => { setQuery(value); setPage(1); }} onReset={() => { setQuery(''); setStatus(''); setPage(1); }} placeholder="Tìm tên sản phẩm hoặc SKU"><SelectFilter value={status} onChange={(value) => { setStatus(value); setPage(1); }} placeholder="Tất cả trạng thái" options={['Đang bán', 'Tồn thấp', 'Tạm ẩn']} /></Toolbar></div></div><div className="overflow-x-auto"><table className="w-full min-w-[860px] text-left text-sm"><thead className="vendor-table-head"><tr>{['Sản phẩm', 'SKU', 'Giá', 'Tồn kho', 'Đã bán', 'Chất lượng', 'Trạng thái', ''].map((column) => <th key={column} className="px-5 py-3.5">{column}</th>)}</tr></thead><tbody className="divide-y divide-stone-100">{visible.map((product) => <tr key={product.sku} className="vendor-table-row"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600"><ImagePlus className="h-5 w-5" /></span><div><p className="font-extrabold text-stone-800">{product.name}</p><p className="mt-1 text-xs font-semibold text-stone-400">{product.category}</p></div></div></td><td className="px-5 py-4 font-semibold text-stone-500">{product.sku}</td><td className="px-5 py-4 font-extrabold text-stone-700">{formatCurrency(product.price)}</td><td className={cn('px-5 py-4 font-extrabold', product.stock <= 12 ? 'text-red-600' : 'text-stone-700')}>{product.stock}</td><td className="px-5 py-4 font-bold text-stone-600">{product.sold}</td><td className="px-5 py-4 font-bold text-teal-700">{product.quality}/100</td><td className="px-5 py-4"><StatusBadge status={product.status} /></td><td className="px-5 py-4"><button type="button" aria-label={`Thao tác ${product.name}`} className="vendor-icon-button" onClick={() => onToast({ title: product.name, message: 'Đã mở menu thao tác nhanh sản phẩm.' })}><MoreHorizontal className="h-4 w-4" /></button></td></tr>)}</tbody></table></div>{!visible.length && <EmptyState />}<Pagination count={filtered.length} page={page} pageSize={pageSize} onPageChange={setPage} /></Panel></div>;
}

function WarehousePage({ onToast }) {
  const [activeTab, setActiveTab] = useState("PICKUP");
  const currentWarehouses = mockWarehouses.filter(
    (w) => w.type === activeTab,
  );

  return (
    <div className="space-y-5">
      <Panel className="overflow-hidden">
        <div className="p-5">
          <PanelHeader
            title={
              activeTab === "PICKUP" ? "Tất cả kho lấy hàng" : "Kho trả hàng"
            }
            subtitle={`Bạn có ${currentWarehouses.length} kho ${activeTab === "PICKUP" ? "lấy" : "trả"} hàng`}
          >
            <button
              type="button"
              className="vendor-primary-button"
              onClick={() =>
                onToast({
                  title: "Thêm kho hàng",
                  message: "Đã mở form thiết lập kho hàng mới.",
                })
              }
            >
              <Plus className="h-4 w-4" /> Thêm kho hàng
            </button>
          </PanelHeader>
          <div className="mt-4 border-b border-stone-200">
            <div className="flex gap-6">
              <button
                type="button"
                className={cn(
                  "pb-3 text-sm font-bold border-b-2 transition-colors",
                  activeTab === "PICKUP"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-stone-500 hover:text-stone-700",
                )}
                onClick={() => setActiveTab("PICKUP")}
              >
                Kho lấy hàng
              </button>
              <button
                type="button"
                className={cn(
                  "pb-3 text-sm font-bold border-b-2 transition-colors",
                  activeTab === "RETURN"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-stone-500 hover:text-stone-700",
                )}
                onClick={() => setActiveTab("RETURN")}
              >
                Kho trả hàng
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="vendor-table-head">
              <tr>
                <th className="px-5 py-3.5">Thông tin kho</th>
                <th className="px-5 py-3.5">Địa chỉ & Liên hệ</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {currentWarehouses.length > 0 ? (
                currentWarehouses.map((wh) => (
                  <tr key={wh.id} className="vendor-table-row">
                    <td className="px-5 py-4">
                      <p className="font-extrabold text-stone-800">
                        {wh.name}
                      </p>
                      {wh.isDefault && (
                        <span className="mt-2 inline-flex rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-extrabold text-teal-700">
                          Mặc định
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-stone-600">
                        {wh.contact} · {wh.phone}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-stone-500">
                        {wh.address}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={wh.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        aria-label="Sửa kho"
                        className="vendor-icon-button inline-flex"
                        onClick={() =>
                          onToast({
                            title: "Chỉnh sửa kho",
                            message: "Đã mở form cập nhật thông tin kho.",
                          })
                        }
                      >
                        <PenLine className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">
                    <EmptyState />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}


function ShippingPage({ onToast }) {
  return <div className="space-y-5"><section className="grid gap-4 md:grid-cols-3"><InsightCard title="Bàn giao đúng hạn" icon={BadgeCheck} value="96,2%" label="+1,8% trong tuần" text="3 đơn còn dưới 2 giờ để bàn giao." tone="is-green" /><InsightCard title="Đang vận chuyển" icon={Truck} value="128" label="12 đơn giao trong hôm nay" text="Theo dõi các đơn có rủi ro giao trễ." tone="is-teal" /><InsightCard title="Hoàn trả" icon={Clock3} value="7" label="2 yêu cầu cần phản hồi" text="Xử lý trước 18:00 để giữ điểm vận hành." tone="is-orange" /></section><section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]"><Panel className="p-5"><PanelHeader title="Lịch bàn giao hôm nay" subtitle="4 chuyến đã được lên lịch"><button type="button" className="vendor-secondary-button" onClick={() => onToast({ title: 'Đã tối ưu tuyến', message: 'Lịch bàn giao được sắp xếp lại theo hạn gần nhất.' })}><SlidersHorizontal className="h-4 w-4" />Tối ưu tuyến</button></PanelHeader><div className="mt-4 space-y-3">{shipments.map((shipment) => <div key={shipment.id} className="vendor-list-item"><div><p className="font-extrabold text-stone-800">{shipment.id}</p><p className="mt-1 text-xs font-semibold text-stone-400">{shipment.order} · {shipment.carrier}</p></div><div className="flex flex-wrap items-center gap-2"><StatusBadge status={shipment.status} /><span className="text-xs font-bold text-stone-500">{shipment.deadline}</span></div></div>)}</div></Panel><Panel className="p-5"><PanelHeader title="Đối tác vận chuyển" subtitle="Hiệu suất 30 ngày gần nhất" /><div className="mt-4 space-y-3">{[['GHN Express', '97,8%', 'Đang bật'], ['SPX Express', '96,9%', 'Đang bật'], ['GHTK', '94,2%', 'Dự phòng'], ['Viettel Post', '93,8%', 'Dự phòng']].map(([name, rate, state]) => <div key={name} className="vendor-list-item"><div><p className="text-sm font-extrabold text-stone-700">{name}</p><p className="mt-1 text-xs font-bold text-teal-700">{rate} đúng hạn</p></div><StatusBadge status={state === 'Đang bật' ? 'Đang hoạt động' : state}>{state}</StatusBadge></div>)}</div></Panel></section></div>;
}

function MessagesPage({ onToast }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const activeChat = conversations.find((conversation) => conversation.id === activeConversationId);

  const loadConversations = useCallback(async () => {
    try {
      const data = await vendorMessageApi.getConversations();
      const nextConversations = Array.isArray(data) ? data : [];
      setConversations(nextConversations);
      setActiveConversationId((current) => (
        current && nextConversations.some((conversation) => conversation.id === current)
          ? current
          : nextConversations[0]?.id ?? null
      ));
      setError('');
    } catch (requestError) {
      setError(getApiMessage(requestError));
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId, silent = false) => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    if (!silent) setLoadingMessages(true);
    try {
      const data = await vendorMessageApi.getMessages(conversationId);
      setMessages(Array.isArray(data) ? data : []);
      setConversations((current) => current.map((conversation) => (
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
      )));
      setError('');
    } catch (requestError) {
      setError(getApiMessage(requestError));
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
    const intervalId = setInterval(loadConversations, 15000);
    return () => clearInterval(intervalId);
  }, [loadConversations]);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return undefined;
    }
    loadMessages(activeConversationId);
    const intervalId = setInterval(() => loadMessages(activeConversationId, true), 10000);
    return () => clearInterval(intervalId);
  }, [activeConversationId, loadMessages]);

  const selectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    setConversations((current) => current.map((conversation) => (
      conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
    )));
  };

  const sendMessage = async () => {
    const content = message.trim();
    if (!content || !activeChat || sending) return;
    setSending(true);
    try {
      const sentMessage = await vendorMessageApi.sendMessage(activeChat.id, content);
      setMessages((current) => current.some((item) => item.id === sentMessage.id)
        ? current
        : [...current, sentMessage]);
      setMessage('');
      await loadConversations();
      onToast({ title: 'Đã gửi tin nhắn', message: `Phản hồi của bạn đã được gửi tới ${activeChat.customerName}.` });
    } catch (requestError) {
      setError(getApiMessage(requestError));
    } finally {
      setSending(false);
    }
  };

  return <section className="grid min-h-[620px] gap-5 xl:grid-cols-[320px_1fr_280px]">
    <Panel className="p-4">
      <PanelHeader title="Hộp thư" subtitle={`${conversations.length} hội thoại`}>
        <button type="button" aria-label="Tải lại hội thoại" className="vendor-icon-button" onClick={loadConversations}><RefreshCw className="h-4 w-4" /></button>
      </PanelHeader>
      {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600">{error}</p>}
      <div className="mt-4 space-y-2">
        {loadingConversations && !conversations.length && <p className="py-8 text-center text-xs font-semibold text-stone-400">Đang tải hộp thư...</p>}
        {!loadingConversations && !conversations.length && <div className="py-10 text-center"><MessageSquareText className="mx-auto h-8 w-8 text-stone-300" /><p className="mt-3 text-sm font-extrabold text-stone-700">Chưa có hội thoại</p><p className="mt-1 text-xs font-semibold leading-5 text-stone-400">Tin nhắn mới từ khách hàng sẽ xuất hiện tại đây.</p></div>}
        {conversations.map((chat) => <button key={chat.id} type="button" className={cn('vendor-chat-item', activeConversationId === chat.id && 'is-active')} onClick={() => selectConversation(chat.id)}><div className="flex items-center gap-2"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-extrabold text-orange-700">{getInitials(chat.customerName)}</span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-extrabold text-stone-700">{chat.customerName}</span><span className="shrink-0 text-[11px] font-semibold text-stone-400">{formatChatTime(chat.lastMessageAt)}</span></span><span className="mt-1 block truncate text-xs font-semibold text-stone-500">{chat.lastMessage || 'Chưa có tin nhắn'}</span></span></div>{chat.unreadCount > 0 && <span className="mt-2 inline-flex rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-extrabold text-white">{chat.unreadCount}</span>}</button>)}
      </div>
    </Panel>

    <Panel className="flex min-h-[560px] flex-col overflow-hidden">
      {activeChat ? <>
        <div className="border-b border-stone-100 p-4"><p className="font-extrabold text-stone-800">{activeChat.customerName}</p><p className="mt-1 text-xs font-semibold text-stone-400">Trao đổi với khách hàng</p></div>
        <div className="flex-1 space-y-3 overflow-y-auto bg-stone-50/60 p-4">
          {loadingMessages && <p className="py-8 text-center text-xs font-semibold text-stone-400">Đang tải tin nhắn...</p>}
          {!loadingMessages && !messages.length && <p className="py-8 text-center text-xs font-semibold text-stone-400">Hội thoại chưa có tin nhắn.</p>}
          {messages.map((item) => <div key={item.id} className={cn('max-w-[75%] rounded-xl px-3 py-2 text-sm font-semibold shadow-sm', item.sentByVendor ? 'ml-auto bg-teal-700 text-white' : 'bg-white text-stone-600')}><p>{item.content}</p><p className={cn('mt-1 text-[10px]', item.sentByVendor ? 'text-teal-100' : 'text-stone-400')}>{formatChatTime(item.createdAt)}</p></div>)}
        </div>
        <div className="border-t border-stone-100 p-4"><div className="flex gap-2"><input value={message} maxLength={2000} disabled={sending} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && sendMessage()} className="vendor-input h-11 flex-1 px-3 text-sm" placeholder="Nhập tin nhắn..." /><button type="button" aria-label="Gửi tin nhắn" disabled={sending || !message.trim()} className="vendor-primary-button px-3 disabled:cursor-not-allowed disabled:opacity-50" onClick={sendMessage}><Send className="h-4 w-4" /></button></div></div>
      </> : <div className="flex flex-1 items-center justify-center p-8 text-center"><div><MessageSquareText className="mx-auto h-10 w-10 text-stone-300" /><p className="mt-3 text-sm font-extrabold text-stone-700">Chọn một hội thoại</p><p className="mt-1 text-xs font-semibold text-stone-400">Nội dung trao đổi với khách hàng sẽ hiển thị tại đây.</p></div></div>}
    </Panel>

    <Panel className="p-4">
      <PanelHeader title="Trả lời nhanh" subtitle="Chọn để điền nội dung" />
      <div className="mt-4 space-y-2">{['Dạ sản phẩm vẫn còn hàng ạ.', 'Shop hỗ trợ đổi trả trong 7 ngày.', 'Shop gửi bạn mã giảm 10% nhé.', 'Đơn sẽ được gửi trong hôm nay ạ.'].map((reply) => <button key={reply} type="button" disabled={!activeChat} className="vendor-quick-reply disabled:cursor-not-allowed disabled:opacity-50" onClick={() => setMessage(reply)}><MessageSquareText className="h-4 w-4 shrink-0 text-orange-500" />{reply}</button>)}</div>
    </Panel>
  </section>;
}

function MarketingPage({ onToast }) {
  return <div className="space-y-5"><section className="grid gap-4 md:grid-cols-3"><InsightCard title="Doanh thu từ ads" icon={BarChart3} value="42,8 triệu" label="ROAS trung bình 5,8x" text="Tăng 12,4% so với 7 ngày trước." tone="is-orange" /><InsightCard title="Voucher đang chạy" icon={TicketPercent} value="12" label="3 voucher sắp hết ngân sách" text="Voucher theo dõi shop có hiệu suất tốt nhất." tone="is-yellow" /><InsightCard title="Lịch livestream" icon={Sparkles} value="18:30" label="8 sản phẩm đã ghim" text="Kịch bản bán hàng đã sẵn sàng." tone="is-teal" /></section><section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]"><Panel className="p-5"><PanelHeader title="Chiến dịch đang chạy" subtitle="Theo dõi tiến độ ngân sách"><button type="button" className="vendor-primary-button" onClick={() => onToast({ title: 'Tạo chiến dịch', message: 'Đã mở flow thiết lập chiến dịch mới.' })}><Plus className="h-4 w-4" />Tạo chiến dịch</button></PanelHeader><div className="mt-4 space-y-3">{campaigns.map((campaign) => <div key={campaign.name} className="vendor-list-item block"><div className="flex items-start justify-between gap-3"><div><p className="font-extrabold text-stone-800">{campaign.name}</p><p className="mt-1 text-xs font-semibold text-stone-400">{campaign.metric} · Ngân sách {campaign.budget}</p></div><StatusBadge status="Đang chạy" /></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100"><div className="vendor-progress h-full rounded-full bg-orange-500" style={{ width: `${campaign.progress}%` }} /></div><div className="mt-2 flex justify-between text-xs font-bold text-stone-400"><span>Đã dùng {campaign.progress}%</span><span className="text-teal-700">{campaign.revenue}</span></div></div>)}</div></Panel><Panel className="p-5"><PanelHeader title="Gợi ý tăng trưởng" subtitle="Dựa trên hiệu suất shop" /><div className="mt-4 space-y-2">{['Tạo combo mua 2 giảm 8%', 'Bật voucher cho khách mới', 'Đẩy tồn cao vào Flash Sale', 'Chuẩn bị kịch bản live 30 phút'].map((item) => <button key={item} type="button" className="vendor-task" onClick={() => onToast({ title: 'Đã chọn gợi ý', message: item })}><Sparkles className="h-4 w-4 text-orange-500" /><span className="text-sm font-bold text-stone-600">{item}</span></button>)}</div></Panel></section></div>;
}

function FinancePage({ onToast }) {
  const exportStatement = () => {
    downloadCsv('seller-statement.csv', ['Mã đơn', 'Khách hàng', 'Giá trị', 'Thời gian'], orders.map((order) => [order.id, order.buyer, formatCurrency(order.total), order.time]));
    onToast({ title: 'Đã xuất sao kê', message: 'Sao kê giao dịch đã được tải xuống.' });
  };
  return <div className="space-y-5"><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
    ['Số dư khả dụng', '86,2 triệu', 'Có thể rút hôm nay', WalletCards, 'is-green'], ['Chờ đối soát', '24,9 triệu', '128 đơn hàng', Clock3, 'is-orange'], ['Phí nền tảng', '3,12 triệu', '7 ngày gần nhất', CreditCard, 'is-teal'], ['Hoàn tiền', '1,48 triệu', '5 yêu cầu', Banknote, 'is-red'],
  ].map(([label, value, change, icon, tone]) => <StatCard key={label} stat={{ label, value, change, note: '', icon, tone }} />)}</section><section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]"><Panel className="p-5"><PanelHeader title="Giao dịch gần đây" subtitle="Các khoản thu từ đơn hàng"><button type="button" className="vendor-secondary-button" onClick={exportStatement}><Download className="h-4 w-4" />Sao kê</button></PanelHeader><div className="mt-3 divide-y divide-stone-100">{orders.slice(0, 6).map((order) => <div key={order.id} className="flex items-center justify-between py-3"><div><p className="text-sm font-extrabold text-stone-700">{order.id}</p><p className="mt-1 text-xs font-semibold text-stone-400">{order.buyer} · {order.time}</p></div><p className="text-sm font-extrabold text-teal-700">+{formatCurrency(order.total)}</p></div>)}</div></Panel><Panel className="p-5"><PanelHeader title="Tài khoản nhận tiền" subtitle="Đã xác minh bởi ShopVN" /><div className="mt-4 rounded-xl border border-stone-100 bg-stone-50 p-4"><p className="font-extrabold text-stone-800">Vietcombank</p><p className="mt-1 text-sm font-semibold text-stone-500">Nguyen Tai Phat · **** 8421</p><StatusBadge className="mt-3" status="Đã xác minh" /></div><button type="button" className="vendor-secondary-button mt-4 w-full justify-center" onClick={() => onToast({ title: 'Cập nhật tài khoản', message: 'Thông tin ngân hàng sẽ cần xác minh lại sau khi thay đổi.' })}><PenLine className="h-4 w-4" />Cập nhật tài khoản</button></Panel></section></div>;
}

function SettingsPage({ onToast }) {
  return <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]"><Panel className="p-5"><PanelHeader title="Hồ sơ cửa hàng" subtitle="Thông tin hiển thị với khách hàng" /><div className="mt-5 flex items-center gap-4"><span className="flex h-16 w-16 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Store className="h-7 w-7" /></span><div><p className="font-extrabold text-stone-800">ShopVN Seller</p><p className="mt-1 text-xs font-semibold text-stone-400">Mã shop VND-2026-0412</p><StatusBadge className="mt-2" status="Đang hoạt động" /></div></div><div className="mt-5 grid gap-3">{[['Tên shop', 'ShopVN Seller'], ['Ngành hàng chính', 'Thời trang & phụ kiện'], ['Email hỗ trợ', 'support@shopvn.local'], ['Số điện thoại', '0922393339']].map(([label, value]) => <label key={label}><span className="text-xs font-bold text-stone-500">{label}</span><input className="vendor-input mt-1 h-11 w-full px-3 text-sm" defaultValue={value} /></label>)}</div><button type="button" className="vendor-primary-button mt-4" onClick={() => onToast({ title: 'Đã lưu thay đổi', message: 'Hồ sơ cửa hàng đã được cập nhật thành công.' })}><CheckCircle2 className="h-4 w-4" />Lưu thay đổi</button></Panel><div className="space-y-5"><Panel className="p-5"><PanelHeader title="Xác minh & bảo mật" subtitle="Trạng thái bảo vệ tài khoản" /><div className="mt-4 space-y-2">{[['CCCD chủ shop', 'Đã xác minh', ShieldCheck], ['Tài khoản ngân hàng', 'Đã xác minh', Banknote], ['Xác thực 2 lớp', 'Khuyến nghị bật', BadgeCheck]].map(([label, value, Icon]) => <div key={label} className="vendor-list-item"><span className="flex items-center gap-3 text-sm font-bold text-stone-600"><Icon className="h-4 w-4 text-teal-700" />{label}</span><span className="text-xs font-bold text-stone-400">{value}</span></div>)}</div></Panel><Panel className="p-5"><PanelHeader title="Cấu hình vận hành" subtitle="Tự động hóa công việc hằng ngày" /><div className="mt-4 divide-y divide-stone-100">{['Tự động xác nhận đơn COD', 'Nhận thông báo tồn kho thấp', 'Ẩn sản phẩm khi hết hàng', 'Bật trả lời nhanh trong chat'].map((label, index) => <label key={label} className="flex items-center justify-between gap-3 py-3 text-sm font-bold text-stone-600">{label}<input type="checkbox" defaultChecked={index !== 0} className="h-4 w-4 accent-teal-700" /></label>)}</div></Panel></div></section>;
}

const pageComponents = {
  trangchu: OverviewPage,
  'don-hang': OrdersPage,
  'san-pham': ProductsPage,
  'van-chuyen': ShippingPage,
  'kho-hang': WarehousePage,
  'tin-nhan': MessagesPage,
  marketing: MarketingPage,
  'tai-chinh': FinancePage,
  'cai-dat-shop': SettingsPage,
};

export default function VendorHome() {
  const { section = 'trangchu' } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const Page = pageComponents[section];
  if (!Page) return <Navigate to="/vendor/trangchu" replace />;
  const navigateTo = (slug) => navigate(`/vendor/${slug}`);
  return <><VendorLayout activeSlug={section} onToast={setToast}><Page navigate={navigate} navigateTo={navigateTo} onToast={setToast} /></VendorLayout>{toast && <VendorToast toast={toast} onClose={() => setToast(null)} />}</>;
}
