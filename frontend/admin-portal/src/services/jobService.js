import api from './api';

export const jobService = {
  getJobs: async (params) => {
    const res = await api.get('/admin/jobs', { params });
    return res.data;
  },
  getCompanies: async () => {
    const res = await api.get('/public/companies');
    return res.data;
  },
  getCategories: async () => {
    const res = await api.get('/public/categories');
    return res.data;
  },
  importParse: async (text) => {
    const res = await api.post('/admin/jobs/import/parse', { text });
    return res.data;
  },
  createJob: async (payload) => {
    const res = await api.post('/admin/jobs', payload);
    return res.data;
  },
  updateJob: async (id, payload) => {
    const res = await api.put(`/admin/jobs/${id}`, payload);
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/admin/jobs/${id}/status`, null, { params: { status } });
    return res.data;
  },
  deleteJob: async (id) => {
    const res = await api.delete(`/admin/jobs/${id}`);
    return res.data;
  },
  cloneJob: async (id) => {
    const res = await api.post(`/admin/jobs/${id}/clone`);
    return res.data;
  }
};

export default jobService;
