import { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DateInput } from '../ui/date-input';
import { authApi } from '../../api/authAPI';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  birthDate: '',
  password: '',
  confirmPassword: '',
};

export function BuyerRegisterForm({ onSuccess, onSwitchToLogin }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Vui lòng nhập họ tên';
    if (!form.email.trim()) next.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Email không hợp lệ';
    }
    if (!form.phone.trim()) next.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^0\d{9}$/.test(form.phone.replace(/\s/g, ''))) {
      next.phone = 'Số điện thoại phải có 10 chữ số, bắt đầu bằng 0';
    }
    if (!form.birthDate) next.birthDate = 'Vui lòng chọn ngày sinh';
    if (!form.password) next.password = 'Vui lòng nhập mật khẩu';
    else if (form.password.length < 6) {
      next.password = 'Mật khẩu tối thiểu 6 ký tự';
    }
    if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        dateOfBirth: form.birthDate,
        password: form.password
      };

      await authApi.register(payload);

      // KHI ĐĂNG KÝ THÀNH CÔNG: Xóa form và Bật cờ success
      setForm(initialForm);
      setIsSuccess(true);

    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Đăng ký thất bại. Vui lòng thử lại!';
      setApiError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <h3 className="text-xl font-semibold text-gray-900">Đăng ký thành công!</h3>
        <p className="text-sm text-gray-500 mb-4">
          Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để trải nghiệm.
        </p>
        <Button
          className="w-full"
          onClick={() => {
            // Gọi hàm của Modal (truyền từ component cha) để chuyển sang tab đăng nhập
            if (onSwitchToLogin) onSwitchToLogin();
          }}
        >
          Đăng Nhập Ngay
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {apiError && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {apiError}
        </div>
      )}

      <Input
        label="Họ và tên"
        name="fullName"
        placeholder="Nguyễn Văn A"
        value={form.fullName}
        onChange={handleChange}
        error={errors.fullName}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="example@email.com"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Input
        label="Số điện thoại"
        name="phone"
        type="tel"
        placeholder="09xxxxxxxx"
        value={form.phone}
        onChange={handleChange}
        error={errors.phone}
      />
      <DateInput
        label="Ngày sinh"
        name="birthDate"
        value={form.birthDate}
        onChange={handleChange}
        error={errors.birthDate}
        max={new Date().toISOString().split('T')[0]}
        min="1900-01-01"
      />
      <Input
        label="Mật khẩu"
        name="password"
        type="password"
        placeholder="Tối thiểu 6 ký tự"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
      />
      <Input
        label="Xác nhận mật khẩu"
        name="confirmPassword"
        type="password"
        placeholder="Nhập lại mật khẩu"
        value={form.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />
      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Send className="h-4 w-4 mr-2" />
        )}
        {isLoading ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
      </Button>
    </form>
  );
}
