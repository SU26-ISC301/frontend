import axiosClient from './axiosClient';

const unwrap = (response) => response.data?.data ?? response.data;

export const sellerApi = {
  login: async (payload) => {
    const response = await axiosClient.post('/vendors/login', payload);
    return unwrap(response);
  },

  startRegister: async (email) => {
    const response = await axiosClient.post('/vendors/register/start', { email });
    return unwrap(response);
  },

  verifyOtp: async ({ email, otp }) => {
    const response = await axiosClient.post('/vendors/register/verify-otp', { email, otp });
    return unwrap(response);
  },

  verifyIdentityWithFace: async ({ frontImage, backImage, faceImage }) => {
    const formData = new FormData();
    formData.append('frontImage', frontImage);
    formData.append('backImage', backImage);
    formData.append('faceImage', faceImage);

    const response = await axiosClient.post('/api/identity/cccd/verify-with-face', formData, {
      timeout: 60000,
    });
    return unwrap(response);
  },

  completeRegister: async (payload) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    const response = await axiosClient.post('/vendors/register/complete', formData, {
      timeout: 90000,
    });
    return unwrap(response);
  },
};
