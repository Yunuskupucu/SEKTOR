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

  fetchProfile: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get('/auth/profile');
      set({ authUser: res.data });
    } catch (err) {
      console.error('❌ Profil verisi alınamadı:', err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (email, password) => {
    try {
      await axiosInstance.post('/auth/login', { email, password });
      await useAuthStore.getState().fetchProfile();
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
      await axiosInstance.post('/auth/register', {
        fullname,
        email,
        password,
      });
      await useAuthStore.getState().fetchProfile();
    } catch (error) {
      console.log('Register error:', error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      await axiosInstance.put('/auth/profile', profileData);
      await useAuthStore.getState().fetchProfile();
    } catch (error) {
      console.log('Update profile error:', error);
      throw error;
    }
  },

  updateAvatar: async (avatarFile) => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      await axiosInstance.post('/auth/avatar', formData);

      await useAuthStore.getState().fetchProfile();
    } catch (error) {
      console.log('Update avatar error:', error);
      throw error;
    }
  },
}));
