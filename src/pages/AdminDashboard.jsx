import { useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  Check,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Eye,
  FileText,
  Filter,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Mail,
  PackageCheck,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Store,
  UserRoundCog,
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
  { label: 'GMV hôm nay', value: '2,84 tỷ', change: '+14,2%', icon: BarChart3, tone: 'text-admin-primary' },
  { label: 'Đơn đang xử lý', value: '4.821', change: '312 cần theo dõi', icon: ShoppingBag, tone: 'text-admin-warning' },
  { label: 'Shop chờ duyệt', value: '28', change: '4 hồ sơ rủi ro', icon: Store, tone: 'text-admin-danger' },
  { label: 'Tỷ lệ SLA', value: '97,6%', change: '+1,1%', icon: Gauge, tone: 'text-admin-success' },
];

const users = [
  ['USR-4821', 'Minh Anh', 'Khách hàng', 'Đang hoạt động', '4 đơn / 30 ngày'],
  ['USR-4818', 'Hoàng Nam', 'Khách hàng', 'Theo dõi', '1 yêu cầu hoàn tiền'],
  ['SEL-2162', 'ShopVN Seller', 'Seller', 'Đang hoạt động', '96,2% SLA'],
  ['SEL-2148', 'Beauty Corner', 'Seller', 'Cần xem xét', '3 cảnh báo'],
];

