import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { StepIndicator } from './StepIndicator';
import { SellerRegisterPhoneStep } from './SellerRegisterPhoneStep';
import { SellerRegisterDetailsStep } from './SellerRegisterDetailsStep';
import { SellerRegisterOtpStep } from './SellerRegisterOtpStep';
import { SellerPendingApproval } from './SellerPendingApproval';

const STEPS = {
  PHONE: 1,
  DETAILS: 2,
  OTP: 3,
};

export function SellerRegister({ onSwitchToLogin }) {
  const [step, setStep] = useState(STEPS.PHONE);
  const [phone, setPhone] = useState('');
  const [registerData, setRegisterData] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handlePhoneNext = (value) => {
    setPhone(value);
    setStep(STEPS.DETAILS);
  };

  const handleDetailsNext = (data) => {
    setRegisterData(data);
    setStep(STEPS.OTP);
  };

  const handleOtpVerified = () => {
    setIsPending(true);
    console.log('Seller register submitted:', registerData);
  };

  const resetToLogin = () => {
    setStep(STEPS.PHONE);
    setPhone('');
    setRegisterData(null);
    setIsPending(false);
    onSwitchToLogin?.();
  };

  if (isPending) {
    return <SellerPendingApproval onBackToLogin={resetToLogin} />;
  }

  return (
    <Card className="mx-auto max-w-2xl shadow-md">
      <CardHeader>
        <CardTitle>Đăng ký Seller</CardTitle>
        <p className="text-sm text-gray-500">
          Hoàn thành 3 bước để mở gian hàng trên sàn
        </p>
      </CardHeader>
      <CardContent>
        <StepIndicator currentStep={step} />

        {step === STEPS.PHONE && (
          <SellerRegisterPhoneStep onNext={handlePhoneNext} />
        )}

        {step === STEPS.DETAILS && (
          <SellerRegisterDetailsStep
            phone={phone}
            onNext={handleDetailsNext}
            onBack={() => setStep(STEPS.PHONE)}
          />
        )}

        {step === STEPS.OTP && (
          <SellerRegisterOtpStep
            phone={phone}
            onVerified={handleOtpVerified}
            onBack={() => setStep(STEPS.DETAILS)}
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
