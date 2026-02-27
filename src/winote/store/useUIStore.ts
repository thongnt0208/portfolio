import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isRewardsOverlayOpen: boolean;
  isTermsModalOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  openRewardsOverlay: () => void;
  closeRewardsOverlay: () => void;
  openTermsModal: () => void;
  closeTermsModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isRewardsOverlayOpen: false,
  isTermsModalOpen: false,
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  openRewardsOverlay: () => set({ isRewardsOverlayOpen: true, isSidebarOpen: false }),
  closeRewardsOverlay: () => set({ isRewardsOverlayOpen: false }),
  openTermsModal: () => set({ isTermsModalOpen: true }),
  closeTermsModal: () => set({ isTermsModalOpen: false }),
}));
