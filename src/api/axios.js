import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'https://apihalosani.cloud/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Endpoint yang tidak membutuhkan token
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
    if (noAuthRequired.some(path => config.url.includes(path))) {
      return config;
    }

    const isAdminRequest = config.url.startsWith('/admin');
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
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const isAdminRequest = originalRequest.url.startsWith('/admin');
      
      // Hapus token dari localStorage
      if (isAdminRequest) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      } else {
        localStorage.removeItem('user_token');
        window.location.href = '/login';
      }
      
      // Tampilkan pesan error
      if (error.response.data?.message) {
        toast.error(error.response.data.message);
      }
      
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default api;
