import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserSettings } from '../types';

interface UserState {
  user: User;
  settings: UserSettings;
  updateUser: (data: Partial<User>) => void;
  updateSettings: (data: Partial<UserSettings>) => void;
  togglePremium: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        name: 'WiNote User',
        isPremium: false,
        plan: 'Pro Plan',
      },
      settings: {
        darkMode: false,
        typography: 'WiNote User Typo',
        notifications: true,
        security: false,
        cloudSync: true,
        backupFrequency: 'daily',
      },
      updateUser: (data) =>
        set((state) => ({ user: { ...state.user, ...data } })),
      updateSettings: (data) =>
        set((state) => ({ settings: { ...state.settings, ...data } })),
      togglePremium: () =>
        set((state) => ({
          user: {
            ...state.user,
            isPremium: !state.user.isPremium,
            plan: !state.user.isPremium ? 'Pro Plan • Active' : 'Free Plan',
          },
        })),
    }),
    { name: 'winote-user' }
  )
);
