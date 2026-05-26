import { BuyerOtpForm } from '../Auth/BuyerOtpForm';
import { Button } from '../ui/button';

export function SellerRegisterOtpStep({ email, onVerified, onBack }) {
  return (
    <div className="space-y-4">
      <BuyerOtpForm
        target={email}
        fallbackTarget="email của bạn"
        onVerify={onVerified}
        onResend={() => console.log('Resend seller OTP to', email)}
      />
      <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
        ← Quay lại nhập email
      </Button>
    </div>
  );
}
