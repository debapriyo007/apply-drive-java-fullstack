import api from './api';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (fullName, email, password) => {
    const res = await api.post('/auth/register', { fullName, email, password });
    return res.data;
  }
};

export default authService;
