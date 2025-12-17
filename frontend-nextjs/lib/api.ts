import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Request cache for GET requests
const requestCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5000; // 5 seconds cache

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for caching
api.interceptors.request.use((config) => {
  // Only cache GET requests
  if (config.method === 'get') {
    const cacheKey = `${config.url}${JSON.stringify(config.params)}`;
    const cached = requestCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return Promise.reject({
        __CACHED__: true,
        data: cached.data,
      });
    }
  }
  return config;
});

// Response interceptor for caching
api.interceptors.response.use(
  (response) => {
    // Cache GET responses
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params)}`;
      requestCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
    }
    return response;
  },
  (error) => {
    // Handle cached responses
    if (error.__CACHED__) {
      return Promise.resolve({ data: error.data });
    }
    // Log error for debugging
    if (error.config?.url?.includes('/auth/login')) {
      console.error('Login API Error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/auth/login', credentials),
};

// Member API
export const memberAPI = {
  getAll: () => api.get('/members'),
  getById: (id: string) => api.get(`/members/${id}`),
  create: (member: any) => api.post('/members', member),
  update: (id: string, member: any) => api.put(`/members/${id}`, member),
  delete: (id: string) => api.delete(`/members/${id}`),
  search: (query: string) => api.get(`/members/search?query=${query}`),
};

// Payment API
export const paymentAPI = {
  getAll: () => api.get('/payments'),
  getByMemberId: (memberId: string) => api.get(`/payments/member/${memberId}`),
  create: (payment: any) => api.post('/payments', payment),
  update: (id: number, payment: any) => api.put(`/payments/${id}`, payment),
  delete: (id: number) => api.delete(`/payments/${id}`),
};

// Trainer API
export const trainerAPI = {
  getAll: () => api.get('/trainers'),
  getById: (id: string) => api.get(`/trainers/${id}`),
  create: (trainer: any) => api.post('/trainers', trainer),
  update: (id: string, trainer: any) => api.put(`/trainers/${id}`, trainer),
  delete: (id: string) => api.delete(`/trainers/${id}`),
  search: (query: string) => api.get(`/trainers/search?query=${query}`),
};

// Attendance API
export const attendanceAPI = {
  getByMember: (memberId: string) => api.get(`/attendance/member/${memberId}`),
  getByTrainer: (trainerId: string) => api.get(`/attendance/trainer/${trainerId}`),
  mark: (data: any) => api.post('/attendance', data),
  getStats: (memberId: string) => api.get(`/attendance/stats/${memberId}`),
  getAll: () => api.get('/attendance'),
};

// Workout Plan API
export const workoutAPI = {
  getByTrainer: (trainerId: string) => api.get(`/workouts/trainer/${trainerId}`),
  getByMember: (memberId: string) => api.get(`/workouts/member/${memberId}`),
  create: (workout: any) => api.post('/workouts', workout),
  update: (planId: number, workout: any) => api.put(`/workouts/${planId}`, workout),
  delete: (planId: number) => api.delete(`/workouts/${planId}`),
};

// Progress Tracking API
export const progressAPI = {
  getByTrainer: (trainerId: string) => api.get(`/progress/trainer/${trainerId}`),
  getByMember: (memberId: string) => api.get(`/progress/member/${memberId}`),
  create: (progress: any) => api.post('/progress', progress),
  update: (progressId: number, progress: any) => api.put(`/progress/${progressId}`, progress),
  delete: (progressId: number) => api.delete(`/progress/${progressId}`),
};

// Feedback API
export const feedbackAPI = {
  getAll: () => api.get('/feedback/all'),
  getByMember: (memberId: string) => api.get(`/feedback/member/${memberId}`),
  getByTrainer: (trainerId: string) => api.get(`/feedback/trainer/${trainerId}`),
  create: (feedback: any) => api.post('/feedback', feedback),
  markAsRead: (id: number) => api.put(`/feedback/${id}/read`),
};

export default api;

