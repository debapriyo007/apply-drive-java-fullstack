import api from './api';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (fullName, email, password) => {
    const res = await api.post('/auth/register', { fullName, email, password });
    return res.data;
  },
  verifyOtp: async (email, otp) => {
    const res = await api.post('/auth/verify-otp', { email, otp });
    return res.data;
  },
  resendOtp: async (email) => {
    const res = await api.post(`/auth/resend-otp?email=${encodeURIComponent(email)}`);
    return res.data;
  },
  forgotPassword: async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },
  resetPassword: async (email, otp, newPassword) => {
    const res = await api.post('/auth/reset-password', { email, otp, newPassword });
    return res.data;
  }
};

export default authService;
