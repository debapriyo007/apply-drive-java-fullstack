import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response Interceptor: Auto refresh token on 401 error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const user = localStorage.getItem('user');

      if (user) {
        try {
          // Attempt to refresh the access token (cookies are handled automatically)
          const res = await axios.post('/api/v1/auth/refresh-token', {}, { withCredentials: true });
          
          if (res.status === 200) {
            return api(originalRequest); // Retry original request
          }
        } catch (refreshError) {
          // If refresh fails, log out user
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
