import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export const FloatingActionButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      className="clay-fab fixed bottom-[120px] z-[25]"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => navigate('/winote/note/new')}
      aria-label="Create new note"
      style={{ right: 'max(24px, calc((100vw - var(--wn-max-width)) / 2 + 24px))' }}
    >
      <Plus size={26} strokeWidth={2.5} />
    </motion.button>
  );
};
