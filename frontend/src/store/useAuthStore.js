import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // Login Action
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Gagal melakukan login. Periksa email dan password Anda.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  // Fetch Current User
  fetchMe: async () => {
    if (!get().token) return;
    set({ isLoading: true });
    try {
      const response = await api.get('/auth/me');
      const user = response.data.data.user;

      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (_err) {
      get().logout();
    }
  },

  // Logout Action
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (_e) {
      // Ignore logout server errors
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },
}));
