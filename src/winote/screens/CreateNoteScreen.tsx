import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Settings2, Calendar, Clock } from 'lucide-react';
import { CategoryPills } from '../components/CategoryPills';
import { FormatToolbar } from '../components/FormatToolbar';
import { AIToolbar } from '../components/AIToolbar';
import { useNotesStore } from '../store/useNotesStore';
import ChevronLeftIcon from '@assets/winote/illustration/chevron-left.svg?react';

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
      className="flex flex-col min-h-[100dvh]"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between pt-14 px-6 pb-2 sticky top-0 z-20 bg-wn-bg">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-wn-bg shadow-wn-card-sm rounded-wn-lg border-none cursor-pointer text-[13px] font-medium font-wn text-wn-text-primary px-4 py-2.5"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Back
        </button>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-wn-pill bg-wn-bg shadow-wn-card-sm"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-wn-accent-green" />
          <span className="text-wn-xs text-wn-text-secondary font-wn">Auto-saved</span>
        </motion.div>

        <button
          className="w-10 h-10 rounded-wn-lg bg-wn-bg shadow-wn-card-sm border-none cursor-pointer flex items-center justify-center"
          aria-label="Delete"
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

      {/* Metadata chips */}
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
            Edited just now
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

        {/* Floating toolbar */}
        <div className="absolute right-6 bottom-4">
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
