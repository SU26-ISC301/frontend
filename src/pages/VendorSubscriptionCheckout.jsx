import { useState, useEffect, useCallback, useRef } from 'react';
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
  Lock,
  Check,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { createPaymentLink, checkPaymentStatus, getSubscriptionStatus } from '../api/subscriptionApi';
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
        'Không thể kết nối tới cổng thanh toán. Vui lòng kiểm tra lại.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [plan.id, onPaymentCreated]);

  // Tự động tạo link khi vào trang
  useEffect(() => {
    handleCreate();
  }, [handleCreate]);

  const Icon = plan.icon;
  const price = PLAN_PRICES[plan.id] || 0;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 max-w-md mx-auto">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-orange-500/10 blur-[80px] pointer-events-none" />

      {/* Plan Card */}
      <div className="relative w-full rounded-3xl border border-stone-200/80 bg-white p-8 text-center shadow-xl shadow-stone-200/40 overflow-hidden">
        {/* Top Glow bar */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-2 bg-gradient-to-r",
          plan.id === 'plus' ? 'from-orange-400 to-amber-500' : 'from-violet-500 to-indigo-600'
        )} />

        <div className={cn(
          'mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg',
          plan.id === 'plus'
            ? 'bg-orange-50 text-orange-600 shadow-orange-100'
            : 'bg-violet-50 text-violet-600 shadow-violet-100',
        )}>
          <Icon className="h-8 w-8" />
        </div>

        <h2 className={cn(
          'text-2xl font-extrabold tracking-tight',
          plan.id === 'plus' ? 'text-orange-600' : 'text-violet-600',
        )}>
          Gói {plan.name}
        </h2>
        <p className="mt-2 text-sm font-medium text-stone-500">
          {plan.tagline}
        </p>

        <div className="my-6 border-y border-stone-100 py-4 flex items-center justify-center gap-6 text-sm font-semibold">
          <span className="flex items-center gap-2 text-stone-600">
            <Shield className="h-4 w-4 text-stone-400" />
            {plan.totalSlots === Infinity
              ? 'Không giới hạn tin'
              : `${plan.totalSlots} tin đăng`}
          </span>
          <span className="flex items-center gap-2 text-stone-600">
            <Clock className="h-4 w-4 text-stone-400" />
            {plan.displayDays} ngày
          </span>
        </div>

        <div className="mb-4">
          <span className="text-4xl font-black text-stone-900">
            {formatCurrency(price)}
          </span>
          <span className="text-sm font-bold text-stone-400"> / {plan.displayDays} ngày</span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400/20 opacity-75" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-stone-800">Đang khởi tạo giao dịch...</p>
            <p className="text-xs text-stone-400 mt-1">Đang liên kết cổng thanh toán an toàn PayOS</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="mt-8 w-full">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/70 p-4 text-sm font-semibold text-red-800 shadow-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Khởi tạo thất bại</p>
              <p className="text-xs text-red-700/90 mt-1 leading-relaxed">{error}</p>
            </div>
          </div>

          <button
            type="button"
            className="w-full mt-4 vendor-primary-button justify-center py-3 rounded-2xl shadow-lg"
            onClick={handleCreate}
          >
            <RefreshCw className="h-4 w-4" />
            Thử lại
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Step 2: Hiển thị QR + polling ─────────────────────────── */
function PaymentQRStep({ paymentData, plan, onSuccess, onCancel }) {
  const [pollingStatus, setPollingStatus] = useState('pending');
  const [pollCount, setPollCount] = useState(0);
  const [copyToast, setCopyToast] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

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

  const Icon = plan.icon;
  const isPlus = plan.id === 'plus';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full max-w-5xl mx-auto py-4 px-2">
      {/* LEFT COLUMN: Order & Billing Details */}
      <div className="lg:col-span-5 space-y-6">
        {/* Plan Summary Card */}
        <div className={cn(
          "relative rounded-3xl p-6 border text-white shadow-xl overflow-hidden",
          isPlus 
            ? "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 border-orange-400/20" 
            : "bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 border-violet-400/20"
        )}>
          {/* Ambient light inside card */}
          <div className="absolute right-0 bottom-0 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          
          <div className="flex items-start justify-between">
            <div>
              <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-white/20 rounded-full backdrop-blur-md">
                Gói Premium đăng tin
              </span>
              <h3 className="text-2xl font-black mt-2">Gói {plan.name}</h3>
              <p className="text-xs text-white/80 mt-1 font-medium">{plan.tagline}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
            <div>
              <p className="text-[10px] text-white/60 font-bold uppercase">Tin được đăng</p>
              <p className="text-lg font-black mt-0.5">
                {plan.totalSlots === Infinity ? 'Không giới hạn' : `${plan.totalSlots} tin`}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-white/60 font-bold uppercase">Thời gian sử dụng</p>
              <p className="text-lg font-black mt-0.5">{plan.displayDays} ngày</p>
            </div>
          </div>
        </div>

        {/* Billing Breakdown (Invoice) */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-md shadow-stone-100/50">
          <h4 className="text-sm font-extrabold text-stone-900 mb-4 uppercase tracking-wider">Chi tiết thanh toán</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-stone-500">Hóa đơn gia hạn</span>
              <span className="font-bold text-stone-800">ShopVN Vendor</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-stone-500">Mã đơn hàng</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-extrabold text-stone-900">{paymentData.orderCode}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded"
                >
                  {copyToast ? 'Đã copy' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-stone-500">Hình thức</span>
              <span className="font-bold text-stone-800">Cổng PayOS (QR / Thẻ)</span>
            </div>

            <div className="border-t border-dashed border-stone-200 pt-3 mt-3">
              <div className="flex justify-between items-end">
                <div>
                  <span className="block text-sm font-extrabold text-stone-900">Tổng thanh toán</span>
                  <span className="text-[10px] text-stone-400 font-semibold">(Đã bao gồm thuế & phí)</span>
                </div>
                <span className="text-2xl font-black text-stone-900">
                  {formatCurrency(paymentData.amount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className={cn(
          "rounded-3xl border p-5 shadow-sm transition-all duration-300",
          pollingStatus === 'pending' && "border-amber-100 bg-amber-50/50",
          pollingStatus === 'paid' && "border-teal-100 bg-teal-50/50",
          pollingStatus === 'cancelled' && "border-stone-200 bg-stone-50",
          pollingStatus === 'timeout' && "border-red-100 bg-red-50/50"
        )}>
          <div className="flex items-start gap-3">
            {pollingStatus === 'pending' && (
              <>
                <div className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 mt-0.5">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400/20 opacity-75" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-900">Chờ khách hàng quét mã...</p>
                  <p className="text-xs text-amber-700/80 leading-relaxed mt-1">
                    Giao dịch sẽ tự động hoàn tất ngay khi hệ thống nhận được tiền. Vui lòng giữ nguyên trang này.
                  </p>
                </div>
              </>
            )}
            {pollingStatus === 'paid' && (
              <>
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600 mt-0.5">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm font-bold text-teal-900">Thanh toán hoàn tất!</p>
                  <p className="text-xs text-teal-700/80 leading-relaxed mt-1">
                    Đang kích hoạt gói đăng ký cho tài khoản của bạn.
                  </p>
                </div>
              </>
            )}
            {pollingStatus === 'cancelled' && (
              <>
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-200 text-stone-600 mt-0.5">
                  <AlertCircle className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">Giao dịch đã hủy</p>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1">
                    Hóa đơn này đã được hủy bỏ. Vui lòng tạo hóa đơn khác.
                  </p>
                </div>
              </>
            )}
            {pollingStatus === 'timeout' && (
              <>
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 mt-0.5">
                  <AlertCircle className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-900">Hết hạn giao dịch</p>
                  <p className="text-xs text-red-600 leading-relaxed mt-1">
                    Mã thanh toán này đã hết thời gian hiệu lực. Vui lòng thử lại.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Button & Security Assurance */}
        <div className="space-y-4">
          <a
            href={paymentData.paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full vendor-primary-button justify-center py-3.5 rounded-2xl shadow-lg flex items-center gap-2"
          >
            Mở trang thanh toán tab mới
            <ExternalLink className="h-4 w-4" />
          </a>

          <div className="flex items-center justify-center gap-2 text-stone-400 text-xs font-semibold py-1">
            <Lock className="h-3 w-3 text-stone-400" />
            <span>Kết nối thanh toán bảo mật 256-bit SSL</span>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-bold text-stone-400 hover:text-stone-600 underline"
            >
              Hủy thanh toán và quay lại
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Iframe PayOS Checkout Frame */}
      <div className="lg:col-span-7">
        {/* Mock Browser/Device Terminal window */}
        <div className="rounded-3xl border border-stone-200/80 bg-white shadow-xl overflow-hidden">
          {/* Top window Bar */}
          <div className="bg-stone-50 border-b border-stone-150 px-5 py-3 flex items-center gap-3">
            {/* macOS styled colored window actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="h-3 w-3 rounded-full bg-red-400 block" />
              <span className="h-3 w-3 rounded-full bg-yellow-400 block" />
              <span className="h-3 w-3 rounded-full bg-green-400 block" />
            </div>
            
            {/* Address bar mockup */}
            <div className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-1 text-center text-xs font-bold text-stone-400 flex items-center justify-center gap-1.5 shadow-inner max-w-sm mx-auto">
              <Lock className="h-3 w-3 text-teal-600 shrink-0" />
              <span className="truncate select-none text-stone-500">pay.payos.vn/secure</span>
            </div>
            
            <div className="w-12 h-3" /> {/* Spacer */}
          </div>

          {/* Payment Terminal Iframe */}
          <div className="relative bg-stone-100" style={{ height: '620px' }}>
            {iframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 z-10 gap-3">
                <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
                <p className="text-xs font-bold text-stone-500">Đang hiển thị cổng PayOS...</p>
              </div>
            )}
            <iframe
              src={paymentData.paymentUrl}
              title="PayOS QR Terminal"
              className="w-full h-full border-none"
              onLoad={() => setIframeLoading(false)}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 3: Thành công ─────────────────────────────────────── */
function SuccessStep({ planName, navigate }) {
  const [progress, setProgress] = useState(100);
  const totalDuration = 5000; // 5 seconds
  const intervalTime = 50;
  const progressStep = (intervalTime / totalDuration) * 100;
  
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    // Smooth countdown progress bar
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev - progressStep;
        return next <= 0 ? 0 : next;
      });
    }, intervalTime);

    timerRef.current = setTimeout(() => {
      navigate('/vendor/san-pham');
    }, totalDuration);

    return () => {
      clearInterval(progressRef.current);
      clearTimeout(timerRef.current);
    };
  }, [navigate, progressStep]);

  return (
    <div className="flex flex-col items-center py-16 px-4 max-w-md mx-auto text-center">
      {/* Confetti Background glow */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-teal-500/10 blur-[80px] pointer-events-none" />

      {/* Success Receipt Card */}
      <div className="relative w-full rounded-3xl border border-stone-200/80 bg-white p-8 shadow-xl shadow-stone-200/40 overflow-hidden">
        {/* Top green glow bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 to-emerald-500" />

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-teal-500 shadow-lg shadow-teal-100 ring-8 ring-teal-50/50">
          <CheckCircle2 className="h-10 w-10 animate-bounce" />
        </div>

        <h2 className="text-2xl font-black text-stone-900 tracking-tight">
          Kích Hoạt Thành Công!
        </h2>
        <p className="mt-2 text-sm font-semibold text-stone-500 leading-relaxed px-2">
          Gói đăng ký <strong className="text-teal-700 font-extrabold">{planName}</strong> đã được áp dụng ngay cho cửa hàng của bạn.
        </p>

        {/* Small details check box */}
        <div className="bg-stone-50 rounded-2xl p-5 my-6 border border-stone-100 space-y-3 text-left">
          {planName?.toLowerCase() === 'premium' ? (
            <>
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-600">
                <Check className="h-4 w-4 text-teal-600 bg-teal-50 p-0.5 rounded-full shrink-0" />
                <span>Không giới hạn lượt đăng tin</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-600">
                <Check className="h-4 w-4 text-teal-600 bg-teal-50 p-0.5 rounded-full shrink-0" />
                <span>Thông tin tổng quan cập nhật liên tục</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-600">
                <Check className="h-4 w-4 text-teal-600 bg-teal-50 p-0.5 rounded-full shrink-0" />
                <span>Tính năng nghiên cứu thị trường</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-600">
                <Check className="h-4 w-4 text-teal-600 bg-teal-50 p-0.5 rounded-full shrink-0" />
                <span>Gợi ý giá bán tối ưu</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-600">
                <Check className="h-4 w-4 text-teal-600 bg-teal-50 p-0.5 rounded-full shrink-0" />
                <span>Khởi động 20 lượt đăng tin</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-600">
                <Check className="h-4 w-4 text-teal-600 bg-teal-50 p-0.5 rounded-full shrink-0" />
                <span>Thông tin tổng quan cập nhật 30 ngày gần nhất</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-600">
                <Check className="h-4 w-4 text-teal-600 bg-teal-50 p-0.5 rounded-full shrink-0" />
                <span>Tính năng nghiên cứu thị trường</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-2.5 text-xs font-bold text-stone-600">
            <Check className="h-4 w-4 text-teal-600 bg-teal-50 p-0.5 rounded-full shrink-0" />
            <span>Gửi hóa đơn điện tử về Email</span>
          </div>
        </div>

        {/* Auto redirect slider */}
        <div className="space-y-3 mt-8">
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-400 to-emerald-500 h-full rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-stone-400">
            <Loader2 className="h-3 w-3 animate-spin text-teal-500" />
            <span>Tự động chuyển hướng về trang Sản phẩm...</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/vendor/san-pham')}
        className="w-full mt-6 vendor-primary-button justify-center py-3.5 rounded-2xl shadow-lg bg-gradient-to-r from-teal-600 to-emerald-600 border-none hover:from-teal-700 hover:to-emerald-700"
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
    getSubscriptionStatus().catch(() => {});
    setStep('success');
  }, []);

  const Icon = plan && plan.id === 'premium' ? Crown : Zap;

  // Nếu plan không hợp lệ
  if (!plan || plan.id === 'free') {
    return (
      <div className="vendor-app vendor-app-premium flex min-h-screen items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl border border-stone-200 shadow-xl max-w-sm">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="font-extrabold text-stone-800 text-lg">Gói dịch vụ không hợp lệ</p>
          <p className="text-stone-500 text-sm mt-2">Đường dẫn thanh toán gói không tồn tại hoặc đã hết hạn.</p>
          <button
            type="button"
            className="vendor-primary-button mt-6 w-full justify-center"
            onClick={() => navigate('/vendor/san-pham')}
          >
            Quay lại trang chính
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-app vendor-app-premium min-h-screen pb-16">
      {/* Header */}
      <header className="vendor-topbar sticky top-0 z-30 flex h-[72px] items-center gap-4 border-b border-stone-200/50 bg-white/80 px-6 backdrop-blur-md">
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
              'flex h-9 w-9 items-center justify-center rounded-xl shadow-md',
              plan.id === 'plus'
                ? 'bg-orange-100 text-orange-600 shadow-orange-100/30'
                : 'bg-violet-100 text-violet-600 shadow-violet-100/30',
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
          <h1 className="text-base font-extrabold text-stone-900">
            Nâng cấp gói {plan.name}
          </h1>
        </div>

        {/* Steps indicator */}
        <div className="ml-auto flex items-center gap-3 text-xs font-bold bg-stone-100/80 px-4 py-2 rounded-2xl border border-stone-200/50">
          {['creating', 'qr', 'success'].map((s, i) => {
            const stepLabels = ['Khởi tạo', 'Thanh toán', 'Hoàn tất'];
            const isActive = step === s;
            const isCompleted = ['qr', 'success'].indexOf(step) > i;

            return (
              <div key={s} className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-extrabold transition-all duration-300',
                    isActive
                      ? 'bg-orange-500 text-white scale-110 shadow-md shadow-orange-200'
                      : isCompleted
                      ? 'bg-teal-500 text-white'
                      : 'bg-stone-200 text-stone-500',
                  )}
                >
                  {isCompleted ? '✓' : i + 1}
                </span>
                <span className={cn(
                  "hidden sm:inline text-[11px]",
                  isActive ? "text-stone-900 font-extrabold" : "text-stone-400"
                )}>
                  {stepLabels[i]}
                </span>
                {i < 2 && <span className="text-stone-300 font-normal">/</span>}
              </div>
            );
          })}
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {step === 'creating' && (
          <CheckoutStep
            plan={plan}
            onPaymentCreated={handlePaymentCreated}
          />
        )}
        {step === 'qr' && paymentData && (
          <PaymentQRStep
            paymentData={paymentData}
            plan={plan}
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
