import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const TECH_BRANDS = [
  'Apple', 'Samsung', 'Sony', 'LG', 'Xiaomi', 'OPPO', 'Vivo', 'realme',
  'Huawei', 'Honor', 'OnePlus', 'Google', 'Motorola', 'Nokia', 'ASUS',
  'Acer', 'Dell', 'HP', 'Lenovo', 'MSI', 'Razer', 'GIGABYTE', 'ROG (ASUS)',
  'Logitech', 'JBL', 'Bose', 'Sennheiser', 'Audio-Technica', 'AKG', 'Jabra',
  'Anker', 'Baseus', 'Ugreen', 'Belkin', 'SanDisk', 'Western Digital',
  'Seagate', 'Kingston', 'Crucial', 'Corsair', 'Cooler Master', 'Noctua',
  'NZXT', 'Thermaltake', 'be quiet!', 'Seasonic', 'Dyson', 'Philips',
  'Panasonic', 'Toshiba', 'D-Link', 'TP-Link', 'Netgear', 'Ubiquiti',
  'Intel', 'AMD', 'NVIDIA', 'Không có thương hiệu',
];

/**
 * BrandSelectorField
 * Dropdown với search + radio buttons — giống TikTok Seller Center
 */
export function BrandSelectorField({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  const filtered = TECH_BRANDS.filter((b) =>
    b.toLowerCase().includes(search.toLowerCase())
  );

  // Click outside để đóng
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

  const handleSelect = (brand) => {
    onChange(brand);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger field */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'vendor-input w-full px-3 py-2.5 text-xs flex items-center justify-between gap-2 bg-white text-left transition-all',
          open && 'border-orange-500 ring-4 ring-orange-500/10',
          error && !open && 'border-red-300'
        )}
      >
        <span className={value ? 'text-slate-800 font-semibold' : 'text-slate-400'}>
          {value || 'Chọn thương hiệu'}
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
            className={cn('h-4 w-4 text-slate-400 transition-transform', open && 'rotate-180')}
          />
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Search box */}
          <div className="p-2.5 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Tìm kiếm thương hiệu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-slate-700"
              />
            </div>
          </div>

          {/* Brand list */}
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="text-center text-xs font-semibold text-slate-400 py-6">
                Không tìm thấy thương hiệu
              </p>
            ) : (
              filtered.map((brand) => (
                <label
                  key={brand}
                  onClick={() => handleSelect(brand)}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 cursor-pointer transition-colors hover:bg-orange-50/40 select-none',
                    value === brand && 'bg-orange-50/70'
                  )}
                >
                  {/* Radio visual */}
                  <span
                    className={cn(
                      'flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors',
                      value === brand
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-slate-300'
                    )}
                  >
                    {value === brand && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-semibold',
                      value === brand ? 'text-orange-600 font-bold' : 'text-slate-700'
                    )}
                  >
                    {brand}
                  </span>
                </label>
              ))
            )}
          </div>

          {/* Footer hint */}
          <div className="border-t border-slate-100 px-3.5 py-2.5 bg-slate-50/50">
            <p className="text-[10px] font-semibold text-slate-400 leading-relaxed">
              Không tìm thấy thương hiệu? Vui lòng chọn{' '}
              <span
                className="text-orange-600 font-bold cursor-pointer hover:underline"
                onClick={() => handleSelect('Không có thương hiệu')}
              >
                Không có thương hiệu
              </span>
            </p>
          </div>
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
