import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, X, SlidersHorizontal } from 'lucide-react';
import { FilterChips } from '../components/FilterChips';
import { NoteGrid } from '../components/NoteGrid';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { useNotesStore } from '../store/useNotesStore';
import type { FilterType } from '../types';

export const SearchScreen: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const notes = useNotesStore((s) => s.notes);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = React.useMemo(() => {
    let result = [...notes];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)) ||
          n.category.toLowerCase().includes(q)
      );
    }
    if (filter !== 'all') {
      result = result.filter((n) => n.type === filter);
    }
    result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return result;
  }, [notes, query, filter]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3 }}
      className="pb-[140px]"
    >
      {/* Search Header */}
      <div className="flex items-center gap-3 pt-12 px-6 pb-4 sticky top-0 z-20 bg-wn-bg">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="w-10 h-10 rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center shrink-0"
        >
          <ArrowLeft size={20} color="var(--wn-text-primary)" />
        </button>

        <div className="flex-1 flex items-center h-11 rounded-wn-xl bg-wn-bg-light shadow-wn-inset border border-wn-border px-4">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 border-none bg-transparent outline-none text-wn-base font-wn text-wn-text-primary"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="bg-transparent border-none cursor-pointer p-1"
            >
              <X size={16} color="var(--wn-text-tertiary)" />
            </button>
          )}
        </div>
      </div>

      {/* Results count + sort */}
      <div className="flex justify-between items-center pt-2 px-6 pb-3">
        <h1 className="text-wn-xl font-semibold">
          {filtered.length} results found
        </h1>
        <button className="flex items-center gap-1 bg-transparent border-none cursor-pointer text-wn-sm text-wn-text-secondary font-wn uppercase tracking-wide font-medium">
          <SlidersHorizontal size={12} />
          Newest
        </button>
      </div>

      {/* Filter Chips */}
      <div className="mb-5">
        <FilterChips active={filter} onChange={setFilter} />
      </div>

      {/* Results */}
      <NoteGrid notes={filtered} showBadgeForFirst={!!query} />

      {/* Advanced Search upsell */}
      {query && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 mx-6 p-5 rounded-wn-lg bg-wn-card-yellow shadow-wn-card border border-wn-border"
        >
          <h3 className="text-wn-lg font-bold mb-1.5">
            Advanced Search
          </h3>
          <p className="text-wn-sm text-wn-text-secondary leading-normal mb-3">
            Upgrade to Pro to search inside PDFs and handwritten notes.
          </p>
          <button
            onClick={() => navigate('/winote/premium')}
            className="bg-transparent border-none cursor-pointer text-wn-base font-semibold font-wn text-wn-text-primary flex items-center gap-1"
          >
            VIEW PLAN →
          </button>
        </motion.div>
      )}

      <FloatingActionButton />
    </motion.div>
  );
};
