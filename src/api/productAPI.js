import axiosClient from './axiosClient';

const unwrap = (response) => response.data?.data ?? response.data;

export const productApi = {
  getPublicProducts: async () => {
    const response = await axiosClient.get('/api/products');
    return unwrap(response);
  },
};
