import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { StepIndicator } from './StepIndicator';
import { SellerRegisterPhoneStep } from './SellerRegisterPhoneStep';
import { SellerRegisterDetailsStep } from './SellerRegisterDetailsStep';
import { SellerRegisterOtpStep } from './SellerRegisterOtpStep';
import { SellerPendingApproval } from './SellerPendingApproval';

const STEPS = {
  EMAIL: 1,
  OTP: 2,
  DETAILS: 3,
};

export function SellerRegister({ onSwitchToLogin }) {
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleEmailNext = (value) => {
    setEmail(value);
    setStep(STEPS.OTP);
  };

  const handleDetailsNext = (data) => {
    setIsPending(true);
    console.log('Seller register submitted:', data);
  };

  const resetToLogin = () => {
    setStep(STEPS.EMAIL);
    setEmail('');
    setIsPending(false);
    onSwitchToLogin?.();
  };

  if (isPending) {
    return <SellerPendingApproval onBackToLogin={resetToLogin} />;
  }

  return (
    <Card className="mx-auto max-w-2xl border-0 shadow-elevated">
      <CardHeader>
        <CardTitle>Đăng ký Seller</CardTitle>
        <p className="text-sm text-gray-500">
          Xác thực email, sau đó hoàn tất hồ sơ mở gian hàng
        </p>
      </CardHeader>
      <CardContent>
        <StepIndicator currentStep={step} />

        {step === STEPS.EMAIL && (
          <SellerRegisterPhoneStep onNext={handleEmailNext} />
        )}

        {step === STEPS.OTP && (
          <SellerRegisterOtpStep
            email={email}
            onVerified={() => setStep(STEPS.DETAILS)}
            onBack={() => setStep(STEPS.EMAIL)}
          />
        )}

        {step === STEPS.DETAILS && (
          <SellerRegisterDetailsStep
            email={email}
            onNext={handleDetailsNext}
            onBack={() => setStep(STEPS.OTP)}
          />
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-shopee hover:text-shopee-hover"
          >
            Đăng nhập
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
