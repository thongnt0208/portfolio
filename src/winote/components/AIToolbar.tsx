import React from 'react';
import { FileText, PenLine, Tag, Highlighter } from 'lucide-react';

const aiTools = [
  { icon: FileText, label: 'Summary' },
  { icon: PenLine, label: 'Rewrite' },
  { icon: Tag, label: 'Auto-Tag' },
  { icon: Highlighter, label: 'Highlight' },
];

export const AIToolbar: React.FC = () => {
  return (
    <div className="flex justify-around py-3 px-4 bg-wn-bg shadow-wn-card rounded-wn-xl border-none">
      {aiTools.map((t) => (
        <button
          key={t.label}
          aria-label={t.label}
          className="flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer text-wn-text-secondary font-wn text-wn-xs p-2"
        >
          <t.icon size={18} />
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
};
