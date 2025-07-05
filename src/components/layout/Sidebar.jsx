import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {useChatStore} from '@stores/chatStore';
import {useAgentStore} from '@stores/agentStore';
import {useLanguageStore} from '@stores/languageStore';
import {useAnalyticsStore} from '@stores/analyticsStore';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/common/SafeIcon';
import ChatItem from '../chat/ChatItem';
import NewChatModal from '../chat/NewChatModal';

const {FiPlus, FiSettings, FiMessageCircle, FiCreditCard} = FiIcons;

function Sidebar({onSettingsClick}) {
  const navigate = useNavigate();
  const {chats, activeChat, selectChat} = useChatStore();
  const {agents} = useAgentStore();
  const {t} = useLanguageStore();
  const {track} = useAnalyticsStore();
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  const handleChatSelect = (chatId) => {
    selectChat(chatId);
    track('chat_selected', {chatId});
  };

  const handleNewChat = () => {
    setShowNewChatModal(true);
    track('new_chat_clicked');
  };

  const handlePricingClick = () => {
    navigate('/pricing');
    track('pricing_page_visited');
  };

  // Find the general chat (managed by Chef Agent)
  const generalChat = chats.find(chat => 
    agents.find(agent => agent.id === chat.agentId && agent.name === 'Chef Agent')
  );
  const otherChats = chats.filter(chat => chat.id !== generalChat?.id);

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Loop Chat
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePricingClick}
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="View Pricing"
            >
              <SafeIcon icon={FiCreditCard} className="h-5 w-5" />
            </button>
            <button
              onClick={onSettingsClick}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <SafeIcon icon={FiSettings} className="h-5 w-5" />
            </button>
          </div>
        </div>
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          {t('chat.newChat')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-2">
          {/* General Channel */}
          {generalChat && (
            <div className="mb-4">
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                General
              </h3>
              <ChatItem
                chat={generalChat}
                isActive={activeChat === generalChat.id}
                onClick={() => handleChatSelect(generalChat.id)}
                agent={agents.find(a => a.id === generalChat.agentId)}
              />
            </div>
          )}

          {/* Direct Messages */}
          {otherChats.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Direct Messages
              </h3>
              <div className="space-y-1">
                {otherChats.map(chat => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChat === chat.id}
                    onClick={() => handleChatSelect(chat.id)}
                    agent={agents.find(a => a.id === chat.agentId)}
                  />
                ))}
              </div>
            </div>
          )}

          {chats.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <SafeIcon icon={FiMessageCircle} className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No chats yet</p>
              <p className="text-xs">Create your first chat to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Upgrade to Pro
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Unlock advanced features and unlimited AI agents
          </p>
          <button
            onClick={handlePricingClick}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200"
          >
            View Plans
          </button>
        </div>
      </div>

      {showNewChatModal && (
        <NewChatModal
          onClose={() => setShowNewChatModal(false)}
          agents={agents}
        />
      )}
    </div>
  );
}

export default Sidebar;