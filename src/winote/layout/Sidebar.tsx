import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Tag, Brain, Settings, Crown, Info } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useUserStore } from '../store/useUserStore';
import CheckIcon from '@assets/winote/illustration/check.svg?react';

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
  const { closeSidebar, openRewardsOverlay, openAIModelsModal } = useUIStore();
  const { user } = useUserStore();
  const avatarLetter = (user.name || 'U').charAt(0).toUpperCase();

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
        className="fixed top-0 left-0 h-[100dvh] z-[51] pointer-events-none"
      >
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-[384px] max-w-[min(384px,100vw)] h-full flex flex-col justify-between pointer-events-auto overflow-y-auto rounded-r-[40px] shadow-[20px_0px_40px_rgba(74,79,70,0.10)]"
          style={{ background: 'var(--wn-sidebar-bg)' }}
        >
          {/* Header */}
          <div className="flex flex-col flex-shrink-0 pt-12 pb-10 px-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-wn-white shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)]">
                <span className="font-bold text-[28px] text-wn-text-primary font-wn">
                  {avatarLetter}
                </span>
              </div>
              <div className="flex flex-col">
                <p className="uppercase font-bold text-wn-base text-wn-text-secondary tracking-[0.7px] leading-5 font-wn">
                  Welcome TO
                </p>
                <h2 className="font-bold text-wn-2xl text-wn-text-primary leading-[30px] font-wn">
                  WiNote
                </h2>
              </div>
            </div>
          </div>

          {/* Middle: Menu + Intelligences */}
          <div className="flex-1 overflow-hidden flex flex-col py-5">
            <div className="flex flex-col gap-4 px-6 pb-6">
              {/* MENU */}
              <div className="flex flex-col gap-4 pt-2">
                <p className="uppercase font-bold text-wn-base text-wn-text-secondary tracking-[1.4px] leading-5 font-wn">
                  MENU
                </p>
                <div className="flex flex-col gap-1 p-2 bg-wn-card-green shadow-wn-card rounded-wn-xl">
                  {menuItems.map((item, i) => (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      onClick={() => handleNav(item.path)}
                      className={`w-full flex items-center gap-4 border-none cursor-pointer text-left font-bold text-wn-lg text-wn-text-primary leading-[22.5px] h-14 px-4 rounded-wn-pill font-wn ${
                        i === 0 ? 'bg-wn-bg shadow-wn-inset' : ''
                      }`}
                    >
                      <item.icon size={18} className="text-wn-text-secondary shrink-0" />
                      <span>{item.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* INTELLIGENCES */}
              <div className="flex flex-col gap-4 pt-2">
                <p className="uppercase font-bold text-wn-base text-wn-text-secondary tracking-[1.4px] leading-5 font-wn">
                  INTELLIGENCES
                </p>
                <div className="flex flex-col gap-1 p-2 bg-wn-card-green shadow-wn-card rounded-wn-xl">
                  {intelligenceItems.map((item, i) => (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      onClick={() => {
                        if (item.label === 'AI Models') {
                          closeSidebar();
                          openAIModelsModal();
                        } else if (item.path) {
                          handleNav(item.path);
                        }
                      }}
                      className={`w-full flex items-center gap-4 border-none cursor-pointer text-left font-bold text-wn-lg text-wn-text-primary leading-[22.5px] px-4 font-wn ${
                        item.subtitle ? 'py-3 rounded-[32px] h-[67px]' : 'h-14 rounded-wn-pill'
                      }`}
                    >
                      <item.icon size={18} className="text-wn-text-secondary shrink-0" />
                      <div className="flex-1 min-w-0 flex flex-col items-start">
                        <span>{item.label}</span>
                        {item.subtitle && (
                          <span className="font-medium mt-0.5 text-wn-sm text-wn-text-tertiary leading-4 font-wn">
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                      {item.hasCheck && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#DCFCE7] shadow-wn-cta-inset">
                          <CheckIcon className="w-[18px] h-[18px]" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-shrink-0 flex flex-col gap-6 pt-6 pb-8 px-6"
            style={{ background: 'linear-gradient(0deg, #FCFBF9 0%, rgba(252, 251, 249, 0) 100%)' }}
          >
            {/* Remove Ads Card */}
            <div className="w-full max-w-[336px] self-center relative overflow-hidden p-1 bg-wn-cta-bg shadow-[-6px_-6px_14px_#A6BC8F] rounded-[48px]">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/20 to-transparent" />
              <div className="flex items-center justify-between relative px-5 py-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
                    <Crown size={24} color="white" />
                  </div>
                  <span className="font-bold text-wn-lg text-wn-white leading-7 font-wn">
                    Remove Ads
                  </span>
                </div>
              </div>
              <div className="flex gap-3 relative px-5 pb-4">
                <button
                  onClick={() => { closeSidebar(); openRewardsOverlay(); }}
                  className="flex-1 min-h-[44px] flex items-center justify-center font-semibold cursor-pointer rounded-full px-4 py-3 bg-white/35 shadow-[-10px_-10px_18px_rgba(255,255,255,0.55)_inset] text-wn-text-primary text-wn-base leading-[21px] font-wn border-none"
                >
                  Watch a video
                </button>
                <button
                  onClick={() => handleNav('/winote/premium')}
                  className="flex-1 min-h-[44px] flex items-center justify-center font-semibold cursor-pointer rounded-full border-none px-4 py-3 bg-wn-card-yellow shadow-[-10px_-10px_18px_rgba(255,255,255,0.55)_inset] text-wn-text-primary text-wn-base leading-[21px] font-wn"
                >
                  Go Premium
                </button>
              </div>
            </div>

            <p className="text-center font-normal opacity-40 text-wn-xs text-wn-text-primary leading-[18px] font-wn">
              Tip: Premium removes ads permanently
              <br />
              and unlocks extra AI tools.
            </p>

            <div className="flex items-center justify-center gap-2 opacity-40">
              <Info size={12} className="text-wn-text-primary" />
              <span className="font-bold text-wn-sm text-wn-text-primary leading-4 font-wn">
                WiNote v0.2.0
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.nav>
    </>
  );
};
