import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pin, Play, Image } from 'lucide-react';
import type { Note } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  Personal: 'var(--wn-card-green-light)',
  Work: 'var(--wn-card-green)',
  Business: 'var(--wn-card-yellow)',
  Ideas: 'var(--wn-bg-light)',
  Poetry: 'var(--wn-card-green-light)',
};

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hrs ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).toUpperCase();
}

interface NoteCardProps {
  note: Note;
  showBadge?: string;
  variant?: 'grid' | 'carousel';
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, showBadge, variant = 'grid' }) => {
  const navigate = useNavigate();
  const bg = CATEGORY_COLORS[note.category] || 'var(--wn-bg-light)';

  const isCarousel = variant === 'carousel';

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/winote/note/${note.id}`)}
      className={`${
        isCarousel ? 'w-[220px] min-h-[220px]' : 'w-full'
      } shrink-0 rounded-wn-lg shadow-wn-card border border-wn-border p-4 flex flex-col text-left cursor-pointer font-wn text-wn-text-primary overflow-hidden`}
      style={{ background: bg }}
    >
      {/* Time / Badge */}
      <div className="flex justify-between items-center mb-1.5">
        <span className={`text-wn-xs text-wn-text-secondary ${showBadge ? 'font-bold' : 'font-medium'}`}>
          {showBadge || (isCarousel ? formatDate(note.updatedAt) : formatTimeAgo(note.updatedAt))}
        </span>
        {note.isPinned && <Pin size={12} color="var(--wn-text-secondary)" />}
      </div>

      {/* Title */}
      <h3 className={`${isCarousel ? 'text-wn-xl' : 'text-wn-lg'} font-semibold leading-tight mb-2`}>
        {note.title}
      </h3>

      {/* Content preview */}
      {note.type === 'checklist' && note.checklist && (
        <ul className="list-none text-wn-xs text-wn-text-secondary flex-1">
          {note.checklist.slice(0, 3).map((item) => (
            <li key={item.id} className="flex items-center gap-1.5 mb-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span className={item.checked ? 'line-through' : ''}>{item.text}</span>
            </li>
          ))}
        </ul>
      )}

      {note.type === 'text' && note.content && (
        <p
          className={`text-wn-xs text-wn-text-secondary leading-normal flex-1 overflow-hidden`}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: isCarousel ? 2 : 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {note.content}
        </p>
      )}

      {note.type === 'audio' && (
        <div className="flex items-center gap-2 mt-1 flex-1">
          <div className="w-7 h-7 rounded-full bg-wn-accent-green flex items-center justify-center">
            <Play size={12} color="white" fill="white" />
          </div>
          <div className="flex-1 h-1 rounded-sm bg-wn-accent-green opacity-30" />
          <span className="text-wn-xs text-wn-text-secondary">{note.audioDuration}</span>
        </div>
      )}

      {note.type === 'image' && (
        <div className="flex-1 bg-wn-card-lavender rounded-wn-sm flex items-center justify-center min-h-[60px] mb-1">
          <Image size={24} color="var(--wn-text-tertiary)" />
        </div>
      )}

      {/* Bottom: Category / Tags */}
      <div className="flex gap-1.5 mt-auto pt-2 flex-wrap">
        {note.tags.length > 0 && variant === 'grid' && (
          note.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="clay-pill">
              {note.category === tag ? tag : `#${tag}`}
            </span>
          ))
        )}
        {isCarousel && note.category && (
          <span className="clay-pill">{note.category}</span>
        )}
        {!isCarousel && note.category && !note.tags.includes(note.category) && (
          <span className="clay-pill">{note.category}</span>
        )}
      </div>
    </motion.button>
  );
};
