// frontend/src/axiosConfig.js
import axios from 'axios';

// Ensure trailing slash; default to '/api'
const root = process.env.REACT_APP_API_URL || '';
const base = root.replace(/\/+$/, '') + '/';
console.log(base);

const axiosInstance = axios.create({
  baseURL: base, // e.g., http://localhost:5001/api/
  headers: { 'Content-Type': 'application/json' },
});

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
