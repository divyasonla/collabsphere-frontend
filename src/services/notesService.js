import api from './api';

const createNote = async (projectId, payload) => {
  try {
    const { data } = await api.post(`/notes/project/${projectId}`, payload);
    return data;
  } catch (err) {
    return { error: err.response?.data?.message || err.message };
  }
};

const getNotesByProject = async (projectId) => {
  try {
    const { data } = await api.get(`/notes/project/${projectId}`);
    return data;
  } catch (err) {
    return { error: err.response?.data?.message || err.message };
  }
};

const updateNote = async (id, payload) => {
  try {
    const { data } = await api.put(`/notes/${id}`, payload);
    return data;
  } catch (err) {
    return { error: err.response?.data?.message || err.message };
  }
};

const deleteNote = async (id) => {
  try {
    const { data } = await api.delete(`/notes/${id}`);
    return data;
  } catch (err) {
    return { error: err.response?.data?.message || err.message };
  }
};

export default { createNote, getNotesByProject, updateNote, deleteNote };
