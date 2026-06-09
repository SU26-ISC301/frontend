import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function getAuthHeaders() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Lấy trạng thái gói subscription hiện tại
 * @returns {{ planType, totalSlots, usedSlots, remainingSlots, expiresAt, canPost }}
 */
export async function getSubscriptionStatus() {
  const response = await axios.get(`${API_URL}/api/subscription/status`, {
    headers: getAuthHeaders(),
  });
  return response.data.data;
}

/**
 * Tạo link thanh toán để nâng cấp gói
 * @param {string} planType  - 'plus' hoặc 'premium'
 * @param {string} paymentMethod - 'payos'
 * @returns {{ paymentUrl, orderCode, amount, planType, transactionId }}
 */
export async function createPaymentLink(planType, paymentMethod = 'payos') {
  const response = await axios.post(
    `${API_URL}/api/subscription/upgrade`,
    { planType, paymentMethod },
    { headers: getAuthHeaders() }
  );
  return response.data.data;
}

/**
 * Polling: kiểm tra kết quả thanh toán
 * @param {string} orderCode
 * @returns {'pending' | 'paid' | 'cancelled' | 'failed'}
 */
export async function checkPaymentStatus(orderCode) {
  const response = await axios.get(
    `${API_URL}/api/subscription/check-payment`,
    {
      params: { orderCode },
      headers: getAuthHeaders(),
    }
  );
  return response.data.data?.status || 'pending';
}

/**
 * Trừ 1 lượt đăng tin sau khi post thành công
 */
export async function useSubscriptionSlot() {
  const response = await axios.post(
    `${API_URL}/api/subscription/use-slot`,
    {},
    { headers: getAuthHeaders() }
  );
  return response.data;
}
