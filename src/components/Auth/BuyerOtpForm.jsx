import { useRef, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const OTP_LENGTH = 6;

export function BuyerOtpForm({ phone, onVerify, onResend }) {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const inputsRef = useRef([]);

  const focusInput = (index) => {
    inputsRef.current[index]?.focus();
  };

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError('');

    if (value && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;

    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((char, i) => {
      next[i] = char;
    });
    setDigits(next);
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length !== OTP_LENGTH) {
      setError('Vui lòng nhập đủ 6 số OTP');
      return;
    }
    onVerify?.(code);
  };

  const maskedPhone = phone
    ? `${phone.slice(0, 3)}***${phone.slice(-2)}`
    : 'số điện thoại của bạn';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-shopee-light">
          <ShieldCheck className="h-6 w-6 text-shopee" />
        </div>
        <p className="text-sm text-gray-600">
          Nhập mã OTP 6 số đã gửi đến{' '}
          <span className="font-medium text-gray-900">{maskedPhone}</span>
        </p>
      </div>

      <div className="flex justify-center gap-2 sm:gap-3">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className={cn(
              'h-11 w-10 rounded-lg border border-gray-300 text-center text-lg font-semibold sm:h-12 sm:w-11',
              'focus:border-shopee focus:outline-none focus:ring-2 focus:ring-shopee/20',
              error && 'border-red-500'
            )}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-xs text-red-600">{error}</p>
      )}

      <Button type="submit" className="w-full" size="lg">
        Xác thực OTP
      </Button>

      <p className="text-center text-sm text-gray-500">
        Chưa nhận được mã?{' '}
        <button
          type="button"
          className="font-medium text-shopee hover:text-shopee-hover"
          onClick={onResend}
        >
          Gửi lại
        </button>
      </p>
    </form>
  );
}
