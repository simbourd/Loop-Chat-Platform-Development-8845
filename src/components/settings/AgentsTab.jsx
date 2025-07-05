import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAgentStore } from '@stores/agentStore';
import { useSubscriptionStore } from '@stores/subscriptionStore';
import { useLanguageStore } from '@stores/languageStore';
import { useAnalyticsStore } from '@stores/analyticsStore';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/common/SafeIcon';

const { FiPlus, FiEdit3, FiTrash2, FiToggleLeft, FiToggleRight, FiExternalLink, FiLock, FiCreditCard } = FiIcons;

function AgentsTab() {
  const navigate = useNavigate();
  const { agents, createAgent, updateAgent, deleteAgent } = useAgentStore();
  const { hasActiveSubscription, isPremiumPlan, loadSubscription } = useSubscriptionStore();
  const { t } = useLanguageStore();
  const { track } = useAnalyticsStore();
  
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    platform: 'n8n',
    webhookUrl: '',
    active: true
  });

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  const canUseWebhooks = hasActiveSubscription() && isPremiumPlan();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if trying to add webhook without subscription
    if (formData.webhookUrl && !canUseWebhooks) {
      track('webhook_blocked_no_subscription');
      return;
    }

    try {
      if (editingAgent) {
        await updateAgent(editingAgent.id, formData);
        track('agent_updated', { agentId: editingAgent.id });
      } else {
        await createAgent(formData);
        track('agent_created', { platform: formData.platform });
      }
      
      setShowForm(false);
      setEditingAgent(null);
      setFormData({
        name: '',
        description: '',
        platform: 'n8n',
        webhookUrl: '',
        active: true
      });
    } catch (error) {
      console.error('Failed to save agent:', error);
    }
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      description: agent.description,
      platform: agent.platform,
      webhookUrl: agent.webhookUrl,
      active: agent.active
    });
    setShowForm(true);
  };

  const handleDelete = async (agent) => {
    if (window.confirm(`Are you sure you want to delete ${agent.name}?`)) {
      try {
        await deleteAgent(agent.id);
        track('agent_deleted', { agentId: agent.id });
      } catch (error) {
        console.error('Failed to delete agent:', error);
      }
    }
  };

  const handleToggleActive = async (agent) => {
    try {
      await updateAgent(agent.id, { active: !agent.active });
      track('agent_toggled', { agentId: agent.id, active: !agent.active });
    } catch (error) {
      console.error('Failed to toggle agent:', error);
    }
  };

  const handleUpgrade = () => {
    navigate('/pricing');
    track('upgrade_clicked_from_agents');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('settings.agents')}
        </h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          Add Agent
        </button>
      </div>

      {/* Subscription Warning */}
      {!canUseWebhooks && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <SafeIcon icon={FiLock} className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                Webhook Integration Requires Premium
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                To add webhook URLs and connect with n8n/Make.com, you need to upgrade to a premium plan.
              </p>
            </div>
            <button
              onClick={handleUpgrade}
              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <SafeIcon icon={FiCreditCard} className="h-4 w-4" />
              Upgrade Now
            </button>
          </div>
        </motion.div>
      )}

      {/* Agent Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6"
        >
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingAgent ? 'Edit Agent' : 'Add New Agent'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Platform
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="n8n">n8n</option>
                  <option value="make">Make.com</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Webhook URL
                </label>
                {!canUseWebhooks && (
                  <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                    <SafeIcon icon={FiLock} className="h-4 w-4" />
                    <span className="text-xs">Premium Required</span>
                  </div>
                )}
              </div>
              <input
                type="url"
                value={formData.webhookUrl}
                onChange={(e) => {
                  if (!canUseWebhooks && e.target.value) {
                    // Show upgrade modal or redirect
                    track('webhook_input_blocked');
                    return;
                  }
                  setFormData({ ...formData, webhookUrl: e.target.value });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  !canUseWebhooks 
                    ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder={canUseWebhooks ? "https://your-webhook-url.com" : "Upgrade to premium to add webhooks"}
                disabled={!canUseWebhooks}
              />
              {!canUseWebhooks && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Webhook integration is available with premium plans only.{' '}
                  <button
                    type="button"
                    onClick={handleUpgrade}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Upgrade now
                  </button>
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="active" className="text-sm text-gray-700 dark:text-gray-300">
                Active
              </label>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!canUseWebhooks && formData.webhookUrl}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {editingAgent ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingAgent(null);
                  setFormData({
                    name: '',
                    description: '',
                    platform: 'n8n',
                    webhookUrl: '',
                    active: true
                  });
                }}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Agents List */}
      <div className="space-y-4">
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                  {agent.name[0]}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {agent.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {agent.platform} • {agent.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(agent)}
                  className={`p-2 rounded-lg transition-colors ${
                    agent.active 
                      ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' 
                      : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <SafeIcon icon={agent.active ? FiToggleRight : FiToggleLeft} className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleEdit(agent)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <SafeIcon icon={FiEdit3} className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(agent)}
                  className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {agent.webhookUrl && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <SafeIcon icon={FiExternalLink} className="h-4 w-4" />
                <span className="truncate">{agent.webhookUrl}</span>
                {!canUseWebhooks && (
                  <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                    <SafeIcon icon={FiLock} className="h-3 w-3" />
                    <span className="text-xs">Premium</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AgentsTab;