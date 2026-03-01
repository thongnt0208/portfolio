import React from 'react';
import { motion } from 'framer-motion';
import { NoteCard } from './NoteCard';
import type { Note } from '../types';

interface NoteGridProps {
  notes: Note[];
  showBadgeForFirst?: boolean;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
};

export const NoteGrid: React.FC<NoteGridProps> = ({ notes, showBadgeForFirst }) => {
  const col1: Note[] = [];
  const col2: Note[] = [];
  notes.forEach((n, i) => (i % 2 === 0 ? col1 : col2).push(n));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex gap-5 px-6"
    >
      <div className="flex-1 flex flex-col gap-5">
        {col1.map((note, i) => (
          <motion.div key={note.id} variants={item}>
            <NoteCard
              note={note}
              showBadge={showBadgeForFirst && i === 0 ? 'Best Match' : undefined}
            />
          </motion.div>
        ))}
      </div>
      <div className="flex-1 flex flex-col gap-5">
        {col2.map((note) => (
          <motion.div key={note.id} variants={item}>
            <NoteCard note={note} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
