import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAgentStore } from '@stores/agentStore';
import { useChatStore } from '@stores/chatStore';
import { useLanguageStore } from '@stores/languageStore';
import { useAnalyticsStore } from '@stores/analyticsStore';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/common/SafeIcon';

const { FiMessageCircle, FiPlus, FiZap, FiUsers, FiTrendingUp, FiCreditCard } = FiIcons;

function WelcomeScreen() {
  const navigate = useNavigate();
  const { agents } = useAgentStore();
  const { createChat } = useChatStore();
  const { t } = useLanguageStore();
  const { track } = useAnalyticsStore();

  const handleQuickStart = async (agent) => {
    try {
      const chatName = `Chat with ${agent.name}`;
      await createChat(chatName, agent.id);
      track('quick_start_chat', { agentId: agent.id });
    } catch (error) {
      console.error('Failed to create quick start chat:', error);
    }
  };

  const handleViewPricing = () => {
    navigate('/pricing');
    track('pricing_clicked_from_welcome');
  };

  const activeAgents = agents.filter(agent => agent.active).slice(0, 4);

  const features = [
    {
      icon: FiMessageCircle,
      title: 'Real-time Chat',
      description: 'Instant messaging with AI agents'
    },
    {
      icon: FiZap,
      title: 'Webhook Integration',
      description: 'Connect with n8n and Make.com'
    },
    {
      icon: FiUsers,
      title: 'Multi-Agent Support',
      description: 'Chat with different AI specialists'
    },
    {
      icon: FiTrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track usage and performance'
    }
  ];

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto px-6"
      >
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6"
          >
            LC
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Loop Chat
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Your collaborative AI chat platform with flow-style integrations
          </p>
          
          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={handleViewPricing}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl mb-12"
          >
            <SafeIcon icon={FiCreditCard} className="h-5 w-5" />
            Upgrade to Pro
          </motion.button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <SafeIcon icon={feature.icon} className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quick Start */}
        {activeAgents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Quick Start
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Start chatting with one of our AI agents
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeAgents.map((agent) => (
                <motion.button
                  key={agent.id}
                  onClick={() => handleQuickStart(agent)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {agent.name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {agent.platform}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {agent.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default WelcomeScreen;