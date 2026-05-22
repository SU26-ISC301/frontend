import { useState } from 'react';
import { Building2, CreditCard, FileText, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const initialForm = {
  fullName: '',
  cccd: '',
  taxCode: '',
  birthDate: '',
  password: '',
  confirmPassword: '',
  shopName: '',
  shopEmail: '',
  shopDescription: '',
  shopLogoUrl: '',
};

export function SellerRegisterDetailsStep({ phone, onNext, onBack }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Vui lòng nhập họ tên';
    if (!form.cccd.trim()) next.cccd = 'Vui lòng nhập số CCCD';
    else if (!/^\d{12}$/.test(form.cccd.replace(/\s/g, ''))) {
      next.cccd = 'CCCD phải gồm đúng 12 chữ số';
    }
    if (!form.taxCode.trim()) next.taxCode = 'Vui lòng nhập mã số thuế';
    else if (!/^\d{10}(-\d{3})?$/.test(form.taxCode.replace(/\s/g, ''))) {
      next.taxCode = 'Mã số thuế không hợp lệ (10 số hoặc 10-3)';
    }
    if (!form.birthDate) next.birthDate = 'Vui lòng chọn ngày sinh';
    if (!form.password) next.password = 'Vui lòng nhập mật khẩu';
    else if (form.password.length < 6) {
      next.password = 'Mật khẩu tối thiểu 6 ký tự';
    }
    if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    if (!form.shopName.trim()) next.shopName = 'Vui lòng nhập tên shop';
    if (!form.shopEmail.trim()) next.shopEmail = 'Vui lòng nhập email shop';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.shopEmail)) {
      next.shopEmail = 'Email không hợp lệ';
    }
    if (!form.shopDescription.trim()) {
      next.shopDescription = 'Vui lòng nhập mô tả shop';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onNext({ phone, ...form });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Phần 1: Cá nhân */}
      <section className="rounded-lg border border-gray-200 bg-gray-50/80 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-slate-700" />
          <h3 className="font-semibold text-gray-900">Thông tin cá nhân</h3>
        </div>
        <div className="space-y-3">
          <Input
            label="Họ và tên *"
            name="fullName"
            placeholder="Nguyễn Văn A"
            value={form.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />
          <Input
            label="Số CCCD *"
            name="cccd"
            inputMode="numeric"
            placeholder="001234567890"
            maxLength={12}
            value={form.cccd}
            onChange={handleChange}
            error={errors.cccd}
          />
          <Input
            label="Mã số thuế *"
            name="taxCode"
            placeholder="0123456789 hoặc 0123456789-001"
            value={form.taxCode}
            onChange={handleChange}
            error={errors.taxCode}
          />
          <p className="flex items-center gap-3 text-xs text-gray-500">
            <CreditCard className="h-3.5 w-3.5 shrink-0" />
            CCCD gồm 12 chữ số
            <span className="text-gray-300">|</span>
            <FileText className="h-3.5 w-3.5 shrink-0" />
            MST: 10 số hoặc 10-3 (chi nhánh)
          </p>
          <Input
            label="Ngày sinh *"
            name="birthDate"
            type="date"
            value={form.birthDate}
            onChange={handleChange}
            error={errors.birthDate}
          />
          <Input
            label="Mật khẩu *"
            name="password"
            type="password"
            placeholder="Tối thiểu 6 ký tự"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Input
            label="Xác nhận mật khẩu *"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
        </div>
      </section>

      {/* Phần 2: Shop */}
      <section className="rounded-lg border border-gray-200 bg-gray-50/80 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-slate-700" />
          <h3 className="font-semibold text-gray-900">Thông tin Shop</h3>
        </div>
        <div className="space-y-3">
          <Input
            label="Tên Shop *"
            name="shopName"
            placeholder="Tên cửa hàng của bạn"
            value={form.shopName}
            onChange={handleChange}
            error={errors.shopName}
          />
          <Input
            label="Email Shop *"
            name="shopEmail"
            type="email"
            placeholder="shop@email.com"
            value={form.shopEmail}
            onChange={handleChange}
            error={errors.shopEmail}
          />
          <div className="w-full space-y-1.5">
            <label
              htmlFor="shopDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Mô tả Shop *
            </label>
            <textarea
              id="shopDescription"
              name="shopDescription"
              rows={3}
              placeholder="Giới thiệu ngắn về cửa hàng..."
              value={form.shopDescription}
              onChange={handleChange}
              className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-shopee focus:outline-none focus:ring-2 focus:ring-shopee/20"
            />
            {errors.shopDescription && (
              <p className="text-xs text-red-600">{errors.shopDescription}</p>
            )}
          </div>
          <Input
            label="Logo URL"
            name="shopLogoUrl"
            type="url"
            placeholder="https://example.com/logo.png"
            value={form.shopLogoUrl}
            onChange={handleChange}
            error={errors.shopLogoUrl}
          />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Quay lại
        </Button>
        <Button type="submit" size="lg" className="sm:min-w-[160px]">
          Tiếp tục — Gửi OTP
        </Button>
      </div>
    </form>
  );
}
