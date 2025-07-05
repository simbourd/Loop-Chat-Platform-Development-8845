import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock agent service for development
const mockAgentService = {
  async getAgents() {
    // Return mock agents
    return [
      {
        id: 'chef-agent',
        name: 'Chef Agent',
        description: 'Culinary expert and recipe assistant',
        platform: 'n8n',
        webhookUrl: 'https://webhook.site/chef-agent',
        active: true
      },
      {
        id: 'data-analyst',
        name: 'Data Analyst',
        description: 'Data analysis and visualization expert',
        platform: 'make',
        webhookUrl: 'https://webhook.site/data-analyst',
        active: true
      },
      {
        id: 'content-writer',
        name: 'Content Writer',
        description: 'Creative writing and content creation',
        platform: 'n8n',
        webhookUrl: 'https://webhook.site/content-writer',
        active: true
      },
      {
        id: 'code-assistant',
        name: 'Code Assistant',
        description: 'Programming and development helper',
        platform: 'make',
        webhookUrl: 'https://webhook.site/code-assistant',
        active: false
      }
    ];
  },

  async createAgent(agentData) {
    const newAgent = {
      id: `agent-${Date.now()}`,
      ...agentData,
      createdAt: new Date().toISOString()
    };
    return newAgent;
  },

  async updateAgent(agentId, updates) {
    return { id: agentId, ...updates };
  },

  async deleteAgent(agentId) {
    return { success: true };
  }
};

export const useAgentStore = create(
  persist(
    (set, get) => ({
      agents: [],
      isLoading: false,
      error: null,

      loadAgents: async () => {
        try {
          set({ isLoading: true });
          const agents = await mockAgentService.getAgents();
          set({ agents, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      createAgent: async (agentData) => {
        try {
          const newAgent = await mockAgentService.createAgent(agentData);
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
          const updatedAgent = await mockAgentService.updateAgent(agentId, updates);
          set(state => ({
            agents: state.agents.map(agent => 
              agent.id === agentId ? { ...agent, ...updatedAgent } : agent
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
          await mockAgentService.deleteAgent(agentId);
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