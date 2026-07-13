import axiosClient from './axiosClient';

/**
 * Lấy trạng thái gói subscription hiện tại
 * @returns {{ planType, totalSlots, usedSlots, remainingSlots, expiresAt, canPost }}
 */
export async function getSubscriptionStatus() {
  const response = await axiosClient.get('/api/subscription/status', {
    headers: { 'X-Role-Token': 'vendor' },
  });
  const planData = response.data.data;
  if (planData) {
    const localData = {
      planId: planData.planType || 'free',
      usedSlots: planData.usedSlots || 0,
      totalSlots: planData.totalSlots,
      remainingSlots: planData.remainingSlots,
      canPost: planData.canPost,
      expiresAt: planData.expiresAt,
    };
    localStorage.setItem('vendorPlan', JSON.stringify(localData));
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
