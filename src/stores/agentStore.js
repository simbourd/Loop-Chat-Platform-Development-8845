import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { agentService } from '@services/agentService';

export const useAgentStore = create(
  persist(
    (set, get) => ({
      agents: [],
      isLoading: false,
      error: null,

      loadAgents: async () => {
        try {
          set({ isLoading: true });
          const agents = await agentService.getAgents();
          set({ agents, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      createAgent: async (agentData) => {
        try {
          const newAgent = await agentService.createAgent(agentData);
          set(state => ({
            agents: [...state.agents, newAgent]
          }));
          return newAgent;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      updateAgent: async (agentId, updates) => {
        try {
          const updatedAgent = await agentService.updateAgent(agentId, updates);
          set(state => ({
            agents: state.agents.map(agent => 
              agent.id === agentId ? updatedAgent : agent
            )
          }));
          return updatedAgent;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      deleteAgent: async (agentId) => {
        try {
          await agentService.deleteAgent(agentId);
          set(state => ({
            agents: state.agents.filter(agent => agent.id !== agentId)
          }));
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      getActiveAgents: () => {
        return get().agents.filter(agent => agent.active);
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'agent-storage',
      partialize: (state) => ({ agents: state.agents })
    }
  )
);