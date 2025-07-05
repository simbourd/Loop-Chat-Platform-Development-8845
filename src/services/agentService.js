class AgentService {
  constructor() {
    this.baseURL = '/api/agents';
  }

  async getAgents() {
    const response = await fetch(this.baseURL, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch agents');
    }

    return response.json();
  }

  async createAgent(agentData) {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agentData),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to create agent');
    }

    return response.json();
  }

  async updateAgent(agentId, updates) {
    const response = await fetch(`${this.baseURL}/${agentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to update agent');
    }

    return response.json();
  }

  async deleteAgent(agentId) {
    const response = await fetch(`${this.baseURL}/${agentId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to delete agent');
    }
  }
}

export const agentService = new AgentService();