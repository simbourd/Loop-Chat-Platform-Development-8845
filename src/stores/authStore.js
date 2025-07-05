import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock auth service for development
const mockAuthService = {
  async login(email, password) {
    // Mock successful login
    return {
      id: 'user-123',
      name: 'John Doe',
      email: email,
      isAdmin: email === 'admin@loopchat.com'
    };
  },

  async register(email, password, name) {
    // Mock successful registration
    return {
      id: 'user-' + Date.now(),
      name: name,
      email: email,
      isAdmin: false
    };
  },

  async logout() {
    // Mock logout
    return { success: true };
  },

  async getCurrentUser() {
    // Mock current user check
    const userData = localStorage.getItem('auth-storage');
    if (userData) {
      const parsed = JSON.parse(userData);
      return parsed.state?.user || null;
    }
    return null;
  },

  async updateProfile(updates) {
    // Mock profile update
    return { ...updates };
  }
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      initialize: async () => {
        try {
          const user = await mockAuthService.getCurrentUser();
          set({ 
            user, 
            isAuthenticated: !!user, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      },

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const user = await mockAuthService.login(email, password);
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return user;
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (email, password, name) => {
        try {
          set({ isLoading: true, error: null });
          const user = await mockAuthService.register(email, password, name);
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return user;
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await mockAuthService.logout();
          set({ 
            user: null, 
            isAuthenticated: false, 
            error: null 
          });
        } catch (error) {
          console.error('Logout error:', error);
          set({ 
            user: null, 
            isAuthenticated: false, 
            error: null 
          });
        }
      },

      updateProfile: async (updates) => {
        try {
          const updatedUser = await mockAuthService.updateProfile(updates);
          set({ user: { ...get().user, ...updatedUser } });
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
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);