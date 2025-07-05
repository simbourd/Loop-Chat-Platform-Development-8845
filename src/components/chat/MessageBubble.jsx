import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

function MessageBubble({ message, agent }) {
  const isUser = message.sender === 'user';
  const timestamp = new Date(message.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
          {agent?.name?.[0] || 'A'}
        </div>
      )}
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
        <div className={`message-bubble ${isUser ? 'user' : 'agent'}`}>
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              code: ({ children }) => (
                <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto text-sm font-mono">
                  {children}
                </pre>
              )
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        
        <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 ${isUser ? 'flex-row-reverse' : ''}`}>
          {!isUser && (
            <span className="font-medium">{agent?.name || 'AI Agent'}</span>
          )}
          <span>{format(timestamp, 'HH:mm')}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default MessageBubble;