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
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '8px 16px',
      background: 'var(--wn-bg-light)',
      borderRadius: 'var(--wn-radius-xl)',
      boxShadow: 'var(--wn-shadow-card)',
      border: '1px solid var(--wn-border)',
    }}>
      {tools.map((t, i) => (
        <React.Fragment key={t.label}>
          {(i === 3 || i === 5) && (
            <div style={{ width: 1, height: 16, background: 'var(--wn-border)', margin: '0 6px' }} />
          )}
          <button
            aria-label={t.label}
            style={{
              width: 34,
              height: 34,
              border: 'none',
              background: 'none',
              borderRadius: 'var(--wn-radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--wn-text-secondary)',
            }}
          >
            <t.icon size={18} />
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};
