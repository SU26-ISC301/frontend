import axiosClient from './axiosClient';

const unwrap = (response) => response.data?.data ?? response.data;

export const marketResearchApi = {
  getVendorMarketResearch: async ({ categoryId, source, query } = {}) => {
    const response = await axiosClient.get('/vendors/market-research', {
      params: {
        categoryId: categoryId || undefined,
        source: source || undefined,
        query: query || undefined,
      },
    });
    return unwrap(response);
  },

  getPublicProductMarketResearch: async ({ query, categoryName } = {}) => {
    const response = await axiosClient.get('/api/market-research/product', {
      params: {
        query: query || undefined,
        categoryName: categoryName || undefined,
      },
    });
    return unwrap(response);
  },
};
