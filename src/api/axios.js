import axios from 'axios';

const api = axios.create({
  baseURL: 'https://apihalosani.cloud/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Daftar endpoint yang tidak membutuhkan token
const noAuthRequired = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-otp',
  '/resend-otp'
];

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Skip penambahan token untuk endpoint tertentu
    if (noAuthRequired.some(path => config.url?.includes(path))) {
      return config;
    }

    const isAdminRequest = config.url?.startsWith('/admin');
    const token = isAdminRequest
      ? localStorage.getItem('admin_token')
      : localStorage.getItem('user_token');

    if (!token) {
      // Redirect ke halaman login jika token tidak ada
      if (isAdminRequest) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
      return Promise.reject(new Error('No token found'));
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRequest = error.config.url?.startsWith('/admin');
      
      if (isAdminRequest) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      } else {
        localStorage.removeItem('user_token');
        window.location.href = '/login';
      }
      
      // Tampilkan pesan error jika ada
      if (error.response.data?.message) {
        console.error('Authentication error:', error.response.data.message);
      }
    }
    return Promise.reject(error);
  }
);

export default api;