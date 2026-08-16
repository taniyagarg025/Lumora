import api from './api';

export const habitService = {
  getStreak: async () => {
    const response = await api.get('/habit/streak');
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/habit/dashboard');
    return response.data;
  },

  logArticleRead: async (articleId, duration = 180) => {
    const response = await api.post(`/habit/log-read?articleId=${articleId}&duration=${duration}`);
    return response.data;
  },
};
