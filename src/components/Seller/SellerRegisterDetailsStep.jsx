import { useEffect, useRef, useState } from 'react';
import {
  Building2,
  Camera,
  CheckCircle2,
  ImagePlus,
  Mail,
  Phone,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';

const MAX_IMAGE_SIZE_MB = 5;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const initialForm = {
  shopName: '',
  shopDescription: '',
  shopEmail: '',
  shopPhone: '',
  category: '',
  phone: '',
};

const categories = [
  'Thời trang',
  'Mỹ phẩm',
  'Điện tử',
  'Gia dụng',
  'Mẹ và bé',
  'Sách và văn phòng phẩm',
  'Thực phẩm',
  'Khác',
];

function IdentityImageUpload({ label, value, onChange, error }) {
  const inputRef = useRef(null);
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

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setLocalError('Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setLocalError(`Ảnh phải dưới ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }

    if (value?.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(value.previewUrl);
    }

    setLocalError('');
    onChange({
      file,
      fileName: file.name,
      previewUrl: URL.createObjectURL(file),
    });
  };

  const handleRemove = () => {
    if (value?.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(value.previewUrl);
    }
    setLocalError('');
    onChange(null);
  };

  const displayError = error || localError;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-brand-dark/80">
        {label} *
      </label>
      <div
        className={cn(
          'rounded-lg border-2 border-dashed bg-white p-4 transition-colors',
          displayError ? 'border-red-300' : 'border-gray-300 hover:border-shopee/50'
        )}
      >
        {value?.previewUrl ? (
          <div className="flex items-center gap-3">
            <img
              src={value.previewUrl}
              alt={label}
              className="h-20 w-28 shrink-0 rounded-lg border border-gray-200 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {value.fileName}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Ảnh đã sẵn sàng gửi
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleRemove}
              aria-label={`Xóa ${label}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            className="flex w-full flex-col items-center py-4 text-center"
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus className="mb-2 h-8 w-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Tải ảnh lên</span>
            <span className="mt-1 text-xs text-gray-400">
              JPG, PNG, WEBP — dưới {MAX_IMAGE_SIZE_MB}MB
            </span>
          </button>
        )}

        {value?.previewUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Chọn ảnh khác
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          processFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      {displayError && <p className="text-xs font-medium text-red-500">{displayError}</p>}
    </div>
  );
}

export function SellerRegisterDetailsStep({ email, onNext, onBack }) {
  const [form, setForm] = useState(initialForm);
  const [cccdFront, setCccdFront] = useState(null);
  const [cccdBack, setCccdBack] = useState(null);
  const [facePhoto, setFacePhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => () => stopCamera(), []);
  useEffect(() => {
    return () => {
      if (facePhoto?.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(facePhoto.previewUrl);
      }
    };
  }, [facePhoto?.previewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const openCamera = async () => {
    setCameraOpen(true);
    setCameraError('');

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API unavailable');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError('Không thể mở camera. Vui lòng cấp quyền camera và thử lại.');
    }
  };

  const closeCamera = () => {
    stopCamera();
    setCameraOpen(false);
  };

  const captureFacePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError('Không thể chụp ảnh. Vui lòng thử lại.');
          return;
        }

        if (blob.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
          setCameraError(`Ảnh khuôn mặt phải dưới ${MAX_IMAGE_SIZE_MB}MB`);
          return;
        }

        const file = new File([blob], `face-verification-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });

        if (facePhoto?.previewUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(facePhoto.previewUrl);
        }

        setFacePhoto({
          file,
          fileName: file.name,
          previewUrl: URL.createObjectURL(file),
        });
        setErrors((prev) => ({ ...prev, facePhoto: '' }));
        closeCamera();
      },
      'image/jpeg',
      0.9
    );
  };

  const removeFacePhoto = () => {
    if (facePhoto?.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(facePhoto.previewUrl);
    }
    setFacePhoto(null);
  };

  const validate = () => {
    const next = {};
    const phone = form.phone.replace(/\s/g, '');
    const shopPhone = form.shopPhone.replace(/\s/g, '');

    if (!form.shopName.trim()) next.shopName = 'Vui lòng nhập tên shop';
    if (!form.shopEmail.trim()) next.shopEmail = 'Vui lòng nhập email shop';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.shopEmail.trim())) {
      next.shopEmail = 'Email shop không hợp lệ';
    }
    if (!/^0\d{9}$/.test(shopPhone)) {
      next.shopPhone = 'SĐT shop phải có 10 chữ số, bắt đầu bằng 0';
    }
    if (!form.category) next.category = 'Vui lòng chọn danh mục bán hàng';
    if (!cccdFront) next.cccdFront = 'Vui lòng upload CCCD mặt trước';
    if (!cccdBack) next.cccdBack = 'Vui lòng upload CCCD mặt sau';
    if (!facePhoto) next.facePhoto = 'Vui lòng xác thực khuôn mặt';
    if (!/^0\d{9}$/.test(phone)) {
      next.phone = 'SĐT chủ shop phải có 10 chữ số, bắt đầu bằng 0';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onNext({
      email,
      shopName: form.shopName.trim(),
      shopDescription: form.shopDescription.trim(),
      shopEmail: form.shopEmail.trim(),
      shopPhone: form.shopPhone.replace(/\s/g, ''),
      category: form.category,
      phone: form.phone.replace(/\s/g, ''),
      cccdFront: cccdFront.file,
      cccdBack: cccdBack.file,
      facePhoto: facePhoto.file,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-slate-700" />
            <h3 className="font-semibold text-gray-900">Thông tin shop</h3>
          </div>
          <div className="space-y-3">
            <Input
              label="Tên shop *"
              name="shopName"
              placeholder="Tên cửa hàng của bạn"
              value={form.shopName}
              onChange={handleChange}
              error={errors.shopName}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Email shop *"
                name="shopEmail"
                type="email"
                placeholder="shop@email.com"
                value={form.shopEmail}
                onChange={handleChange}
                error={errors.shopEmail}
              />
              <Input
                label="SĐT shop *"
                name="shopPhone"
                type="tel"
                inputMode="tel"
                placeholder="09xxxxxxxx"
                value={form.shopPhone}
                onChange={handleChange}
                error={errors.shopPhone}
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="shopDescription"
                className="block text-sm font-semibold text-brand-dark/80"
              >
                Mô tả shop
              </label>
              <textarea
                id="shopDescription"
                name="shopDescription"
                rows={4}
                placeholder="Giới thiệu ngắn về shop, sản phẩm hoặc phong cách phục vụ"
                value={form.shopDescription}
                onChange={handleChange}
                className="input-field min-h-28 resize-y"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="category" className="block text-sm font-semibold text-brand-dark/80">
                Danh mục bán hàng *
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={cn(
                  'input-field',
                  errors.category && 'border-red-400 focus:border-red-500 focus:ring-red-500/15'
                )}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs font-medium text-red-500">{errors.category}</p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-slate-700" />
            <h3 className="font-semibold text-gray-900">Xác thực thông tin chủ shop</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <IdentityImageUpload
              label="CCCD mặt trước"
              value={cccdFront}
              onChange={(value) => {
                setCccdFront(value);
                setErrors((prev) => ({ ...prev, cccdFront: '' }));
              }}
              error={errors.cccdFront}
            />
            <IdentityImageUpload
              label="CCCD mặt sau"
              value={cccdBack}
              onChange={(value) => {
                setCccdBack(value);
                setErrors((prev) => ({ ...prev, cccdBack: '' }));
              }}
              error={errors.cccdBack}
            />
          </div>

          <div className="mt-4 space-y-2">
            <label className="block text-sm font-semibold text-brand-dark/80">
              Xác thực khuôn mặt *
            </label>
            <div
              className={cn(
                'rounded-lg border bg-white p-4',
                errors.facePhoto ? 'border-red-300' : 'border-gray-200'
              )}
            >
              {facePhoto?.previewUrl ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <img
                    src={facePhoto.previewUrl}
                    alt="Ảnh xác thực khuôn mặt"
                    className="h-32 w-full rounded-lg border border-gray-200 object-cover sm:w-44"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{facePhoto.fileName}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      File ảnh sẽ được gửi xuống Backend, dung lượng dưới {MAX_IMAGE_SIZE_MB}MB.
                    </p>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <Button type="button" variant="outline" size="sm" onClick={openCamera}>
                        <RotateCcw className="h-4 w-4" />
                        Chụp lại
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={removeFacePhoto}
                      >
                        <Trash2 className="h-4 w-4" />
                        Xóa ảnh
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4 text-center">
                  <Camera className="mb-2 h-9 w-9 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">Chụp ảnh khuôn mặt</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Ảnh chụp sẽ được tạo thành file JPG dưới {MAX_IMAGE_SIZE_MB}MB
                  </p>
                  <Button type="button" variant="outline" size="sm" className="mt-3" onClick={openCamera}>
                    <Camera className="h-4 w-4" />
                    Mở camera
                  </Button>
                </div>
              )}
            </div>
            {errors.facePhoto && (
              <p className="text-xs font-medium text-red-500">{errors.facePhoto}</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-slate-700" />
            <h3 className="font-semibold text-gray-900">Thông tin chủ shop</h3>
          </div>
          <div className="space-y-3">
            <Input
              label="Email chủ shop"
              name="ownerEmail"
              type="email"
              value={email}
              disabled
              readOnly
              className="cursor-not-allowed bg-gray-100 text-gray-500"
            />
            <Input
              label="Số điện thoại chủ shop *"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="09xxxxxxxx"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                Email đã xác thực từ bước OTP
              </span>
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                SĐT chủ shop dùng để liên hệ khi duyệt hồ sơ
              </span>
            </p>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Quay lại OTP
          </Button>
          <Button type="submit" size="lg" className="sm:min-w-[180px]">
            Đăng Ký
          </Button>
        </div>
      </form>

      {cameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-elevated">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">Xác thực khuôn mặt</h4>
              <Button type="button" variant="ghost" size="icon" onClick={closeCamera} aria-label="Đóng camera">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="overflow-hidden rounded-xl bg-gray-900">
              {cameraError ? (
                <div className="flex min-h-64 items-center justify-center p-6 text-center text-sm text-white">
                  {cameraError}
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-72 w-full object-cover"
                />
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={closeCamera}>
                Hủy
              </Button>
              <Button type="button" onClick={captureFacePhoto} disabled={Boolean(cameraError)}>
                <Camera className="h-4 w-4" />
                Chụp ảnh
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
