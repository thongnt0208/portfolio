import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Settings2, Calendar, Clock } from 'lucide-react';
import { CategoryPills } from '../components/CategoryPills';
import { FormatToolbar } from '../components/FormatToolbar';
import { AIToolbar } from '../components/AIToolbar';
import { useNotesStore } from '../store/useNotesStore';

export const CreateNoteScreen: React.FC = () => {
  const navigate = useNavigate();
  const createNote = useNotesStore((s) => s.createNote);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Personal');

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleBack = () => {
    if (title || content) {
      createNote({
        title: title || 'Untitled Note',
        content,
        type: 'text',
        category,
        tags: [category.toLowerCase()],
        isPinned: false,
      });
    }
    navigate(-1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}
    >
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '48px 24px 8px',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'var(--wn-bg)',
      }}>
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'var(--wn-text-base)',
            fontFamily: 'var(--wn-font)',
            color: 'var(--wn-text-primary)',
            padding: '8px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 'var(--wn-radius-pill)',
            background: 'var(--wn-bg-light)',
            boxShadow: 'var(--wn-shadow-card-sm)',
            border: '1px solid var(--wn-border)',
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--wn-accent-green)' }} />
          <span style={{ fontSize: 'var(--wn-text-sm)', color: 'var(--wn-text-secondary)' }}>Auto-saved</span>
        </motion.div>

        <button
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--wn-radius-md)',
            background: 'var(--wn-bg-light)',
            boxShadow: 'var(--wn-shadow-card-sm)',
            border: '1px solid var(--wn-border)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Delete"
        >
          <Trash2 size={18} color="var(--wn-text-secondary)" />
        </button>
      </div>

      {/* Title */}
      <div style={{ padding: '16px 24px 0' }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Note"
          style={{
            width: '100%',
            border: 'none',
            background: 'none',
            outline: 'none',
            fontSize: 'var(--wn-text-3xl)',
            fontWeight: 600,
            fontFamily: 'var(--wn-font)',
            color: title ? 'var(--wn-text-primary)' : 'var(--wn-text-tertiary)',
          }}
        />
      </div>

      {/* Metadata chips */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 24px', flexWrap: 'wrap' }}>
        <div className="clay-card-sm" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px' }}>
          <Calendar size={14} color="var(--wn-text-secondary)" />
          <span style={{ fontSize: 'var(--wn-text-sm)', color: 'var(--wn-text-secondary)' }}>
            {dateStr} • {timeStr}
          </span>
        </div>
        <div className="clay-card-sm" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px' }}>
          <Clock size={14} color="var(--wn-text-secondary)" />
          <span style={{ fontSize: 'var(--wn-text-sm)', color: 'var(--wn-text-secondary)' }}>
            Edited just now
          </span>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '8px 24px 16px' }}>
        <CategoryPills active={category} onChange={setCategory} />
      </div>

      {/* Editor */}
      <div style={{ flex: 1, padding: '0 24px', position: 'relative' }}>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your thoughts..."
          style={{
            width: '100%',
            minHeight: 300,
            border: 'none',
            background: 'none',
            outline: 'none',
            fontSize: 'var(--wn-text-md)',
            fontFamily: 'var(--wn-font)',
            color: 'var(--wn-text-primary)',
            lineHeight: 1.8,
            resize: 'none',
          }}
        />

        {/* Floating toolbar */}
        <div style={{
          position: 'absolute',
          right: 24,
          bottom: 16,
        }}>
          <button
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--wn-radius-md)',
              background: 'var(--wn-bg-light)',
              boxShadow: 'var(--wn-shadow-card-sm)',
              border: '1px solid var(--wn-border)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Settings2 size={18} color="var(--wn-text-secondary)" />
          </button>
        </div>
      </div>

      {/* AI Toolbar */}
      <div style={{ padding: '0 16px 8px' }}>
        <AIToolbar />
      </div>

      {/* Format Toolbar */}
      <div style={{ padding: '0 16px 24px' }}>
        <FormatToolbar />
      </div>
    </motion.div>
  );
};
