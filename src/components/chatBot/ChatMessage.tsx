import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import type { Message } from '../../types/chat';
import '../../scss/components/_animations.scss';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-slate-900 text-white'
            : 'bg-slate-200 text-slate-900'
        }`}
      >
        {isUser ? <User size={16} /> : <Sparkles size={16} />}
      </div>

      {/* Message content */}
      <div
        className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}
      >
        <div
          className={`inline-block px-4 py-2 rounded-2xl ${
            isUser
              ? 'bg-slate-900 text-white rounded-br-sm'
              : 'bg-slate-100 text-slate-900 rounded-bl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        
        {/* Timestamp */}
        <p className="text-xs text-slate-500 mt-1 px-1">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </motion.div>
  );
};

// Typing indicator for AI response
export const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3 mb-4"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 text-slate-900 flex items-center justify-center">
        <Sparkles size={16} />
      </div>

      {/* Typing animation - CSS so it keeps running when main thread is busy */}
      <div className="inline-block px-4 py-3 rounded-2xl bg-slate-100 rounded-bl-sm">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 bg-slate-400 rounded-full inline-block"
              style={{
                animation: 'typing-dot 0.6s ease-in-out infinite',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Helper function to format time
function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'Just now';
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }
  
  // Same day
  if (now.toDateString() === date.toDateString()) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
  
  // Different day
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
