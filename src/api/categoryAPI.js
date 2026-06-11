import axiosClient from './axiosClient';

const unwrap = (response) => response.data?.data ?? response.data;

export const categoryApi = {
  getPublicCategories: async () => {
    const response = await axiosClient.get('/api/categories');
    return unwrap(response);
  },
};
