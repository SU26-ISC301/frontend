import { useEffect, useRef, useState } from 'react';
import { Camera, ImagePlus, Trash2, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function ShopLogoUpload({ value, onChange, error }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    return () => {
      if (value?.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(value.previewUrl);
      }
    };
  }, [value?.previewUrl]);

  const processFile = (file) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLocalError('Chỉ chấp nhận file ảnh (JPG, PNG, WEBP, GIF)');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setLocalError(`Ảnh tối đa ${MAX_SIZE_MB}MB`);
      return;
    }

    setLocalError('');

    if (value?.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(value.previewUrl);
    }

    onChange({
      file,
      fileName: file.name,
      previewUrl: URL.createObjectURL(file),
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
    e.target.value = '';
  };

  const handleRemove = () => {
    if (value?.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(value.previewUrl);
    }
    onChange(null);
    setLocalError('');
  };

  const displayError = error || localError;

  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Logo Shop
        <span className="ml-1 font-normal text-gray-400">(tùy chọn)</span>
      </label>

      <div
        className={cn(
          'rounded-lg border-2 border-dashed bg-white p-4 transition-colors',
          displayError ? 'border-red-300' : 'border-gray-300 hover:border-shopee/50'
        )}
      >
        {value?.previewUrl ? (
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
            <img
              src={value.previewUrl}
              alt="Xem trước logo shop"
              className="h-24 w-24 shrink-0 rounded-lg border border-gray-200 object-cover shadow-sm"
            />
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="truncate text-sm font-medium text-gray-900">
                {value.fileName}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">Ảnh đã chọn</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleRemove}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Xóa ảnh
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-2 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <ImagePlus className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">
              Tải ảnh từ thiết bị hoặc chụp trực tiếp
            </p>
            <p className="mt-1 text-xs text-gray-400">
              JPG, PNG, WEBP — tối đa {MAX_SIZE_MB}MB
            </p>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Tải ảnh lên
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
            Chụp ảnh
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden
      />

      {displayError && (
        <p className="text-xs text-red-600">{displayError}</p>
      )}
    </div>
  );
}
