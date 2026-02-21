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
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '48px 24px 16px',
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'var(--wn-bg)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--wn-text-primary)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          {!title && <span style={{ marginLeft: 4, fontSize: 'var(--wn-text-md)' }}>Back</span>}
        </button>

        {title && (
          <h1 style={{
            fontSize: 'var(--wn-text-lg)',
            fontWeight: 600,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}>
            {title}
          </h1>
        )}

        {rightAction || <div style={{ width: 36 }} />}
      </motion.header>
    );
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '48px 24px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'var(--wn-bg)',
      }}
    >
      <button
        onClick={openSidebar}
        aria-label="Open menu"
        style={{
          width: 48,
          height: 48,
          borderRadius: 'var(--wn-radius-md)',
          border: '1px solid var(--wn-border)',
          background: 'var(--wn-bg-light)',
          boxShadow: 'var(--wn-shadow-card-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <Menu size={20} color="var(--wn-text-primary)" />
      </button>

      <button
        onClick={() => navigate('/winote/search')}
        style={{
          flex: 1,
          height: 48,
          borderRadius: 'var(--wn-radius-xl)',
          border: '1px solid var(--wn-border)',
          background: 'var(--wn-bg-light)',
          boxShadow: 'var(--wn-shadow-inset)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          paddingLeft: 16,
          cursor: 'pointer',
          color: 'var(--wn-text-tertiary)',
          fontSize: 'var(--wn-text-base)',
          fontFamily: 'var(--wn-font)',
        }}
      >
        <Search size={18} />
        <span>Search your memories...</span>
      </button>
    </motion.header>
  );
};
