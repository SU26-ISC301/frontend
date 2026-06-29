import axiosClient from './axiosClient';

const unwrap = (response) => response.data?.data ?? response.data;

export const financeApi = {
  getFinanceReport: async () => {
    const response = await axiosClient.get('/api/seller/finance/report', {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },
};
