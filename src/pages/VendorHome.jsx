import { NavLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  BadgeCheck,
  Banknote,
  Bell,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Coins,
  Download,
  Filter,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquareText,
  PackageCheck,
  PackageSearch,
  PenLine,
  Plus,
  ReceiptText,
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
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

const navItems = [
  { slug: 'trangchu', label: 'Tổng quan', icon: LayoutDashboard },
  { slug: 'don-hang', label: 'Đơn hàng', icon: ShoppingBag },
  { slug: 'san-pham', label: 'Sản phẩm', icon: PackageSearch },
  { slug: 'van-chuyen', label: 'Vận chuyển', icon: Truck },
  { slug: 'tin-nhan', label: 'Tin nhắn', icon: MessageSquareText },
  { slug: 'marketing', label: 'Marketing', icon: TicketPercent },
  { slug: 'tai-chinh', label: 'Tài chính', icon: WalletCards },
  { slug: 'cai-dat-shop', label: 'Cài đặt shop', icon: Settings },
];

const pageTitles = {
  trangchu: 'Trang chủ Vendor',
  'don-hang': 'Quản lý đơn hàng',
  'san-pham': 'Quản lý sản phẩm',
  'van-chuyen': 'Vận chuyển',
  'tin-nhan': 'Tin nhắn khách hàng',
  marketing: 'Marketing',
  'tai-chinh': 'Tài chính',
  'cai-dat-shop': 'Cài đặt shop',
};

const stats = [
  { label: 'Doanh thu hôm nay', value: '18.420.000đ', change: '+12,4%', icon: Coins, tone: 'text-emerald-600 bg-emerald-50' },
  { label: 'Đơn chờ xử lý', value: '34', change: '8 đơn hỏa tốc', icon: ClipboardList, tone: 'text-orange-600 bg-orange-50' },
  { label: 'Tỷ lệ chuyển đổi', value: '7,8%', change: '+1,2%', icon: TrendingUp, tone: 'text-indigo-600 bg-indigo-50' },
  { label: 'Đánh giá shop', value: '4,8/5', change: '2.431 đánh giá', icon: Star, tone: 'text-amber-600 bg-amber-50' },
];

const revenueTrend = [
  { label: 'T2', revenue: 12.4, orders: 118 },
  { label: 'T3', revenue: 14.8, orders: 132 },
  { label: 'T4', revenue: 13.6, orders: 126 },
  { label: 'T5', revenue: 17.2, orders: 151 },
  { label: 'T6', revenue: 16.5, orders: 144 },
  { label: 'T7', revenue: 21.1, orders: 184 },
  { label: 'CN', revenue: 18.4, orders: 169 },
];

const orders = [
  { id: 'SPV-10291', buyer: 'Minh Anh', item: 'Áo khoác chống nắng UV', total: '389.000đ', status: 'Cần xác nhận', tone: 'bg-orange-50 text-orange-700', channel: 'TikTok Live', time: '09:28' },
  { id: 'SPV-10290', buyer: 'Gia Hân', item: 'Set son tint 3 màu', total: '259.000đ', status: 'Đang đóng gói', tone: 'bg-blue-50 text-blue-700', channel: 'Shopee Mall', time: '09:12' },
  { id: 'SPV-10289', buyer: 'Hoàng Nam', item: 'Tai nghe bluetooth mini', total: '499.000đ', status: 'Chờ lấy hàng', tone: 'bg-emerald-50 text-emerald-700', channel: 'Web ShopVN', time: '08:44' },
  { id: 'SPV-10288', buyer: 'Thanh Vy', item: 'Bình giữ nhiệt 750ml', total: '189.000đ', status: 'Đang giao', tone: 'bg-slate-100 text-slate-700', channel: 'Flash Sale', time: '08:02' },
];

const products = [
  { name: 'Áo khoác chống nắng UV', sku: 'AK-UV-021', stock: 12, sold: 428, price: '389.000đ', status: 'Đang bán', warning: true },
  { name: 'Set son tint 3 màu', sku: 'SON-T3-118', stock: 86, sold: 312, price: '259.000đ', status: 'Đang bán', warning: false },
  { name: 'Tai nghe bluetooth mini', sku: 'AUDIO-MINI-09', stock: 24, sold: 205, price: '499.000đ', status: 'Đang bán', warning: false },
  { name: 'Bình giữ nhiệt 750ml', sku: 'BN-750-4C', stock: 7, sold: 188, price: '189.000đ', status: 'Tồn thấp', warning: true },
];

const shipments = [
  { id: 'GHN-78422', order: 'SPV-10289', carrier: 'GHN Express', deadline: '15:00 hôm nay', status: 'Chờ bàn giao' },
  { id: 'SPX-48110', order: 'SPV-10288', carrier: 'SPX Express', deadline: 'Đang giao', status: 'Trên đường giao' },
  { id: 'GHTK-33918', order: 'SPV-10283', carrier: 'GHTK', deadline: '11:30 hôm nay', status: 'Cần in nhãn' },
];

const conversations = [
  { name: 'Minh Anh', message: 'Shop còn màu be size M không ạ?', time: '2 phút', unread: 2 },
  { name: 'Hoàng Nam', message: 'Mình muốn đổi địa chỉ nhận hàng.', time: '12 phút', unread: 1 },
  { name: 'Gia Hân', message: 'Cảm ơn shop, hàng đóng gói rất đẹp.', time: '41 phút', unread: 0 },
];

const campaigns = [
  { name: 'Flash Sale 20H', metric: '26 sản phẩm', progress: 72, budget: '2.500.000đ' },
  { name: 'Voucher theo dõi shop', metric: '1.248 lượt dùng', progress: 58, budget: '1.200.000đ' },
  { name: 'Livestream cuối tuần', metric: '18:30 hôm nay', progress: 36, budget: '800.000đ' },
];

function getVendorInfo() {
  try {
    return JSON.parse(localStorage.getItem('vendorInfo') || '{}');
  } catch {
    return {};
  }
}

function StatusBadge({ children, className }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-white/10', className)}>
      {children}
    </span>
  );
}

