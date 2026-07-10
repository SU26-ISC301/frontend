import { useState } from 'react';
import { CheckCircle2, Lock } from 'lucide-react';
import { BuyerOtpForm } from '../Auth/BuyerOtpForm';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { sellerApi } from '../../api/sellerAPI';

export function SellerRegisterOtpStep({
  email,
  initialVerification,
  initialCredentials,
  onVerified,
  onBack,
  onContinue,
}) {
  const [verification, setVerification] = useState(initialVerification || null);
  const [passwords, setPasswords] = useState({
    password: initialCredentials?.password || '',
    confirmPassword: initialCredentials?.confirmPassword || '',
  });
  const [errors, setErrors] = useState({});
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const getApiMessage = (err) =>
    err?.response?.data?.message || err?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';

  const handleVerify = async (otp) => {
    setVerifying(true);
    setErrors({});

    try {
      const data = await sellerApi.verifyOtp({ email, otp });
      if (data.alreadyRegisteredVendor) {
        setErrors({ otp: 'Tài khoản này đã đăng ký shop trước đó.' });
        return;
      }
      setVerification(data);
      onVerified?.(data);
    } catch (err) {
      setErrors({ otp: getApiMessage(err) });
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setErrors({});
    try {
      await sellerApi.startRegister(email);
    } catch (err) {
      setErrors({ otp: getApiMessage(err) });
    } finally {
      setResending(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleContinue = () => {
    if (verification?.requiresPassword) {
      const next = {};
      if (passwords.password.length < 6) {
        next.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      }
      if (passwords.confirmPassword !== passwords.password) {
        next.confirmPassword = 'Mật khẩu xác nhận không khớp';
      }
      setErrors(next);
      if (Object.keys(next).length > 0) return;
    }

    onContinue?.({
      verification,
      password: verification?.requiresPassword ? passwords.password : '',
      confirmPassword: verification?.requiresPassword ? passwords.confirmPassword : '',
    });
  };

  if (verification) {
    return (
      <div className="seller-register-form space-y-5">
        {verification.requiresPassword ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Lock className="h-4 w-4 text-slate-700" />
              Tạo mật khẩu cho tài khoản người bán
            </div>
            <Input
              label="Mật khẩu *"
              name="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={passwords.password}
              onChange={handlePasswordChange}
              error={errors.password}
            />
            <Input
              label="Xác nhận mật khẩu *"
              name="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              error={errors.confirmPassword}
            />
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <span className="inline-flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              Bạn đã có tài khoản người dùng vì vậy sẽ được dùng chung mật khẩu, vui lòng ấn tiếp tục
            </span>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Quay lại nhập email
          </Button>
          <Button type="button" size="lg" className="sm:min-w-[180px]" onClick={handleContinue}>
            Tiếp tục
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-register-form space-y-4">
      <BuyerOtpForm
        target={email}
        fallbackTarget="email của bạn"
        onVerify={handleVerify}
        onResend={handleResend}
        submitting={verifying || resending}
        externalError={errors.otp}
      />
      <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
        ← Quay lại nhập email
      </Button>
    </div>
  );
}
