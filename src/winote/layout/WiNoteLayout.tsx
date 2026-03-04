import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { AdBanner } from './AdBanner';
import { RewardsOverlay } from '../components/RewardsOverlay';
import { AIModelsModal } from '../components/AIModelsModal';
import { TermsModal } from '../components/TermsModal';
import { WiNoteErrorBoundary } from '../components/ErrorBoundary';
import { useUIStore } from '../store/useUIStore';
import { useUserStore } from '../store/useUserStore';

const TERMS_STORAGE_KEY = 'winote-terms-accepted-v1';

export const WiNoteLayout: React.FC = () => {
  const location = useLocation();
  const {
    isSidebarOpen,
    isRewardsOverlayOpen,
    isAIModelsModalOpen,
    isTermsModalOpen,
    openTermsModal,
  } = useUIStore();
  const { user } = useUserStore();

  const hideAdBanner = user.isPremium || location.pathname.includes('/note/');

  useEffect(() => {
    try {
      const accepted = window.localStorage.getItem(TERMS_STORAGE_KEY);
      if (!accepted) {
        openTermsModal();
      }
    } catch {
      // ignore storage errors
    }
  }, [openTermsModal]);

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

      <AnimatePresence>
        {isAIModelsModalOpen && <AIModelsModal />}
      </AnimatePresence>

      <AnimatePresence>
        {isTermsModalOpen && <TermsModal />}
      </AnimatePresence>

      {!hideAdBanner && <AdBanner />}
    </div>
  );
};
