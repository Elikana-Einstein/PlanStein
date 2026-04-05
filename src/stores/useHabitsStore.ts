import { create } from 'zustand';
import { HabitsService } from '../services/HabitsService';
import { Habit } from '../shared/types';

interface HabitsState {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
  loadTodayHabits: () => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  isLoading: false,
  error: null,
  loadTodayHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const habits = await HabitsService.getTodayHabits();
      set({ habits, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  toggleHabit: async (id: string) => {
    const currentHabits = get().habits;
    const updated = currentHabits.map(h => h.id === id ? { ...h, completedToday: !h.completedToday } : h);
    set({ habits: updated });
    // persist
  },
}));