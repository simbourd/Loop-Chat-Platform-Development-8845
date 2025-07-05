import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock subscription service for development
const mockSubscriptionService = {
  async getSubscriptionStatus() {
    // Check if user has paid subscription
    const userData = localStorage.getItem('subscription-storage');
    if (userData) {
      const parsed = JSON.parse(userData);
      return parsed.state?.subscription || null;
    }
    return null;
  },

  async updateSubscription(subscriptionData) {
    return {
      id: 'sub-' + Date.now(),
      status: 'active',
      plan: subscriptionData.plan,
      startDate: new Date().toISOString(),
      ...subscriptionData
    };
  }
};

export const useSubscriptionStore = create(
  persist(
    (set, get) => ({
      subscription: null,
      isLoading: false,
      error: null,

      loadSubscription: async () => {
        try {
          set({ isLoading: true });
          const subscription = await mockSubscriptionService.getSubscriptionStatus();
          set({ subscription, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      updateSubscription: async (subscriptionData) => {
        try {
          const updatedSubscription = await mockSubscriptionService.updateSubscription(subscriptionData);
          set({ subscription: updatedSubscription });
          return updatedSubscription;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      hasActiveSubscription: () => {
        const { subscription } = get();
        return subscription && subscription.status === 'active';
      },

      isPremiumPlan: () => {
        const { subscription } = get();
        return subscription && (subscription.plan === 'core' || subscription.plan === 'yearly');
      },

      clearSubscription: () => {
        set({ subscription: null });
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'subscription-storage',
      partialize: (state) => ({
        subscription: state.subscription
      })
    }
  )
);