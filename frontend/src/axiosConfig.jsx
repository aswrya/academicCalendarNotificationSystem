import axios from 'axios';

const base = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

const baseURL = base || undefined;

const axiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});


axiosInstance.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('user');
    const user = raw ? JSON.parse(raw) : null;
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch {
    // ignore JSON parse errors
  }
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
