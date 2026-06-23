import axiosClient from './axiosClient';

const unwrap = (response) => {
  const payload = response.data?.data ?? response.data;
  return payload?.content ?? payload?.items ?? payload?.categories ?? payload;
};

export const categoryApi = {
  getPublicCategories: async () => {
    const response = await axiosClient.get('/api/categories');
    return unwrap(response);
  },
};
