import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Check,
  Minus,
  Zap,
  Crown,
  Package,
  Sparkles,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { cn } from '../../lib/utils';

/* ─── Plan definitions ──────────────────────────────────────── */
export const VENDOR_PLANS = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Bắt đầu miễn phí',
    icon: Package,
    color: 'stone',
    totalSlots: 3,
    displayDays: 30,
    features: [
      { label: 'Tối đa 3 tin đăng / tháng', included: true },
      { label: 'Thời hạn gói 30 ngày', included: true },
      { label: 'Hiển thị tiêu chuẩn', included: true },
      { label: 'Thông tin tổng quan cập nhật 30 ngày gần nhất', included: false },
      { label: 'Tính năng nghiên cứu thị trường', included: false },
      { label: 'Thông tin tổng quan cập nhật liên tục', included: false },
      { label: 'Đánh dấu tin nổi bật', included: false },
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    tagline: 'Phù hợp nhà bán hàng mới',
    icon: Zap,
    color: 'orange',
    totalSlots: 20,
    displayDays: 30,
    badge: 'Phổ biến nhất',
    badgeType: 'popular',
    features: [
      { label: 'Tối đa 20 tin đăng / tháng', included: true },
      { label: 'Thời hạn gói 30 ngày', included: true },
      { label: 'Hiển thị tiêu chuẩn', included: true },
      { label: 'Thông tin tổng quan cập nhật 30 ngày gần nhất', included: true },
      { label: 'Tính năng nghiên cứu thị trường', included: true },
      { label: 'Thông tin tổng quan cập nhật liên tục', included: false },
      { label: 'Đánh dấu tin nổi bật', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Dành cho shop chuyên nghiệp',
    icon: Crown,
    color: 'violet',
    totalSlots: Infinity,
    displayDays: 30,
    badge: 'Mạnh nhất',
    badgeType: 'premium',
    features: [
      { label: 'Không giới hạn tin đăng', included: true },
      { label: 'Thời hạn gói 30 ngày', included: true },
      { label: 'Hiển thị tiêu chuẩn', included: true },
      { label: 'Thông tin tổng quan cập nhật liên tục', included: true },
      { label: 'Tính năng nghiên cứu thị trường', included: true },
      { label: 'Đánh dấu tin nổi bật', included: true },
    ],
  },
];

/* ─── localStorage helpers ─────────────────────────────────── */
export function getVendorPlan() {
  try {
    const raw = localStorage.getItem('vendorPlan');
    if (!raw) {
      // Default plan
      const defaultPlan = { planId: 'free', usedSlots: 0, totalSlots: 3 };
      localStorage.setItem('vendorPlan', JSON.stringify(defaultPlan));
      return defaultPlan;
    }
    return JSON.parse(raw);
  } catch {
    return { planId: 'free', usedSlots: 0, totalSlots: 3 };
  }
}

export function saveVendorPlan(planData) {
  localStorage.setItem('vendorPlan', JSON.stringify(planData));
}

export function getRemainingSlots() {
  const plan = getVendorPlan();
  if (plan.totalSlots === Infinity || plan.totalSlots === -1) return Infinity;
  return Math.max(0, plan.totalSlots - plan.usedSlots);
}

export function consumeOneSlot() {
  const plan = getVendorPlan();
  if (plan.totalSlots === Infinity || plan.totalSlots === -1) return plan;
  const updated = { ...plan, usedSlots: (plan.usedSlots || 0) + 1 };
  saveVendorPlan(updated);
  return updated;
}

/* ─── PlanCard ──────────────────────────────────────────────── */
function PlanCard({ plan, currentPlanId, onSelect }) {
  const Icon = plan.icon;
  const isCurrent = plan.id === currentPlanId;
  const isPopular = plan.badgeType === 'popular';
  const isPremium = plan.badgeType === 'premium';

  const cardClass = cn(
    'plan-card',
    isPopular && 'is-popular',
    isPremium && 'is-premium',
    isCurrent && 'is-current',
  );

  const btnClass = cn(
    'plan-select-btn mt-5',
    plan.id === 'free' && 'is-free',
    plan.id === 'plus' && 'is-plus',
    plan.id === 'premium' && 'is-premium',
    isCurrent && 'is-current',
  );

  const slotsLabel =
    plan.totalSlots === Infinity ? 'Không giới hạn' : `${plan.totalSlots} tin`;

  return (
    <div className={cardClass}>
      {/* Badge */}
      {plan.badge && (
        <span
          className={
            plan.badgeType === 'premium'
              ? 'plan-badge-premium'
              : 'plan-badge-popular'
          }
        >
          {plan.badgeType === 'premium' ? (
            <Crown className="h-2.5 w-2.5" />
          ) : (
            <Sparkles className="h-2.5 w-2.5" />
          )}
          {plan.badge}
        </span>
      )}

      {/* Header */}
      <div className="mb-4">
        <div
          className={cn(
            'mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl',
            plan.id === 'free' && 'bg-stone-100 text-stone-600',
            plan.id === 'plus' && 'bg-orange-100 text-orange-600',
            plan.id === 'premium' && 'bg-violet-100 text-violet-600',
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-2">
          <h3
            className={cn(
              'text-lg font-extrabold',
              plan.id === 'free' && 'text-stone-700',
              plan.id === 'plus' && 'text-orange-600',
              plan.id === 'premium' && 'text-violet-600',
            )}
          >
            {plan.name}
          </h3>
          {isCurrent && (
            <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-extrabold text-teal-700 border border-teal-100">
              Đang dùng
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[11px] font-semibold text-stone-400">
          {plan.tagline}
        </p>
      </div>

      {/* Slot + Duration highlight */}
      <div className="mb-4 rounded-xl border border-stone-100 bg-stone-50/60 p-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400">
              Số tin đăng
            </p>
            <p
              className={cn(
                'mt-0.5 text-xl font-extrabold',
                plan.id === 'free' && 'text-stone-700',
                plan.id === 'plus' && 'text-orange-600',
                plan.id === 'premium' && 'text-violet-600',
              )}
            >
              {slotsLabel}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400">
              Hiển thị tối đa
            </p>
            <p className="mt-0.5 text-xl font-extrabold text-stone-700">
              {plan.displayDays} ngày
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-5 flex-1 space-y-0.5">
        {plan.features.map((feat) => (
          <div key={feat.label} className="plan-feature-item">
            {feat.included ? (
              <Check className="check-icon h-3.5 w-3.5" />
            ) : (
              <Minus className="dash-icon h-3.5 w-3.5" />
            )}
            <span className={feat.included ? 'text-stone-600' : 'text-stone-400'}>
              {feat.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        type="button"
        className={btnClass}
        disabled={isCurrent}
        onClick={() => !isCurrent && onSelect(plan)}
      >
        {isCurrent ? (
          <>
            <Shield className="h-3.5 w-3.5" />
            Gói hiện tại
          </>
        ) : (
          <>
            {plan.id === 'free' ? 'Giữ gói Free' : `Chọn ${plan.name}`}
            {plan.id !== 'free' && <ArrowRight className="h-3.5 w-3.5" />}
          </>
        )}
      </button>
    </div>
  );
}

/* ─── Main Modal ────────────────────────────────────────────── */
/**
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - onPlanSelected: (plan) => void  — called after user picks a plan
 *  - blocksNavigation: boolean — if true, can't dismiss without selecting (quota exhausted)
 *  - currentPlanId: string
 */
export default function SubscriptionPlanModal({
  isOpen,
  onClose,
  onPlanSelected,
  blocksNavigation = false,
  currentPlanId,
}) {
  const [planState, setPlanState] = useState(getVendorPlan);
  const navigate = useNavigate();

  // Re-read on open
  useEffect(() => {
    if (isOpen) setPlanState(getVendorPlan());
  }, [isOpen]);

  // Close on Escape (unless blocking)
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && !blocksNavigation) onClose();
    },
    [blocksNavigation, onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const activePlanId = currentPlanId || planState.planId || 'free';

  const handleSelect = (plan) => {
    if (plan.id === 'free') {
      // Giữ gói Free, chỉ đóng modal
      onPlanSelected?.(plan);
      onClose();
      return;
    }
    // Plus / Premium → chuyển sang trang thanh toán
    onClose();
    navigate(`/vendor/subscription/checkout?plan=${plan.id}`);
  };

  if (!isOpen) return null;

  return (
    <div
      className="plan-modal-overlay"
      onClick={blocksNavigation ? undefined : onClose}
    >
      <div
        className="plan-modal-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="plan-modal-header">
          <div className="flex items-start justify-between gap-4">
            <div>
              {blocksNavigation ? (
                <>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-extrabold text-red-600 border border-red-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    Hết lượt đăng tin
                  </div>
                  <h2
                    id="plan-modal-title"
                    className="text-xl font-extrabold text-stone-900"
                  >
                    Nâng cấp gói để tiếp tục đăng tin
                  </h2>
                  <p className="mt-1.5 text-sm font-semibold text-stone-400">
                    Gói của bạn đã đạt giới hạn số lượt đăng. Hãy nâng cấp để
                    đăng thêm sản phẩm và tiếp cận nhiều khách hàng hơn.
                  </p>
                </>
              ) : (
                <>
                  <h2
                    id="plan-modal-title"
                    className="text-xl font-extrabold text-stone-900"
                  >
                    Chọn gói đăng tin phù hợp
                  </h2>
                  <p className="mt-1.5 text-sm font-semibold text-stone-400">
                    Nâng cấp để đăng thêm tin và ưu tiên hiển thị sản phẩm của
                    bạn.
                  </p>
                </>
              )}
            </div>
            {!blocksNavigation && (
              <button
                type="button"
                aria-label="Đóng"
                className="vendor-icon-button shrink-0"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Current plan info strip */}
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-stone-50 border border-stone-100 px-4 py-2.5">
            <Shield className="h-4 w-4 text-stone-400" />
            <span className="text-xs font-bold text-stone-500">
              Gói hiện tại của bạn:
            </span>
            <span className="text-xs font-extrabold text-stone-800 capitalize">
              {activePlanId}
            </span>
            {planState.totalSlots !== -1 && (
              <>
                <span className="text-stone-300">•</span>
                <span className="text-xs font-bold text-stone-500">
                  Đã dùng{' '}
                  <span className="text-stone-800">
                    {planState.usedSlots || 0}
                  </span>
                  /{planState.totalSlots || 3} lượt
                </span>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="plan-modal-body">
          <div className="grid gap-5 pt-4 sm:grid-cols-3">
            {VENDOR_PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                currentPlanId={activePlanId}
                onSelect={handleSelect}
              />
            ))}
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-[11px] font-semibold text-stone-400">
            {/* <br /> */}
            Gói được cập nhật ngay lập tức sau khi chọn.
          </p>
        </div>
      </div>
    </div>
  );
}
