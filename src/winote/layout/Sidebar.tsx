import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Tag, Brain, Settings, Crown, Info } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useUserStore } from '../store/useUserStore';
import CheckIcon from '@assets/winote/illustration/check.svg?react';

type NavIcon = React.ComponentType<{ size?: number; className?: string }>;

type NavItem = {
  icon: NavIcon;
  label: string;
  path?: string;
  subtitle?: string;
  hasCheck?: boolean;
  action?: () => void;
  defaultActive?: boolean;
  animDelay: number;
};

type NavSection = { key: string; title: string; items: NavItem[] };

const buildNavSections = (onOpenAIModels: () => void): NavSection[] => [
  {
    key: 'MENU',
    title: 'MENU',
    items: [
      { icon: Home, label: 'Home', path: '/winote', defaultActive: true, animDelay: 0.1 },
      { icon: Tag, label: 'Tags', path: '/winote/search', animDelay: 0.15 },
    ],
  },
  {
    key: 'INTELLIGENCES',
    title: 'INTELLIGENCES',
    items: [
      { icon: Brain, label: 'AI Models', subtitle: '~340MB', hasCheck: true, action: onOpenAIModels, animDelay: 0.2 },
      { icon: Settings, label: 'Settings', path: '/winote/settings', animDelay: 0.25 },
    ],
  },
];

// --- Sub-components ---

const NavItemButton: React.FC<{ item: NavItem; selected: boolean; onClick: () => void }> = ({
  item,
  selected,
  onClick,
}) => (
  <motion.button
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: item.animDelay }}
    onClick={onClick}
    className={`w-full flex items-center gap-4 border-none cursor-pointer text-left font-bold text-wn-lg leading-[22.5px] px-4 font-wn transition-all duration-150 ${
      item.subtitle ? 'py-3 rounded-[32px] h-[67px]' : 'h-14 rounded-wn-pill'
    } ${
      selected
        ? 'bg-wn-bg shadow-wn-inset text-wn-text-primary'
        : 'text-wn-text-secondary hover:bg-wn-bg/70 hover:shadow-wn-inset hover:text-wn-text-primary'
    }`}
  >
    <item.icon size={18} className={`shrink-0 ${selected ? 'text-wn-text-primary' : 'text-wn-text-secondary'}`} />
    <div className="flex-1 min-w-0 flex flex-col items-start">
      <span>{item.label}</span>
      {item.subtitle && (
        <span className="font-medium mt-0.5 text-wn-sm text-wn-text-tertiary leading-4 font-wn">
          {item.subtitle}
        </span>
      )}
    </div>
    {item.hasCheck && (
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-wn-bg shadow-wn-cta-inset">
        <CheckIcon className="w-[18px] h-[18px]" />
      </div>
    )}
  </motion.button>
);

const RemoveAdsCard: React.FC<{ onWatchVideo: () => void; onGoPremium: () => void }> = ({
  onWatchVideo,
  onGoPremium,
}) => (
  <div className="w-full max-w-[336px] self-center relative overflow-hidden p-1 bg-wn-cta-bg shadow-[-6px_-6px_14px_#A6BC8F] rounded-[48px]">
    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/20 to-transparent" />
    <div className="flex items-center gap-3 flex-1 relative px-5 py-4">
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <Crown size={24} color="white" />
      </div>
      <span className="font-bold text-wn-lg text-wn-white leading-7 font-wn">Remove Ads</span>
    </div>
    <div className="flex gap-3 relative px-5 pb-4">
      <button
        onClick={onWatchVideo}
        className="flex-1 min-h-[44px] flex items-center justify-center font-semibold cursor-pointer rounded-full px-4 py-3 bg-white/35 shadow-[-10px_-10px_18px_rgba(255,255,255,0.55)_inset] text-wn-text-primary text-wn-base leading-[21px] font-wn border-none"
      >
        Watch a video
      </button>
      <button
        onClick={onGoPremium}
        className="flex-1 min-h-[44px] flex items-center justify-center font-semibold cursor-pointer rounded-full border-none px-4 py-3 bg-wn-card-yellow shadow-[-10px_-10px_18px_rgba(255,255,255,0.55)_inset] text-wn-text-primary text-wn-base leading-[21px] font-wn"
      >
        Go Premium
      </button>
    </div>
  </div>
);

