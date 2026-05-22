import { BuyerOtpForm } from '../Auth/BuyerOtpForm';
import { Button } from '../ui/button';

export function SellerRegisterOtpStep({ phone, onVerified, onBack }) {
  return (
    <div className="space-y-4">
      <BuyerOtpForm
        phone={phone}
        onVerify={onVerified}
        onResend={() => console.log('Resend seller OTP to', phone)}
      />
      <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
        ← Quay lại thông tin đăng ký
      </Button>
    </div>
  );
}
