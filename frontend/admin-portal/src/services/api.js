import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Auto-refresh token for admin session
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const adminUser = localStorage.getItem('adminUser');

      if (adminUser) {
        try {
          // Attempt to refresh admin access token (cookies are handled automatically)
          const res = await axios.post('/api/v1/admin/auth/refresh-token', {}, { withCredentials: true });
          
          if (res.status === 200) {
            return api(originalRequest); // Retry original request
          }
        } catch (refreshError) {
          localStorage.removeItem('adminUser');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
