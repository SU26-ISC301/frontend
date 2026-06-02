import axiosClient from './axiosClient';

const unwrap = (response) => response.data?.data ?? response.data;

export const vendorMessageApi = {
  getConversations: async () => {
    const response = await axiosClient.get('/vendors/messages/conversations');
    return unwrap(response);
  },

  getMessages: async (conversationId) => {
    const response = await axiosClient.get(`/vendors/messages/conversations/${conversationId}`);
    return unwrap(response);
  },

  sendMessage: async (conversationId, content) => {
    const response = await axiosClient.post(`/vendors/messages/conversations/${conversationId}`, { content });
    return unwrap(response);
  },
};
