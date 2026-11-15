import api from './axios';

export const statisticsService = {
  getStatistics: async () => {
    const response = await api.get('/statistics');
    return response.data;
  },
};
