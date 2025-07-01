import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Cek apakah request ke admin endpoint
    const isAdminRequest = config.url?.startsWith('/admin');
    
    // Gunakan token yang sesuai
    const token = isAdminRequest 
      ? localStorage.getItem('admin_token')
      : localStorage.getItem('user_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized (401) responses
    if (error.response?.status === 401) {
      // Jika admin dan unauthorized, redirect ke login admin
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