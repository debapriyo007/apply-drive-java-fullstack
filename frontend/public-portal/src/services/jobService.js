import api from './api';

export const jobService = {
  getJobs: async (params) => {
    const res = await api.get('/public/jobs', { params });
    return res.data;
  },
  getJobDetails: async (id) => {
    const res = await api.get(`/public/jobs/${id}`);
    return res.data;
  },
  getCategories: async () => {
    const res = await api.get('/public/categories');
    return res.data;
  },
  getCompanies: async () => {
    const res = await api.get('/public/companies');
    return res.data;
  },
  checkSavedStatus: async (id) => {
    const res = await api.get(`/users/saved-jobs/${id}/check`);
    return res.data;
  },
  saveJob: async (id) => {
    const res = await api.post(`/users/saved-jobs/${id}`);
    return res.data;
  },
  deleteSavedJob: async (id) => {
    const res = await api.delete(`/users/saved-jobs/${id}`);
    return res.data;
  }
};

export default jobService;
