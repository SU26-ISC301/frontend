import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, KeyRound, Loader2, LockKeyhole, MailCheck, ShieldCheck, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getWalletPinErrorMessage, walletPinApi } from '../../api/walletPinAPI';

const PIN_LENGTH = 6;
const WEAK_PINS = new Set(['000000', '111111', '222222', '333333', '444444', '555555', '666666', '777777', '888888', '999999', '123456', '654321']);

function normalizeDigits(value) {
  return String(value || '').replace(/\D/g, '').slice(0, PIN_LENGTH);
}

function validatePin(pin, confirmPin = pin) {
  if (pin.length !== PIN_LENGTH) return 'Mã PIN phải gồm đủ 6 chữ số.';
  if (WEAK_PINS.has(pin)) return 'Mã PIN quá dễ đoán. Vui lòng chọn mã khác.';
  if (pin !== confirmPin) return 'Mã PIN xác nhận không khớp.';
  return '';
}

function PinInput({ value, onChange, label = 'Mã PIN', autoFocus = false }) {
  return (
    <label className="block">
      <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-stone-400">{label}</span>
      <input
        autoFocus={autoFocus}
        inputMode="numeric"
        type="password"
        value={value}
        maxLength={PIN_LENGTH}
        onChange={(event) => onChange(normalizeDigits(event.target.value))}
        className="vendor-input mt-2 h-12 w-full px-4 text-center text-xl font-black tracking-[0.6em] text-stone-900 placeholder:tracking-normal"
        placeholder="••••••"
      />
    </label>
  );
}

