import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { NoteCard } from './NoteCard';
import type { Note } from '../types';

interface NoteCarouselProps {
  notes: Note[];
  onViewAll?: () => void;
}

export const NoteCarousel: React.FC<NoteCarouselProps> = ({ notes, onViewAll }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        marginBottom: 12,
      }}>
        <h2 style={{ fontSize: 'var(--wn-text-xl)', fontWeight: 600 }}>Forgotten Notes</h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--wn-text-secondary)',
              fontSize: 'var(--wn-text-sm)',
              cursor: 'pointer',
              fontFamily: 'var(--wn-font)',
            }}
          >
            View All
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="wn-no-scrollbar"
        style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 8,
          scrollSnapType: 'x mandatory',
        }}
      >
        {notes.map((note, i) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            style={{ scrollSnapAlign: 'start' }}
          >
            <NoteCard note={note} variant="carousel" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
