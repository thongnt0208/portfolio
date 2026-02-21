import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note, Category, FilterType, SortType } from '../types';
import { MOCK_NOTES, DEFAULT_CATEGORIES } from '../data/mockData';

interface NotesState {
  notes: Note[];
  categories: Category[];
  searchQuery: string;
  activeFilter: FilterType;
  sortBy: SortType;
  setSearchQuery: (q: string) => void;
  setActiveFilter: (f: FilterType) => void;
  setSortBy: (s: SortType) => void;
  createNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
  getFilteredNotes: () => Note[];
  getForgottenNotes: () => Note[];
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: MOCK_NOTES,
      categories: DEFAULT_CATEGORIES,
      searchQuery: '',
      activeFilter: 'all',
      sortBy: 'newest',

      setSearchQuery: (q) => set({ searchQuery: q }),
      setActiveFilter: (f) => set({ activeFilter: f }),
      setSortBy: (s) => set({ sortBy: s }),

      createNote: (noteData) => {
        const id = generateId();
        const now = new Date().toISOString();
        const note: Note = {
          ...noteData,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ notes: [note, ...state.notes] }));
        return id;
      },

      updateNote: (id, data) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...data, updatedAt: new Date().toISOString() } : n
          ),
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),

      getNoteById: (id) => get().notes.find((n) => n.id === id),

      getFilteredNotes: () => {
        const { notes, searchQuery, activeFilter, sortBy } = get();
        let filtered = [...notes];

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (n) =>
              n.title.toLowerCase().includes(q) ||
              n.content.toLowerCase().includes(q) ||
              n.tags.some((t) => t.toLowerCase().includes(q)) ||
              n.category.toLowerCase().includes(q)
          );
        }

        if (activeFilter !== 'all') {
          filtered = filtered.filter((n) => n.type === activeFilter);
        }

        switch (sortBy) {
          case 'newest':
            filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            break;
          case 'oldest':
            filtered.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
            break;
          case 'alphabetical':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
        }

        return filtered;
      },

      getForgottenNotes: () => {
        const { notes } = get();
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return notes
          .filter((n) => new Date(n.updatedAt).getTime() < weekAgo)
          .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
          .slice(0, 5);
      },
    }),
    {
      name: 'winote-notes',
      partialize: (state) => ({ notes: state.notes, categories: state.categories }),
    }
  )
);
