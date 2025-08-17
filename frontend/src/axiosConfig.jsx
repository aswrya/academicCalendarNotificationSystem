// frontend/src/axiosConfig.js
import axios from 'axios';

const base = (process.env.REACT_APP_API_URL || '/api').replace(/\/+$/, ''); // default to '/api'
const axiosInstance = axios.create({
  baseURL: base, 
  headers: { 'Content-Type': 'application/json' },
});

// Attach token from localStorage on every request
axiosInstance.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('user');
    const user = raw ? JSON.parse(raw) : null;
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch {}
  return config;
});

// If backend returns 401, clear token and send to login
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
