import { useState } from 'react';
import { Phone, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function SellerRegisterPhoneStep({ onNext }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalized = phone.replace(/\s/g, '');

    if (!/^0\d{9}$/.test(normalized)) {
      setError('Số điện thoại phải có 10 chữ số, bắt đầu bằng 0');
      return;
    }

    setChecking(true);
    setError('');

    // UI mock: simulate phone check
    setTimeout(() => {
      setChecking(false);
      onNext(normalized);
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-600">
        Nhập số điện thoại để kiểm tra tài khoản Seller đã tồn tại hay chưa.
      </p>
      <Input
        label="Số điện thoại"
        name="phone"
        type="tel"
        placeholder="09xxxxxxxx"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          setError('');
        }}
        error={error}
      />
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={checking}
      >
        {checking ? (
          'Đang kiểm tra...'
        ) : (
          <>
            <Search className="h-4 w-4" />
            Kiểm tra số điện thoại
          </>
        )}
      </Button>
      <p className="flex items-center justify-center gap-1 text-xs text-gray-500">
        <Phone className="h-3.5 w-3.5" />
        Số điện thoại sẽ dùng để đăng nhập và nhận OTP
      </p>
    </form>
  );
}
