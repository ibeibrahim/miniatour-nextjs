// lib/api/users.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { CreateUserData, UpdateUserData, UserType } from '@/types/types';

// Base API configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User API service
export const userService = {
  async getUsers(): Promise<UserType[]> {
    const response = await api.get('/users');
    return response.data['data'];
  },

  // Get user by ID
  async getUserById(id: number): Promise<UserType> {
    const response = await api.get(`/users/${id}`);
    return response.data['data'];
  },

  // Create new user
  async createUser(userData: CreateUserData): Promise<UserType> {
    const formData = new FormData();
    
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('role_id', userData.role_id);
    formData.append('password', userData.password);
    formData.append('password_confirmation', userData.password_confirmation);
    
    if (userData.photo_profile) {
      formData.append('photo_profile', userData.photo_profile);
    }

    const response = await api.post('/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data['user'];
  },

  // Update user
  async updateUser(id: number, userData: UpdateUserData): Promise<UserType> {
    const formData = new FormData();
    
    if (userData.name) formData.append('name', userData.name);
    if (userData.email) formData.append('email', userData.email);
    if (userData.photo_profile) {
      formData.append('photo_profile', userData.photo_profile);
    }
    if(userData.city_id) formData.append('city_id', userData.city_id);
    if(userData.is_active !== null) formData.append('is_active', userData.is_active.toString());
    if(userData.description) formData.append('description', userData.description);
    if(userData.price) formData.append('price', userData.price);

    const response = await api.post(`/users/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data['data'];
  },

  // Delete user
  async deleteUser(id: number): Promise<boolean> {
    const response = await api.delete(`/users/${id}`);
    return response.data['success'];
  },
};