import { Package, Zap, Crown, AlertTriangle, CheckCircle, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getVendorPlan, VENDOR_PLANS } from './SubscriptionPlanModal';

const PLAN_META = {
  free: {
    icon: Package,
    label: 'Free',
    color: 'stone',
    iconClass: 'text-stone-500 bg-stone-100',
    barClass: 'bg-stone-400',
  },
  plus: {
    icon: Zap,
    label: 'Plus',
    color: 'orange',
    iconClass: 'text-orange-600 bg-orange-100',
    barClass: 'bg-gradient-to-r from-orange-400 to-orange-500',
  },
  premium: {
    icon: Crown,
    label: 'Premium',
    color: 'violet',
    iconClass: 'text-violet-600 bg-violet-100',
    barClass: 'bg-gradient-to-r from-violet-400 to-violet-500',
  },
};

/**
 * Props:
 *  onUpgradeClick: () => void  — opens the plan modal
 */
export default function PostingQuotaBanner({ onUpgradeClick }) {
  const planData = getVendorPlan();
  const planId = planData.planId || 'free';
  const used = planData.usedSlots || 0;
  const total = planData.totalSlots === -1 ? Infinity : (planData.totalSlots || 3);
  const isPremiumUnlimited = total === Infinity;

  const remaining = isPremiumUnlimited ? Infinity : Math.max(0, total - used);
  const pct = isPremiumUnlimited ? 100 : total > 0 ? Math.min(100, (used / total) * 100) : 100;
  const isExhausted = !isPremiumUnlimited && remaining === 0;
  const isLow = !isPremiumUnlimited && !isExhausted && remaining <= 2;

  const meta = PLAN_META[planId] || PLAN_META.free;
  const Icon = meta.icon;

  const planDef = VENDOR_PLANS.find((p) => p.id === planId);
  const displayDays = planDef?.displayDays || 7;

  return (
    <div
      className={cn(
        'quota-banner',
        isExhausted && 'is-exhausted',
        planId === 'premium' && 'is-premium',
      )}
    >
      {/* Icon */}
      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
          meta.iconClass,
        )}
      >
        <Icon className="h-5 w-5" />
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-extrabold text-stone-800">
            Gói {meta.label}
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-extrabold text-stone-500">
            Hiển thị {displayDays} ngày / tin
          </span>
          {isExhausted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-extrabold text-red-600 border border-red-100">
              <AlertTriangle className="h-2.5 w-2.5" />
              Đã hết lượt
            </span>
          )}
          {isLow && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-700 border border-amber-100">
              <AlertTriangle className="h-2.5 w-2.5" />
              Sắp hết lượt
            </span>
          )}
        </div>

        {isPremiumUnlimited ? (
          <div className="mt-1 flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-violet-500" />
            <p className="text-xs font-bold text-violet-600">
              Không giới hạn số lượt đăng tin
            </p>
          </div>
        ) : (
          <>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-200/70">
              <div
                className={cn('h-full rounded-full transition-all duration-500', meta.barClass)}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] font-bold text-stone-500">
              Đã dùng{' '}
              <span
                className={cn(
                  'font-extrabold',
                  isExhausted ? 'text-red-600' : isLow ? 'text-amber-700' : 'text-stone-700',
                )}
              >
                {used}
              </span>
              /{total} lượt
              {remaining > 0 && (
                <span className="text-stone-400 ml-1">
                  · còn {remaining} lượt
                </span>
              )}
            </p>
          </>
        )}
      </div>

      {/* Upgrade button */}
      {planId !== 'premium' && (
        <button
          type="button"
          onClick={onUpgradeClick}
          className={cn(
            'shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-extrabold transition-all',
            isExhausted
              ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/30'
              : planId === 'free'
              ? 'border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100'
              : 'border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100',
          )}
        >
          {isExhausted ? 'Nâng cấp ngay' : 'Nâng cấp'}
          <ArrowUpRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
