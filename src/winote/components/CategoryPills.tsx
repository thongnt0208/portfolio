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
    <div className="flex gap-2.5 flex-wrap">
      {categories.map((cat) => {
        const isActive = active === cat.id;
        return (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.93 }}
            onClick={() => onChange(cat.id)}
            className={`flex items-center gap-2 py-2 px-4 rounded-wn-pill border border-wn-border cursor-pointer text-wn-base font-wn text-wn-text-primary ${
              isActive
                ? 'bg-wn-card-green shadow-wn-inset font-semibold'
                : 'bg-wn-bg-light shadow-wn-btn font-normal'
            }`}
          >
            <cat.icon size={12} />
            {cat.id}
          </motion.button>
        );
      })}
      <motion.button
        whileTap={{ scale: 0.93 }}
        className="w-8 h-8 rounded-wn-pill border border-wn-border bg-wn-bg-light shadow-wn-btn cursor-pointer flex items-center justify-center"
      >
        <Plus size={14} color="var(--wn-text-secondary)" />
      </motion.button>
    </div>
  );
};
