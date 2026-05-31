import { useState } from 'react';
import {
  AlertTriangle,
  ArrowDownToLine,
  BarChart3,
  Bell,
  Boxes,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Eye,
  FileText,
  Filter,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  MoreHorizontal,
  PackageCheck,
  Plus,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
  X,
} from 'lucide-react';
import { cn } from '../lib/utils';

const adminNavItems = [
  { id: 'tong-quan', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'duyet-shop', label: 'Duyệt shop', icon: Store },
  { id: 'nguoi-dung', label: 'Người dùng', icon: Users },
  { id: 'san-pham', label: 'Sản phẩm', icon: Boxes },
  { id: 'don-hang', label: 'Đơn hàng', icon: ShoppingBag },
  { id: 'tai-chinh', label: 'Tài chính', icon: CreditCard },
  { id: 'kiem-duyet', label: 'Kiểm duyệt', icon: ShieldCheck },
  { id: 'bao-cao', label: 'Báo cáo', icon: FileText },
  { id: 'cai-dat', label: 'Cài đặt', icon: Settings },
];

const initialVendors = [
  { id: 'VND-1008', shop: 'TechZone VN', owner: 'Nguyễn Văn An', email: 'an.nguyen@techzone.vn', phone: '0901234567', category: 'Điện tử', risk: 'Thấp', status: 'Chờ duyệt' },
  { id: 'VND-1009', shop: 'Fashion Hub', owner: 'Trần Thị Bình', email: 'binh.tran@fashionhub.com', phone: '0912345678', category: 'Thời trang', risk: 'Trung bình', status: 'Chờ duyệt' },
  { id: 'VND-1010', shop: 'Green Grocery', owner: 'Lê Minh Cường', email: 'cuong.le@greengrocery.vn', phone: '0923456789', category: 'Thực phẩm', risk: 'Thấp', status: 'Chờ duyệt' },
  { id: 'VND-1011', shop: 'Beauty Corner', owner: 'Phạm Thu Dung', email: 'dung.pham@beautycorner.vn', phone: '0934567890', category: 'Làm đẹp', risk: 'Cao', status: 'Cần xem xét' },
];

const metrics = [
  { label: 'GMV hôm nay', value: '2,84 tỷ', change: '+14,2%', note: 'so với hôm qua', icon: BarChart3, tone: 'purple' },
  { label: 'Đơn đang xử lý', value: '4.821', change: '+8,6%', note: '312 đơn cần theo dõi', icon: ShoppingBag, tone: 'blue' },
  { label: 'Shop chờ duyệt', value: '28', change: '+4 hồ sơ', note: 'trong 24 giờ qua', icon: Store, tone: 'orange' },
  { label: 'Tỷ lệ SLA', value: '97,6%', change: '+1,1%', note: 'so với tuần trước', icon: Gauge, tone: 'green' },
];

const products = [
  { id: 'PRD-9012', name: 'Áo khoác chống nắng UV', sku: 'AK-UV-021', category: 'Thời trang', price: '389.000đ', stock: 12, status: 'Đang bán', note: 'Điểm nội dung 92' },
  { id: 'PRD-8871', name: 'Tai nghe bluetooth mini', sku: 'AUDIO-MINI-09', category: 'Điện tử', price: '499.000đ', stock: 24, status: 'Chờ duyệt', note: 'Cần kiểm tra ảnh' },
  { id: 'PRD-8730', name: 'Set son tint 3 màu', sku: 'SON-T3-118', category: 'Làm đẹp', price: '259.000đ', stock: 86, status: 'Đang bán', note: 'Không vi phạm' },
  { id: 'PRD-8611', name: 'Bình giữ nhiệt 750ml', sku: 'BN-750-4C', category: 'Gia dụng', price: '189.000đ', stock: 7, status: 'Cảnh báo', note: 'Giá biến động cao' },
];

