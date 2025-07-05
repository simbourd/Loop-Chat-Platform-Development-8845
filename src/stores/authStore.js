import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@services/authService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      initialize: async () => {
        try {
          const user = await authService.getCurrentUser();
          set({ user, isAuthenticated: !!user, isLoading: false });
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const user = await authService.login(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      register: async (email, password, name) => {
        try {
          set({ isLoading: true, error: null });
          const user = await authService.register(email, password, name);
          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
          set({ user: null, isAuthenticated: false, error: null });
        } catch (error) {
          console.error('Logout error:', error);
          set({ user: null, isAuthenticated: false, error: null });
        }
      },

      updateProfile: async (updates) => {
        try {
          const updatedUser = await authService.updateProfile(updates);
          set({ user: updatedUser });
          return updatedUser;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);