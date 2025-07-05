import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useChatStore } from '@stores/chatStore';
import { useAgentStore } from '@stores/agentStore';
import { useLanguageStore } from '@stores/languageStore';
import { useAnalyticsStore } from '@stores/analyticsStore';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/common/SafeIcon';

const { FiMessageCircle } = FiIcons;

function ChatWorkspace() {
  const { activeChat, messages, sendMessage, addMessage } = useChatStore();
  const { agents } = useAgentStore();
  const { t } = useLanguageStore();
  const { track } = useAnalyticsStore();
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const currentChat = useChatStore(state => 
    state.chats.find(chat => chat.id === activeChat)
  );
  const currentAgent = agents.find(agent => agent.id === currentChat?.agentId);
  const chatMessages = messages[activeChat] || [];

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content, attachments = []) => {
    if (!activeChat || !content.trim()) return;

    try {
      await sendMessage(activeChat, content, attachments);
      track('message_sent', { chatId: activeChat, agentId: currentAgent?.id });

      // Simulate AI response
      setIsTyping(true);
      setTimeout(() => {
        const aiResponse = {
          id: `ai-${Date.now()}`,
          content: `I understand you said: "${content}". How can I help you further?`,
          sender: 'agent',
          timestamp: new Date().toISOString(),
          agentId: currentAgent?.id
        };
        addMessage(activeChat, aiResponse);
        setIsTyping(false);
        track('ai_response_received', { chatId: activeChat, agentId: currentAgent?.id });
      }, 1000 + Math.random() * 2000);
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsTyping(false);
    }
  };

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <SafeIcon icon={FiMessageCircle} className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
            {currentAgent?.name?.[0] || 'A'}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentChat.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentAgent?.name || 'AI Agent'} • {currentAgent?.platform || 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
        <div className="space-y-4">
          {chatMessages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                {currentAgent?.name?.[0] || 'A'}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to {currentChat.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Start a conversation with {currentAgent?.name || 'AI Agent'}
              </p>
            </div>
          ) : (
            chatMessages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                agent={currentAgent}
              />
            ))
          )}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {currentAgent?.name?.[0] || 'A'}
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isTyping}
          placeholder={t('chat.typeMessage')}
        />
      </div>
    </div>
  );
}

export default ChatWorkspace;