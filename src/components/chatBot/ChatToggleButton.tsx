import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface ChatToggleButtonProps {
  onClick: () => void;
}

export const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white 
               rounded-full shadow-lg hover:shadow-xl flex items-center justify-center
               z-40 transition-shadow duration-200"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      aria-label="Open chat"
    >
      <MessageCircle size={24} />
      
      {/* Pulse animation ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-slate-900 -z-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.button>
  );
};