const users = [
  ['USR-4821', 'Minh Anh', 'Khách hàng', 'Đang hoạt động', '4 đơn / 30 ngày'],
  ['USR-4818', 'Hoàng Nam', 'Khách hàng', 'Theo dõi', '1 yêu cầu hoàn tiền'],
  ['SEL-2162', 'ShopVN Seller', 'Seller', 'Đang hoạt động', '96,2% SLA'],
  ['SEL-2148', 'Beauty Corner', 'Seller', 'Cần xem xét', '3 cảnh báo'],
];

const orders = [
  ['SPV-10291', 'Minh Anh', 'TechZone VN', '389.000đ', 'Cần xác nhận'],
  ['SPV-10290', 'Gia Hân', 'Beauty Corner', '259.000đ', 'Đang đóng gói'],
  ['SPV-10289', 'Hoàng Nam', 'ShopVN Seller', '499.000đ', 'Chờ lấy hàng'],
  ['SPV-10288', 'Thanh Vy', 'Green Grocery', '189.000đ', 'Đang giao'],
];

const financeRows = [
  ['Đối soát seller', '24,9 tỷ', 'Đang chạy', 'Hoàn tất 18:00'],
  ['Yêu cầu rút tiền', '86,2 triệu', 'Chờ duyệt', '12 lệnh'],
  ['Phí nền tảng', '3,12 tỷ', 'Ổn định', '+6,8% tuần này'],
  ['Hoàn tiền', '148 triệu', 'Cần kiểm tra', '5 yêu cầu lớn'],
];

const moderationItems = [
  ['Nội dung sản phẩm', '43 mục', 'Ảnh, mô tả, từ khóa cần duyệt'],
  ['Khiếu nại khách hàng', '17 ticket', '8 ticket quá 12 giờ'],
  ['Rủi ro thanh toán', '6 cảnh báo', '2 giao dịch giá trị cao'],
  ['Vi phạm seller', '9 hồ sơ', '3 shop cần khóa tạm thời'],
];

const recentOrders = [
  ['#SPV-10291', 'Minh Anh', 'TechZone VN', '389.000đ', 'Cần xác nhận'],
  ['#SPV-10290', 'Gia Hân', 'Beauty Corner', '259.000đ', 'Đang đóng gói'],
  ['#SPV-10289', 'Hoàng Nam', 'ShopVN Seller', '499.000đ', 'Đang giao'],
  ['#SPV-10288', 'Thanh Vy', 'Green Grocery', '189.000đ', 'Hoàn thành'],
];

function readAdminSession() {
  try {
    return JSON.parse(localStorage.getItem('adminSession') || 'null');
  } catch {
    return null;
  }
}

