import { useState } from 'react';
import { Lock, LogIn, Mail, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function SellerLogin({ onSwitchToRegister }) {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log('Seller login:', form);
  };

  return (
    <Card className="mx-auto max-w-md border-0 shadow-elevated">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow">
          <LogIn className="h-7 w-7 text-white" />
        </div>
        <CardTitle>Đăng nhập Seller</CardTitle>
        <p className="text-sm text-gray-500">
          Đăng nhập để quản lý shop và đơn hàng của bạn
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email hoặc Số điện thoại"
            name="identifier"
            placeholder="seller@email.com hoặc 09xxxxxxxx"
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
            />
            <Lock className="pointer-events-none absolute right-3 top-[2.125rem] h-4 w-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="rounded border-gray-300" />
              Ghi nhớ đăng nhập
            </label>
            <button
              type="button"
              className="font-medium text-shopee hover:text-shopee-hover"
            >
              Quên mật khẩu?
            </button>
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Mail className="h-4 w-4" />
            Đăng nhập
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">hoặc</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600">
          Chưa có tài khoản Seller?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="inline-flex items-center gap-1 font-semibold text-shopee hover:text-shopee-hover"
          >
            <Phone className="h-3.5 w-3.5" />
            Đăng ký ngay
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
