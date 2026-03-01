import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';

interface HeaderProps {
  showBack?: boolean;
  title?: string;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ showBack, title, rightAction }) => {
  const navigate = useNavigate();
  const { openSidebar } = useUIStore();

  if (showBack || title) {
    return (
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between pt-12 px-6 pb-4 sticky top-0 z-20 bg-wn-bg"
      >
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="bg-transparent border-none cursor-pointer p-2 flex items-center text-wn-text-primary"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          {!title && <span className="ml-1 text-wn-md">Back</span>}
        </button>

        {title && (
          <h1 className="text-wn-lg font-semibold absolute left-1/2 -translate-x-1/2">
            {title}
          </h1>
        )}

        {rightAction || <div className="w-9" />}
      </motion.header>
    );
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 pt-12 px-6 pb-4 sticky top-0 z-20 bg-wn-bg"
    >
      <button
        onClick={openSidebar}
        aria-label="Open menu"
        className="w-12 h-12 rounded-wn-md border border-wn-border bg-wn-bg-light shadow-wn-card-sm flex items-center justify-center cursor-pointer shrink-0"
      >
        <Menu size={20} color="var(--wn-text-primary)" />
      </button>

      <button
        onClick={() => navigate('/winote/search')}
        className="flex-1 h-12 rounded-wn-xl border border-wn-border bg-wn-bg-light shadow-wn-inset flex items-center gap-3 pl-4 cursor-pointer text-wn-text-tertiary text-wn-base font-wn"
      >
        <Search size={18} />
        <span>Search your memories...</span>
      </button>
    </motion.header>
  );
};
