import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

// ============================================================
// Cấu trúc danh mục 3 cấp — chỉ thiết bị điện tử
// ============================================================
export const ELECTRONICS_CATEGORIES = [
  {
    id: 'dt-do-dien-tu',
    name: 'Điện thoại & Đồ điện tử',
    children: [
      {
        id: 'phu-kien-dt',
        name: 'Phụ kiện điện thoại',
        children: [
          { id: 'op-lung-bao-da', name: 'Ốp lưng & Bao da' },
          { id: 'sac-cap-dt', name: 'Sạc & Cáp điện thoại' },
          { id: 'kinh-cuong-luc', name: 'Kính cường lực' },
          { id: 'pin-du-phong', name: 'Pin dự phòng' },
          { id: 'tai-nghe-co-day', name: 'Tai nghe có dây' },
          { id: 'de-sac-khong-day', name: 'Đế sạc không dây' },
        ],
      },
      {
        id: 'camera-nhiep-anh',
        name: 'Camera & Nhiếp ảnh',
        children: [
          { id: 'may-anh-compact', name: 'Máy ảnh compact' },
          { id: 'may-anh-mirrorless', name: 'Máy ảnh mirrorless' },
          { id: 'may-anh-dslr', name: 'Máy ảnh DSLR' },
          { id: 'camera-hanh-dong', name: 'Camera hành động' },
          { id: 'drone', name: 'Drone / Máy bay không người lái' },
          { id: 'phu-kien-camera', name: 'Phụ kiện camera' },
        ],
      },
      {
        id: 'am-thanh-video',
        name: 'Âm thanh & Video',
        children: [
          { id: 'loa-bluetooth', name: 'Loa Bluetooth' },
          { id: 'loa-de-ban', name: 'Loa để bàn' },
          { id: 'tai-nghe-bluetooth', name: 'Tai nghe Bluetooth' },
          { id: 'soundbar', name: 'Soundbar' },
          { id: 'micro-thu-am', name: 'Micro & Thu âm' },
        ],
      },
      {
        id: 'choi-game-console',
        name: 'Chơi game & Bảng điều khiển',
        children: [
          { id: 'console-tro-choi', name: 'Bảng điều khiển trò chơi video' },
          { id: 'console-cam-tay', name: 'Bảng điều khiển cầm tay' },
          { id: 'tro-choi-dien-tu', name: 'Trò chơi điện tử' },
          { id: 'phu-kien-console', name: 'Phụ kiện bảng điều khiển' },
        ],
      },
      {
        id: 'thiet-bi-thong-minh',
        name: 'Thiết bị thông minh & Thiết bị đeo',
        children: [
          { id: 'dong-ho-thong-minh', name: 'Đồng hồ thông minh' },
          { id: 'vong-suc-khoe', name: 'Vòng đeo sức khỏe' },
          { id: 'smarthome', name: 'Thiết bị nhà thông minh' },
          { id: 'den-thong-minh', name: 'Đèn thông minh' },
        ],
      },
      {
        id: 'dien-thoai-may-tinh-bang',
        name: 'Điện thoại & Máy tính bảng',
        children: [
          { id: 'dien-thoai-thong-minh', name: 'Điện thoại thông minh' },
          { id: 'may-tinh-bang', name: 'Máy tính bảng' },
          { id: 'dien-thoai-pho-thong', name: 'Điện thoại phổ thông' },
        ],
      },
    ],
  },
  {
    id: 'may-tinh-van-phong',
    name: 'Máy tính & Thiết bị Văn phòng',
    children: [
      {
        id: 'may-tinh-laptop-bang',
        name: 'Máy tính để bàn, Laptop & Máy tính bảng',
        children: [
          { id: 'may-tinh-de-ban', name: 'Máy tính để bàn' },
          { id: 'laptop', name: 'Máy tính xách tay' },
          { id: 'may-tinh-bang-pc', name: 'Máy tính bảng (PC)' },
        ],
      },
      {
        id: 'phu-kien-may-tinh',
        name: 'Phụ kiện máy tính',
        children: [
          { id: 'ban-phim', name: 'Bàn phím' },
          { id: 'chuot-pc', name: 'Chuột máy tính' },
          { id: 'man-hinh', name: 'Màn hình' },
          { id: 'tai-nghe-gaming', name: 'Tai nghe Gaming' },
          { id: 'webcam', name: 'Webcam' },
          { id: 'loa-may-tinh', name: 'Loa máy tính' },
        ],
      },
      {
        id: 'luu-tru',
        name: 'Lưu trữ',
        children: [
          { id: 'o-cung-hdd', name: 'Ổ cứng HDD' },
          { id: 'o-cung-ssd', name: 'Ổ cứng SSD' },
          { id: 'usb-flash-drive', name: 'USB Flash Drive' },
          { id: 'the-nho', name: 'Thẻ nhớ' },
          { id: 'nas', name: 'NAS / Network Storage' },
        ],
      },
      {
        id: 'linh-kien-may-tinh',
        name: 'Linh kiện máy tính',
        children: [
          { id: 'cpu', name: 'CPU / Bộ vi xử lý' },
          { id: 'mainboard', name: 'Mainboard / Bo mạch chủ' },
          { id: 'ram', name: 'RAM' },
          { id: 'card-do-hoa', name: 'Card đồ họa (GPU)' },
          { id: 'nguon-may-tinh', name: 'Nguồn máy tính (PSU)' },
          { id: 'tan-nhiet', name: 'Tản nhiệt' },
        ],
      },
    ],
  },
  {
    id: 'thiet-bi-mang',
    name: 'Thiết bị mạng',
    children: [
      {
        id: 'router-ap',
        name: 'Router & Access Point',
        children: [
          { id: 'router-wifi', name: 'Router WiFi' },
          { id: 'access-point', name: 'Access Point' },
          { id: 'mesh-wifi', name: 'Mesh WiFi System' },
        ],
      },
      {
        id: 'switch-hub',
        name: 'Switch & Hub mạng',
        children: [
          { id: 'network-switch', name: 'Network Switch' },
          { id: 'kvm-switch', name: 'KVM Switch' },
        ],
      },
    ],
  },
  {
    id: 'tv-giai-tri',
    name: 'TV & Thiết bị giải trí',
    children: [
      {
        id: 'smart-tv',
        name: 'Smart TV',
        children: [
          { id: 'android-tv', name: 'Android TV' },
          { id: 'qled-tv', name: 'QLED TV' },
          { id: 'oled-tv', name: 'OLED TV' },
        ],
      },
      {
        id: 'dau-phat-streaming',
        name: 'Đầu phát trực tuyến',
        children: [
          { id: 'android-tv-box', name: 'Android TV Box' },
          { id: 'chromecast', name: 'Google Chromecast' },
          { id: 'fire-stick', name: 'Amazon Fire Stick' },
        ],
      },
      {
        id: 'may-chieu',
        name: 'Máy chiếu',
        children: [
          { id: 'projector-mini', name: 'Máy chiếu mini' },
          { id: 'projector-chuan', name: 'Máy chiếu chuẩn' },
        ],
      },
    ],
  },
];

