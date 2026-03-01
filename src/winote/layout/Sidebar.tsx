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
        className="fixed inset-0 bg-wn-overlay z-50"
      />

      <motion.nav
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[100dvh] z-[51] pointer-events-none"
        style={{ maxWidth: 'var(--wn-max-width)' }}
      >
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-[87%] h-full flex flex-col pointer-events-auto overflow-y-auto"
          style={{ background: 'linear-gradient(180deg, #E8EFDE 0%, #DCE6D0 50%, #D0DAC2 100%)' }}
        >
          {/* Header */}
          <div className="pt-12 px-8 pb-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-wn-accent-green flex items-center justify-center bg-white/30">
              <span className="text-[28px] text-wn-text-secondary">A</span>
            </div>
            <div>
              <p className="text-wn-sm text-wn-text-secondary uppercase tracking-wide">
                Welcome TO
              </p>
              <h2 className="text-wn-2xl font-bold">WiNote</h2>
            </div>
          </div>

          {/* Menu Section */}
          <div className="pt-5 px-6">
            <h3 className="wn-section-title">MENU</h3>
            <div className="clay-card mt-3 p-2">
              {menuItems.map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={() => handleNav(item.path)}
                  className="w-full flex items-center gap-4 p-4 bg-transparent border-none rounded-wn-md cursor-pointer text-wn-lg font-wn text-wn-text-primary text-left"
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Intelligences Section */}
          <div className="pt-5 px-6">
            <h3 className="wn-section-title">INTELLIGENCES</h3>
            <div className="clay-card mt-3 p-2">
              {intelligenceItems.map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  onClick={() => item.path && handleNav(item.path)}
                  className="w-full flex items-center gap-4 p-4 bg-transparent border-none rounded-wn-md cursor-pointer text-wn-lg font-wn text-wn-text-primary text-left"
                >
                  <item.icon size={18} />
                  <div className="flex-1">
                    <span>{item.label}</span>
                    {item.subtitle && (
                      <span className="block text-wn-xs text-wn-text-tertiary">
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
          <div className="flex-1" />

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6"
          >
            {/* Remove Ads Card */}
            <div
              className="rounded-wn-lg overflow-hidden shadow-wn-card"
              style={{ background: 'linear-gradient(135deg, #6B7B5A 0%, #8B9B6A 100%)' }}
            >
              <div className="p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-wn-sm bg-white/15 flex items-center justify-center">
                  <Crown size={20} color="white" />
                </div>
                <span className="text-wn-lg font-semibold text-white">
                  Remove Ads
                </span>
              </div>
              <div className="flex gap-3 px-5 pb-5">
                <button
                  onClick={() => { closeSidebar(); openRewardsOverlay(); }}
                  className="flex-1 p-3 rounded-wn-md bg-white/20 border border-white/25 text-white font-semibold text-wn-base cursor-pointer font-wn"
                >
                  Watch a video
                </button>
                <button
                  onClick={() => handleNav('/winote/premium')}
                  className="flex-1 p-3 rounded-wn-md bg-wn-card-yellow border-none text-wn-text-primary font-semibold text-wn-base cursor-pointer font-wn"
                >
                  Go Premium
                </button>
              </div>
            </div>

            <p className="text-center text-wn-xs text-wn-text-secondary mt-4 leading-relaxed">
              Tip: Premium removes ads permanently and unlocks extra AI tools.
            </p>

            <div className="flex items-center justify-center gap-1.5 mt-4 pb-2">
              <Info size={12} color="var(--wn-text-tertiary)" />
              <span className="text-wn-xs text-wn-text-tertiary">
                Vintage Clay Note AI v1.2.0
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.nav>
    </>
  );
};
