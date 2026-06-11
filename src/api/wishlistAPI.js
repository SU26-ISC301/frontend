import axiosClient from './axiosClient';

const unwrap = (response) => response.data?.data ?? response.data;

export const wishlistApi = {
  getFavorites: async () => {
    const response = await axiosClient.get('/api/wishlists', {
      headers: { 'X-Role-Token': 'buyer' },
    });
    return unwrap(response);
  },

  addFavorite: async (productId) => {
    const response = await axiosClient.post(`/api/wishlists/${productId}`, null, {
      headers: { 'X-Role-Token': 'buyer' },
    });
    return unwrap(response);
  },

  removeFavorite: async (productId) => {
    const response = await axiosClient.delete(`/api/wishlists/${productId}`, {
      headers: { 'X-Role-Token': 'buyer' },
    });
    return unwrap(response);
  },

  isFavorite: async (productId) => {
    const response = await axiosClient.get(`/api/wishlists/products/${productId}/exists`, {
      headers: { 'X-Role-Token': 'buyer' },
    });
    return unwrap(response);
  },
};
