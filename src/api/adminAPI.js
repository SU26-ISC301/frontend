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
    },
    approveProduct: (id) => {
        return axiosClient.post(`/api/admin/products/${id}/approve`);
    },
    rejectProduct: (id, reason) => {
        return axiosClient.post(`/api/admin/products/${id}/reject`, { reason });
    },
    warnProduct: (id, reason) => {
        return axiosClient.post(`/api/admin/products/${id}/warn`, { reason });
    }
};