export function WalletPinConfirmModal({
  open,
  title = 'Xác thực mã PIN ví',
  description = 'Nhập mã PIN để xác nhận giao dịch sử dụng tiền trong ví.',
  amount,
  submitLabel = 'Xác nhận giao dịch',
  loading = false,
  error = '',
  onClose,
  onConfirm,
  onSetupPin,
}) {
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (open) setPin('');
  }, [open]);

  if (!open) return null;

  const pinError = pin && pin.length < PIN_LENGTH ? 'Nhập đủ 6 chữ số để tiếp tục.' : '';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-stone-950/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[1.4rem] border border-white/70 bg-white shadow-[0_34px_90px_-42px_rgba(15,23,42,0.75)]">
        <div className="relative overflow-hidden bg-[#112820] px-5 py-5 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,107,44,0.35),transparent_18rem),radial-gradient(circle_at_92%_20%,rgba(45,212,191,0.22),transparent_16rem)]" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-orange-200 ring-1 ring-white/15">
                <LockKeyhole className="h-5 w-5" />
              </span>
              <h2 className="mt-3 text-xl font-black tracking-tight">{title}</h2>
              <p className="mt-1 text-sm font-semibold leading-6 text-white/62">{description}</p>
            </div>
            <button type="button" className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white" onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-5">
          {amount != null && (
            <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-orange-700">Số tiền cần xác thực</p>
              <p className="mt-1 text-2xl font-black text-stone-950">{amount}</p>
            </div>
          )}

          <PinInput value={pin} onChange={setPin} autoFocus />

          {(error || pinError) && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error || pinError}</span>
            </div>
          )}

          {onSetupPin && (
            <button type="button" className="text-xs font-extrabold text-orange-600 hover:text-orange-700" onClick={onSetupPin}>
              Chưa có mã PIN? Kích hoạt mã PIN ví
            </button>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" className="vendor-secondary-button" onClick={onClose}>
              Hủy
            </button>
            <button
              type="button"
              className="vendor-primary-button"
              disabled={loading || pin.length !== PIN_LENGTH}
              onClick={() => onConfirm?.(pin)}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WalletPinSetupDialog({
  open,
  mode = 'setup',
  vendorEmail = '',
  onClose,
  onCompleted,
  onToast,
}) {
  const [step, setStep] = useState(mode === 'change' ? 'currentPin' : 'setupOtp');
  const [otp, setOtp] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [currentPinToken, setCurrentPinToken] = useState('');
  const [changeToken, setChangeToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep(mode === 'change' ? 'currentPin' : 'setupOtp');
    setOtp('');
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setSetupToken('');
    setCurrentPinToken('');
    setChangeToken('');
    setError('');
    setOtpSent(false);
  }, [mode, open]);

  const title = mode === 'change' ? 'Thay đổi mã PIN ví' : 'Kích hoạt mã PIN ví';
  const subtitle = mode === 'change'
    ? 'Xác thực mã PIN cũ, OTP email và đặt mã PIN mới để bảo vệ giao dịch.'
    : 'Xác thực OTP email trước khi tạo mã PIN dùng cho giao dịch ví.';

  const stepIndex = useMemo(() => {
    const steps = mode === 'change' ? ['currentPin', 'changeOtp', 'changePin'] : ['setupOtp', 'setupPin'];
    return Math.max(0, steps.indexOf(step));
  }, [mode, step]);

  const requestSetupOtp = async () => {
    setLoading(true);
    setError('');
    try {
      await walletPinApi.requestSetupOtp();
      setOtpSent(true);
      onToast?.({ title: 'Đã gửi OTP', message: 'Vui lòng kiểm tra email để kích hoạt mã PIN ví.' });
    } catch (err) {
      setError(getWalletPinErrorMessage(err, 'Không gửi được OTP kích hoạt PIN.'));
    } finally {
      setLoading(false);
    }
  };

  const verifySetupOtp = async () => {
    if (otp.length !== PIN_LENGTH) {
      setError('Vui lòng nhập đủ 6 số OTP.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await walletPinApi.verifySetupOtp({ otp });
      setSetupToken(data?.pinSetupToken || data?.token || '');
      setStep('setupPin');
    } catch (err) {
      setError(getWalletPinErrorMessage(err, 'OTP không hợp lệ hoặc đã hết hạn.'));
    } finally {
      setLoading(false);
    }
  };

  const confirmSetup = async () => {
    const validation = validatePin(newPin, confirmPin);
    if (validation) {
      setError(validation);
      return;
    }
    setLoading(true);
    setError('');
    try {
      await walletPinApi.confirmSetup({ pinSetupToken: setupToken, newPin, confirmPin });
      onToast?.({ title: 'Đã kích hoạt mã PIN', message: 'Từ giờ các giao dịch dùng ví sẽ cần mã PIN.' });
      onCompleted?.({ enabled: true });
      onClose?.();
    } catch (err) {
      setError(getWalletPinErrorMessage(err, 'Không thể kích hoạt mã PIN ví.'));
    } finally {
      setLoading(false);
    }
  };

  const verifyCurrentPin = async () => {
    if (currentPin.length !== PIN_LENGTH) {
      setError('Vui lòng nhập đủ 6 chữ số mã PIN hiện tại.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await walletPinApi.verifyCurrentPin({ currentPin });
      const token = data?.currentPinToken || data?.token || '';
      setCurrentPinToken(token);
      await walletPinApi.requestChangeOtp({ currentPinToken: token });
      setOtpSent(true);
      setStep('changeOtp');
      onToast?.({ title: 'Đã gửi OTP', message: 'OTP đổi mã PIN đã được gửi về email.' });
    } catch (err) {
      setError(getWalletPinErrorMessage(err, 'Mã PIN hiện tại không đúng.'));
    } finally {
      setLoading(false);
    }
  };

  const verifyChangeOtp = async () => {
    if (otp.length !== PIN_LENGTH) {
      setError('Vui lòng nhập đủ 6 số OTP.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await walletPinApi.verifyChangeOtp({ currentPinToken, otp });
      setChangeToken(data?.pinChangeToken || data?.token || '');
      setStep('changePin');
    } catch (err) {
      setError(getWalletPinErrorMessage(err, 'OTP không hợp lệ hoặc đã hết hạn.'));
    } finally {
      setLoading(false);
    }
  };

  const confirmChange = async () => {
    const validation = validatePin(newPin, confirmPin);
    if (validation) {
      setError(validation);
      return;
    }
    if (newPin === currentPin) {
      setError('Mã PIN mới không được trùng mã PIN cũ.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await walletPinApi.confirmChange({ pinChangeToken: changeToken, newPin, confirmPin });
      onToast?.({ title: 'Đã thay đổi mã PIN', message: 'Mã PIN ví mới đã được cập nhật.' });
      onCompleted?.({ enabled: true });
      onClose?.();
    } catch (err) {
      setError(getWalletPinErrorMessage(err, 'Không thể thay đổi mã PIN ví.'));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const renderAction = () => {
    if (step === 'setupOtp') {
      if (!otpSent) return <button type="button" className="vendor-primary-button w-full justify-center" disabled={loading} onClick={requestSetupOtp}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MailCheck className="h-4 w-4" />} Gửi OTP kích hoạt</button>;
      return <button type="button" className="vendor-primary-button w-full justify-center" disabled={loading || otp.length !== PIN_LENGTH} onClick={verifySetupOtp}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />} Xác thực OTP</button>;
    }
    if (step === 'setupPin') return <button type="button" className="vendor-primary-button w-full justify-center" disabled={loading} onClick={confirmSetup}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Kích hoạt mã PIN</button>;
    if (step === 'currentPin') return <button type="button" className="vendor-primary-button w-full justify-center" disabled={loading || currentPin.length !== PIN_LENGTH} onClick={verifyCurrentPin}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />} Xác thực PIN cũ</button>;
    if (step === 'changeOtp') return <button type="button" className="vendor-primary-button w-full justify-center" disabled={loading || otp.length !== PIN_LENGTH} onClick={verifyChangeOtp}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />} Xác thực OTP</button>;
    return <button type="button" className="vendor-primary-button w-full justify-center" disabled={loading} onClick={confirmChange}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Lưu mã PIN mới</button>;
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-stone-950/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-[1.4rem] border border-white/70 bg-white shadow-[0_34px_90px_-42px_rgba(15,23,42,0.75)]">
        <div className="relative overflow-hidden bg-[#112820] px-5 py-5 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,107,44,0.38),transparent_18rem),radial-gradient(circle_at_92%_18%,rgba(45,212,191,0.22),transparent_16rem)]" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-orange-200 ring-1 ring-white/15">
                <KeyRound className="h-5 w-5" />
              </span>
              <h2 className="mt-3 text-xl font-black tracking-tight">{title}</h2>
              <p className="mt-1 text-sm font-semibold leading-6 text-white/62">{subtitle}</p>
            </div>
            <button type="button" className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white" onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="grid grid-cols-3 gap-2">
            {(mode === 'change' ? ['PIN cũ', 'OTP email', 'PIN mới'] : ['OTP email', 'Tạo PIN']).map((label, index) => (
              <div key={label} className={cn('rounded-2xl border px-3 py-2 text-xs font-extrabold', index <= stepIndex ? 'border-orange-200 bg-orange-50 text-orange-700' : 'border-stone-100 bg-stone-50 text-stone-400')}>
                {label}
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-stone-100 bg-stone-50/70 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-stone-400">Email nhận OTP</p>
            <p className="mt-1 text-sm font-black text-stone-900">{vendorEmail || 'Email trong hồ sơ người bán'}</p>
          </div>

          {step === 'currentPin' && <PinInput label="Mã PIN hiện tại" value={currentPin} onChange={setCurrentPin} autoFocus />}
          {(step === 'setupOtp' || step === 'changeOtp') && otpSent && <PinInput label="Mã OTP email" value={otp} onChange={setOtp} autoFocus />}
          {(step === 'setupOtp' || step === 'changeOtp') && !otpSent && (
            <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4 text-sm font-semibold leading-6 text-orange-800">
              Hệ thống sẽ gửi mã OTP 6 số về email của shop để xác minh trước khi cho phép tạo hoặc đổi mã PIN.
            </div>
          )}
          {(step === 'setupPin' || step === 'changePin') && (
            <div className="grid gap-4">
              <PinInput label="Mã PIN mới" value={newPin} onChange={setNewPin} autoFocus />
              <PinInput label="Xác nhận mã PIN mới" value={confirmPin} onChange={setConfirmPin} />
              <p className="text-xs font-semibold leading-5 text-stone-400">
                Mã PIN gồm 6 chữ số, không nên dùng các chuỗi dễ đoán như 000000 hoặc 123456.
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button type="button" className="vendor-secondary-button justify-center" onClick={onClose}>
              Hủy
            </button>
            {renderAction()}
          </div>
        </div>
      </div>
    </div>
  );
}
