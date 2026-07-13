import axiosClient from './axiosClient';

const unwrap = (response) => response.data?.data ?? response.data;

export const walletPinApi = {
  getStatus: async () => {
    const response = await axiosClient.get('/api/seller/wallet/pin/status', {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  requestSetupOtp: async () => {
    const response = await axiosClient.post('/api/seller/wallet/pin/setup/request-otp', {}, {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  verifySetupOtp: async ({ otp }) => {
    const response = await axiosClient.post('/api/seller/wallet/pin/setup/verify-otp', { otp }, {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  confirmSetup: async ({ pinSetupToken, newPin, confirmPin }) => {
    const response = await axiosClient.post('/api/seller/wallet/pin/setup/confirm', {
      pinSetupToken,
      newPin,
      confirmPin,
    }, {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  verifyCurrentPin: async ({ currentPin }) => {
    const response = await axiosClient.post('/api/seller/wallet/pin/change/verify-current', { currentPin }, {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  requestChangeOtp: async ({ currentPinToken }) => {
    const response = await axiosClient.post('/api/seller/wallet/pin/change/request-otp', { currentPinToken }, {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  verifyChangeOtp: async ({ currentPinToken, otp }) => {
    const response = await axiosClient.post('/api/seller/wallet/pin/change/verify-otp', {
      currentPinToken,
      otp,
    }, {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  confirmChange: async ({ pinChangeToken, newPin, confirmPin }) => {
    const response = await axiosClient.post('/api/seller/wallet/pin/change/confirm', {
      pinChangeToken,
      newPin,
      confirmPin,
    }, {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },
};

export function getWalletPinErrorCode(error) {
  return error?.response?.data?.code || error?.response?.data?.errorCode || error?.code || '';
}

export function getWalletPinErrorMessage(error, fallback = 'Không thể xử lý mã PIN ví') {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback;
}

export function isWalletPinEnabled(status) {
  return Boolean(
    status?.enabled ||
      status?.hasPin ||
      status?.pinEnabled ||
      status?.active ||
      status?.isActive,
  );
}
