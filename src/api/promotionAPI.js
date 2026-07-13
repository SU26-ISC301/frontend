import axiosClient from './axiosClient';

const unwrap = (response) => response.data?.data ?? response.data;

const PAID_PAYMENT_STATUSES = new Set([
  'PAID',
  'COMPLETED',
  'PAYMENT_SUCCESS',
  'SUCCESS_PAID',
  'PAID_SUCCESS',
]);

const PAID_GENERIC_STATUSES = new Set([
  'PAID',
  'PAYMENT_SUCCESS',
  'SUCCESS_PAID',
  'PAID_SUCCESS',
]);

const CANCELLED_STATUSES = new Set(['CANCELLED', 'CANCELED']);
const FAILED_STATUSES = new Set(['FAILED', 'EXPIRED']);

const normalizeStatusValue = (value) =>
  String(value || '')
    .trim()
    .replace(/[\s-]+/g, '_')
    .toUpperCase();

export function getTopUpOrderCode(payment) {
  return (
    payment?.orderCode ||
    payment?.paymentOrderCode ||
    payment?.payosOrderCode ||
    payment?.orderId ||
    ''
  );
}

export function getTopUpPaymentUrl(payment) {
  return (
    payment?.paymentUrl ||
    payment?.checkoutUrl ||
    payment?.payUrl ||
    payment?.url ||
    ''
  );
}

export function normalizeTopUpPaymentStatus(result) {
  const payload = result?.data ?? result ?? {};
  const paymentStatus = normalizeStatusValue(
    payload?.paymentStatus ||
      payload?.payment?.status ||
      payload?.payosStatus ||
      payload?.payOsStatus ||
      payload?.payos?.status ||
      payload?.checkoutStatus,
  );

  if (paymentStatus) {
    if (PAID_PAYMENT_STATUSES.has(paymentStatus)) return 'paid';
    if (CANCELLED_STATUSES.has(paymentStatus)) return 'cancelled';
    if (FAILED_STATUSES.has(paymentStatus)) return 'failed';
  }

  if (
    payload?.paid === true ||
    payload?.isPaid === true ||
    payload?.paymentSucceeded === true
  ) {
    return 'paid';
  }

  const genericStatus = normalizeStatusValue(
    payload?.transactionStatus ||
      payload?.orderStatus ||
      payload?.status ||
      (typeof payload === 'string' ? payload : ''),
  );

  if (PAID_GENERIC_STATUSES.has(genericStatus)) return 'paid';
  if (CANCELLED_STATUSES.has(genericStatus)) return 'cancelled';
  if (FAILED_STATUSES.has(genericStatus)) return 'failed';
  return 'pending';
}

export const promotionApi = {
  getAccountWallet: async () => {
    const response = await axiosClient.get('/api/seller/wallet/balance', {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  getPromotionWallet: async () => {
    const response = await axiosClient.get('/api/seller/wallet/balance', {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  getWalletTransactions: async (limit = 20) => {
    const response = await axiosClient.get('/api/seller/wallet/transactions', {
      params: { limit },
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  createTopUp: async ({ amount, paymentMethod = 'payos' }) => {
    const response = await axiosClient.post('/api/seller/wallet/top-up', {
      amount,
      paymentMethod,
    }, {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  checkTopUpPayment: async (orderCode) => {
    const response = await axiosClient.get('/api/seller/wallet/check-payment', {
      params: { orderCode },
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  previewPromotion: async (payload) => {
    const response = await axiosClient.post('/api/seller/promotions/preview', payload);
    return unwrap(response);
  },

  createPromotion: async (payload) => {
    const response = await axiosClient.post('/api/promotions/create', {
      productId: payload.productId ?? payload.postId,
      promotionAmount: payload.promotionAmount ?? payload.budget,
      roiPerClick: payload.roiPerClick,
      startDate: payload.startDate,
      endDate: payload.endDate,
      walletPin: payload.walletPin,
    }, {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  getPromotions: async () => {
    const response = await axiosClient.get('/api/promotions/mine', {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  getPromotionDetail: async (promotionId) => {
    const response = await axiosClient.get(`/api/promotions/${promotionId}`, {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  updatePromotion: async (promotionId, payload) => {
    const response = await axiosClient.patch(`/api/promotions/${promotionId}`, payload, {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  stopPromotion: async (promotionId, reason = 'Người bán dừng quảng bá từ cửa sổ thao tác') => {
    const response = await axiosClient.post(`/api/promotions/${promotionId}/stop`, {
      confirm: true,
      reason,
    }, {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  recordPromotionClick: async (promotionId, payload) => {
    const response = await axiosClient.post(`/api/promotions/${promotionId}/click`, payload, {
      headers: { 'X-Role-Token': 'buyer' },
    });
    return unwrap(response);
  },
};
