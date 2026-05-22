import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function BuyerLoginForm({ onSubmit }) {
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
    onSubmit?.(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <Button type="submit" className="w-full" size="lg">
        <Mail className="h-4 w-4" />
        Đăng nhập
      </Button>
    </form>
  );
}
