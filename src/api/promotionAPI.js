import axiosClient from './axiosClient';

const unwrap = (response) => response.data?.data ?? response.data;

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
