import axiosClient from './axiosClient';

const unwrap = (response) => response.data?.data ?? response.data;

export const promotionApi = {
  getWallet: async () => {
    const response = await axiosClient.get('/api/seller/wallet/balance');
    return unwrap(response);
  },

  getWalletTransactions: async (limit = 20) => {
    const response = await axiosClient.get('/api/seller/wallet/transactions', {
      params: { limit },
    });
    return unwrap(response);
  },

  createTopUp: async ({ amount, paymentMethod = 'payos' }) => {
    const response = await axiosClient.post('/api/seller/wallet/top-up', {
      amount,
      paymentMethod,
    });
    return unwrap(response);
  },

  checkTopUpPayment: async (orderCode) => {
    const response = await axiosClient.get('/api/seller/wallet/check-payment', {
      params: { orderCode },
    });
    return unwrap(response);
  },

  previewPromotion: async (payload) => {
    const response = await axiosClient.post('/api/seller/promotions/preview', payload);
    return unwrap(response);
  },

  createPromotion: async (payload) => {
    const response = await axiosClient.post('/api/seller/promotions', payload);
    return unwrap(response);
  },

  getPromotions: async () => {
    const response = await axiosClient.get('/api/seller/promotions');
    return unwrap(response);
  },

  getPromotionDetail: async (promotionId) => {
    const response = await axiosClient.get(`/api/seller/promotions/${promotionId}`);
    return unwrap(response);
  },

  updatePromotion: async (promotionId, payload) => {
    const response = await axiosClient.patch(`/api/seller/promotions/${promotionId}`, payload);
    return unwrap(response);
  },

  stopPromotion: async (promotionId, reason = 'Seller stopped from promotion popup') => {
    const response = await axiosClient.post(`/api/seller/promotions/${promotionId}/stop`, {
      confirm: true,
      reason,
    });
    return unwrap(response);
  },
};
