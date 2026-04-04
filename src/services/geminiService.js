import api from './api';

const explain = async (payload) => {
  if (!payload || !payload.text) return { error: 'Missing `text` field for explain' };
  try {
    const { data } = await api.post('/gemini/explain', payload);
    return data;
  } catch (err) {
    console.error('Gemini explain error', err.response || err);
    return {
      error: err.response?.data?.message || err.message,
      status: err.response?.status,
      url: err.config?.url,
      details: err.response?.data || null
    };
  }
};

const docs = async (payload) => {
  if (!payload || !payload.code) return { error: 'Missing `code` field for docs' };
  try {
    const { data } = await api.post('/gemini/docs', payload);
    return data;
  } catch (err) {
    console.error('Gemini docs error', err.response || err);
    return {
      error: err.response?.data?.message || err.message,
      status: err.response?.status,
      url: err.config?.url,
      details: err.response?.data || null
    };
  }
};

const readme = async (payload) => {
  if (!payload || !payload.projectInfo) return { error: 'Missing `projectInfo` field for readme' };
  try {
    const { data } = await api.post('/gemini/readme', payload);
    return data;
  } catch (err) {
    console.error('Gemini readme error', err.response || err);
    return {
      error: err.response?.data?.message || err.message,
      status: err.response?.status,
      url: err.config?.url,
      details: err.response?.data || null
    };
  }
};

export default { explain, docs, readme };
