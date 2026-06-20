import api from './api';

export const userService = {
  getProfile: async () => {
    const res = await api.get('/users/profile');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put('/users/profile', data);
    return res.data;
  },
  getSavedJobs: async () => {
    const res = await api.get('/users/saved-jobs');
    return res.data;
  },
  changePassword: async (oldPassword, newPassword) => {
    const res = await api.put('/users/change-password', { oldPassword, newPassword });
    return res.data;
  }
};

export default userService;
