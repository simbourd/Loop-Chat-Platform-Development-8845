import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const languages = {
  en: { name: 'English', code: 'en' },
  es: { name: 'Español', code: 'es' },
  fr: { name: 'Français', code: 'fr' },
  de: { name: 'Deutsch', code: 'de' },
  it: { name: 'Italiano', code: 'it' },
  pt: { name: 'Português', code: 'pt' },
  ru: { name: 'Русский', code: 'ru' },
  ja: { name: '日本語', code: 'ja' },
  ko: { name: '한국어', code: 'ko' },
  zh: { name: '中文', code: 'zh' }
};

const translations = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success'
    },
    auth: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      forgotPassword: 'Forgot Password?'
    },
    chat: {
      newChat: 'New Chat',
      typeMessage: 'Type a message...',
      send: 'Send',
      rename: 'Rename',
      duplicate: 'Duplicate',
      settings: 'Settings'
    },
    settings: {
      profile: 'Profile',
      agents: 'Agents',
      preferences: 'Preferences',
      tutorials: 'Tutorials',
      language: 'Language',
      theme: 'Theme',
      notifications: 'Notifications'
    }
  }
};

export const useLanguageStore = create(
  persist(
    (set, get) => ({
      currentLanguage: 'en',
      languages,
      translations,
      isLoading: false,

      initializeLanguage: () => {
        const savedLanguage = localStorage.getItem('language') || 'en';
        set({ currentLanguage: savedLanguage });
      },

      setLanguage: async (languageCode) => {
        try {
          set({ isLoading: true });
          
          // In a real app, you might fetch translations from an API
          await new Promise(resolve => setTimeout(resolve, 100));
          
          set({ currentLanguage: languageCode, isLoading: false });
          localStorage.setItem('language', languageCode);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      t: (key, params = {}) => {
        const { currentLanguage, translations } = get();
        const keys = key.split('.');
        let translation = translations[currentLanguage];
        
        for (const k of keys) {
          translation = translation?.[k];
        }
        
        if (!translation) {
          return key; // Fallback to key if translation not found
        }
        
        // Simple parameter replacement
        return Object.keys(params).reduce((str, param) => {
          return str.replace(`{{${param}}}`, params[param]);
        }, translation);
      }
    }),
    {
      name: 'language-storage',
      partialize: (state) => ({ currentLanguage: state.currentLanguage })
    }
  )
);