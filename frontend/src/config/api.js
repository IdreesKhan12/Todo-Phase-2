// API Configuration

export const API_CONFIG = {
  BASE_URL: 'http://localhost:8001',

  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    VALIDATE: '/auth/validate-token',
    HEALTH: '/auth/health',
  },

  TASKS: {
    LIST: (userId) => `/api/${userId}/tasks?user_id=${userId}`,
    CREATE: (userId) => `/api/${userId}/tasks`,
    UPDATE: (userId, taskId) => `/api/${userId}/tasks/${taskId}?user_id=${userId}`,
    DELETE: (userId, taskId) => `/api/${userId}/tasks/${taskId}?user_id=${userId}`,
    TOGGLE: (userId, taskId) => `/api/${userId}/tasks/${taskId}/complete?user_id=${userId}`,
  }
};

export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
