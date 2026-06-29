import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
});

// Interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle 401 Unauthorized and 500 Internal Server Error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/' && window.location.pathname !== '/impact') {
          window.location.href = '/login';
        }
      } else if (error.response.status >= 500) {
        // Show generic error message for 500s instead of silent failure
        alert('Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.');
      }
    } else if (error.request) {
      alert('Koneksi ke server terputus. Periksa jaringan internet Anda.');
    }
    return Promise.reject(error);
  }
);

export default api;
