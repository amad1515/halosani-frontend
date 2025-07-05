import axios from 'axios';

const api = axios.create({
  baseURL: 'http://apihalosani.cloud/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const isAdminRequest = config.url?.startsWith('/admin');

    const token = isAdminRequest
      ? localStorage.getItem('admin_token')
      : localStorage.getItem('user_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (error.config.url?.startsWith('/admin')) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      } else {
        localStorage.removeItem('user_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
