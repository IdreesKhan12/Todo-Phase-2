import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('better-auth-session-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove token and redirect to login
      localStorage.removeItem('better-auth-session-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Task API functions
export const taskAPI = {
  // Get all tasks for a user
  getTasks: async (userId) => {
    const response = await apiClient.get(`/users/${userId}/tasks`);
    return response.data;
  },

  // Create a new task
  createTask: async (userId, taskData) => {
    const response = await apiClient.post(`/users/${userId}/tasks`, taskData);
    return response.data;
  },

  // Update a task
  updateTask: async (userId, taskId, taskData) => {
    const response = await apiClient.put(`/users/${userId}/tasks/${taskId}`, taskData);
    return response.data;
  },

  // Delete a task
  deleteTask: async (userId, taskId) => {
    const response = await apiClient.delete(`/users/${userId}/tasks/${taskId}`);
    return response.data;
  },

  // Get a specific task
  getTask: async (userId, taskId) => {
    const response = await apiClient.get(`/users/${userId}/tasks/${taskId}`);
    return response.data;
  }
};
