import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = 'http://localhost:8000/api/v1'; // Update with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    address: string;
  }) => api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  logout: () => api.post('/auth/logout'),
  
  resetPassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/reset-password', data),
};

// Store API
export const storeAPI = {
  getAllStores: () => api.get('/store/get-all-stores'),
  createStore: (data: {
    name: string;
    email: string;
    address: string;
  }) => api.post('/store/create-store', data),
  getRatingsForStore: (storeId: string) =>
    api.get(`/store/get-ratings-for-store?storeId=${storeId}`),
};

// Rating API
export const ratingAPI = {
  submitRating: (data: { storeId: string; rating: number }) =>
    api.post('/rating/rate', data),
};

// User Admin API
export const userAdminAPI = {
  getAllUsers: () => api.get('/user/getallusers'),
  getUserById: (userId: string) =>
    api.get(`/user/getuserbyID/${userId}`),
  createUserWithAdmin: (data: {
    name: string;
    email: string;
    password: string;
    address: string;
    role: string;
  }) => api.post('/user/createuserwithadmin', data),
};

export default api;