function getInitials(name = 'Admin') {
  return name
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function getTodayLabel() {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
}

export default function AdminDashboard() {
  const [session, setSession] = useState(readAdminSession);
  const [active, setActive] = useState('tong-quan');
  const [vendors, setVendors] = useState(initialVendors);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pendingCount = vendors.filter((vendor) => !['Đã duyệt', 'Từ chối'].includes(vendor.status)).length;

  const handleLogin = (admin) => {
    const nextSession = {
      name: admin.email.split('@')[0] || 'admin',
      email: admin.email,
      role: 'Quản trị viên hệ thống',
      signedInAt: new Date().toISOString(),
    };
    localStorage.setItem('adminSession', JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setSession(null);
    setActive('tong-quan');
  };

  const handleNavigate = (id) => {
    setActive(id);
    setMobileOpen(false);
  };

  const updateVendorStatus = (id, status) => {
    setVendors((current) => current.map((vendor) => (vendor.id === id ? { ...vendor, status } : vendor)));
  };

  if (!session) return <AdminLogin onLogin={handleLogin} />;

  return (
    <div className="admin-app min-h-screen">
      <AdminSidebar
        active={active}
        mobileOpen={mobileOpen}
        pendingCount={pendingCount}
        session={session}
        onClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />

      <div className="min-h-screen lg:pl-64">
        <AdminTopbar session={session} onOpenMenu={() => setMobileOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <AdminSection active={active} vendors={vendors} onNavigate={handleNavigate} onVendorStatus={updateVendorStatus} />
        </main>
      </div>
    </div>
  );
}

function AdminSidebar({ active, mobileOpen, pendingCount, session, onClose, onLogout, onNavigate }) {
  return (
    <>
      {mobileOpen && <button type="button" aria-label="Đóng menu" className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" onClick={onClose} />}
      <aside className={cn('admin-sidebar fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform lg:translate-x-0', mobileOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-[72px] items-center gap-3 border-b border-white/10 px-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-admin-accent text-white shadow-lg shadow-indigo-950/25">
            <Store className="h-5 w-5" />
          </span>
          <div>
            <p className="text-base font-extrabold tracking-tight text-white">ShopVN Admin</p>
            <p className="text-xs font-semibold text-slate-400">Management Hub</p>
          </div>
          <button type="button" aria-label="Đóng menu" className="ml-auto text-slate-400 lg:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="scrollbar-hide flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {adminNavItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={cn('admin-nav-item', active === id && 'is-active')}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span>{label}</span>
              {id === 'duyet-shop' && pendingCount > 0 && (
                <span className="ml-auto rounded-full bg-orange-400 px-2 py-0.5 text-[10px] font-extrabold text-slate-950">{pendingCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3">
          <div className="mb-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-400/20 text-xs font-extrabold text-indigo-200">
                {getInitials(session.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white">{session.email}</p>
                <p className="truncate text-[11px] font-medium text-slate-400">Quản trị hệ thống</p>
              </div>
            </div>
          </div>
          <button type="button" onClick={onLogout} className="admin-nav-item w-full text-slate-400 hover:text-white">
            <LogOut className="h-[18px] w-[18px]" />
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}

function AdminTopbar({ session, onOpenMenu }) {
  return (
    <header className="admin-topbar sticky top-0 z-30 flex h-[72px] items-center gap-3 px-4 sm:px-6 lg:px-8">
      <button type="button" aria-label="Mở menu" onClick={onOpenMenu} className="admin-icon-button lg:hidden">
        <Menu className="h-5 w-5" />
      </button>
      <div className="relative max-w-xl flex-1 lg:ml-auto">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input className="admin-search h-10 w-full pl-10 pr-4 text-sm" placeholder="Tìm đơn hàng, shop hoặc sản phẩm..." />
      </div>
      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <button type="button" aria-label="Thông báo" className="admin-icon-button relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-orange-500" />
        </button>
        <button type="button" aria-label="Trợ giúp" className="admin-icon-button hidden sm:inline-flex">
          <CircleHelp className="h-5 w-5" />
        </button>
        <div className="ml-1 hidden items-center gap-2 border-l border-slate-200 pl-3 sm:flex">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-extrabold text-indigo-700">
            {getInitials(session.name)}
          </span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
}

function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const canSubmit = form.email.trim() && form.password.trim();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) {
      setError('Vui lòng nhập email và mật khẩu quản trị.');
      return;
    }
    setError('');
    onLogin({ email: form.email.trim() });
  };

  return (
    <main className="admin-login min-h-screen px-4 py-8 sm:px-6">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-950/20 lg:grid-cols-[1.06fr_0.94fr]">
        <div className="admin-login-visual hidden flex-col justify-between p-10 text-white lg:flex">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Store className="h-6 w-6" />
            </span>
            <div>
              <p className="text-lg font-extrabold">ShopVN Admin</p>
              <p className="text-xs font-semibold text-indigo-200">Management Hub</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-200">Control center</p>
            <h1 className="mt-4 max-w-lg text-5xl font-extrabold leading-[1.08] tracking-tight">
              Điều hành nền tảng trong một không gian tập trung.
            </h1>
            <p className="mt-5 max-w-lg text-sm font-medium leading-6 text-indigo-100/85">
              Theo dõi vận hành, duyệt seller và xử lý các hàng đợi ưu tiên với dữ liệu được tổ chức rõ ràng.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[['24/7', 'Giám sát'], ['97,6%', 'SLA hệ thống'], ['Secure', 'Audit log']].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                <p className="text-lg font-extrabold">{value}</p>
                <p className="mt-1 text-xs font-semibold text-indigo-200">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center px-5 py-10 sm:px-10 lg:px-14">
          <form onSubmit={handleSubmit} className="w-full">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-admin-accent lg:hidden">
              <Store className="h-6 w-6" />
            </span>
            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.16em] text-admin-accent">/quantri</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Đăng nhập quản trị</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
              Sử dụng tài khoản nội bộ đã được cấp quyền truy cập.
            </p>

            <label className="mt-7 block">
              <span className="text-sm font-bold text-slate-700">Email quản trị</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="admin-form-input mt-2 h-12 w-full px-4 text-sm"
                placeholder="admin@shopvn.vn"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-bold text-slate-700">Mật khẩu</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="admin-form-input mt-2 h-12 w-full px-4 text-sm"
                placeholder="Nhập mật khẩu"
              />
            </label>
            {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
            <div className="mt-4 flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 font-semibold text-slate-600">
                <input type="checkbox" className="h-4 w-4 accent-indigo-600" />
                Ghi nhớ đăng nhập
              </label>
              <button type="button" className="font-bold text-admin-accent hover:text-indigo-700">Quên mật khẩu?</button>
            </div>
            <button type="submit" className="admin-primary-button mt-6 h-12 w-full justify-center">
              <LockKeyhole className="h-4 w-4" />
              Đăng nhập
            </button>
            <p className="mt-6 text-center text-xs font-medium leading-5 text-slate-400">
              Khu vực nội bộ. Mọi thao tác nhạy cảm đều được ghi nhận trong audit log.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

function AdminSection({ active, vendors, onNavigate, onVendorStatus }) {
  if (active === 'tong-quan') return <OverviewSection vendors={vendors} onNavigate={onNavigate} />;
  if (active === 'duyet-shop') return <VendorApprovalSection vendors={vendors} onVendorStatus={onVendorStatus} />;
  if (active === 'san-pham') return <ProductsSection />;
  if (active === 'nguoi-dung') return <DataSection title="Quản lý người dùng" subtitle="Theo dõi buyer, seller, trạng thái tài khoản và rủi ro." columns={['Mã', 'Tên', 'Vai trò', 'Trạng thái', 'Ghi chú']} rows={users} />;
  if (active === 'don-hang') return <DataSection title="Giám sát đơn hàng" subtitle="Theo dõi trạng thái đơn, SLA xử lý, seller phụ trách và giá trị giao dịch." columns={['Mã đơn', 'Khách hàng', 'Shop', 'Giá trị', 'Trạng thái']} rows={orders} />;
  if (active === 'tai-chinh') return <DataSection title="Tài chính & đối soát" subtitle="Quản lý rút tiền, hoàn tiền, phí nền tảng và kỳ đối soát seller." columns={['Hạng mục', 'Giá trị', 'Trạng thái', 'Ghi chú']} rows={financeRows} />;
  if (active === 'kiem-duyet') return <DataSection title="Trung tâm kiểm duyệt" subtitle="Xử lý nội dung, khiếu nại, gian lận thanh toán và vi phạm seller." columns={['Hàng đợi', 'Số lượng', 'Mô tả']} rows={moderationItems} />;
  if (active === 'bao-cao') return <ReportsSection />;
  return <SettingsSection />;
}

function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-admin-accent">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm font-medium text-slate-500">{subtitle}</p>
      </div>
      {children && <div className="flex shrink-0 flex-wrap gap-2">{children}</div>}
    </div>
  );
}

function OverviewSection({ vendors, onNavigate }) {
  const pending = vendors.filter((vendor) => !['Đã duyệt', 'Từ chối'].includes(vendor.status)).length;
  const riskHigh = vendors.filter((vendor) => vendor.risk === 'Cao').length;

  return (
    <div>
      <PageHeader eyebrow={getTodayLabel()} title="Tổng quan vận hành" subtitle="Theo dõi các chỉ số và hàng đợi quan trọng của ShopVN trong hôm nay.">
        <button type="button" className="admin-secondary-button">
          <CalendarDays className="h-4 w-4" />
          Hôm nay
        </button>
        <button type="button" className="admin-primary-button">
          <ArrowDownToLine className="h-4 w-4" />
          Xuất báo cáo
        </button>
      </PageHeader>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.65fr_0.85fr]">
        <div className="admin-panel min-w-0 p-5">
          <PanelHeader title="GMV theo ngày" subtitle="Tổng doanh thu nền tảng trong 30 ngày gần nhất">
            <button type="button" className="admin-tab">7 ngày</button>
            <button type="button" className="admin-tab is-active">30 ngày</button>
            <button type="button" className="admin-tab">90 ngày</button>
          </PanelHeader>
          <AdminActivityChart />
        </div>
        <div className="admin-panel p-5">
          <PanelHeader title="Ưu tiên xử lý" subtitle="Các hàng đợi cần được kiểm tra" />
          <div className="mt-4 space-y-2.5">
            <PriorityItem label="Duyệt shop mới" value={`${pending} hồ sơ`} tone="orange" onClick={() => onNavigate('duyet-shop')} />
            <PriorityItem label="Shop rủi ro cao" value={`${riskHigh} hồ sơ`} tone="red" onClick={() => onNavigate('duyet-shop')} />
            <PriorityItem label="Ticket quá hạn" value="8 ticket" tone="purple" onClick={() => onNavigate('kiem-duyet')} />
            <PriorityItem label="Giao dịch cần kiểm tra" value="5 giao dịch" tone="blue" onClick={() => onNavigate('tai-chinh')} />
          </div>
        </div>
      </section>

      <section className="admin-panel mt-5 overflow-hidden">
        <div className="p-5">
          <PanelHeader title="Đơn hàng gần đây" subtitle="Các đơn hàng mới cập nhật trên toàn nền tảng">
            <button type="button" className="admin-link-button" onClick={() => onNavigate('don-hang')}>
              Xem tất cả <ChevronRight className="h-4 w-4" />
            </button>
          </PanelHeader>
        </div>
        <SimpleTable columns={['Mã đơn', 'Khách hàng', 'Shop', 'Giá trị', 'Trạng thái']} rows={recentOrders} />
      </section>
    </div>
  );
}

function ProductsSection() {
  return (
    <div>
      <PageHeader title="Quản lý sản phẩm" subtitle="Kiểm tra sản phẩm, tồn kho, chất lượng nội dung và cảnh báo vi phạm.">
        <button type="button" className="admin-primary-button">
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </button>
      </PageHeader>
      <Toolbar searchPlaceholder="Tìm theo tên hoặc SKU">
        <ToolbarSelect label="Tất cả ngành hàng" />
        <ToolbarSelect label="Trạng thái sản phẩm" />
      </Toolbar>
      <section className="admin-panel mt-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="admin-table-head">
              <tr>
                {['Sản phẩm', 'SKU', 'Ngành hàng', 'Giá', 'Tồn kho', 'Trạng thái', 'Thao tác'].map((column) => (
                  <th key={column} className="px-5 py-3.5">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="admin-table-row">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-admin-accent">
                        <Boxes className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-bold text-slate-900">{product.name}</p>
                        <p className="mt-1 text-xs font-medium text-slate-400">{product.note}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-500">{product.sku}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{product.category}</td>
                  <td className="px-5 py-4 font-bold text-slate-800">{product.price}</td>
                  <td className="px-5 py-4">
                    <span className={cn('font-bold', product.stock <= 12 ? 'text-orange-600' : 'text-slate-700')}>
                      {product.stock <= 12 && <AlertTriangle className="mr-1 inline h-4 w-4" />}
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4"><StatusPill status={product.status} /></td>
                  <td className="px-5 py-4">
                    <button type="button" aria-label={`Thao tác ${product.name}`} className="admin-icon-button">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TableFooter />
      </section>
    </div>
  );
}

function VendorApprovalSection({ vendors, onVendorStatus }) {
  return (
    <div>
      <PageHeader title="Duyệt gian hàng Seller" subtitle="Kiểm tra hồ sơ, mức độ rủi ro và quyết định kích hoạt gian hàng.">
        <button type="button" className="admin-secondary-button">
          <ArrowDownToLine className="h-4 w-4" />
          Xuất danh sách
        </button>
      </PageHeader>
      <Toolbar searchPlaceholder="Tìm tên shop hoặc chủ shop">
        <ToolbarSelect label="Tất cả ngành hàng" />
        <ToolbarSelect label="Mức độ rủi ro" />
      </Toolbar>
      <section className="admin-panel mt-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="admin-table-head">
              <tr>
                {['Mã shop', 'Gian hàng', 'Chủ shop', 'Liên hệ', 'Ngành hàng', 'Rủi ro', 'Trạng thái', 'Thao tác'].map((column) => (
                  <th key={column} className="px-5 py-3.5">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="admin-table-row">
                  <td className="px-5 py-4 font-bold text-slate-500">{vendor.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 font-extrabold text-admin-accent">{getInitials(vendor.shop)}</span>
                      <span className="font-bold text-slate-900">{vendor.shop}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{vendor.owner}</td>
                  <td className="px-5 py-4">
                    <p className="flex items-center gap-1.5 font-semibold text-slate-600"><Mail className="h-3.5 w-3.5 text-slate-400" />{vendor.email}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{vendor.phone}</p>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{vendor.category}</td>
                  <td className="px-5 py-4"><RiskBadge risk={vendor.risk} /></td>
                  <td className="px-5 py-4"><StatusPill status={vendor.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button type="button" aria-label={`Duyệt ${vendor.shop}`} title="Duyệt" className="admin-row-action text-emerald-600" onClick={() => onVendorStatus(vendor.id, 'Đã duyệt')}>
                        <Check className="h-4 w-4" />
                      </button>
                      <button type="button" aria-label={`Xem xét ${vendor.shop}`} title="Xem xét" className="admin-row-action text-indigo-600" onClick={() => onVendorStatus(vendor.id, 'Cần xem xét')}>
                        <Eye className="h-4 w-4" />
                      </button>
                      <button type="button" aria-label={`Từ chối ${vendor.shop}`} title="Từ chối" className="admin-row-action text-red-600" onClick={() => onVendorStatus(vendor.id, 'Từ chối')}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TableFooter count={vendors.length} />
      </section>
    </div>
  );
}

function DataSection({ title, subtitle, columns, rows }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle}>
        <button type="button" className="admin-secondary-button">
          <ArrowDownToLine className="h-4 w-4" />
          Xuất dữ liệu
        </button>
      </PageHeader>
      <Toolbar searchPlaceholder="Tìm kiếm dữ liệu">
        <ToolbarSelect label="Tất cả trạng thái" />
      </Toolbar>
      <section className="admin-panel mt-5 overflow-hidden">
        <SimpleTable columns={columns} rows={rows} />
        <TableFooter count={rows.length} />
      </section>
    </div>
  );
}

function ReportsSection() {
  return (
    <div>
      <PageHeader title="Trung tâm báo cáo" subtitle="Tổng hợp dữ liệu vận hành, tài chính và kiểm duyệt của nền tảng.">
        <button type="button" className="admin-primary-button">
          <Plus className="h-4 w-4" />
          Tạo báo cáo
        </button>
      </PageHeader>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['Báo cáo doanh thu', 'Xuất GMV, phí nền tảng và hoàn tiền theo ngày.', BarChart3, 'purple'],
          ['Báo cáo vận hành', 'SLA xử lý đơn, giao hàng và hiệu suất seller.', PackageCheck, 'blue'],
          ['Báo cáo kiểm duyệt', 'Vi phạm sản phẩm, khiếu nại và quyết định xử lý.', ShieldCheck, 'orange'],
        ].map(([title, text, Icon, tone]) => (
          <div key={title} className="admin-panel p-5">
            <span className={cn('admin-metric-icon', `is-${tone}`)}><Icon className="h-5 w-5" /></span>
            <h2 className="mt-5 text-base font-extrabold text-slate-900">{title}</h2>
            <p className="mt-2 min-h-[44px] text-sm font-medium leading-6 text-slate-500">{text}</p>
            <button type="button" className="admin-link-button mt-5">
              Tạo báo cáo <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

function SettingsSection() {
  return (
    <div>
      <PageHeader title="Cài đặt hệ thống" subtitle="Quản lý phân quyền và các chính sách bảo mật cho đội vận hành." />
      <section className="grid gap-5 xl:grid-cols-2">
        <div className="admin-panel p-5">
          <PanelHeader title="Phân quyền quản trị" subtitle="Thiết lập phạm vi thao tác nội bộ" />
          <div className="mt-4 divide-y divide-slate-100">
            {['Duyệt seller', 'Quản lý hoàn tiền', 'Khóa sản phẩm vi phạm', 'Xuất báo cáo tài chính'].map((label, index) => (
              <label key={label} className="flex items-center justify-between gap-3 py-4 text-sm font-bold text-slate-700">
                {label}
                <input type="checkbox" defaultChecked={index !== 1} className="h-4 w-4 accent-indigo-600" />
              </label>
            ))}
          </div>
        </div>
        <div className="admin-panel p-5">
          <PanelHeader title="Bảo mật hệ thống" subtitle="Quy tắc đăng nhập và cảnh báo truy cập" />
          <div className="mt-4 space-y-2">
            {['Yêu cầu xác thực 2 lớp', 'Ghi log thao tác nhạy cảm', 'Cảnh báo đăng nhập lạ', 'Khóa phiên sau 30 phút'].map((label) => (
              <div key={label} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
                <Shield className="h-4 w-4 text-admin-accent" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ metric }) {
  const Icon = metric.icon;
  return (
    <div className="admin-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-slate-400">{metric.label}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">{metric.value}</p>
        </div>
        <span className={cn('admin-metric-icon', `is-${metric.tone}`)}><Icon className="h-5 w-5" /></span>
      </div>
      <p className="mt-4 text-xs font-semibold text-slate-400">
        <span className={cn('mr-1.5 font-extrabold', metric.tone === 'orange' ? 'text-orange-600' : 'text-emerald-600')}>{metric.change}</span>
        {metric.note}
      </p>
    </div>
  );
}

function PanelHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
        <p className="mt-1 text-xs font-semibold text-slate-400">{subtitle}</p>
      </div>
      {children && <div className="flex items-center gap-1">{children}</div>}
    </div>
  );
}

function AdminActivityChart() {
  return (
    <div className="mt-5 overflow-hidden">
      <div className="grid grid-cols-[36px_1fr] gap-3">
        <div className="flex h-64 flex-col justify-between pb-6 text-[10px] font-bold text-slate-400">
          <span>5 tỷ</span><span>4 tỷ</span><span>3 tỷ</span><span>2 tỷ</span><span>1 tỷ</span><span>0</span>
        </div>
        <div className="relative h-64">
          <div className="absolute inset-x-0 top-0 flex h-[calc(100%-24px)] flex-col justify-between">
            {[0, 1, 2, 3, 4, 5].map((line) => <span key={line} className="block border-t border-dashed border-slate-200" />)}
          </div>
          <svg className="absolute inset-x-0 top-0 h-[calc(100%-24px)] w-full overflow-visible" viewBox="0 0 800 210" preserveAspectRatio="none" aria-label="Biểu đồ GMV 30 ngày">
            <defs>
              <linearGradient id="admin-chart-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#5546e8" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#5546e8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,174 C62,164 92,135 144,137 C201,139 213,109 270,115 C330,121 361,73 420,82 C479,91 488,46 546,54 C604,62 629,107 680,97 C730,87 746,39 800,18 L800,210 L0,210 Z" fill="url(#admin-chart-fill)" />
            <path d="M0,174 C62,164 92,135 144,137 C201,139 213,109 270,115 C330,121 361,73 420,82 C479,91 488,46 546,54 C604,62 629,107 680,97 C730,87 746,39 800,18" fill="none" stroke="#5546e8" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] font-bold text-slate-400">
            <span>01/05</span><span>07/05</span><span>14/05</span><span>21/05</span><span>31/05</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriorityItem({ label, value, tone, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-xl border border-slate-100 px-3 py-3 text-left transition hover:border-indigo-100 hover:bg-indigo-50/40">
      <span className={cn('h-2.5 w-2.5 rounded-full', {
        'bg-orange-400': tone === 'orange',
        'bg-red-500': tone === 'red',
        'bg-indigo-500': tone === 'purple',
        'bg-blue-500': tone === 'blue',
      })} />
      <span className="min-w-0 flex-1 text-sm font-bold text-slate-700">{label}</span>
      <span className="text-xs font-extrabold text-slate-500">{value}</span>
      <ChevronRight className="h-4 w-4 text-slate-300" />
    </button>
  );
}

function Toolbar({ children, searchPlaceholder }) {
  return (
    <section className="admin-panel flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
      <div className="flex flex-col gap-2 sm:flex-row">{children}</div>
      <div className="relative lg:ml-auto lg:w-80">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input className="admin-form-input h-10 w-full pl-9 pr-3 text-sm" placeholder={searchPlaceholder} />
      </div>
      <button type="button" className="admin-secondary-button justify-center">
        <Filter className="h-4 w-4" />
        Lọc
      </button>
    </section>
  );
}

function ToolbarSelect({ label }) {
  return (
    <button type="button" className="admin-form-input flex h-10 min-w-48 items-center justify-between gap-3 px-3 text-left text-sm font-semibold text-slate-600">
      {label}
      <ChevronDown className="h-4 w-4 text-slate-400" />
    </button>
  );
}

function SimpleTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="admin-table-head">
          <tr>{columns.map((column) => <th key={column} className="px-5 py-3.5">{column}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.join('-')} className="admin-table-row">
              {row.map((cell, index) => (
                <td key={`${cell}-${index}`} className={cn('px-5 py-4', index === 0 ? 'font-bold text-slate-800' : 'font-semibold text-slate-600')}>
                  {index === row.length - 1 && index > 1 ? <StatusPill status={cell} /> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableFooter({ count = 24 }) {
  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-xs font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <p>Hiển thị 1 đến {Math.min(count, 4)} trong {count} kết quả</p>
      <div className="flex items-center gap-1">
        {['‹', '1', '2', '3', '…', '›'].map((page, index) => (
          <button key={`${page}-${index}`} type="button" className={cn('flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-bold', page === '1' ? 'bg-admin-accent text-white' : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-100')}>
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

function RiskBadge({ risk }) {
  const tone = {
    Thấp: 'bg-emerald-50 text-emerald-700',
    'Trung bình': 'bg-orange-50 text-orange-700',
    Cao: 'bg-red-50 text-red-700',
  }[risk] || 'bg-slate-100 text-slate-600';
  return <span className={cn('admin-status-pill', tone)}>{risk}</span>;
}

function StatusPill({ status }) {
  const tone = {
    'Đã duyệt': 'bg-emerald-50 text-emerald-700',
    'Đang bán': 'bg-emerald-50 text-emerald-700',
    'Đang hoạt động': 'bg-emerald-50 text-emerald-700',
    'Hoàn thành': 'bg-emerald-50 text-emerald-700',
    'Ổn định': 'bg-emerald-50 text-emerald-700',
    'Đang giao': 'bg-blue-50 text-blue-700',
    'Đang chạy': 'bg-blue-50 text-blue-700',
    'Đang đóng gói': 'bg-blue-50 text-blue-700',
    'Chờ duyệt': 'bg-indigo-50 text-indigo-700',
    'Chờ lấy hàng': 'bg-indigo-50 text-indigo-700',
    'Cần xác nhận': 'bg-orange-50 text-orange-700',
    'Cần xem xét': 'bg-orange-50 text-orange-700',
    'Cần kiểm tra': 'bg-orange-50 text-orange-700',
    'Theo dõi': 'bg-orange-50 text-orange-700',
    'Cảnh báo': 'bg-red-50 text-red-700',
    'Từ chối': 'bg-red-50 text-red-700',
  }[status] || 'bg-slate-100 text-slate-600';
  return <span className={cn('admin-status-pill', tone)}>{status}</span>;
}
