import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpRight,
  BarChart3,
  Bell,
  Boxes,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Eye,
  FileText,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  MoreHorizontal,
  PackageCheck,
  PackageSearch,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Store,
  TrendingUp,
  Users,
  X,
  Loader2,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ELECTRONICS_CATEGORIES } from '../components/Seller/CategorySelectorField';
import { authApi } from '../api/authAPI';
import { adminApi } from '../api/adminAPI';

const adminNavItems = [
  { id: 'tong-quan', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'duyet-shop', label: 'Duyệt shop', icon: Store },
  { id: 'nguoi-dung', label: 'Người dùng', icon: Users },
  { id: 'san-pham', label: 'Sản phẩm', icon: Boxes },
  { id: 'nghien-cuu-thi-truong', label: 'Nghiên cứu thị trường', icon: TrendingUp },
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

const products = [
  { id: 'PRD-9012', name: 'Áo khoác chống nắng UV', sku: 'AK-UV-021', category: 'Thời trang', price: '389.000đ', stock: 12, status: 'Đang bán', note: 'Điểm nội dung 92' },
  { id: 'PRD-8871', name: 'Tai nghe bluetooth mini', sku: 'AUDIO-MINI-09', category: 'Điện tử', price: '499.000đ', stock: 24, status: 'Chờ duyệt', note: 'Cần kiểm tra ảnh' },
  { id: 'PRD-8730', name: 'Set son tint 3 màu', sku: 'SON-T3-118', category: 'Làm đẹp', price: '259.000đ', stock: 86, status: 'Đang bán', note: 'Không vi phạm' },
  { id: 'PRD-8611', name: 'Bình giữ nhiệt 750ml', sku: 'BN-750-4C', category: 'Gia dụng', price: '189.000đ', stock: 7, status: 'Cảnh báo', note: 'Giá biến động cao' },
  { id: 'PRD-8594', name: 'Máy xay sinh tố mini', sku: 'BLD-MINI-11', category: 'Gia dụng', price: '329.000đ', stock: 42, status: 'Đang bán', note: 'Điểm nội dung 88' },
  { id: 'PRD-8470', name: 'Kem chống nắng SPF50+', sku: 'SKIN-SPF-50', category: 'Làm đẹp', price: '219.000đ', stock: 68, status: 'Đang bán', note: 'Không vi phạm' },
  { id: 'PRD-8352', name: 'Bàn phím cơ không dây', sku: 'KEY-WL-87', category: 'Điện tử', price: '899.000đ', stock: 5, status: 'Cảnh báo', note: 'Tồn kho thấp' },
  { id: 'PRD-8214', name: 'Túi tote canvas basic', sku: 'BAG-TOTE-04', category: 'Thời trang', price: '149.000đ', stock: 0, status: 'Tạm ẩn', note: 'Hết hàng' },
  { id: 'PRD-8188', name: 'Nồi chiên không dầu 5L', sku: 'AF-5L-2026', category: 'Gia dụng', price: '1.290.000đ', stock: 19, status: 'Chờ duyệt', note: 'Đang xác minh chứng từ' },
  { id: 'PRD-8061', name: 'Áo sơ mi linen form rộng', sku: 'SM-LINEN-12', category: 'Thời trang', price: '279.000đ', stock: 34, status: 'Đang bán', note: 'Điểm nội dung 95' },
];

const marketCategories = [
  {
    id: 'dien-thoai-thong-minh',
    name: 'Điện thoại thông minh',
    keyword: 'iPhone 15 Pro Max 256GB',
    demand: 92,
    trend: '+8,4%',
    recommendedPrice: 29290000,
    marketAverage: 30180000,
    competitorCount: 6,
    sampleCount: 126,
    status: 'Nên cạnh tranh',
    strategy: 'Giữ giá thấp hơn trung bình thị trường 2-3%, ưu tiên bundle ốp lưng và sạc nhanh thay vì giảm sâu.',
    sources: [
      { source: 'TopZone', min: 29990000, avg: 30990000, max: 31990000, sales: '1.240+', rating: 4.9, promo: 'Trả góp 0%', trust: 98 },
      { source: 'FPT Shop', min: 29790000, avg: 30590000, max: 31590000, sales: '980+', rating: 4.8, promo: 'Voucher 800K', trust: 96 },
      { source: 'CellphoneS', min: 29490000, avg: 30290000, max: 31290000, sales: '1.560+', rating: 4.8, promo: 'Giảm 1 triệu', trust: 95 },
      { source: 'Shopee Mall', min: 28890000, avg: 29820000, max: 30990000, sales: '3.800+', rating: 4.7, promo: 'Freeship + voucher', trust: 89 },
      { source: 'TikTok Shop', min: 28690000, avg: 29650000, max: 30690000, sales: '2.100+', rating: 4.6, promo: 'Flash sale', trust: 84 },
      { source: 'Điện Máy Xanh', min: 30190000, avg: 31290000, max: 31990000, sales: '760+', rating: 4.8, promo: 'Bảo hành 12 tháng', trust: 97 },
    ],
  },
  {
    id: 'laptop',
    name: 'Máy tính xách tay',
    keyword: 'MacBook Air M2 13 inch 256GB',
    demand: 78,
    trend: '+3,1%',
    recommendedPrice: 21990000,
    marketAverage: 22720000,
    competitorCount: 5,
    sampleCount: 84,
    status: 'Theo dõi',
    strategy: 'Giữ giá sát nhóm cửa hàng uy tín, nhấn mạnh bảo hành và chính sách đổi trả để không phải đua giá với marketplace.',
    sources: [
      { source: 'TopZone', min: 22490000, avg: 22990000, max: 23690000, sales: '680+', rating: 4.9, promo: 'Trả góp 0%', trust: 98 },
      { source: 'FPT Shop', min: 22290000, avg: 22850000, max: 23590000, sales: '720+', rating: 4.8, promo: 'Voucher 500K', trust: 96 },
      { source: 'CellphoneS', min: 21990000, avg: 22690000, max: 23390000, sales: '940+', rating: 4.8, promo: 'Balo + Office', trust: 95 },
      { source: 'Shopee Mall', min: 21490000, avg: 22190000, max: 22990000, sales: '1.870+', rating: 4.7, promo: 'Mã giảm 5%', trust: 88 },
      { source: 'Điện Máy Xanh', min: 22990000, avg: 23790000, max: 24490000, sales: '520+', rating: 4.7, promo: 'Hỗ trợ kỹ thuật', trust: 94 },
    ],
  },
  {
    id: 'op-lung-bao-da',
    name: 'Ốp lưng & Bao da',
    keyword: 'Ốp lưng MagSafe iPhone 15 Pro Max',
    demand: 86,
    trend: '+12,6%',
    recommendedPrice: 249000,
    marketAverage: 272000,
    competitorCount: 6,
    sampleCount: 214,
    status: 'Có cơ hội',
    strategy: 'Đẩy combo cáp + củ sạc, dùng voucher theo giỏ hàng vì biên lợi nhuận phụ kiện còn tốt.',
    sources: [
      { source: 'CellphoneS', min: 259000, avg: 289000, max: 329000, sales: '2.900+', rating: 4.8, promo: 'Mua kèm giảm 10%', trust: 94 },
      { source: 'FPT Shop', min: 279000, avg: 309000, max: 349000, sales: '1.600+', rating: 4.7, promo: 'Bảo hành 12 tháng', trust: 93 },
      { source: 'Shopee Mall', min: 219000, avg: 252000, max: 299000, sales: '9.800+', rating: 4.6, promo: 'Flash voucher', trust: 82 },
      { source: 'TikTok Shop', min: 199000, avg: 238000, max: 289000, sales: '7.400+', rating: 4.5, promo: 'Live deal', trust: 78 },
      { source: 'TopZone', min: 299000, avg: 339000, max: 399000, sales: '840+', rating: 4.9, promo: 'Hàng Apple MFi', trust: 97 },
      { source: 'Điện Máy Xanh', min: 269000, avg: 315000, max: 369000, sales: '1.200+', rating: 4.7, promo: 'Đổi trả 30 ngày', trust: 94 },
    ],
  },
  {
    id: 'tai-nghe-bluetooth',
    name: 'Tai nghe Bluetooth',
    keyword: 'Tai nghe bluetooth chống ồn',
    demand: 81,
    trend: '+6,9%',
    recommendedPrice: 1290000,
    marketAverage: 1385000,
    competitorCount: 5,
    sampleCount: 148,
    status: 'Nên chạy quảng cáo',
    strategy: 'Chạy quảng cáo theo nhóm khách hàng học tập/làm việc, dùng review và video demo chống ồn làm điểm khác biệt.',
    sources: [
      { source: 'Shopee Mall', min: 1190000, avg: 1320000, max: 1490000, sales: '5.200+', rating: 4.7, promo: 'Voucher 12%', trust: 86 },
      { source: 'TikTok Shop', min: 1090000, avg: 1260000, max: 1450000, sales: '4.600+', rating: 4.6, promo: 'Live sale', trust: 80 },
      { source: 'CellphoneS', min: 1350000, avg: 1490000, max: 1690000, sales: '1.100+', rating: 4.8, promo: 'Bảo hành chính hãng', trust: 95 },
      { source: 'FPT Shop', min: 1390000, avg: 1530000, max: 1720000, sales: '940+', rating: 4.8, promo: 'Trả góp 0%', trust: 94 },
      { source: 'Điện Máy Xanh', min: 1450000, avg: 1580000, max: 1790000, sales: '860+', rating: 4.7, promo: 'Đổi trả nhanh', trust: 93 },
    ],
  },
  {
    id: 'dong-ho-thong-minh',
    name: 'Đồng hồ thông minh',
    keyword: 'Apple Watch SE GPS 40mm',
    demand: 74,
    trend: '-1,8%',
    recommendedPrice: 5890000,
    marketAverage: 6210000,
    competitorCount: 5,
    sampleCount: 72,
    status: 'Cẩn trọng tồn kho',
    strategy: 'Không nhập thêm quá nhiều; ưu tiên bán kèm dây đeo và bảo hành mở rộng để tăng giá trị đơn hàng.',
    sources: [
      { source: 'TopZone', min: 6190000, avg: 6490000, max: 6990000, sales: '520+', rating: 4.9, promo: 'Thu cũ đổi mới', trust: 98 },
      { source: 'FPT Shop', min: 5990000, avg: 6290000, max: 6790000, sales: '610+', rating: 4.8, promo: 'Voucher 300K', trust: 96 },
      { source: 'CellphoneS', min: 5790000, avg: 6120000, max: 6590000, sales: '780+', rating: 4.8, promo: 'Tặng dây đeo', trust: 95 },
      { source: 'Shopee Mall', min: 5590000, avg: 5920000, max: 6390000, sales: '1.900+', rating: 4.6, promo: 'Freeship', trust: 85 },
      { source: 'TikTok Shop', min: 5490000, avg: 5840000, max: 6290000, sales: '1.250+', rating: 4.5, promo: 'Deal livestream', trust: 79 },
    ],
  },
];

function findMarketCategoryPath(nodes, targetId, path = []) {
  for (const node of nodes) {
    const nextPath = [...path, node];
    if (node.id === targetId) return nextPath;
    if (node.children) {
      const found = findMarketCategoryPath(node.children, targetId, nextPath);
      if (found) return found;
    }
  }
  return null;
}

function findMarketCategoryNode(nodes, targetId) {
  for (const node of nodes) {
    if (node.id === targetId) return node;
    if (node.children) {
      const found = findMarketCategoryNode(node.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

function flattenMarketCategoryLeaves(nodes, prefix = '') {
  return nodes.flatMap((node) => {
    const fullName = prefix ? `${prefix} > ${node.name}` : node.name;
    if (!node.children || node.children.length === 0) return [{ id: node.id, name: node.name, fullName }];
    return flattenMarketCategoryLeaves(node.children, fullName);
  });
}

function buildFallbackMarketCategory(categoryId) {
  const path = findMarketCategoryPath(ELECTRONICS_CATEGORIES, categoryId) || [];
  const leaf = path.at(-1) || { id: categoryId, name: 'Hạng mục đang chọn' };
  const seed = [...leaf.id].reduce((total, char) => total + char.charCodeAt(0), 0);
  const basePrice = 180000 + (seed % 34) * 85000;
  const average = Math.round(basePrice * 1.08 / 10000) * 10000;
  const recommended = Math.round(basePrice * 0.98 / 10000) * 10000;
  const sourceTemplates = [
    ['Shopee Mall', 0.86, 1.02, 1.18, '3.200+', 4.6, 'Voucher ngành hàng', 84],
    ['TikTok Shop', 0.82, 0.98, 1.13, '2.600+', 4.5, 'Deal livestream', 79],
    ['CellphoneS', 0.98, 1.08, 1.22, '780+', 4.8, 'Bảo hành chính hãng', 94],
    ['FPT Shop', 1.02, 1.12, 1.26, '640+', 4.7, 'Trả góp 0%', 93],
    ['Điện Máy Xanh', 1.04, 1.15, 1.3, '520+', 4.7, 'Đổi trả nhanh', 92],
  ];

  return {
    id: leaf.id,
    name: leaf.name,
    keyword: leaf.name,
    demand: 68 + (seed % 24),
    trend: seed % 3 === 0 ? '-1,6%' : `+${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(2.4 + (seed % 8))}%`,
    recommendedPrice: recommended,
    marketAverage: average,
    competitorCount: sourceTemplates.length,
    sampleCount: 54 + (seed % 96),
    status: seed % 3 === 0 ? 'Theo dõi' : 'Có cơ hội',
    strategy: `Dùng dữ liệu mẫu cho ${path.map((item) => item.name).join(' > ') || leaf.name}; nên kiểm tra thêm giá thực tế trước khi nhập hàng hoặc chạy khuyến mãi.`,
    sources: sourceTemplates.map(([source, minFactor, avgFactor, maxFactor, sales, rating, promo, trust]) => ({
      source,
      min: Math.round((basePrice * minFactor) / 10000) * 10000,
      avg: Math.round((basePrice * avgFactor) / 10000) * 10000,
      max: Math.round((basePrice * maxFactor) / 10000) * 10000,
      sales,
      rating,
      promo,
      trust,
    })),
  };
}

function getMarketCategoryById(categoryId) {
  return marketCategories.find((category) => category.id === categoryId) || buildFallbackMarketCategory(categoryId);
}

const DEFAULT_MARKET_CATEGORY_ID = 'op-lung-bao-da';


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

const operationsTrend = Array.from({ length: 90 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (89 - index));
  const weekdayFactor = [0.82, 0.94, 1.02, 1.06, 1.09, 1.23, 1.17][date.getDay()];
  const growthFactor = 1 + index * 0.0048;
  const campaignBoost = index > 72 && index < 81 ? 1.16 : 1;
  const gmv = Math.round((1.58 + Math.sin(index / 4.4) * 0.18 + Math.cos(index / 9) * 0.12) * weekdayFactor * growthFactor * campaignBoost * 100) / 100;
  return {
    date,
    label: new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(date),
    gmv,
    orders: Math.round(gmv * 1640),
  };
});

const orderStatusBreakdown = [
  { label: 'Đang xử lý', value: 4821, share: 42, tone: '#5546e8' },
  { label: 'Đang giao', value: 3764, share: 33, tone: '#3b82f6' },
  { label: 'Hoàn thành', value: 2189, share: 19, tone: '#10b981' },
  { label: 'Cần xử lý', value: 687, share: 6, tone: '#f97316' },
];

const conversionSteps = [
  { label: 'Lượt truy cập', value: '1,28 triệu', percent: 100 },
  { label: 'Thêm vào giỏ', value: '184.620', percent: 67 },
  { label: 'Tạo đơn hàng', value: '38.294', percent: 38 },
  { label: 'Thanh toán', value: '34.861', percent: 29 },
];

const notificationItems = [
  ['Seller mới chờ duyệt', '4 hồ sơ được gửi trong 30 phút qua', 'orange'],
  ['Cảnh báo thanh toán', '2 giao dịch trên 20 triệu cần kiểm tra', 'red'],
  ['SLA giao hàng', 'Tuyến TP.HCM đang giảm 1,4%', 'blue'],
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

function formatInteger(value) {
  return new Intl.NumberFormat('vi-VN').format(value);
}

function formatGmv(value) {
  return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(value)} tỷ`;
}

function formatVnd(value) {
  return `${new Intl.NumberFormat('vi-VN').format(value)}đ`;
}

function formatShortVnd(value) {
  if (value >= 1000000) {
    return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(value / 1000000)}tr`;
  }
  return `${new Intl.NumberFormat('vi-VN').format(value / 1000)}K`;
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

export default function AdminDashboard() {
  const [session, setSession] = useState(readAdminSession);
  const [active, setActive] = useState('tong-quan');
  const [vendors, setVendors] = useState(initialVendors);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (session) {
      authApi.getMe()
        .then((res) => {
          const profile = res.data.data;
          if (profile.role !== 'admin') {
            handleLogout();
          }
        })
        .catch(() => {
          handleLogout();
        });
    }
  }, [session]);

  const pendingCount = vendors.filter((vendor) => !['Đã duyệt', 'Từ chối'].includes(vendor.status)).length;

  function handleLogin(admin) {
    const nextSession = {
      name: admin.name || admin.email.split('@')[0] || 'admin',
      email: admin.email,
      role: 'Quản trị viên hệ thống',
      signedInAt: new Date().toISOString(),
    };
    localStorage.setItem('adminSession', JSON.stringify(nextSession));
    setSession(nextSession);
  }

  function handleLogout() {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setSession(null);
    setActive('tong-quan');
  }

  const handleNavigate = (id) => {
    setActive(id);
    setMobileOpen(false);
  };

  const updateVendorStatus = (id, status) => {
    setVendors((current) => current.map((vendor) => (vendor.id === id ? { ...vendor, status } : vendor)));
    const shop = vendors.find((vendor) => vendor.id === id)?.shop;
    setToast({ title: 'Đã cập nhật gian hàng', message: `${shop || id}: ${status}.`, tone: status === 'Từ chối' ? 'red' : 'green' });
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
        <AdminTopbar active={active} session={session} onNavigate={handleNavigate} onOpenMenu={() => setMobileOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <AdminSection active={active} vendors={vendors} onNavigate={handleNavigate} onToast={setToast} onVendorStatus={updateVendorStatus} />
        </main>
      </div>
      {toast && <AdminToast toast={toast} onClose={() => setToast(null)} />}
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

function AdminTopbar({ active, session, onNavigate, onOpenMenu }) {
  const [query, setQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];
    return [
      ...adminNavItems.map((item) => ({ id: item.id, title: item.label, meta: 'Chức năng quản trị', icon: item.icon })),
      ...products.map((product) => ({ id: 'san-pham', title: product.name, meta: product.sku, icon: Boxes })),
      ...initialVendors.map((vendor) => ({ id: 'duyet-shop', title: vendor.shop, meta: vendor.owner, icon: Store })),
    ].filter((item) => `${item.title} ${item.meta}`.toLowerCase().includes(normalizedQuery)).slice(0, 5);
  }, [query]);

  const handleSearchResult = (id) => {
    onNavigate(id);
    setQuery('');
  };

  useEffect(() => {
    setNotificationsOpen(false);
    setQuery('');
  }, [active]);

  return (
    <header className="admin-topbar sticky top-0 z-30 flex h-[72px] items-center gap-3 px-4 sm:px-6 lg:px-8">
      <button type="button" aria-label="Mở menu" onClick={onOpenMenu} className="admin-icon-button lg:hidden">
        <Menu className="h-5 w-5" />
      </button>
      <div className="relative max-w-xl flex-1 lg:ml-auto">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setNotificationsOpen(false)}
          onBlur={() => window.setTimeout(() => setQuery(''), 120)}
          className="admin-search h-10 w-full pl-10 pr-4 text-sm"
          placeholder="Tìm chức năng, shop hoặc sản phẩm..."
        />
        {query && (
          <div className="admin-dropdown absolute inset-x-0 top-12 overflow-hidden p-1">
            {searchResults.length > 0 ? searchResults.map(({ id, title, meta, icon: Icon }) => (
              <button key={`${id}-${title}`} type="button" className="admin-dropdown-item" onClick={() => handleSearchResult(id)}>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-admin-accent"><Icon className="h-4 w-4" /></span>
                <span className="min-w-0 text-left">
                  <span className="block truncate text-sm font-bold text-slate-700">{title}</span>
                  <span className="block truncate text-xs font-semibold text-slate-400">{meta}</span>
                </span>
              </button>
            )) : <p className="px-3 py-4 text-center text-xs font-semibold text-slate-400">Không tìm thấy kết quả phù hợp.</p>}
          </div>
        )}
      </div>
      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <div className="relative">
          <button type="button" aria-label="Thông báo" className="admin-icon-button relative" onClick={() => { setQuery(''); setNotificationsOpen((current) => !current); }}>
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-orange-500" />
          </button>
          {notificationsOpen && (
            <div className="admin-dropdown absolute right-0 top-12 w-80 p-2">
              <div className="flex items-center justify-between px-2 py-2">
                <p className="text-sm font-extrabold text-slate-900">Thông báo vận hành</p>
                <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-extrabold text-indigo-700">3 mới</span>
              </div>
              {notificationItems.map(([title, message, tone]) => (
                <button key={title} type="button" className="admin-dropdown-item">
                  <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', {
                    'bg-orange-400': tone === 'orange',
                    'bg-red-500': tone === 'red',
                    'bg-blue-500': tone === 'blue',
                  })} />
                  <span className="text-left">
                    <span className="block text-xs font-extrabold text-slate-700">{title}</span>
                    <span className="mt-1 block text-[11px] font-medium leading-4 text-slate-400">{message}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
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

function AdminToast({ toast, onClose }) {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 3500);
    return () => window.clearTimeout(timeout);
  }, [onClose, toast]);

  return (
    <div className="admin-toast fixed bottom-5 right-5 z-[70] flex max-w-sm items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-950/10">
      <span className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', toast.tone === 'red' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600')}>
        {toast.tone === 'red' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-extrabold text-slate-800">{toast.title}</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{toast.message}</p>
      </div>
      <button type="button" aria-label="Đóng thông báo" onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="h-4 w-4" /></button>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const canSubmit = form.email.trim() && form.password.trim();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      setError('Vui lòng nhập email và mật khẩu quản trị.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // 1. Đăng nhập qua authApi
      const loginResponse = await authApi.login({
        identifier: form.email.trim(),
        password: form.password,
      });
      const { accessToken, refreshToken } = loginResponse.data;

      // 2. Lưu token vào localStorage tạm thời để gọi getMe
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // 3. Lấy thông tin cá nhân để check role
      const meResponse = await authApi.getMe();
      const profile = meResponse.data.data;

      if (profile.role !== 'admin') {
        // Nếu không phải admin thì xóa token và báo lỗi
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setError('Tài khoản của bạn không có quyền truy cập quản trị.');
        return;
      }

      // 4. Kích hoạt session admin
      onLogin({ email: profile.email, name: profile.fullName });
    } catch (err) {
      // Xóa token nhỡ có lỗi xảy ra
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.';
      setError(msg);
    } finally {
      setLoading(false);
    }
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
                disabled={loading}
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
                disabled={loading}
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
            <button type="submit" className="admin-primary-button mt-6 h-12 w-full justify-center" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
              {loading ? 'Đang xác thực...' : 'Đăng nhập'}
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

function AdminSection({ active, vendors, onNavigate, onToast, onVendorStatus }) {
  if (active === 'tong-quan') return <OverviewSection vendors={vendors} onNavigate={onNavigate} onToast={onToast} />;
  if (active === 'duyet-shop') return <VendorApprovalSection vendors={vendors} onToast={onToast} onVendorStatus={onVendorStatus} />;
  if (active === 'san-pham') return <ProductsSection onToast={onToast} />;
  if (active === 'nghien-cuu-thi-truong') return <MarketResearchSection onToast={onToast} />;
  if (active === 'nguoi-dung') return <UserManagementSection onToast={onToast} />;
  if (active === 'don-hang') return <DataSection title="Giám sát đơn hàng" subtitle="Theo dõi trạng thái đơn, SLA xử lý, seller phụ trách và giá trị giao dịch." columns={['Mã đơn', 'Khách hàng', 'Shop', 'Giá trị', 'Trạng thái']} rows={orders} onToast={onToast} />;
  if (active === 'tai-chinh') return <DataSection title="Tài chính & đối soát" subtitle="Quản lý rút tiền, hoàn tiền, phí nền tảng và kỳ đối soát seller." columns={['Hạng mục', 'Giá trị', 'Trạng thái', 'Ghi chú']} rows={financeRows} onToast={onToast} />;
  if (active === 'kiem-duyet') return <DataSection title="Trung tâm kiểm duyệt" subtitle="Xử lý nội dung, khiếu nại, gian lận thanh toán và vi phạm seller." columns={['Hàng đợi', 'Số lượng', 'Mô tả']} rows={moderationItems} onToast={onToast} />;
  if (active === 'bao-cao') return <ReportsSection onToast={onToast} />;
  return <SettingsSection />;
}

function UserManagementSection({ onToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [togglingId, setTogglingId] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getAllProfiles();
      setUsers(response.data?.data || []);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    setTogglingId(user.id);
    try {
      const response = await adminApi.toggleProfileStatus(user.id);
      const updatedUser = response.data?.data;
      if (updatedUser) {
        setUsers((current) =>
          current.map((u) => (u.id === user.id ? updatedUser : u))
        );
        onToast({
          title: 'Đã cập nhật trạng thái',
          message: `Tài khoản ${user.fullName} đã được ${updatedUser.isActive ? 'mở khóa' : 'khóa'}.`,
          tone: 'green',
        });
      }
    } catch (err) {
      console.error(err);
      onToast({
        title: 'Thao tác thất bại',
        message: err?.response?.data?.message || 'Có lỗi xảy ra khi thay đổi trạng thái người dùng.',
        tone: 'red',
      });
    } finally {
      setTogglingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = query.toLowerCase().trim();
    return (
      (u.fullName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  });

  const getRoleLabel = (role) => {
    const r = (role || '').toLowerCase();
    if (r === 'admin') return 'Quản trị viên';
    if (r === 'vendor') return 'Người bán';
    return 'Khách hàng';
  };

  const getRoleBadgeClass = (role) => {
    const r = (role || '').toLowerCase();
    if (r === 'admin') return 'bg-purple-50 text-purple-700 border border-purple-100';
    if (r === 'vendor') return 'bg-indigo-50 text-indigo-700 border border-indigo-100';
    return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
  };

  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <PageHeader title="Quản lý người dùng" subtitle="Theo dõi danh sách khách hàng, người bán và quản lý trạng thái tài khoản." />
      
      <Toolbar query={query} searchPlaceholder="Tìm theo tên, email, số điện thoại..." onQueryChange={(q) => { setQuery(q); setPage(1); }} onReset={() => { setQuery(''); setPage(1); }} />
      
      <section className="admin-panel mt-5 overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center gap-2 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin text-admin-accent" />
            <span className="text-sm font-bold">Đang tải dữ liệu người dùng...</span>
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center text-center p-5">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <p className="mt-3 text-sm font-extrabold text-slate-700">{error}</p>
            <button type="button" onClick={fetchUsers} className="admin-secondary-button mt-4">Thử lại</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="admin-table-head">
                <tr>
                  <th className="px-5 py-3.5">Mã người dùng</th>
                  <th className="px-5 py-3.5">Họ tên & Email</th>
                  <th className="px-5 py-3.5">Số điện thoại</th>
                  <th className="px-5 py-3.5">Vai trò</th>
                  <th className="px-5 py-3.5">Ngày tham gia</th>
                  <th className="px-5 py-3.5">Trạng thái</th>
                  <th className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="admin-table-row">
                    <td className="px-5 py-4 font-bold text-slate-800">
                      {user.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-bold text-slate-800">{user.fullName}</p>
                        <p className="text-xs font-semibold text-slate-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-600">
                      {user.phone || 'N/A'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('admin-status-pill rounded px-2 py-1 text-xs font-bold', getRoleBadgeClass(user.role))}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </td>
                    <td className="px-5 py-4">
                      {user.isActive ? (
                        <span className="admin-status-pill bg-emerald-50 text-emerald-700">Đang hoạt động</span>
                      ) : (
                        <span className="admin-status-pill bg-red-50 text-red-600">Bị khóa</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {user.role !== 'admin' && (
                        <button
                          type="button"
                          disabled={togglingId === user.id}
                          onClick={() => handleToggleStatus(user)}
                          className={cn(
                            'admin-link-button font-bold text-sm inline-flex items-center gap-1',
                            user.isActive ? 'text-red-500 hover:text-red-700' : 'text-indigo-600 hover:text-indigo-800'
                          )}
                        >
                          {togglingId === user.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : user.isActive ? (
                            'Khóa tài khoản'
                          ) : (
                            'Mở khóa'
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && <TableEmptyState />}
            <TableFooter count={filteredUsers.length} page={page} pageSize={pageSize} onPageChange={setPage} />
          </div>
        )}
      </section>
    </div>
  );
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

function OverviewSection({ vendors, onNavigate, onToast }) {
  const [range, setRange] = useState(30);
  const pending = vendors.filter((vendor) => !['Đã duyệt', 'Từ chối'].includes(vendor.status)).length;
  const riskHigh = vendors.filter((vendor) => vendor.risk === 'Cao').length;
  const trend = operationsTrend.slice(-range);
  const latest = trend.at(-1);
  const previous = trend.at(-2);
  const gmvChange = ((latest.gmv - previous.gmv) / previous.gmv) * 100;
  const metrics = [
    { label: 'GMV hôm nay', value: formatGmv(latest.gmv), change: `${gmvChange >= 0 ? '+' : ''}${gmvChange.toFixed(1).replace('.', ',')}%`, note: 'so với hôm qua', icon: BarChart3, tone: 'purple', target: 'tai-chinh' },
    { label: 'Đơn đang xử lý', value: formatInteger(4821), change: '+8,6%', note: '312 đơn cần theo dõi', icon: ShoppingBag, tone: 'blue', target: 'don-hang' },
    { label: 'Shop chờ duyệt', value: formatInteger(pending), change: '+4 hồ sơ', note: 'trong 24 giờ qua', icon: Store, tone: 'orange', target: 'duyet-shop' },
    { label: 'Tỷ lệ SLA', value: '97,6%', change: '+1,1%', note: 'so với tuần trước', icon: Gauge, tone: 'green', target: 'kiem-duyet' },
  ];

  const exportOverview = () => {
    downloadCsv('shopvn-gmv.csv', ['Ngày', 'GMV (tỷ)', 'Số đơn'], trend.map((item) => [item.label, item.gmv, item.orders]));
    onToast({ title: 'Đã xuất báo cáo', message: `Dữ liệu GMV ${range} ngày đã được tải xuống.`, tone: 'green' });
  };

  return (
    <div>
      <PageHeader eyebrow={getTodayLabel()} title="Tổng quan vận hành" subtitle="Theo dõi các chỉ số và hàng đợi quan trọng của ShopVN trong hôm nay.">
        <button type="button" className="admin-secondary-button" onClick={() => onToast({ title: 'Phạm vi dữ liệu', message: 'Các chỉ số đang được tổng hợp theo ngày hôm nay.', tone: 'green' })}>
          <CalendarDays className="h-4 w-4" />
          Hôm nay
        </button>
        <button type="button" className="admin-primary-button" onClick={exportOverview}>
          <ArrowDownToLine className="h-4 w-4" />
          Xuất báo cáo
        </button>
      </PageHeader>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => <MetricCard key={metric.label} metric={metric} onClick={() => onNavigate(metric.target)} />)}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.65fr_0.85fr]">
        <div className="admin-panel min-w-0 p-5">
          <PanelHeader title="GMV theo ngày" subtitle={`Tổng doanh thu nền tảng trong ${range} ngày gần nhất`}>
            {[7, 30, 90].map((period) => (
              <button key={period} type="button" onClick={() => setRange(period)} className={cn('admin-tab', range === period && 'is-active')}>
                {period} ngày
              </button>
            ))}
          </PanelHeader>
          <AdminActivityChart data={trend} />
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

      <section className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <OrderStatusCard onNavigate={() => onNavigate('don-hang')} />
        <ConversionCard />
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

function ProductsSection({ onToast }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesQuery = `${product.name} ${product.sku}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (!category || product.category === category) && (!status || product.status === status);
  }), [category, query, status]);
  const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);
  const resetFilters = () => {
    setQuery('');
    setCategory('');
    setStatus('');
    setPage(1);
  };

  return (
    <div>
      <PageHeader title="Quản lý sản phẩm" subtitle="Kiểm tra sản phẩm, tồn kho, chất lượng nội dung và cảnh báo vi phạm.">
        <button type="button" className="admin-primary-button" onClick={() => onToast({ title: 'Sẵn sàng thêm sản phẩm', message: 'Flow tạo sản phẩm sẽ mở tại bước nhập thông tin cơ bản.', tone: 'green' })}>
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </button>
      </PageHeader>
      <Toolbar query={query} searchPlaceholder="Tìm theo tên hoặc SKU" onQueryChange={(value) => { setQuery(value); setPage(1); }} onReset={resetFilters}>
        <ToolbarSelect value={category} onChange={(value) => { setCategory(value); setPage(1); }} placeholder="Tất cả ngành hàng" options={['Thời trang', 'Điện tử', 'Làm đẹp', 'Gia dụng']} />
        <ToolbarSelect value={status} onChange={(value) => { setStatus(value); setPage(1); }} placeholder="Trạng thái sản phẩm" options={['Đang bán', 'Chờ duyệt', 'Cảnh báo', 'Tạm ẩn']} />
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
              {visibleProducts.map((product) => (
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
                    <button type="button" aria-label={`Thao tác ${product.name}`} className="admin-icon-button" onClick={() => onToast({ title: product.name, message: 'Đã mở menu thao tác nhanh cho sản phẩm.', tone: 'green' })}>
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visibleProducts.length === 0 && <TableEmptyState />}
        <TableFooter count={filteredProducts.length} page={page} pageSize={pageSize} onPageChange={setPage} />
      </section>
    </div>
  );
}

function MarketResearchSection({ onToast }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(DEFAULT_MARKET_CATEGORY_ID);
  const [source, setSource] = useState('');
  const [query, setQuery] = useState('');
  const [lastSync, setLastSync] = useState('08:45 hôm nay');
  const selectedCategory = getMarketCategoryById(selectedCategoryId);
  const selectedPath = findMarketCategoryPath(ELECTRONICS_CATEGORIES, selectedCategoryId) || [];
  const selectedBreadcrumb = selectedPath.map((item) => item.name).join(' > ') || selectedCategory.name;
  const sourceOptions = Array.from(new Set(selectedCategory.sources.map((item) => item.source)));
  const filteredSources = selectedCategory.sources.filter((item) => {
    const matchesSource = !source || item.source === source;
    const matchesQuery = `${item.source} ${item.promo}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesSource && matchesQuery;
  });
  const lowestSource = selectedCategory.sources.reduce((best, item) => (item.min < best.min ? item : best), selectedCategory.sources[0]);
  const highestTrust = selectedCategory.sources.reduce((best, item) => (item.trust > best.trust ? item : best), selectedCategory.sources[0]);
  const avgDiff = selectedCategory.marketAverage - selectedCategory.recommendedPrice;
  const metrics = [
    { label: 'Giá trung bình', value: formatShortVnd(selectedCategory.marketAverage), change: selectedCategory.trend, note: 'xu hướng nhu cầu', icon: BarChart3, tone: 'purple' },
    { label: 'Giá đề xuất', value: formatShortVnd(selectedCategory.recommendedPrice), change: avgDiff > 0 ? `-${Math.round((avgDiff / selectedCategory.marketAverage) * 100)}%` : 'Sát thị trường', note: 'so với trung bình', icon: Gauge, tone: 'green' },
    { label: 'Nguồn đối chiếu', value: formatInteger(selectedCategory.competitorCount), change: `${selectedCategory.sampleCount} mẫu`, note: 'dữ liệu mock', icon: Store, tone: 'blue' },
    { label: 'Mức quan tâm', value: `${selectedCategory.demand}/100`, change: selectedCategory.status, note: 'đánh giá cơ hội', icon: TrendingUp, tone: selectedCategory.demand >= 85 ? 'orange' : 'purple' },
  ];

  const resetFilters = () => {
    setSource('');
    setQuery('');
  };

  const syncMarketData = () => {
    const now = new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(new Date());
    setLastSync(`${now} hôm nay`);
    onToast({ title: 'Đã cập nhật dữ liệu mẫu', message: `Mock data cho ${selectedCategory.name} đã được làm mới.`, tone: 'green' });
  };

  const exportMarketRows = () => {
    downloadCsv(
      `market-research-${selectedCategory.id}.csv`,
      ['Danh mục', 'Sản phẩm mẫu', 'Nguồn bán', 'Giá thấp nhất', 'Giá trung bình', 'Giá cao nhất', 'Lượt bán', 'Đánh giá', 'Khuyến mãi', 'Độ tin cậy'],
      filteredSources.map((item) => [
        selectedCategory.name,
        selectedCategory.keyword,
        item.source,
        item.min,
        item.avg,
        item.max,
        item.sales,
        item.rating,
        item.promo,
        `${item.trust}%`,
      ]),
    );
    onToast({ title: 'Đã xuất nghiên cứu thị trường', message: `${filteredSources.length} nguồn bán đã được tải xuống.`, tone: 'green' });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Market insight"
        title="Nghiên cứu thị trường"
        subtitle="So sánh giá bán theo hạng mục, theo dõi đối thủ và đề xuất chiến lược định giá cho toàn hệ thống."
      >
        <button type="button" className="admin-secondary-button" onClick={exportMarketRows}>
          <ArrowDownToLine className="h-4 w-4" />
          Xuất báo cáo
        </button>
        <button type="button" className="admin-primary-button" onClick={syncMarketData}>
          <RefreshCw className="h-4 w-4" />
          Cập nhật dữ liệu
        </button>
      </PageHeader>

      <section className="admin-panel p-4">
        <div className="grid gap-4 xl:grid-cols-[1fr_0.72fr] xl:items-start">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Hạng mục nghiên cứu</p>
              <span className="hidden text-[11px] font-bold text-slate-400 sm:inline">Dùng chung cây hạng mục SellerCenter</span>
            </div>
            <MarketCategoryPicker
              value={selectedCategoryId}
              onChange={(categoryId) => {
                setSelectedCategoryId(categoryId);
                resetFilters();
              }}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {marketCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                    resetFilters();
                  }}
                  className={cn('admin-tab min-h-9 px-3 text-xs', selectedCategory.id === category.id && 'is-active')}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2 text-xs font-semibold text-slate-500 sm:grid-cols-2 xl:grid-cols-1">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2">
              <ChevronRight className="h-4 w-4 text-admin-accent" />
              Đường dẫn: <strong className="min-w-0 truncate text-slate-800">{selectedBreadcrumb}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2">
              <PackageSearch className="h-4 w-4 text-admin-accent" />
              Sản phẩm mẫu: <strong className="text-slate-800">{selectedCategory.keyword}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2">
              <RefreshCw className="h-4 w-4 text-slate-400" />
              Cập nhật: {lastSync}
            </span>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => <MarketMetricCard key={metric.label} metric={metric} />)}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_0.9fr]">
        <div className="admin-panel min-w-0 p-5">
          <PanelHeader title="Khoảng giá theo nguồn bán" subtitle="Giá thấp nhất, trung bình và cao nhất từ dữ liệu mock">
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-extrabold text-indigo-700">
              {selectedCategory.sources.length} nguồn
            </span>
          </PanelHeader>
          <MarketPriceChart sources={selectedCategory.sources} recommendedPrice={selectedCategory.recommendedPrice} />
        </div>
        <div className="admin-panel p-5">
          <PanelHeader title="Đề xuất kinh doanh" subtitle="Gợi ý cho Admin khi quyết định giá và khuyến mãi" />
          <div className="mt-5 space-y-3">
            <MarketInsightItem icon={Gauge} label="Giá nên niêm yết" value={formatVnd(selectedCategory.recommendedPrice)} tone="green" />
            <MarketInsightItem icon={Store} label="Nguồn giá thấp nhất" value={`${lowestSource.source} - ${formatShortVnd(lowestSource.min)}`} tone="orange" />
            <MarketInsightItem icon={ShieldCheck} label="Nguồn uy tín nhất" value={`${highestTrust.source} - ${highestTrust.trust}%`} tone="blue" />
          </div>
          <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-indigo-700">Chiến lược đề xuất</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{selectedCategory.strategy}</p>
          </div>
        </div>
      </section>

      <Toolbar query={query} searchPlaceholder="Tìm nguồn bán hoặc khuyến mãi" onQueryChange={setQuery} onReset={resetFilters}>
        <ToolbarSelect value={source} onChange={setSource} placeholder="Tất cả nguồn bán" options={sourceOptions} />
      </Toolbar>

      <section className="admin-panel mt-5 overflow-hidden">
        <div className="p-5">
          <PanelHeader title="Bảng so sánh đối thủ" subtitle="Các chỉ số có thể dùng để minh họa phần nghiên cứu thị trường trong báo cáo" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="admin-table-head">
              <tr>
                {['Nguồn bán', 'Giá thấp nhất', 'Giá TB', 'Giá cao nhất', 'Lượt bán', 'Đánh giá', 'Khuyến mãi', 'Độ tin cậy'].map((column) => (
                  <th key={column} className="px-5 py-3.5">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSources.map((item) => (
                <tr key={item.source} className="admin-table-row">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 font-extrabold text-admin-accent">
                        {item.source.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-extrabold text-slate-900">{item.source}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-400">{selectedCategory.keyword}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-extrabold text-emerald-700">{formatVnd(item.min)}</td>
                  <td className="px-5 py-4 font-bold text-slate-800">{formatVnd(item.avg)}</td>
                  <td className="px-5 py-4 font-semibold text-slate-500">{formatVnd(item.max)}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{item.sales}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{item.rating}/5</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{item.promo}</td>
                  <td className="px-5 py-4">
                    <div className="flex min-w-32 items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div className="admin-progress-bar h-full rounded-full bg-indigo-500" style={{ width: `${item.trust}%` }} />
                      </div>
                      <span className="w-9 text-right text-xs font-extrabold text-slate-700">{item.trust}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSources.length === 0 && <TableEmptyState />}
        <TableFooter count={filteredSources.length} pageSize={6} />
      </section>
    </div>
  );
}

function MarketCategoryPicker({ value, onChange }) {
  const wrapperRef = useRef(null);
  const selectedPath = findMarketCategoryPath(ELECTRONICS_CATEGORIES, value) || [];
  const selectedBreadcrumb = selectedPath.map((item) => item.name).join(' > ');
  const allLeaves = useMemo(() => flattenMarketCategoryLeaves(ELECTRONICS_CATEGORIES), []);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [levelOneId, setLevelOneId] = useState(selectedPath[0]?.id || ELECTRONICS_CATEGORIES[0]?.id);
  const [levelTwoId, setLevelTwoId] = useState(selectedPath[1]?.id || ELECTRONICS_CATEGORIES[0]?.children?.[0]?.id);

  const levelOneNode = findMarketCategoryNode(ELECTRONICS_CATEGORIES, levelOneId) || ELECTRONICS_CATEGORIES[0];
  const levelTwoNode = findMarketCategoryNode(ELECTRONICS_CATEGORIES, levelTwoId) || levelOneNode?.children?.[0];
  const normalizedSearch = searchValue.trim().toLowerCase();
  const searchResults = normalizedSearch
    ? allLeaves.filter((item) => item.fullName.toLowerCase().includes(normalizedSearch)).slice(0, 8)
    : [];

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const activePath = findMarketCategoryPath(ELECTRONICS_CATEGORIES, value) || [];
    if (activePath.length === 0) return;
    setLevelOneId(activePath[0]?.id || ELECTRONICS_CATEGORIES[0]?.id);
    setLevelTwoId(activePath[1]?.id || activePath[0]?.children?.[0]?.id);
  }, [open, value]);

  const openPicker = () => {
    setOpen((current) => !current);
  };

  const selectLevelOne = (node) => {
    setLevelOneId(node.id);
    setLevelTwoId(node.children?.[0]?.id || null);
  };

  const selectLeaf = (leafId) => {
    onChange(leafId);
    setSearchValue('');
    setOpen(false);
  };

  const resetToDefault = (event) => {
    event.stopPropagation();
    onChange(DEFAULT_MARKET_CATEGORY_ID);
    setSearchValue('');
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={openPicker}
        className={cn(
          'admin-form-input flex min-h-12 w-full items-center justify-between gap-3 px-3 text-left',
          open && 'border-indigo-300 ring-4 ring-indigo-50',
        )}
      >
        <span className="min-w-0 flex-1 truncate text-sm font-extrabold text-slate-800">
          {selectedBreadcrumb || 'Chọn hạng mục nghiên cứu'}
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {value !== DEFAULT_MARKET_CATEGORY_ID && (
            <span
              role="button"
              tabIndex={0}
              onClick={resetToDefault}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') resetToDefault(event);
              }}
              className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              title="Đặt lại hạng mục mặc định"
            >
              <X className="h-4 w-4" />
            </span>
          )}
          <ChevronDown className={cn('h-4 w-4 text-slate-400 transition', open && 'rotate-180')} />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                className="admin-form-input h-11 w-full pl-9 pr-3 text-sm"
                placeholder="Tìm kiếm hạng mục..."
                autoFocus
              />
            </div>
          </div>

          {normalizedSearch ? (
            <div className="max-h-80 overflow-y-auto p-2">
              {searchResults.length > 0 ? searchResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectLeaf(item.id)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-bold text-slate-600 transition hover:bg-indigo-50 hover:text-admin-accent',
                    value === item.id && 'bg-indigo-50 text-admin-accent',
                  )}
                >
                  <PackageSearch className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{item.fullName}</span>
                </button>
              )) : (
                <div className="px-3 py-8 text-center">
                  <p className="text-sm font-extrabold text-slate-700">Không tìm thấy hạng mục</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">Thử từ khóa ngắn hơn hoặc chọn theo từng cột.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-3 py-2 text-xs font-extrabold text-orange-600">
                <button type="button" onClick={() => selectLevelOne(ELECTRONICS_CATEGORIES[0])} className="hover:text-orange-700">Tất cả hạng mục</button>
                {selectedPath.slice(0, 2).map((item) => (
                  <span key={item.id} className="inline-flex items-center gap-2">
                    <ChevronRight className="h-3.5 w-3.5" />
                    {item.name}
                  </span>
                ))}
              </div>
              <div className="grid max-h-[360px] grid-cols-3 overflow-hidden">
                <MarketCategoryColumn
                  nodes={ELECTRONICS_CATEGORIES}
                  activeId={levelOneId}
                  onSelect={selectLevelOne}
                />
                <MarketCategoryColumn
                  nodes={levelOneNode?.children || []}
                  activeId={levelTwoId}
                  onSelect={(node) => setLevelTwoId(node.id)}
                />
                <MarketCategoryColumn
                  nodes={levelTwoNode?.children || []}
                  activeId={value}
                  onSelect={(node) => selectLeaf(node.id)}
                  isLeafColumn
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MarketCategoryColumn({ nodes, activeId, onSelect, isLeafColumn = false }) {
  return (
    <div className="min-h-72 overflow-y-auto border-r border-slate-100 last:border-r-0">
      {nodes.map((node) => {
        const isActive = node.id === activeId;
        const hasChildren = Boolean(node.children?.length);

        return (
          <button
            key={node.id}
            type="button"
            onClick={() => onSelect(node)}
            className={cn(
              'flex min-h-12 w-full items-center gap-2 px-4 py-3 text-left text-sm font-bold text-slate-600 transition hover:bg-orange-50 hover:text-orange-600',
              isActive && 'bg-orange-50 text-orange-600',
            )}
          >
            {isLeafColumn && isActive && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500" />}
            <span className="min-w-0 flex-1">{node.name}</span>
            {hasChildren && <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />}
          </button>
        );
      })}
    </div>
  );
}

function MarketMetricCard({ metric }) {
  const Icon = metric.icon;
  return (
    <div className="admin-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-slate-400">{metric.label}</p>
          <p className="mt-3 truncate text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{metric.value}</p>
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

function MarketPriceChart({ sources, recommendedPrice }) {
  const maxPrice = Math.max(...sources.map((item) => item.max), recommendedPrice);
  const minPrice = Math.min(...sources.map((item) => item.min), recommendedPrice);
  const range = maxPrice - minPrice || 1;
  const recommendedPercent = ((recommendedPrice - minPrice) / range) * 100;

  return (
    <div className="mt-5 space-y-4">
      <div className="relative h-8 rounded-lg bg-slate-50">
        <span className="absolute left-0 top-0 text-[10px] font-bold text-slate-400">{formatShortVnd(minPrice)}</span>
        <span className="absolute right-0 top-0 text-[10px] font-bold text-slate-400">{formatShortVnd(maxPrice)}</span>
        <span
          className="absolute bottom-0 top-0 w-px bg-emerald-500"
          style={{ left: `${recommendedPercent}%` }}
          title={`Giá đề xuất ${formatVnd(recommendedPrice)}`}
        />
        <span
          className="absolute bottom-0 translate-x-[-50%] rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700"
          style={{ left: `${recommendedPercent}%` }}
        >
          Giá đề xuất
        </span>
      </div>
      <div className="space-y-3">
        {sources.map((item) => {
          const left = ((item.min - minPrice) / range) * 100;
          const width = ((item.max - item.min) / range) * 100;
          const avg = ((item.avg - minPrice) / range) * 100;
          return (
            <div key={item.source} className="grid gap-2 sm:grid-cols-[130px_1fr_110px] sm:items-center">
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-slate-700">{item.source}</p>
                <p className="text-[11px] font-semibold text-slate-400">{item.sales} lượt bán</p>
              </div>
              <div className="relative h-8 rounded-full bg-slate-100">
                <span
                  className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full bg-indigo-200"
                  style={{ left: `${left}%`, width: `${Math.max(width, 4)}%` }}
                />
                <span
                  className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-indigo-600 shadow-sm"
                  style={{ left: `${avg}%` }}
                  title={`Giá trung bình ${formatVnd(item.avg)}`}
                />
              </div>
              <p className="text-xs font-bold text-slate-500 sm:text-right">{formatShortVnd(item.avg)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MarketInsightItem({ icon: Icon, label, value, tone }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
      <span className={cn('admin-metric-icon h-9 w-9', `is-${tone}`)}><Icon className="h-4 w-4" /></span>
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-400">{label}</p>
        <p className="mt-1 truncate text-sm font-extrabold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function VendorApprovalSection({ vendors, onToast, onVendorStatus }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [risk, setRisk] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const filteredVendors = useMemo(() => vendors.filter((vendor) => {
    const matchesQuery = `${vendor.shop} ${vendor.owner} ${vendor.email}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (!category || vendor.category === category) && (!risk || vendor.risk === risk);
  }), [category, query, risk, vendors]);
  const visibleVendors = filteredVendors.slice((page - 1) * pageSize, page * pageSize);
  const exportVendors = () => {
    downloadCsv('shopvn-seller-approval.csv', ['Mã shop', 'Gian hàng', 'Chủ shop', 'Email', 'SĐT', 'Ngành hàng', 'Rủi ro', 'Trạng thái'], filteredVendors.map((vendor) => [vendor.id, vendor.shop, vendor.owner, vendor.email, vendor.phone, vendor.category, vendor.risk, vendor.status]));
    onToast({ title: 'Đã xuất danh sách', message: `${filteredVendors.length} hồ sơ seller đã được tải xuống.`, tone: 'green' });
  };

  return (
    <div>
      <PageHeader title="Duyệt gian hàng Seller" subtitle="Kiểm tra hồ sơ, mức độ rủi ro và quyết định kích hoạt gian hàng.">
        <button type="button" className="admin-secondary-button" onClick={exportVendors}>
          <ArrowDownToLine className="h-4 w-4" />
          Xuất danh sách
        </button>
      </PageHeader>
      <Toolbar query={query} searchPlaceholder="Tìm tên shop hoặc chủ shop" onQueryChange={(value) => { setQuery(value); setPage(1); }} onReset={() => { setQuery(''); setCategory(''); setRisk(''); setPage(1); }}>
        <ToolbarSelect value={category} onChange={(value) => { setCategory(value); setPage(1); }} placeholder="Tất cả ngành hàng" options={['Điện tử', 'Thời trang', 'Thực phẩm', 'Làm đẹp']} />
        <ToolbarSelect value={risk} onChange={(value) => { setRisk(value); setPage(1); }} placeholder="Mức độ rủi ro" options={['Thấp', 'Trung bình', 'Cao']} />
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
              {visibleVendors.map((vendor) => (
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
        {visibleVendors.length === 0 && <TableEmptyState />}
        <TableFooter count={filteredVendors.length} page={page} pageSize={pageSize} onPageChange={setPage} />
      </section>
    </div>
  );
}

function DataSection({ title, subtitle, columns, rows, onToast }) {
  const [query, setQuery] = useState('');
  const filteredRows = rows.filter((row) => row.join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  const exportRows = () => {
    downloadCsv('shopvn-data.csv', columns, filteredRows);
    onToast({ title: 'Đã xuất dữ liệu', message: `${filteredRows.length} bản ghi đã được tải xuống.`, tone: 'green' });
  };

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle}>
        <button type="button" className="admin-secondary-button" onClick={exportRows}>
          <ArrowDownToLine className="h-4 w-4" />
          Xuất dữ liệu
        </button>
      </PageHeader>
      <Toolbar query={query} searchPlaceholder="Tìm kiếm dữ liệu" onQueryChange={setQuery} onReset={() => setQuery('')} />
      <section className="admin-panel mt-5 overflow-hidden">
        <SimpleTable columns={columns} rows={filteredRows} />
        {filteredRows.length === 0 && <TableEmptyState />}
        <TableFooter count={filteredRows.length} />
      </section>
    </div>
  );
}

function ReportsSection({ onToast }) {
  return (
    <div>
      <PageHeader title="Trung tâm báo cáo" subtitle="Tổng hợp dữ liệu vận hành, tài chính và kiểm duyệt của nền tảng.">
        <button type="button" className="admin-primary-button" onClick={() => onToast({ title: 'Đã mở trình tạo báo cáo', message: 'Chọn loại báo cáo và khoảng thời gian để tiếp tục.', tone: 'green' })}>
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
            <button type="button" className="admin-link-button mt-5" onClick={() => onToast({ title: title, message: 'Báo cáo đang được chuẩn bị. Bạn sẽ nhận được thông báo khi hoàn tất.', tone: 'green' })}>
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

function MetricCard({ metric, onClick }) {
  const Icon = metric.icon;
  return (
    <button type="button" onClick={onClick} className="admin-panel admin-metric-card group w-full p-5 text-left">
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
      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-extrabold text-indigo-500 opacity-0 transition-opacity group-hover:opacity-100">
        Xem chi tiết <ArrowUpRight className="h-3 w-3" />
      </span>
    </button>
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

function AdminActivityChart({ data }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const width = 800;
  const height = 210;
  const max = Math.ceil(Math.max(...data.map((item) => item.gmv)) + 0.5);
  const points = data.map((item, index) => ({
    ...item,
    x: (index / (data.length - 1)) * width,
    y: height - (item.gmv / max) * height,
  }));
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' ');
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
  const hoveredPoint = hoverIndex === null ? null : points[hoverIndex];
  const tickIndexes = [0, Math.round((data.length - 1) * 0.25), Math.round((data.length - 1) * 0.5), Math.round((data.length - 1) * 0.75), data.length - 1];

  const handleMouseMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const index = Math.round(((event.clientX - bounds.left) / bounds.width) * (data.length - 1));
    setHoverIndex(Math.max(0, Math.min(data.length - 1, index)));
  };

  return (
    <div className="mt-5 overflow-hidden">
      <div className="grid grid-cols-[36px_1fr] gap-3">
        <div className="flex h-64 flex-col justify-between pb-6 text-[10px] font-bold text-slate-400">
          {[1, 0.8, 0.6, 0.4, 0.2].map((ratio) => <span key={ratio}>{new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(max * ratio)} tỷ</span>)}<span>0</span>
        </div>
        <div className="relative h-64">
          <div className="absolute inset-x-0 top-0 flex h-[calc(100%-24px)] flex-col justify-between">
            {[0, 1, 2, 3, 4, 5].map((line) => <span key={line} className="block border-t border-dashed border-slate-200" />)}
          </div>
          <svg
            className="absolute inset-x-0 top-0 h-[calc(100%-24px)] w-full overflow-visible"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            aria-label={`Biểu đồ GMV ${data.length} ngày`}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <defs>
              <linearGradient id="admin-chart-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#5546e8" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#5546e8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#admin-chart-fill)" />
            <path d={linePath} fill="none" stroke="#5546e8" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            {hoveredPoint && (
              <>
                <line x1={hoveredPoint.x} x2={hoveredPoint.x} y1="0" y2={height} stroke="#a5b4fc" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
                <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="6" fill="#ffffff" stroke="#5546e8" strokeWidth="4" vectorEffect="non-scaling-stroke" />
              </>
            )}
          </svg>
          {hoveredPoint && (
            <div
              className="admin-chart-tooltip pointer-events-none absolute z-10"
              style={{ left: `${(hoveredPoint.x / width) * 100}%`, top: `${Math.max(4, (hoveredPoint.y / height) * 88)}%` }}
            >
              <p className="text-[10px] font-bold text-slate-400">{hoveredPoint.label}</p>
              <p className="mt-1 text-sm font-extrabold text-slate-900">{formatGmv(hoveredPoint.gmv)}</p>
              <p className="mt-1 text-[10px] font-semibold text-slate-500">{formatInteger(hoveredPoint.orders)} đơn hàng</p>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] font-bold text-slate-400">
            {tickIndexes.map((index) => <span key={`${data.length}-${index}`}>{data[index].label}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderStatusCard({ onNavigate }) {
  return (
    <section className="admin-panel p-5">
      <PanelHeader title="Cơ cấu đơn hàng" subtitle="11.461 đơn phát sinh trong hôm nay">
        <button type="button" onClick={onNavigate} className="admin-link-button">Chi tiết <ChevronRight className="h-4 w-4" /></button>
      </PanelHeader>
      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
        <div className="admin-donut relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full">
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
            <p className="text-2xl font-extrabold text-slate-900">11.461</p>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Đơn hàng</p>
          </div>
        </div>
        <div className="w-full space-y-3">
          {orderStatusBreakdown.map((item) => (
            <button key={item.label} type="button" onClick={onNavigate} className="flex w-full items-center gap-2 text-left">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.tone }} />
              <span className="flex-1 text-xs font-bold text-slate-500">{item.label}</span>
              <span className="text-xs font-extrabold text-slate-800">{formatInteger(item.value)}</span>
              <span className="w-8 text-right text-[11px] font-bold text-slate-400">{item.share}%</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConversionCard() {
  return (
    <section className="admin-panel p-5">
      <PanelHeader title="Phễu chuyển đổi" subtitle="Hiệu suất mua hàng theo hành trình người dùng">
        <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-600"><TrendingUp className="h-4 w-4" /> +3,8%</span>
      </PanelHeader>
      <div className="mt-5 space-y-4">
        {conversionSteps.map((step, index) => (
          <div key={step.label}>
            <div className="mb-2 flex items-center justify-between gap-3 text-xs">
              <p className="font-bold text-slate-500">{index + 1}. {step.label}</p>
              <p className="font-extrabold text-slate-800">{step.value}</p>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div className="admin-progress-bar h-full rounded-full bg-indigo-500" style={{ width: `${step.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
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

function Toolbar({ children, query, searchPlaceholder, onQueryChange, onReset }) {
  return (
    <section className="admin-panel flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
      <div className="flex flex-col gap-2 sm:flex-row">{children}</div>
      <div className="relative lg:ml-auto lg:w-80">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={query} onChange={(event) => onQueryChange(event.target.value)} className="admin-form-input h-10 w-full pl-9 pr-3 text-sm" placeholder={searchPlaceholder} />
      </div>
      <button type="button" onClick={onReset} className="admin-secondary-button justify-center">
        <RefreshCw className="h-4 w-4" />
        Đặt lại
      </button>
    </section>
  );
}

function ToolbarSelect({ value, onChange, placeholder, options }) {
  return (
    <label className="relative">
      <select value={value} onChange={(event) => onChange(event.target.value)} className="admin-form-input h-10 min-w-48 appearance-none px-3 pr-9 text-sm font-semibold text-slate-600">
        <option value="">{placeholder}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </label>
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
                  {index === row.length - 1 && index > 1 && isKnownStatus(cell) ? <StatusPill status={cell} /> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableFooter({ count = 24, page = 1, pageSize = 4, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const start = count === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, count);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-xs font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <p>Hiển thị {start} đến {end} trong {count} kết quả</p>
      <div className="flex items-center gap-1">
        <button type="button" disabled={page === 1} onClick={() => onPageChange?.(page - 1)} className="admin-page-button">‹</button>
        {pages.map((pageNumber) => (
          <button key={pageNumber} type="button" onClick={() => onPageChange?.(pageNumber)} className={cn('admin-page-button', page === pageNumber && 'is-active')}>
            {pageNumber}
          </button>
        ))}
        <button type="button" disabled={page === totalPages} onClick={() => onPageChange?.(page + 1)} className="admin-page-button">›</button>
      </div>
    </div>
  );
}

function TableEmptyState() {
  return (
    <div className="border-t border-slate-100 px-5 py-12 text-center">
      <PackageSearch className="mx-auto h-8 w-8 text-slate-300" />
      <p className="mt-3 text-sm font-extrabold text-slate-700">Không có dữ liệu phù hợp</p>
      <p className="mt-1 text-xs font-semibold text-slate-400">Thử thay đổi từ khóa hoặc đặt lại bộ lọc.</p>
    </div>
  );
}

function isKnownStatus(value) {
  return [
    'Đã duyệt', 'Đang bán', 'Đang hoạt động', 'Hoàn thành', 'Ổn định', 'Đang giao',
    'Đang chạy', 'Đang đóng gói', 'Chờ duyệt', 'Chờ lấy hàng', 'Cần xác nhận',
    'Cần xem xét', 'Cần kiểm tra', 'Theo dõi', 'Cảnh báo', 'Từ chối', 'Tạm ẩn',
  ].includes(value);
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
    'Tạm ẩn': 'bg-slate-100 text-slate-600',
    'Từ chối': 'bg-red-50 text-red-700',
  }[status] || 'bg-slate-100 text-slate-600';
  return <span className={cn('admin-status-pill', tone)}>{status}</span>;
}
