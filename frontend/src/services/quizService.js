import api from './api';

export const quizService = {
  getOrGenerateQuiz: async (articleId) => {
    const response = await api.get(`/quiz/article/${articleId}`);
    return response.data;
  },

  getQuizByArticleId: async (articleId) => {
    const response = await api.get(`/quiz/article/${articleId}`);
    return response.data;
  },

  submitQuiz: async (quizId, answers) => {
    const response = await api.post(`/quiz/${quizId}/submit`, { answers });
    return response.data;
  },

  getQuizHistory: async () => {
    const response = await api.get('/quiz/history');
    return response.data;
  },
};
