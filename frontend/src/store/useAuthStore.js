import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data });
    } catch (error) {
      console.log('Auth check error:', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (email, password) => {
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      set({ authUser: res.data });
    } catch (error) {
      console.log('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
    } catch (error) {
      console.log('Logout error:', error);
      throw error;
    }
  },

  register: async (fullname, email, password) => {
    try {
      const res = await axiosInstance.post('/auth/register', {
        fullname,
        email,
        password,
      });
      set({ authUser: res.data });
    } catch (error) {
      console.log('Register error:', error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const res = await axiosInstance.put('/auth/profile', profileData);
      set({ authUser: res.data });
    } catch (error) {
      console.log('Update profile error:', error);
      throw error;
    }
  },

  updateAvatar: async (avatarFile) => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const res = await axiosInstance.post('/auth/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      set({ authUser: res.data });
    } catch (error) {
      console.log('Update avatar error:', error);
      throw error;
    }
  },
}));
