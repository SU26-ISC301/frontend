import axiosClient from './axiosClient';

/**
 * Lấy trạng thái gói subscription hiện tại
 * @returns {{ planType, totalSlots, usedSlots, remainingSlots, expiresAt, canPost }}
 */
export async function getSubscriptionStatus() {
  const response = await axiosClient.get('/api/subscription/status');
  return response.data.data;
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
  });
  return response.data.data;
}

/**
 * Polling: kiểm tra kết quả thanh toán
 * @param {string} orderCode
 * @returns {'pending' | 'paid' | 'cancelled' | 'failed'}
 */
export async function checkPaymentStatus(orderCode) {
  const response = await axiosClient.get('/api/subscription/check-payment', {
    params: { orderCode }
  });
  return response.data.data?.status || 'pending';
}

/**
 * Trừ 1 lượt đăng tin sau khi post thành công
 */
export async function useSubscriptionSlot() {
  const response = await axiosClient.post('/api/subscription/use-slot', {});
  return response.data;
}
