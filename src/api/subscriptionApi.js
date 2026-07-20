import axiosClient from './axiosClient';

export const SUBSCRIPTION_PLAN_LIMITS = Object.freeze({
  free: 3,
  plus: 20,
  premium: -1,
});

export const SUBSCRIPTION_PLAN_RANKS = Object.freeze({
  free: 0,
  plus: 1,
  premium: 2,
});

export function canUpgradeSubscription(currentPlanType, targetPlanType) {
  const currentRank = SUBSCRIPTION_PLAN_RANKS[String(currentPlanType || 'free').toLowerCase()];
  const targetRank = SUBSCRIPTION_PLAN_RANKS[String(targetPlanType || '').toLowerCase()];
  return Number.isInteger(currentRank) && Number.isInteger(targetRank) && targetRank > currentRank;
}

export function normalizeSubscriptionStatus(planData = {}) {
  const rawPlanType = String(planData.planType || planData.planId || 'free')
    .trim()
    .toLowerCase();
  const planType = Object.prototype.hasOwnProperty.call(
    SUBSCRIPTION_PLAN_LIMITS,
    rawPlanType,
  )
    ? rawPlanType
    : 'free';
  const totalSlots = SUBSCRIPTION_PLAN_LIMITS[planType];
  const usedSlotsValue = Number(planData.usedSlots ?? 0);
  const usedSlots = Number.isFinite(usedSlotsValue)
    ? Math.max(0, usedSlotsValue)
    : 0;
  const remainingSlots =
    totalSlots === -1 ? -1 : Math.max(0, totalSlots - usedSlots);

  return {
    ...planData,
    planType,
    totalSlots,
    usedSlots,
    remainingSlots,
    canPost: totalSlots === -1 || remainingSlots > 0,
    active: planData.active ?? planData.isActive ?? true,
  };
}

export function toStoredVendorPlan(planData = {}) {
  const normalized = normalizeSubscriptionStatus(planData);
  return {
    planId: normalized.planType,
    usedSlots: normalized.usedSlots,
    totalSlots: normalized.totalSlots,
    remainingSlots: normalized.remainingSlots,
    canPost: normalized.canPost,
    expiresAt: normalized.expiresAt,
    active: normalized.active,
  };
}

/**
 * Lấy trạng thái gói subscription hiện tại
 * @returns {{ planType, totalSlots, usedSlots, remainingSlots, expiresAt, canPost }}
 */
export async function getSubscriptionStatus() {
  const response = await axiosClient.get('/api/subscription/status', {
    headers: { 'X-Role-Token': 'vendor' },
  });
  const planData = response.data.data
    ? normalizeSubscriptionStatus(response.data.data)
    : null;
  if (planData) {
    const localData = toStoredVendorPlan(planData);
    localStorage.setItem('vendorPlan', JSON.stringify(localData));
    window.dispatchEvent(
      new CustomEvent('vendor-subscription-updated', { detail: localData }),
    );
  }
  return planData;
}

/**
 * Tạo link thanh toán để nâng cấp gói
 * @param {string} planType  - 'plus' hoặc 'premium'
 * @param {string} paymentMethod - 'payos'
 * @returns {{ paymentUrl, orderCode, amount, planType, transactionId }}
 */
export async function createPaymentLink(planType, paymentMethod = 'payos') {
  const response = await axiosClient.post('/api/subscription/upgrade', {
    planType,
    paymentMethod
  }, {
    headers: { 'X-Role-Token': 'vendor' },
  });
  return response.data.data;
}

/**
 * Nâng cấp gói bằng số dư ví người bán, yêu cầu mã PIN ví.
 * @param {string} planType - 'plus' hoặc 'premium'
 * @param {string} walletPin - mã PIN ví 6 số
 */
export async function upgradeSubscriptionWithWalletPin(planType, walletPin) {
  const response = await axiosClient.post('/api/subscription/upgrade', {
    planType,
    paymentMethod: 'wallet',
    walletPin,
  }, {
    headers: { 'X-Role-Token': 'vendor' },
  });
  return response.data.data ?? response.data;
}

/**
 * Polling: kiểm tra kết quả thanh toán
 * @param {string} orderCode
 * @returns {'pending' | 'paid' | 'cancelled' | 'failed'}
 */
export async function checkPaymentStatus(orderCode) {
  const response = await axiosClient.get('/api/subscription/check-payment', {
    params: { orderCode },
    headers: { 'X-Role-Token': 'vendor' },
  });
  return response.data.data?.status || 'pending';
}

/**
 * Trừ 1 lượt đăng tin sau khi post thành công
 */
export async function useSubscriptionSlot() {
  const response = await axiosClient.post('/api/subscription/use-slot', {}, {
    headers: { 'X-Role-Token': 'vendor' },
  });
  return response.data;
}
