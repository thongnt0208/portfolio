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
    <div className="wn-no-scrollbar flex gap-2.5 overflow-x-auto px-6">
      {filters.map((f) => {
        const isActive = active === f.type;
        return (
          <motion.button
            key={f.type}
            whileTap={{ scale: 0.93 }}
            onClick={() => onChange(f.type)}
            className={`flex items-center gap-1.5 py-2 px-4 rounded-wn-pill border-none cursor-pointer text-wn-sm font-wn whitespace-nowrap shrink-0 ${
              isActive
                ? 'bg-wn-card-green-light shadow-wn-inset font-semibold text-wn-text-primary'
                : 'bg-wn-bg shadow-wn-btn font-normal text-wn-text-secondary'
            }`}
          >
            {f.icon && <f.icon size={12} />}
            {f.label}
          </motion.button>
        );
      })}
    </div>
  );
};
