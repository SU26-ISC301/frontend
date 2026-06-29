import axiosClient from './axiosClient';

const unwrap = (response) => response.data?.data ?? response.data;

export const productApi = {
  getPublicProducts: async (params = {}) => {
    const response = await axiosClient.get('/api/products', { params });
    return unwrap(response);
  },

  getPublicProductById: async (productId, options = {}) => {
    const response = await axiosClient.get(`/api/products/${productId}`, {
      headers: options.buyerAuth ? { 'X-Role-Token': 'buyer-strict' } : undefined,
    });
    return unwrap(response);
  },
};
