import axiosClient from './axiosClient';

const unwrap = (response) => response.data?.data ?? response.data;

export const buyerMessageApi = {
  getVendors: async () => {
    const response = await axiosClient.get('/buyers/messages/vendors');
    return unwrap(response);
  },

  getConversations: async () => {
    const response = await axiosClient.get('/buyers/messages/conversations');
    return unwrap(response);
  },

  startConversation: async (vendorId) => {
    const response = await axiosClient.post('/buyers/messages/conversations', { vendorId });
    return unwrap(response);
  },

  getMessages: async (conversationId) => {
    const response = await axiosClient.get(`/buyers/messages/conversations/${conversationId}`);
    return unwrap(response);
  },

  sendMessage: async (conversationId, content) => {
    const response = await axiosClient.post(`/buyers/messages/conversations/${conversationId}`, { content });
    return unwrap(response);
  },
};