export const SELLER_PARENT_CATEGORIES = ELECTRONICS_CATEGORIES.map(({ id, name }) => ({
  id,
  name,
}));

// Helper: tìm node theo id (bất kỳ cấp)
function findNode(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

// Helper: tìm breadcrumb path đến 1 leaf id
function findPath(nodes, targetId, path = []) {
  for (const node of nodes) {
    const newPath = [...path, node];
    if (node.id === targetId) return newPath;
    if (node.children) {
      const found = findPath(node.children, targetId, newPath);
      if (found) return found;
    }
  }
  return null;
}

// Helper: flatten tất cả leaf nodes với tên đầy đủ để search
function flattenLeaves(nodes, prefix = '') {
  const result = [];
  for (const node of nodes) {
    const fullName = prefix ? `${prefix} > ${node.name}` : node.name;
    if (!node.children || node.children.length === 0) {
      result.push({ id: node.id, name: node.name, fullName });
    } else {
      result.push(...flattenLeaves(node.children, fullName));
    }
  }
  return result;
}

/**
 * CategorySelectorField
 * Dropdown 3 cấp kiểu TikTok Seller Center:
 *  - Cột 1: Danh mục cấp 1
 *  - Cột 2: Danh mục cấp 2
 *  - Cột 3: Danh mục cấp 3 (leaf — có thể chọn)
 * Hỗ trợ search toàn bộ
 */
export function CategorySelectorField({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const [l1Id, setL1Id] = useState(null);
  const [l2Id, setL2Id] = useState(null);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  // Computed
  const selectedPath = value ? findPath(ELECTRONICS_CATEGORIES, value) : null;
  const breadcrumb = selectedPath
    ? selectedPath.map((n) => n.name).join(' > ')
    : null;

  const l1Node = l1Id ? findNode(ELECTRONICS_CATEGORIES, l1Id) : null;
  const l2Node = l2Id ? findNode(ELECTRONICS_CATEGORIES, l2Id) : null;

  const allLeaves = flattenLeaves(ELECTRONICS_CATEGORIES);
  const searchResults = search.trim()
    ? allLeaves.filter((l) =>
        l.fullName.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // Khi mở lại, pre-select path theo value đã chọn
  const handleOpen = () => {
    if (!open && selectedPath && selectedPath.length >= 1) {
      setL1Id(selectedPath[0]?.id ?? null);
      setL2Id(selectedPath[1]?.id ?? null);
    }
    setOpen(true);
  };

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSelect = (leafId) => {
    onChange(leafId);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setL1Id(null);
    setL2Id(null);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          'vendor-input w-full px-3 py-2.5 text-xs flex items-center justify-between gap-2 bg-white text-left transition-all',
          open && 'border-orange-500 ring-4 ring-orange-500/10',
          error && !open && 'border-red-300'
        )}
      >
        <span
          className={cn(
            'truncate',
            breadcrumb ? 'text-slate-800 font-semibold text-xs' : 'text-slate-400'
          )}
        >
          {breadcrumb || 'Chọn hạng mục sản phẩm'}
        </span>
        <span className="flex items-center gap-1 flex-shrink-0">
          {value && (
            <span
              role="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown
            className={cn(
              'h-4 w-4 text-slate-400 transition-transform',
              open && 'rotate-180'
            )}
          />
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Search */}
          <div className="p-2.5 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Tìm kiếm hạng mục..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-slate-700"
              />
            </div>
          </div>

          {/* Breadcrumb header (nếu đang duyệt) */}
          {!search && (l1Id || value) && (
            <div className="px-3.5 py-2 bg-orange-50/40 border-b border-orange-100/40 flex items-center gap-1.5 text-[10px] font-extrabold text-orange-600">
              <span
                className="cursor-pointer hover:underline"
                onClick={() => {
                  setL1Id(null);
                  setL2Id(null);
                }}
              >
                Tất cả hạng mục
              </span>
              {l1Node && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <span
                    className="cursor-pointer hover:underline"
                    onClick={() => setL2Id(null)}
                  >
                    {l1Node.name}
                  </span>
                </>
              )}
              {l2Node && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <span>{l2Node.name}</span>
                </>
              )}
            </div>
          )}

          {/* Search results */}
          {search && (
            <div className="max-h-72 overflow-y-auto py-1">
              {searchResults.length === 0 ? (
                <p className="text-center text-xs font-semibold text-slate-400 py-6">
                  Không tìm thấy hạng mục
                </p>
              ) : (
                searchResults.map((leaf) => (
                  <button
                    key={leaf.id}
                    type="button"
                    onClick={() => handleSelect(leaf.id)}
                    className={cn(
                      'w-full text-left px-3.5 py-2.5 text-xs hover:bg-orange-50/40 transition-colors',
                      value === leaf.id && 'bg-orange-50/70'
                    )}
                  >
                    <span className="font-semibold text-slate-700">{leaf.name}</span>
                    <span className="ml-1.5 text-[10px] text-slate-400 font-medium">
                      {leaf.fullName.split(' > ').slice(0, -1).join(' > ')}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}

          {/* 3-column drill-down (khi không search) */}
          {!search && (
            <div className="flex" style={{ height: '260px' }}>
              {/* Cột 1: Danh mục cấp 1 */}
              <div className="w-1/3 border-r border-slate-100 overflow-y-auto py-1">
                {ELECTRONICS_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setL1Id(cat.id);
                      setL2Id(null);
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2.5 text-xs font-semibold flex items-center justify-between gap-1 transition-colors',
                      l1Id === cat.id
                        ? 'bg-orange-50/60 text-orange-600 font-bold border-r-2 border-orange-500'
                        : 'text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    <span className="truncate">{cat.name}</span>
                    <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-50" />
                  </button>
                ))}
              </div>

              {/* Cột 2: Danh mục cấp 2 */}
              <div className="w-1/3 border-r border-slate-100 overflow-y-auto py-1">
                {l1Node?.children?.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      setL2Id(sub.id);
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2.5 text-xs font-semibold flex items-center justify-between gap-1 transition-colors',
                      l2Id === sub.id
                        ? 'bg-orange-50/60 text-orange-600 font-bold border-r-2 border-orange-500'
                        : 'text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    <span className="truncate">{sub.name}</span>
                    {sub.children?.length > 0 && (
                      <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-50" />
                    )}
                  </button>
                )) ?? (
                  <p className="text-center text-[10px] text-slate-400 py-6 font-semibold">
                    Chọn danh mục bên trái
                  </p>
                )}
              </div>

              {/* Cột 3: Danh mục cấp 3 (leaf — selectable) */}
              <div className="w-1/3 overflow-y-auto py-1">
                {l2Node?.children?.map((leaf) => (
                  <button
                    key={leaf.id}
                    type="button"
                    onClick={() => handleSelect(leaf.id)}
                    className={cn(
                      'w-full text-left px-3 py-2.5 text-xs font-semibold flex items-center gap-2 transition-colors',
                      value === leaf.id
                        ? 'bg-orange-50 text-orange-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50/50'
                    )}
                  >
                    {value === leaf.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                    )}
                    <span className="truncate">{leaf.name}</span>
                  </button>
                )) ?? (
                  <p className="text-center text-[10px] text-slate-400 py-6 font-semibold">
                    Chọn phân mục bên trái
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs font-bold text-red-600 mt-1.5 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