function SectionHeader({ title, action, children }) {
  return (
    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-base font-bold text-zinc-50">{title}</h2>
      {children || (action && (
        <button className="vendor-focus inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-bold text-shopee hover:bg-shopee-light">
          {action}
          <ChevronRight className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <div className="vendor-card rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-zinc-400">{stat.label}</p>
          <p className="mt-2 text-2xl font-bold text-zinc-50">{stat.value}</p>
        </div>
        <span className={cn('vendor-inset rounded-lg p-2', stat.tone)}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 text-sm font-medium text-emerald-600">{stat.change}</p>
    </div>
  );
}

function Toolbar({ placeholder = 'Tìm kiếm' }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative min-w-0 sm:w-80">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          className="vendor-focus h-10 w-full rounded-lg vendor-inset pl-9 pr-3 text-sm text-zinc-50 placeholder:text-zinc-500"
          placeholder={placeholder}
        />
      </div>
      <Button variant="outline" size="sm">
        <Filter className="h-4 w-4" />
        Lọc
      </Button>
      <Button variant="outline" size="sm">
        <Download className="h-4 w-4" />
        Xuất file
      </Button>
    </div>
  );
}

function VendorLayout({ activeSlug, children }) {
  const vendorInfo = getVendorInfo();
  const activeTitle = pageTitles[activeSlug] || pageTitles.trangchu;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('vendorInfo');
    navigate('/seller');
  };

  return (
    <div className="vendor-neu min-h-screen text-zinc-50">
      <div className="flex">
        <aside className="hidden min-h-screen w-64 shrink-0 px-4 py-5 lg:block">
          <div className="flex min-h-[calc(100vh-2.5rem)] flex-col">
            <div className="vendor-card flex items-center gap-3 rounded-lg px-3 py-3">
              <div className="vendor-inset flex h-10 w-10 items-center justify-center rounded-lg text-shopee">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.08em] text-zinc-50">Vendor Center</p>
                <p className="text-xs font-bold text-slate-500">{vendorInfo.shopName || 'ShopVN Seller'}</p>
              </div>
            </div>

            <nav className="mt-8 space-y-1">
              {navItems.map(({ slug, label, icon: Icon }) => (
                <NavLink
                  key={slug}
                  to={`/vendor/${slug}`}
                  className={({ isActive }) =>
                    cn(
                      'vendor-focus flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors',
                      isActive ? 'vendor-inset text-shopee' : 'text-slate-600 hover:bg-shopee-light hover:text-zinc-50'
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto space-y-2 border-t border-white/60 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="vendor-focus flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-shopee-light hover:text-zinc-50"
              >
                <ShoppingBag className="h-4 w-4" />
                Về trang mua hàng
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="vendor-focus flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 border-b border-white/10 bg-[#09090b]/82 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Kênh người bán</p>
                <h1 className="text-xl font-bold text-zinc-50">{activeTitle}</h1>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    className="vendor-focus h-10 w-full rounded-lg vendor-inset pl-9 pr-3 text-sm text-zinc-50 placeholder:text-zinc-500 sm:w-72"
                    placeholder="Tìm đơn hàng, SKU, khách hàng"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4" />
                  Thông báo
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  Thêm sản phẩm
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                  <ShoppingBag className="h-4 w-4" />
                  Mua hàng
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </Button>
              </div>
            </div>
            <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {navItems.map(({ slug, label }) => (
                <NavLink
                  key={slug}
                  to={`/vendor/${slug}`}
                  className={({ isActive }) =>
                    cn(
                      'shrink-0 rounded-lg px-3 py-2 text-xs font-semibold',
                      isActive ? 'vendor-inset text-shopee' : 'vendor-soft text-slate-600'
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </header>

          <div className="space-y-6 px-4 py-5 sm:px-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

function OverviewPage() {
  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </section>

      <RevenueTrendChart />

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="vendor-card rounded-lg p-4">
          <SectionHeader title="Đơn hàng cần xử lý" action="Xem tất cả" />
          <OrderTable rows={orders} />
        </div>

        <div className="vendor-card rounded-lg p-4">
          <SectionHeader title="Việc cần làm" />
          <div className="space-y-3">
            {[
              { label: 'Xác nhận đơn mới', count: 12, icon: PackageCheck },
              { label: 'Trả lời chat khách hàng', count: 9, icon: MessageSquareText },
              { label: 'Cập nhật tồn kho thấp', count: 4, icon: Boxes },
              { label: 'Tạo mã giảm giá cuối tuần', count: 1, icon: TicketPercent },
            ].map((task) => {
              const Icon = task.icon;
              return (
                <button key={task.label} className="flex w-full items-center justify-between vendor-soft rounded-lg px-3 py-3 text-left hover:border-shopee/40 hover:bg-shopee-light/40">
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">{task.label}</span>
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-700">{task.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <ProductsPanel />
        <CampaignPanel />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <InsightCard title="Phân tích khách hàng" icon={Users} value="8.421" label="Người theo dõi shop" text="Tệp khách quay lại chiếm 31% doanh thu tuần này." tone="bg-indigo-50 text-indigo-600" />
        <InsightCard title="Vận chuyển" icon={Truck} value="96,2%" label="Tỷ lệ giao đúng hạn" text="3 đơn cần bàn giao trước 15:00 hôm nay." tone="bg-emerald-50 text-emerald-600" />
        <InsightCard title="Sức khỏe shop" icon={Star} value="Tốt" label="Không có vi phạm mới" text="Duy trì phản hồi chat dưới 5 phút để tăng điểm shop." tone="bg-amber-50 text-amber-600" />
      </section>
    </>
  );
}

function RevenueTrendChart() {
  const width = 720;
  const height = 260;
  const padding = { top: 22, right: 28, bottom: 38, left: 48 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const values = revenueTrend.map((item) => item.revenue);
  const maxValue = Math.ceil(Math.max(...values) / 5) * 5;
  const minValue = 0;
  const points = revenueTrend.map((item, index) => {
    const x = padding.left + (index / (revenueTrend.length - 1)) * chartWidth;
    const y = padding.top + ((maxValue - item.revenue) / (maxValue - minValue)) * chartHeight;
    return { ...item, x, y };
  });
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;
  const gridTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <section className="vendor-card overflow-hidden rounded-lg p-4">
      <SectionHeader title="Xu hướng doanh thu 7 ngày">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-zinc-400">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
            <span className="h-2 w-2 rounded-full bg-[#10b981]" />
            Doanh thu
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
            <span className="h-2 w-2 rounded-full bg-[#0C5CAB]" />
            1 đơn = 100k+
          </span>
        </div>
      </SectionHeader>

      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="vendor-inset min-h-[260px] overflow-hidden rounded-lg p-3">
          <svg className="h-full min-h-[240px] w-full" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Biểu đồ đường doanh thu 7 ngày gần nhất">
            <defs>
              <linearGradient id="vendorRevenueLine" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#0C5CAB" />
              </linearGradient>
              <linearGradient id="vendorRevenueArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#0C5CAB" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {gridTicks.map((tick) => {
              const y = padding.top + tick * chartHeight;
              const value = Math.round(maxValue - tick * maxValue);
              return (
                <g key={tick}>
                  <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="rgba(255,255,255,0.08)" />
                  <text x={padding.left - 12} y={y + 4} textAnchor="end" className="fill-zinc-500 text-[11px] font-semibold">
                    {value}tr
                  </text>
                </g>
              );
            })}

            <path d={areaPath} fill="url(#vendorRevenueArea)" />
            <path d={linePath} fill="none" stroke="url(#vendorRevenueLine)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />

            {points.map((point) => (
              <g key={point.label}>
                <line x1={point.x} x2={point.x} y1={padding.top} y2={height - padding.bottom} stroke="rgba(255,255,255,0.04)" />
                <circle cx={point.x} cy={point.y} r="6" fill="#09090b" stroke="#10b981" strokeWidth="3" />
                <text x={point.x} y={height - 12} textAnchor="middle" className="fill-zinc-400 text-[12px] font-bold">
                  {point.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="vendor-soft rounded-lg p-3">
            <p className="text-xs font-bold uppercase text-zinc-500">Doanh thu tuần</p>
            <p className="mt-2 text-2xl font-bold text-zinc-50">114.000.000đ</p>
            <p className="mt-1 text-sm font-semibold text-emerald-500">+18,6% so với tuần trước</p>
          </div>
          <div className="vendor-soft rounded-lg p-3">
            <p className="text-xs font-bold uppercase text-zinc-500">Đỉnh doanh thu</p>
            <p className="mt-2 text-2xl font-bold text-zinc-50">21,1tr</p>
            <p className="mt-1 text-sm font-semibold text-zinc-400">Thứ 7, 184 đơn</p>
          </div>
          <div className="vendor-soft rounded-lg p-3">
            <p className="text-xs font-bold uppercase text-zinc-500">Giá trị trung bình</p>
            <p className="mt-2 text-2xl font-bold text-zinc-50">675.000đ</p>
            <p className="mt-1 text-sm font-semibold text-zinc-400">Mỗi đơn hoàn tất</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function OrderTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[780px] text-left text-sm">
        <thead className="border-b border-gray-100 text-xs uppercase text-gray-500">
          <tr>
            <th className="py-3 font-semibold">Mã đơn</th>
            <th className="py-3 font-semibold">Khách hàng</th>
            <th className="py-3 font-semibold">Sản phẩm</th>
            <th className="py-3 font-semibold">Kênh</th>
            <th className="py-3 font-semibold">Giá trị</th>
            <th className="py-3 font-semibold">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((order) => (
            <tr key={order.id}>
              <td className="py-3 font-semibold text-gray-950">{order.id}</td>
              <td className="py-3 text-gray-600">{order.buyer}</td>
              <td className="py-3 text-gray-600">{order.item}</td>
              <td className="py-3 text-gray-600">{order.channel}</td>
              <td className="py-3 font-semibold">{order.total}</td>
              <td className="py-3">
                <StatusBadge className={order.tone}>{order.status}</StatusBadge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductsPanel() {
  return (
    <div className="vendor-card rounded-lg p-4 xl:col-span-2">
      <SectionHeader title="Hiệu suất sản phẩm" action="Quản lý sản phẩm" />
      <div className="grid gap-3 md:grid-cols-2">
        {products.map((product) => (
          <div key={product.sku} className="vendor-soft rounded-lg p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-950">{product.name}</p>
                <p className="mt-1 text-xs text-gray-500">SKU {product.sku}</p>
              </div>
              {product.warning && (
                <StatusBadge className="bg-red-50 text-red-600">Tồn thấp</StatusBadge>
              )}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div className="vendor-inset rounded-lg p-3">
                <p className="text-gray-500">Giá</p>
                <p className="mt-1 font-bold">{product.price}</p>
              </div>
              <div className="vendor-inset rounded-lg p-3">
                <p className="text-gray-500">Tồn kho</p>
                <p className="mt-1 font-bold">{product.stock}</p>
              </div>
              <div className="vendor-inset rounded-lg p-3">
                <p className="text-gray-500">Đã bán</p>
                <p className="mt-1 font-bold">{product.sold}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CampaignPanel() {
  return (
    <div className="vendor-card rounded-lg p-4">
      <SectionHeader title="Marketing & lịch bán" />
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign.name}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold">{campaign.name}</span>
              <span className="text-gray-500">{campaign.metric}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-shopee" style={{ width: `${campaign.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <CalendarDays className="h-4 w-4" />
          Lịch
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Download className="h-4 w-4" />
          Báo cáo
        </Button>
      </div>
    </div>
  );
}

function InsightCard({ title, icon: Icon, value, label, text, tone }) {
  return (
    <div className="vendor-card rounded-lg p-4">
      <SectionHeader title={title} />
      <div className="flex items-center gap-4">
        <span className={cn('flex h-12 w-12 items-center justify-center rounded-lg', tone)}>
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-600">{text}</p>
    </div>
  );
}

function OrdersPage() {
  const tabs = ['Tất cả', 'Chờ xác nhận', 'Đang xử lý', 'Đang giao', 'Hoàn tất', 'Trả hàng'];
  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Đơn mới', value: '34', change: '12 đơn cần xác nhận', icon: ShoppingBag, tone: 'text-orange-600 bg-orange-50' },
          { label: 'Đang giao', value: '128', change: '96,2% đúng hạn', icon: Truck, tone: 'text-blue-600 bg-blue-50' },
          { label: 'Hoàn tất hôm nay', value: '216', change: '+18% so với hôm qua', icon: CheckCircle2, tone: 'text-emerald-600 bg-emerald-50' },
          { label: 'Cần xử lý', value: '5', change: '2 yêu cầu đổi trả', icon: Clock3, tone: 'text-red-600 bg-red-50' },
        ].map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </section>

      <section className="vendor-card rounded-lg p-4">
        <SectionHeader title="Danh sách đơn hàng">
          <Toolbar placeholder="Tìm mã đơn, khách hàng, sản phẩm" />
        </SectionHeader>
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {tabs.map((tab, index) => (
            <button key={tab} className={cn('shrink-0 rounded-lg px-3 py-2 text-sm font-semibold', index === 0 ? 'bg-shopee text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
              {tab}
            </button>
          ))}
        </div>
        <OrderTable rows={orders} />
      </section>
    </>
  );
}

function ProductsPage() {
  return (
    <>
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="vendor-card rounded-lg p-4">
          <SectionHeader title="Kho sản phẩm">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4" />
                Nhập hàng loạt
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </div>
          </SectionHeader>
          <Toolbar placeholder="Tìm tên sản phẩm hoặc SKU" />
          <div className="mt-4 divide-y divide-gray-100">
            {products.map((product) => (
              <div key={product.sku} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg vendor-inset text-gray-400">
                    <ImagePlus className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="mt-1 text-sm text-gray-500">SKU {product.sku}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusBadge className="bg-emerald-50 text-emerald-700">{product.status}</StatusBadge>
                      {product.warning && <StatusBadge className="bg-red-50 text-red-600">Cần nhập thêm</StatusBadge>}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm md:w-80">
                  <div>
                    <p className="text-gray-500">Giá</p>
                    <p className="font-bold">{product.price}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tồn</p>
                    <p className="font-bold">{product.stock}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Đã bán</p>
                    <p className="font-bold">{product.sold}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="vendor-card rounded-lg p-4">
          <SectionHeader title="Chất lượng danh mục" />
          {[
            ['Thiếu ảnh phụ', '8 sản phẩm'],
            ['Mô tả cần tối ưu', '14 sản phẩm'],
            ['Sắp hết hàng', '4 sản phẩm'],
            ['Chờ duyệt thay đổi', '3 sản phẩm'],
          ].map(([label, value]) => (
            <button key={label} className="mb-3 flex w-full items-center justify-between vendor-soft rounded-lg px-3 py-3 text-left hover:bg-gray-50">
              <span className="text-sm font-semibold text-gray-700">{label}</span>
              <span className="text-sm text-gray-500">{value}</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function ShippingPage() {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <InsightCard title="Đúng hạn" icon={BadgeCheck} value="96,2%" label="Tỷ lệ bàn giao đúng SLA" text="3 đơn còn dưới 2 giờ để bàn giao." tone="bg-emerald-50 text-emerald-600" />
        <InsightCard title="Đang vận chuyển" icon={Truck} value="128" label="Đơn trên đường giao" text="Theo dõi các đơn có rủi ro giao trễ." tone="bg-blue-50 text-blue-600" />
        <InsightCard title="Hoàn trả" icon={ReceiptText} value="7" label="Yêu cầu trong 7 ngày" text="2 yêu cầu cần phản hồi trước 18:00." tone="bg-orange-50 text-orange-600" />
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="vendor-card rounded-lg p-4">
          <SectionHeader title="Lịch bàn giao hôm nay">
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4" />
              Tối ưu tuyến
            </Button>
          </SectionHeader>
          <div className="space-y-3">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="flex flex-col gap-3 vendor-soft rounded-lg p-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{shipment.id}</p>
                  <p className="mt-1 text-sm text-gray-500">{shipment.order} · {shipment.carrier}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge className="bg-blue-50 text-blue-700">{shipment.status}</StatusBadge>
                  <span className="text-sm font-semibold text-gray-700">{shipment.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="vendor-card rounded-lg p-4">
          <SectionHeader title="Đối tác vận chuyển" />
          {['GHN Express', 'SPX Express', 'GHTK', 'Viettel Post'].map((name, index) => (
            <div key={name} className="mb-3 flex items-center justify-between vendor-inset rounded-lg px-3 py-3">
              <span className="font-semibold">{name}</span>
              <StatusBadge className={index < 2 ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}>
                {index < 2 ? 'Đang bật' : 'Dự phòng'}
              </StatusBadge>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function MessagesPage() {
  return (
    <section className="grid min-h-[620px] gap-6 xl:grid-cols-[360px_1fr_320px]">
      <div className="vendor-card rounded-lg p-4">
        <SectionHeader title="Hộp thư" />
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input className="h-10 w-full rounded-lg vendor-inset pl-9 pr-3 text-sm outline-none focus:border-shopee" placeholder="Tìm khách hàng" />
        </div>
        <div className="space-y-2">
          {conversations.map((chat, index) => (
            <button key={chat.name} className={cn('w-full rounded-lg border p-3 text-left', index === 0 ? 'border-shopee bg-shopee-light' : 'border-gray-100 hover:bg-gray-50')}>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{chat.name}</p>
                <span className="text-xs text-gray-500">{chat.time}</span>
              </div>
              <p className="mt-1 line-clamp-1 text-sm text-gray-600">{chat.message}</p>
              {chat.unread > 0 && <span className="mt-2 inline-flex rounded-full bg-shopee px-2 py-0.5 text-xs font-bold text-white">{chat.unread}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-[560px] flex-col vendor-card rounded-lg">
        <div className="border-b border-gray-100 p-4">
          <p className="font-bold">Minh Anh</p>
          <p className="text-sm text-gray-500">Đang xem Áo khoác chống nắng UV</p>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          <div className="max-w-[75%] rounded-lg vendor-inset px-3 py-2 text-sm text-gray-700">Shop còn màu be size M không ạ?</div>
          <div className="ml-auto max-w-[75%] rounded-lg bg-shopee px-3 py-2 text-sm text-white">Dạ còn hàng ạ. Shop có thể gửi trong hôm nay nếu chị đặt trước 15:00.</div>
          <div className="max-w-[75%] rounded-lg vendor-inset px-3 py-2 text-sm text-gray-700">Mình đặt 2 cái có được freeship không?</div>
        </div>
        <div className="border-t border-gray-100 p-4">
          <div className="flex gap-2">
            <input className="h-11 flex-1 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-shopee" placeholder="Nhập tin nhắn..." />
            <Button size="icon" aria-label="Gửi tin nhắn">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="vendor-card rounded-lg p-4">
        <SectionHeader title="Công cụ trả lời nhanh" />
        {['Còn hàng', 'Hướng dẫn đổi trả', 'Mã giảm giá', 'Thời gian giao hàng'].map((item) => (
          <button key={item} className="mb-3 flex w-full items-center gap-3 vendor-soft rounded-lg px-3 py-3 text-left text-sm font-semibold hover:bg-gray-50">
            <MessageSquareText className="h-4 w-4 text-gray-500" />
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}

function MarketingPage() {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <InsightCard title="Doanh thu từ ads" icon={Megaphone} value="42.800.000đ" label="7 ngày gần nhất" text="ROAS trung bình 5,8 lần." tone="bg-indigo-50 text-indigo-600" />
        <InsightCard title="Voucher đang chạy" icon={TicketPercent} value="12" label="3 voucher sắp hết ngân sách" text="Tăng ngân sách cho voucher theo dõi shop." tone="bg-orange-50 text-orange-600" />
        <InsightCard title="Livestream" icon={Sparkles} value="18:30" label="Lịch hôm nay" text="Đã ghim 8 sản phẩm chủ lực." tone="bg-emerald-50 text-emerald-600" />
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="vendor-card rounded-lg p-4">
          <SectionHeader title="Chiến dịch đang chạy">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Tạo chiến dịch
            </Button>
          </SectionHeader>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.name} className="vendor-soft rounded-lg p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold">{campaign.name}</p>
                    <p className="text-sm text-gray-500">{campaign.metric} · Ngân sách {campaign.budget}</p>
                  </div>
                  <StatusBadge className="bg-emerald-50 text-emerald-700">Đang chạy</StatusBadge>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-shopee" style={{ width: `${campaign.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="vendor-card rounded-lg p-4">
          <SectionHeader title="Gợi ý tăng trưởng" />
          {['Tạo combo mua 2 giảm 8%', 'Bật voucher cho khách mới', 'Đẩy sản phẩm tồn cao vào Flash Sale', 'Chuẩn bị kịch bản live 30 phút'].map((item) => (
            <button key={item} className="mb-3 flex w-full items-center gap-3 vendor-inset rounded-lg px-3 py-3 text-left text-sm font-semibold hover:bg-shopee-light">
              <Sparkles className="h-4 w-4 text-shopee" />
              {item}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function FinancePage() {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Số dư khả dụng', value: '86.200.000đ', change: 'Có thể rút hôm nay', icon: WalletCards, tone: 'text-emerald-600 bg-emerald-50' },
          { label: 'Chờ đối soát', value: '24.900.000đ', change: '128 đơn hàng', icon: Clock3, tone: 'text-orange-600 bg-orange-50' },
          { label: 'Phí nền tảng', value: '3.120.000đ', change: '7 ngày gần nhất', icon: ReceiptText, tone: 'text-indigo-600 bg-indigo-50' },
          { label: 'Hoàn tiền', value: '1.480.000đ', change: '5 yêu cầu', icon: Banknote, tone: 'text-red-600 bg-red-50' },
        ].map((stat) => <StatCard key={stat.label} stat={stat} />)}
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="vendor-card rounded-lg p-4">
          <SectionHeader title="Giao dịch gần đây">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Sao kê
            </Button>
          </SectionHeader>
          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold">{order.id}</p>
                  <p className="text-sm text-gray-500">{order.buyer} · {order.time}</p>
                </div>
                <p className="font-bold text-emerald-600">+{order.total}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="vendor-card rounded-lg p-4">
          <SectionHeader title="Tài khoản nhận tiền" />
          <div className="vendor-soft rounded-lg p-4">
            <p className="font-bold">Vietcombank</p>
            <p className="mt-1 text-sm text-gray-500">Nguyen Tai Phat · **** 8421</p>
            <StatusBadge className="mt-3 bg-emerald-50 text-emerald-700">Đã xác minh</StatusBadge>
          </div>
          <Button className="mt-4 w-full" variant="outline">
            <PenLine className="h-4 w-4" />
            Cập nhật tài khoản
          </Button>
        </div>
      </section>
    </>
  );
}

function SettingsPage() {
  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="vendor-card rounded-lg p-4">
        <SectionHeader title="Hồ sơ shop" />
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-shopee-light text-shopee">
            <Store className="h-8 w-8" />
          </div>
          <div>
            <p className="text-lg font-bold">ShopVN Seller</p>
            <p className="text-sm text-gray-500">Mã shop: VND-2026-0412</p>
            <StatusBadge className="mt-2 bg-emerald-50 text-emerald-700">Đang hoạt động</StatusBadge>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          {[
            ['Tên shop', 'ShopVN Seller'],
            ['Ngành hàng chính', 'Thời trang & phụ kiện'],
            ['Email hỗ trợ', 'support@shopvn.local'],
            ['Số điện thoại', '0922393339'],
          ].map(([label, value]) => (
            <label key={label} className="block">
              <span className="text-sm font-semibold text-gray-600">{label}</span>
              <input className="mt-1 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-shopee" defaultValue={value} />
            </label>
          ))}
        </div>
        <Button className="mt-4">
          <CheckCircle2 className="h-4 w-4" />
          Lưu thay đổi
        </Button>
      </div>

      <div className="space-y-6">
        <div className="vendor-card rounded-lg p-4">
          <SectionHeader title="Xác minh & bảo mật" />
          {[
            { label: 'CCCD chủ shop', value: 'Đã xác minh', icon: ShieldCheck },
            { label: 'Tài khoản ngân hàng', value: 'Đã xác minh', icon: Banknote },
            { label: 'Xác thực 2 lớp', value: 'Khuyến nghị bật', icon: BadgeCheck },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="mb-3 flex items-center justify-between vendor-soft rounded-lg px-3 py-3">
                <span className="flex items-center gap-3 font-semibold">
                  <Icon className="h-4 w-4 text-gray-500" />
                  {item.label}
                </span>
                <span className="text-sm text-gray-500">{item.value}</span>
              </div>
            );
          })}
        </div>
        <div className="vendor-card rounded-lg p-4">
          <SectionHeader title="Cấu hình vận hành" />
          {['Tự động xác nhận đơn COD', 'Nhận thông báo tồn kho thấp', 'Ẩn sản phẩm khi hết hàng', 'Bật trả lời nhanh trong chat'].map((label, index) => (
            <label key={label} className="mb-3 flex items-center justify-between vendor-inset rounded-lg px-3 py-3">
              <span className="text-sm font-semibold">{label}</span>
              <input type="checkbox" defaultChecked={index !== 0} className="h-4 w-4 accent-shopee" />
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

const pageComponents = {
  trangchu: OverviewPage,
  'don-hang': OrdersPage,
  'san-pham': ProductsPage,
  'van-chuyen': ShippingPage,
  'tin-nhan': MessagesPage,
  marketing: MarketingPage,
  'tai-chinh': FinancePage,
  'cai-dat-shop': SettingsPage,
};

export default function VendorHome() {
  const { section = 'trangchu' } = useParams();
  const Page = pageComponents[section];

  if (!Page) {
    return <Navigate to="/vendor/trangchu" replace />;
  }

  return (
    <VendorLayout activeSlug={section}>
      <Page />
    </VendorLayout>
  );
}
