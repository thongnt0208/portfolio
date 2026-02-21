export type NoteType = 'text' | 'checklist' | 'audio' | 'image';

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  category: string;
  tags: string[];
  checklist?: ChecklistItem[];
  audioDuration?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface UserSettings {
  darkMode: boolean;
  typography: string;
  notifications: boolean;
  security: boolean;
  cloudSync: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

export interface User {
  name: string;
  isPremium: boolean;
  plan: string;
  avatar?: string;
}

export type FilterType = 'all' | 'text' | 'audio' | 'image' | 'checklist';
export type SortType = 'newest' | 'oldest' | 'alphabetical';
