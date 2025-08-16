import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
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
  } catch {
    // ignore JSON parse errors
  }
  return config;
});

// Optional: if backend says 401, clear stale token and go to login
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
