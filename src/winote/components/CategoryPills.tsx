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
            className={`flex items-center gap-2 py-2 px-4 rounded-wn-pill border-none cursor-pointer text-wn-sm font-wn ${
              isActive
                ? 'bg-wn-card-green shadow-wn-inset font-semibold text-wn-text-primary'
                : 'bg-wn-bg shadow-wn-btn font-normal text-wn-text-secondary'
            }`}
          >
            <cat.icon size={12} />
            {cat.id}
          </motion.button>
        );
      })}
      <motion.button
        whileTap={{ scale: 0.93 }}
        className="w-8 h-8 rounded-wn-pill border-none bg-wn-bg shadow-wn-btn cursor-pointer flex items-center justify-center"
      >
        <Plus size={14} className="text-wn-text-secondary" />
      </motion.button>
    </div>
  );
};
