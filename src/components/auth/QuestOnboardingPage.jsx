import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { OnBoarding } from '@questlabs/react-sdk';
import { useAuth } from '@/contexts/AuthContext';
import questConfig from '@/config/questConfig';

function QuestOnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [answers, setAnswers] = useState({});

  const getAnswers = () => {
    // Called when onboarding is complete
    console.log('Onboarding completed with answers:', answers);
    
    // Navigate to main application
    navigate('/');
  };

  // Redirect if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex">
      {/* Left Section - Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl font-bold mb-8 mx-auto backdrop-blur-sm">
              🚀
            </div>
            <h1 className="text-4xl font-bold mb-4">Let's Get Started!</h1>
            <p className="text-xl text-green-100 mb-8">
              We're setting up your personalized AI workspace
            </p>
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span>Configure your preferences</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span>Set up your AI agents</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span>Connect your workflows</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400 bg-opacity-20 rounded-full blur-xl"></div>
      </div>

      {/* Right Section - Onboarding Component */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  LC
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome to Loop Chat
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Let's personalize your experience
                </p>
              </div>
            </div>

            <div className="quest-onboarding-container" style={{ width: '400px', height: 'auto' }}>
              <OnBoarding
                userId={user.userId}
                token={user.token}
                questId={questConfig.QUEST_ONBOARDING_QUESTID}
                answer={answers}
                setAnswer={setAnswers}
                getAnswers={getAnswers}
                accent={questConfig.PRIMARY_COLOR}
                singleChoose="modal1"
                multiChoice="modal2"
              >
                <OnBoarding.Header />
                <OnBoarding.Content />
                <OnBoarding.Footer />
              </OnBoarding>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default QuestOnboardingPage;