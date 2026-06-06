import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, Navigate, useNavigate, useParams } from "react-router-dom";
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
} from "lucide-react";
import { cn } from "../lib/utils";
import { vendorMessageApi } from "../api/vendorMessageAPI";
import {
  CategorySelectorField,
  ELECTRONICS_CATEGORIES,
} from "../components/Seller/CategorySelectorField";

const navItems = [
  { slug: "trangchu", label: "Tổng quan", icon: LayoutDashboard },
  { slug: "don-hang", label: "Đơn hàng", icon: ShoppingBag, badge: "12" },
  { slug: "san-pham", label: "Sản phẩm", icon: PackageSearch },
  { slug: "van-chuyen", label: "Vận chuyển", icon: Truck },
  { slug: "kho-hang", label: "Kho hàng", icon: Warehouse },
  { slug: "tin-nhan", label: "Tin nhắn", icon: MessageSquareText },
  { slug: "nghien-cuu-thi-truong", label: "Nghiên cứu thị trường", icon: TrendingUp },
  { slug: "marketing", label: "Marketing", icon: TicketPercent },
  { slug: "tai-chinh", label: "Tài chính", icon: WalletCards },
  { slug: "cai-dat-shop", label: "Cài đặt shop", icon: Settings },
];

const pageTitles = {
  trangchu: [
    "Tổng quan cửa hàng",
    "Theo dõi hiệu suất kinh doanh và các công việc cần xử lý hôm nay.",
  ],
  "don-hang": [
    "Quản lý đơn hàng",
    "Kiểm soát đơn mới, tiến độ xử lý và trải nghiệm giao nhận.",
  ],
  "san-pham": [
    "Kho sản phẩm",
    "Theo dõi tồn kho, chất lượng nội dung và hiệu suất bán hàng.",
  ],
  "van-chuyen": [
    "Vận chuyển",
    "Quản lý lịch bàn giao và hiệu suất của đối tác vận chuyển.",
  ],
  "kho-hang": [
    "Quản lý Kho vận",
    "Thiết lập địa chỉ lấy hàng và trả hàng của Shop.",
  ],
  "tin-nhan": [
    "Tin nhắn khách hàng",
    "Phản hồi nhanh để duy trì điểm chăm sóc khách hàng của shop.",
  ],
  "nghien-cuu-thi-truong": [
    "Nghiên cứu thị trường",
    "So sánh giá theo hạng mục, theo dõi nguồn bán và gợi ý mức giá cho shop.",
  ],
  marketing: [
    "Marketing",
    "Theo dõi chiến dịch và tối ưu doanh thu từ các hoạt động quảng bá.",
  ],
  "tai-chinh": [
    "Tài chính",
    "Kiểm soát dòng tiền, đối soát và tài khoản nhận thanh toán.",
  ],
  "cai-dat-shop": [
    "Cài đặt shop",
    "Cập nhật hồ sơ, bảo mật và cấu hình vận hành cửa hàng.",
  ],
};

const orders = [
  {
    id: "SPV-10291",
    buyer: "Minh Anh",
    item: "Áo khoác chống nắng UV",
    total: 389000,
    status: "Chờ xác nhận",
    channel: "TikTok Live",
    time: "09:28",
  },
  {
    id: "SPV-10290",
    buyer: "Gia Hân",
    item: "Set son tint 3 màu",
    total: 259000,
    status: "Đang xử lý",
    channel: "ShopVN Mall",
    time: "09:12",
  },
  {
    id: "SPV-10289",
    buyer: "Hoàng Nam",
    item: "Tai nghe bluetooth mini",
    total: 499000,
    status: "Đang giao",
    channel: "Web ShopVN",
    time: "08:44",
  },
  {
    id: "SPV-10288",
    buyer: "Thanh Vy",
    item: "Bình giữ nhiệt 750ml",
    total: 189000,
    status: "Hoàn tất",
    channel: "Flash Sale",
    time: "08:02",
  },
  {
    id: "SPV-10287",
    buyer: "Bảo Trân",
    item: "Máy xay sinh tố mini",
    total: 329000,
    status: "Đang xử lý",
    channel: "Web ShopVN",
    time: "07:54",
  },
  {
    id: "SPV-10286",
    buyer: "Tuấn Kiệt",
    item: "Kem chống nắng SPF50+",
    total: 438000,
    status: "Chờ xác nhận",
    channel: "ShopVN Mall",
    time: "07:41",
  },
  {
    id: "SPV-10285",
    buyer: "Hà My",
    item: "Túi tote canvas basic",
    total: 149000,
    status: "Trả hàng",
    channel: "TikTok Live",
    time: "07:26",
  },
  {
    id: "SPV-10284",
    buyer: "Đức Anh",
    item: "Bàn phím cơ không dây",
    total: 899000,
    status: "Hoàn tất",
    channel: "Web ShopVN",
    time: "07:10",
  },
];

const products = [
  {
    name: "Áo khoác chống nắng UV",
    sku: "AK-UV-021",
    category: "Thời trang",
    stock: 12,
    sold: 428,
    price: 389000,
    status: "Đang bán",
    quality: 92,
  },
  {
    name: "Set son tint 3 màu",
    sku: "SON-T3-118",
    category: "Làm đẹp",
    stock: 86,
    sold: 312,
    price: 259000,
    status: "Đang bán",
    quality: 96,
  },
  {
    name: "Tai nghe bluetooth mini",
    sku: "AUDIO-MINI-09",
    category: "Điện tử",
    stock: 24,
    sold: 205,
    price: 499000,
    status: "Đang bán",
    quality: 88,
  },
  {
    name: "Bình giữ nhiệt 750ml",
    sku: "BN-750-4C",
    category: "Gia dụng",
    stock: 7,
    sold: 188,
    price: 189000,
    status: "Tồn thấp",
    quality: 90,
  },
  {
    name: "Máy xay sinh tố mini",
    sku: "BLD-MINI-11",
    category: "Gia dụng",
    stock: 42,
    sold: 176,
    price: 329000,
    status: "Đang bán",
    quality: 86,
  },
  {
    name: "Kem chống nắng SPF50+",
    sku: "SKIN-SPF-50",
    category: "Làm đẹp",
    stock: 68,
    sold: 164,
    price: 219000,
    status: "Đang bán",
    quality: 94,
  },
  {
    name: "Bàn phím cơ không dây",
    sku: "KEY-WL-87",
    category: "Điện tử",
    stock: 5,
    sold: 128,
    price: 899000,
    status: "Tồn thấp",
    quality: 84,
  },
  {
    name: "Túi tote canvas basic",
    sku: "BAG-TOTE-04",
    category: "Thời trang",
    stock: 0,
    sold: 121,
    price: 149000,
    status: "Tạm ẩn",
    quality: 89,
  },
];

const marketResearchSamples = [
  {
    id: "op-lung-bao-da",
    name: "Ốp lưng & Bao da",
    keyword: "Ốp lưng MagSafe iPhone 15 Pro Max",
    demand: 86,
    trend: "+12,6%",
    recommendedPrice: 249000,
    shopPrice: 269000,
    marketAverage: 272000,
    sampleCount: 214,
    status: "Có cơ hội",
    strategy:
      "Giữ giá quanh 249.000đ, tạo combo với cáp sạc để tăng giá trị giỏ hàng thay vì giảm giá sâu.",
    sources: [
      { source: "CellphoneS", min: 259000, avg: 289000, max: 329000, sales: "2.900+", rating: 4.8, promo: "Mua kèm giảm 10%", trust: 94 },
      { source: "FPT Shop", min: 279000, avg: 309000, max: 349000, sales: "1.600+", rating: 4.7, promo: "Bảo hành 12 tháng", trust: 93 },
      { source: "Shopee Mall", min: 219000, avg: 252000, max: 299000, sales: "9.800+", rating: 4.6, promo: "Flash voucher", trust: 82 },
      { source: "TikTok Shop", min: 199000, avg: 238000, max: 289000, sales: "7.400+", rating: 4.5, promo: "Live deal", trust: 78 },
      { source: "TopZone", min: 299000, avg: 339000, max: 399000, sales: "840+", rating: 4.9, promo: "Hàng Apple MFi", trust: 97 },
    ],
  },
  {
    id: "dien-thoai-thong-minh",
    name: "Điện thoại thông minh",
    keyword: "iPhone 15 Pro Max 256GB",
    demand: 92,
    trend: "+8,4%",
    recommendedPrice: 29290000,
    shopPrice: 29990000,
    marketAverage: 30180000,
    sampleCount: 126,
    status: "Nên cạnh tranh",
    strategy:
      "Giữ giá thấp hơn trung bình thị trường 2-3%, ưu tiên quà tặng phụ kiện và bảo hành mở rộng.",
    sources: [
      { source: "TopZone", min: 29990000, avg: 30990000, max: 31990000, sales: "1.240+", rating: 4.9, promo: "Trả góp 0%", trust: 98 },
      { source: "FPT Shop", min: 29790000, avg: 30590000, max: 31590000, sales: "980+", rating: 4.8, promo: "Voucher 800K", trust: 96 },
      { source: "CellphoneS", min: 29490000, avg: 30290000, max: 31290000, sales: "1.560+", rating: 4.8, promo: "Giảm 1 triệu", trust: 95 },
      { source: "Shopee Mall", min: 28890000, avg: 29820000, max: 30990000, sales: "3.800+", rating: 4.7, promo: "Freeship + voucher", trust: 89 },
      { source: "TikTok Shop", min: 28690000, avg: 29650000, max: 30690000, sales: "2.100+", rating: 4.6, promo: "Flash sale", trust: 84 },
    ],
  },
  {
    id: "laptop",
    name: "Máy tính xách tay",
    keyword: "MacBook Air M2 13 inch 256GB",
    demand: 78,
    trend: "+3,1%",
    recommendedPrice: 21990000,
    shopPrice: 22490000,
    marketAverage: 22720000,
    sampleCount: 84,
    status: "Theo dõi",
    strategy:
      "Không cần đua giá quá mạnh; nhấn bảo hành, đổi trả và hỗ trợ kỹ thuật để giữ biên lợi nhuận.",
    sources: [
      { source: "TopZone", min: 22490000, avg: 22990000, max: 23690000, sales: "680+", rating: 4.9, promo: "Trả góp 0%", trust: 98 },
      { source: "FPT Shop", min: 22290000, avg: 22850000, max: 23590000, sales: "720+", rating: 4.8, promo: "Voucher 500K", trust: 96 },
      { source: "CellphoneS", min: 21990000, avg: 22690000, max: 23390000, sales: "940+", rating: 4.8, promo: "Balo + Office", trust: 95 },
      { source: "Shopee Mall", min: 21490000, avg: 22190000, max: 22990000, sales: "1.870+", rating: 4.7, promo: "Mã giảm 5%", trust: 88 },
    ],
  },
  {
    id: "tai-nghe-bluetooth",
    name: "Tai nghe Bluetooth",
    keyword: "Tai nghe bluetooth chống ồn",
    demand: 81,
    trend: "+6,9%",
    recommendedPrice: 1290000,
    shopPrice: 1390000,
    marketAverage: 1385000,
    sampleCount: 148,
    status: "Nên chạy quảng cáo",
    strategy:
      "Tối ưu video demo chống ồn, chạy voucher khách mới và đẩy review thật để cạnh tranh với sàn.",
    sources: [
      { source: "Shopee Mall", min: 1190000, avg: 1320000, max: 1490000, sales: "5.200+", rating: 4.7, promo: "Voucher 12%", trust: 86 },
      { source: "TikTok Shop", min: 1090000, avg: 1260000, max: 1450000, sales: "4.600+", rating: 4.6, promo: "Live sale", trust: 80 },
      { source: "CellphoneS", min: 1350000, avg: 1490000, max: 1690000, sales: "1.100+", rating: 4.8, promo: "Bảo hành chính hãng", trust: 95 },
      { source: "FPT Shop", min: 1390000, avg: 1530000, max: 1720000, sales: "940+", rating: 4.8, promo: "Trả góp 0%", trust: 94 },
    ],
  },
  {
    id: "dong-ho-thong-minh",
    name: "Đồng hồ thông minh",
    keyword: "Apple Watch SE GPS 40mm",
    demand: 74,
    trend: "-1,8%",
    recommendedPrice: 5890000,
    shopPrice: 6090000,
    marketAverage: 6210000,
    sampleCount: 72,
    status: "Cẩn trọng tồn kho",
    strategy:
      "Giữ tồn kho vừa phải, bán kèm dây đeo và bảo hành mở rộng để tăng giá trị đơn hàng.",
    sources: [
      { source: "TopZone", min: 6190000, avg: 6490000, max: 6990000, sales: "520+", rating: 4.9, promo: "Thu cũ đổi mới", trust: 98 },
      { source: "FPT Shop", min: 5990000, avg: 6290000, max: 6790000, sales: "610+", rating: 4.8, promo: "Voucher 300K", trust: 96 },
      { source: "CellphoneS", min: 5790000, avg: 6120000, max: 6590000, sales: "780+", rating: 4.8, promo: "Tặng dây đeo", trust: 95 },
      { source: "Shopee Mall", min: 5590000, avg: 5920000, max: 6390000, sales: "1.900+", rating: 4.6, promo: "Freeship", trust: 85 },
    ],
  },
];

const DEFAULT_VENDOR_MARKET_CATEGORY_ID = "op-lung-bao-da";
const DEFAULT_VENDOR_PARENT_CATEGORY_ID = "dt-do-dien-tu";

