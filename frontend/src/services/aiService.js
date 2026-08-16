import api from './api';

export const aiService = {
  summarizeArticle: async (articleId, text) => {
    const response = await api.post('/ai/summarize', { articleId, text });
    return response.data;
  },

  simplifyText: async (text, targetLevel = 'SIMPLE') => {
    const response = await api.post('/ai/simplify', { text, targetLevel });
    return response.data;
  },

  extractVocabulary: async (text) => {
    const response = await api.post('/ai/extract-vocab', { text });
    return response.data;
  },

  extractEntities: async (text) => {
    const response = await api.post('/ai/extract-entities', { text });
    return response.data;
  },
};
