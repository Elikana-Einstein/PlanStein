import { create } from 'zustand';
import { GoalsService } from '../services/GoalsService';
import { Goal } from '../shared/types';

interface GoalsState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  loadActiveGoals: () => Promise<void>;
}

export const useGoalsStore = create<GoalsState>((set) => ({
  goals: [],
  isLoading: false,
  error: null,
  loadActiveGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const goals = await GoalsService.getAllGoals();
      set({ goals, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));