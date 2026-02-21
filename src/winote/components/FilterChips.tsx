import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Mic, ImageIcon, CheckSquare } from 'lucide-react';
import type { FilterType } from '../types';

const filters: { type: FilterType; label: string; icon?: React.ElementType }[] = [
  { type: 'all', label: 'All Notes' },
  { type: 'text', label: 'Text', icon: FileText },
  { type: 'audio', label: 'Audio', icon: Mic },
  { type: 'image', label: 'Images', icon: ImageIcon },
  { type: 'checklist', label: 'To-Do', icon: CheckSquare },
];

interface FilterChipsProps {
  active: FilterType;
  onChange: (f: FilterType) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({ active, onChange }) => {
  return (
    <div
      className="wn-no-scrollbar"
      style={{
        display: 'flex',
        gap: 10,
        overflowX: 'auto',
        padding: '0 24px',
      }}
    >
      {filters.map((f) => {
        const isActive = active === f.type;
        return (
          <motion.button
            key={f.type}
            whileTap={{ scale: 0.93 }}
            onClick={() => onChange(f.type)}
            className={isActive ? 'clay-inset' : ''}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 'var(--wn-radius-pill)',
              border: '1px solid var(--wn-border)',
              background: isActive ? 'var(--wn-card-green-light)' : 'var(--wn-bg-light)',
              boxShadow: isActive ? 'var(--wn-shadow-inset)' : 'var(--wn-shadow-btn)',
              cursor: 'pointer',
              fontSize: 'var(--wn-text-base)',
              fontFamily: 'var(--wn-font)',
              fontWeight: isActive ? 600 : 400,
              color: 'var(--wn-text-primary)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {f.icon && <f.icon size={12} />}
            {f.label}
          </motion.button>
        );
      })}
    </div>
  );
};
