class ChatService {
  constructor() {
    this.baseURL = '/api/chats';
  }

  async getChats() {
    const response = await fetch(this.baseURL, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chats');
    }

    return response.json();
  }

  async createChat(name, agentId) {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, agentId }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to create chat');
    }

    return response.json();
  }

  async getMessages(chatId) {
    const response = await fetch(`${this.baseURL}/${chatId}/messages`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return response.json();
  }

  async sendMessage(chatId, content, attachments = []) {
    const response = await fetch(`${this.baseURL}/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, attachments }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  }

  async updateChat(chatId, updates) {
    const response = await fetch(`${this.baseURL}/${chatId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to update chat');
    }

    return response.json();
  }

  async deleteChat(chatId) {
    const response = await fetch(`${this.baseURL}/${chatId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to delete chat');
    }
  }

  async sendWebhook(chatId, agentId, message) {
    const response = await fetch(`${this.baseURL}/${chatId}/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ agentId, message }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to send webhook');
    }

    return response.json();
  }
}

export const chatService = new ChatService();