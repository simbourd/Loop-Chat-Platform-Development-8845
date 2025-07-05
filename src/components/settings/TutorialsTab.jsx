import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAnalyticsStore } from '@stores/analyticsStore';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/common/SafeIcon';

const { FiPlay, FiBook, FiMessageCircle, FiSettings, FiZap, FiCheck } = FiIcons;

function TutorialsTab() {
  const { track } = useAnalyticsStore();
  const [completedTutorials, setCompletedTutorials] = useState(new Set());

  const tutorials = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of Loop Chat and how to create your first conversation',
      icon: FiPlay,
      duration: '5 min',
      steps: [
        'Create your first chat',
        'Send your first message',
        'Explore the interface',
        'Understand AI responses'
      ]
    },
    {
      id: 'managing-agents',
      title: 'Managing AI Agents',
      description: 'Set up and configure AI agents for different tasks',
      icon: FiSettings,
      duration: '8 min',
      steps: [
        'Add a new agent',
        'Configure webhook URLs',
        'Set up n8n integration',
        'Test agent responses'
      ]
    },
    {
      id: 'advanced-features',
      title: 'Advanced Features',
      description: 'Explore advanced features like webhooks and integrations',
      icon: FiZap,
      duration: '12 min',
      steps: [
        'Webhook configuration',
        'Make.com integration',
        'Custom workflows',
        'Analytics tracking'
      ]
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      description: 'Tips and tricks for getting the most out of Loop Chat',
      icon: FiBook,
      duration: '6 min',
      steps: [
        'Writing effective prompts',
        'Organizing conversations',
        'Using multiple agents',
        'Monitoring performance'
      ]
    }
  ];

  const handleStartTutorial = (tutorial) => {
    track('tutorial_started', { tutorialId: tutorial.id });
    // In a real app, this would start an interactive tutorial
    console.log('Starting tutorial:', tutorial.title);
  };

  const handleCompleteTutorial = (tutorialId) => {
    setCompletedTutorials(prev => new Set([...prev, tutorialId]));
    track('tutorial_completed', { tutorialId });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tutorials
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Learn how to use Loop Chat effectively with our interactive guides
        </p>
      </div>

      <div className="grid gap-6">
        {tutorials.map((tutorial) => {
          const isCompleted = completedTutorials.has(tutorial.id);
          
          return (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white dark:bg-gray-800 rounded-lg p-6 border ${
                isCompleted 
                  ? 'border-green-200 dark:border-green-800' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    isCompleted 
                      ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  }`}>
                    <SafeIcon icon={isCompleted ? FiCheck : tutorial.icon} className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {tutorial.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {tutorial.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{tutorial.duration}</span>
                      <span>•</span>
                      <span>{tutorial.steps.length} steps</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {isCompleted ? (
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleStartTutorial(tutorial)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      Start Tutorial
                    </button>
                  )}
                </div>
              </div>
              
              {!isCompleted && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    What you'll learn:
                  </h5>
                  <ul className="space-y-1">
                    {tutorial.steps.map((step, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        {step}
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleCompleteTutorial(tutorial.id)}
                    className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Mark as completed
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Quick Help */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3 mb-3">
          <SafeIcon icon={FiMessageCircle} className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h4 className="font-semibold text-blue-900 dark:text-blue-100">
            Need Help?
          </h4>
        </div>
        <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
          If you have any questions or need assistance, feel free to reach out to our support team.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
          Contact Support
        </button>
      </div>
    </div>
  );
}

export default TutorialsTab;