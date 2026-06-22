import axiosClient from './axiosClient';

const unwrap = (response) => response.data?.data ?? response.data;

export const productApi = {
  getPublicProducts: async (params = {}) => {
    const response = await axiosClient.get('/api/products', { params });
    return unwrap(response);
  },

  getPublicProductById: async (productId) => {
    const response = await axiosClient.get(`/api/products/${productId}`);
    return unwrap(response);
  },
};
