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

  // Product management API methods
  createProduct: async (payload) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, value);
        }
      }
    });

    const response = await axiosClient.post('/products/create', formData, {
      timeout: 90000,
    });
    return unwrap(response);
  },

  getProductCategories: async () => {
    const response = await axiosClient.get('/products/categories');
    return unwrap(response);
  },

  uploadProductImages: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await axiosClient.post('/products/upload-images', formData, {
      timeout: 60000,
    });
    return unwrap(response);
  },

  getProductById: async (productId) => {
    const response = await axiosClient.get(`/products/${productId}`);
    return unwrap(response);
  },

  updateProduct: async (productId, payload) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, value);
        }
      }
    });

    const response = await axiosClient.post(`/products/${productId}`, formData, {
      timeout: 90000,
    });
    return unwrap(response);
  },

  getVendorByProfileId: async (profileId) => {
    const response = await axiosClient.get(`/vendors/profile/${profileId}`);
    return unwrap(response);
  },

  updateVendor: async (vendorId, payload) => {
    const response = await axiosClient.put(`/vendors/${vendorId}`, payload);
    return unwrap(response);
  },
};

