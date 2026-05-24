import { useState } from 'react';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { authApi } from '../../api/authAPI'; // Import authApi vừa tạo

export function BuyerLoginForm({ onSuccess }) {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError(''); // Xóa lỗi API khi người dùng gõ lại
  };

  const validate = () => {
    const next = {};
    if (!form.identifier.trim()) {
      next.identifier = 'Vui lòng nhập email hoặc số điện thoại';
    }
    if (!form.password) {
      next.password = 'Vui lòng nhập mật khẩu';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Gọi API đăng nhập
      const response = await authApi.login({
        identifier: form.identifier,
        password: form.password
      });

      // Backend trả về accessToken và refreshToken
      const { accessToken, refreshToken } = response.data;

      // Lưu token vào localStorage để dùng cho các request sau
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // // Báo cho component cha biết là đăng nhập thành công để đóng Modal/chuyển trang
      // if (onSuccess) onSuccess(response.data);
      window.location.href = '/';

    } catch (error) {
      // Lấy câu báo lỗi từ backend trả về (nếu có)
      const errorMsg = error.response?.data?.error || 'Đăng nhập thất bại. Vui lòng thử lại!';
      setApiError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Hiển thị lỗi từ API */}
      {apiError && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {apiError}
        </div>
      )}

      <Input
        label="Email hoặc Số điện thoại"
        name="identifier"
        type="text"
        placeholder="example@email.com hoặc 09xxxxxxxx"
        value={form.identifier}
        onChange={handleChange}
        error={errors.identifier}
      />
      <div className="relative">
        <Input
          label="Mật khẩu"
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          className="pr-10"
        />
        <Lock className="pointer-events-none absolute right-3 top-[2.125rem] h-4 w-4 text-gray-400" />
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Mail className="h-4 w-4 mr-2" />
        )}
        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>
    </form>
  );
}