import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, X, RefreshCw } from 'lucide-react';
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
      <div className="flex items-center gap-4 pt-14 px-6 pb-2 sticky top-0 z-20 bg-wn-bg">
        <div className="flex-1 flex items-center h-12 rounded-wn-pill bg-wn-card-gray shadow-wn-inset px-4 gap-3">
          <ArrowLeft
            size={20}
            className="text-wn-text-tertiary cursor-pointer shrink-0"
            onClick={() => navigate(-1)}
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 border-none bg-transparent outline-none text-[15px] font-medium font-wn text-wn-text-primary"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="bg-transparent border-none cursor-pointer p-1"
            >
              <X size={18} className="text-wn-text-tertiary" />
            </button>
          )}
        </div>
      </div>

      {/* Results count + reset */}
      <div className="flex justify-between items-center pt-4 px-6 pb-4">
        <h1 className="text-wn-xl font-bold text-wn-text-primary font-wn leading-7">
          {filtered.length} results found
        </h1>
        <button className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-wn-xs text-wn-text-tertiary font-wn uppercase tracking-[0.6px] font-bold">
          <RefreshCw size={12} className="text-wn-text-tertiary" />
          Reset
        </button>
      </div>

      {/* Filter Chips */}
      <div className="mb-5">
        <FilterChips active={filter} onChange={setFilter} />
      </div>

      {/* Results */}
      <NoteGrid notes={filtered} showBadgeForFirst={!!query} />

      <FloatingActionButton />
    </motion.div>
  );
};
