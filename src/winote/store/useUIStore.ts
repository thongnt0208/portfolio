import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isRewardsOverlayOpen: boolean;
  isTermsModalOpen: boolean;
  isAIModelsModalOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  openRewardsOverlay: () => void;
  closeRewardsOverlay: () => void;
  openTermsModal: () => void;
  closeTermsModal: () => void;
  openAIModelsModal: () => void;
  closeAIModelsModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isRewardsOverlayOpen: false,
  isTermsModalOpen: false,
  isAIModelsModalOpen: false,
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  openRewardsOverlay: () => set({ isRewardsOverlayOpen: true, isSidebarOpen: false }),
  closeRewardsOverlay: () => set({ isRewardsOverlayOpen: false }),
  openTermsModal: () => set({ isTermsModalOpen: true }),
  closeTermsModal: () => set({ isTermsModalOpen: false }),
  openAIModelsModal: () => set({ isAIModelsModalOpen: true }),
  closeAIModelsModal: () => set({ isAIModelsModalOpen: false }),
}));
