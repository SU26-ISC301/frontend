import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Crown,
  Loader2,
  RefreshCw,
  Shield,
  Zap,
} from 'lucide-react';
import { createPaymentLink, checkPaymentStatus } from '../api/subscriptionApi';
import { VENDOR_PLANS } from '../components/Seller/SubscriptionPlanModal';
import { cn } from '../lib/utils';

/* ─── Giá gói ─────────────────────────────────────────────────── */
const PLAN_PRICES = {
  plus: 10000,
  premium: 20000,
};

function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

/* ─── Step 1: Tạo link thanh toán ────────────────────────────── */
function CheckoutStep({ plan, onPaymentCreated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await createPaymentLink(plan.id, 'payos');
      onPaymentCreated(data);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Không thể tạo link thanh toán. Vui lòng thử lại.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [plan.id, onPaymentCreated]);

  // Tự động tạo link khi vào trang
  useEffect(() => {
    handleCreate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const Icon = plan.icon;
  const price = PLAN_PRICES[plan.id] || 0;

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      {/* Plan summary */}
      <div
        className={cn(
          'w-full max-w-sm rounded-2xl border p-6 text-center',
          plan.id === 'plus'
            ? 'border-orange-200 bg-orange-50'
            : 'border-violet-200 bg-violet-50',
        )}
      >
        <div
          className={cn(
            'mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl',
            plan.id === 'plus'
              ? 'bg-orange-100 text-orange-600'
              : 'bg-violet-100 text-violet-600',
          )}
        >
          <Icon className="h-7 w-7" />
        </div>
        <h2
          className={cn(
            'text-2xl font-extrabold',
            plan.id === 'plus' ? 'text-orange-700' : 'text-violet-700',
          )}
        >
          Gói {plan.name}
        </h2>
        <p className="mt-1 text-sm font-semibold text-stone-500">
          {plan.tagline}
        </p>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm font-bold">
          <span className="flex items-center gap-1.5 text-stone-600">
            <Shield className="h-4 w-4" />
            {plan.totalSlots === Infinity
              ? 'Không giới hạn tin'
              : `${plan.totalSlots} tin đăng`}
          </span>
          <span className="flex items-center gap-1.5 text-stone-600">
            <Clock className="h-4 w-4" />
            {plan.displayDays} ngày
          </span>
        </div>
        <div className="mt-5 border-t border-stone-200 pt-4">
          <p className="text-3xl font-extrabold text-stone-900">
            {formatCurrency(price)}
          </p>
          <p className="text-xs font-semibold text-stone-400">
            / {plan.displayDays} ngày
          </p>
        </div>
      </div>

      {error && (
        <div className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
          <Shield className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm font-semibold text-stone-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang tạo link thanh toán...
        </div>
      )}

      {!loading && error && (
        <button
          type="button"
          className="vendor-primary-button"
          onClick={handleCreate}
        >
          <RefreshCw className="h-4 w-4" />
          Thử lại
        </button>
      )}
    </div>
  );
}

/* ─── Step 2: Hiển thị QR + polling ─────────────────────────── */
function PaymentQRStep({ paymentData, onSuccess, onCancel }) {
  const [pollingStatus, setPollingStatus] = useState('pending');
  const [pollCount, setPollCount] = useState(0);
  const [copyToast, setCopyToast] = useState(false);

  // Polling mỗi 4 giây, tối đa 75 lần (~5 phút)
  useEffect(() => {
    if (pollingStatus !== 'pending') return;
    if (pollCount >= 75) {
      setPollingStatus('timeout');
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const status = await checkPaymentStatus(paymentData.orderCode);
        if (status === 'paid') {
          setPollingStatus('paid');
          onSuccess();
        } else if (status === 'cancelled') {
          setPollingStatus('cancelled');
        } else {
          setPollCount((c) => c + 1);
        }
      } catch {
        setPollCount((c) => c + 1);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [pollingStatus, pollCount, paymentData.orderCode, onSuccess]);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(paymentData.amount));
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="w-full max-w-sm rounded-2xl border border-stone-100 bg-white p-6 shadow-lg shadow-stone-950/5">
        <p className="mb-4 text-center text-sm font-bold text-stone-600">
          Quét mã QR bằng app ngân hàng bất kỳ để thanh toán
        </p>

        {/* QR iframe từ PayOS */}
        <div className="flex justify-center">
          <iframe
            src={paymentData.paymentUrl}
            title="PayOS QR"
            className="h-72 w-72 rounded-xl border border-stone-100"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>

        {/* Thông tin */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between rounded-lg bg-stone-50 px-4 py-2.5 text-sm">
            <span className="font-semibold text-stone-500">Số tiền</span>
            <span className="font-extrabold text-stone-900">
              {formatCurrency(paymentData.amount)}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-stone-50 px-4 py-2.5 text-sm">
            <span className="font-semibold text-stone-500">Mã đơn</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-stone-900 text-xs">
                {paymentData.orderCode}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs font-bold text-orange-600 hover:text-orange-700"
              >
                {copyToast ? '✓ Đã sao chép' : 'Sao chép'}
              </button>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {pollingStatus === 'pending' && (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
              <span className="text-xs font-bold text-stone-500">
                Đang chờ xác nhận thanh toán...
              </span>
            </>
          )}
          {pollingStatus === 'paid' && (
            <>
              <CheckCircle2 className="h-4 w-4 text-teal-600" />
              <span className="text-xs font-bold text-teal-600">
                Thanh toán thành công!
              </span>
            </>
          )}
          {pollingStatus === 'cancelled' && (
            <span className="text-xs font-bold text-red-600">
              Đơn thanh toán đã bị huỷ.
            </span>
          )}
          {pollingStatus === 'timeout' && (
            <span className="text-xs font-bold text-amber-600">
              Hết thời gian. Vui lòng thử lại.
            </span>
          )}
        </div>
      </div>

      {/* Nút mở link PayOS trực tiếp */}
      <a
        href={paymentData.paymentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="vendor-primary-button inline-flex"
      >
        Mở trang thanh toán PayOS
        <ArrowLeft className="h-4 w-4 rotate-180" />
      </a>

      <button
        type="button"
        onClick={onCancel}
        className="text-xs font-semibold text-stone-400 hover:text-stone-600"
      >
        Huỷ và quay lại
      </button>
    </div>
  );
}

/* ─── Step 3: Thành công ─────────────────────────────────────── */
function SuccessStep({ planName, navigate }) {
  useEffect(() => {
    const timer = setTimeout(() => navigate('/vendor/san-pham'), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center gap-5 py-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-teal-600">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <div>
        <h2 className="text-2xl font-extrabold text-stone-900">
          Thanh toán thành công! 🎉
        </h2>
        <p className="mt-2 text-sm font-semibold text-stone-500">
          Gói <strong>{planName}</strong> đã được kích hoạt cho shop của bạn.
        </p>
        <p className="mt-1 text-xs text-stone-400">
          Email xác nhận đã được gửi đến hòm thư của bạn.
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs font-semibold text-stone-400">
        <Loader2 className="h-3 w-3 animate-spin" />
        Đang chuyển về trang Sản phẩm...
      </div>
      <button
        type="button"
        onClick={() => navigate('/vendor/san-pham')}
        className="vendor-primary-button"
      >
        Về trang Sản phẩm ngay
      </button>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function VendorSubscriptionCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const planId = searchParams.get('plan') || 'plus';
  const plan = VENDOR_PLANS.find((p) => p.id === planId);

  const [step, setStep] = useState('creating'); // 'creating' | 'qr' | 'success'
  const [paymentData, setPaymentData] = useState(null);

  const handlePaymentCreated = useCallback((data) => {
    setPaymentData(data);
    setStep('qr');
  }, []);

  const handleSuccess = useCallback(() => {
    setStep('success');
  }, []);

  const Icon = plan && plan.id === 'premium' ? Crown : Zap;

  // Nếu plan không hợp lệ
  if (!plan || plan.id === 'free') {
    return (
      <div className="vendor-app flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="font-bold text-stone-600">Gói không hợp lệ.</p>
          <button
            type="button"
            className="vendor-primary-button mt-4"
            onClick={() => navigate('/vendor/san-pham')}
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-app min-h-screen bg-stone-50">
      {/* Header */}
      <header className="vendor-topbar sticky top-0 z-30 flex h-[72px] items-center gap-4 border-b border-stone-100 bg-white/80 px-6 backdrop-blur-md">
        <button
          type="button"
          className="vendor-icon-button"
          onClick={() => navigate(-1)}
          aria-label="Quay lại"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg',
              plan.id === 'plus'
                ? 'bg-orange-100 text-orange-600'
                : 'bg-violet-100 text-violet-600',
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
          <h1 className="text-base font-extrabold text-stone-900">
            Nâng cấp gói {plan.name}
          </h1>
        </div>

        {/* Steps indicator */}
        <div className="ml-auto flex items-center gap-2 text-xs font-bold">
          {['creating', 'qr', 'success'].map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-extrabold',
                  step === s
                    ? 'bg-orange-500 text-white'
                    : ['qr', 'success'].indexOf(step) > i
                    ? 'bg-teal-500 text-white'
                    : 'bg-stone-200 text-stone-500',
                )}
              >
                {['qr', 'success'].indexOf(step) > i ? '✓' : i + 1}
              </span>
              {i < 2 && <span className="text-stone-300">—</span>}
            </div>
          ))}
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-lg px-4 py-8">
        {step === 'creating' && (
          <CheckoutStep
            plan={plan}
            onPaymentCreated={handlePaymentCreated}
          />
        )}
        {step === 'qr' && paymentData && (
          <PaymentQRStep
            paymentData={paymentData}
            onSuccess={handleSuccess}
            onCancel={() => navigate(-1)}
          />
        )}
        {step === 'success' && (
          <SuccessStep planName={plan.name} navigate={navigate} />
        )}
      </main>
    </div>
  );
}