const shipments = [
  {
    id: "GHN-78422",
    order: "SPV-10289",
    carrier: "GHN Express",
    deadline: "15:00 hôm nay",
    status: "Chờ bàn giao",
  },
  {
    id: "SPX-48110",
    order: "SPV-10288",
    carrier: "SPX Express",
    deadline: "Đang giao",
    status: "Trên đường giao",
  },
  {
    id: "GHTK-33918",
    order: "SPV-10283",
    carrier: "GHTK",
    deadline: "11:30 hôm nay",
    status: "Cần in nhãn",
  },
  {
    id: "VTP-55608",
    order: "SPV-10280",
    carrier: "Viettel Post",
    deadline: "16:30 hôm nay",
    status: "Đã lên lịch",
  },
];

const campaigns = [
  {
    name: "Flash Sale 20H",
    metric: "26 sản phẩm",
    progress: 72,
    budget: "2.500.000đ",
    revenue: "18.420.000đ",
  },
  {
    name: "Voucher theo dõi shop",
    metric: "1.248 lượt dùng",
    progress: 58,
    budget: "1.200.000đ",
    revenue: "9.680.000đ",
  },
  {
    name: "Livestream cuối tuần",
    metric: "18:30 hôm nay",
    progress: 36,
    budget: "800.000đ",
    revenue: "6.240.000đ",
  },
];

const salesTrend = Array.from({ length: 30 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - index));
  const weekdayFactor = [0.82, 0.92, 1.01, 1.06, 1.08, 1.24, 1.18][
    date.getDay()
  ];
  const campaignBoost = index > 20 && index < 25 ? 1.15 : 1;
  const revenue =
    Math.round(
      (12.6 + Math.sin(index / 2.9) * 2.5 + index * 0.17) *
        weekdayFactor *
        campaignBoost *
        10,
    ) / 10;
  return {
    date,
    label: new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    }).format(date),
    revenue,
    orders: Math.round(revenue * 8.7),
  };
});

const sellerNotifications = [
  [
    "12 đơn mới cần xác nhận",
    "Ưu tiên xử lý trước 11:00 để giữ SLA.",
    "orange",
  ],
  [
    "4 sản phẩm sắp hết hàng",
    "Cập nhật tồn kho để không bỏ lỡ doanh thu.",
    "red",
  ],
  [
    "Flash Sale đạt 72% ngân sách",
    "Chiến dịch đang mang về ROAS 5,8x.",
    "teal",
  ],
];

function getVendorInfo() {
  try {
    return JSON.parse(localStorage.getItem("vendorInfo") || "{}");
  } catch {
    return {};
  }
}

function formatCurrency(value) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

function formatShortCurrency(value) {
  if (value >= 1000000) {
    return `${new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 1,
    }).format(value / 1000000)}tr`;
  }
  return `${new Intl.NumberFormat("vi-VN").format(value / 1000)}K`;
}

function findVendorCategoryPath(nodes, targetId, path = []) {
  for (const node of nodes) {
    const nextPath = [...path, node];
    if (node.id === targetId) return nextPath;
    if (node.children) {
      const found = findVendorCategoryPath(node.children, targetId, nextPath);
      if (found) return found;
    }
  }
  return null;
}

function normalizeCategoryText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCategoryLeaves(node) {
  if (!node.children?.length) return [node];
  return node.children.flatMap(getCategoryLeaves);
}

function categoryContainsId(node, categoryId) {
  if (!node || !categoryId) return false;
  if (node.id === categoryId) return true;
  return node.children?.some((child) => categoryContainsId(child, categoryId)) || false;
}

function getFirstLeafCategoryId(node) {
  return getCategoryLeaves(node)[0]?.id || node?.id || DEFAULT_VENDOR_MARKET_CATEGORY_ID;
}

function getVendorRegisteredCategoryValue(vendorInfo = {}) {
  const readValue = (value) => {
    if (!value) return "";
    if (typeof value === "object") {
      return (
        value.id ||
        value.categoryId ||
        value.name ||
        value.displayName ||
        value.value ||
        ""
      );
    }
    return value;
  };

  const candidates = [
    vendorInfo.category,
    vendorInfo.vendorCategory,
    vendorInfo.businessCategory,
    vendorInfo.businessCategoryId,
    vendorInfo.mainCategory,
    vendorInfo.mainCategoryId,
    vendorInfo.categoryId,
    vendorInfo.vendor?.category,
    vendorInfo.vendor?.categoryId,
    vendorInfo.profile?.category,
    vendorInfo.profile?.categoryId,
  ];

  return candidates.map(readValue).find(Boolean) || "";
}

function getVendorParentCategory(vendorInfo = {}) {
  const rawCategory = getVendorRegisteredCategoryValue(vendorInfo);
  const normalized = normalizeCategoryText(rawCategory);
  const aliases = {
    "dien-tu": "dt-do-dien-tu",
    "dien-thoai-do-dien-tu": "dt-do-dien-tu",
    "dt-do-dien-tu": "dt-do-dien-tu",
    "may-tinh-thiet-bi-van-phong": "may-tinh-van-phong",
    "may-tinh-van-phong": "may-tinh-van-phong",
    "thiet-bi-mang": "thiet-bi-mang",
    "tv-thiet-bi-giai-tri": "tv-giai-tri",
    "tv-giai-tri": "tv-giai-tri",
  };
  const targetId = aliases[normalized] || rawCategory;

  return (
    ELECTRONICS_CATEGORIES.find(
      (category) =>
        category.id === targetId ||
        normalizeCategoryText(category.id) === normalized ||
        normalizeCategoryText(category.name) === normalized,
    ) ||
    ELECTRONICS_CATEGORIES.find(
      (category) => category.id === DEFAULT_VENDOR_PARENT_CATEGORY_ID,
    ) ||
    ELECTRONICS_CATEGORIES[0]
  );
}

function getVendorMarketDefaultCategoryId(parentCategory) {
  const sample = marketResearchSamples.find((category) =>
    categoryContainsId(parentCategory, category.id),
  );
  return sample?.id || getFirstLeafCategoryId(parentCategory);
}

function getVendorMarketQuickCategories(parentCategory) {
  const sampleCategories = marketResearchSamples
    .filter((category) => categoryContainsId(parentCategory, category.id))
    .map(({ id, name }) => ({ id, name }));
  const leafCategories = getCategoryLeaves(parentCategory)
    .slice(0, 6)
    .map(({ id, name }) => ({ id, name }));
  const unique = new Map();

  [...sampleCategories, ...leafCategories].forEach((category) => {
    unique.set(category.id, category);
  });

  return Array.from(unique.values()).slice(0, 6);
}

function buildVendorMarketFallback(categoryId) {
  const path = findVendorCategoryPath(ELECTRONICS_CATEGORIES, categoryId) || [];
  const leaf = path.at(-1) || { id: categoryId, name: "Hạng mục đang chọn" };
  const seed = [...leaf.id].reduce((total, char) => total + char.charCodeAt(0), 0);
  const basePrice = 180000 + (seed % 34) * 85000;
  const sourceTemplates = [
    ["Shopee Mall", 0.86, 1.02, 1.18, "3.200+", 4.6, "Voucher ngành hàng", 84],
    ["TikTok Shop", 0.82, 0.98, 1.13, "2.600+", 4.5, "Deal livestream", 79],
    ["CellphoneS", 0.98, 1.08, 1.22, "780+", 4.8, "Bảo hành chính hãng", 94],
    ["FPT Shop", 1.02, 1.12, 1.26, "640+", 4.7, "Trả góp 0%", 93],
  ];
  const marketAverage = Math.round((basePrice * 1.08) / 10000) * 10000;
  const recommendedPrice = Math.round((basePrice * 0.98) / 10000) * 10000;

  return {
    id: leaf.id,
    name: leaf.name,
    keyword: leaf.name,
    demand: 68 + (seed % 24),
    trend: seed % 3 === 0 ? "-1,6%" : `+${2 + (seed % 8)},4%`,
    recommendedPrice,
    shopPrice: Math.round((basePrice * 1.04) / 10000) * 10000,
    marketAverage,
    sampleCount: 54 + (seed % 96),
    status: seed % 3 === 0 ? "Theo dõi" : "Có cơ hội",
    strategy: `Dùng dữ liệu mẫu cho ${path.map((item) => item.name).join(" > ") || leaf.name}; nên kiểm tra thêm giá thực tế trước khi nhập hàng hoặc chạy khuyến mãi.`,
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

function getVendorMarketCategory(categoryId) {
  return (
    marketResearchSamples.find((category) => category.id === categoryId) ||
    buildVendorMarketFallback(categoryId)
  );
}

function getTodayLabel() {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
}

function getApiMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Không thể tải dữ liệu"
  );
}

function getInitials(name = "Khách hàng") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatChatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  return new Intl.DateTimeFormat(
    "vi-VN",
    sameDay
      ? { hour: "2-digit", minute: "2-digit" }
      : { day: "2-digit", month: "2-digit" },
  ).format(date);
}

