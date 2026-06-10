import axiosClient from './axiosClient';

export const adminApi = {
    getAllProfiles: () => {
        return axiosClient.get('/api/admin/profiles');
    },
    getAllVendors: () => {
        return axiosClient.get('/api/admin/vendors');
    },
    toggleProfileStatus: (profileId) => {
        return axiosClient.post(`/api/admin/profiles/toggle-status?profileId=${profileId}`);
    },
    getAuditLogs: (page, size, query, action) => {
        return axiosClient.get('/api/admin/audit-logs', {
            params: { page, size, query, action }
        });
    },
    getDistinctActions: () => {
        return axiosClient.get('/api/admin/audit-logs/actions');
    }
};
