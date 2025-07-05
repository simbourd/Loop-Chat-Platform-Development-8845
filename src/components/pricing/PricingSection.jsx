import React from 'react';
import { motion } from 'framer-motion';
import { useAnalyticsStore } from '@stores/analyticsStore';
import { useSubscriptionStore } from '@stores/subscriptionStore';
import { stripeConfig } from '@/config/stripeConfig';
import PricingCard from './PricingCard';

function PricingSection() {
  const { track } = useAnalyticsStore();
  const { updateSubscription } = useSubscriptionStore();

  const handlePlanSelection = async (plan) => {
    track('pricing_plan_selected', {
      planName: plan.name,
      amount: plan.amount,
      interval: plan.interval,
      priceId: plan.priceId
    });

    // Simulate successful subscription after redirect
    // In a real app, this would be handled by Stripe webhooks
    setTimeout(() => {
      updateSubscription({
        plan: plan.interval === 'year' ? 'yearly' : 'core',
        status: 'active',
        amount: plan.amount,
        interval: plan.interval
      });
    }, 2000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Unlock webhook integrations and advanced features with our premium plans
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {stripeConfig.paymentPlans.map((plan, index) => (
            <PricingCard
              key={plan.priceId}
              plan={plan}
              isPopular={plan.interval === 'year'}
              onSelectPlan={handlePlanSelection}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            All plans include webhook integrations, unlimited AI agents, and premium support.
          </p>
          <div className="flex justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <span>✓ Cancel anytime</span>
            <span>✓ Secure payments</span>
            <span>✓ 14-day free trial</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default PricingSection;