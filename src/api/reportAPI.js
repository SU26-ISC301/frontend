import axiosClient from './axiosClient';

const unwrap = (response) => response.data?.data ?? response.data;

export const reportApi = {
  getReasons: async () => {
    const response = await axiosClient.get('/api/reports/reasons');
    return unwrap(response);
  },

  createReport: async ({ targetType, targetId, reasonCode, description, confirmTruthful = true, evidenceUrls = [] }, files = []) => {
    const hasFiles = Array.isArray(files) && files.length > 0;

    if (hasFiles) {
      const formData = new FormData();
      formData.append('targetType', targetType);
      formData.append('targetId', String(targetId));
      formData.append('reasonCode', reasonCode);
      formData.append('confirmTruthful', String(Boolean(confirmTruthful)));
      if (description) formData.append('description', description);
      files.forEach((file) => formData.append('files', file));

      const response = await axiosClient.post('/api/reports', formData, {
        headers: { 'X-Role-Token': 'buyer-strict' },
        timeout: 90000,
      });
      return unwrap(response);
    }

    const response = await axiosClient.post('/api/reports', {
      targetType,
      targetId,
      reasonCode,
      description,
      evidenceUrls,
      confirmTruthful,
    }, {
      headers: { 'X-Role-Token': 'buyer-strict' },
    });
    return unwrap(response);
  },

  getMyReports: async (params = {}) => {
    const response = await axiosClient.get('/api/reports/my', {
      params,
      headers: { 'X-Role-Token': 'buyer-strict' },
    });
    return unwrap(response);
  },

  getMyReportDetail: async (id) => {
    const response = await axiosClient.get(`/api/reports/${id}`, {
      headers: { 'X-Role-Token': 'buyer-strict' },
    });
    return unwrap(response);
  },

  getAdminReports: async (params = {}) => {
    const response = await axiosClient.get('/api/admin/reports', {
      params,
      headers: { 'X-Role-Token': 'admin' },
    });
    return unwrap(response);
  },

  getAdminReportDetail: async (id) => {
    const response = await axiosClient.get(`/api/admin/reports/${id}`, {
      headers: { 'X-Role-Token': 'admin' },
    });
    return unwrap(response);
  },

  updateAdminReportStatus: async (id, payload) => {
    const response = await axiosClient.patch(`/api/admin/reports/${id}/status`, payload, {
      headers: { 'X-Role-Token': 'admin' },
    });
    return unwrap(response);
  },

  applyAdminReportAction: async (id, payload) => {
    const response = await axiosClient.post(`/api/admin/reports/${id}/actions`, payload, {
      headers: { 'X-Role-Token': 'admin' },
    });
    return unwrap(response);
  },

  getAdminReportStats: async () => {
    const response = await axiosClient.get('/api/admin/reports/stats', {
      headers: { 'X-Role-Token': 'admin' },
    });
    return unwrap(response);
  },

  reviewAppeal: async (reportId, appealId, payload) => {
    const response = await axiosClient.patch(`/api/admin/reports/${reportId}/appeals/${appealId}`, payload, {
      headers: { 'X-Role-Token': 'admin' },
    });
    return unwrap(response);
  },

  getSellerReports: async (params = {}) => {
    const response = await axiosClient.get('/api/seller/reports', {
      params,
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  getSellerViolations: async () => {
    const response = await axiosClient.get('/api/seller/violations', {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },

  submitSellerAppeal: async (reportId, payload) => {
    const response = await axiosClient.post(`/api/seller/reports/${reportId}/appeals`, payload, {
      headers: { 'X-Role-Token': 'vendor' },
    });
    return unwrap(response);
  },
};
