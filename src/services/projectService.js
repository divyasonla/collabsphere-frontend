import api from './api';

const getMyProjects = async () => {
  try {
    const { data } = await api.get('/projects');
    return data;
  } catch (err) {
    return { error: err.response?.data?.message || err.message };
  }
};

const createProject = async (payload) => {
  try {
    const { data } = await api.post('/projects', payload);
    return data;
  } catch (err) {
    return { error: err.response?.data?.message || err.message };
  }
};

const getProject = async (id) => {
  try {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  } catch (err) {
    return { error: err.response?.data?.message || err.message };
  }
};

const addMember = async (projectId, payload) => {
  try {
    const { data } = await api.post(`/projects/${projectId}/members`, payload);
    return data;
  } catch (err) {
    return { error: err.response?.data?.message || err.message };
  }
};

const getPublicProject = async (id) => {
  try {
    const { data } = await api.get(`/projects/public/${id}`);
    return data;
  } catch (err) {
    return { error: err.response?.data?.message || err.message };
  }
};

export default { getMyProjects, createProject, getProject, addMember, getPublicProject };
