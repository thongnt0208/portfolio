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
      <div className="flex justify-between items-center px-6 mb-3">
        <h2 className="text-wn-xl font-bold text-wn-text-primary font-wn leading-7">Forgotten Notes</h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="bg-transparent border-none text-wn-text-secondary text-wn-sm cursor-pointer font-wn"
          >
            View All
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="wn-no-scrollbar flex gap-5 overflow-x-auto px-6 py-6 snap-x snap-mandatory -my-4"
      >
        {notes.map((note, i) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="snap-start"
          >
            <div className={`${i === 0 ? 'ml-5' : ''}`}>
              <NoteCard note={note} variant="carousel" />
              </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
