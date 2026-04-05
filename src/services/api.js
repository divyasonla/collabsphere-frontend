import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// initialize auth header from localStorage if present
const storedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
if (storedToken) api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

// Request logger to aid debugging (prints url and whether Authorization header present)
api.interceptors.request.use(cfg => {
  try {
    const auth = !!cfg.headers?.Authorization;
    console.debug('[api] Request', cfg.method?.toUpperCase(), cfg.baseURL + cfg.url, 'auth=', auth);
  } catch (e) {}
  return cfg;
}, err => Promise.reject(err));

export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
};

export default api;
