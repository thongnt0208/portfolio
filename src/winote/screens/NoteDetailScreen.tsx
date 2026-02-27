import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Settings2, Calendar, Clock } from 'lucide-react';
import { CategoryPills } from '../components/CategoryPills';
import { FormatToolbar } from '../components/FormatToolbar';
import { AIToolbar } from '../components/AIToolbar';
import { useNotesStore } from '../store/useNotesStore';

export const NoteDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const note = useNotesStore((s) => s.getNoteById(id || ''));
  const updateNote = useNotesStore((s) => s.updateNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [category, setCategory] = useState(note?.category || 'Personal');

  useEffect(() => {
    if (!note) {
      navigate('/winote', { replace: true });
    }
  }, [note, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (id && note) {
        updateNote(id, { title: title || 'Untitled Note', content, category });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [title, content, category, id, note, updateNote]);

  if (!note) return null;

  const dateStr = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
  const timeStr = new Date(note.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  function formatEditedAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Edited just now';
    if (mins < 60) return `Edited ${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `Edited ${hrs}h ago`;
    return `Edited ${Math.floor(hrs / 24)}d ago`;
  }

  const handleDelete = () => {
    deleteNote(note.id);
    navigate('/winote', { replace: true });
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
          onClick={() => navigate(-1)}
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

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 'var(--wn-radius-pill)',
          background: 'var(--wn-bg-light)',
          boxShadow: 'var(--wn-shadow-card-sm)',
          border: '1px solid var(--wn-border)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--wn-accent-green)' }} />
          <span style={{ fontSize: 'var(--wn-text-sm)', color: 'var(--wn-text-secondary)' }}>Auto-saved</span>
        </div>

        <button
          onClick={handleDelete}
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
          aria-label="Delete note"
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

      {/* Metadata */}
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
            {formatEditedAgo(note.updatedAt)}
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

        <div style={{ position: 'absolute', right: 24, bottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button style={{
            width: 40, height: 40, borderRadius: 'var(--wn-radius-md)',
            background: 'var(--wn-bg-light)', boxShadow: 'var(--wn-shadow-card-sm)',
            border: '1px solid var(--wn-border)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
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
