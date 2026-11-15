import api from './axios';

export const taskService = {
  getTasks: async (params = {}) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  toggleTask: async (id) => {
    const response = await api.patch(`/tasks/${id}/complete`);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  clearCompleted: async () => {
    const response = await api.delete('/tasks/completed');
    return response.data;
  },

  reorderTasks: async (tasks) => {
    const response = await api.patch('/tasks/reorder', { tasks });
    return response.data;
  },
};
