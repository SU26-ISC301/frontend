import { useState, useEffect } from 'react';
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

// Dữ liệu mẫu cho các dropdown thuộc tính
const WARRANTY_TYPES = ['Bảo hành nhà sản xuất', 'Bảo hành nhà phân phối', 'Bảo hành cửa hàng', 'Không bảo hành'];
const COUNTRIES = ['Việt Nam', 'Trung Quốc', 'Mỹ', 'Nhật Bản', 'Hàn Quốc', 'Đài Loan', 'Đức'];
const OS_LIST = ['Windows 11', 'Windows 10', 'macOS', 'Linux', 'ChromeOS', 'FreeDOS'];
const PORTS_LIST = ['USB-C, USB-A, HDMI, Jack 3.5mm', 'Thunderbolt 4, USB-C, Jack 3.5mm', 'USB-A, HDMI, LAN, Jack 3.5mm', 'Đầy đủ cổng kết nối'];
const CPU_LIST = ['Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2', 'Apple M3'];
const STORAGE_LIST = ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD', '1TB HDD', '128GB SSD'];

export function ProductAttributesField({ categoryId, value = {}, onChange, errors = {} }) {
  const [showOptional, setShowOptional] = useState(false);

  // Reset attributes when category changes
  useEffect(() => {
    // Chỉ reset nếu categoryId thực sự đổi sang một nhóm khác
    onChange({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  if (!categoryId) {
    return (
      <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50/50">
        <p className="text-xs font-semibold text-slate-400">
          Vui lòng chọn Hạng mục sản phẩm để hiển thị các thuộc tính tương ứng.
        </p>
      </div>
    );
  }

  const handleAttrChange = (key, val) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  // Xác định danh sách trường thuộc tính dựa trên categoryId
  // Laptop: 8 trường (4 Bắt buộc + 4 Chính)
  // Máy tính để bàn (may-tinh-de-ban): 5 trường (3 Bắt buộc + 2 Chính)
  // Khác: 4 trường mặc định
  const isLaptop = categoryId === 'laptop';
  const isDesktop = categoryId === 'may-tinh-de-ban';

  const requiredFields = [];
  const mainFields = [];

  if (isLaptop) {
    // 8 trường tổng cộng
    requiredFields.push(
      {
        id: 'warrantyType',
        label: 'Loại bảo hành',
        type: 'select',
        options: WARRANTY_TYPES,
        placeholder: 'Chọn loại bảo hành',
      },
      {
        id: 'originCountry',
        label: 'Quốc gia xuất xứ',
        type: 'select',
        options: COUNTRIES,
        placeholder: 'Chọn quốc gia xuất xứ',
      },
      {
        id: 'responsibleName',
        label: 'Tên tổ chức chịu trách nhiệm hàng hóa',
        type: 'text',
        placeholder: 'Nhập tên tổ chức',
      },
      {
        id: 'responsibleAddress',
        label: 'Địa chỉ tổ chức chịu trách nhiệm hàng hóa',
        type: 'text',
        placeholder: 'Nhập địa chỉ tổ chức',
        colSpan: 'sm:col-span-3',
      }
    );

    mainFields.push(
      {
        id: 'os',
        label: 'Hệ điều hành',
        type: 'select',
        options: OS_LIST,
        placeholder: 'Chọn hệ điều hành',
      },
      {
        id: 'ports',
        label: 'Cổng',
        type: 'select',
        options: PORTS_LIST,
        placeholder: 'Chọn cổng kết nối',
      },
      {
        id: 'cpu',
        label: 'Vi xử lý',
        type: 'select',
        options: CPU_LIST,
        placeholder: 'Chọn vi xử lý',
      },
      {
        id: 'storage',
        label: 'Dung lượng Lưu trữ',
        type: 'select',
        options: STORAGE_LIST,
        placeholder: 'Chọn dung lượng lưu trữ',
      }
    );
  } else if (isDesktop) {
    // 5 trường tổng cộng (3 Bắt buộc + 2 Chính)
    requiredFields.push(
      {
        id: 'warrantyType',
        label: 'Loại bảo hành',
        type: 'select',
        options: WARRANTY_TYPES,
        placeholder: 'Chọn loại bảo hành',
      },
      {
        id: 'originCountry',
        label: 'Quốc gia xuất xứ',
        type: 'select',
        options: COUNTRIES,
        placeholder: 'Chọn quốc gia xuất xứ',
      },
      {
        id: 'responsibleName',
        label: 'Tên tổ chức chịu trách nhiệm hàng hóa',
        type: 'text',
        placeholder: 'Nhập tên tổ chức',
      }
    );

    mainFields.push(
      {
        id: 'cpu',
        label: 'Vi xử lý',
        type: 'select',
        options: CPU_LIST,
        placeholder: 'Chọn vi xử lý',
      },
      {
        id: 'storage',
        label: 'Dung lượng Lưu trữ',
        type: 'select',
        options: STORAGE_LIST,
        placeholder: 'Chọn dung lượng lưu trữ',
      }
    );
  } else {
    // Mặc định cho các loại khác: 4 trường (2 Bắt buộc + 2 Chính)
    requiredFields.push(
      {
        id: 'warrantyType',
        label: 'Loại bảo hành',
        type: 'select',
        options: WARRANTY_TYPES,
        placeholder: 'Chọn loại bảo hành',
      },
      {
        id: 'originCountry',
        label: 'Quốc gia xuất xứ',
        type: 'select',
        options: COUNTRIES,
        placeholder: 'Chọn quốc gia xuất xứ',
      }
    );

    mainFields.push(
      {
        id: 'material',
        label: 'Chất liệu',
        type: 'text',
        placeholder: 'VD: Hợp kim nhôm, nhựa ABS',
      },
      {
        id: 'powerInput',
        label: 'Điện áp đầu vào',
        type: 'text',
        placeholder: 'VD: 220V, 5V-2A',
      }
    );
  }

  const renderField = (field) => {
    const errorMsg = errors[field.id];
    const isRequired = requiredFields.some((f) => f.id === field.id);

    return (
      <div key={field.id} className={cn("space-y-1.5", field.colSpan || "")}>
        <label className="block text-xs font-semibold text-slate-600">
          {isRequired && <span className="text-red-500 mr-1">*</span>}
          {field.label}
        </label>

        {field.type === 'select' ? (
          <select
            value={value[field.id] || ''}
            onChange={(e) => handleAttrChange(field.id, e.target.value)}
            className={cn(
              'vendor-input w-full px-3 py-2 text-xs bg-white text-slate-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200',
              errorMsg && 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
            )}
          >
            <option value="">{field.placeholder}</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder={field.placeholder}
            value={value[field.id] || ''}
            onChange={(e) => handleAttrChange(field.id, e.target.value)}
            className={cn(
              'vendor-input w-full px-3 py-2 text-xs text-slate-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200',
              errorMsg && 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
            )}
          />
        )}

        {errorMsg && (
          <p className="text-[10px] font-bold text-red-600 flex items-center gap-0.5 mt-1">
            ⚠️ {errorMsg}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header thuộc tính */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-extrabold text-slate-800">Thuộc tính</h3>
          <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
        </div>
        <div className="flex items-center gap-1 text-[10px] font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
          <Sparkles className="h-3 w-3" />
          <span>1 đề xuất</span>
        </div>
      </div>

      {/* Nhóm thuộc tính Bắt buộc */}
      <div className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-4.5 space-y-3.5">
        <h4 className="text-xs font-bold text-slate-500">Bắt buộc</h4>
        <div className="grid gap-4 sm:grid-cols-3">
          {requiredFields.map((field) => renderField(field))}
        </div>
      </div>

      {/* Nhóm thuộc tính Chính */}
      <div className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-4.5 space-y-3.5">
        <h4 className="text-xs font-bold text-slate-500 flex items-center gap-1">
          Chính <HelpCircle className="h-3 w-3 text-slate-400" />
        </h4>
        <div className="grid gap-4 sm:grid-cols-3">
          {mainFields.map((field) => renderField(field))}
        </div>
      </div>

      {/* Thuộc tính không bắt buộc */}
      <div className="text-center pt-1.5">
        <button
          type="button"
          onClick={() => setShowOptional((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition"
        >
          <span>{showOptional ? 'Ẩn thuộc tính không bắt buộc' : 'Hiện thuộc tính không bắt buộc'}</span>
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showOptional && 'rotate-180')} />
        </button>

        {showOptional && (
          <div className="mt-4 bg-slate-50/50 border border-slate-200/80 rounded-xl p-4.5 text-left grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">Model máy</label>
              <input
                type="text"
                placeholder="VD: LOQ 15IRH8"
                value={value.model || ''}
                onChange={(e) => handleAttrChange('model', e.target.value)}
                className="vendor-input w-full px-3 py-2 text-xs text-slate-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">Năm sản xuất</label>
              <input
                type="text"
                placeholder="VD: 2024"
                value={value.releaseYear || ''}
                onChange={(e) => handleAttrChange('releaseYear', e.target.value)}
                className="vendor-input w-full px-3 py-2 text-xs text-slate-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
