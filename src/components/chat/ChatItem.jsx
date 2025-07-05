import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useChatStore } from '@stores/chatStore';
import { useLanguageStore } from '@stores/languageStore';
import { useAnalyticsStore } from '@stores/analyticsStore';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/common/SafeIcon';

const { FiMoreHorizontal, FiEdit2, FiTrash2, FiCopy, FiSettings } = FiIcons;

function ChatItem({ chat, isActive, onClick, agent }) {
  const { updateChat, deleteChat, duplicateChat } = useChatStore();
  const { t } = useLanguageStore();
  const { track } = useAnalyticsStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(chat.name);

  const handleRename = async () => {
    if (editName.trim() && editName !== chat.name) {
      try {
        await updateChat(chat.id, { name: editName.trim() });
        track('chat_renamed', { chatId: chat.id });
      } catch (error) {
        console.error('Failed to rename chat:', error);
      }
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await deleteChat(chat.id);
        track('chat_deleted', { chatId: chat.id });
      } catch (error) {
        console.error('Failed to delete chat:', error);
      }
    }
    setShowMenu(false);
  };

  const handleDuplicate = async () => {
    try {
      await duplicateChat(chat.id);
      track('chat_duplicated', { chatId: chat.id });
    } catch (error) {
      console.error('Failed to duplicate chat:', error);
    }
    setShowMenu(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditName(chat.name);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative group p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
            {agent?.name?.[0] || 'A'}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRename}
              onKeyPress={handleKeyPress}
              className="w-full bg-transparent border-none outline-none text-sm font-medium text-gray-900 dark:text-white"
              autoFocus
            />
          ) : (
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {chat.name}
            </h3>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {agent?.name || 'AI Agent'}
          </p>
        </div>

        <div className="flex-shrink-0 relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <SafeIcon icon={FiMoreHorizontal} className="h-4 w-4" />
          </button>

          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10 min-w-[120px]"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <SafeIcon icon={FiEdit2} className="h-4 w-4" />
                {t('chat.rename')}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicate();
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <SafeIcon icon={FiCopy} className="h-4 w-4" />
                {t('chat.duplicate')}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
              >
                <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                {t('common.delete')}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ChatItem;