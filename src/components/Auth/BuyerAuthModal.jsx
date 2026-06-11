import { useState } from 'react';
import { Modal } from '../ui/modal';
import { cn } from '../../lib/utils';
import { BuyerLoginForm } from './BuyerLoginForm';
import { BuyerRegisterForm } from './BuyerRegisterForm';
import { BuyerOtpForm } from './BuyerOtpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { Button } from '../ui/button';
import { CheckCircle2 } from 'lucide-react';
import { authApi } from '../../api/authAPI';

const VIEWS = {
  LOGIN: 'login',
  REGISTER: 'register',
  OTP: 'otp',
  SUCCESS: 'success',
  FORGOT_PASSWORD: 'forgot-password',
};

export function BuyerAuthModal({ open, onClose, onAuthenticated }) {
  const [view, setView] = useState(VIEWS.LOGIN);
  const [registerData, setRegisterData] = useState(null);
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const handleClose = () => {
    onClose();
    setView(VIEWS.LOGIN);
    setRegisterData(null);
    setOtpError('');
    setOtpLoading(false);
  };

  const titles = {
    [VIEWS.LOGIN]: 'Đăng nhập',
    [VIEWS.REGISTER]: 'Đăng ký tài khoản',
    [VIEWS.OTP]: 'Xác thực OTP',
    [VIEWS.SUCCESS]: 'Đăng ký thành công',
    [VIEWS.FORGOT_PASSWORD]: 'Quên mật khẩu',
  };

  const getApiMessage = (error) =>
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    'Có lỗi xảy ra. Vui lòng thử lại.';

  const handleRegisterRequested = (payload) => {
    setRegisterData(payload);
    setOtpError('');
    setView(VIEWS.OTP);
  };

  const handleVerifyOtp = async (otp) => {
    if (!registerData?.email) return;

    setOtpLoading(true);
    setOtpError('');
    try {
      await authApi.verifyRegister({
        email: registerData.email,
        otp,
      });
      setView(VIEWS.SUCCESS);
    } catch (error) {
      setOtpError(getApiMessage(error));
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!registerData) return;

    setOtpLoading(true);
    setOtpError('');
    try {
      await authApi.register(registerData);
    } catch (error) {
      setOtpError(getApiMessage(error));
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title={titles[view]}>
      <div className="px-6 pb-6">
        {view !== VIEWS.OTP && view !== VIEWS.SUCCESS && view !== VIEWS.FORGOT_PASSWORD && (
          <div className="mb-6 flex rounded-2xl bg-gray-100/80 p-1">
            <button
              type="button"
              className={cn(
                'flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all',
                view === VIEWS.LOGIN
                  ? 'bg-white text-brand-primary shadow-sm'
                  : 'text-brand-muted hover:text-brand-dark'
              )}
              onClick={() => setView(VIEWS.LOGIN)}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              className={cn(
                'flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all',
                view === VIEWS.REGISTER
                  ? 'bg-gradient-brand text-white shadow-glow'
                  : 'text-brand-muted hover:text-brand-dark'
              )}
              onClick={() => setView(VIEWS.REGISTER)}
            >
              Đăng ký
            </button>
          </div>
        )}

        {view === VIEWS.LOGIN && (
          <>
            {/* 1. ĐỔI onSubmit THÀNH onSuccess VÀ ĐÓNG MODAL KHI ĐĂNG NHẬP XONG */}
            <BuyerLoginForm
              onSuccess={(data) => {
                onAuthenticated?.(data);
                handleClose();
              }}
              onForgotPassword={() => setView(VIEWS.FORGOT_PASSWORD)}
            />
            <p className="mt-4 text-center text-sm text-gray-500">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                className="font-medium text-shopee hover:text-shopee-hover"
                onClick={() => setView(VIEWS.REGISTER)}
              >
                Đăng ký ngay
              </button>
            </p>
          </>
        )}

        {view === VIEWS.REGISTER && (
          <>
            {/* 2. TRUYỀN HÀM CHUYỂN TAB VÀO ĐÂY ĐỂ NÚT BẤM BÊN TRONG HOẠT ĐỘNG */}
            <BuyerRegisterForm
              onSuccess={handleRegisterRequested}
              onSwitchToLogin={() => setView(VIEWS.LOGIN)}
            />
            <p className="mt-4 text-center text-sm text-gray-500">
              Đã có tài khoản?{' '}
              <button
                type="button"
                className="font-medium text-shopee hover:text-shopee-hover"
                onClick={() => setView(VIEWS.LOGIN)}
              >
                Đăng nhập
              </button>
            </p>
          </>
        )}

        {view === VIEWS.OTP && (
          <>
            <BuyerOtpForm
              target={registerData?.email}
              phone={registerData?.phone}
              fallbackTarget="email của bạn"
              onVerify={handleVerifyOtp}
              onResend={handleResendOtp}
              submitting={otpLoading}
              externalError={otpError}
            />
            <button
              type="button"
              className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-800"
              onClick={() => setView(VIEWS.REGISTER)}
            >
              ← Quay lại đăng ký
            </button>
          </>
        )}

        {view === VIEWS.SUCCESS && (
          <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h3 className="text-xl font-semibold text-gray-900">Đăng ký thành công!</h3>
            <p className="mb-4 text-sm text-gray-500">
              Tài khoản của bạn đã xác thực OTP thành công. Vui lòng quay lại đăng nhập.
            </p>
            <Button
              className="w-full"
              onClick={() => {
                setRegisterData(null);
                setOtpError('');
                setView(VIEWS.LOGIN);
              }}
            >
              Quay lại đăng nhập
            </Button>
          </div>
        )}

        {view === VIEWS.FORGOT_PASSWORD && (
          <ForgotPasswordForm onBackToLogin={() => setView(VIEWS.LOGIN)} />
        )}
      </div>
    </Modal>
  );
}
