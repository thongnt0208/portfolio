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
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px 16px',
      background: 'var(--wn-bg-light)',
      borderRadius: 'var(--wn-radius-xl)',
      boxShadow: 'var(--wn-shadow-card)',
      border: '1px solid var(--wn-border)',
    }}>
      {aiTools.map((t) => (
        <button
          key={t.label}
          aria-label={t.label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--wn-text-secondary)',
            fontFamily: 'var(--wn-font)',
            fontSize: 'var(--wn-text-xs)',
            padding: 8,
          }}
        >
          <t.icon size={18} />
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
};