const products = [
  ['PRD-9012', 'Áo khoác chống nắng UV', 'Đang bán', '12 tồn kho', 'Điểm nội dung 92'],
  ['PRD-8871', 'Tai nghe bluetooth mini', 'Chờ duyệt', '24 tồn kho', 'Cần kiểm tra ảnh'],
  ['PRD-8730', 'Set son tint 3 màu', 'Đang bán', '86 tồn kho', 'Không vi phạm'],
  ['PRD-8611', 'Bình giữ nhiệt 750ml', 'Cảnh báo', '7 tồn kho', 'Giá biến động cao'],
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

function readAdminSession() {
  try {
    return JSON.parse(localStorage.getItem('adminSession') || 'null');
  } catch {
    return null;
  }
}

export default function AdminDashboard() {
  const [session, setSession] = useState(readAdminSession);
  const [active, setActive] = useState('tong-quan');
  const [vendors, setVendors] = useState(initialVendors);

  const pendingCount = vendors.filter((vendor) => vendor.status !== 'Đã duyệt' && vendor.status !== 'Từ chối').length;

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

  const updateVendorStatus = (id, status) => {
    setVendors((current) => current.map((vendor) => (vendor.id === id ? { ...vendor, status } : vendor)));
  };

  if (!session) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="admin-neu min-h-screen">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 px-4 py-4 lg:block">
          <div className="admin-card flex min-h-[calc(100vh-2rem)] flex-col rounded-lg p-3">
            <div className="admin-inset flex items-center gap-3 rounded-lg p-3">
              <div className="admin-raised flex h-11 w-11 items-center justify-center rounded-lg text-admin-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.08em]">ShopVN Admin</p>
                <p className="text-xs font-bold text-slate-500">Control Center</p>
              </div>
            </div>

            <nav className="mt-4 space-y-1">
              {adminNavItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActive(id)}
                  className={cn(
                    'admin-focus flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-bold transition-colors',
                    active === id ? 'admin-inset text-admin-primary' : 'text-slate-600 hover:text-admin-text'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                  {id === 'duyet-shop' && pendingCount > 0 && (
                    <span className="rounded-full bg-admin-danger px-2 py-0.5 text-xs text-white">{pendingCount}</span>
                  )}
                </button>
              ))}
            </nav>

            <div className="mt-auto border-t border-white/60 pt-3">
              <div className="admin-inset mb-3 rounded-lg p-3">
                <p className="text-xs font-bold uppercase text-slate-500">Đang đăng nhập</p>
                <p className="mt-1 text-sm font-bold">{session.email}</p>
                <p className="text-xs text-slate-500">{session.role}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="admin-focus flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-admin-danger transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-4 sm:px-6">
          <header className="admin-card sticky top-4 z-10 rounded-lg p-3">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Trang quản trị nội bộ</p>
                <h1 className="text-2xl font-black tracking-tight text-admin-text">{adminNavItems.find((item) => item.id === active)?.label}</h1>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input className="admin-focus admin-inset h-10 w-full rounded-lg pl-9 pr-3 text-sm font-bold sm:w-80" placeholder="Tìm user, shop, đơn hàng..." />
                </div>
                <button className="admin-focus admin-raised inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-bold">
                  <Filter className="h-4 w-4" />
                  Bộ lọc
                </button>
              </div>
            </div>
            <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {adminNavItems.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActive(id)}
                  className={cn('shrink-0 rounded-lg px-3 py-2 text-xs font-bold', active === id ? 'admin-inset text-admin-primary' : 'admin-raised text-slate-600')}
                >
                  {label}
                </button>
              ))}
            </nav>
          </header>

          <div className="py-5">
            <AdminSection active={active} vendors={vendors} onVendorStatus={updateVendorStatus} />
          </div>
        </main>
      </div>
    </div>
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
    <main className="admin-neu grid min-h-screen place-items-center px-4 py-8">
      <section className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="admin-card rounded-lg p-6 sm:p-8">
          <div className="admin-inset mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg text-admin-primary">
            <LockKeyhole className="h-7 w-7" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">/quantri</p>
          <h1 className="mt-2 max-w-xl text-4xl font-black leading-tight tracking-tight text-admin-text sm:text-5xl">
            Đăng nhập quản trị hệ thống
          </h1>
          <p className="mt-4 max-w-2xl text-sm font-bold leading-6 text-slate-600">
            Khu vực nội bộ dành cho vận hành, kiểm duyệt, tài chính và quản lý nền tảng. Không hỗ trợ đăng ký tài khoản từ giao diện này.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ['Bảo mật', 'Phiên đăng nhập cục bộ'],
              ['Phân quyền', 'Admin vận hành'],
              ['Audit', 'Theo dõi thao tác'],
            ].map(([label, value]) => (
              <div key={label} className="admin-inset rounded-lg p-3">
                <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="admin-card rounded-lg p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="admin-raised flex h-11 w-11 items-center justify-center rounded-lg text-admin-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black">Admin Login</h2>
              <p className="text-sm font-bold text-slate-500">Tài khoản được cấp bởi hệ thống</p>
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-bold uppercase text-slate-500">Email quản trị</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="admin-focus admin-inset mt-2 h-11 w-full rounded-lg px-3 text-sm font-bold"
              placeholder="admin@shopvn.local"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-bold uppercase text-slate-500">Mật khẩu</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="admin-focus admin-inset mt-2 h-11 w-full rounded-lg px-3 text-sm font-bold"
              placeholder="Nhập mật khẩu"
            />
          </label>

          {error && (
            <div className="admin-inset mt-4 rounded-lg p-3 text-sm font-bold text-admin-danger">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-focus admin-raised mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-admin-primary text-sm font-black text-white"
          >
            Đăng nhập
            <ChevronRight className="h-4 w-4" />
          </button>
        </form>
      </section>
    </main>
  );
}

function AdminSection({ active, vendors, onVendorStatus }) {
  if (active === 'tong-quan') return <OverviewSection vendors={vendors} />;
  if (active === 'duyet-shop') return <VendorApprovalSection vendors={vendors} onVendorStatus={onVendorStatus} />;
  if (active === 'nguoi-dung') return <DataSection title="Quản lý người dùng" subtitle="Theo dõi buyer, seller, trạng thái tài khoản và rủi ro." columns={['Mã', 'Tên', 'Vai trò', 'Trạng thái', 'Ghi chú']} rows={users} icon={Users} />;
  if (active === 'san-pham') return <DataSection title="Quản lý sản phẩm" subtitle="Duyệt sản phẩm, kiểm tra tồn kho, chất lượng nội dung và cảnh báo vi phạm." columns={['Mã', 'Sản phẩm', 'Trạng thái', 'Kho', 'Đánh giá']} rows={products} icon={Boxes} />;
  if (active === 'don-hang') return <DataSection title="Giám sát đơn hàng" subtitle="Theo dõi trạng thái đơn, SLA xử lý, seller phụ trách và giá trị giao dịch." columns={['Mã đơn', 'Khách hàng', 'Shop', 'Giá trị', 'Trạng thái']} rows={orders} icon={ShoppingBag} />;
  if (active === 'tai-chinh') return <DataSection title="Tài chính & đối soát" subtitle="Quản lý rút tiền, hoàn tiền, phí nền tảng và kỳ đối soát seller." columns={['Hạng mục', 'Giá trị', 'Trạng thái', 'Ghi chú']} rows={financeRows} icon={CreditCard} />;
  if (active === 'kiem-duyet') return <DataSection title="Trung tâm kiểm duyệt" subtitle="Xử lý nội dung, khiếu nại, gian lận thanh toán và vi phạm seller." columns={['Hàng đợi', 'Số lượng', 'Mô tả']} rows={moderationItems} icon={ShieldCheck} />;
  if (active === 'bao-cao') return <ReportsSection />;
  return <SettingsSection />;
}

function OverviewSection({ vendors }) {
  const pending = vendors.filter((vendor) => vendor.status !== 'Đã duyệt' && vendor.status !== 'Từ chối').length;
  const riskHigh = vendors.filter((vendor) => vendor.risk === 'Cao').length;

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="admin-card rounded-lg p-4">
          <SectionTitle icon={BarChart3} title="Nhịp vận hành hôm nay" subtitle="GMV, đơn hàng và cảnh báo theo khung giờ" />
          <AdminActivityChart />
        </div>
        <div className="admin-card rounded-lg p-4">
          <SectionTitle icon={AlertTriangle} title="Ưu tiên xử lý" subtitle="Các hàng đợi ảnh hưởng trực tiếp tới SLA" />
          <div className="space-y-3">
            {[
              ['Duyệt shop mới', `${pending} hồ sơ`, 'text-admin-danger'],
              ['Rủi ro cao', `${riskHigh} hồ sơ`, 'text-admin-warning'],
              ['Ticket quá hạn', '8 ticket', 'text-admin-danger'],
              ['Đối soát cần kiểm tra', '5 giao dịch', 'text-admin-primary'],
            ].map(([label, value, tone]) => (
              <button key={label} className="admin-focus admin-inset flex w-full items-center justify-between rounded-lg p-3 text-left">
                <span className="text-sm font-bold">{label}</span>
                <span className={cn('text-sm font-black', tone)}>{value}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <HealthCard title="Seller Health" value="92/100" text="3 seller cần kiểm tra trước cuối ngày." icon={Store} />
        <HealthCard title="Payment Risk" value="Thấp" text="Không có spike bất thường trong 2 giờ qua." icon={CreditCard} />
        <HealthCard title="Platform SLA" value="97,6%" text="Tuyến vận hành đang trong ngưỡng an toàn." icon={PackageCheck} />
      </section>
    </div>
  );
}

function VendorApprovalSection({ vendors, onVendorStatus }) {
  return (
    <section className="admin-card rounded-lg p-4">
      <SectionTitle icon={ClipboardList} title="Duyệt gian hàng Seller" subtitle="Kiểm tra hồ sơ, rủi ro và quyết định kích hoạt shop." />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/60 text-xs font-black uppercase text-slate-500">
              <th className="py-3">Mã shop</th>
              <th className="py-3">Tên shop</th>
              <th className="py-3">Chủ shop</th>
              <th className="py-3">Liên hệ</th>
              <th className="py-3">Ngành hàng</th>
              <th className="py-3">Rủi ro</th>
              <th className="py-3">Trạng thái</th>
              <th className="py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/60">
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td className="py-3 font-black">{vendor.id}</td>
                <td className="py-3 font-bold">{vendor.shop}</td>
                <td className="py-3 text-slate-600">{vendor.owner}</td>
                <td className="py-3 text-slate-600">
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{vendor.email}</span>
                    <span>{vendor.phone}</span>
                  </div>
                </td>
                <td className="py-3 text-slate-600">{vendor.category}</td>
                <td className="py-3"><RiskBadge risk={vendor.risk} /></td>
                <td className="py-3"><StatusPill status={vendor.status} /></td>
                <td className="py-3">
                  <div className="flex justify-end gap-2">
                    <button className="admin-focus admin-raised inline-flex h-9 items-center gap-1 rounded-lg px-3 text-xs font-black" onClick={() => onVendorStatus(vendor.id, 'Đã duyệt')}>
                      <Check className="h-3.5 w-3.5" />
                      Duyệt
                    </button>
                    <button className="admin-focus admin-raised inline-flex h-9 items-center gap-1 rounded-lg px-3 text-xs font-black text-admin-danger" onClick={() => onVendorStatus(vendor.id, 'Từ chối')}>
                      <X className="h-3.5 w-3.5" />
                      Từ chối
                    </button>
                    <button className="admin-focus admin-inset inline-flex h-9 items-center gap-1 rounded-lg px-3 text-xs font-black" onClick={() => onVendorStatus(vendor.id, 'Cần xem xét')}>
                      <Eye className="h-3.5 w-3.5" />
                      Review
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DataSection({ title, subtitle, columns, rows, icon: Icon }) {
  return (
    <section className="admin-card rounded-lg p-4">
      <SectionTitle icon={Icon} title={title} subtitle={subtitle} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/60 text-xs font-black uppercase text-slate-500">
              {columns.map((column) => <th key={column} className="py-3 pr-4">{column}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/60">
            {rows.map((row) => (
              <tr key={row.join('-')}>
                {row.map((cell, index) => (
                  <td key={`${cell}-${index}`} className={cn('py-3 pr-4', index === 0 ? 'font-black text-admin-text' : 'font-bold text-slate-600')}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ReportsSection() {
  return (
    <section className="grid gap-5 xl:grid-cols-3">
      {[
        ['Báo cáo doanh thu', 'Xuất GMV, phí nền tảng, hoàn tiền theo ngày.'],
        ['Báo cáo vận hành', 'SLA xử lý đơn, tuyến giao hàng, hiệu suất seller.'],
        ['Báo cáo kiểm duyệt', 'Vi phạm sản phẩm, khiếu nại và quyết định xử lý.'],
      ].map(([title, text]) => (
        <div key={title} className="admin-card rounded-lg p-4">
          <SectionTitle icon={FileText} title={title} subtitle={text} />
          <button className="admin-focus admin-raised mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-black">
            Tạo báo cáo
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ))}
    </section>
  );
}

function SettingsSection() {
  return (
    <section className="grid gap-5 xl:grid-cols-2">
      <div className="admin-card rounded-lg p-4">
        <SectionTitle icon={UserRoundCog} title="Phân quyền quản trị" subtitle="Thiết lập vai trò và phạm vi thao tác cho đội vận hành." />
        {['Duyệt seller', 'Quản lý hoàn tiền', 'Khóa sản phẩm vi phạm', 'Xuất báo cáo tài chính'].map((label, index) => (
          <label key={label} className="admin-inset mb-3 flex items-center justify-between rounded-lg p-3">
            <span className="text-sm font-bold">{label}</span>
            <input type="checkbox" defaultChecked={index !== 1} className="h-4 w-4 accent-admin-primary" />
          </label>
        ))}
      </div>
      <div className="admin-card rounded-lg p-4">
        <SectionTitle icon={Shield} title="Bảo mật hệ thống" subtitle="Quy tắc đăng nhập, audit log và cảnh báo truy cập." />
        {['Yêu cầu xác thực 2 lớp', 'Ghi log thao tác nhạy cảm', 'Cảnh báo đăng nhập lạ', 'Khóa phiên sau 30 phút'].map((label) => (
          <div key={label} className="admin-inset mb-3 rounded-lg p-3 text-sm font-bold">{label}</div>
        ))}
      </div>
    </section>
  );
}

function MetricCard({ metric }) {
  const Icon = metric.icon;
  return (
    <div className="admin-card rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-slate-500">{metric.label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight">{metric.value}</p>
        </div>
        <span className={cn('admin-inset flex h-11 w-11 items-center justify-center rounded-lg', metric.tone)}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 text-sm font-bold text-slate-600">{metric.change}</p>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="admin-inset flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-admin-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h2 className="text-lg font-black tracking-tight">{title}</h2>
        <p className="mt-1 text-sm font-bold text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function AdminActivityChart() {
  const data = [42, 58, 51, 73, 66, 84, 79, 92, 88, 96, 103, 114];
  const max = Math.max(...data);

  return (
    <div className="admin-inset rounded-lg p-4">
      <div className="flex h-60 items-end gap-2">
        {data.map((value, index) => (
          <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
            <div className="w-full rounded-t-lg bg-admin-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]" style={{ height: `${(value / max) * 100}%` }} />
            <span className="text-[10px] font-black text-slate-500">{index + 8}h</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HealthCard({ title, value, text, icon: Icon }) {
  return (
    <div className="admin-card rounded-lg p-4">
      <div className="flex items-center gap-3">
        <span className="admin-inset flex h-11 w-11 items-center justify-center rounded-lg text-admin-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-black text-slate-500">{title}</p>
          <p className="text-2xl font-black">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-sm font-bold text-slate-600">{text}</p>
    </div>
  );
}

function RiskBadge({ risk }) {
  const tone = {
    Thấp: 'text-admin-success',
    'Trung bình': 'text-admin-warning',
    Cao: 'text-admin-danger',
  }[risk] || 'text-slate-600';
  return <span className={cn('admin-inset inline-flex rounded-full px-2.5 py-1 text-xs font-black', tone)}>{risk}</span>;
}

function StatusPill({ status }) {
  const tone = {
    'Đã duyệt': 'text-admin-success',
    'Từ chối': 'text-admin-danger',
    'Cần xem xét': 'text-admin-warning',
    'Chờ duyệt': 'text-admin-primary',
  }[status] || 'text-slate-600';
  return <span className={cn('admin-raised inline-flex rounded-full px-2.5 py-1 text-xs font-black', tone)}>{status}</span>;
}
