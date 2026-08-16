import api from './api';

export const vocabService = {
  getVocabulary: async (isMastered = null) => {
    const params = new URLSearchParams();
    if (isMastered !== null) params.append('isMastered', isMastered);

    const response = await api.get(`/vocabulary?${params.toString()}`);
    return response.data;
  },

  saveWord: async (vocabData) => {
    const response = await api.post('/vocabulary', vocabData);
    return response.data;
  },

  toggleMastered: async (vocabId) => {
    const response = await api.patch(`/vocabulary/${vocabId}/master`);
    return response.data;
  },

  deleteWord: async (vocabId) => {
    const response = await api.delete(`/vocabulary/${vocabId}`);
    return response.data;
  },
};
