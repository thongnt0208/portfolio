import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Settings2, Calendar, Clock } from 'lucide-react';
import { CategoryPills } from '../components/CategoryPills';
import { FormatToolbar } from '../components/FormatToolbar';
import { AIToolbar } from '../components/AIToolbar';
import { useNotesStore } from '../store/useNotesStore';
import ChevronLeftIcon from '@assets/winote/illustration/chevron-left.svg?react';

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
      className="flex flex-col min-h-[100dvh]"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between pt-14 px-6 pb-2 sticky top-0 z-20 bg-wn-bg">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-wn-bg shadow-wn-card-sm rounded-wn-lg border-none cursor-pointer text-[13px] font-medium font-wn text-wn-text-primary px-4 py-2.5"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-wn-pill bg-wn-bg shadow-wn-card-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-wn-accent-green" />
          <span className="text-wn-xs text-wn-text-secondary font-wn">Auto-saved</span>
        </div>

        <button
          onClick={handleDelete}
          className="w-10 h-10 rounded-wn-lg bg-wn-bg shadow-wn-card-sm border-none cursor-pointer flex items-center justify-center"
          aria-label="Delete note"
        >
          <Trash2 size={18} className="text-wn-text-secondary" />
        </button>
      </div>

      {/* Title */}
      <div className="pt-4 px-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Note"
          className={`w-full border-none bg-transparent outline-none text-wn-3xl font-semibold font-wn ${
            title ? 'text-wn-text-primary' : 'text-wn-text-tertiary'
          }`}
        />
      </div>

      {/* Metadata */}
      <div className="flex gap-2 py-3 px-6 flex-wrap">
        <div className="flex items-center gap-2 py-1.5 px-3 bg-wn-bg shadow-wn-card-sm rounded-wn-lg">
          <Calendar size={14} className="text-wn-text-secondary" />
          <span className="text-wn-xs text-wn-text-secondary font-wn">
            {dateStr} • {timeStr}
          </span>
        </div>
        <div className="flex items-center gap-2 py-1.5 px-3 bg-wn-bg shadow-wn-card-sm rounded-wn-lg">
          <Clock size={14} className="text-wn-text-secondary" />
          <span className="text-wn-xs text-wn-text-secondary font-wn">
            {formatEditedAgo(note.updatedAt)}
          </span>
        </div>
      </div>

      {/* Categories */}
      <div className="pt-2 px-6 pb-4">
        <CategoryPills active={category} onChange={setCategory} />
      </div>

      {/* Editor */}
      <div className="flex-1 px-6 relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your thoughts..."
          className="w-full min-h-[300px] border-none bg-transparent outline-none text-wn-md font-wn text-wn-text-primary leading-[1.8] resize-none"
        />

        <div className="absolute right-6 bottom-4 flex flex-col gap-2">
          <button className="w-10 h-10 rounded-wn-lg bg-wn-bg shadow-wn-card-sm border-none cursor-pointer flex items-center justify-center">
            <Settings2 size={18} className="text-wn-text-secondary" />
          </button>
        </div>
      </div>

      {/* AI Toolbar */}
      <div className="px-4 pb-2">
        <AIToolbar />
      </div>

      {/* Format Toolbar */}
      <div className="px-4 pb-6">
        <FormatToolbar />
      </div>
    </motion.div>
  );
};
