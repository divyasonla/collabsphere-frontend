import api from './api';

const uploadFile = async (formData, onUploadProgress) => {
  try {
    const { data } = await api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percent);
        }
      }
    });
    return data;
  } catch (err) {
    return { error: err.response?.data?.message || err.message };
  }
};

const getFilesByProject = async (projectId) => {
  try {
    const { data } = await api.get(`/files/project/${projectId}`);
    return data;
  } catch (err) {
    return { error: err.response?.data?.message || err.message };
  }
};

const getPublicFiles = async (publicId) => {
  try {
    const { data } = await api.get(`/files/public/${publicId}`);
    return data;
  } catch (err) {
    return { error: err.response?.data?.message || err.message };
  }
};

export default { uploadFile, getFilesByProject, getPublicFiles };
