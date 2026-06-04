import { useRef, useState } from 'react';
import { Upload, Trash2, Plus, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

const MAX_IMAGE_SIZE_MB = 10;
const MAX_IMAGES = 9;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * ProductImageUploadV3
 * Layout: 1 ô ảnh chính lớn (col-span 2×2) + 8 ô ảnh phụ nhỏ (4×2)
 * Sequential lock: chỉ được upload ô N sau khi ô N-1 đã có ảnh
 */
export function ProductImageUploadV3({ value = [], onChange, error }) {
  const [activeSlot, setActiveSlot] = useState(null);
  const hiddenInputRef = useRef(null);

  // Kiểm tra ô index có được phép upload chưa (tuần tự)
  const isSlotEnabled = (index) => {
    if (index === 0) return true;
    return !!value[index - 1];
  };

  const processAndInsert = (file, slotIndex) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      alert('Chỉ chấp nhận định dạng JPG, PNG, WebP');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`File quá lớn. Tối đa ${MAX_IMAGE_SIZE_MB}MB mỗi ảnh`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImages = [...value];
      newImages[slotIndex] = { file, preview: e.target.result, name: file.name };
      onChange(newImages);
    };
    reader.readAsDataURL(file);
  };

  const handleSlotClick = (slotIndex) => {
    if (!isSlotEnabled(slotIndex)) return;
    setActiveSlot(slotIndex);
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = '';
      hiddenInputRef.current.click();
    }
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file || activeSlot === null) return;
    processAndInsert(file, activeSlot);
    setActiveSlot(null);
  };

  const handleRemove = (e, slotIndex) => {
    e.stopPropagation();
    // Xóa ảnh và shift các ảnh phía sau lên
    const newImages = value.filter((_, i) => i !== slotIndex);
    onChange(newImages);
  };

  // ===== Render ô ảnh chính (slot 0) =====
  const renderMainSlot = () => {
    const image = value[0] || null;
    return (
      <div
        style={{ gridColumn: 'span 2', gridRow: 'span 2' }}
        onClick={() => handleSlotClick(0)}
        className={cn(
          'relative rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer select-none border-2',
          image
            ? 'border-orange-500/20 shadow-md hover:shadow-lg hover:border-orange-500/40'
            : 'border-dashed border-orange-300/70 bg-gradient-to-br from-orange-50/50 via-white to-amber-50/30 hover:border-orange-500 hover:bg-orange-50/20 hover:shadow-md hover:shadow-orange-500/5'
        )}
      >
        {image ? (
          <>
            <img
              src={image.preview}
              alt="Ảnh chính"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay khi hover */}
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px] transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSlotClick(0);
                  }}
                  className="bg-white text-slate-800 hover:text-orange-600 hover:bg-orange-50 rounded-full p-3 shadow-lg hover:shadow-orange-500/10 transition duration-200 active:scale-90"
                  title="Thay ảnh"
                >
                  <Upload className="h-4.5 w-4.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, 0)}
                  className="bg-white text-red-500 hover:text-white hover:bg-red-500 rounded-full p-3 shadow-lg hover:shadow-red-500/20 transition duration-200 active:scale-90"
                  title="Xóa ảnh"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
            <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-[0_2px_8px_rgba(234,88,12,0.3)]">
              ★ Ảnh chính
            </span>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-6 px-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-[0_6px_16px_rgba(234,88,12,0.25)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-slate-700 group-hover:text-orange-600 transition-colors">Tải lên ảnh bìa sản phẩm</p>
              <p className="text-[10px] font-extrabold text-orange-500 mt-1 uppercase tracking-wider bg-orange-100/60 px-2 py-0.5 rounded-full inline-block">Bắt buộc</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ===== Render ô ảnh phụ (slot 1–8) =====
  const renderSubSlot = (slotIndex) => {
    const image = value[slotIndex] || null;
    const enabled = isSlotEnabled(slotIndex);

    return (
      <div
        key={slotIndex}
        style={{ aspectRatio: '1 / 1' }}
        onClick={() => enabled && handleSlotClick(slotIndex)}
        className={cn(
          'relative rounded-2xl overflow-hidden transition-all duration-300 group select-none border',
          image
            ? 'border-orange-500/20 shadow-sm hover:shadow-md hover:border-orange-500/40 cursor-pointer'
            : cn(
                'border-dashed',
                enabled
                  ? 'border-slate-350 bg-gradient-to-br from-slate-50/50 to-orange-50/10 hover:border-orange-400 hover:bg-orange-50/20 hover:shadow-sm cursor-pointer'
                  : 'border-slate-200 bg-slate-100/40 cursor-not-allowed opacity-60'
              )
        )}
      >
        {image ? (
          <>
            <img
              src={image.preview}
              alt={`Ảnh ${slotIndex}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={(e) => handleRemove(e, slotIndex)}
                className="bg-white text-red-500 hover:text-white hover:bg-red-500 rounded-full p-2.5 shadow-lg hover:shadow-red-500/20 transition duration-200 active:scale-90"
                title="Xóa ảnh"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <span className="absolute bottom-2 right-2.5 text-[10px] font-bold text-white bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
              {slotIndex + 1}
            </span>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full relative">
            <span className={cn(
              'absolute top-2 right-2.5 text-[9px] font-mono font-black',
              enabled ? 'text-slate-400/80' : 'text-slate-300'
            )}>
              {String(slotIndex + 1).padStart(2, '0')}
            </span>

            {enabled ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-orange-100 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <Plus className="h-4 w-4 text-slate-500 group-hover:text-orange-600 transition-colors" />
              </div>
            ) : (
              <Lock className="h-3.5 w-3.5 text-slate-300" />
            )}
          </div>
        )}
      </div>
    );
  };

  const uploadedCount = value.filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Hướng dẫn */}
      <p className="text-[11px] font-semibold text-stone-400 leading-relaxed">
        Tải ảnh theo thứ tự từ trái sang phải. Cần tải ảnh chính trước, sau đó mới đến ô tiếp theo. Nên thêm ít nhất 5 ảnh để hiển thị sản phẩm đầy đủ.
      </p>

      {/* Grid: repeat(5, 1fr) — ô chính span 2×2, 8 ô phụ còn lại */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '8px',
        }}
      >
        {renderMainSlot()}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => renderSubSlot(i))}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs font-bold text-red-600 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}

      {/* Counter + hint */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-stone-400">
          JPG · PNG · WebP · Tối đa {MAX_IMAGE_SIZE_MB}MB/ảnh
        </p>
        <span
          className={cn(
            'text-[11px] font-extrabold px-2 py-0.5 rounded-full',
            uploadedCount >= 5
              ? 'bg-green-50 text-green-700'
              : 'bg-stone-100 text-stone-500'
          )}
        >
          {uploadedCount}/{MAX_IMAGES} ảnh
        </span>
      </div>

      {/* Hidden file input dùng chung cho tất cả ô */}
      <input
        ref={hiddenInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        className="hidden"
        onChange={handleFileSelected}
        aria-hidden
      />
    </div>
  );
}
