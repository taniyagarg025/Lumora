import api from './api';

export const noteService = {
  getUserNotes: async (articleId = null) => {
    const params = new URLSearchParams();
    if (articleId) params.append('articleId', articleId);

    const response = await api.get(`/notes?${params.toString()}`);
    return response.data;
  },

  createNote: async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },

  deleteNote: async (noteId) => {
    const response = await api.delete(`/notes/${noteId}`);
    return response.data;
  },
};
