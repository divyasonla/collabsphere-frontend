import api from './api';

const getAnalytics = async (projectId) => {
  try {
    const { data } = await api.get(`/projects/${projectId}/analytics`);
    return data;
  } catch (err) {
    return { error: err.response?.data?.message || err.message };
  }
};

export default { getAnalytics };
