import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function SellerRegisterPhoneStep({ onNext }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setError('Email không hợp lệ');
      return;
    }

    setSending(true);
    setError('');

    // UI mock: simulate sending OTP to email
    setTimeout(() => {
      setSending(false);
      onNext(normalized);
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-600">
        Nhập email để nhận mã OTP xác thực trước khi tạo hồ sơ shop.
      </p>
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="seller@email.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError('');
        }}
        error={error}
      />
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={sending}
      >
        {sending ? (
          'Đang gửi OTP...'
        ) : (
          <>
            <Send className="h-4 w-4" />
            Gửi OTP
          </>
        )}
      </Button>
      <p className="flex items-center justify-center gap-1 text-xs text-gray-500">
        <Mail className="h-3.5 w-3.5" />
        Email này sẽ dùng để xác thực đăng ký Seller
      </p>
    </form>
  );
}
