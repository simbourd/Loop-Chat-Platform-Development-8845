import React, {useState, useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';
import {motion} from 'framer-motion';
import {useChatStore} from '@stores/chatStore';
import {useAgentStore} from '@stores/agentStore';
import Sidebar from './Sidebar';
import ChatWorkspace from '../chat/ChatWorkspace';
import SettingsPanel from '../settings/SettingsPanel';
import WelcomeScreen from '../chat/WelcomeScreen';
import PricingPage from '../pricing/PricingPage';

function ChatLayout() {
  const [showSettings, setShowSettings] = useState(false);
  const {loadChats, activeChat} = useChatStore();
  const {loadAgents} = useAgentStore();

  useEffect(() => {
    loadChats();
    loadAgents();
  }, [loadChats, loadAgents]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Routes>
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/*" element={
          <>
            <Sidebar onSettingsClick={() => setShowSettings(true)} />
            <div className="flex-1 flex flex-col">
              <Routes>
                <Route path="/" element={activeChat ? <ChatWorkspace /> : <WelcomeScreen />} />
                <Route path="/chat/:chatId" element={<ChatWorkspace />} />
              </Routes>
            </div>
            {showSettings && (
              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={() => setShowSettings(false)}
              >
                <motion.div
                  initial={{scale: 0.95, opacity: 0}}
                  animate={{scale: 1, opacity: 1}}
                  exit={{scale: 0.95, opacity: 0}}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <SettingsPanel onClose={() => setShowSettings(false)} />
                </motion.div>
              </motion.div>
            )}
          </>
        } />
      </Routes>
    </div>
  );
}

export default ChatLayout;