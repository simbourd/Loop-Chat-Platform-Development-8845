import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';
import { motion } from 'framer-motion';
import { AuthProvider } from '@/contexts/AuthContext';
import { useThemeStore } from '@stores/themeStore';
import { useLanguageStore } from '@stores/languageStore';
import { useSubscriptionStore } from '@stores/subscriptionStore';
import QuestLoginPage from '@components/auth/QuestLoginPage';
import QuestOnboardingPage from '@components/auth/QuestOnboardingPage';
import ChatLayout from '@components/layout/ChatLayout';
import AdminDashboard from '@components/admin/AdminDashboard';
import QuestProtectedRoute from '@components/auth/QuestProtectedRoute';
import LoadingSpinner from '@components/ui/LoadingSpinner';
import questConfig from '@/config/questConfig';
import './App.css';

function App() {
  const { theme } = useThemeStore();
  const { initializeLanguage } = useLanguageStore();
  const { loadSubscription } = useSubscriptionStore();

  React.useEffect(() => {
    initializeLanguage();
    loadSubscription();
  }, [initializeLanguage, loadSubscription]);

  return (
    <div className={theme}>
      <QuestProvider
        apiKey={questConfig.APIKEY}
        entityId={questConfig.ENTITYID}
        apiType="PRODUCTION"
      >
        <AuthProvider>
          <Router>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="min-h-screen bg-gray-50 dark:bg-gray-900"
            >
              <Routes>
                <Route path="/login" element={<QuestLoginPage />} />
                <Route 
                  path="/onboarding" 
                  element={
                    <QuestProtectedRoute>
                      <QuestOnboardingPage />
                    </QuestProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/*" 
                  element={
                    <QuestProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </QuestProtectedRoute>
                  } 
                />
                <Route 
                  path="/*" 
                  element={
                    <QuestProtectedRoute>
                      <ChatLayout />
                    </QuestProtectedRoute>
                  } 
                />
              </Routes>
            </motion.div>
          </Router>
        </AuthProvider>
      </QuestProvider>
    </div>
  );
}

export default App;