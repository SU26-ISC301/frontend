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

    // Tương ứng với GET /api/auth/me ở backend
    getMe: () => {
        return axiosClient.get('/api/auth/me');
    },

    updateProfile: (profileId, data) => {
        return axiosClient.put(`/api/auth/profiles/${profileId}`, data);
    }
};
