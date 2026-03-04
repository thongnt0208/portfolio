import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, ChevronLeft } from 'lucide-react';
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
        className="flex items-center justify-between pt-14 px-6 pb-2 sticky top-0 z-20 bg-wn-bg"
      >
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="bg-wn-bg shadow-wn-card-sm rounded-wn-lg border-none cursor-pointer px-4 py-2.5 flex items-center gap-2 text-wn-text-primary font-wn"
        >
          <ChevronLeft size={18} />
          {!title && <span className="text-[13px] font-medium leading-5">Back</span>}
        </button>

        {title && (
          <h1 className="text-wn-2xl font-bold absolute left-1/2 -translate-x-1/2 text-wn-text-primary font-wn leading-8">
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
      className="flex items-center gap-4 pt-14 px-6 pb-2 sticky top-0 z-20 bg-wn-bg"
    >
      <button
        onClick={openSidebar}
        aria-label="Open menu"
        className="w-12 h-12 rounded-wn-lg border-none bg-wn-bg shadow-wn-card-sm flex items-center justify-center cursor-pointer shrink-0"
      >
        <Menu size={24} className="text-wn-text-primary" />
      </button>

      <button
        onClick={() => navigate('/winote/search')}
        className="flex-1 h-12 rounded-wn-pill border-none bg-wn-card-gray shadow-wn-inset flex items-center gap-3 pl-4 cursor-pointer text-wn-text-tertiary text-[15px] font-medium font-wn"
      >
        <Search size={20} className="text-wn-text-tertiary" />
        <span>Search your memories...</span>
      </button>
    </motion.header>
  );
};