function downloadCsv(filename, columns, rows) {
  const content = [columns, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob([`\uFEFF${content}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const operationSettingDefaults = [
  {
    id: "autoCod",
    label: "Tự động xác nhận đơn COD",
    description: "Tự động nhận đơn COD đủ điều kiện theo SLA.",
  },
  {
    id: "lowStockAlert",
    label: "Nhận thông báo tồn kho thấp",
    description: "Cảnh báo khi SKU chạm ngưỡng tồn kho an toàn.",
  },
  {
    id: "hideOutOfStock",
    label: "Ẩn sản phẩm khi hết hàng",
    description: "Tạm ẩn sản phẩm hết tồn để tránh phát sinh đơn lỗi.",
  },
  {
    id: "quickChatReply",
    label: "Bật trả lời nhanh trong chat",
    description: "Hiển thị mẫu phản hồi nhanh trong hộp thư khách hàng.",
  },
];

function StatusBadge({ children, status, className }) {
  const tone =
    {
      "Đang bán": "is-green",
      "Hoàn tất": "is-green",
      "Đang hoạt động": "is-green",
      "Đã xác minh": "is-green",
      "Đang chạy": "is-green",
      "Đang giao": "is-blue",
      "Trên đường giao": "is-blue",
      "Đã lên lịch": "is-blue",
      "Đang xử lý": "is-orange",
      "Chờ Admin duyệt": "is-orange",
      "Chờ xác nhận": "is-orange",
      "Chờ bàn giao": "is-orange",
      "Cần in nhãn": "is-orange",
      "Tồn thấp": "is-red",
      "Trả hàng": "is-red",
      "Tạm ẩn": "is-gray",
      "Dự phòng": "is-gray",
    }[status || children] || "is-gray";
  return (
    <span className={cn("vendor-status", tone, className)}>
      {children || status}
    </span>
  );
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
        <p className="mt-1 text-xs font-semibold leading-5 text-stone-500">
          {toast.message}
        </p>
      </div>
      <button
        type="button"
        aria-label="Đóng thông báo"
        onClick={onClose}
        className="text-stone-400 hover:text-stone-700"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function VendorLayout({ activeSlug, children, onToast }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const vendorInfo = getVendorInfo();
  const navigate = useNavigate();
  const [title, subtitle] = pageTitles[activeSlug] || pageTitles.trangchu;
  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return [
      ...navItems.map((item) => ({
        slug: item.slug,
        title: item.label,
        meta: "Chức năng seller",
        icon: item.icon,
      })),
      ...products.map((product) => ({
        slug: "san-pham",
        title: product.name,
        meta: product.sku,
        icon: Boxes,
      })),
      ...orders.map((order) => ({
        slug: "don-hang",
        title: order.id,
        meta: order.buyer,
        icon: ShoppingBag,
      })),
    ]
      .filter((item) =>
        `${item.title} ${item.meta}`.toLowerCase().includes(normalized),
      )
      .slice(0, 5);
  }, [query]);

  useEffect(() => {
    setMobileOpen(false);
    setNotificationsOpen(false);
    setQuery("");
  }, [activeSlug]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("vendorInfo");
    navigate("/seller");
  };

  const navigateTo = (slug) => {
    navigate(`/vendor/${slug}`);
    setQuery("");
  };

  return (
    <div className="vendor-app min-h-screen">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Đóng menu"
          className="fixed inset-0 z-40 bg-stone-950/45 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "vendor-sidebar fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-[72px] items-center gap-3 border-b border-white/10 px-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-950/20">
            <Store className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-base font-extrabold tracking-tight text-white">
              Seller Studio
            </p>
            <p className="truncate text-xs font-semibold text-emerald-100/65">
              {vendorInfo.shopName || "ShopVN Seller"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Đóng menu"
            className="ml-auto text-emerald-100/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="scrollbar-hide flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navItems.map(({ slug, label, icon: Icon, badge }) => (
            <NavLink
              key={slug}
              to={`/vendor/${slug}`}
              className={({ isActive }) =>
                cn("vendor-nav-item", isActive && "is-active")
              }
            >
              <Icon className="h-[18px] w-[18px]" />
              <span>{label}</span>
              {badge && (
                <span className="ml-auto rounded-full bg-orange-400 px-2 py-0.5 text-[10px] font-extrabold text-stone-950">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-3">
          <div className="mb-2 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-400/20 text-xs font-extrabold text-orange-100">
                SS
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white">
                  {vendorInfo.shopName || "ShopVN Seller"}
                </p>
                <p className="truncate text-[11px] font-medium text-emerald-100/55">
                  Đang hoạt động
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="vendor-nav-item w-full"
            onClick={() => navigate("/")}
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            Về trang mua hàng
          </button>
          <button
            type="button"
            className="vendor-nav-item w-full text-red-200 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-[18px] w-[18px]" />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="vendor-topbar sticky top-0 z-30 flex h-[72px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Mở menu"
            className="vendor-icon-button lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative max-w-xl flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setNotificationsOpen(false)}
              className="vendor-input h-10 w-full pl-10 pr-4 text-sm"
              placeholder="Tìm đơn hàng, SKU hoặc chức năng..."
            />
            {query && (
              <div className="vendor-dropdown absolute inset-x-0 top-12 overflow-hidden p-1">
                {searchResults.length > 0 ? (
                  searchResults.map(
                    ({ slug, title: resultTitle, meta, icon: Icon }) => (
                      <button
                        key={`${slug}-${resultTitle}`}
                        type="button"
                        className="vendor-dropdown-item"
                        onClick={() => navigateTo(slug)}
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 text-left">
                          <span className="block truncate text-sm font-bold text-stone-700">
                            {resultTitle}
                          </span>
                          <span className="block truncate text-xs font-semibold text-stone-400">
                            {meta}
                          </span>
                        </span>
                      </button>
                    ),
                  )
                ) : (
                  <p className="px-3 py-4 text-center text-xs font-semibold text-stone-400">
                    Không tìm thấy kết quả phù hợp.
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <div className="relative">
              <button
                type="button"
                aria-label="Thông báo"
                className="vendor-icon-button relative"
                onClick={() => {
                  setQuery("");
                  setNotificationsOpen((current) => !current);
                }}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-orange-500" />
              </button>
              {notificationsOpen && (
                <div className="vendor-dropdown absolute right-0 top-12 w-80 p-2">
                  <div className="flex items-center justify-between px-2 py-2">
                    <p className="text-sm font-extrabold text-stone-900">
                      Thông báo cửa hàng
                    </p>
                    <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-extrabold text-orange-700">
                      3 mới
                    </span>
                  </div>
                  {sellerNotifications.map(
                    ([notificationTitle, message, tone]) => (
                      <button
                        key={notificationTitle}
                        type="button"
                        className="vendor-dropdown-item"
                      >
                        <span
                          className={cn(
                            "h-2.5 w-2.5 shrink-0 rounded-full",
                            tone === "orange"
                              ? "bg-orange-400"
                              : tone === "red"
                                ? "bg-red-500"
                                : "bg-teal-500",
                          )}
                        />
                        <span className="text-left">
                          <span className="block text-xs font-extrabold text-stone-700">
                            {notificationTitle}
                          </span>
                          <span className="mt-1 block text-[11px] font-medium leading-4 text-stone-400">
                            {message}
                          </span>
                        </span>
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              aria-label="Trợ giúp"
              className="vendor-icon-button hidden sm:inline-flex"
            >
              <CircleHelp className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="vendor-primary-button hidden sm:inline-flex"
              onClick={() => navigate("/vendor/products/add")}
            >
              <Plus className="h-4 w-4" />
              Thêm sản phẩm
            </button>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-teal-700">
              {getTodayLabel()}
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-stone-950 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm font-medium text-stone-500">
              {subtitle}
            </p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

function Panel({ className, children }) {
  return (
    <section className={cn("vendor-panel", className)}>{children}</section>
  );
}

function PanelHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-base font-extrabold text-stone-900">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-xs font-semibold text-stone-400">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      )}
    </div>
  );
}

function StatCard({ stat, onClick }) {
  const Icon = stat.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="vendor-panel vendor-stat-card group w-full p-5 text-left"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-stone-400">
            {stat.label}
          </p>
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-stone-950">
            {stat.value}
          </p>
        </div>
        <span className={cn("vendor-stat-icon", stat.tone)}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-xs font-semibold text-stone-400">
        <span className="mr-1.5 font-extrabold text-teal-700">
          {stat.change}
        </span>
        {stat.note}
      </p>
      {onClick && (
        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-extrabold text-orange-600 opacity-0 transition-opacity group-hover:opacity-100">
          Xem chi tiết <ArrowUpRight className="h-3 w-3" />
        </span>
      )}
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
    {
      label: "Doanh thu hôm nay",
      value: `${latest.revenue.toFixed(1).replace(".", ",")} triệu`,
      change: `${change >= 0 ? "+" : ""}${change.toFixed(1).replace(".", ",")}%`,
      note: "so với hôm qua",
      icon: Coins,
      tone: "is-orange",
      target: "tai-chinh",
    },
    {
      label: "Đơn chờ xử lý",
      value: "34",
      change: "12 đơn",
      note: "cần xác nhận trước 11:00",
      icon: PackageCheck,
      tone: "is-teal",
      target: "don-hang",
    },
    {
      label: "Tỷ lệ chuyển đổi",
      value: "7,8%",
      change: "+1,2%",
      note: "so với tuần trước",
      icon: TrendingUp,
      tone: "is-green",
      target: "marketing",
    },
    {
      label: "Đánh giá shop",
      value: "4,8 / 5",
      change: "2.431",
      note: "đánh giá đã xác minh",
      icon: Star,
      tone: "is-yellow",
      target: "cai-dat-shop",
    },
  ];

  const exportRevenue = () => {
    downloadCsv(
      "seller-revenue.csv",
      ["Ngày", "Doanh thu (triệu)", "Số đơn"],
      trend.map((item) => [item.label, item.revenue, item.orders]),
    );
    onToast({
      title: "Đã tải báo cáo",
      message: `Doanh thu ${range} ngày đã được xuất thành file CSV.`,
    });
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            stat={stat}
            onClick={() => navigateTo(stat.target)}
          />
        ))}
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.65fr_0.85fr]">
        <Panel className="min-w-0 p-5">
          <PanelHeader
            title="Xu hướng doanh thu"
            subtitle={`Doanh thu và số đơn trong ${range} ngày gần nhất`}
          >
            {[7, 14, 30].map((period) => (
              <button
                key={period}
                type="button"
                className={cn("vendor-tab", range === period && "is-active")}
                onClick={() => setRange(period)}
              >
                {period} ngày
              </button>
            ))}
            <button
              type="button"
              aria-label="Xuất báo cáo"
              className="vendor-icon-button"
              onClick={exportRevenue}
            >
              <Download className="h-4 w-4" />
            </button>
          </PanelHeader>
          <VendorRevenueChart data={trend} />
        </Panel>
        <Panel className="p-5">
          <PanelHeader
            title="Việc cần làm"
            subtitle="Ưu tiên để duy trì hiệu suất shop"
          />
          <div className="mt-4 space-y-2.5">
            {[
              ["Xác nhận đơn mới", "12 đơn", PackageCheck, "don-hang"],
              [
                "Trả lời chat khách hàng",
                "3 tin",
                MessageSquareText,
                "tin-nhan",
              ],
              ["Cập nhật tồn kho thấp", "4 SKU", Boxes, "san-pham"],
              ["Tối ưu Flash Sale 20H", "72%", TicketPercent, "marketing"],
            ].map(([label, value, Icon, target]) => (
              <button
                key={label}
                type="button"
                className="vendor-task"
                onClick={() => navigateTo(target)}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 text-left text-sm font-bold text-stone-700">
                  {label}
                </span>
                <span className="text-xs font-extrabold text-stone-500">
                  {value}
                </span>
                <ChevronRight className="h-4 w-4 text-stone-300" />
              </button>
            ))}
          </div>
        </Panel>
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel className="overflow-hidden">
          <div className="p-5">
            <PanelHeader
              title="Đơn hàng cần xử lý"
              subtitle="Cập nhật theo thời gian thực"
            >
              <button
                type="button"
                className="vendor-link-button"
                onClick={() => navigateTo("don-hang")}
              >
                Xem tất cả <ChevronRight className="h-4 w-4" />
              </button>
            </PanelHeader>
          </div>
          <OrderTable rows={orders.slice(0, 4)} compact />
        </Panel>
        <Panel className="p-5">
          <PanelHeader
            title="Hiệu suất cửa hàng"
            subtitle="Mục tiêu vận hành trong tuần"
          />
          <div className="mt-5 space-y-4">
            <ProgressItem
              label="Phản hồi chat dưới 5 phút"
              value="94%"
              percent={94}
            />
            <ProgressItem
              label="Giao hàng đúng hạn"
              value="96,2%"
              percent={96.2}
            />
            <ProgressItem label="Tỷ lệ hủy đơn" value="1,4%" percent={82} />
            <ProgressItem
              label="Chất lượng nội dung"
              value="89/100"
              percent={89}
            />
          </div>
        </Panel>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <InsightCard
          title="Khách hàng quay lại"
          icon={Users}
          value="31%"
          label="Tăng 4,2% trong tuần"
          text="Tệp khách trung thành đang đóng góp 38% doanh thu."
          tone="is-teal"
        />
        <InsightCard
          title="Giao đúng hạn"
          icon={Truck}
          value="96,2%"
          label="3 đơn cần bàn giao sớm"
          text="Lịch bàn giao gần nhất là 11:30 với GHTK."
          tone="is-green"
        />
        <InsightCard
          title="Sức khỏe shop"
          icon={BadgeCheck}
          value="Tốt"
          label="Không có vi phạm mới"
          text="Duy trì tồn kho và tốc độ chat để tăng điểm shop."
          tone="is-yellow"
        />
      </section>
    </div>
  );
}

function VendorRevenueChart({ data }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const width = 760;
  const height = 230;
  const max = Math.ceil(Math.max(...data.map((item) => item.revenue)) / 5) * 5;
  const points = data.map((item, index) => ({
    ...item,
    x: (index / (data.length - 1)) * width,
    y: height - (item.revenue / max) * height,
  }));
  const line = points
    .map(
      (point, index) =>
        `${index ? "L" : "M"}${point.x.toFixed(2)},${point.y.toFixed(2)}`,
    )
    .join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const hovered = hoverIndex === null ? null : points[hoverIndex];
  const ticks = [
    0,
    Math.round((data.length - 1) * 0.25),
    Math.round((data.length - 1) * 0.5),
    Math.round((data.length - 1) * 0.75),
    data.length - 1,
  ];
  const onMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setHoverIndex(
      Math.max(
        0,
        Math.min(
          data.length - 1,
          Math.round(
            ((event.clientX - bounds.left) / bounds.width) * (data.length - 1),
          ),
        ),
      ),
    );
  };

  return (
    <div className="mt-5 grid grid-cols-[34px_1fr] gap-3">
      <div className="flex h-64 flex-col justify-between pb-6 text-[10px] font-bold text-stone-400">
        {[1, 0.75, 0.5, 0.25].map((ratio) => (
          <span key={ratio}>{max * ratio}tr</span>
        ))}
        <span>0</span>
      </div>
      <div className="relative h-64">
        <div className="absolute inset-x-0 top-0 flex h-[calc(100%-24px)] flex-col justify-between">
          {[0, 1, 2, 3, 4].map((lineIndex) => (
            <span
              key={lineIndex}
              className="block border-t border-dashed border-stone-200"
            />
          ))}
        </div>
        <svg
          className="absolute inset-x-0 top-0 h-[calc(100%-24px)] w-full overflow-visible"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          aria-label={`Biểu đồ doanh thu ${data.length} ngày`}
          onMouseMove={onMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="seller-chart-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#seller-chart-fill)" />
          <path
            d={line}
            fill="none"
            stroke="#f97316"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {hovered && (
            <>
              <line
                x1={hovered.x}
                x2={hovered.x}
                y1="0"
                y2={height}
                stroke="#fdba74"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={hovered.x}
                cy={hovered.y}
                r="6"
                fill="#fff"
                stroke="#f97316"
                strokeWidth="4"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
        </svg>
        {hovered && (
          <div
            className="vendor-chart-tooltip pointer-events-none absolute"
            style={{
              left: `${(hovered.x / width) * 100}%`,
              top: `${Math.max(4, (hovered.y / height) * 88)}%`,
            }}
          >
            <p className="text-[10px] font-bold text-stone-400">
              {hovered.label}
            </p>
            <p className="mt-1 text-sm font-extrabold text-stone-900">
              {hovered.revenue.toFixed(1).replace(".", ",")} triệu
            </p>
            <p className="mt-1 text-[10px] font-semibold text-stone-500">
              {hovered.orders} đơn hàng
            </p>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] font-bold text-stone-400">
          {ticks.map((index) => (
            <span key={`${data.length}-${index}`}>{data[index].label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressItem({ label, value, percent }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <p className="font-bold text-stone-500">{label}</p>
        <p className="font-extrabold text-stone-800">{value}</p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-stone-100">
        <div
          className="vendor-progress h-full rounded-full bg-teal-600"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function InsightCard({ title, icon: Icon, value, label, text, tone }) {
  return (
    <Panel className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-stone-700">{title}</p>
          <p className="mt-3 text-2xl font-extrabold text-stone-950">{value}</p>
        </div>
        <span className={cn("vendor-stat-icon", tone)}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-2 text-xs font-bold text-teal-700">{label}</p>
      <p className="mt-4 text-xs font-semibold leading-5 text-stone-400">
        {text}
      </p>
    </Panel>
  );
}

function OrderTable({ rows, compact = false }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="vendor-table-head">
          <tr>
            {[
              "Mã đơn",
              "Khách hàng",
              "Sản phẩm",
              "Giá trị",
              "Trạng thái",
              "Kênh",
            ].map((column) => (
              <th key={column} className="px-5 py-3.5">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {rows.map((order) => (
            <tr key={order.id} className="vendor-table-row">
              <td className="px-5 py-4 font-extrabold text-stone-800">
                {order.id}
                <p className="mt-1 text-[11px] font-semibold text-stone-400">
                  {order.time}
                </p>
              </td>
              <td className="px-5 py-4 font-bold text-stone-600">
                {order.buyer}
              </td>
              <td className="px-5 py-4 font-semibold text-stone-500">
                {order.item}
              </td>
              <td className="px-5 py-4 font-extrabold text-stone-700">
                {formatCurrency(order.total)}
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-5 py-4 font-semibold text-stone-500">
                {order.channel}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!compact && rows.length === 0 && <EmptyState />}
    </div>
  );
}

function Toolbar({
  query,
  onQueryChange,
  onReset,
  placeholder,
  children,
  onExport,
}) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      <div className="relative min-w-0 lg:w-72">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="vendor-input h-10 w-full pl-9 pr-3 text-sm"
          placeholder={placeholder}
        />
      </div>
      {children}
      <button
        type="button"
        className="vendor-secondary-button justify-center"
        onClick={onReset}
      >
        <RefreshCw className="h-4 w-4" />
        Đặt lại
      </button>
      {onExport && (
        <button
          type="button"
          className="vendor-secondary-button justify-center"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          Xuất file
        </button>
      )}
    </div>
  );
}

function SelectFilter({ value, onChange, placeholder, options }) {
  return (
    <label className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="vendor-input h-10 min-w-40 appearance-none px-3 pr-9 text-sm font-semibold"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
    </label>
  );
}

function Pagination({ count, page, pageSize, onPageChange }) {
  const pages = Math.max(1, Math.ceil(count / pageSize));
  return (
    <div className="flex flex-col gap-3 border-t border-stone-100 bg-stone-50/65 px-5 py-3 text-xs font-semibold text-stone-500 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Hiển thị {count ? (page - 1) * pageSize + 1 : 0} đến{" "}
        {Math.min(page * pageSize, count)} trong {count} kết quả
      </p>
      <div className="flex gap-1">
        <button
          type="button"
          className="vendor-page-button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          ‹
        </button>
        {Array.from({ length: pages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              className={cn(
                "vendor-page-button",
                page === pageNumber && "is-active",
              )}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ),
        )}
        <button
          type="button"
          className="vendor-page-button"
          disabled={page === pages}
          onClick={() => onPageChange(page + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-5 py-12 text-center">
      <PackageSearch className="mx-auto h-8 w-8 text-stone-300" />
      <p className="mt-3 text-sm font-extrabold text-stone-700">
        Không có dữ liệu phù hợp
      </p>
      <p className="mt-1 text-xs font-semibold text-stone-400">
        Thử thay đổi từ khóa hoặc đặt lại bộ lọc.
      </p>
    </div>
  );
}

function OrdersPage({ onToast }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const filtered = orders.filter(
    (order) =>
      `${order.id} ${order.buyer} ${order.item}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!status || order.status === status),
  );
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Đơn mới", "34", "12 cần xác nhận", ShoppingBag, "is-orange"],
          ["Đang giao", "128", "96,2% đúng hạn", Truck, "is-teal"],
          ["Hoàn tất hôm nay", "216", "+18% hôm qua", CheckCircle2, "is-green"],
          ["Cần xử lý", "5", "2 yêu cầu trả hàng", Clock3, "is-red"],
        ].map(([label, value, change, icon, tone]) => (
          <StatCard
            key={label}
            stat={{ label, value, change, note: "", icon, tone }}
          />
        ))}
      </section>
      <Panel className="overflow-hidden">
        <div className="p-5">
          <PanelHeader
            title="Danh sách đơn hàng"
            subtitle="Theo dõi và cập nhật trạng thái xử lý"
          >
            <Toolbar
              query={query}
              onQueryChange={(value) => {
                setQuery(value);
                setPage(1);
              }}
              onReset={() => {
                setQuery("");
                setStatus("");
                setPage(1);
              }}
              placeholder="Tìm mã đơn, khách hàng..."
              onExport={() => {
                downloadCsv(
                  "seller-orders.csv",
                  ["Mã đơn", "Khách hàng", "Sản phẩm", "Giá trị", "Trạng thái"],
                  filtered.map((order) => [
                    order.id,
                    order.buyer,
                    order.item,
                    formatCurrency(order.total),
                    order.status,
                  ]),
                );
                onToast({
                  title: "Đã xuất đơn hàng",
                  message: `${filtered.length} đơn hàng đã được tải xuống.`,
                });
              }}
            >
              <SelectFilter
                value={status}
                onChange={(value) => {
                  setStatus(value);
                  setPage(1);
                }}
                placeholder="Tất cả trạng thái"
                options={[
                  "Chờ xác nhận",
                  "Đang xử lý",
                  "Đang giao",
                  "Hoàn tất",
                  "Trả hàng",
                ]}
              />
            </Toolbar>
          </PanelHeader>
        </div>
        <OrderTable rows={visible} />
        <Pagination
          count={filtered.length}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </Panel>
    </div>
  );
}

