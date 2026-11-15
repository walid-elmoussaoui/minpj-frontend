import api from './axios';

export const preferenceService = {
  getPreferences: async () => {
    const response = await api.get('/preferences');
    return response.data;
  },

  updatePreferences: async (theme) => {
    const response = await api.put('/preferences', { theme });
    return response.data;
  },
};
