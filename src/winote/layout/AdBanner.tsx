import React from 'react';
import { Monitor } from 'lucide-react';

export const AdBanner: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 'var(--wn-max-width)',
      zIndex: 30,
    }}>
      <div style={{
        height: 32,
        background: 'linear-gradient(to bottom, transparent, var(--wn-bg))',
        pointerEvents: 'none',
      }} />
      <div style={{
        background: 'var(--wn-bg)',
        padding: '8px 16px 16px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 12px',
          background: 'var(--wn-bg-light)',
          borderRadius: 'var(--wn-radius-md)',
          boxShadow: 'var(--wn-shadow-card-sm)',
          border: '1px solid var(--wn-border)',
          position: 'relative',
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--wn-radius-sm)',
            background: 'var(--wn-card-green-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Monitor size={18} color="var(--wn-accent-green)" />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 'var(--wn-text-sm)', fontWeight: 500, lineHeight: 1.3 }}>
              Organize your life with TaskMaster
            </p>
            <p style={{ fontSize: 'var(--wn-text-xs)', color: 'var(--wn-text-tertiary)', lineHeight: 1.3 }}>
              Rated 4.9 stars by productivity experts
            </p>
          </div>

          <button style={{
            padding: '6px 12px',
            borderRadius: 'var(--wn-radius-pill)',
            background: '#4285F4',
            color: 'white',
            border: 'none',
            fontSize: 'var(--wn-text-xs)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            flexShrink: 0,
          }}>
            INSTALL
          </button>

          <span style={{
            position: 'absolute',
            top: -6,
            right: 4,
            fontSize: 9,
            color: 'var(--wn-text-tertiary)',
            background: 'var(--wn-bg-light)',
            padding: '0 4px',
            borderRadius: 4,
          }}>
            Ad
          </span>
        </div>
      </div>
    </div>
  );
};
