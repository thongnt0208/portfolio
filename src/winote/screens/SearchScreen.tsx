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
      style={{ paddingBottom: 140 }}
    >
      {/* Search Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '48px 24px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'var(--wn-bg)',
      }}>
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={20} color="var(--wn-text-primary)" />
        </button>

        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          height: 44,
          borderRadius: 'var(--wn-radius-xl)',
          background: 'var(--wn-bg-light)',
          boxShadow: 'var(--wn-shadow-inset)',
          border: '1px solid var(--wn-border)',
          padding: '0 16px',
        }}>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            style={{
              flex: 1,
              border: 'none',
              background: 'none',
              outline: 'none',
              fontSize: 'var(--wn-text-base)',
              fontFamily: 'var(--wn-font)',
              color: 'var(--wn-text-primary)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            >
              <X size={16} color="var(--wn-text-tertiary)" />
            </button>
          )}
        </div>
      </div>

      {/* Results count + sort */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 24px 12px',
      }}>
        <h1 style={{ fontSize: 'var(--wn-text-xl)', fontWeight: 600 }}>
          {filtered.length} results found
        </h1>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--wn-text-sm)',
          color: 'var(--wn-text-secondary)',
          fontFamily: 'var(--wn-font)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          fontWeight: 500,
        }}>
          <SlidersHorizontal size={12} />
          Newest
        </button>
      </div>

      {/* Filter Chips */}
      <div style={{ marginBottom: 20 }}>
        <FilterChips active={filter} onChange={setFilter} />
      </div>

      {/* Results */}
      <NoteGrid notes={filtered} showBadgeForFirst={!!query} />

      {/* Advanced Search upsell */}
      {query && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            margin: '20px 24px 0',
            padding: 20,
            borderRadius: 'var(--wn-radius-lg)',
            background: 'var(--wn-card-yellow)',
            boxShadow: 'var(--wn-shadow-card)',
            border: '1px solid var(--wn-border)',
          }}
        >
          <h3 style={{ fontSize: 'var(--wn-text-lg)', fontWeight: 700, marginBottom: 6 }}>
            Advanced Search
          </h3>
          <p style={{ fontSize: 'var(--wn-text-sm)', color: 'var(--wn-text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
            Upgrade to Pro to search inside PDFs and handwritten notes.
          </p>
          <button
            onClick={() => navigate('/winote/premium')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'var(--wn-text-base)',
              fontWeight: 600,
              fontFamily: 'var(--wn-font)',
              color: 'var(--wn-text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            VIEW PLAN →
          </button>
        </motion.div>
      )}

      <FloatingActionButton />
    </motion.div>
  );
};
