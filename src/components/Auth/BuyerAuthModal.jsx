import { useState } from 'react';
import { Modal } from '../ui/modal';
import { cn } from '../../lib/utils';
import { BuyerLoginForm } from './BuyerLoginForm';
import { BuyerRegisterForm } from './BuyerRegisterForm';
import { BuyerOtpForm } from './BuyerOtpForm';

const VIEWS = {
  LOGIN: 'login',
  REGISTER: 'register',
  OTP: 'otp',
};

export function BuyerAuthModal({ open, onClose }) {
  const [view, setView] = useState(VIEWS.LOGIN);
  const [registerData, setRegisterData] = useState(null);

  const handleClose = () => {
    onClose();
    setView(VIEWS.LOGIN);
    setRegisterData(null);
  };

  const handleSendOtp = (data) => {
    setRegisterData(data);
    setView(VIEWS.OTP);
  };

  const titles = {
    [VIEWS.LOGIN]: 'Đăng nhập',
    [VIEWS.REGISTER]: 'Đăng ký tài khoản',
    [VIEWS.OTP]: 'Xác thực OTP',
  };

  return (
    <Modal open={open} onClose={handleClose} title={titles[view]}>
      <div className="px-6 pb-6">
        {view !== VIEWS.OTP && (
          <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              className={cn(
                'flex-1 rounded-md py-2 text-sm font-medium transition-colors',
                view === VIEWS.LOGIN
                  ? 'bg-white text-shopee shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
              onClick={() => setView(VIEWS.LOGIN)}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              className={cn(
                'flex-1 rounded-md py-2 text-sm font-medium transition-colors',
                view === VIEWS.REGISTER
                  ? 'bg-white text-shopee shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
              onClick={() => setView(VIEWS.REGISTER)}
            >
              Đăng ký
            </button>
          </div>
        )}

        {view === VIEWS.LOGIN && (
          <>
            <BuyerLoginForm
              onSubmit={(data) => {
                console.log('Buyer login:', data);
                handleClose();
              }}
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
            <BuyerRegisterForm onSendOtp={handleSendOtp} />
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
              phone={registerData?.phone}
              onVerify={(code) => {
                console.log('Buyer OTP verify:', { ...registerData, otp: code });
                handleClose();
              }}
              onResend={() => console.log('Resend OTP to', registerData?.phone)}
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
      </div>
    </Modal>
  );
}