function ProductsPage({ onToast, navigate }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const filtered = products.filter(
    (product) =>
      `${product.name} ${product.sku}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!status || product.status === status),
  );
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  return (
    <div className="space-y-5">
      <Panel className="overflow-hidden">
        <div className="p-5">
          <PanelHeader
            title="Danh sách sản phẩm"
            subtitle="8 sản phẩm đang được quản lý"
          >
            <div>
              <button
                type="button"
                className="vendor-secondary-button mr-2"
                onClick={() =>
                  onToast({
                    title: "Nhập hàng loạt",
                    message: "Đã mở trình tải file danh sách sản phẩm.",
                  })
                }
              >
                <Upload className="h-4 w-4" />
                Nhập file
              </button>
              <button
                type="button"
                className="vendor-primary-button"
                onClick={() => navigate("/vendor/products/add")}
              >
                <Plus className="h-4 w-4" />
                Thêm sản phẩm
              </button>
            </div>
          </PanelHeader>
          <div className="mt-4">
            <Toolbar
              query={query}
              onQueryChange={(value) => {
                setQuery(value);
                setPage(1);
              }}
              onReset={() => {
                setQuery("");
                setStatus("");
                setPage(1);
              }}
              placeholder="Tìm tên sản phẩm hoặc SKU"
            >
              <SelectFilter
                value={status}
                onChange={(value) => {
                  setStatus(value);
                  setPage(1);
                }}
                placeholder="Tất cả trạng thái"
                options={["Đang bán", "Tồn thấp", "Tạm ẩn"]}
              />
            </Toolbar>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="vendor-table-head">
              <tr>
                {[
                  "Sản phẩm",
                  "SKU",
                  "Giá",
                  "Tồn kho",
                  "Đã bán",
                  "Chất lượng",
                  "Trạng thái",
                  "",
                ].map((column) => (
                  <th key={column} className="px-5 py-3.5">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {visible.map((product) => (
                <tr key={product.sku} className="vendor-table-row">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                        <ImagePlus className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-extrabold text-stone-800">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-stone-400">
                          {product.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-stone-500">
                    {product.sku}
                  </td>
                  <td className="px-5 py-4 font-extrabold text-stone-700">
                    {formatCurrency(product.price)}
                  </td>
                  <td
                    className={cn(
                      "px-5 py-4 font-extrabold",
                      product.stock <= 12 ? "text-red-600" : "text-stone-700",
                    )}
                  >
                    {product.stock}
                  </td>
                  <td className="px-5 py-4 font-bold text-stone-600">
                    {product.sold}
                  </td>
                  <td className="px-5 py-4 font-bold text-teal-700">
                    {product.quality}/100
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      aria-label={`Thao tác ${product.name}`}
                      className="vendor-icon-button"
                      onClick={() =>
                        onToast({
                          title: product.name,
                          message: "Đã mở menu thao tác nhanh sản phẩm.",
                        })
                      }
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!visible.length && <EmptyState />}
        <Pagination
          count={filtered.length}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </Panel>
    </div>
  );
}

const VN_PROVINCES = [
  {
    name: "TP. Hồ Chí Minh",
    districts: [
      {
        name: "Quận 1",
        wards: [
          "Phường Bến Nghé",
          "Phường Bến Thành",
          "Phường Đa Kao",
          "Phường Nguyễn Thái Bình",
        ],
      },
      {
        name: "Quận 3",
        wards: ["Phường Võ Thị Sáu", "Phường 1", "Phường 2", "Phường 5"],
      },
      {
        name: "Quận Bình Thạnh",
        wards: ["Phường 15", "Phường 25", "Phường 26", "Phường 27"],
      },
    ],
  },
  {
    name: "Hà Nội",
    districts: [
      {
        name: "Quận Hoàn Kiếm",
        wards: [
          "Phường Hàng Trống",
          "Phường Hàng Bạc",
          "Phường Hàng Bông",
          "Phường Tràng Tiền",
        ],
      },
      {
        name: "Quận Hai Bà Trưng",
        wards: [
          "Phường Bách Khoa",
          "Phường Đồng Tâm",
          "Phường Quỳnh Lôi",
          "Phường Lê Đại Hành",
        ],
      },
      {
        name: "Quận Cầu Giấy",
        wards: [
          "Phường Dịch Vọng",
          "Phường Nghĩa Tân",
          "Phường Quan Hoa",
          "Phường Mai Dịch",
        ],
      },
    ],
  },
  {
    name: "Đà Nẵng",
    districts: [
      {
        name: "Quận Hải Châu",
        wards: [
          "Phường Hòa Cường Bắc",
          "Phường Hòa Cường Nam",
          "Phường Thạch Thang",
          "Phường Phước Ninh",
        ],
      },
      {
        name: "Quận Thanh Khê",
        wards: [
          "Phường An Khê",
          "Phường Chính Gián",
          "Phường Thạc Gián",
          "Phường Hòa Khê",
        ],
      },
    ],
  },
];

const normalizeWarehouse = (w) => ({
  id: w.id || Date.now(),
  type: w.type || w.warehouse_type || "PICKUP",
  name: w.name || w.warehouse_name || "",
  contact: w.contact || w.contact_name || "",
  phone: w.phone || w.phone_number || "",
  address: w.address || "",
  isDefault: !!(w.isDefault !== undefined ? w.isDefault : w.is_default),
  status:
    w.status === "ACTIVE" || w.status === "Đang hoạt động"
      ? "Đang hoạt động"
      : "Tạm ngưng",
});

function WarehousePage({ onToast }) {
  // Load warehouses from localStorage, default to empty to simulate "chưa tạo kho mặc định"
  const [warehouses, setWarehouses] = useState(() => {
    try {
      const saved = localStorage.getItem("sellerWarehouses");
      return saved ? JSON.parse(saved).map(normalizeWarehouse) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState("PICKUP");

  // Onboarding Wizard States
  const [isOnboarding, setIsOnboarding] = useState(() => {
    try {
      const saved = localStorage.getItem("sellerWarehouses");
      const list = saved ? JSON.parse(saved) : [];
      // If there are no default warehouses (or list is empty), show onboarding
      return list.length === 0;
    } catch {
      return true;
    }
  });

  const [currentStep, setCurrentStep] = useState(1); // 1: Welcome/BPMN, 2: Form, 3: Processing
  const [selectedOutcome, setSelectedOutcome] = useState("LINKED"); // 'LINKED', 'UNLINKED', 'FAILURE'
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLogs, setProcessingLogs] = useState([]);
  const [bpmnError, setBpmnError] = useState("");
  const [showUnlinkedPopup, setShowUnlinkedPopup] = useState(false);
  const [showNormalAddModal, setShowNormalAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    hdbizUser: "",
    hdbizPass: "",
    type: "PICKUP",
    name: "",
    contact: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    addressDetail: "",
    lat: 10.7626,
    lng: 106.6602,
  });

  // Geo selection options
  const selectedProvinceData = VN_PROVINCES.find(
    (p) => p.name === formData.province,
  );
  const selectedDistrictData = selectedProvinceData?.districts.find(
    (d) => d.name === formData.district,
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Reset dependent geo fields
      if (name === "province") {
        updated.district = "";
        updated.ward = "";
      } else if (name === "district") {
        updated.ward = "";
      }
      return updated;
    });
  };

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Map click relative coords to Vietnam coords centered near Saigon
    const mockLat = 10.7626 + (0.5 - y / rect.height) * 0.08;
    const mockLng = 106.6602 + (x / rect.width - 0.5) * 0.08;

    setFormData((prev) => ({
      ...prev,
      lat: parseFloat(mockLat.toFixed(6)),
      lng: parseFloat(mockLng.toFixed(6)),
    }));
  };

  const handleStartOnboarding = () => {
    setCurrentStep(2);
    setBpmnError("");
  };

  const handleCancelOnboarding = () => {
    setCurrentStep(1);
    setBpmnError("");
  };

  // BPMN Service Check Simulation
  const handleVerifyAndLink = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.hdbizUser || !formData.hdbizPass) {
      setBpmnError("Vui lòng nhập tài khoản HDBiz để thực hiện liên kết!");
      return;
    }
    if (
      !formData.name ||
      !formData.contact ||
      !formData.phone ||
      !formData.province ||
      !formData.district ||
      !formData.ward ||
      !formData.addressDetail
    ) {
      setBpmnError(
        "Vui lòng nhập đầy đủ các trường thông tin kho hàng bắt buộc!",
      );
      return;
    }
    if (!formData.phone.match(/^[0-9]{9,10}$/)) {
      setBpmnError(
        "Số điện thoại liên hệ không hợp lệ! Vui lòng nhập số từ 9-10 chữ số.",
      );
      return;
    }

    setBpmnError("");
    setCurrentStep(3);
    setIsProcessing(true);
    setProcessingLogs([]);

    const addLog = (msg, delay) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          setProcessingLogs((prev) => [...prev, msg]);
          resolve();
        }, delay);
      });
    };

    // Simulate step-by-step BPMN check
    Promise.resolve()
      .then(() =>
        addLog(
          "🔍 [BPMN 5] Mở phiên làm việc và kiểm tra thông tin HDBiz...",
          600,
        ),
      )
      .then(() =>
        addLog("🔄 Đang gửi truy vấn trạng thái đăng ký dịch vụ...", 1000),
      )
      .then(() =>
        addLog("⚙️ Đang phân tích phản hồi hệ thống ngân hàng HDBank...", 800),
      )
      .then(() => {
        setTimeout(() => {
          setIsProcessing(false);

          if (selectedOutcome === "FAILURE") {
            // Step 6.1: Registration failure, back to editing with error message
            setBpmnError(
              "❌ [BPMN 6.1] Đăng ký dịch vụ thất bại hoặc thông tin tài khoản HDBiz bị từ chối. Vui lòng kiểm tra lại thông tin và thử lại.",
            );
            setCurrentStep(2);
          } else if (selectedOutcome === "UNLINKED") {
            // Step 7.1: Not linked yet, show modal warning
            setShowUnlinkedPopup(true);
            setCurrentStep(2);
          } else {
            // Step 7.2: Successfully linked and activated!
            const newWarehouse = {
              id: Date.now(),
              type: formData.type,
              name: formData.name,
              contact: formData.contact,
              phone: formData.phone,
              address: `${formData.addressDetail}, ${formData.ward}, ${formData.district}, ${formData.province}`,
              isDefault: true, // Auto-marked as default
              status: "Đang hoạt động",
            };

            const updatedList = [...warehouses, newWarehouse];
            setWarehouses(updatedList);
            localStorage.setItem(
              "sellerWarehouses",
              JSON.stringify(updatedList),
            );

            onToast({
              title: "[BPMN 7.2] Kích hoạt thành công",
              message: `Đã kết nối tài khoản HDBiz và khởi tạo kho ${formData.type === "PICKUP" ? "lấy" : "trả"} hàng mặc định!`,
            });

            setIsOnboarding(false);
            setCurrentStep(1);
          }
        }, 800);
      });
  };

  // Link HDBank immediately (resolves the Unlinked state)
  const handleLinkHDBankNow = () => {
    setShowUnlinkedPopup(false);
    onToast({
      title: "Liên kết HDBank",
      message:
        "Liên kết tài khoản HDBank thành công! Trạng thái BPMN được đặt thành 'Đã liên kết'.",
    });
    setSelectedOutcome("LINKED");
  };

  // Reset demo state
  const handleResetDemo = () => {
    localStorage.removeItem("sellerWarehouses");
    setWarehouses([]);
    setIsOnboarding(true);
    setCurrentStep(1);
    setSelectedOutcome("LINKED");
    setBpmnError("");
    onToast({
      title: "Reset dữ liệu",
      message:
        "Đã xóa toàn bộ kho hàng và quay về trạng thái chưa tạo kho mặc định.",
    });
  };

  // Add a warehouse normally after onboarding is complete
  const handleNormalAddClick = () => {
    // Check limit (1 default per type, unless approved)
    const currentTypeWarehouses = warehouses.filter(
      (w) => w.type === activeTab,
    );
    if (currentTypeWarehouses.length >= 1) {
      alert(
        "Hạn mức của bạn là 1 kho mặc định. Vui lòng đăng ký tính năng Đa kho để tạo thêm!",
      );
      return;
    }
    setShowNormalAddModal(true);
  };

  const handleSaveNormalWarehouse = (e) => {
    e.preventDefault();
    const form = e.target;
    const wName = form.w_name.value;
    const wContact = form.w_contact.value;
    const wPhone = form.w_phone.value;
    const wAddr = form.w_addr.value;

    if (!wName || !wContact || !wPhone || !wAddr) {
      alert("Vui lòng điền đủ thông tin!");
      return;
    }

    const newW = {
      id: Date.now(),
      type: activeTab,
      name: wName,
      contact: wContact,
      phone: wPhone,
      address: wAddr,
      isDefault: warehouses.filter((w) => w.type === activeTab).length === 0, // default if first of its type
      status: "Đang hoạt động",
    };

    const updated = [...warehouses, newW];
    setWarehouses(updated);
    localStorage.setItem("sellerWarehouses", JSON.stringify(updated));
    setShowNormalAddModal(false);
    onToast({
      title: "Thêm kho thành công",
      message: `Đã thêm mới kho ${activeTab === "PICKUP" ? "lấy" : "trả"} hàng.`,
    });
  };

  const currentWarehouses = warehouses.filter((w) => w.type === activeTab);

  if (isOnboarding) {
    return (
      <div className="space-y-6">
        {/* Scenario Test Controller */}
        <div className="rounded-xl border-2 border-orange-200 bg-orange-50/50 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-orange-900 flex items-center gap-1.5">
                <SlidersHorizontal className="h-4 w-4" />
                BPMN Simulation Controls (Bảng Điều Khiển Kịch Bản)
              </h3>
              <p className="text-xs font-semibold text-orange-700 mt-0.5">
                Thay đổi kết quả kiểm tra kết nối để kiểm thử toàn bộ các nhánh
                trong luồng BPMN.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedOutcome("LINKED")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                  selectedOutcome === "LINKED"
                    ? "bg-teal-600 border-teal-600 text-white shadow-sm"
                    : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50",
                )}
              >
                🟢 Đã liên kết (Success)
              </button>
              <button
                onClick={() => setSelectedOutcome("UNLINKED")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                  selectedOutcome === "UNLINKED"
                    ? "bg-amber-600 border-amber-600 text-white shadow-sm"
                    : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50",
                )}
              >
                🟡 Chưa liên kết (BPMN 7.1 Popup)
              </button>
              <button
                onClick={() => setSelectedOutcome("FAILURE")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                  selectedOutcome === "FAILURE"
                    ? "bg-red-600 border-red-600 text-white shadow-sm"
                    : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50",
                )}
              >
                🔴 Thất bại (BPMN 6.1 Nhập lại)
              </button>
            </div>
          </div>
        </div>

        {/* Onboarding welcome screen */}
        {currentStep === 1 && (
          <Panel className="p-8 text-center max-w-4xl mx-auto flex flex-col items-center">
            <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-6 shadow-inner">
              <Warehouse className="h-8 w-8 animate-pulse" />
            </div>

            <h2 className="text-xl font-extrabold text-stone-900">
              Chưa Thiết Lập Kho Hàng Mặc Định
            </h2>
            <p className="mt-2 text-sm text-stone-500 max-w-xl font-semibold leading-relaxed">
              Theo quy trình vận hành và quy định <b>Quản lý kho - MTTDL</b>,
              bạn cần đăng ký liên kết tài khoản HDBiz và tạo kho lấy/trả hàng
              mặc định để bắt đầu xử lý vận chuyển.
            </p>

            {/* Visual BPMN flow path */}
            <div className="mt-8 w-full max-w-2xl bg-stone-50 rounded-xl p-5 border border-stone-100">
              <p className="text-xs font-bold text-stone-400 text-left uppercase tracking-wider mb-4">
                Sơ đồ quy trình liên kết & cấu hình kho (BPMN)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-sm text-left">
                  <div className="text-[10px] font-extrabold text-stone-400 uppercase">
                    Bước 1
                  </div>
                  <div className="text-xs font-extrabold text-stone-700 mt-1">
                    Truy cập kênh
                  </div>
                  <div className="text-[10px] font-medium text-stone-400 mt-0.5">
                    Khởi tạo yêu cầu
                  </div>
                </div>

                <div className="hidden md:flex justify-center text-stone-300">
                  ➔
                </div>

                <div className="bg-white p-3 rounded-lg border border-orange-300 ring-2 ring-orange-100 shadow-sm text-left">
                  <div className="text-[10px] font-extrabold text-orange-500 uppercase">
                    Bước 2
                  </div>
                  <div className="text-xs font-extrabold text-stone-700 mt-1">
                    Mở form HDBiz
                  </div>
                  <div className="text-[10px] font-medium text-stone-400 mt-0.5">
                    Nhập & Ghim vị trí
                  </div>
                </div>

                <div className="hidden md:flex justify-center text-stone-300">
                  ➔
                </div>

                <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-sm text-left">
                  <div className="text-[10px] font-extrabold text-stone-400 uppercase">
                    Bước 3
                  </div>
                  <div className="text-xs font-extrabold text-stone-700 mt-1">
                    Kiểm tra kết nối
                  </div>
                  <div className="text-[10px] font-medium text-stone-400 mt-0.5">
                    Xác thực tự động
                  </div>
                </div>

                <div className="hidden md:flex justify-center text-stone-300">
                  ➔
                </div>

                <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-sm text-left">
                  <div className="text-[10px] font-extrabold text-stone-400 uppercase">
                    Bước 4
                  </div>
                  <div className="text-xs font-extrabold text-stone-700 mt-1">
                    Đã kết nối
                  </div>
                  <div className="text-[10px] font-medium text-stone-400 mt-0.5">
                    Kích hoạt kho
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartOnboarding}
              className="mt-8 vendor-primary-button px-6 py-3 text-sm font-extrabold flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Khởi tạo & Liên kết kho mặc định
            </button>
          </Panel>
        )}

        {/* Setup Form (currentStep = 2) */}
        {currentStep === 2 && (
          <Panel className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <div>
                <h2 className="text-lg font-extrabold text-stone-900">
                  Thiết lập Kho mặc định & Liên kết tài khoản
                </h2>
                <p className="text-xs text-stone-400 font-semibold mt-1">
                  Bước 2 trong luồng BPMN: Nhập thông tin tài khoản HDBiz và
                  thông tin vật lý của kho.
                </p>
              </div>
              <button
                onClick={handleCancelOnboarding}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                Hủy bỏ
              </button>
            </div>

            {bpmnError && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <span className="text-red-600 text-sm font-bold shrink-0 mt-0.5">
                  ⚠️
                </span>
                <p className="text-xs font-bold text-red-700">{bpmnError}</p>
              </div>
            )}

            <form onSubmit={handleVerifyAndLink} className="space-y-6">
              {/* Account linkage section */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-4">
                <h3 className="text-xs font-extrabold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-teal-700" />
                  1. Tài khoản HDBiz (Webview Login)
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold text-stone-500">
                      Tên đăng nhập HDBiz *
                    </span>
                    <input
                      name="hdbizUser"
                      type="text"
                      value={formData.hdbizUser}
                      onChange={handleInputChange}
                      placeholder="Nhập tài khoản doanh nghiệp"
                      className="vendor-input mt-1.5 h-10 w-full px-3 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-stone-500">
                      Mật khẩu HDBiz *
                    </span>
                    <input
                      name="hdbizPass"
                      type="password"
                      value={formData.hdbizPass}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="vendor-input mt-1.5 h-10 w-full px-3 text-sm"
                    />
                  </label>
                </div>
              </div>

              {/* Warehouse info section */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Boxes className="h-4 w-4 text-orange-600" />
                  2. Thông tin kho hàng mặc định
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold text-stone-500">
                      Loại kho mặc định *
                    </span>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="vendor-input mt-1.5 h-10 w-full px-3 text-sm appearance-none bg-white font-semibold"
                    >
                      <option value="PICKUP">Kho lấy hàng (PICKUP)</option>
                      <option value="RETURN">Kho trả hàng (RETURN)</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-xs font-bold text-stone-500">
                      Tên kho hàng *
                    </span>
                    <input
                      name="name"
                      type="text"
                      maxLength={50}
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: Kho Tổng Miền Nam"
                      className="vendor-input mt-1.5 h-10 w-full px-3 text-sm"
                    />
                    <span className="text-[10px] text-stone-400 font-bold block mt-1 text-right">
                      {formData.name.length}/50 ký tự
                    </span>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold text-stone-500">
                      Người liên hệ *
                    </span>
                    <input
                      name="contact"
                      type="text"
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder="Tên người quản lý kho"
                      className="vendor-input mt-1.5 h-10 w-full px-3 text-sm"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-bold text-stone-500">
                      Số điện thoại *
                    </span>
                    <div className="flex mt-1.5">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-stone-200 bg-stone-50 text-xs font-extrabold text-stone-500">
                        +84
                      </span>
                      <input
                        name="phone"
                        type="text"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="901234567"
                        className="vendor-input h-10 flex-1 rounded-l-none pl-3 text-sm"
                      />
                    </div>
                  </label>
                </div>

                {/* Geography selectors */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="block">
                    <span className="text-xs font-bold text-stone-500">
                      Tỉnh/Thành phố *
                    </span>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className="vendor-input mt-1.5 h-10 w-full px-3 text-sm appearance-none bg-white font-semibold"
                    >
                      <option value="">-- Chọn Tỉnh/Thành --</option>
                      {VN_PROVINCES.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-xs font-bold text-stone-500">
                      Quận/Huyện *
                    </span>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      disabled={!formData.province}
                      className="vendor-input mt-1.5 h-10 w-full px-3 text-sm appearance-none bg-white font-semibold disabled:bg-stone-50 disabled:text-stone-300"
                    >
                      <option value="">-- Chọn Quận/Huyện --</option>
                      {selectedProvinceData?.districts.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-xs font-bold text-stone-500">
                      Phường/Xã *
                    </span>
                    <select
                      name="ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                      disabled={!formData.district}
                      className="vendor-input mt-1.5 h-10 w-full px-3 text-sm appearance-none bg-white font-semibold disabled:bg-stone-50 disabled:text-stone-300"
                    >
                      <option value="">-- Chọn Phường/Xã --</option>
                      {selectedDistrictData?.wards.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="text-xs font-bold text-stone-500">
                    Địa chỉ chi tiết *
                  </span>
                  <input
                    name="addressDetail"
                    type="text"
                    value={formData.addressDetail}
                    onChange={handleInputChange}
                    placeholder="Số nhà, ngõ ngách, tên đường..."
                    className="vendor-input mt-1.5 h-10 w-full px-3 text-sm"
                  />
                </label>
              </div>

              {/* Map mockup pinning */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-stone-500 block">
                  3. Ghim tọa độ trên bản đồ (Click vào bản đồ để chọn tọa độ)
                </span>

                <div className="grid gap-4 md:grid-cols-[1.6fr_0.4fr] items-stretch">
                  {/* Interactive Map Visual Grid */}
                  <div
                    onClick={handleMapClick}
                    className="h-48 rounded-xl border border-stone-200 bg-stone-100 relative overflow-hidden cursor-crosshair select-none flex flex-col justify-end p-3"
                    style={{
                      backgroundImage:
                        "radial-gradient(#ddd 1.5px, transparent 1.5px)",
                      backgroundSize: "20px 20px",
                    }}
                  >
                    {/* Mock Streets */}
                    <div className="absolute inset-x-0 top-1/3 h-6 bg-stone-200/60 flex items-center justify-center border-y border-stone-300/40 text-[9px] font-extrabold text-stone-400 uppercase tracking-widest pointer-events-none">
                      Đường Lê Lợi
                    </div>
                    <div
                      className="absolute inset-y-0 left-1/3 w-6 bg-stone-200/60 flex items-center justify-center border-x border-stone-300/40 text-[9px] font-extrabold text-stone-400 uppercase tracking-widest writing-mode-vertical pointer-events-none"
                      style={{ writingMode: "vertical-rl" }}
                    >
                      Đại lộ Hùng Vương
                    </div>

                    {/* Glowing Pin Marker */}
                    <div
                      className="absolute h-8 w-8 -mt-8 -ml-4 transition-all duration-300 ease-out flex flex-col items-center pointer-events-none"
                      style={{
                        left: `${((formData.lng - 106.6602) / 0.08 + 0.5) * 100}%`,
                        top: `${(0.5 - (formData.lat - 10.7626) / 0.08) * 100}%`,
                      }}
                    >
                      <span className="text-orange-500 text-2xl filter drop-shadow">
                        📍
                      </span>
                      <span className="animate-ping absolute top-0 h-4.5 w-4.5 rounded-full bg-orange-400 opacity-75"></span>
                    </div>

                    <div className="bg-stone-900/70 backdrop-blur-sm rounded-lg py-1 px-2.5 text-[10px] font-extrabold text-white self-start pointer-events-none flex items-center gap-1">
                      <span className="text-teal-400">🗺️</span> Bản đồ mô phỏng
                      vệ tinh (HCM/HN Center)
                    </div>
                  </div>

                  {/* Coordinates view */}
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 flex flex-col justify-center gap-3">
                    <div>
                      <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
                        Vĩ độ (Latitude)
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={formData.lat}
                        className="vendor-input h-9 w-full mt-1 bg-white text-xs font-bold text-stone-600 text-center"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
                        Kinh độ (Longitude)
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={formData.lng}
                        className="vendor-input h-9 w-full mt-1 bg-white text-xs font-bold text-stone-600 text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form buttons */}
              <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelOnboarding}
                  className="vendor-secondary-button"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="vendor-primary-button px-6 font-extrabold"
                >
                  Xác nhận & Liên kết HDBiz
                </button>
              </div>
            </form>
          </Panel>
        )}

        {/* Processing screen (currentStep = 3) */}
        {currentStep === 3 && (
          <Panel className="p-8 max-w-xl mx-auto text-center flex flex-col items-center">
            {/* Spinning Loader */}
            <div className="relative h-16 w-16 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-orange-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
            </div>

            <h2 className="text-lg font-extrabold text-stone-900">
              Kiểm Tra Đăng Ký Dịch Vụ
            </h2>
            <p className="text-xs font-semibold text-stone-400 mt-1">
              Hệ thống đang chạy quy trình kiểm tra tự động theo mô hình BPMN...
            </p>

            {/* Simulated Live Logging */}
            <div className="mt-6 w-full bg-stone-900 rounded-xl p-4 text-left font-mono text-xs text-stone-300 min-h-36 flex flex-col gap-2.5 shadow-lg border border-stone-850">
              {processingLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-teal-400">⚡</span>
                  <span>{log}</span>
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-center gap-2 text-stone-500 animate-pulse">
                  <span>●</span>
                  <span>Đang xử lý...</span>
                </div>
              )}
            </div>
          </Panel>
        )}

        {/* Unlinked Popup Modal (BPMN 7.1) */}
        {showUnlinkedPopup && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/60 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-stone-100 overflow-hidden animate-scaleUp">
              <div className="p-5 text-center flex flex-col items-center">
                <span className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-xl font-bold mb-4">
                  ⚠️
                </span>
                <h3 className="text-base font-extrabold text-stone-900">
                  [BPMN 7.1] Chưa Liên Kết HDBank
                </h3>
                <p className="mt-2 text-xs font-semibold leading-relaxed text-stone-500">
                  Tài khoản HDBiz đã đăng nhập thành công, nhưng phát hiện chưa
                  thực hiện liên kết liên ngân hàng HDBank để xử lý kênh chi hộ.
                </p>
                <div className="mt-6 w-full flex flex-col gap-2.5">
                  <button
                    onClick={handleLinkHDBankNow}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-extrabold py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/10"
                  >
                    Liên kết HDBank ngay (Simulate Link)
                  </button>
                  <button
                    onClick={() => setShowUnlinkedPopup(false)}
                    className="w-full bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-bold py-2 rounded-xl transition-all"
                  >
                    Quay lại sửa thông tin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Normal dashboard after default warehouse is successfully created
  return (
    <div className="space-y-5">
      {/* Simulation Reset Banner */}
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-extrabold text-stone-600 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-teal-700" />
            Trạng thái: Đã cấu hình kho hàng mặc định (BPMN 7.2)
          </span>
          <p className="text-[11px] text-stone-400 font-semibold mt-0.5">
            Quy trình liên kết HDBiz hoàn tất. Bạn có thể nhấn Reset để chạy lại
            luồng kiểm thử.
          </p>
        </div>
        <button
          onClick={handleResetDemo}
          className="text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 bg-white text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
        >
          Reset dữ liệu (Thử lại BPMN)
        </button>
      </div>

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
              className="vendor-primary-button font-bold"
              onClick={handleNormalAddClick}
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
                      <p className="font-extrabold text-stone-800">{wh.name}</p>
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
                      <span className="vendor-status is-green">
                        Đang hoạt động
                      </span>
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

      {/* Add warehouse modal (after onboarding) */}
      {showNormalAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-stone-100 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-stone-100">
              <h3 className="font-extrabold text-stone-900 text-sm">
                Thêm kho hàng mới
              </h3>
              <button
                onClick={() => setShowNormalAddModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={handleSaveNormalWarehouse}
              className="p-4 space-y-4"
            >
              <label className="block">
                <span className="text-xs font-bold text-stone-500">
                  Tên kho *
                </span>
                <input
                  name="w_name"
                  type="text"
                  className="vendor-input mt-1.5 h-9 w-full px-3 text-xs"
                  required
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-stone-500">
                  Người liên hệ *
                </span>
                <input
                  name="w_contact"
                  type="text"
                  className="vendor-input mt-1.5 h-9 w-full px-3 text-xs"
                  required
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-stone-500">
                  Số điện thoại *
                </span>
                <input
                  name="w_phone"
                  type="text"
                  className="vendor-input mt-1.5 h-9 w-full px-3 text-xs"
                  required
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-stone-500">
                  Địa chỉ *
                </span>
                <input
                  name="w_addr"
                  type="text"
                  className="vendor-input mt-1.5 h-9 w-full px-3 text-xs"
                  required
                />
              </label>
              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNormalAddModal(false)}
                  className="vendor-secondary-button text-xs py-1.5 px-3"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="vendor-primary-button text-xs py-1.5 px-3"
                >
                  Lưu lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ShippingPage({ onToast }) {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        <InsightCard
          title="Bàn giao đúng hạn"
          icon={BadgeCheck}
          value="96,2%"
          label="+1,8% trong tuần"
          text="3 đơn còn dưới 2 giờ để bàn giao."
          tone="is-green"
        />
        <InsightCard
          title="Đang vận chuyển"
          icon={Truck}
          value="128"
          label="12 đơn giao trong hôm nay"
          text="Theo dõi các đơn có rủi ro giao trễ."
          tone="is-teal"
        />
        <InsightCard
          title="Hoàn trả"
          icon={Clock3}
          value="7"
          label="2 yêu cầu cần phản hồi"
          text="Xử lý trước 18:00 để giữ điểm vận hành."
          tone="is-orange"
        />
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel className="p-5">
          <PanelHeader
            title="Lịch bàn giao hôm nay"
            subtitle="4 chuyến đã được lên lịch"
          >
            <button
              type="button"
              className="vendor-secondary-button"
              onClick={() =>
                onToast({
                  title: "Đã tối ưu tuyến",
                  message: "Lịch bàn giao được sắp xếp lại theo hạn gần nhất.",
                })
              }
            >
              <SlidersHorizontal className="h-4 w-4" />
              Tối ưu tuyến
            </button>
          </PanelHeader>
          <div className="mt-4 space-y-3">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="vendor-list-item">
                <div>
                  <p className="font-extrabold text-stone-800">{shipment.id}</p>
                  <p className="mt-1 text-xs font-semibold text-stone-400">
                    {shipment.order} · {shipment.carrier}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={shipment.status} />
                  <span className="text-xs font-bold text-stone-500">
                    {shipment.deadline}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-5">
          <PanelHeader
            title="Đối tác vận chuyển"
            subtitle="Hiệu suất 30 ngày gần nhất"
          />
          <div className="mt-4 space-y-3">
            {[
              ["GHN Express", "97,8%", "Đang bật"],
              ["SPX Express", "96,9%", "Đang bật"],
              ["GHTK", "94,2%", "Dự phòng"],
              ["Viettel Post", "93,8%", "Dự phòng"],
            ].map(([name, rate, state]) => (
              <div key={name} className="vendor-list-item">
                <div>
                  <p className="text-sm font-extrabold text-stone-700">
                    {name}
                  </p>
                  <p className="mt-1 text-xs font-bold text-teal-700">
                    {rate} đúng hạn
                  </p>
                </div>
                <StatusBadge
                  status={state === "Đang bật" ? "Đang hoạt động" : state}
                >
                  {state}
                </StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}

function MessagesPage({ onToast }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const activeChat = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );

  const loadConversations = useCallback(async () => {
    try {
      const data = await vendorMessageApi.getConversations();
      const nextConversations = Array.isArray(data) ? data : [];
      setConversations(nextConversations);
      setActiveConversationId((current) =>
        current &&
        nextConversations.some((conversation) => conversation.id === current)
          ? current
          : (nextConversations[0]?.id ?? null),
      );
      setError("");
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
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId
            ? { ...conversation, unreadCount: 0 }
            : conversation,
        ),
      );
      setError("");
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
    const intervalId = setInterval(
      () => loadMessages(activeConversationId, true),
      10000,
    );
    return () => clearInterval(intervalId);
  }, [activeConversationId, loadMessages]);

  const selectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, unreadCount: 0 }
          : conversation,
      ),
    );
  };

  const sendMessage = async () => {
    const content = message.trim();
    if (!content || !activeChat || sending) return;
    setSending(true);
    try {
      const sentMessage = await vendorMessageApi.sendMessage(
        activeChat.id,
        content,
      );
      setMessages((current) =>
        current.some((item) => item.id === sentMessage.id)
          ? current
          : [...current, sentMessage],
      );
      setMessage("");
      await loadConversations();
      onToast({
        title: "Đã gửi tin nhắn",
        message: `Phản hồi của bạn đã được gửi tới ${activeChat.customerName}.`,
      });
    } catch (requestError) {
      setError(getApiMessage(requestError));
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="grid min-h-[620px] gap-5 xl:grid-cols-[320px_1fr_280px]">
      <Panel className="p-4">
        <PanelHeader
          title="Hộp thư"
          subtitle={`${conversations.length} hội thoại`}
        >
          <button
            type="button"
            aria-label="Tải lại hội thoại"
            className="vendor-icon-button"
            onClick={loadConversations}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </PanelHeader>
        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600">
            {error}
          </p>
        )}
        <div className="mt-4 space-y-2">
          {loadingConversations && !conversations.length && (
            <p className="py-8 text-center text-xs font-semibold text-stone-400">
              Đang tải hộp thư...
            </p>
          )}
          {!loadingConversations && !conversations.length && (
            <div className="py-10 text-center">
              <MessageSquareText className="mx-auto h-8 w-8 text-stone-300" />
              <p className="mt-3 text-sm font-extrabold text-stone-700">
                Chưa có hội thoại
              </p>
              <p className="mt-1 text-xs font-semibold leading-5 text-stone-400">
                Tin nhắn mới từ khách hàng sẽ xuất hiện tại đây.
              </p>
            </div>
          )}
          {conversations.map((chat) => (
            <button
              key={chat.id}
              type="button"
              className={cn(
                "vendor-chat-item",
                activeConversationId === chat.id && "is-active",
              )}
              onClick={() => selectConversation(chat.id)}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-extrabold text-orange-700">
                  {getInitials(chat.customerName)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-extrabold text-stone-700">
                      {chat.customerName}
                    </span>
                    <span className="shrink-0 text-[11px] font-semibold text-stone-400">
                      {formatChatTime(chat.lastMessageAt)}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-xs font-semibold text-stone-500">
                    {chat.lastMessage || "Chưa có tin nhắn"}
                  </span>
                </span>
              </div>
              {chat.unreadCount > 0 && (
                <span className="mt-2 inline-flex rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-extrabold text-white">
                  {chat.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </Panel>

      <Panel className="flex min-h-[560px] flex-col overflow-hidden">
        {activeChat ? (
          <>
            <div className="border-b border-stone-100 p-4">
              <p className="font-extrabold text-stone-800">
                {activeChat.customerName}
              </p>
              <p className="mt-1 text-xs font-semibold text-stone-400">
                Trao đổi với khách hàng
              </p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto bg-stone-50/60 p-4">
              {loadingMessages && (
                <p className="py-8 text-center text-xs font-semibold text-stone-400">
                  Đang tải tin nhắn...
                </p>
              )}
              {!loadingMessages && !messages.length && (
                <p className="py-8 text-center text-xs font-semibold text-stone-400">
                  Hội thoại chưa có tin nhắn.
                </p>
              )}
              {messages.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "max-w-[75%] rounded-xl px-3 py-2 text-sm font-semibold shadow-sm",
                    item.sentByVendor
                      ? "ml-auto bg-teal-700 text-white"
                      : "bg-white text-stone-600",
                  )}
                >
                  <p>{item.content}</p>
                  <p
                    className={cn(
                      "mt-1 text-[10px]",
                      item.sentByVendor ? "text-teal-100" : "text-stone-400",
                    )}
                  >
                    {formatChatTime(item.createdAt)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-100 p-4">
              <div className="flex gap-2">
                <input
                  value={message}
                  maxLength={2000}
                  disabled={sending}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && sendMessage()}
                  className="vendor-input h-11 flex-1 px-3 text-sm"
                  placeholder="Nhập tin nhắn..."
                />
                <button
                  type="button"
                  aria-label="Gửi tin nhắn"
                  disabled={sending || !message.trim()}
                  className="vendor-primary-button px-3 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={sendMessage}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8 text-center">
            <div>
              <MessageSquareText className="mx-auto h-10 w-10 text-stone-300" />
              <p className="mt-3 text-sm font-extrabold text-stone-700">
                Chọn một hội thoại
              </p>
              <p className="mt-1 text-xs font-semibold text-stone-400">
                Nội dung trao đổi với khách hàng sẽ hiển thị tại đây.
              </p>
            </div>
          </div>
        )}
      </Panel>

      <Panel className="p-4">
        <PanelHeader title="Trả lời nhanh" subtitle="Chọn để điền nội dung" />
        <div className="mt-4 space-y-2">
          {[
            "Dạ sản phẩm vẫn còn hàng ạ.",
            "Shop hỗ trợ đổi trả trong 7 ngày.",
            "Shop gửi bạn mã giảm 10% nhé.",
            "Đơn sẽ được gửi trong hôm nay ạ.",
          ].map((reply) => (
            <button
              key={reply}
              type="button"
              disabled={!activeChat}
              className="vendor-quick-reply disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setMessage(reply)}
            >
              <MessageSquareText className="h-4 w-4 shrink-0 text-orange-500" />
              {reply}
            </button>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function MarketResearchPage({ onToast }) {
  const vendorInfo = getVendorInfo();
  const registeredCategoryValue = getVendorRegisteredCategoryValue(vendorInfo);
  const vendorParentCategory = getVendorParentCategory(vendorInfo);
  const vendorCategoryTree = useMemo(
    () => [vendorParentCategory],
    [vendorParentCategory],
  );
  const defaultCategoryId = getVendorMarketDefaultCategoryId(vendorParentCategory);
  const quickCategories = getVendorMarketQuickCategories(vendorParentCategory);
  const [selectedCategoryId, setSelectedCategoryId] = useState(defaultCategoryId);
  const [source, setSource] = useState("");
  const [query, setQuery] = useState("");
  const [lastSync, setLastSync] = useState("08:45 hôm nay");
  const selectedMarket = getVendorMarketCategory(selectedCategoryId);
  const selectedPath =
    findVendorCategoryPath(vendorCategoryTree, selectedCategoryId) || [];
  const selectedBreadcrumb =
    selectedPath.map((item) => item.name).join(" > ") || selectedMarket.name;
  const sourceOptions = Array.from(
    new Set(selectedMarket.sources.map((item) => item.source)),
  );
  const filteredSources = selectedMarket.sources.filter((item) => {
    const matchesSource = !source || item.source === source;
    const matchesQuery = `${item.source} ${item.promo}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    return matchesSource && matchesQuery;
  });
  const lowestSource = selectedMarket.sources.reduce(
    (best, item) => (item.min < best.min ? item : best),
    selectedMarket.sources[0],
  );
  const priceGap = selectedMarket.shopPrice - selectedMarket.recommendedPrice;
  const priceGapPercent = Math.round(
    (priceGap / selectedMarket.recommendedPrice) * 100,
  );

  useEffect(() => {
    if (!categoryContainsId(vendorParentCategory, selectedCategoryId)) {
      setSelectedCategoryId(defaultCategoryId);
      setSource("");
      setQuery("");
    }
  }, [defaultCategoryId, selectedCategoryId, vendorParentCategory]);

  const resetFilters = () => {
    setSource("");
    setQuery("");
  };

  const syncMarketData = () => {
    const now = new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
    setLastSync(`${now} hôm nay`);
    onToast({
      title: "Đã cập nhật dữ liệu mẫu",
      message: `${selectedMarket.name} đã được làm mới trong ngành ${vendorParentCategory.name}.`,
    });
  };

  const exportMarketRows = () => {
    downloadCsv(
      `vendor-market-${selectedMarket.id}.csv`,
      [
        "Ngành đăng ký",
        "Hạng mục",
        "Từ khóa",
        "Nguồn bán",
        "Giá thấp nhất",
        "Giá trung bình",
        "Giá cao nhất",
        "Lượt bán",
        "Đánh giá",
        "Khuyến mãi",
        "Độ tin cậy",
      ],
      filteredSources.map((item) => [
        vendorParentCategory.name,
        selectedMarket.name,
        selectedMarket.keyword,
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
    onToast({
      title: "Đã xuất nghiên cứu thị trường",
      message: `${filteredSources.length} nguồn bán trong ngành ${vendorParentCategory.name} đã được tải xuống.`,
    });
  };

  return (
    <div className="space-y-5">
      <Panel className="p-5">
        <PanelHeader
          title="Thị trường theo ngành đăng ký"
          subtitle="Vendor chỉ xem dữ liệu tham khảo trong hạng mục kinh doanh chính của shop"
        >
          <button
            type="button"
            className="vendor-secondary-button"
            onClick={exportMarketRows}
          >
            <Download className="h-4 w-4" />
            Xuất báo cáo
          </button>
          <button
            type="button"
            className="vendor-primary-button"
            onClick={syncMarketData}
          >
            <RefreshCw className="h-4 w-4" />
            Cập nhật
          </button>
        </PanelHeader>
        <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_0.7fr]">
          <div>
            <CategorySelectorField
              categories={vendorCategoryTree}
              value={selectedCategoryId}
              onChange={(categoryId) => {
                setSelectedCategoryId(categoryId || defaultCategoryId);
                resetFilters();
              }}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {quickCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                    resetFilters();
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-extrabold transition",
                    selectedMarket.id === category.id
                      ? "border-orange-300 bg-orange-50 text-orange-700"
                      : "border-stone-200 bg-white text-stone-500 hover:border-orange-200 hover:bg-orange-50/60",
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2 text-xs font-semibold text-stone-500 sm:grid-cols-2 xl:grid-cols-1">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-stone-50 px-3 py-2">
              <Store className="h-4 w-4 text-orange-500" />
              <span className="min-w-0 truncate">
                Ngành đăng ký: <strong className="text-stone-800">{vendorParentCategory.name}</strong>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-stone-50 px-3 py-2">
              <ChevronRight className="h-4 w-4 text-orange-500" />
              <span className="min-w-0 truncate">
                Đường dẫn: <strong className="text-stone-800">{selectedBreadcrumb}</strong>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-stone-50 px-3 py-2">
              <Search className="h-4 w-4 text-teal-700" />
              <span className="min-w-0 truncate">
                Từ khóa: <strong className="text-stone-800">{selectedMarket.keyword}</strong>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-stone-50 px-3 py-2">
              <RefreshCw className="h-4 w-4 text-stone-400" />
              Cập nhật: {lastSync}
            </span>
            {!registeredCategoryValue && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-amber-700">
                Chưa thấy hạng mục từ phiên đăng nhập, đang dùng ngành mặc định để demo.
              </span>
            )}
          </div>
        </div>
      </Panel>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          stat={{
            label: "Giá thị trường",
            value: formatShortCurrency(selectedMarket.marketAverage),
            change: selectedMarket.trend,
            note: "xu hướng nhu cầu",
            icon: BarChart3,
            tone: "is-orange",
          }}
        />
        <StatCard
          stat={{
            label: "Giá đề xuất",
            value: formatShortCurrency(selectedMarket.recommendedPrice),
            change:
              priceGap > 0
                ? `Shop cao hơn ${priceGapPercent}%`
                : priceGap < 0
                  ? `Shop thấp hơn ${Math.abs(priceGapPercent)}%`
                  : "Sát đề xuất",
            note: "so với giá shop",
            icon: TicketPercent,
            tone: "is-teal",
          }}
        />
        <StatCard
          stat={{
            label: "Mẫu đối chiếu",
            value: String(selectedMarket.sampleCount),
            change: `${selectedMarket.sources.length} nguồn`,
            note: "dữ liệu mock",
            icon: Store,
            tone: "is-green",
          }}
        />
        <StatCard
          stat={{
            label: "Mức quan tâm",
            value: `${selectedMarket.demand}/100`,
            change: selectedMarket.status,
            note: "cơ hội bán",
            icon: TrendingUp,
            tone: "is-yellow",
          }}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
        <Panel className="p-5">
          <PanelHeader
            title="Khoảng giá theo nguồn bán"
            subtitle="So sánh giá thấp nhất, trung bình và cao nhất"
          />
          <VendorMarketPriceChart
            sources={selectedMarket.sources}
            recommendedPrice={selectedMarket.recommendedPrice}
            shopPrice={selectedMarket.shopPrice}
          />
        </Panel>
        <Panel className="p-5">
          <PanelHeader
            title="Gợi ý cho shop"
            subtitle="Dùng khi thêm hoặc chỉnh sửa sản phẩm trong ngành đã đăng ký"
          />
          <div className="mt-4 space-y-3">
            <MarketInsightRow
              icon={TicketPercent}
              label="Giá nên niêm yết"
              value={formatCurrency(selectedMarket.recommendedPrice)}
            />
            <MarketInsightRow
              icon={Store}
              label="Nguồn giá thấp nhất"
              value={`${lowestSource.source} - ${formatShortCurrency(lowestSource.min)}`}
            />
            <MarketInsightRow
              icon={SlidersHorizontal}
              label="Giá shop hiện tại"
              value={formatCurrency(selectedMarket.shopPrice)}
            />
          </div>
          <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50/70 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-orange-700">
              Chiến lược đề xuất
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-stone-700">
              {selectedMarket.strategy}
            </p>
          </div>
        </Panel>
      </section>

      <Panel className="overflow-hidden">
        <div className="p-5">
          <PanelHeader
            title="Bảng so sánh nguồn bán"
            subtitle={`Chỉ hiển thị nguồn tham khảo liên quan đến ${vendorParentCategory.name}`}
          >
            <Toolbar
              query={query}
              onQueryChange={setQuery}
              onReset={resetFilters}
              placeholder="Tìm nguồn bán hoặc khuyến mãi"
            >
              <SelectFilter
                value={source}
                onChange={setSource}
                placeholder="Tất cả nguồn"
                options={sourceOptions}
              />
            </Toolbar>
          </PanelHeader>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="vendor-table-head">
              <tr>
                {[
                  "Nguồn bán",
                  "Giá thấp nhất",
                  "Giá TB",
                  "Giá cao nhất",
                  "Lượt bán",
                  "Đánh giá",
                  "Khuyến mãi",
                  "Độ tin cậy",
                ].map((column) => (
                  <th key={column} className="px-5 py-3.5">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredSources.map((item) => (
                <tr key={item.source} className="vendor-table-row">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 font-extrabold text-orange-600">
                        {item.source.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-extrabold text-stone-900">{item.source}</p>
                        <p className="mt-1 text-xs font-semibold text-stone-400">
                          {selectedMarket.keyword}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-extrabold text-teal-700">
                    {formatCurrency(item.min)}
                  </td>
                  <td className="px-5 py-4 font-bold text-stone-800">
                    {formatCurrency(item.avg)}
                  </td>
                  <td className="px-5 py-4 font-semibold text-stone-500">
                    {formatCurrency(item.max)}
                  </td>
                  <td className="px-5 py-4 font-semibold text-stone-600">{item.sales}</td>
                  <td className="px-5 py-4 font-semibold text-stone-600">{item.rating}/5</td>
                  <td className="px-5 py-4 font-semibold text-stone-600">{item.promo}</td>
                  <td className="px-5 py-4">
                    <div className="flex min-w-32 items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100">
                        <div
                          className="h-full rounded-full bg-teal-600"
                          style={{ width: `${item.trust}%` }}
                        />
                      </div>
                      <span className="w-9 text-right text-xs font-extrabold text-stone-700">
                        {item.trust}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSources.length === 0 && <EmptyState />}
      </Panel>
    </div>
  );
}

function VendorMarketPriceChart({ sources, recommendedPrice, shopPrice }) {
  const maxPrice = Math.max(...sources.map((item) => item.max), recommendedPrice, shopPrice);
  const minPrice = Math.min(...sources.map((item) => item.min), recommendedPrice, shopPrice);
  const range = maxPrice - minPrice || 1;

  const toPercent = (value) => ((value - minPrice) / range) * 100;

  return (
    <div className="mt-5 space-y-4">
      <div className="relative h-11 rounded-lg bg-stone-50">
        <span className="absolute left-0 top-0 text-[10px] font-bold text-stone-400">
          {formatShortCurrency(minPrice)}
        </span>
        <span className="absolute right-0 top-0 text-[10px] font-bold text-stone-400">
          {formatShortCurrency(maxPrice)}
        </span>
        {[
          ["Giá đề xuất", recommendedPrice, "bg-teal-600", "text-teal-700"],
          ["Giá shop", shopPrice, "bg-orange-500", "text-orange-700"],
        ].map(([label, value, barClass, textClass], index) => (
          <span
            key={label}
            className="absolute bottom-0 top-4 w-px"
            style={{ left: `${toPercent(value)}%` }}
          >
            <span className={cn("block h-full w-px", barClass)} />
            <span
              className={cn(
                "absolute top-6 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold shadow-sm",
                textClass,
              )}
              style={{ marginTop: index ? 18 : 0 }}
            >
              {label}
            </span>
          </span>
        ))}
      </div>
      <div className="space-y-3 pt-5">
        {sources.map((item) => {
          const left = toPercent(item.min);
          const width = toPercent(item.max) - left;
          const avg = toPercent(item.avg);
          return (
            <div key={item.source} className="grid gap-2 sm:grid-cols-[124px_1fr_98px] sm:items-center">
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-stone-700">{item.source}</p>
                <p className="text-[11px] font-semibold text-stone-400">{item.sales} lượt bán</p>
              </div>
              <div className="relative h-8 rounded-full bg-stone-100">
                <span
                  className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full bg-orange-200"
                  style={{ left: `${left}%`, width: `${Math.max(width, 4)}%` }}
                />
                <span
                  className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-orange-500 shadow-sm"
                  style={{ left: `${avg}%` }}
                  title={`Giá trung bình ${formatCurrency(item.avg)}`}
                />
              </div>
              <p className="text-xs font-bold text-stone-500 sm:text-right">
                {formatShortCurrency(item.avg)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MarketInsightRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50/70 p-3">
      <span className="vendor-stat-icon is-teal h-9 w-9">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold text-stone-400">{label}</p>
        <p className="mt-1 truncate text-sm font-extrabold text-stone-800">{value}</p>
      </div>
    </div>
  );
}

function MarketingPage({ onToast }) {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        <InsightCard
          title="Doanh thu từ ads"
          icon={BarChart3}
          value="42,8 triệu"
          label="ROAS trung bình 5,8x"
          text="Tăng 12,4% so với 7 ngày trước."
          tone="is-orange"
        />
        <InsightCard
          title="Voucher đang chạy"
          icon={TicketPercent}
          value="12"
          label="3 voucher sắp hết ngân sách"
          text="Voucher theo dõi shop có hiệu suất tốt nhất."
          tone="is-yellow"
        />
        <InsightCard
          title="Lịch livestream"
          icon={Sparkles}
          value="18:30"
          label="8 sản phẩm đã ghim"
          text="Kịch bản bán hàng đã sẵn sàng."
          tone="is-teal"
        />
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel className="p-5">
          <PanelHeader
            title="Chiến dịch đang chạy"
            subtitle="Theo dõi tiến độ ngân sách"
          >
            <button
              type="button"
              className="vendor-primary-button"
              onClick={() =>
                onToast({
                  title: "Tạo chiến dịch",
                  message: "Đã mở flow thiết lập chiến dịch mới.",
                })
              }
            >
              <Plus className="h-4 w-4" />
              Tạo chiến dịch
            </button>
          </PanelHeader>
          <div className="mt-4 space-y-3">
            {campaigns.map((campaign) => (
              <div key={campaign.name} className="vendor-list-item block">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-extrabold text-stone-800">
                      {campaign.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-stone-400">
                      {campaign.metric} · Ngân sách {campaign.budget}
                    </p>
                  </div>
                  <StatusBadge status="Đang chạy" />
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="vendor-progress h-full rounded-full bg-orange-500"
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs font-bold text-stone-400">
                  <span>Đã dùng {campaign.progress}%</span>
                  <span className="text-teal-700">{campaign.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-5">
          <PanelHeader
            title="Gợi ý tăng trưởng"
            subtitle="Dựa trên hiệu suất shop"
          />
          <div className="mt-4 space-y-2">
            {[
              "Tạo combo mua 2 giảm 8%",
              "Bật voucher cho khách mới",
              "Đẩy tồn cao vào Flash Sale",
              "Chuẩn bị kịch bản live 30 phút",
            ].map((item) => (
              <button
                key={item}
                type="button"
                className="vendor-task"
                onClick={() =>
                  onToast({ title: "Đã chọn gợi ý", message: item })
                }
              >
                <Sparkles className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-bold text-stone-600">{item}</span>
              </button>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}

function FinancePage({ onToast }) {
  const exportStatement = () => {
    downloadCsv(
      "seller-statement.csv",
      ["Mã đơn", "Khách hàng", "Giá trị", "Thời gian"],
      orders.map((order) => [
        order.id,
        order.buyer,
        formatCurrency(order.total),
        order.time,
      ]),
    );
    onToast({
      title: "Đã xuất sao kê",
      message: "Sao kê giao dịch đã được tải xuống.",
    });
  };
  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [
            "Số dư khả dụng",
            "86,2 triệu",
            "Có thể rút hôm nay",
            WalletCards,
            "is-green",
          ],
          ["Chờ đối soát", "24,9 triệu", "128 đơn hàng", Clock3, "is-orange"],
          [
            "Phí nền tảng",
            "3,12 triệu",
            "7 ngày gần nhất",
            CreditCard,
            "is-teal",
          ],
          ["Hoàn tiền", "1,48 triệu", "5 yêu cầu", Banknote, "is-red"],
        ].map(([label, value, change, icon, tone]) => (
          <StatCard
            key={label}
            stat={{ label, value, change, note: "", icon, tone }}
          />
        ))}
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel className="p-5">
          <PanelHeader
            title="Giao dịch gần đây"
            subtitle="Các khoản thu từ đơn hàng"
          >
            <button
              type="button"
              className="vendor-secondary-button"
              onClick={exportStatement}
            >
              <Download className="h-4 w-4" />
              Sao kê
            </button>
          </PanelHeader>
          <div className="mt-3 divide-y divide-stone-100">
            {orders.slice(0, 6).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="text-sm font-extrabold text-stone-700">
                    {order.id}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-stone-400">
                    {order.buyer} · {order.time}
                  </p>
                </div>
                <p className="text-sm font-extrabold text-teal-700">
                  +{formatCurrency(order.total)}
                </p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-5">
          <PanelHeader
            title="Tài khoản nhận tiền"
            subtitle="Đã xác minh bởi ShopVN"
          />
          <div className="mt-4 rounded-xl border border-stone-100 bg-stone-50 p-4">
            <p className="font-extrabold text-stone-800">Vietcombank</p>
            <p className="mt-1 text-sm font-semibold text-stone-500">
              Nguyen Tai Phat · **** 8421
            </p>
            <StatusBadge className="mt-3" status="Đã xác minh" />
          </div>
          <button
            type="button"
            className="vendor-secondary-button mt-4 w-full justify-center"
            onClick={() =>
              onToast({
                title: "Cập nhật tài khoản",
                message:
                  "Thông tin ngân hàng sẽ cần xác minh lại sau khi thay đổi.",
              })
            }
          >
            <PenLine className="h-4 w-4" />
            Cập nhật tài khoản
          </button>
        </Panel>
      </section>
    </div>
  );
}

function VendorToggle({ checked, onChange, disabled = false, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-70",
        checked
          ? "border-teal-600 bg-teal-600"
          : "border-stone-200 bg-stone-200",
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

function SettingsPage({ onToast }) {
  const [operationSettings, setOperationSettings] = useState({
    autoCod: false,
    lowStockAlert: true,
    hideOutOfStock: true,
    quickChatReply: true,
  });

  const updateOperationSetting = (settingId, enabled) => {
    setOperationSettings((current) => ({ ...current, [settingId]: enabled }));
    const setting = operationSettingDefaults.find(
      (item) => item.id === settingId,
    );
    onToast({
      title: enabled ? "Đã bật cấu hình" : "Đã tắt cấu hình",
      message: setting ? setting.label : "Cấu hình vận hành đã được cập nhật.",
    });
  };

  return (
    <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <Panel className="p-5">
        <PanelHeader
          title="Hồ sơ cửa hàng"
          subtitle="Thông tin hiển thị với khách hàng"
        />
        <div className="mt-5 flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Store className="h-7 w-7" />
          </span>
          <div>
            <p className="font-extrabold text-stone-800">ShopVN Seller</p>
            <p className="mt-1 text-xs font-semibold text-stone-400">
              Mã shop VND-2026-0412
            </p>
            <StatusBadge className="mt-2" status="Đang hoạt động" />
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          {[
            ["Tên shop", "ShopVN Seller"],
            ["Ngành hàng chính", "Thời trang & phụ kiện"],
            ["Email hỗ trợ", "support@shopvn.local"],
            ["Số điện thoại", "0922393339"],
          ].map(([label, value]) => (
            <label key={label}>
              <span className="text-xs font-bold text-stone-500">{label}</span>
              <input
                className="vendor-input mt-1 h-11 w-full px-3 text-sm"
                defaultValue={value}
              />
            </label>
          ))}
        </div>
        <button
          type="button"
          className="vendor-primary-button mt-4"
          onClick={() =>
            onToast({
              title: "Đã lưu thay đổi",
              message: "Hồ sơ cửa hàng đã được cập nhật thành công.",
            })
          }
        >
          <CheckCircle2 className="h-4 w-4" />
          Lưu thay đổi
        </button>
      </Panel>

      <div className="space-y-5">
        <Panel className="p-5">
          <PanelHeader
            title="Xác minh & bảo mật"
            subtitle="Trạng thái bảo vệ tài khoản"
          />
          <div className="mt-4 space-y-2">
            {[
              ["CCCD chủ shop", "Đã xác minh", ShieldCheck],
              ["Tài khoản ngân hàng", "Đã xác minh", Banknote],
              ["Xác thực 2 lớp", "Khuyến nghị bật", BadgeCheck],
            ].map(([label, value, Icon]) => (
              <div key={label} className="vendor-list-item">
                <span className="flex items-center gap-3 text-sm font-bold text-stone-600">
                  <Icon className="h-4 w-4 text-teal-700" />
                  {label}
                </span>
                <span className="text-xs font-bold text-stone-400">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <PanelHeader
            title="Cấu hình vận hành"
            subtitle="Tự động hóa công việc hằng ngày"
          />
          <div className="mt-4 divide-y divide-stone-100">
            {operationSettingDefaults.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-stone-700">
                    {setting.label}
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-stone-400">
                    {setting.description}
                  </p>
                </div>
                <VendorToggle
                  checked={operationSettings[setting.id]}
                  label={setting.label}
                  onChange={(enabled) =>
                    updateOperationSetting(setting.id, enabled)
                  }
                />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}

const pageComponents = {
  trangchu: OverviewPage,
  "don-hang": OrdersPage,
  "san-pham": ProductsPage,
  "van-chuyen": ShippingPage,
  "kho-hang": WarehousePage,
  "tin-nhan": MessagesPage,
  "nghien-cuu-thi-truong": MarketResearchPage,
  marketing: MarketingPage,
  "tai-chinh": FinancePage,
  "cai-dat-shop": SettingsPage,
};

export default function VendorHome() {
  const { section = "trangchu" } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const Page = pageComponents[section];
  if (!Page) return <Navigate to="/vendor/trangchu" replace />;
  const navigateTo = (slug) => navigate(`/vendor/${slug}`);
  return (
    <>
      <VendorLayout activeSlug={section} onToast={setToast}>
        <Page navigate={navigate} navigateTo={navigateTo} onToast={setToast} />
      </VendorLayout>
      {toast && <VendorToast toast={toast} onClose={() => setToast(null)} />}
    </>
  );
}