// --- Main Component ---

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { closeSidebar, openRewardsOverlay, openAIModelsModal } = useUIStore();
  const { user } = useUserStore();

  const avatarLetter = (user.name || 'U').charAt(0).toUpperCase();
  const nav = (path: string) => { closeSidebar(); navigate(path); };
  const isActive = (path?: string) => {
    if (!path) return false;
    return path === '/winote' ? location.pathname === '/winote' : location.pathname.startsWith(path);
  };

  const navSections = useMemo(
    () => buildNavSections(() => { closeSidebar(); openAIModelsModal(); }),
    [closeSidebar, openAIModelsModal],
  );

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

      <nav className="fixed top-0 left-0 h-[100dvh] z-[51] pointer-events-none">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-[384px] max-w-[min(384px,100vw)] h-full flex flex-col justify-between pointer-events-auto overflow-y-auto rounded-r-[40px] shadow-[20px_0px_40px_rgba(74,79,70,0.10)]"
          style={{ background: 'var(--wn-sidebar-bg)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 flex-shrink-0 pt-12 pb-10 px-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-wn-white shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)]">
              <span className="font-bold text-[28px] text-wn-text-primary font-wn">{avatarLetter}</span>
            </div>
            <div className="flex flex-col">
              <p className="uppercase font-bold text-wn-base text-wn-text-secondary tracking-[0.7px] leading-5 font-wn">
                Welcome to
              </p>
              <h2 className="font-bold text-wn-2xl text-wn-text-primary leading-[30px] font-wn">WiNote</h2>
            </div>
          </div>

          {/* Nav Sections */}
          <div className="flex-1 overflow-hidden flex flex-col py-5">
            <div className="flex flex-col gap-4 px-6 pb-6">
              {navSections.map((section) => {
                const hasActive = section.items.some((item) => isActive(item.path));
                return (
                  <div key={section.key} className="flex flex-col gap-4 pt-2">
                    <p className="uppercase font-bold text-wn-base text-wn-text-secondary tracking-[1.4px] leading-5 font-wn">
                      {section.title}
                    </p>
                    <div className="flex flex-col gap-1 p-2 bg-wn-card-green shadow-wn-card rounded-wn-xl">
                      {section.items.map((item, index) => {
                        const selected = isActive(item.path) || (!hasActive && item.defaultActive && index === 0);
                        const onClick = item.action ?? (item.path ? () => nav(item.path!) : () => {});
                        return (
                          <NavItemButton key={item.label} item={item} selected={!!selected} onClick={onClick} />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-shrink-0 flex flex-col gap-6 pt-6 pb-8 px-6"
            style={{ background: 'linear-gradient(0deg, #FCFBF9 0%, rgba(252, 251, 249, 0) 100%)' }}
          >
            <RemoveAdsCard
              onWatchVideo={() => { closeSidebar(); openRewardsOverlay(); }}
              onGoPremium={() => nav('/winote/premium')}
            />
            <p className="text-center font-normal opacity-40 text-wn-xs text-wn-text-primary leading-[18px] font-wn">
              Tip: Premium removes ads permanently
              <br />
              and unlocks extra AI tools.
            </p>
            <div className="flex items-center justify-center gap-2 opacity-40">
              <Info size={12} className="text-wn-text-primary" />
              <span className="font-bold text-wn-sm text-wn-text-primary leading-4 font-wn">WiNote v0.2.0</span>
            </div>
          </motion.div>
        </motion.div>
      </nav>
    </>
  );
};
