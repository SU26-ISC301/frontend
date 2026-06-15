import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowUpRight,
  AlertTriangle,
  BadgeCheck,
  Banknote,
  BarChart3,
  Bell,
  Boxes,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  CircleHelp,
  Clock3,
  History,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  ImagePlus,
  LayoutDashboard,
  Lock,
  LogOut,
  Megaphone,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  MousePointerClick,
  PackageSearch,
  PenLine,
  Plus,
  ReceiptText,
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
import { marketResearchApi } from "../api/marketResearchAPI";
import { sellerApi } from "../api/sellerAPI";
import { getSubscriptionStatus } from "../api/subscriptionApi";
import { productStorage, mapBackendProductToLocal, buildBackendPayloadFromLocal, mergeProductData } from "../utils/productStorage";
import {
  CategorySelectorField,
  ELECTRONICS_CATEGORIES,
} from "../components/Seller/CategorySelectorField";
import AddWarehouseModal from "../components/Seller/Warehouse/AddWarehouseModal";
import { DatePickerCalendar } from "../components/ui/date-picker-calendar";
import { VIETNAM_PROVINCES } from "../data/vietnamAdministrativeUnits";
import { VENDOR_FEATURES } from "../config/vendorFeatures";
import SubscriptionPlanModal, {
  getVendorPlan,
  getRemainingSlots,
} from "../components/Seller/SubscriptionPlanModal";
import PostingQuotaBanner from "../components/Seller/PostingQuotaBanner";

const navItems = [
  { slug: "trangchu", label: "Tổng quan", icon: LayoutDashboard },
  { slug: "don-hang", label: "Đơn hàng", icon: ShoppingBag, badge: "12" },
  { slug: "san-pham", label: "Sản phẩm", icon: PackageSearch },
  { slug: "van-chuyen", label: "Vận chuyển", icon: Truck },
  { slug: "kho-hang", label: "Kho hàng", icon: Warehouse },
  { slug: "tin-nhan", label: "Tin nhắn", icon: MessageSquareText },
  {
    slug: "nghien-cuu-thi-truong",
    label: "Nghiên cứu thị trường",
    icon: TrendingUp,
  },
  { slug: "marketing", label: "Marketing", icon: TicketPercent },
  { slug: "tai-chinh", label: "Tài chính", icon: WalletCards },
  { slug: "nhat-ky-hoat-dong", label: "Nhật ký hoạt động", icon: History },
  { slug: "cai-dat-shop", label: "Cài đặt shop", icon: Settings },
];

