import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { AdBanner } from './AdBanner';
import { RewardsOverlay } from '../components/RewardsOverlay';
import { WiNoteErrorBoundary } from '../components/ErrorBoundary';
import { useUIStore } from '../store/useUIStore';
import { useUserStore } from '../store/useUserStore';

export const WiNoteLayout: React.FC = () => {
  const location = useLocation();
  const { isSidebarOpen, isRewardsOverlayOpen } = useUIStore();
  const { user } = useUserStore();

  const hideAdBanner = user.isPremium || location.pathname.includes('/note/');

  return (
    <div className="winote-app">
      <WiNoteErrorBoundary>
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </WiNoteErrorBoundary>

      <AnimatePresence>
        {isSidebarOpen && <Sidebar />}
      </AnimatePresence>

      <AnimatePresence>
        {isRewardsOverlayOpen && <RewardsOverlay />}
      </AnimatePresence>

      {!hideAdBanner && <AdBanner />}
    </div>
  );
};
