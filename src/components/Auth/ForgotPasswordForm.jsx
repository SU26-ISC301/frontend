import { useState } from 'react';
import { CheckCircle2, KeyRound, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { BuyerOtpForm } from './BuyerOtpForm';
import { authApi } from '../../api/authAPI';
import { removeRememberedLogin } from '../../utils/rememberLogin';

const STEPS = {
  EMAIL: 'email',
  OTP: 'otp',
  PASSWORD: 'password',
  SUCCESS: 'success',
};

export function ForgotPasswordForm({ onBackToLogin }) {
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState('');
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getApiMessage = (err) =>
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    'Có lỗi xảy ra. Vui lòng thử lại.';

  const requestOtp = async (event) => {
    event?.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError('Vui lòng nhập email');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authApi.forgotPassword(normalizedEmail);
      setEmail(normalizedEmail);
      setStep(STEPS.OTP);
    } catch (err) {
      setError(getApiMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otp) => {
    setLoading(true);
    setError('');
    try {
      await authApi.verifyForgotPasswordOtp({ email, otp });
      setStep(STEPS.PASSWORD);
    } catch (err) {
      setError(getApiMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    const next = {};
    if (!passwords.password) next.password = 'Vui lòng nhập mật khẩu mới';
    else if (passwords.password.length < 6) next.password = 'Mật khẩu tối thiểu 6 ký tự';
    if (passwords.confirmPassword !== passwords.password) {
      next.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    if (Object.keys(next).length > 0) {
      setError(Object.values(next)[0]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authApi.resetPassword({
        email,
        password: passwords.password,
        confirmPassword: passwords.confirmPassword,
      });
      removeRememberedLogin('buyer', email);
      removeRememberedLogin('vendor', email);
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError(getApiMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  if (step === STEPS.OTP) {
    return (
      <div className="space-y-4">
        <BuyerOtpForm
          target={email}
          fallbackTarget="email của bạn"
          onVerify={verifyOtp}
          onResend={() => requestOtp()}
          submitting={loading}
          externalError={error}
        />
        <button
          type="button"
          className="w-full text-center text-sm text-gray-500 hover:text-gray-800"
          onClick={() => {
            setError('');
            setStep(STEPS.EMAIL);
          }}
        >
          Quay lại nhập email
        </button>
      </div>
    );
  }

  if (step === STEPS.PASSWORD) {
    return (
      <form onSubmit={resetPassword} className="space-y-4">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-shopee-light">
            <KeyRound className="h-6 w-6 text-shopee" />
          </div>
          <p className="text-sm text-gray-600">
            Tạo mật khẩu mới cho <span className="font-semibold text-gray-900">{email}</span>
          </p>
        </div>

        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

        <Input
          label="Mật khẩu mới"
          name="password"
          type="password"
          placeholder="Tối thiểu 6 ký tự"
          value={passwords.password}
          onChange={handlePasswordChange}
        />
        <Input
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          type="password"
          placeholder="Nhập lại mật khẩu mới"
          value={passwords.confirmPassword}
          onChange={handlePasswordChange}
        />
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
        </Button>
      </form>
    );
  }

  if (step === STEPS.SUCCESS) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h3 className="text-xl font-semibold text-gray-900">Đặt lại mật khẩu thành công!</h3>
        <p className="text-sm text-gray-500">Bạn có thể dùng mật khẩu mới để đăng nhập ngay.</p>
        <Button className="w-full" onClick={onBackToLogin}>
          Quay lại đăng nhập
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={requestOtp} className="space-y-4">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-shopee-light">
          <Mail className="h-6 w-6 text-shopee" />
        </div>
        <p className="text-sm text-gray-600">Nhập email tài khoản để nhận mã OTP đặt lại mật khẩu.</p>
      </div>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="example@email.com"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setError('');
        }}
      />
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? 'Đang gửi OTP...' : 'Gửi OTP'}
      </Button>
      <button
        type="button"
        className="w-full text-center text-sm text-gray-500 hover:text-gray-800"
        onClick={onBackToLogin}
      >
        Quay lại đăng nhập
      </button>
    </form>
  );
}
