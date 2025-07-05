import { create } from 'zustand';

export const useAnalyticsStore = create((set, get) => ({
  events: [],
  isTracking: true,

  track: (event, properties = {}) => {
    if (!get().isTracking) return;

    const eventData = {
      id: `event-${Date.now()}-${Math.random()}`,
      event,
      properties,
      timestamp: new Date().toISOString(),
      userId: null // Will be set by the service
    };

    set(state => ({
      events: [...state.events, eventData]
    }));

    // Batch send events
    get().flushEvents();
  },

  flushEvents: async () => {
    const { events } = get();
    if (events.length === 0) return;

    try {
      // Mock analytics service - in real app would send to analytics service
      console.log('Analytics events:', events);
      set({ events: [] });
    } catch (error) {
      console.error('Failed to send analytics events:', error);
    }
  },

  setTracking: (enabled) => {
    set({ isTracking: enabled });
  }
}));