const visibleNavItems = navItems.filter(
  (item) => VENDOR_FEATURES.warehouse || item.slug !== "kho-hang",
);

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
    "Kho hàng & lấy trả",
    "Thiết lập địa chỉ lấy hàng, trả hàng và vùng phục vụ của shop.",
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
  "nhat-ky-hoat-dong": [
    "Nhật ký hoạt động cửa hàng",
    "Giám sát chi tiết các sự kiện đăng nhập, cập nhật sản phẩm và nâng cấp gói của shop bạn.",
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

const PROMOTION_CONFIG = {
  minBudget: 50000,
  maxBudget: 50000000,
  minDurationDays: 1,
  maxDurationDays: 30,
  budgetPresets: [100000, 300000, 500000, 1000000],
};

const mockPromotionWallet = {
  availableBalance: 700000,
  lockedBalance: 500000,
  totalDeposited: 2200000,
  totalSpent: 385000,
};

const mockPromotionProducts = [
  {
    id: "mock-post-101",
    sku: "SPV-MKT-101",
    name: "Tai nghe bluetooth mini",
    category: "Điện tử",
    price: 499000,
    status: "Đang bán",
    quality: 92,
    sold: 184,
    reputationScore: 85,
  },
  {
    id: "mock-post-102",
    sku: "SPV-MKT-102",
    name: "Bình giữ nhiệt 750ml",
    category: "Gia dụng",
    price: 189000,
    status: "Đang bán",
    quality: 78,
    sold: 96,
    reputationScore: 60,
  },
  {
    id: "mock-post-103",
    sku: "SPV-MKT-103",
    name: "Túi tote canvas basic",
    category: "Thời trang",
    price: 149000,
    status: "Tồn thấp",
    quality: 68,
    sold: 42,
    reputationScore: 30,
  },
];

const mockPromotions = [
  {
    id: "PRM-9001",
    postId: "mock-post-101",
    postName: "Tai nghe bluetooth mini",
    status: "ACTIVE",
    initialBudget: 500000,
    remainingBudget: 326000,
    spentAmount: 174000,
    impressions: 12840,
    clicks: 87,
    cpcSnapshot: 2000,
    startDate: "2026-06-12",
    endDate: "2026-06-19",
  },
  {
    id: "PRM-9002",
    postId: "mock-post-102",
    postName: "Bình giữ nhiệt 750ml",
    status: "SCHEDULED",
    initialBudget: 300000,
    remainingBudget: 300000,
    spentAmount: 0,
    impressions: 0,
    clicks: 0,
    cpcSnapshot: 2000,
    startDate: "2026-06-16",
    endDate: "2026-06-23",
  },
];

const mockWalletTransactions = [
  {
    id: "WTX-2309",
    type: "PROMOTION_RESERVE",
    label: "Giữ ngân sách PRM-9001",
    amount: -500000,
    availableAfter: 700000,
    lockedAfter: 500000,
    time: "12/06/2026 09:22",
  },
  {
    id: "WTX-2308",
    type: "TOP_UP",
    label: "Nạp tiền qua cổng thanh toán",
    amount: 1000000,
    availableAfter: 1200000,
    lockedAfter: 0,
    time: "12/06/2026 09:12",
  },
  {
    id: "WTX-2307",
    type: "PROMOTION_CLICK_CHARGE",
    label: "Click hợp lệ PRM-9001",
    amount: -2000,
    availableAfter: 700000,
    lockedAfter: 498000,
    time: "12/06/2026 10:31",
  },
];

const salesTrend = Array.from({ length: 180 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (179 - index));
  const weekdayFactor = [0.82, 0.92, 1.01, 1.06, 1.08, 1.24, 1.18][
    date.getDay()
  ];
  const campaignBoost = index > 170 && index < 175 ? 1.15 : 1;
  const revenue =
    Math.round(
      (12.6 + Math.sin(index / 2.9) * 2.5 + index * 0.03) *
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

function formatPercent(value) {
  return `${new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 1,
  }).format(value)}%`;
}

function calculatePromotionCpc(reputationScore = 30) {
  if (reputationScore >= 80) return 1000;
  if (reputationScore >= 50) return 2000;
  return 3000;
}

function getPromotionStatusLabel(status) {
  return {
    ACTIVE: "Đang chạy",
    SCHEDULED: "Sắp chạy",
    EXHAUSTED: "Hết ngân sách",
    COMPLETED: "Đã hoàn tất",
    CANCELLED: "Đã hủy",
  }[status] || status;
}

function toInputDate(date) {
  return date.toISOString().split("T")[0];
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

function getFirstLeafCategoryId(node) {
  return (
    getCategoryLeaves(node)[0]?.id ||
    node?.id ||
    DEFAULT_VENDOR_PARENT_CATEGORY_ID
  );
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
  return getFirstLeafCategoryId(parentCategory);
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
      "Đã có dữ liệu": "is-green",
      "Đã hoàn tất": "is-green",
      "Đang giao": "is-blue",
      "Trên đường giao": "is-blue",
      "Đã lên lịch": "is-blue",
      "Sắp chạy": "is-blue",
      "Đang xử lý": "is-orange",
      "Chờ duyệt": "is-orange",
      "Chờ Admin duyệt": "is-orange",
      "Chờ xác nhận": "is-orange",
      "Chờ bàn giao": "is-orange",
      "Cần in nhãn": "is-orange",
      "Tồn thấp": "is-red",
      "Hết ngân sách": "is-red",
      "Bị từ chối": "is-red",
      "Cảnh báo": "is-red",
      "Trả hàng": "is-red",
      "Tạm ẩn": "is-gray",
      "Nháp": "is-gray",
      "Bản nháp": "is-gray",
      "Dự phòng": "is-gray",
      "Chưa có": "is-gray",
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

  const isError = toast.type === "error" || toast.tone === "red";

  return (
    <div className={cn(
      "vendor-toast fixed bottom-5 right-5 z-[70] flex max-w-sm items-start gap-3 rounded-xl border bg-white p-4 shadow-xl",
      isError ? "border-red-100 shadow-red-950/10" : "border-orange-100 shadow-orange-950/10"
    )}>
      <span className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
        isError ? "bg-red-50 text-red-600" : "bg-teal-50 text-teal-700"
      )}>
        {isError ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
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

function VendorLayout({ activeSlug, children, onToast, hasWarehouseConfigured, onOpenPlanModal }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const vendorInfo = getVendorInfo();
  const navigate = useNavigate();
  const [title, subtitle] = pageTitles[activeSlug] || pageTitles.trangchu;
  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    const storedProducts = productStorage.getStoredProducts();
    return [
      ...visibleNavItems.map((item) => ({
        slug: item.slug,
        title: item.label,
        meta: "Chức năng seller",
        icon: item.icon,
      })),
      ...storedProducts.map((product) => ({
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
    localStorage.removeItem("vendorAccessToken");
    localStorage.removeItem("vendorRefreshToken");
    localStorage.removeItem("vendorInfo");
    navigate("/seller");
  };

  const handleAddProduct = async () => {
    try {
      const status = await getSubscriptionStatus();
      if (status?.canPost === false || status?.remainingSlots === 0) {
        onOpenPlanModal?.({ blocksNavigation: true });
        return;
      }
      navigate("/vendor/products/add");
    } catch {
      const remaining = getRemainingSlots();
      if (remaining <= 0) {
        onOpenPlanModal?.({ blocksNavigation: true });
      } else {
        navigate("/vendor/products/add");
      }
    }
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
          {visibleNavItems.map(({ slug, label, icon: Icon, badge }) => {
            const isLocked = slug === 'nghien-cuu-thi-truong' && getVendorPlan().planId === 'free';
            return (
              <NavLink
                key={slug}
                to={`/vendor/${slug}`}
                className={({ isActive }) =>
                  cn("vendor-nav-item", isActive && "is-active", isLocked && "opacity-75 hover:opacity-100")
                }
              >
                <Icon className="h-[18px] w-[18px]" />
                <span>{label}</span>
                {isLocked ? (
                  <Lock className="ml-auto h-3.5 w-3.5 text-emerald-200/50" />
                ) : badge ? (
                  <span className="ml-auto rounded-full bg-orange-400 px-2 py-0.5 text-[10px] font-extrabold text-stone-950">
                    {badge}
                  </span>
                ) : null}
              </NavLink>
            );
          })}
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
            {hasWarehouseConfigured || !VENDOR_FEATURES.warehouse ? (
              <button
                type="button"
                className="vendor-primary-button hidden sm:inline-flex"
                onClick={handleAddProduct}
              >
                <Plus className="h-4 w-4" />
                Đăng tin sản phẩm
              </button>
            ) : (
              <button
                type="button"
                className="vendor-secondary-button hidden sm:inline-flex border-orange-200 text-orange-600 bg-orange-50/50 hover:bg-orange-50"
                onClick={() => navigate("/vendor/kho-hang")}
              >
                Thiết lập kho hàng
              </button>
            )}
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
      className="vendor-panel vendor-stat-card group w-full p-5 text-left relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-stone-400">
            {stat.label}
          </p>
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-stone-950">
            {stat.isLocked ? (
              <span className="flex items-center gap-1 text-stone-400 text-sm font-bold">
                <Lock className="h-4 w-4" /> Khóa
              </span>
            ) : (
              stat.value
            )}
          </p>
        </div>
        <span className={cn("vendor-stat-icon", stat.tone)}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-xs font-semibold text-stone-400">
        {stat.isLocked ? (
          <span className="text-stone-400 font-bold">Yêu cầu gói Plus/Premium</span>
        ) : (
          <>
            <span className="mr-1.5 font-extrabold text-teal-700">
              {stat.change}
            </span>
            {stat.note}
          </>
        )}
      </p>
      {onClick && (
        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-extrabold text-orange-600 opacity-0 transition-opacity group-hover:opacity-100">
          {stat.isLocked ? "Nâng cấp ngay" : "Xem chi tiết"} <ArrowUpRight className="h-3 w-3" />
        </span>
      )}
    </button>
  );
}

function OverviewPage({ navigateTo, onToast, onOpenPlanModal }) {
  const plan = getVendorPlan();
  const planId = plan.planId;

  // Custom date range state for Premium
  const [customStartDate, setCustomStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 29); // Default to last 30 days
    return d.toISOString().split('T')[0];
  });
  const [customEndDate, setCustomEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Range state for quick filter (7, 14, 30 days)
  const [range, setRange] = useState(() => {
    if (planId === 'free') return 7;
    if (planId === 'plus') return 30; // Plus defaults to 30 days
    return 7; // Premium defaults to 7 days
  });

  // Calendar popup open states
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);

  // Calendar anchor refs
  const startRef = useRef(null);
  const endRef = useRef(null);

  // Formatter for display
  const formatDisplayDate = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };

  const [statsData, setStatsData] = useState(null);

  const vendorInfo = getVendorInfo();
  const vendorId = vendorInfo?.id || vendorInfo?.vendorId;

  useEffect(() => {
    if (!vendorId) return;
    let mounted = true;

    const fetchStats = async () => {
      try {
        const queryRange = isCustomMode ? null : (planId === 'free' ? 7 : range);
        const queryStart = isCustomMode ? customStartDate : null;
        const queryEnd = isCustomMode ? customEndDate : null;
        const data = await sellerApi.getVisitsStats(vendorId, queryRange, queryStart, queryEnd);
        if (mounted) {
          setStatsData(data);
        }
      } catch (err) {
        console.error("Lỗi khi tải thống kê lượt truy cập:", err);
      }
    };

    fetchStats();
    return () => {
      mounted = false;
    };
  }, [vendorId, range, customStartDate, customEndDate, isCustomMode, planId]);

  const isRealData = Boolean(statsData);

  const trend = useMemo(() => {
    if (isRealData && statsData?.trend) {
      return statsData.trend;
    }
    // If premium and in custom date mode
    if (planId === 'premium' && isCustomMode) {
      if (customStartDate && customEndDate) {
        const start = new Date(customStartDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        
        const filtered = salesTrend.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= start && itemDate <= end;
        });
        
        return filtered.length >= 2 ? filtered : salesTrend.slice(-7);
      }
    }
    
    // Quick filters
    if (planId === 'free') {
      return salesTrend.slice(-7); // Free is locked to 7 days
    }
    
    if (planId === 'plus') {
      // Plus can select up to 30 days (7, 14, 30)
      return salesTrend.slice(-Math.min(range, 30));
    }
    
    // Premium can use quick filters or custom range
    return salesTrend.slice(-range);
  }, [planId, isCustomMode, customStartDate, customEndDate, range, isRealData, statsData]);

  const latest = trend.at(-1) || { revenue: 0, orders: 0 };
  const previous = trend.at(-2) || { revenue: 1, orders: 0 };
  const change = previous.revenue > 0 ? ((latest.revenue - previous.revenue) / previous.revenue) * 100 : 0;
  
  const stats = [
    {
      label: "Lượt truy cập hôm nay",
      value: new Intl.NumberFormat("vi-VN").format(
        isRealData && statsData ? statsData.todayVisits : Math.round(latest.revenue * 240)
      ),
      change: `${change >= 0 ? "+" : ""}${change.toFixed(1).replace(".", ",")}%`,
      note: "so với hôm qua",
      icon: Eye,
      tone: "is-orange",
      target: "trangchu",
      isLocked: planId === 'free',
    },
    {
      label: "Tổng lượt truy cập",
      value: new Intl.NumberFormat("vi-VN").format(
        isRealData && statsData ? statsData.totalVisits : Math.round(trend.reduce((sum, item) => sum + item.revenue * 240, 0))
      ),
      change: "+14,2%",
      note: "so với tuần trước",
      icon: Users,
      tone: "is-teal",
      target: "trangchu",
      isLocked: planId === 'free',
    },
    {
      label: "Tổng tin nhắn",
      value: new Intl.NumberFormat("vi-VN").format(
        isRealData && statsData ? Math.round(statsData.todayVisits * 0.08) : Math.round(latest.revenue * 15)
      ),
      change: "+5,3%",
      note: "so với tuần trước",
      icon: MessageSquareText,
      tone: "is-green",
      target: "tin-nhan",
      isLocked: false,
    },
    {
      label: "Đánh giá shop",
      value: "4,8 / 5",
      change: "2.431",
      note: "đánh giá đã xác minh",
      icon: Star,
      tone: "is-yellow",
      target: "cai-dat-shop",
      isLocked: false,
    },
  ];

  const handlePeriodClick = (period) => {
    if (planId === 'free' && period > 7) {
      onToast({
        title: "Tính năng bị giới hạn",
        message: "Gói Free chỉ hiển thị tối đa 7 ngày gần nhất. Hãy nâng cấp để xem báo cáo xa hơn!",
      });
      onOpenPlanModal();
      return;
    }
    setIsCustomMode(false);
    setRange(period);
  };

  const exportRevenue = () => {
    const factor = isRealData ? 1 : 240;
    downloadCsv(
      "seller-visits.csv",
      ["Ngày", "Lượt truy cập", "Số đơn"],
      trend.map((item) => [item.label, Math.round(item.revenue * factor), item.orders]),
    );
    onToast({
      title: "Đã tải báo cáo",
      message: isCustomMode
        ? `Báo cáo lượt truy cập đã được xuất thành file CSV.`
        : `Lượt truy cập ${range} ngày đã được xuất thành file CSV.`,
    });
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            stat={stat}
            onClick={() => {
              if (stat.isLocked) {
                onToast({
                  title: "Tính năng bị giới hạn",
                  message: `Thống kê "${stat.label}" chỉ dành cho các tài khoản đã nâng cấp lên gói Plus hoặc Premium.`,
                });
                onOpenPlanModal();
                return;
              }
              navigateTo(stat.target);
            }}
          />
        ))}
      </section>
      <section className="grid gap-5 grid-cols-1">
        <Panel className="min-w-0 p-5 relative">
          <PanelHeader
            title="Lượt truy cập vào shop"
            subtitle={
              isCustomMode
                ? `Lượt truy cập từ ${new Date(customStartDate).toLocaleDateString('vi-VN')} đến ${new Date(customEndDate).toLocaleDateString('vi-VN')}`
                : `Lượt truy cập trong ${planId === 'free' ? 7 : range} ngày gần nhất`
            }
          >
            <div className="flex flex-wrap items-center gap-2 mr-2">
              {/* Pulsing indicator for Premium */}
              {planId === 'premium' && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-extrabold text-emerald-700 mr-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Cập nhật liên tục</span>
                </div>
              )}

              {/* Quick Period Buttons */}
              <div className="flex bg-stone-100/80 p-0.5 rounded-lg border border-stone-200/40">
                {[7, 14, 30].map((period) => {
                  const isLocked = planId === 'free' && period > 7;
                  const isActive = !isCustomMode && (planId === 'free' ? period === 7 : range === period);
                  return (
                    <button
                      key={period}
                      type="button"
                      disabled={planId === 'free' && period > 7}
                      className={cn(
                        "px-2.5 py-1 text-[11px] font-bold rounded-md transition-all duration-150 flex items-center gap-1",
                        isActive
                          ? "bg-white text-stone-800 shadow-sm"
                          : "text-stone-500 hover:text-stone-800 disabled:opacity-50"
                      )}
                      onClick={() => handlePeriodClick(period)}
                    >
                      <span>{period} ngày</span>
                      {isLocked && <Lock className="h-2.5 w-2.5 text-stone-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Range Selector */}
              {planId === 'premium' ? (
                <div className="flex items-center bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm gap-2">
                  {/* Start Date */}
                  <div className="relative flex items-center gap-2" ref={startRef}>
                    <button
                      type="button"
                      onClick={() => setStartCalendarOpen((prev) => !prev)}
                      className="text-xs font-bold text-stone-700 hover:text-orange-600 transition"
                    >
                      {formatDisplayDate(customStartDate)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStartCalendarOpen((prev) => !prev)}
                      className="text-stone-400 hover:text-stone-600 focus:outline-none"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                    </button>
                    <DatePickerCalendar
                      open={startCalendarOpen}
                      anchorRef={startRef}
                      value={customStartDate}
                      minDate={undefined}
                      maxDate={new Date(customEndDate)}
                      onSelect={(iso) => {
                        setCustomStartDate(iso);
                        setIsCustomMode(true);
                        setStartCalendarOpen(false);
                      }}
                      onClose={() => setStartCalendarOpen(false)}
                    />
                  </div>

                  <span className="text-[11px] font-semibold text-stone-400">đến</span>

                  {/* End Date */}
                  <div className="relative flex items-center gap-2" ref={endRef}>
                    <button
                      type="button"
                      onClick={() => setEndCalendarOpen((prev) => !prev)}
                      className="text-xs font-bold text-stone-700 hover:text-orange-600 transition"
                    >
                      {formatDisplayDate(customEndDate)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEndCalendarOpen((prev) => !prev)}
                      className="text-stone-400 hover:text-stone-600 focus:outline-none"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                    </button>
                    <DatePickerCalendar
                      open={endCalendarOpen}
                      anchorRef={endRef}
                      value={customEndDate}
                      minDate={new Date(customStartDate)}
                      maxDate={new Date()}
                      onSelect={(iso) => {
                        setCustomEndDate(iso);
                        setIsCustomMode(true);
                        setEndCalendarOpen(false);
                      }}
                      onClose={() => setEndCalendarOpen(false)}
                    />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onToast({
                      title: "Yêu cầu nâng cấp",
                      message: "Tính năng chọn khoảng thời gian tùy chỉnh chỉ dành cho gói Premium. Hãy nâng cấp ngay để trải nghiệm!",
                    });
                    onOpenPlanModal();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100/50 border border-stone-200/30 rounded-full text-[11px] font-bold text-stone-400 hover:text-stone-600 transition"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Chọn khoảng thời gian</span>
                </button>
              )}
            </div>

            <button
              type="button"
              aria-label="Xuất báo cáo"
              className="vendor-icon-button"
              onClick={exportRevenue}
            >
              <Download className="h-4 w-4" />
            </button>
          </PanelHeader>
          {planId === 'free' && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[3px] rounded-3xl p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 shadow-sm border border-orange-100 mb-3">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-extrabold text-stone-900">Biểu đồ lượt truy cập bị giới hạn</h3>
              <p className="mt-1 max-w-xs text-xs font-semibold text-stone-500 leading-normal">
                Xem biểu đồ xu hướng lượt truy cập hàng ngày của cửa hàng khi nâng cấp lên gói Plus hoặc Premium.
              </p>
              <button
                type="button"
                onClick={onOpenPlanModal}
                className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold rounded-full shadow-md shadow-orange-500/15 transition-all"
              >
                Nâng cấp ngay
              </button>
            </div>
          )}
          <VendorRevenueChart data={trend} />
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
        <Panel className="p-5 relative">
          <PanelHeader
            title="Bài đăng thịnh hành"
            subtitle="Top 3 sản phẩm có lượt truy cập cao nhất"
          />
          {planId !== 'premium' && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[3px] rounded-3xl p-5 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 shadow-sm border border-orange-100 mb-3">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-extrabold text-stone-900">Bài đăng thịnh hành bị giới hạn</h3>
              <p className="mt-1 max-w-xs text-xs font-semibold text-stone-500 leading-normal">
                Thống kê Top 3 sản phẩm thịnh hành nhất chỉ áp dụng cho gói Premium.
              </p>
              <button
                type="button"
                onClick={onOpenPlanModal}
                className="mt-3 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold rounded-full shadow-md shadow-orange-500/15 transition-all"
              >
                Nâng cấp Premium
              </button>
            </div>
          )}
          <div className="mt-5 space-y-4">
            {statsData?.topProducts && statsData.topProducts.length > 0 ? (
              statsData.topProducts.map((prod, idx) => (
                <div
                  key={prod.id || idx}
                  onClick={() => prod.id && window.open(`/products/${prod.id}`, '_blank', 'noopener,noreferrer')}
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-stone-50 cursor-pointer transition-colors border border-stone-100 bg-white"
                >
                  <span className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-black text-white shrink-0 shadow-sm",
                    idx === 0 ? "bg-amber-500" : idx === 1 ? "bg-slate-400" : "bg-orange-400"
                  )}>
                    {idx + 1}
                  </span>
                  <div className="h-12 w-12 rounded-xl bg-stone-100 overflow-hidden border border-stone-200/60 shrink-0">
                    {prod.imageUrl ? (
                      <img src={prod.imageUrl} alt={prod.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-stone-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-extrabold text-stone-900 group-hover:text-orange-600 transition-colors">
                      {prod.name}
                    </p>
                    <p className="mt-1 text-[11px] font-black text-orange-600">
                      {prod.price > 0 ? `₫${new Intl.NumberFormat('vi-VN').format(prod.price)}` : 'Liên hệ'}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-extrabold text-[#ff5a2f] ring-1 ring-orange-100">
                    {new Intl.NumberFormat('vi-VN').format(prod.visits)} lượt xem
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs font-bold text-stone-400">
                Chưa có dữ liệu bài đăng thịnh hành.
              </div>
            )}
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
  const visitsFactor = (data && data.length > 0 && (data[0].visits !== undefined || data[0].visits === 0)) ? 1 : 240;

  const chartData = data.map((item) => ({
    ...item,
    visits: Math.round(item.revenue * visitsFactor),
  }));

  const max = Math.ceil(Math.max(...chartData.map((item) => item.visits)) / 500) * 500;
  const points = chartData.map((item, index) => ({
    ...item,
    x: (index / (chartData.length - 1)) * width,
    y: height - (item.visits / max) * height,
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
    <div className="mt-5 grid grid-cols-[45px_1fr] gap-3">
      <div className="flex h-64 flex-col justify-between pb-6 text-[10px] font-bold text-stone-400 text-right pr-1">
        {[1, 0.75, 0.5, 0.25].map((ratio) => (
          <span key={ratio}>{new Intl.NumberFormat("vi-VN").format(Math.round(max * ratio))}</span>
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
          aria-label={`Biểu đồ lượt truy cập ${data.length} ngày`}
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
              {new Intl.NumberFormat("vi-VN").format(hovered.visits)} lượt
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
  const pageSize = 10;
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

function ProductsPage({ onToast, navigate, hasWarehouseConfigured, onOpenPlanModal }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [planRefreshKey, setPlanRefreshKey] = useState(0);
  const [productsList, setProductsList] = useState(() => productStorage.getStoredProducts());
  const [activeDropdownSku, setActiveDropdownSku] = useState(null);
  const [rejectReasonModalProduct, setRejectReasonModalProduct] = useState(null);
  const pageSize = 10;
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdownSku(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'sellerProducts') {
        setProductsList(productStorage.getStoredProducts());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const syncBackendProducts = async () => {
      const vendorInfo = getVendorInfo();
      const vendorId = vendorInfo?.id || vendorInfo?.vendorId;
      if (!vendorId) return;

      try {
        let categories = [];
        try {
          categories = await sellerApi.getProductCategories();
        } catch (catErr) {
          console.warn('Lỗi lấy danh mục qua admin endpoint, thử market-research:', catErr);
          try {
            const res = await marketResearchApi.getVendorMarketResearch();
            if (res && Array.isArray(res.categories)) {
              categories = res.categories;
            }
          } catch (mrErr) {
            console.warn('Không thể lấy danh mục từ market-research:', mrErr);
          }
        }
        setCategoriesList(categories);

        const backendProducts = await sellerApi.getProductsByVendor(vendorId);
        if (Array.isArray(backendProducts)) {
          const stored = productStorage.getStoredProducts();
          
          // Filter out any local products that have a numeric ID but are NOT in the backend products list
          const backendIds = new Set(backendProducts.map(p => String(p.id)));
          let updated = stored.filter(p => {
            const isNumericId = p.id && /^\d+$/.test(String(p.id));
            if (!isNumericId) return true; // Keep local drafts that have not been saved to Backend yet
            return backendIds.has(String(p.id)); // Keep only if it still exists on the database
          });

          backendProducts.forEach(beProd => {
            const mapped = mapBackendProductToLocal(beProd, categories);
            const idx = updated.findIndex(p => p.sku === mapped.sku || (p.id && String(p.id) === String(mapped.id)));
            if (idx !== -1) {
              // Merge but keep local properties safely
              updated[idx] = mergeProductData(updated[idx], mapped);
            } else {
              updated.unshift(mapped);
            }
          });

          productStorage.saveStoredProducts(updated);
          setProductsList(updated);
        }
      } catch (err) {
        console.warn('Lỗi đồng bộ sản phẩm từ Backend:', err);
      }
    };

    syncBackendProducts();
  }, []);

  const refreshList = () => {
    setProductsList(productStorage.getStoredProducts());
  };

  const handleAddProductClick = async () => {
    try {
      const status = await getSubscriptionStatus();
      if (status?.canPost === false || status?.remainingSlots === 0) {
        onOpenPlanModal?.({ blocksNavigation: true });
        return;
      }
      navigate("/vendor/products/add");
    } catch {
      const remaining = getRemainingSlots();
      if (remaining <= 0) {
        onOpenPlanModal?.({ blocksNavigation: true });
      } else {
        navigate("/vendor/products/add");
      }
    }
  };

  const handlePublishProduct = async (sku) => {
    const product = productStorage.getProductBySku(sku);
    if (product) {
      const validation = productStorage.validateProduct(product);
      if (!validation.valid) {
        onToast({
          title: "Bản nháp chưa hoàn thiện",
          message: `Vui lòng chọn Chỉnh sửa để nhập đủ thông tin. Chi tiết: ${validation.error}`,
          type: "error",
        });
        return;
      }

      try {
        const status = await getSubscriptionStatus();
        if (status?.canPost === false || status?.remainingSlots === 0) {
          onOpenPlanModal?.({ blocksNavigation: true });
          return;
        }

        const backendPayload = buildBackendPayloadFromLocal(product, 'pending', categoriesList);
        let updatedId = product.id;
        const isNumericId = product.id && /^\d+$/.test(String(product.id));

        if (product.id && isNumericId) {
          await sellerApi.updateProduct(product.id, backendPayload);
        } else {
          const res = await sellerApi.createProduct(backendPayload);
          if (res && res.id) {
            updatedId = res.id;
          }
        }

        productStorage.updateProduct(sku, { id: updatedId, status: "Chờ duyệt", note: "Đang chờ Admin duyệt" });
        await getSubscriptionStatus().catch(() => {});
        onToast({
          title: "Gửi xét duyệt thành công",
          message: "Sản phẩm đã được chuyển sang hàng chờ Admin phê duyệt.",
        });
        refreshList();
      } catch (err) {
        console.error("Lỗi đồng bộ gửi duyệt lên BE:", err);
        const message = err.response?.data?.message || err.response?.data?.error || err.message;
        if (message?.toLowerCase().includes("hết lượt")) {
          await getSubscriptionStatus().catch(() => {});
          onOpenPlanModal?.({ blocksNavigation: true });
        }
        onToast({
          title: "Không thể gửi xét duyệt",
          message,
          type: "error",
        });
      }
    }
  };

  const handleRecallProduct = async (sku) => {
    const product = productStorage.getProductBySku(sku);
    if (product) {
      try {
        const isNumericId = product.id && /^\d+$/.test(String(product.id));
        if (product.id && isNumericId) {
          const backendPayload = buildBackendPayloadFromLocal(product, 'draft', categoriesList);
          await sellerApi.updateProduct(product.id, backendPayload);
        }
        
        productStorage.updateProduct(sku, { status: "Nháp", note: "Bản nháp" });
        onToast({
          title: "Đã thu hồi",
          message: "Sản phẩm đã được chuyển về trạng thái Bản nháp.",
        });
        refreshList();
      } catch (err) {
        console.error("Lỗi đồng bộ thu hồi lên BE:", err);
        alert("Không thể thu hồi sản phẩm về trạng thái nháp.\nChi tiết lỗi: " + (err.response?.data?.message || err.response?.data?.error || err.message));
      }
    }
  };

  const handleDeactivateProduct = async (sku) => {
    const product = productStorage.getProductBySku(sku);
    if (product) {
      try {
        const isNumericId = product.id && /^\d+$/.test(String(product.id));
        if (product.id && isNumericId) {
          const backendPayload = buildBackendPayloadFromLocal(product, 'inactive', categoriesList);
          await sellerApi.updateProduct(product.id, backendPayload);
        }

        productStorage.updateProduct(sku, { status: "Tạm ẩn", note: "Người bán tạm ẩn" });
        onToast({
          title: "Đã tạm ẩn",
          message: "Sản phẩm đã tạm ngừng hiển thị trên cửa hàng.",
        });
        refreshList();
      } catch (err) {
        console.error("Lỗi đồng bộ tạm ẩn lên BE:", err);
        alert("Không thể tạm ẩn sản phẩm.\nChi tiết lỗi: " + (err.response?.data?.message || err.response?.data?.error || err.message));
      }
    }
  };

  const handleActivateProduct = async (sku) => {
    const product = productStorage.getProductBySku(sku);
    if (product) {
      try {
        const isNumericId = product.id && /^\d+$/.test(String(product.id));
        if (product.id && isNumericId) {
          const backendPayload = buildBackendPayloadFromLocal(product, 'approved', categoriesList);
          await sellerApi.updateProduct(product.id, backendPayload);
        }

        productStorage.updateProduct(sku, { status: "Đang bán", note: "Đang hoạt động" });
        onToast({
          title: "Đã mở bán lại",
          message: "Sản phẩm đang được mở bán trên hệ thống.",
        });
        refreshList();
      } catch (err) {
        console.error("Lỗi đồng bộ kích hoạt lên BE:", err);
        alert("Không thể mở bán lại sản phẩm.\nChi tiết lỗi: " + (err.response?.data?.message || err.response?.data?.error || err.message));
      }
    }
  };

  const handleDeleteProduct = async (sku) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      const product = productStorage.getProductBySku(sku);
      if (product) {
        const isNumericId = product.id && /^\d+$/.test(String(product.id));
        if (product.id && isNumericId) {
          try {
            await sellerApi.deleteProduct(product.id);
          } catch (err) {
            console.error("Lỗi khi xóa sản phẩm trên BE:", err);
            alert("Không thể xóa sản phẩm trên Backend.\nChi tiết lỗi: " + (err.response?.data?.message || err.response?.data?.error || err.message));
            return;
          }
        }
        productStorage.deleteProduct(sku);
        onToast({
          title: "Đã xóa sản phẩm",
          message: "Sản phẩm đã bị loại bỏ khỏi danh sách.",
        });
        refreshList();
      }
    }
  };

  const filtered = productsList.filter(
    (product) =>
      `${product.name} ${product.sku}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!status || product.status === status),
  );
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (VENDOR_FEATURES.warehouse && !hasWarehouseConfigured) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-white border border-stone-200/80 rounded-2xl shadow-sm text-center max-w-2xl mx-auto my-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 mb-6 shadow-sm shadow-orange-500/5 ring-4 ring-orange-50/50">
          <Warehouse className="h-10 w-10 animate-bounce" style={{ animationDuration: '3s' }} />
        </div>
        <h2 className="text-xl font-extrabold text-stone-800 mb-3">
          Yêu cầu thiết lập kho hàng trước khi bán
        </h2>
        <p className="text-sm text-stone-500 font-medium max-w-md mb-6 leading-relaxed">
          Bạn cần thiết lập thông tin cho cả <strong>Kho lấy hàng (PICKUP)</strong> và <strong>Kho trả hàng (RETURN)</strong> tại trang cấu hình kho hàng để kích hoạt các tính năng quản lý sản phẩm.
        </p>
        <button
          type="button"
          className="vendor-primary-button gap-2 py-3 px-6 text-sm font-bold shadow-md shadow-orange-500/10"
          onClick={() => navigate("/vendor/kho-hang")}
        >
          Thiết lập kho hàng ngay
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Quota Banner */}
      <PostingQuotaBanner
        key={planRefreshKey}
        onUpgradeClick={() => onOpenPlanModal?.({
          blocksNavigation: false,
          onAfterSelect: () => setPlanRefreshKey((k) => k + 1),
        })}
      />

      <Panel className="overflow-hidden">
        <div className="p-5">
          <PanelHeader
            title="Danh sách sản phẩm"
            subtitle={`${productsList.length} sản phẩm đang được quản lý`}
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
              {(hasWarehouseConfigured || !VENDOR_FEATURES.warehouse) && (
                <button
                  type="button"
                  className="vendor-primary-button"
                  onClick={handleAddProductClick}
                >
                  <Plus className="h-4 w-4" />
                  Đăng tin sản phẩm
                </button>
              )}
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
                options={["Đang bán", "Tồn thấp", "Tạm ẩn", "Chờ duyệt", "Nháp", "Bị từ chối", "Cảnh báo"]}
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
                <tr key={product.sku} className="vendor-table-row relative">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 overflow-hidden items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0].preview || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImagePlus className="h-5 w-5" />
                        )}
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
                    {product.sold || 0}
                  </td>
                  <td className="px-5 py-4 font-bold text-teal-700">
                    {product.quality || 90}/100
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col items-start gap-1">
                      <StatusBadge status={product.status} />
                      {product.status === 'Bị từ chối' && product.rejectReason && (
                        <span className="text-[10px] font-semibold text-red-500 italic max-w-[150px] truncate" title={product.rejectReason}>
                          Lý do: {product.rejectReason}
                        </span>
                      )}
                      {product.status === 'Cảnh báo' && product.rejectReason && (
                        <span className="text-[10px] font-semibold text-red-500 italic max-w-[150px] truncate" title={product.rejectReason}>
                          Lý do: {product.rejectReason}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative">
                      <button
                        type="button"
                        aria-label={`Thao tác ${product.name}`}
                        className="vendor-icon-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownSku(activeDropdownSku === product.sku ? null : product.sku);
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {activeDropdownSku === product.sku && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-xl z-[60] py-1.5 overflow-hidden">
                          {product.status === 'Nháp' && (
                            <>
                              <button
                                onClick={() => navigate(`/vendor/products/edit/${product.sku}`)}
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                              >
                                Chỉnh sửa
                              </button>
                              <button
                                onClick={() => handlePublishProduct(product.sku)}
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-orange-600 hover:bg-stone-50 transition-colors"
                              >
                                Gửi xét duyệt
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.sku)}
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-stone-50 transition-colors"
                              >
                                Xóa sản phẩm
                              </button>
                            </>
                          )}

                          {product.status === 'Chờ duyệt' && (
                            <>
                              <button
                                onClick={() => handleRecallProduct(product.sku)}
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                              >
                                Thu hồi bản nháp
                              </button>
                            </>
                          )}

                          {(product.status === 'Đang bán' || product.status === 'Tồn thấp') && (
                            <>
                              <button
                                onClick={() => navigate(`/vendor/products/edit/${product.sku}`)}
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                              >
                                Chỉnh sửa
                              </button>
                              <button
                                onClick={() => handleDeactivateProduct(product.sku)}
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-500 hover:bg-stone-50 transition-colors"
                              >
                                Tạm ẩn sản phẩm
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.sku)}
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-stone-50 transition-colors"
                              >
                                Xóa sản phẩm
                              </button>
                            </>
                          )}

                          {product.status === 'Bị từ chối' && (
                            <>
                              <button
                                onClick={() => {
                                  setRejectReasonModalProduct(product);
                                  setActiveDropdownSku(null);
                                }}
                                className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-stone-50 transition-colors"
                              >
                                Xem lý do từ chối
                              </button>
                              <button
                                onClick={() => navigate(`/vendor/products/edit/${product.sku}`)}
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                              >
                                Sửa & gửi lại
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.sku)}
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-stone-50 transition-colors"
                              >
                                Xóa sản phẩm
                              </button>
                            </>
                          )}

                          {product.status === 'Tạm ẩn' && (
                            <>
                              <button
                                onClick={() => handleActivateProduct(product.sku)}
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-green-600 hover:bg-stone-50 transition-colors"
                              >
                                Mở bán lại
                              </button>
                              <button
                                onClick={() => navigate(`/vendor/products/edit/${product.sku}`)}
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                              >
                                Chỉnh sửa
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.sku)}
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-stone-50 transition-colors"
                              >
                                Xóa sản phẩm
                              </button>
                            </>
                          )}

                          {product.status === 'Cảnh báo' && (
                            <>
                              <button
                                onClick={() => {
                                  setRejectReasonModalProduct(product);
                                  setActiveDropdownSku(null);
                                }}
                                className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-stone-50 transition-colors"
                              >
                                Xem lý do vi phạm
                              </button>
                              <button
                                onClick={() => navigate(`/vendor/products/edit/${product.sku}`)}
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                              >
                                Sửa & gửi lại
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.sku)}
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-stone-50 transition-colors"
                              >
                                Xóa sản phẩm
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
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

      {/* Reject/Warning details Modal */}
      {rejectReasonModalProduct && (
        <div className="fixed inset-0 bg-stone-950/45 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-150 p-6 shadow-2xl animate-in fade-in zoom-in duration-200 text-stone-800">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-base font-extrabold text-stone-950 flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-sm bg-red-600 flex-shrink-0" />
                {rejectReasonModalProduct.status === 'Cảnh báo' ? 'Lý do vi phạm cảnh báo' : 'Lý do từ chối kiểm duyệt'}
              </h3>
              <button
                onClick={() => setRejectReasonModalProduct(null)}
                className="text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="bg-red-50/60 border border-red-100 rounded-xl p-4 mb-5">
              <p className="text-xs font-bold text-red-800 mb-1">Chi tiết từ quản trị viên:</p>
              <p className="text-sm font-semibold text-red-950 leading-relaxed">
                {rejectReasonModalProduct.rejectReason || "Sản phẩm không đáp ứng đủ tiêu chuẩn nội dung hoặc hình ảnh mờ/vi phạm bản quyền."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="vendor-primary-button flex-1 justify-center"
                onClick={() => {
                  const skuToEdit = rejectReasonModalProduct.sku;
                  setRejectReasonModalProduct(null);
                  navigate(`/vendor/products/edit/${skuToEdit}`);
                }}
              >
                Sửa và Gửi lại
              </button>
              <button
                type="button"
                className="vendor-secondary-button flex-1 justify-center animate-pulse"
                onClick={() => setRejectReasonModalProduct(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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

const warehouseSetupSteps = [
  ["1", "Nhập thông tin", "Tên kho, người phụ trách và loại kho"],
  ["2", "Chọn địa chỉ", "Tỉnh thành, địa chỉ chi tiết và vị trí ghim"],
  ["3", "Kiểm tra", "Hệ thống xác thực dữ liệu vận hành"],
  ["4", "Kích hoạt", "Kho sẵn sàng nhận đơn và xử lý trả hàng"],
];

const warehouseSetupNotes = [
  ["Dùng cho vận chuyển", "Đơn mới sẽ lấy địa chỉ này để điều phối bàn giao."],
  ["Dùng cho trả hàng", "Khách và đối tác vận chuyển có điểm trả hàng rõ ràng."],
  ["Có thể chỉnh sửa sau", "Bạn vẫn cập nhật được liên hệ, địa chỉ và trạng thái kho."],
];

function WarehousePage({ action, navigate, onToast }) {
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

  const isCreateRoute = action === "tao-kho";
  const [currentStep, setCurrentStep] = useState(isCreateRoute ? 2 : 1);
  const [selectedOutcome, setSelectedOutcome] = useState("LINKED"); // 'LINKED', 'UNLINKED', 'FAILURE'
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLogs, setProcessingLogs] = useState([]);
  const [bpmnError, setBpmnError] = useState("");
  const [showUnlinkedPopup, setShowUnlinkedPopup] = useState(false);
  const [showNormalAddModal, setShowNormalAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: "PICKUP",
    name: "",
    contact: "",
    phone: "",
    country: "Việt Nam",
    province: "",
    district: "",
    ward: "",
    addressDetail: "",
    shippingRegions: [],
    isDefault: true,
  });

  // Geo selection options
  const selectedProvinceData = VIETNAM_PROVINCES.find(
    (p) => p.name === formData.province,
  );
  const selectedDistrictData = selectedProvinceData?.districts.find(
    (d) => d.name === formData.district,
  );

  useEffect(() => {
    if (!isOnboarding) return;
    setCurrentStep(isCreateRoute ? 2 : 1);
    setBpmnError("");
  }, [isCreateRoute, isOnboarding]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
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

  const handleRegionToggle = (region) => {
    setFormData((prev) => {
      const current = prev.shippingRegions || [];
      if (current.includes(region)) {
        return {
          ...prev,
          shippingRegions: current.filter((r) => r !== region),
        };
      } else {
        return { ...prev, shippingRegions: [...current, region] };
      }
    });
  };

  const handleStartOnboarding = () => {
    navigate("/vendor/kho-hang/tao-kho");
    setCurrentStep(2);
    setBpmnError("");
  };

  const handleCancelOnboarding = () => {
    navigate("/vendor/kho-hang");
    setCurrentStep(1);
    setBpmnError("");
  };

  // Service check simulation
  const handleVerifyAndLink = (e) => {
    e.preventDefault();

    // Validation
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

    if (formData.name.trim().length < 1 || formData.name.trim().length > 50) {
      setBpmnError("Tên kho hàng chỉ giới hạn từ 1 đến 50 ký tự!");
      return;
    }

    // Check duplicate name with old warehouses
    const nameExists = warehouses.some(
      (w) => w.name.toLowerCase() === formData.name.trim().toLowerCase(),
    );
    if (nameExists) {
      setBpmnError(
        "Tên kho hàng đã tồn tại trong danh sách kho của bạn. Vui lòng nhập tên khác!",
      );
      return;
    }

    const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setBpmnError(
        "Số điện thoại không hợp lệ (phải gồm 10 chữ số bắt đầu bằng 0)!",
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

    Promise.resolve()
      .then(() => addLog("Kiểm tra tính hợp lệ của địa chỉ kho...", 600))
      .then(() =>
        addLog("Khởi tạo kho hàng trên hệ thống...", 1000),
      )
      .then(() => addLog("Hoàn tất liên kết kho mặc định...", 800))
      .then(() => {
        setTimeout(() => {
          setIsProcessing(false);

          if (selectedOutcome === "FAILURE") {
            // Step 6.1: Registration failure, back to editing with error message
            setBpmnError(
              "Đăng ký dịch vụ thất bại hoặc thông tin bị từ chối. Vui lòng kiểm tra lại thông tin và thử lại.",
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
              name: formData.name.trim(),
              contact: formData.contact.trim(),
              phone: formData.phone.trim(),
              address: `${formData.addressDetail.trim()}, ${formData.ward}, ${formData.district}, ${formData.province}, Việt Nam`,
              isDefault: formData.isDefault,
              status: "Đang hoạt động",
              shippingRegions: formData.shippingRegions || [],
              isPinned: false,
              lat: null,
              lng: null,
              locationMode: "manual",
            };

            const updatedList = [...warehouses, newWarehouse];
            setWarehouses(updatedList);
            localStorage.setItem(
              "sellerWarehouses",
              JSON.stringify(updatedList),
            );

            onToast({
              title: "Kích hoạt thành công",
              message: `Đã khởi tạo kho ${formData.type === "PICKUP" ? "lấy" : "trả"} hàng mặc định!`,
            });

            setIsOnboarding(false);
            setCurrentStep(1);
            navigate("/vendor/kho-hang");
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
        "Liên kết tài khoản HDBank thành công. Bạn có thể tiếp tục kích hoạt kho.",
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

  const handleSaveNormalWarehouse = (newW) => {
    const normalized = {
      id: newW.id || Date.now(),
      type: newW.warehouse_type || newW.type || activeTab,
      name: newW.warehouse_name || newW.name || "",
      contact: newW.contact_name || newW.contact || "",
      phone: newW.phone_number || newW.phone || "",
      address: newW.address || "",
      isDefault: !!(newW.is_default !== undefined
        ? newW.is_default
        : newW.isDefault),
      status: "Đang hoạt động",
      shippingRegions: newW.shipping_regions || newW.shippingRegions || [],
      isPinned: !!(newW.is_pinned !== undefined
        ? newW.is_pinned
        : newW.isPinned),
      lat: newW.lat,
      lng: newW.lng,
    };

    let updatedList;
    if (normalized.isDefault) {
      // Set all other warehouses of the same type to non-default
      const mapped = warehouses.map((w) =>
        w.type === normalized.type ? { ...w, isDefault: false } : w,
      );
      updatedList = [...mapped, normalized];
    } else {
      updatedList = [...warehouses, normalized];
    }

    setWarehouses(updatedList);
    localStorage.setItem("sellerWarehouses", JSON.stringify(updatedList));
    setShowNormalAddModal(false);
    onToast({
      title: "Thêm kho thành công",
      message: `Đã thêm mới kho ${normalized.type === "PICKUP" ? "lấy" : "trả"} hàng.`,
    });
  };

  const currentWarehouses = warehouses.filter((w) => w.type === activeTab);

  if (isOnboarding) {
    return (
      <div className="space-y-6">
        {/* Onboarding welcome screen */}
        {currentStep === 1 && (
          <Panel className="overflow-hidden max-w-5xl mx-auto">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.25fr]">
              <div className="bg-[#12372d] p-6 text-white sm:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-extrabold text-emerald-50">
                  <ShieldCheck className="h-3.5 w-3.5 text-orange-300" />
                  Thiết lập bắt buộc
                </div>
                <h2 className="mt-5 max-w-sm text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                  Tạo kho mặc định để bắt đầu xử lý đơn hàng
                </h2>
                <p className="mt-3 max-w-sm text-sm font-semibold leading-6 text-emerald-50/72">
                  Shop cần ít nhất một địa chỉ lấy hàng hoặc trả hàng. Sau khi
                  kích hoạt, hệ thống sẽ dùng kho này để điều phối vận chuyển.
                </p>

                <div className="mt-7 space-y-3">
                  {warehouseSetupNotes.map(([title, text]) => (
                    <div key={title} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-400/18 text-orange-200">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                      <span>
                        <span className="block text-sm font-extrabold">
                          {title}
                        </span>
                        <span className="mt-0.5 block text-xs font-semibold leading-5 text-emerald-50/58">
                          {text}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-teal-700">
                      Kho mặc định
                    </p>
                    <h3 className="mt-2 text-xl font-extrabold text-stone-950">
                      Chưa có kho đang hoạt động
                    </h3>
                    <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-stone-500">
                      Hoàn tất 4 bước dưới đây để tạo kho đầu tiên. Toàn bộ
                      thông tin có thể cập nhật lại trong trang quản lý kho.
                    </p>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                    <Warehouse className="h-6 w-6" />
                  </span>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {warehouseSetupSteps.map(([step, title, text], index) => {
                    const isActive = index === 0;
                    return (
                      <div
                        key={step}
                        className={cn(
                          "rounded-xl border p-4 transition-colors",
                          isActive
                            ? "border-orange-200 bg-orange-50/60"
                            : "border-stone-200 bg-white",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold",
                              isActive
                                ? "bg-orange-500 text-white shadow-sm shadow-orange-500/20"
                                : "bg-stone-100 text-stone-500",
                            )}
                          >
                            {step}
                          </span>
                          <span>
                            <span
                              className={cn(
                                "block text-sm font-extrabold",
                                isActive ? "text-orange-700" : "text-stone-800",
                              )}
                            >
                              {title}
                            </span>
                            <span className="mt-1 block text-xs font-semibold leading-5 text-stone-500">
                              {text}
                            </span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-7 rounded-xl border border-stone-200 bg-stone-50 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-extrabold text-stone-900">
                        Sẵn sàng tạo kho đầu tiên?
                      </p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-stone-500">
                        Mất khoảng 2 phút nếu bạn đã có địa chỉ và số điện thoại
                        người phụ trách.
                      </p>
                    </div>
                    <button
                      onClick={handleStartOnboarding}
                      className="vendor-primary-button shrink-0 justify-center whitespace-nowrap px-5 py-2.5 text-sm font-extrabold"
                    >
                      <Plus className="h-4 w-4" /> Tạo kho mặc định
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        )}

        {/* Setup Form (currentStep = 2) */}
        {currentStep === 2 && (
          <Panel className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-100 mb-6">
              <div>
                <h2 className="text-lg font-extrabold text-stone-900">
                  Thông tin kho mặc định
                </h2>
                <p className="text-xs text-stone-400 font-semibold mt-1">
                  Điền địa chỉ, người phụ trách và ghim vị trí để kích hoạt kho
                  đầu tiên cho shop.
                </p>
              </div>
              <button
                onClick={handleCancelOnboarding}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                Hủy
              </button>
            </div>

            {bpmnError && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <span className="text-red-600 text-sm font-bold shrink-0 mt-0.5">
                  <AlertTriangle className="h-4 w-4" />
                </span>
                <p className="text-xs font-bold text-red-700">{bpmnError}</p>
              </div>
            )}

            <form onSubmit={handleVerifyAndLink} className="space-y-6">
              {/* Warehouse info section */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Boxes className="h-4 w-4 text-orange-600" />
                  1. Thông tin cơ bản
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold text-stone-500">
                      Quốc gia / Khu vực
                    </span>
                    <input
                      type="text"
                      value={formData.country || "Việt Nam"}
                      readOnly
                      className="vendor-input mt-1.5 h-10 w-full px-3 text-sm bg-stone-50 text-stone-400 cursor-not-allowed border-stone-200"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-bold text-stone-500">
                      Loại kho *
                    </span>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="vendor-input mt-1.5 h-10 w-full px-3 text-sm appearance-none bg-white font-semibold"
                    >
                      <option value="PICKUP">Kho lấy hàng</option>
                      <option value="RETURN">Kho trả hàng</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
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
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
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
                      {VIETNAM_PROVINCES.map((p) => (
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

              {/* Shipping Region (Khu vực vận chuyển) - Only shown from 2nd warehouse */}
              {warehouses.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-orange-600" />
                    3. Khu vực vận chuyển *
                  </h3>
                  <p className="text-xs text-stone-400 font-semibold">
                    Cho phép thiết lập kho này sẽ phục vụ giao hàng cho những
                    vùng tỉnh/thành cụ thể nào.
                  </p>
                  <div className="flex flex-wrap gap-2.5 mt-2">
                    {["Miền Bắc", "Miền Trung", "Miền Nam"].map((region) => {
                      const isSelected =
                        formData.shippingRegions?.includes(region);
                      return (
                        <button
                          key={region}
                          type="button"
                          onClick={() => handleRegionToggle(region)}
                          className={cn(
                            "px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200 flex items-center gap-1.5",
                            isSelected
                              ? "bg-orange-50 border-orange-500 text-orange-700 shadow-sm font-bold scale-102"
                              : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50",
                          )}
                        >
                          {isSelected && (
                            <span className="text-orange-500">✓</span>
                          )}
                          {region}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Set Default (Cài đặt mặc định) Checkbox */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <BadgeCheck className="h-4 w-4 text-orange-600" />
                  {warehouses.length === 0
                    ? "3. Cài đặt mặc định"
                    : "4. Cài đặt mặc định"}
                </h3>
                <label
                  className={cn(
                    "flex items-center space-x-3.5 p-3.5 border border-stone-200 rounded-xl transition-all",
                    warehouses.length === 0
                      ? "bg-stone-50 opacity-80 cursor-not-allowed"
                      : "cursor-pointer hover:bg-stone-50",
                  )}
                >
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    disabled={warehouses.length === 0}
                    className="w-5 h-5 text-orange-600 border-stone-300 rounded focus:ring-orange-500"
                  />
                  <div>
                    <p className="font-extrabold text-stone-800 text-xs">
                      Đặt làm kho mặc định
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5 leading-4 font-semibold">
                      Hệ thống sẽ ưu tiên kho này khi điều phối đơn hàng mới.
                    </p>
                  </div>
                </label>
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
                  Kích hoạt kho
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
              Đang kiểm tra thông tin kho
            </h2>
            <p className="text-xs font-semibold text-stone-400 mt-1">
              Hệ thống đang xác thực địa chỉ, vị trí ghim và trạng thái liên kết.
            </p>

            {/* Live logging */}
            <div className="mt-6 w-full bg-stone-900 rounded-xl p-4 text-left font-mono text-xs text-stone-300 min-h-36 flex flex-col gap-2.5 shadow-lg border border-stone-850">
              {processingLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-teal-400">•</span>
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

        {/* Unlinked account modal */}
        {showUnlinkedPopup && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/60 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-stone-100 overflow-hidden animate-scaleUp">
              <div className="p-5 text-center flex flex-col items-center">
                <span className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-xl font-bold mb-4">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <h3 className="text-base font-extrabold text-stone-900">
                  Cần liên kết tài khoản thanh toán
                </h3>
                <p className="mt-2 text-xs font-semibold leading-relaxed text-stone-500">
                  Hệ thống chưa ghi nhận liên kết HDBank cho shop. Vui lòng liên
                  kết để hoàn tất kích hoạt kho và xử lý các khoản chi hộ.
                </p>
                <div className="mt-6 w-full flex flex-col gap-2.5">
                  <button
                    onClick={handleLinkHDBankNow}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-extrabold py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/10"
                  >
                    Liên kết HDBank ngay
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
      {/* Demo reset banner */}
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-extrabold text-stone-600 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-teal-700" />
            Trạng thái: Đã cấu hình kho mặc định
          </span>
          <p className="text-[11px] text-stone-400 font-semibold mt-0.5">
            Shop đã có địa chỉ kho để xử lý lấy hàng và trả hàng.
          </p>
        </div>
        <button
          onClick={handleResetDemo}
          className="text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 bg-white text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
        >
          Reset dữ liệu
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
      <AddWarehouseModal
        isOpen={showNormalAddModal}
        onClose={() => setShowNormalAddModal(false)}
        onSave={handleSaveNormalWarehouse}
        currentTab={activeTab}
        existingWarehouses={warehouses.map((w) => ({
          id: w.id,
          warehouse_type: w.type,
          warehouse_name: w.name,
          contact_name: w.contact,
          phone_number: w.phone,
          address: w.address,
          is_default: w.isDefault,
          status: w.status === "Đang hoạt động" ? "ACTIVE" : "INACTIVE",
        }))}
      />
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

function MarketResearchPage({ onToast, onOpenPlanModal }) {
  const plan = getVendorPlan();
  const vendorInfo = getVendorInfo();
  const localVendorParentCategory = getVendorParentCategory(vendorInfo);
  const defaultCategoryId = getVendorMarketDefaultCategoryId(
    localVendorParentCategory,
  );
  const [selectedCategoryId, setSelectedCategoryId] =
    useState(defaultCategoryId);
  const [source, setSource] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [marketData, setMarketData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const categoryTree = useMemo(
    () =>
      marketData?.categories?.length
        ? marketData.categories
        : [localVendorParentCategory],
    [marketData?.categories, localVendorParentCategory],
  );
  const selectedMarket = marketData?.selectedCategory || {
    id: selectedCategoryId,
    name: localVendorParentCategory.name,
    parentCategoryName: localVendorParentCategory.name,
    keyword: submittedQuery || localVendorParentCategory.name,
    marketAverage: 0,
    recommendedPrice: 0,
    sampleCount: 0,
    demand: 0,
    trend: "Đang tải",
    status: "Đang tải dữ liệu",
    strategy: "Hệ thống đang lấy dữ liệu public từ các shop bên ngoài.",
    categoryPath: [localVendorParentCategory.name],
  };
  const sources = marketData?.sources || [];
  const availableSources = sources.filter((item) => item.status === "OK");
  const sourceOptions = Array.from(new Set(sources.map((item) => item.source)));
  const selectedBreadcrumb =
    selectedMarket.categoryPath?.join(" > ") || selectedMarket.name;
  const parentCategoryName =
    selectedMarket.parentCategoryName || localVendorParentCategory.name;
  const lowestSource =
    availableSources.reduce(
      (best, item) =>
        !best || Number(item.min) < Number(best.min) ? item : best,
      null,
    ) || null;
  const quickCategories = useMemo(() => {
    const parent = categoryTree[0] || localVendorParentCategory;
    return getCategoryLeaves(parent)
      .slice(0, 6)
      .map(({ id, name }) => ({ id, name }));
  }, [categoryTree, localVendorParentCategory]);

  useEffect(() => {
    let ignore = false;

    async function loadMarketResearch() {
      setIsLoading(true);
      setError("");
      try {
        const data = await marketResearchApi.getVendorMarketResearch({
          categoryId: selectedCategoryId,
          source,
          query: submittedQuery,
        });
        if (ignore) return;
        setMarketData(data);
        if (data?.selectedCategory?.id) {
          setSelectedCategoryId(data.selectedCategory.id);
        }
      } catch (err) {
        if (ignore) return;
        const message = getApiMessage(err);
        setError(message);
        onToast({
          title: "Không thể lấy dữ liệu thị trường",
          message,
        });
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMarketResearch();
    return () => {
      ignore = true;
    };
  }, [selectedCategoryId, source, submittedQuery, refreshKey, onToast]);

  if (plan.planId === 'free') {
    return (
      <div className="relative min-h-[500px] flex items-center justify-center p-8 bg-slate-50/50 rounded-3xl border border-slate-200 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="relative max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500 shadow-md shadow-orange-100 ring-4 ring-orange-50/50 animate-pulse">
            <Lock className="h-8 w-8" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Tính Năng Bị Khóa</h3>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed px-2">
              Tính năng <strong>Nghiên cứu thị trường</strong> chỉ dành cho các đối tác đăng ký gói <strong>Plus</strong> hoặc <strong>Premium</strong>. Nâng cấp ngay để mở khóa các phân tích thông tin chi tiết, so khớp giá cả thị trường và gợi ý chiến lược bán hàng tối ưu!
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => onOpenPlanModal?.()}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all duration-200"
          >
            <Sparkles className="h-4 w-4 text-white" />
            Nâng cấp gói dịch vụ ngay
          </button>
        </div>
      </div>
    );
  }

  const resetFilters = () => {
    setSource("");
    setSearchInput("");
    setSubmittedQuery("");
  };

  const handleSearch = (event) => {
    event?.preventDefault();
    setSubmittedQuery(searchInput.trim());
  };

  const syncMarketData = () => {
    setRefreshKey((value) => value + 1);
    onToast({
      title: "Đang cập nhật dữ liệu thật",
      message: "Backend đang lấy dữ liệu public từ 4 shop bên ngoài.",
    });
  };

  const exportMarketRows = () => {
    const rows = sources.flatMap((item) => {
      const products = item.products?.length ? item.products : [null];
      return products.map((product) => [
        parentCategoryName,
        selectedMarket.name,
        selectedMarket.keyword,
        item.source,
        item.status === "OK" ? "Đã lấy dữ liệu" : "Chưa có",
        product?.name || item.message,
        product?.price || item.min || 0,
        product?.originalPrice || "",
        product?.url || item.url || "",
      ]);
    });

    downloadCsv(
      `vendor-market-${selectedMarket.id || "real-data"}.csv`,
      [
        "Ngành đăng ký",
        "Hạng mục",
        "Từ khóa",
        "Nguồn bán",
        "Trạng thái",
        "Sản phẩm",
        "Giá",
        "Giá gốc",
        "URL",
      ],
      rows,
    );
    onToast({
      title: "Đã xuất nghiên cứu thị trường",
      message: `${rows.length} dòng dữ liệu đã được tải xuống.`,
    });
  };

  return (
    <div className="space-y-5">
      <Panel className="p-5">
        <PanelHeader
          title="Thị trường theo ngành đăng ký"
          subtitle="Dữ liệu được lấy trực tiếp từ CellPhoneS, FPT Shop, Điện Máy Xanh và Di Động Việt"
        >
          <button
            type="button"
            className="vendor-secondary-button"
            onClick={exportMarketRows}
            disabled={isLoading || sources.length === 0}
          >
            <Download className="h-4 w-4" />
            Xuất báo cáo
          </button>
          <button
            type="button"
            className="vendor-primary-button"
            onClick={syncMarketData}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Cập nhật
          </button>
        </PanelHeader>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_0.7fr]">
          <div className="space-y-4">
            <CategorySelectorField
              categories={categoryTree}
              value={selectedCategoryId}
              onChange={(categoryId) => {
                setSelectedCategoryId(categoryId || defaultCategoryId);
                setSource("");
              }}
            />
            <div className="flex flex-wrap gap-2">
              {quickCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                    setSource("");
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
            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  className="vendor-input h-10 w-full pl-9 pr-3 text-sm"
                  placeholder="Nhập tên sản phẩm cần tìm, ví dụ iPhone 15"
                />
              </div>
              <button type="submit" className="vendor-primary-button justify-center">
                <Search className="h-4 w-4" />
                Tìm kiếm
              </button>
            </form>
          </div>

          <div className="grid gap-2 text-xs font-semibold text-stone-500 sm:grid-cols-2 xl:grid-cols-1">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-stone-50 px-3 py-2">
              <Store className="h-4 w-4 text-orange-500" />
              <span className="min-w-0 truncate">
                Ngành đăng ký:{" "}
                <strong className="text-stone-800">{parentCategoryName}</strong>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-stone-50 px-3 py-2">
              <ChevronRight className="h-4 w-4 text-orange-500" />
              <span className="min-w-0 truncate">
                Đường dẫn:{" "}
                <strong className="text-stone-800">{selectedBreadcrumb}</strong>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-stone-50 px-3 py-2">
              <Search className="h-4 w-4 text-teal-700" />
              <span className="min-w-0 truncate">
                Từ khóa:{" "}
                <strong className="text-stone-800">
                  {selectedMarket.keyword || "Chưa nhập"}
                </strong>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-stone-50 px-3 py-2">
              <RefreshCw className="h-4 w-4 text-stone-400" />
              Cập nhật:{" "}
              {marketData?.updatedAt
                ? new Intl.DateTimeFormat("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                  }).format(new Date(marketData.updatedAt))
                : "Đang tải"}
            </span>
            {error && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-red-700">
                {error}
              </span>
            )}
          </div>
        </div>
      </Panel>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          stat={{
            label: "Giá thị trường",
            value: formatShortCurrency(Number(selectedMarket.marketAverage || 0)),
            change: selectedMarket.trend,
            note: "tính từ dữ liệu thật",
            icon: BarChart3,
            tone: "is-orange",
          }}
        />
        <StatCard
          stat={{
            label: "Giá đề xuất",
            value: formatShortCurrency(Number(selectedMarket.recommendedPrice || 0)),
            change: "Thấp hơn TB 2%",
            note: "gợi ý tham khảo",
            icon: TicketPercent,
            tone: "is-teal",
          }}
        />
        <StatCard
          stat={{
            label: "Mẫu đối chiếu",
            value: String(selectedMarket.sampleCount || 0),
            change: `${availableSources.length}/${sources.length || 4} nguồn`,
            note: marketData?.dataMode === "REAL" ? "dữ liệu thật" : "đang tải",
            icon: Store,
            tone: "is-green",
          }}
        />
        <StatCard
          stat={{
            label: "Mức quan tâm",
            value: `${selectedMarket.demand || 0}/100`,
            change: selectedMarket.status,
            note: "từ số mẫu lấy được",
            icon: TrendingUp,
            tone: "is-yellow",
          }}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
        <Panel className="p-5">
          <PanelHeader
            title="Khoảng giá theo nguồn bán"
            subtitle="So sánh giá thấp nhất, trung bình và cao nhất từ dữ liệu thật"
          />
          {availableSources.length > 0 ? (
            <VendorMarketPriceChart
              sources={availableSources}
              recommendedPrice={Number(selectedMarket.recommendedPrice || 0)}
              shopPrice={Number(selectedMarket.marketAverage || 0)}
            />
          ) : (
            <EmptyState />
          )}
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
              value={formatCurrency(Number(selectedMarket.recommendedPrice || 0))}
            />
            <MarketInsightRow
              icon={Store}
              label="Nguồn giá thấp nhất"
              value={
                lowestSource
                  ? `${lowestSource.source} - ${formatShortCurrency(Number(lowestSource.min || 0))}`
                  : "Chưa có"
              }
            />
            <MarketInsightRow
              icon={SlidersHorizontal}
              label="Nguồn đã lấy được"
              value={`${availableSources.length}/${sources.length || 4} shop`}
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
            subtitle={`Chỉ hiển thị nguồn tham khảo liên quan đến ${parentCategoryName}`}
          >
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
              <SelectFilter
                value={source}
                onChange={setSource}
                placeholder="Tất cả nguồn"
                options={sourceOptions}
              />
              <button
                type="button"
                className="vendor-secondary-button justify-center"
                onClick={resetFilters}
              >
                <RefreshCw className="h-4 w-4" />
                Đặt lại
              </button>
            </div>
          </PanelHeader>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px] text-left text-sm">
            <thead className="vendor-table-head">
              <tr>
                {[
                  "Nguồn bán",
                  "Trạng thái",
                  "Giá thấp nhất",
                  "Giá TB",
                  "Giá cao nhất",
                  "Sản phẩm",
                  "Đánh giá",
                  "Độ tin cậy",
                ].map((column) => (
                  <th key={column} className="px-5 py-3.5">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sources.map((item) => {
                const hasData = item.status === "OK";
                return (
                  <tr key={item.source} className="vendor-table-row">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 font-extrabold text-orange-600">
                          {item.source.slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <p className="font-extrabold text-stone-900">
                            {item.source}
                          </p>
                          <a
                            className="mt-1 block max-w-56 truncate text-xs font-semibold text-teal-700 hover:underline"
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {selectedMarket.keyword}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge
                        status={hasData ? "Đã có dữ liệu" : "Chưa có"}
                      />
                      {!hasData && (
                        <p className="mt-1 max-w-52 text-xs font-semibold text-stone-400">
                          {item.message || "Sẽ cập nhật sau"}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 font-extrabold text-teal-700">
                      {hasData ? formatCurrency(Number(item.min || 0)) : "Chưa có"}
                    </td>
                    <td className="px-5 py-4 font-bold text-stone-800">
                      {hasData ? formatCurrency(Number(item.avg || 0)) : "Chưa có"}
                    </td>
                    <td className="px-5 py-4 font-semibold text-stone-500">
                      {hasData ? formatCurrency(Number(item.max || 0)) : "Chưa có"}
                    </td>
                    <td className="px-5 py-4 font-semibold text-stone-600">
                      {item.productCount || 0}
                    </td>
                    <td className="px-5 py-4 font-semibold text-stone-600">
                      {Number(item.rating || 0) > 0 ? `${item.rating}/5` : "Chưa có"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex min-w-32 items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100">
                          <div
                            className="h-full rounded-full bg-teal-600"
                            style={{ width: `${item.trust || 0}%` }}
                          />
                        </div>
                        <span className="w-9 text-right text-xs font-extrabold text-stone-700">
                          {item.trust || 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {sources.length === 0 && !isLoading && <EmptyState />}
        {isLoading && (
          <div className="border-t border-stone-100 px-5 py-4 text-sm font-bold text-stone-500">
            Đang lấy dữ liệu thật từ các shop bên ngoài...
          </div>
        )}
      </Panel>

      <Panel className="p-5">
        <PanelHeader
          title="Sản phẩm lấy được"
          subtitle="Danh sách sản phẩm thật theo từng nguồn bán"
        />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {sources.map((item) => (
            <div
              key={item.source}
              className="rounded-xl border border-stone-100 bg-stone-50/60 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold text-stone-900">
                    {item.source}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-stone-500">
                    {item.message}
                  </p>
                </div>
                <StatusBadge
                  status={item.status === "OK" ? "Đã có dữ liệu" : "Chưa có"}
                />
              </div>
              <div className="mt-3 space-y-2">
                {item.products?.length ? (
                  item.products.map((product) => (
                    <a
                      key={`${item.source}-${product.name}-${product.price}`}
                      href={product.url || item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-lg border border-stone-100 bg-white p-3 transition hover:border-orange-200 hover:bg-orange-50/40"
                    >
                      <div className="flex gap-3">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-14 w-14 shrink-0 rounded-lg object-cover"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-extrabold text-stone-800">
                            {product.name}
                          </p>
                          <p className="mt-1 text-sm font-extrabold text-teal-700">
                            {formatCurrency(Number(product.price || 0))}
                          </p>
                          {product.promo && (
                            <p className="mt-1 line-clamp-1 text-xs font-semibold text-stone-400">
                              {product.promo}
                            </p>
                          )}
                        </div>
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="rounded-lg border border-dashed border-stone-200 bg-white px-3 py-6 text-center text-sm font-bold text-stone-400">
                    Chưa có dữ liệu, sẽ cập nhật sau.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function VendorMarketPriceChart({ sources, recommendedPrice, shopPrice }) {
  const maxPrice = Math.max(
    ...sources.map((item) => item.max),
    recommendedPrice,
    shopPrice,
  );
  const minPrice = Math.min(
    ...sources.map((item) => item.min),
    recommendedPrice,
    shopPrice,
  );
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
            <div
              key={item.source}
              className="grid gap-2 sm:grid-cols-[124px_1fr_98px] sm:items-center"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-stone-700">
                  {item.source}
                </p>
                <p className="text-[11px] font-semibold text-stone-400">
                  {item.sales} lượt bán
                </p>
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
        <p className="mt-1 truncate text-sm font-extrabold text-stone-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function MarketingPage({ onToast, navigateTo }) {
  const storedProducts = productStorage.getStoredProducts();
  const eligibleProducts = useMemo(() => {
    const mapped = storedProducts
      .filter((product) => ["Đang bán", "Tồn thấp"].includes(product.status))
      .map((product, index) => ({
        id: product.id || product.sku,
        sku: product.sku,
        name: product.name,
        category: product.category || "Chưa phân loại",
        price: Number(product.price || 0),
        status: product.status,
        quality: Number(product.quality || 72),
        sold: Number(product.sold || 0),
        reputationScore: Number(product.quality || 72) >= 85 ? 85 : Number(product.quality || 72) >= 70 ? 60 : 30,
      }));
    return mapped.length ? mapped : mockPromotionProducts;
  }, [storedProducts]);

  const [wallet, setWallet] = useState(mockPromotionWallet);
  const [transactions, setTransactions] = useState(mockWalletTransactions);
  const [promotions, setPromotions] = useState(mockPromotions);
  const [selectedPostId, setSelectedPostId] = useState(eligibleProducts[0]?.id || "");
  const [budget, setBudget] = useState(PROMOTION_CONFIG.budgetPresets[1]);
  const [startDate, setStartDate] = useState(toInputDate(new Date()));
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return toInputDate(date);
  });

  const selectedPost = eligibleProducts.find((product) => String(product.id) === String(selectedPostId)) || eligibleProducts[0];
  const estimatedCpc = calculatePromotionCpc(selectedPost?.reputationScore);
  const estimatedMaxClicks = budget > 0 ? Math.floor(budget / estimatedCpc) : 0;
  const deficit = Math.max(0, budget - wallet.availableBalance);
  const isBalanceSufficient = deficit === 0;
  const hasRunningPromotion = selectedPost
    ? promotions.some((promotion) =>
        String(promotion.postId) === String(selectedPost.id) &&
        ["ACTIVE", "SCHEDULED"].includes(promotion.status),
      )
    : false;
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T23:59:59`);
  const durationDays = Math.max(0, Math.ceil((end - start) / 86400000));
  const isDurationValid =
    startDate &&
    endDate &&
    end >= start &&
    durationDays >= PROMOTION_CONFIG.minDurationDays &&
    durationDays <= PROMOTION_CONFIG.maxDurationDays;
  const isBudgetValid =
    budget >= PROMOTION_CONFIG.minBudget && budget <= PROMOTION_CONFIG.maxBudget;
  const canSubmit =
    selectedPost &&
    isBudgetValid &&
    isDurationValid &&
    isBalanceSufficient &&
    !hasRunningPromotion;

  const summary = useMemo(() => {
    return promotions.reduce(
      (acc, promotion) => {
        acc.active += promotion.status === "ACTIVE" ? 1 : 0;
        acc.spent += promotion.spentAmount;
        acc.remaining += promotion.remainingBudget;
        acc.clicks += promotion.clicks;
        acc.impressions += promotion.impressions;
        return acc;
      },
      { active: 0, spent: 0, remaining: 0, clicks: 0, impressions: 0 },
    );
  }, [promotions]);

  const createTransaction = (type, label, amount, nextWallet) => {
    setTransactions((current) => [
      {
        id: `WTX-${Math.floor(2400 + Math.random() * 500)}`,
        type,
        label,
        amount,
        availableAfter: nextWallet.availableBalance,
        lockedAfter: nextWallet.lockedBalance,
        time: new Date().toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...current,
    ]);
  };

  const handleTopUpMock = (amount) => {
    const nextWallet = {
      ...wallet,
      availableBalance: wallet.availableBalance + amount,
      totalDeposited: wallet.totalDeposited + amount,
    };
    setWallet(nextWallet);
    createTransaction("TOP_UP", "Nạp tiền mô phỏng", amount, nextWallet);
    onToast({
      title: "Đã nạp tiền mô phỏng",
      message: `Số dư khả dụng tăng ${formatCurrency(amount)}. Khi có backend, thao tác này sẽ đi qua payment gateway.`,
    });
  };

  const handleCreatePromotion = () => {
    if (!selectedPost) return;
    if (!isBalanceSufficient) {
      onToast({
        title: "Số dư không đủ",
        message: `Cần nạp thêm ${formatCurrency(deficit)} để tạo quảng bá.`,
        type: "error",
      });
      return;
    }
    if (!canSubmit) {
      onToast({
        title: "Chưa thể tạo quảng bá",
        message: hasRunningPromotion
          ? "Bài đăng này đã có chiến dịch đang chạy hoặc sắp chạy."
          : "Vui lòng kiểm tra ngân sách và thời gian quảng bá.",
        type: "error",
      });
      return;
    }

    const now = new Date();
    const status = start <= now ? "ACTIVE" : "SCHEDULED";
    const promotion = {
      id: `PRM-${Math.floor(9100 + Math.random() * 500)}`,
      postId: selectedPost.id,
      postName: selectedPost.name,
      status,
      initialBudget: budget,
      remainingBudget: budget,
      spentAmount: 0,
      impressions: 0,
      clicks: 0,
      cpcSnapshot: estimatedCpc,
      startDate,
      endDate,
    };
    const nextWallet = {
      ...wallet,
      availableBalance: wallet.availableBalance - budget,
      lockedBalance: wallet.lockedBalance + budget,
    };
    setPromotions((current) => [promotion, ...current]);
    setWallet(nextWallet);
    createTransaction(
      "PROMOTION_RESERVE",
      `Giữ ngân sách ${promotion.id}`,
      -budget,
      nextWallet,
    );
    onToast({
      title: "Đã tạo quảng bá",
      message: `${selectedPost.name} được ${status === "ACTIVE" ? "kích hoạt" : "lên lịch"} với ngân sách ${formatCurrency(budget)}.`,
    });
  };

  const handleTrackClick = (promotionId) => {
    const promotion = promotions.find((item) => item.id === promotionId);
    if (!promotion || promotion.status !== "ACTIVE") {
      onToast({
        title: "Không ghi nhận click",
        message: "Chỉ promotion ACTIVE mới bị tính phí click hợp lệ.",
        type: "error",
      });
      return;
    }
    const product = eligibleProducts.find((item) => String(item.id) === String(promotion.postId));
    const cpc = calculatePromotionCpc(product?.reputationScore);
    if (promotion.remainingBudget < cpc) {
      setPromotions((current) =>
        current.map((item) =>
          item.id === promotionId ? { ...item, status: "EXHAUSTED" } : item,
        ),
      );
      onToast({
        title: "Promotion hết ngân sách",
        message: "remaining_budget nhỏ hơn CPC hiện tại nên click không bị charge.",
        type: "error",
      });
      return;
    }
    const nextWallet = {
      ...wallet,
      lockedBalance: Math.max(0, wallet.lockedBalance - cpc),
      totalSpent: wallet.totalSpent + cpc,
    };
    setWallet(nextWallet);
    setPromotions((current) =>
      current.map((item) => {
        if (item.id !== promotionId) return item;
        const remainingBudget = item.remainingBudget - cpc;
        return {
          ...item,
          remainingBudget,
          spentAmount: item.spentAmount + cpc,
          clicks: item.clicks + 1,
          impressions: item.impressions + 24,
          cpcSnapshot: cpc,
          status: remainingBudget < cpc ? "EXHAUSTED" : item.status,
        };
      }),
    );
    createTransaction("PROMOTION_CLICK_CHARGE", `Click hợp lệ ${promotionId}`, -cpc, nextWallet);
  };

  const handleCompletePromotion = (promotionId) => {
    const promotion = promotions.find((item) => item.id === promotionId);
    if (!promotion || !["ACTIVE", "SCHEDULED"].includes(promotion.status)) return;
    const releaseAmount = promotion.remainingBudget;
    const nextWallet = {
      ...wallet,
      availableBalance: wallet.availableBalance + releaseAmount,
      lockedBalance: Math.max(0, wallet.lockedBalance - releaseAmount),
    };
    setWallet(nextWallet);
    setPromotions((current) =>
      current.map((item) =>
        item.id === promotionId
          ? { ...item, status: "COMPLETED", remainingBudget: 0 }
          : item,
      ),
    );
    createTransaction("PROMOTION_RELEASE", `Hoàn ngân sách còn lại ${promotionId}`, releaseAmount, nextWallet);
    onToast({
      title: "Đã hoàn tất promotion",
      message: `Phần còn lại ${formatCurrency(releaseAmount)} được release về số dư khả dụng.`,
    });
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InsightCard
          title="Số dư khả dụng"
          icon={WalletCards}
          value={formatShortCurrency(wallet.availableBalance)}
          label={`${formatShortCurrency(wallet.lockedBalance)} đang giữ`}
          text="Chỉ dùng trong hệ thống để tạo quảng bá, MVP chưa hỗ trợ rút tiền."
          tone="is-green"
        />
        <InsightCard
          title="Promotion active"
          icon={Megaphone}
          value={new Intl.NumberFormat("vi-VN").format(summary.active)}
          label={`${formatShortCurrency(summary.remaining)} ngân sách còn lại`}
          text="Bài promoted hiển thị ở slot ưu tiên, không dùng đấu giá realtime."
          tone="is-orange"
        />
        <InsightCard
          title="Chi phí đã ghi nhận"
          icon={CircleDollarSign}
          value={formatShortCurrency(wallet.totalSpent)}
          label={`${summary.clicks} click hợp lệ`}
          text="Chỉ trừ tiền khi click hợp lệ, không charge impression."
          tone="is-teal"
        />
        <InsightCard
          title="CTR quảng bá"
          icon={BarChart3}
          value={summary.impressions ? formatPercent((summary.clicks / summary.impressions) * 100) : "0%"}
          label={`${new Intl.NumberFormat("vi-VN").format(summary.impressions)} impressions`}
          text="Seller xem được impression, click, CTR và average CPC."
          tone="is-yellow"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <Panel className="p-5">
          <PanelHeader
            title="Tạo quảng bá bài đăng"
            subtitle="Chọn bài ACTIVE, ngân sách và thời gian. Frontend đang dùng data giả trong lúc chờ API."
          >
            <button
              type="button"
              className="vendor-secondary-button"
              onClick={() => navigateTo?.("tai-chinh")}
            >
              <WalletCards className="h-4 w-4" />
              Xem tài chính
            </button>
          </PanelHeader>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-[0.08em] text-stone-400">
                Bài đăng đủ điều kiện
              </span>
              <select
                value={selectedPostId}
                onChange={(event) => setSelectedPostId(event.target.value)}
                className="vendor-input mt-2 h-11 w-full px-3 text-sm font-bold"
              >
                {eligibleProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.sku}
                  </option>
                ))}
              </select>
            </label>

            {selectedPost && (
              <div className="rounded-xl border border-stone-100 bg-stone-50/70 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-extrabold text-stone-800">
                      {selectedPost.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-stone-400">
                      {selectedPost.category} · {formatCurrency(selectedPost.price)} · Uy tín {selectedPost.reputationScore}/100
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={selectedPost.status} />
                    {hasRunningPromotion && <StatusBadge status="Đang chạy">Đã có quảng bá</StatusBadge>}
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-extrabold uppercase tracking-[0.08em] text-stone-400">
                  Ngân sách quảng bá
                </span>
                <span className="text-xs font-bold text-stone-500">
                  Min {formatCurrency(PROMOTION_CONFIG.minBudget)}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {PROMOTION_CONFIG.budgetPresets.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={cn(
                      "rounded-lg border px-3 py-2 text-xs font-extrabold transition-colors",
                      budget === amount
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-stone-200 bg-white text-stone-500 hover:border-orange-200 hover:text-orange-600",
                    )}
                    onClick={() => setBudget(amount)}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={PROMOTION_CONFIG.minBudget}
                max={PROMOTION_CONFIG.maxBudget}
                step="10000"
                value={budget}
                onChange={(event) => setBudget(Number(event.target.value || 0))}
                className="vendor-input mt-3 h-11 w-full px-3 text-sm font-bold"
                placeholder="Nhập ngân sách custom"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-extrabold uppercase tracking-[0.08em] text-stone-400">
                  Ngày bắt đầu
                </span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="vendor-input mt-2 h-11 w-full px-3 text-sm font-bold"
                />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold uppercase tracking-[0.08em] text-stone-400">
                  Ngày kết thúc
                </span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="vendor-input mt-2 h-11 w-full px-3 text-sm font-bold"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <PromotionPreviewItem label="Số dư khả dụng" value={formatCurrency(wallet.availableBalance)} tone="text-teal-700" />
              <PromotionPreviewItem label="CPC dự kiến" value={formatCurrency(estimatedCpc)} tone="text-orange-700" />
              <PromotionPreviewItem label="Click tối đa ước tính" value={new Intl.NumberFormat("vi-VN").format(estimatedMaxClicks)} tone="text-stone-800" />
            </div>

            {!isBalanceSufficient && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  <div>
                    <p className="text-sm font-extrabold text-red-700">
                      Số dư không đủ để quảng bá bài đăng
                    </p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-red-600">
                      Cần nạp thêm {formatCurrency(deficit)}. Theo BRD, frontend sẽ điều hướng Seller sang màn nạp thêm và không tạo promotion.
                    </p>
                    <button
                      type="button"
                      className="vendor-primary-button mt-3 bg-red-600 border-red-600 hover:bg-red-700"
                      onClick={() => handleTopUpMock(deficit)}
                    >
                      <CreditCard className="h-4 w-4" />
                      Nạp thêm mô phỏng
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-orange-100 bg-orange-50/70 p-4 text-xs font-semibold leading-5 text-orange-800">
              Hệ thống chỉ ghi nhận chi phí khi có click hợp lệ. Duplicate, bot, self-click hoặc click ngoài thời gian chạy sẽ không bị charge.
            </div>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleCreatePromotion}
              className="vendor-primary-button w-full justify-center disabled:cursor-not-allowed disabled:border-stone-200 disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none disabled:hover:translate-y-0"
            >
              <Megaphone className="h-4 w-4" />
              Xác nhận quảng bá
            </button>
          </div>
        </Panel>

        <Panel className="p-5">
          <PanelHeader
            title="Ví quảng bá & ledger"
            subtitle="Số dư là nguồn tiền reserve budget, mọi thay đổi cần transaction log."
          >
            <button
              type="button"
              className="vendor-secondary-button"
              onClick={() => handleTopUpMock(300000)}
            >
              <Plus className="h-4 w-4" />
              Nạp 300K
            </button>
          </PanelHeader>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <PromotionPreviewItem label="Available balance" value={formatCurrency(wallet.availableBalance)} tone="text-teal-700" />
            <PromotionPreviewItem label="Locked balance" value={formatCurrency(wallet.lockedBalance)} tone="text-orange-700" />
            <PromotionPreviewItem label="Total deposited" value={formatCurrency(wallet.totalDeposited)} tone="text-stone-800" />
            <PromotionPreviewItem label="Total spent" value={formatCurrency(wallet.totalSpent)} tone="text-red-600" />
          </div>
          <div className="mt-4 divide-y divide-stone-100">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-stone-700">
                    {transaction.label}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-stone-400">
                    {transaction.id} · {transaction.type} · {transaction.time}
                  </p>
                </div>
                <p className={cn(
                  "shrink-0 text-sm font-extrabold",
                  transaction.amount >= 0 ? "text-teal-700" : "text-red-600",
                )}>
                  {transaction.amount >= 0 ? "+" : ""}{formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <Panel className="overflow-hidden">
        <div className="p-5">
          <PanelHeader
            title="Hiệu suất quảng bá bài đăng"
            subtitle="Theo dõi budget, remaining, spent, impression, click, CTR và avg CPC."
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="vendor-table-head">
              <tr>
                {["Bài đăng", "Trạng thái", "Ngân sách", "Đã tiêu", "Impression", "Click/CTR", "Avg CPC", "Thao tác"].map((column) => (
                  <th key={column} className="px-5 py-3.5">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {promotions.map((promotion) => {
                const spentPercent = promotion.initialBudget
                  ? (promotion.spentAmount / promotion.initialBudget) * 100
                  : 0;
                const ctr = promotion.impressions
                  ? (promotion.clicks / promotion.impressions) * 100
                  : 0;
                const avgCpc = promotion.clicks
                  ? Math.round(promotion.spentAmount / promotion.clicks)
                  : promotion.cpcSnapshot;
                return (
                  <tr key={promotion.id} className="vendor-table-row">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                          <Megaphone className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-extrabold text-stone-800">{promotion.postName}</p>
                          <p className="mt-1 text-xs font-semibold text-stone-400">
                            {promotion.id} · {promotion.startDate} - {promotion.endDate}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={getPromotionStatusLabel(promotion.status)} />
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-extrabold text-stone-700">
                        {formatCurrency(promotion.remainingBudget)}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-stone-400">
                        / {formatCurrency(promotion.initialBudget)}
                      </p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
                        <div
                          className="h-full rounded-full bg-orange-500"
                          style={{ width: `${Math.min(100, spentPercent)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4 font-extrabold text-red-600">
                      {formatCurrency(promotion.spentAmount)}
                    </td>
                    <td className="px-5 py-4 font-bold text-stone-600">
                      {new Intl.NumberFormat("vi-VN").format(promotion.impressions)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-extrabold text-stone-700">
                        {new Intl.NumberFormat("vi-VN").format(promotion.clicks)}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-teal-700">
                        CTR {formatPercent(ctr)}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-extrabold text-orange-700">
                      {formatCurrency(avgCpc)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="vendor-secondary-button min-h-9 px-3"
                          onClick={() => handleTrackClick(promotion.id)}
                        >
                          <MousePointerClick className="h-4 w-4" />
                          Click
                        </button>
                        {["ACTIVE", "SCHEDULED"].includes(promotion.status) && (
                          <button
                            type="button"
                            className="vendor-secondary-button min-h-9 px-3"
                            onClick={() => handleCompletePromotion(promotion.id)}
                          >
                            <ReceiptText className="h-4 w-4" />
                            Kết thúc
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function PromotionPreviewItem({ label, value, tone }) {
  return (
    <div className="rounded-xl border border-stone-100 bg-white p-3">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-stone-400">
        {label}
      </p>
      <p className={cn("mt-1 text-sm font-extrabold", tone)}>
        {value}
      </p>
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

  const vendorInfo = getVendorInfo();
  const profileId = vendorInfo?.profileId;

  const [vendorData, setVendorData] = useState({
    id: null,
    shopName: "",
    category: "",
    email: "",
    phone: "",
    cccd: "",
    taxCode: "",
    status: "active",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCccd, setShowCccd] = useState(false);
  const [showTaxCode, setShowTaxCode] = useState(false);

  useEffect(() => {
    const fetchVendorProfile = async () => {
      if (!profileId) {
        setLoading(false);
        return;
      }
      try {
        const data = await sellerApi.getVendorByProfileId(profileId);
        if (data) {
          setVendorData({
            id: data.id,
            shopName: data.shopName || "",
            category: data.category || "",
            email: data.email || "",
            phone: data.phone || "",
            cccd: data.cccd || "",
            taxCode: data.taxCode || "",
            status: data.status || "active",
          });
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin shop:", err);
        onToast({
          title: "Lỗi tải dữ liệu",
          message: "Không thể tải thông tin hồ sơ từ máy chủ.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProfile();
  }, [profileId, onToast]);

  const maskSensitive = (str, show) => {
    if (!str) return "Chưa cập nhật";
    if (show) return str;
    if (str.length <= 6) return "*".repeat(str.length);
    return str.slice(0, 3) + "*".repeat(str.length - 6) + str.slice(-3);
  };

  const handleSaveProfile = async () => {
    if (!vendorData.shopName.trim()) {
      onToast({ title: "Thông tin không hợp lệ", message: "Vui lòng nhập tên shop.", type: "error" });
      return;
    }
    if (!vendorData.email.trim()) {
      onToast({ title: "Thông tin không hợp lệ", message: "Vui lòng nhập email hỗ trợ.", type: "error" });
      return;
    }
    if (!vendorData.phone.trim()) {
      onToast({ title: "Thông tin không hợp lệ", message: "Vui lòng nhập số điện thoại.", type: "error" });
      return;
    }

    try {
      const vendorId = vendorData.id || vendorInfo?.vendorId;
      if (!vendorId) throw new Error("Không tìm thấy Vendor ID");

      setSaving(true);
      const response = await sellerApi.updateVendor(vendorId, {
        shopName: vendorData.shopName.trim(),
        description: vendorData.description || "",
        logoUrl: vendorData.logoUrl || "",
        email: vendorData.email.trim(),
        phone: vendorData.phone.trim(),
        category: vendorData.category,
        status: vendorData.status,
        cccd: vendorData.cccd.trim(),
        taxCode: vendorData.taxCode.trim(),
      });

      if (response) {
        onToast({
          title: "Đã lưu thay đổi",
          message: "Hồ sơ cửa hàng đã được cập nhật thành công.",
          type: "success",
        });
        const updatedInfo = {
          ...vendorInfo,
          shopName: response.shopName,
        };
        localStorage.setItem("vendorInfo", JSON.stringify(updatedInfo));
      }
    } catch (err) {
      console.error("Lỗi khi lưu thông tin shop:", err);
      onToast({
        title: "Lỗi cập nhật",
        message: err?.response?.data?.message || err?.message || "Không thể lưu thay đổi.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-orange-600" />
      </div>
    );
  }

  const SELLER_CATEGORIES = [
    { id: "dt-do-dien-tu", name: "Điện tử & công nghệ" },
    { id: "may-tinh-van-phong", name: "Máy tính & Văn phòng" },
    { id: "thiet-bi-mang", name: "Thiết bị mạng" },
    { id: "tv-giai-tri", name: "TV & Thiết bị giải trí" },
  ];

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
            <p className="font-extrabold text-stone-800">{vendorData.shopName || "ShopVN Seller"}</p>
            <p className="mt-1 text-xs font-semibold text-stone-400">
              Mã shop: VND-{vendorData.id || vendorInfo?.vendorId || "N/A"}
            </p>
            <StatusBadge className="mt-2" status={vendorData.status === "active" ? "Đang hoạt động" : vendorData.status} />
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          <label>
            <span className="text-xs font-bold text-stone-500">Tên shop</span>
            <input
              className="vendor-input mt-1 h-11 w-full px-3 text-sm"
              value={vendorData.shopName}
              onChange={(e) => setVendorData(prev => ({ ...prev, shopName: e.target.value }))}
            />
          </label>

          <label>
            <span className="text-xs font-bold text-stone-500">Ngành hàng chính</span>
            <select
              className="vendor-input mt-1 h-11 w-full px-3 text-sm bg-white"
              value={vendorData.category}
              onChange={(e) => setVendorData(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">Chọn ngành hàng chính</option>
              {SELLER_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-xs font-bold text-stone-500">Email hỗ trợ</span>
            <input
              className="vendor-input mt-1 h-11 w-full px-3 text-sm"
              value={vendorData.email}
              onChange={(e) => setVendorData(prev => ({ ...prev, email: e.target.value }))}
            />
          </label>

          <label>
            <span className="text-xs font-bold text-stone-500">Số điện thoại</span>
            <input
              className="vendor-input mt-1 h-11 w-full px-3 text-sm"
              value={vendorData.phone}
              onChange={(e) => setVendorData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </label>

          <label className="relative block">
            <span className="text-xs font-bold text-stone-500">Số CCCD chủ shop (Được bảo mật)</span>
            <div className="relative mt-1">
              <input
                type="text"
                className={`vendor-input h-11 w-full pl-3 pr-10 text-sm ${!showCccd ? "bg-stone-50 text-stone-500 select-none" : ""}`}
                value={showCccd ? vendorData.cccd : maskSensitive(vendorData.cccd, false)}
                readOnly={!showCccd}
                onChange={(e) => {
                  if (showCccd) {
                    setVendorData(prev => ({ ...prev, cccd: e.target.value }));
                  }
                }}
                placeholder="Chưa cập nhật số CCCD"
              />
              <button
                type="button"
                onClick={() => setShowCccd(!showCccd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showCccd ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </label>

          <label className="relative block">
            <span className="text-xs font-bold text-stone-500">Mã số thuế (Được bảo mật)</span>
            <div className="relative mt-1">
              <input
                type="text"
                className={`vendor-input h-11 w-full pl-3 pr-10 text-sm ${!showTaxCode ? "bg-stone-50 text-stone-500 select-none" : ""}`}
                value={showTaxCode ? vendorData.taxCode : maskSensitive(vendorData.taxCode, false)}
                readOnly={!showTaxCode}
                onChange={(e) => {
                  if (showTaxCode) {
                    setVendorData(prev => ({ ...prev, taxCode: e.target.value }));
                  }
                }}
                placeholder="Chưa cập nhật mã số thuế"
              />
              <button
                type="button"
                onClick={() => setShowTaxCode(!showTaxCode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showTaxCode ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </label>
        </div>
        <button
          type="button"
          className="vendor-primary-button mt-5 flex items-center justify-center gap-2"
          onClick={handleSaveProfile}
          disabled={saving}
        >
          {saving ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-200 border-t-white" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
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
              ["CCCD chủ shop", vendorData.cccd ? "Đã xác minh" : "Chưa cập nhật", ShieldCheck],
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

// ==========================================
// AUDIT LOGGING SECTION FOR VENDOR DASHBOARD
// ==========================================
function AuditLogPage({ onToast }) {
  const [logs, setLogs] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [page, setPage] = useState(0); // 0-indexed for backend
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedPayload, setSelectedPayload] = useState(null);
  const pageSize = 10;

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sellerApi.getAuditLogs(page, pageSize, query, selectedAction);
      if (data) {
        setLogs(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      }
    } catch (err) {
      console.error(err);
      setError("Không thể tải nhật ký hoạt động. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const fetchActions = async () => {
    try {
      const data = await sellerApi.getDistinctActions();
      setActions(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedAction]);

  useEffect(() => {
    fetchActions();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchLogs();
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    try {
      const date = new Date(timeStr);
      return date.toLocaleString("vi-VN");
    } catch (e) {
      return timeStr;
    }
  };

  const getActionBadgeClass = (action) => {
    const act = (action || "").toUpperCase();
    if (act.includes("SUCCESS") || act.includes("VERIFY_CCCD_SUCCESS")) return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    if (act.includes("FAILED") || act.includes("VERIFY_CCCD_FAILED")) return "bg-red-50 text-red-700 border border-red-200";
    if (act.includes("REGISTER") || act.includes("ONBOARDING")) return "bg-purple-50 text-purple-700 border border-purple-200";
    if (act.includes("UPGRADE") || act.includes("SUBSCRIPTION")) return "bg-indigo-50 text-indigo-700 border border-indigo-200";
    if (act.includes("PRODUCT")) return "bg-blue-50 text-blue-700 border border-blue-200";
    return "bg-slate-50 text-slate-700 border border-slate-200";
  };

  const parseUserAgent = (ua) => {
    if (!ua) return "Không rõ";
    if (ua.includes("Mobile") || ua.includes("Android") || ua.includes("iPhone")) {
      let os = "Mobile";
      if (ua.includes("iPhone")) os = "iPhone";
      else if (ua.includes("Android")) os = "Android";
      
      let browser = "Browser";
      if (ua.includes("Chrome")) browser = "Chrome";
      else if (ua.includes("Safari")) browser = "Safari";
      else if (ua.includes("Firefox")) browser = "Firefox";
      return `${browser} (${os})`;
    }
    let os = "Desktop";
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Macintosh")) os = "Mac";
    else if (ua.includes("Linux")) os = "Linux";
    
    let browser = "Browser";
    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Safari") && !ua.includes('Chrome')) browser = "Safari";
    else if (ua.includes("Firefox")) browser = "Firefox";
    return `${browser} (${os})`;
  };

  return (
    <Panel className="space-y-6">
      <PanelHeader
        title="Nhật ký hoạt động của Shop"
        subtitle="Giám sát lịch sử đăng nhập, thay đổi thông tin cửa hàng, thêm/sửa sản phẩm và trạng thái nâng cấp gói."
      >
        <button
          onClick={() => { setPage(0); fetchLogs(); fetchActions(); }}
          className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors shadow-sm"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          Làm mới
        </button>
      </PanelHeader>

      {/* Filter bar */}
      <div className="rounded-xl border border-stone-100 bg-white p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo IP, Hành động hoặc Payload..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-stone-200 py-2 pl-9 pr-4 text-xs outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-shadow"
            />
          </div>
          <div className="w-full sm:w-64">
            <select
              value={selectedAction}
              onChange={(e) => { setSelectedAction(e.target.value); setPage(0); }}
              className="w-full rounded-lg border border-stone-200 py-2 px-3 text-xs outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-shadow"
            >
              <option value="">Tất cả loại hành động</option>
              {actions.map((act) => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition-colors"
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* Logs Table */}
      <div className="overflow-hidden rounded-xl border border-stone-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-stone-600" />
            <p className="text-xs font-semibold text-stone-500">Đang tải nhật ký...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <AlertTriangle className="h-6 w-6 text-red-600 mb-4" />
            <h3 className="text-xs font-extrabold text-stone-900">Lỗi tải dữ liệu</h3>
            <p className="mt-2 text-xs font-semibold text-stone-400">{error}</p>
            <button
              onClick={fetchLogs}
              className="mt-4 rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <History className="h-6 w-6 text-stone-400 mb-4" />
            <h3 className="text-xs font-extrabold text-stone-900">Không có hoạt động nào</h3>
            <p className="mt-2 text-xs font-semibold text-stone-400">
              Chưa ghi nhận hoạt động nào khớp với bộ lọc hiện tại của shop bạn.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-[10px] font-extrabold uppercase text-stone-500 border-b border-stone-100">
                <tr>
                  <th className="px-6 py-3">Thời gian</th>
                  <th className="px-6 py-3">Hành động</th>
                  <th className="px-6 py-3">Địa chỉ IP</th>
                  <th className="px-6 py-3">Thiết bị</th>
                  <th className="px-6 py-3 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-stone-800">
                      {formatTime(log.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", getActionBadgeClass(log.action))}>
                        {log.action}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-stone-500">
                      {log.ipAddress}
                    </td>
                    <td className="px-6 py-4 text-stone-500 max-w-[200px] truncate" title={log.userAgent}>
                      {parseUserAgent(log.userAgent)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      {log.payloadSnapshot ? (
                        <button
                          onClick={() => setSelectedPayload(log)}
                          className="inline-flex items-center gap-1 text-stone-900 hover:text-stone-600 transition-colors font-bold"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Xem chi tiết
                        </button>
                      ) : (
                        <span className="text-stone-400 font-semibold">Không có dữ liệu</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && logs.length > 0 && (
          <div className="flex items-center justify-between border-t border-stone-100 bg-white px-6 py-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => Math.max(0, p - 1))}
                className="relative inline-flex items-center rounded-md border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50 transition-opacity"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                className="relative ml-3 inline-flex items-center rounded-md border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50 transition-opacity"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-stone-600 font-semibold">
                  Hiển thị <span className="font-extrabold text-stone-800">{page * pageSize + 1}</span> đến{" "}
                  <span className="font-extrabold text-stone-800">{Math.min((page + 1) * pageSize, totalElements)}</span> trong số{" "}
                  <span className="font-extrabold text-stone-800">{totalElements}</span> bản ghi
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(0)}
                    className="relative inline-flex items-center rounded-l-md border border-stone-300 bg-white px-2 py-1 text-xs font-semibold text-stone-500 hover:bg-stone-50 disabled:opacity-50"
                  >
                    «
                  </button>
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    className="relative inline-flex items-center border border-stone-300 bg-white px-2.5 py-1 text-xs font-semibold text-stone-500 hover:bg-stone-50 disabled:opacity-50"
                  >
                    ‹
                  </button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    let pageNum = page;
                    if (page < 2) pageNum = i;
                    else if (page >= totalPages - 2) pageNum = totalPages - 5 + i;
                    else pageNum = page - 2 + i;
                    
                    if (pageNum < 0 || pageNum >= totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={cn(
                          "relative inline-flex items-center border px-3 py-1 text-xs font-semibold focus:z-10",
                          page === pageNum
                            ? "z-10 border-stone-900 bg-stone-50 text-stone-900"
                            : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                        )}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}

                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    className="relative inline-flex items-center border border-stone-300 bg-white px-2.5 py-1 text-xs font-semibold text-stone-500 hover:bg-stone-50 disabled:opacity-50"
                  >
                    ›
                  </button>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(totalPages - 1)}
                    className="relative inline-flex items-center rounded-r-md border border-stone-300 bg-white px-2 py-1 text-xs font-semibold text-stone-500 hover:bg-stone-50 disabled:opacity-50"
                  >
                    »
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payload Modal */}
      {selectedPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-xl rounded-xl bg-white shadow-xl border border-stone-100 flex flex-col max-h-[80vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-stone-900" />
                <h3 className="text-sm font-bold text-stone-900">Chi tiết dữ liệu hoạt động</h3>
              </div>
              <button
                onClick={() => setSelectedPayload(null)}
                className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-stone-100 pb-4">
                <div>
                  <span className="text-stone-400 block mb-0.5 font-semibold">Thời gian</span>
                  <span className="font-bold text-stone-800">{formatTime(selectedPayload.createdAt)}</span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5 font-semibold">Hành động</span>
                  <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase", getActionBadgeClass(selectedPayload.action))}>
                    {selectedPayload.action}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5 font-semibold">Địa chỉ IP</span>
                  <span className="font-mono text-stone-800">{selectedPayload.ipAddress}</span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5 font-semibold">Thiết bị</span>
                  <span className="font-bold text-stone-800">{parseUserAgent(selectedPayload.userAgent)}</span>
                </div>
              </div>

              <div>
                <span className="text-stone-400 text-xs block mb-2 font-bold">Chi tiết Payload (Dữ liệu chuyển giao)</span>
                <pre className="overflow-x-auto rounded-lg bg-stone-950 p-4 font-mono text-[10px] text-stone-400 border border-stone-900 leading-relaxed max-h-[250px]">
                  {(() => {
                    try {
                      const parsed = JSON.parse(selectedPayload.payloadSnapshot);
                      return JSON.stringify(parsed, null, 2);
                    } catch (e) {
                      return selectedPayload.payloadSnapshot;
                    }
                  })()}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-stone-100 px-6 py-4 bg-stone-50 rounded-b-xl">
              <button
                onClick={() => setSelectedPayload(null)}
                className="rounded-lg bg-stone-100 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-200 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}

const pageComponents = {
  trangchu: OverviewPage,
  "don-hang": OrdersPage,
  "san-pham": ProductsPage,
  "van-chuyen": ShippingPage,
  ...(VENDOR_FEATURES.warehouse ? { "kho-hang": WarehousePage } : {}),
  "tin-nhan": MessagesPage,
  "nghien-cuu-thi-truong": MarketResearchPage,
  marketing: MarketingPage,
  "tai-chinh": FinancePage,
  "nhat-ky-hoat-dong": AuditLogPage,
  "cai-dat-shop": SettingsPage,
};

export default function VendorHome() {
  const { section = "trangchu", action } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState(null);

  // Subscription plan modal state
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planModalBlocks, setPlanModalBlocks] = useState(false);
  const [afterSelectCb, setAfterSelectCb] = useState(null);

  const openPlanModal = useCallback(({ blocksNavigation = false, onAfterSelect } = {}) => {
    setPlanModalBlocks(blocksNavigation);
    setAfterSelectCb(() => onAfterSelect || null);
    setPlanModalOpen(true);
  }, []);

  const handlePlanSelected = useCallback((plan) => {
    setToast({
      title: `Đã chuyển sang gói ${plan.name}`,
      message:
        plan.id === 'premium'
          ? 'Không giới hạn lượt đăng. Đăng tin ngay thôi!'
          : `Bạn có ${plan.totalSlots} lượt đăng tin với thời hạn ${plan.displayDays} ngày/tin.`,
    });
    afterSelectCb?.();
    // If was blocking (quota exhausted) and now has slots, navigate to add product
    if (planModalBlocks && plan.id !== 'free') {
      navigate('/vendor/products/add');
    }
  }, [afterSelectCb, navigate, planModalBlocks]);

  useEffect(() => {
    if (!location.state?.toast) return;
    setToast(location.state.toast);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  // Check if warehouse is configured (both PICKUP and RETURN exist)
  const [hasWarehouseConfigured, setHasWarehouseConfigured] = useState(false);

  useEffect(() => {
    const checkWarehouse = () => {
      try {
        const saved = localStorage.getItem("sellerWarehouses");
        if (!saved) return false;
        const list = JSON.parse(saved);
        if (!Array.isArray(list)) return false;
        const hasPickup = list.some(
          (w) => w.type === "PICKUP" || w.warehouse_type === "PICKUP"
        );
        const hasReturn = list.some(
          (w) => w.type === "RETURN" || w.warehouse_type === "RETURN"
        );
        return hasPickup && hasReturn;
      } catch {
        return false;
      }
    };
    setHasWarehouseConfigured(checkWarehouse());
  }, [section]);

  const Page = pageComponents[section];
  if (!Page) return <Navigate to="/vendor/trangchu" replace />;
  const navigateTo = (slug) => navigate(`/vendor/${slug}`);
  return (
    <>
      <VendorLayout
        activeSlug={section}
        onToast={setToast}
        hasWarehouseConfigured={hasWarehouseConfigured}
        onOpenPlanModal={openPlanModal}
      >
        <Page
          action={action}
          navigate={navigate}
          navigateTo={navigateTo}
          onToast={setToast}
          hasWarehouseConfigured={hasWarehouseConfigured}
          onOpenPlanModal={openPlanModal}
        />
      </VendorLayout>
      {toast && <VendorToast toast={toast} onClose={() => setToast(null)} />}
      <SubscriptionPlanModal
        isOpen={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        onPlanSelected={handlePlanSelected}
        blocksNavigation={planModalBlocks}
        currentPlanId={getVendorPlan().planId}
      />
    </>
  );
}
