import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@stores/authStore';
import { useLanguageStore } from '@stores/languageStore';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/common/SafeIcon';
import UsersTab from './UsersTab';
import StatsTab from './StatsTab';
import TogglesTab from './TogglesTab';

const { FiUsers, FiBarChart3, FiToggleLeft, FiArrowLeft } = FiIcons;

function AdminDashboard() {
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const [activeTab, setActiveTab] = useState('users');

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  const tabs = [
    { id: 'users', label: 'Users', icon: FiUsers },
    { id: 'stats', label: 'Statistics', icon: FiBarChart3 },
    { id: 'toggles', label: 'Feature Toggles', icon: FiToggleLeft }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersTab />;
      case 'stats':
        return <StatsTab />;
      case 'toggles':
        return <TogglesTab />;
      default:
        return <UsersTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <SafeIcon icon={FiArrowLeft} className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                Admin
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                {user?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;