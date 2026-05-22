import { useState } from 'react';
import { Send, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  birthDate: '',
  password: '',
  confirmPassword: '',
};

export function BuyerRegisterForm({ onSendOtp }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSendOtp?.(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
      <Input
        label="Ngày sinh"
        name="birthDate"
        type="date"
        value={form.birthDate}
        onChange={handleChange}
        error={errors.birthDate}
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
      <Button type="submit" className="w-full" size="lg">
        <Send className="h-4 w-4" />
        Gửi mã OTP
      </Button>
      <p className="flex items-center justify-center gap-1 text-xs text-gray-500">
        <User className="h-3.5 w-3.5" />
        Mã OTP sẽ được gửi đến số điện thoại của bạn
      </p>
    </form>
  );
}
