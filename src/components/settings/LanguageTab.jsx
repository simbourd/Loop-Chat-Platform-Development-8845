import React from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@stores/languageStore';
import { useAnalyticsStore } from '@stores/analyticsStore';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/common/SafeIcon';

const { FiGlobe, FiCheck } = FiIcons;

function LanguageTab() {
  const { currentLanguage, languages, setLanguage, isLoading } = useLanguageStore();
  const { track } = useAnalyticsStore();

  const handleLanguageChange = async (languageCode) => {
    if (languageCode === currentLanguage) return;
    
    try {
      await setLanguage(languageCode);
      track('language_changed', { from: currentLanguage, to: languageCode });
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <SafeIcon icon={FiGlobe} className="h-6 w-6" />
          Language Settings
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Choose your preferred language for the interface
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid gap-3">
          {Object.entries(languages).map(([code, language]) => (
            <motion.button
              key={code}
              onClick={() => handleLanguageChange(code)}
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                currentLanguage === code
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {getLanguageFlag(code)}
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {language.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {code.toUpperCase()}
                  </p>
                </div>
              </div>
              
              {currentLanguage === code && (
                <SafeIcon icon={FiCheck} className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Need a language that's not listed?
        </h4>
        <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
          We're constantly adding new languages. Let us know which language you'd like to see supported.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
          Request Language
        </button>
      </div>
    </div>
  );
}

// Helper function to get flag emoji for language
function getLanguageFlag(code) {
  const flags = {
    en: '🇺🇸',
    es: '🇪🇸',
    fr: '🇫🇷',
    de: '🇩🇪',
    it: '🇮🇹',
    pt: '🇵🇹',
    ru: '🇷🇺',
    ja: '🇯🇵',
    ko: '🇰🇷',
    zh: '🇨🇳'
  };
  return flags[code] || '🌐';
}

export default LanguageTab;