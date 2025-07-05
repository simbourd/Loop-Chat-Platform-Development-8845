import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@stores/languageStore';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/common/SafeIcon';
import AgentsTab from './AgentsTab';
import ProfileTab from './ProfileTab';
import TutorialsTab from './TutorialsTab';
import PreferencesTab from './PreferencesTab';
import LanguageTab from './LanguageTab';

const { FiX, FiUsers, FiUser, FiBook, FiSettings, FiGlobe } = FiIcons;

function SettingsPanel({ onClose }) {
  const { t } = useLanguageStore();
  const [activeTab, setActiveTab] = useState('agents');

  const tabs = [
    { id: 'agents', label: t('settings.agents'), icon: FiUsers },
    { id: 'profile', label: t('settings.profile'), icon: FiUser },
    { id: 'tutorials', label: t('settings.tutorials'), icon: FiBook },
    { id: 'preferences', label: t('settings.preferences'), icon: FiSettings },
    { id: 'language', label: t('settings.language'), icon: FiGlobe }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'agents':
        return <AgentsTab />;
      case 'profile':
        return <ProfileTab />;
      case 'tutorials':
        return <TutorialsTab />;
      case 'preferences':
        return <PreferencesTab />;
      case 'language':
        return <LanguageTab />;
      default:
        return <AgentsTab />;
    }
  };

  return (
    <div className="flex h-full max-h-[90vh]">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('settings.settings')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <SafeIcon icon={FiX} className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-1">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="h-5 w-5" />
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="p-6"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
}

export default SettingsPanel;