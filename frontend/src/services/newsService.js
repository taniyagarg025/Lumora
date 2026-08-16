import api from './api';

export const newsService = {
  getNewsFeed: async (category = 'all', query = '', page = 0, size = 10) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (query) params.append('q', query);
    params.append('page', page);
    params.append('size', size);

    const response = await api.get(`/news/feed?${params.toString()}`);
    return response.data;
  },

  getArticleById: async (id) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  syncNews: async (category = 'all') => {
    const response = await api.post(`/news/sync?category=${category}`);
    return response.data;
  },
};
