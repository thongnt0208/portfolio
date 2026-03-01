import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../layout/Header';
import { NoteCarousel } from '../components/NoteCarousel';
import { NoteGrid } from '../components/NoteGrid';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { useNotesStore } from '../store/useNotesStore';
import { useUserStore } from '../store/useUserStore';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
}

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const notes = useNotesStore((s) => s.notes);
  const getForgottenNotes = useNotesStore((s) => s.getForgottenNotes);

  const forgottenNotes = getForgottenNotes();
  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="pb-[140px]"
    >
      <Header />

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="pt-2 px-6 pb-6"
      >
        <h1 className="text-wn-3xl font-bold leading-tight">
          {getGreeting()}
          <br />
          <span className="text-wn-accent-green">{user.name}</span>
        </h1>
      </motion.div>

      {/* Forgotten Notes Carousel */}
      {forgottenNotes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <NoteCarousel
            notes={forgottenNotes}
            onViewAll={() => navigate('/winote/search')}
          />
        </motion.div>
      )}

      {/* Your Collection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-wn-xl font-semibold px-6 mb-4">
          Your Collection
        </h2>

        <NoteGrid notes={recentNotes} />
      </motion.div>

      <FloatingActionButton />
    </motion.div>
  );
};
