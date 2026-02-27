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
      style={{
        width: isCarousel ? 220 : '100%',
        minHeight: isCarousel ? 220 : undefined,
        flexShrink: 0,
        background: bg,
        borderRadius: 'var(--wn-radius-lg)',
        boxShadow: 'var(--wn-shadow-card)',
        border: '1px solid var(--wn-border)',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'var(--wn-font)',
        color: 'var(--wn-text-primary)',
        overflow: 'hidden',
      }}
    >
      {/* Time / Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 'var(--wn-text-xs)', color: 'var(--wn-text-secondary)', fontWeight: showBadge ? 700 : 500 }}>
          {showBadge || (isCarousel ? formatDate(note.updatedAt) : formatTimeAgo(note.updatedAt))}
        </span>
        {note.isPinned && <Pin size={12} color="var(--wn-text-secondary)" />}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: isCarousel ? 'var(--wn-text-xl)' : 'var(--wn-text-lg)',
        fontWeight: 600,
        lineHeight: 1.3,
        marginBottom: 8,
      }}>
        {note.title}
      </h3>

      {/* Content preview */}
      {note.type === 'checklist' && note.checklist && (
        <ul style={{ listStyle: 'none', fontSize: 'var(--wn-text-xs)', color: 'var(--wn-text-secondary)', flex: 1 }}>
          {note.checklist.slice(0, 3).map((item) => (
            <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span style={{ textDecoration: item.checked ? 'line-through' : 'none' }}>{item.text}</span>
            </li>
          ))}
        </ul>
      )}

      {note.type === 'text' && note.content && (
        <p style={{
          fontSize: 'var(--wn-text-xs)',
          color: 'var(--wn-text-secondary)',
          lineHeight: 1.5,
          flex: 1,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: isCarousel ? 2 : 3,
          WebkitBoxOrient: 'vertical',
        }}>
          {note.content}
        </p>
      )}

      {note.type === 'audio' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flex: 1 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--wn-accent-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Play size={12} color="white" fill="white" />
          </div>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--wn-accent-green)', opacity: 0.3 }} />
          <span style={{ fontSize: 'var(--wn-text-xs)', color: 'var(--wn-text-secondary)' }}>{note.audioDuration}</span>
        </div>
      )}

      {note.type === 'image' && (
        <div style={{
          flex: 1,
          background: 'var(--wn-card-lavender)',
          borderRadius: 'var(--wn-radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 60,
          marginBottom: 4,
        }}>
          <Image size={24} color="var(--wn-text-tertiary)" />
        </div>
      )}

      {/* Bottom: Category / Tags */}
      <div style={{ display: 'flex', gap: 6, marginTop: 'auto', paddingTop: 8, flexWrap: 'wrap' }}>
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
