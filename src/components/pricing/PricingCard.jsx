import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/common/SafeIcon';

const { FiCheck, FiCreditCard, FiZap } = FiIcons;

function PricingCard({ plan, isPopular = false, onSelectPlan }) {
  const handleSelectPlan = () => {
    // Open payment link in new tab
    window.open(plan.paymentLink, '_blank');
    
    // Track the selection
    if (onSelectPlan) {
      onSelectPlan(plan);
    }
  };

  const getFeatures = (planName) => {
    if (planName.includes('Core')) {
      return [
        'Unlimited AI conversations',
        '✨ Webhook integrations (n8n, Make.com)',
        'Standard support',
        'Up to 10 AI agents',
        'Basic analytics',
        'Real-time messaging'
      ];
    } else if (planName.includes('Yearly')) {
      return [
        'Everything in Core plan',
        '✨ Advanced webhook integrations',
        'Priority support',
        'Unlimited AI agents',
        'Advanced analytics & insights',
        'Custom integrations',
        'Team collaboration features',
        '💰 Save 25% with yearly billing'
      ];
    }
    return [];
  };

  const features = getFeatures(plan.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all duration-300 ${
        isPopular 
          ? 'border-blue-500 shadow-blue-500/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            🔥 Most Popular
          </span>
        </div>
      )}

      <div className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {plan.name}
          </h3>
          <div className="mb-4">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              ${plan.amount}
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">
              /{plan.interval}
            </span>
          </div>
          {plan.interval === 'year' && (
            <div className="inline-flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
              💰 Save 25%
            </div>
          )}
        </div>

        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <SafeIcon 
                icon={feature.includes('✨') ? FiZap : FiCheck} 
                className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                  feature.includes('✨') ? 'text-yellow-500' : 'text-green-500'
                }`} 
              />
              <span className="text-gray-700 dark:text-gray-300">
                {feature.replace('✨ ', '').replace('💰 ', '')}
              </span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleSelectPlan}
          className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
            isPopular 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg' 
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
          }`}
        >
          <SafeIcon icon={FiCreditCard} className="h-5 w-5" />
          Start Free Trial
        </button>
      </div>
    </motion.div>
  );
}

export default PricingCard;