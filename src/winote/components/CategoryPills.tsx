import React from 'react';
import { motion } from 'framer-motion';
import { Hash, Building, Lightbulb, Plus } from 'lucide-react';

const categories = [
  { id: 'Personal', icon: Hash },
  { id: 'Work', icon: Building },
  { id: 'Ideas', icon: Lightbulb },
];

interface CategoryPillsProps {
  active: string;
  onChange: (cat: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({ active, onChange }) => {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {categories.map((cat) => {
        const isActive = active === cat.id;
        return (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.93 }}
            onClick={() => onChange(cat.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 'var(--wn-radius-pill)',
              border: '1px solid var(--wn-border)',
              background: isActive ? 'var(--wn-card-green)' : 'var(--wn-bg-light)',
              boxShadow: isActive ? 'var(--wn-shadow-inset)' : 'var(--wn-shadow-btn)',
              cursor: 'pointer',
              fontSize: 'var(--wn-text-base)',
              fontFamily: 'var(--wn-font)',
              fontWeight: isActive ? 600 : 400,
              color: 'var(--wn-text-primary)',
            }}
          >
            <cat.icon size={12} />
            {cat.id}
          </motion.button>
        );
      })}
      <motion.button
        whileTap={{ scale: 0.93 }}
        style={{
          width: 32,
          height: 32,
          borderRadius: 'var(--wn-radius-pill)',
          border: '1px solid var(--wn-border)',
          background: 'var(--wn-bg-light)',
          boxShadow: 'var(--wn-shadow-btn)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Plus size={14} color="var(--wn-text-secondary)" />
      </motion.button>
    </div>
  );
};
