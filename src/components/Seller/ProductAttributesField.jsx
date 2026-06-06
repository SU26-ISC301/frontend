import { useState, useEffect } from 'react';
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getAttributeSchema } from '../../utils/attributeSchemas';

export function ProductAttributesField({ categoryId, value = {}, onChange, errors = {} }) {
  const [showOptional, setShowOptional] = useState(false);

  // Reset attributes when category changes
  useEffect(() => {
    onChange({});
    setShowOptional(false);
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
  const schema = getAttributeSchema(categoryId) || getAttributeSchema('fallback');
  const requiredFields = schema.requiredFields || [];
  const mainFields = schema.mainFields || [];
  const optionalFields = schema.optionalFields || [];

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
            {(field.options || []).map((opt) => (
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
          <span>Theo hạng mục</span>
        </div>
      </div>

      {/* Nhóm thuộc tính Bắt buộc */}
      {requiredFields.length > 0 && (
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 space-y-3.5">
          <h4 className="text-xs font-bold text-slate-500">Bắt buộc</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            {requiredFields.map((field) => renderField(field))}
          </div>
        </div>
      )}

      {/* Nhóm thuộc tính Chính */}
      {mainFields.length > 0 && (
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 space-y-3.5">
          <h4 className="text-xs font-bold text-slate-500 flex items-center gap-1">
            Chính <HelpCircle className="h-3 w-3 text-slate-400" />
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            {mainFields.map((field) => renderField(field))}
          </div>
        </div>
      )}

      {/* Thuộc tính không bắt buộc — chỉ hiện nếu schema có optionalFields */}
      {optionalFields.length > 0 && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setShowOptional((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition"
          >
            <span>{showOptional ? 'Ẩn thuộc tính không bắt buộc' : 'Hiện thuộc tính không bắt buộc'}</span>
            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showOptional && 'rotate-180')} />
          </button>

          {showOptional && (
            <div className="mt-4 bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 text-left grid gap-4 sm:grid-cols-2">
              {optionalFields.map((field) => renderField(field))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
