import api from './api';

export const adminService = {
  getAnalytics: async () => {
    const res = await api.get('/admin/dashboard/analytics');
    return res.data;
  },
  getCompanies: async () => {
    const res = await api.get('/public/companies');
    return res.data;
  },
  createCompany: async (payload) => {
    const res = await api.post('/admin/companies', payload);
    return res.data;
  },
  updateCompany: async (id, payload) => {
    const res = await api.put(`/admin/companies/${id}`, payload);
    return res.data;
  },
  deleteCompany: async (id) => {
    const res = await api.delete(`/admin/companies/${id}`);
    return res.data;
  },
  getUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },
  updateUserStatus: async (id, isActive) => {
    const res = await api.patch(`/admin/users/${id}/status`, null, { params: { isActive } });
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },
  login: async (email, password) => {
    const res = await api.post('/admin/auth/login', { email, password });
    return res.data;
  }
};

export default adminService;
