import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnalyticsStore } from '@stores/analyticsStore';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/common/SafeIcon';

const { FiToggleLeft, FiToggleRight, FiSettings, FiAlertCircle, FiSave } = FiIcons;

function TogglesTab() {
  const { track } = useAnalyticsStore();
  const [toggles, setToggles] = useState([]);
  const [globalBanner, setGlobalBanner] = useState({
    enabled: false,
    message: '',
    type: 'info'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadToggles();
  }, []);

  const loadToggles = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockToggles = [
        {
          id: 'new-chat-ui',
          name: 'New Chat UI',
          description: 'Enable the new chat interface design',
          enabled: true,
          category: 'UI'
        },
        {
          id: 'advanced-analytics',
          name: 'Advanced Analytics',
          description: 'Enable advanced analytics tracking',
          enabled: false,
          category: 'Analytics'
        },
        {
          id: 'webhook-integration',
          name: 'Webhook Integration',
          description: 'Enable webhook integration features',
          enabled: true,
          category: 'Integration'
        },
        {
          id: 'multi-language',
          name: 'Multi-language Support',
          description: 'Enable multi-language interface',
          enabled: true,
          category: 'Localization'
        },
        {
          id: 'premium-features',
          name: 'Premium Features',
          description: 'Enable premium subscription features',
          enabled: false,
          category: 'Billing'
        }
      ];
      
      setToggles(mockToggles);
      setGlobalBanner({
        enabled: false,
        message: 'Welcome to Loop Chat! We\'re excited to have you here.',
        type: 'info'
      });
    } catch (error) {
      console.error('Failed to load toggles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChange = async (toggleId, enabled) => {
    try {
      setToggles(toggles.map(toggle => 
        toggle.id === toggleId ? { ...toggle, enabled } : toggle
      ));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      track('admin_toggle_changed', { toggleId, enabled });
    } catch (error) {
      console.error('Failed to update toggle:', error);
    }
  };

  const handleSaveBanner = async () => {
    try {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      track('admin_banner_updated', { 
        enabled: globalBanner.enabled,
        type: globalBanner.type
      });
    } catch (error) {
      console.error('Failed to save banner:', error);
    } finally {
      setSaving(false);
    }
  };

  const groupedToggles = toggles.reduce((acc, toggle) => {
    if (!acc[toggle.category]) {
      acc[toggle.category] = [];
    }
    acc[toggle.category].push(toggle);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Feature Toggles & Settings
      </h2>

      {/* Global Banner Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <SafeIcon icon={FiAlertCircle} className="h-5 w-5" />
          Global Banner
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Enable Global Banner</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Show a banner message to all users
              </p>
            </div>
            <button
              onClick={() => setGlobalBanner({ ...globalBanner, enabled: !globalBanner.enabled })}
              className={`p-2 rounded-lg transition-colors ${
                globalBanner.enabled
                  ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                  : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <SafeIcon icon={globalBanner.enabled ? FiToggleRight : FiToggleLeft} className="h-6 w-6" />
            </button>
          </div>

          {globalBanner.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Banner Message
                </label>
                <textarea
                  value={globalBanner.message}
                  onChange={(e) => setGlobalBanner({ ...globalBanner, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter banner message..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Banner Type
                </label>
                <select
                  value={globalBanner.type}
                  onChange={(e) => setGlobalBanner({ ...globalBanner, type: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="success">Success</option>
                </select>
              </div>

              <button
                onClick={handleSaveBanner}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <SafeIcon icon={FiSave} className="h-4 w-4" />
                )}
                Save Banner
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="space-y-6">
        {Object.entries(groupedToggles).map(([category, categoryToggles]) => (
          <div key={category} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <SafeIcon icon={FiSettings} className="h-5 w-5" />
              {category}
            </h3>
            
            <div className="space-y-4">
              {categoryToggles.map((toggle) => (
                <motion.div
                  key={toggle.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {toggle.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {toggle.description}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleToggleChange(toggle.id, !toggle.enabled)}
                    className={`p-2 rounded-lg transition-colors ${
                      toggle.enabled
                        ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                        : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <SafeIcon icon={toggle.enabled ? FiToggleRight : FiToggleLeft} className="h-6 w-6" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TogglesTab;