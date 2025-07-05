import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chatService } from '@services/chatService';

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
          const chats = await chatService.getChats();
          set({ chats, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      createChat: async (name, agentId) => {
        try {
          const newChat = await chatService.createChat(name, agentId);
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
            const messages = await chatService.getMessages(chatId);
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

          const message = await chatService.sendMessage(chatId, content, attachments);
          
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
          const updatedChat = await chatService.updateChat(chatId, updates);
          set(state => ({
            chats: state.chats.map(chat => 
              chat.id === chatId ? updatedChat : chat
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
          await chatService.deleteChat(chatId);
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
          
          const newChat = await chatService.createChat(`${chat.name} (Copy)`, chat.agentId);
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