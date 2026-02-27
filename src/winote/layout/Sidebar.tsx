import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Tag, Brain, Settings, Crown, Info } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

const menuItems = [
  { icon: Home, label: 'Home', path: '/winote' },
  { icon: Tag, label: 'Tags', path: '/winote/search' },
];

const intelligenceItems = [
  { icon: Brain, label: 'AI Models', subtitle: '~340MB', hasCheck: true },
  { icon: Settings, label: 'Settings', path: '/winote/settings' },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { closeSidebar, openRewardsOverlay } = useUIStore();

  const handleNav = (path: string) => {
    closeSidebar();
    navigate(path);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={closeSidebar}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--wn-overlay)',
          zIndex: 50,
        }}
      />

      <motion.nav
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 'var(--wn-max-width)',
          height: '100dvh',
          zIndex: 51,
          pointerEvents: 'none',
        }}
      >
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          style={{
            width: '87%',
            height: '100%',
            background: 'linear-gradient(180deg, #E8EFDE 0%, #DCE6D0 50%, #D0DAC2 100%)',
            display: 'flex',
            flexDirection: 'column',
            pointerEvents: 'auto',
            overflowY: 'auto',
          }}
        >
          {/* Header */}
          <div style={{ padding: '48px 32px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              border: '2px solid var(--wn-accent-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.3)',
            }}>
              <span style={{ fontSize: 28, color: 'var(--wn-text-secondary)' }}>A</span>
            </div>
            <div>
              <p style={{ fontSize: 'var(--wn-text-sm)', color: 'var(--wn-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Welcome TO
              </p>
              <h2 style={{ fontSize: 'var(--wn-text-2xl)', fontWeight: 700 }}>WiNote</h2>
            </div>
          </div>

          {/* Menu Section */}
          <div style={{ padding: '20px 24px 0' }}>
            <h3 className="wn-section-title">MENU</h3>
            <div className="clay-card" style={{ marginTop: 12, padding: 8 }}>
              {menuItems.map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={() => handleNav(item.path)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px',
                    background: 'none',
                    border: 'none',
                    borderRadius: 'var(--wn-radius-md)',
                    cursor: 'pointer',
                    fontSize: 'var(--wn-text-lg)',
                    fontFamily: 'var(--wn-font)',
                    color: 'var(--wn-text-primary)',
                    textAlign: 'left',
                  }}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Intelligences Section */}
          <div style={{ padding: '20px 24px 0' }}>
            <h3 className="wn-section-title">INTELLIGENCES</h3>
            <div className="clay-card" style={{ marginTop: 12, padding: 8 }}>
              {intelligenceItems.map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  onClick={() => item.path && handleNav(item.path)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px',
                    background: 'none',
                    border: 'none',
                    borderRadius: 'var(--wn-radius-md)',
                    cursor: 'pointer',
                    fontSize: 'var(--wn-text-lg)',
                    fontFamily: 'var(--wn-font)',
                    color: 'var(--wn-text-primary)',
                    textAlign: 'left',
                  }}
                >
                  <item.icon size={18} />
                  <div style={{ flex: 1 }}>
                    <span>{item.label}</span>
                    {item.subtitle && (
                      <span style={{ display: 'block', fontSize: 'var(--wn-text-xs)', color: 'var(--wn-text-tertiary)' }}>
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                  {item.hasCheck && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="var(--wn-accent-green)" />
                      <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ padding: '24px' }}
          >
            {/* Remove Ads Card */}
            <div style={{
              borderRadius: 'var(--wn-radius-lg)',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #6B7B5A 0%, #8B9B6A 100%)',
              boxShadow: 'var(--wn-shadow-card)',
            }}>
              <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--wn-radius-sm)',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Crown size={20} color="white" />
                </div>
                <span style={{ fontSize: 'var(--wn-text-lg)', fontWeight: 600, color: 'white' }}>
                  Remove Ads
                </span>
              </div>
              <div style={{ display: 'flex', gap: 12, padding: '0 20px 20px' }}>
                <button
                  onClick={() => { closeSidebar(); openRewardsOverlay(); }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 'var(--wn-radius-md)',
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 'var(--wn-text-base)',
                    cursor: 'pointer',
                    fontFamily: 'var(--wn-font)',
                  }}
                >
                  Watch a video
                </button>
                <button
                  onClick={() => handleNav('/winote/premium')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 'var(--wn-radius-md)',
                    background: 'var(--wn-card-yellow)',
                    border: 'none',
                    color: 'var(--wn-text-primary)',
                    fontWeight: 600,
                    fontSize: 'var(--wn-text-base)',
                    cursor: 'pointer',
                    fontFamily: 'var(--wn-font)',
                  }}
                >
                  Go Premium
                </button>
              </div>
            </div>

            <p style={{
              textAlign: 'center',
              fontSize: 'var(--wn-text-xs)',
              color: 'var(--wn-text-secondary)',
              marginTop: 16,
              lineHeight: 1.5,
            }}>
              Tip: Premium removes ads permanently and unlocks extra AI tools.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginTop: 16,
              paddingBottom: 8,
            }}>
              <Info size={12} color="var(--wn-text-tertiary)" />
              <span style={{ fontSize: 'var(--wn-text-xs)', color: 'var(--wn-text-tertiary)' }}>
                Vintage Clay Note AI v1.2.0
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.nav>
    </>
  );
};
