import React from 'react';
import { Bold, Italic, List, Link, AlignLeft, Undo } from 'lucide-react';

const tools = [
  { icon: Bold, label: 'Bold' },
  { icon: Italic, label: 'Italic' },
  { icon: List, label: 'List' },
  { icon: Link, label: 'Link' },
  { icon: AlignLeft, label: 'Align' },
  { icon: Undo, label: 'Undo' },
];

export const FormatToolbar: React.FC = () => {
  return (
    <div className="flex items-center gap-1 py-2 px-4 bg-wn-bg shadow-wn-card rounded-wn-xl border-none">
      {tools.map((t, i) => (
        <React.Fragment key={t.label}>
          {(i === 3 || i === 5) && (
            <div className="w-px h-4 bg-wn-border mx-1.5" />
          )}
          <button
            aria-label={t.label}
            className="w-[34px] h-[34px] border-none bg-transparent rounded-wn-sm cursor-pointer flex items-center justify-center text-wn-text-secondary"
          >
            <t.icon size={18} />
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};
