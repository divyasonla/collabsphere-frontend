import api, { setAuthToken } from './api';

const register = async (payload) => {
  try {
    const { data } = await api.post('/auth/register', payload);
    if (data?.token) setAuthToken(data.token);
    return data;
  } catch (err) {
    return { error: err.response?.data?.message || err.message };
  }
};

const login = async (payload) => {
  try {
    const { data } = await api.post('/auth/login', payload);
    if (data?.token) setAuthToken(data.token);
    return data;
  } catch (err) {
    return { error: err.response?.data?.message || err.message };
  }
};

const setToken = (token) => setAuthToken(token);

const me = async () => {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch (err) {
    return { error: err.response?.data?.message || err.message };
  }
};

export default { register, login, setToken, me };
