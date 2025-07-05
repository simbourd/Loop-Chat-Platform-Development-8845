import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock chat service for development
const mockChatService = {
  async getChats() {
    return [
      {
        id: 'general-chat',
        name: 'General Chat',
        agentId: 'chef-agent',
        createdAt: new Date().toISOString()
      }
    ];
  },

  async createChat(name, agentId) {
    return {
      id: `chat-${Date.now()}`,
      name,
      agentId,
      createdAt: new Date().toISOString()
    };
  },

  async getMessages(chatId) {
    return [
      {
        id: 'welcome-msg',
        content: 'Hello! How can I help you today?',
        sender: 'agent',
        timestamp: new Date().toISOString()
      }
    ];
  },

  async sendMessage(chatId, content, attachments = []) {
    return {
      id: `msg-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      attachments
    };
  },

  async updateChat(chatId, updates) {
    return { id: chatId, ...updates };
  },

  async deleteChat(chatId) {
    return { success: true };
  }
};

export const useChatStore = create(
  persist(
    (set, get) => ({
      chats: [],
      activeChat: null,
      messages: {},
      isLoading: false,
      error: null,

      loadChats: async () => {
        try {
          set({ isLoading: true });
          const chats = await mockChatService.getChats();
          set({ chats, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      createChat: async (name, agentId) => {
        try {
          const newChat = await mockChatService.createChat(name, agentId);
          set(state => ({
            chats: [newChat, ...state.chats],
            activeChat: newChat.id,
            messages: { ...state.messages, [newChat.id]: [] }
          }));
          return newChat;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      selectChat: async (chatId) => {
        try {
          set({ activeChat: chatId });
          const state = get();
          if (!state.messages[chatId]) {
            const messages = await mockChatService.getMessages(chatId);
            set(state => ({
              messages: { ...state.messages, [chatId]: messages }
            }));
          }
        } catch (error) {
          set({ error: error.message });
        }
      },

      sendMessage: async (chatId, content, attachments = []) => {
        try {
          const tempMessage = {
            id: `temp-${Date.now()}`,
            content,
            sender: 'user',
            timestamp: new Date().toISOString(),
            attachments
          };

          // Optimistically add message
          set(state => ({
            messages: {
              ...state.messages,
              [chatId]: [...(state.messages[chatId] || []), tempMessage]
            }
          }));

          const message = await mockChatService.sendMessage(chatId, content, attachments);

          // Replace temp message with real one
          set(state => ({
            messages: {
              ...state.messages,
              [chatId]: state.messages[chatId].map(msg => 
                msg.id === tempMessage.id ? message : msg
              )
            }
          }));

          return message;
        } catch (error) {
          // Remove temp message on error
          set(state => ({
            messages: {
              ...state.messages,
              [chatId]: state.messages[chatId].filter(msg => !msg.id.startsWith('temp-'))
            },
            error: error.message
          }));
          throw error;
        }
      },

      addMessage: (chatId, message) => {
        set(state => ({
          messages: {
            ...state.messages,
            [chatId]: [...(state.messages[chatId] || []), message]
          }
        }));
      },

      updateChat: async (chatId, updates) => {
        try {
          const updatedChat = await mockChatService.updateChat(chatId, updates);
          set(state => ({
            chats: state.chats.map(chat => 
              chat.id === chatId ? { ...chat, ...updatedChat } : chat
            )
          }));
          return updatedChat;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      deleteChat: async (chatId) => {
        try {
          await mockChatService.deleteChat(chatId);
          set(state => ({
            chats: state.chats.filter(chat => chat.id !== chatId),
            activeChat: state.activeChat === chatId ? null : state.activeChat,
            messages: { ...state.messages, [chatId]: undefined }
          }));
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      duplicateChat: async (chatId) => {
        try {
          const chat = get().chats.find(c => c.id === chatId);
          if (!chat) throw new Error('Chat not found');
          
          const newChat = await mockChatService.createChat(`${chat.name} (Copy)`, chat.agentId);
          set(state => ({
            chats: [newChat, ...state.chats],
            messages: { ...state.messages, [newChat.id]: [] }
          }));
          return newChat;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        chats: state.chats,
        activeChat: state.activeChat,
        messages: state.messages
      })
    }
  )
);