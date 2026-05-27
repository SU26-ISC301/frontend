import axiosClient from './axiosClient';

export const authApi = {
    // Tương ứng với POST /api/auth/register ở backend
    register: (data) => {
        return axiosClient.post('/api/auth/register', data);
    },

    verifyRegister: (data) => {
        return axiosClient.post('/api/auth/register-verify', data);
    },

    // Tương ứng với POST /api/auth/login ở backend
    login: (data) => {
        return axiosClient.post('/api/auth/login', data);
    },

    forgotPassword: (email) => {
        return axiosClient.post('/api/auth/password/forgot', { email });
    },

    verifyForgotPasswordOtp: (data) => {
        return axiosClient.post('/api/auth/password/verify-otp', data);
    },

    resetPassword: (data) => {
        return axiosClient.post('/api/auth/password/reset', data);
    },

    // Tương ứng với GET /api/auth/me ở backend
    getMe: () => {
        return axiosClient.get('/api/auth/me');
    },

    updateProfile: (profileId, data) => {
        return axiosClient.put(`/api/auth/profiles/${profileId}`, data);
    },

    requestProfileUpdateOtp: (data) => {
        return axiosClient.post('/api/auth/profile/update-otp', data);
    },

    updateCurrentProfile: (data) => {
        return axiosClient.put('/api/auth/profile', data);
    },

    uploadAvatar: (file) => {
        const formData = new FormData();
        formData.append('avatar', file);
        return axiosClient.post('/api/auth/profile/avatar', formData);
    }
};
