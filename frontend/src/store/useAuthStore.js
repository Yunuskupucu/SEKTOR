import { create } from 'zustand';
import { axiosInstance } from '@/services/api/axios';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,

  checkAuth: async () => {
  try {

    const res = await axiosInstance.get('/auth/profile');



    set({ authUser: res.data });
  } catch (error) {

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
    console.error('Profil verisi alınamadı:', err.response?.status, err.response?.data);
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

      throw error;
    }
  },

logout: async () => {
  try {
    await axiosInstance.post('/auth/logout');
    set({ authUser: null });
    return true;        
  } catch (error) {
    console.log('Logout error:', error);
    return false;
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

    if (!avatarFile) throw new Error('Dosya seçilmedi');
    if (!/^image\//.test(avatarFile.type)) throw new Error('Sadece görsel yükleyebilirsiniz.');
    const max = 10 * 1024 * 1024; // 10MB
    if (avatarFile.size > max) throw new Error('Dosya 10MB sınırını aşıyor.');

    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const res = await axiosInstance.post('/auth/avatar', formData, {
        withCredentials: true,

        headers: {},
      });

      const newUrl = res.data?.avatar;
      if (!newUrl) throw new Error('Sunucudan avatar URL dönmedi.');

      // Store'daki authUser'ı anında güncelle
      const current = get().authUser || {};
      set({ authUser: { ...current, profile_picture_url: newUrl } });

      return newUrl;
    } catch (error) {
      console.log('Update avatar error:', error);
      throw error;
    }
  },
}));