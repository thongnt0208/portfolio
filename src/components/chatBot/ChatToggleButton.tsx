import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useAIChatContext } from '../../contexts/AIChatContext';

interface ChatToggleButtonProps {
  onClick: () => void;
}

const pillConfig = {
  webgpu: { color: '#22c55e', label: 'WebGPU' },
  onnx:   { color: '#3b82f6', label: 'ONNX' },
  detecting: { color: '#9ca3af', label: 'Detecting' },
  error:  { color: '#ef4444', label: 'Error' },
} as const;

export const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ onClick }) => {
  const { backend } = useAIChatContext();
  const [hasOpened, setHasOpened] = useState(false);

  const handleClick = () => {
    setHasOpened(true);
    onClick();
  };

  const showPill = hasOpened && backend !== 'detecting';
  const pill = pillConfig[backend];

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-8 left-[calc(50%-1.75rem)] -translate-x-1/2 md:bottom-[210px] md:left-auto md:right-6 md:translate-x-0 
               w-14 h-14 bg-slate-900 text-white rounded-full shadow-lg hover:shadow-xl 
               flex items-center justify-center z-40 transition-shadow duration-200"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      aria-label="Open chat"
    >
      <span className="relative flex items-center justify-center">
        <MessageCircle size={24} />
        <span className="absolute text-[10px] font-semibold tracking-tight">AI</span>
      </span>

      {/* Pulse animation ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-slate-900 -z-10"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Backend state dot */}
      {showPill && (
        <motion.span
          key={backend}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          title={pill.label}
          style={{ backgroundColor: pill.color }}
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm"
        />
      )}
    </motion.button>
  );
};
