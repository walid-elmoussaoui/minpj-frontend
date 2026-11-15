import api from './axios';

export const authService = {
  register: async (name, email, password, passwordConfirmation) => {
    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  getUser: async () => {
    const response = await api.get('/user');
    return response.data;
  },
};
