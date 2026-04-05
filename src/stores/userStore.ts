import { create } from 'zustand';
import { UserService } from '../services/UserService';
import { UserPrefs } from '../shared/types';

interface UserState extends UserPrefs {
  isLoading: boolean;
  error: string | null;
  loadUserData: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  name: '',
  streak: 0,
  lastSessionDate: null,
  isLoading: false,
  error: null,
  loadUserData: async () => {
    set({ isLoading: true, error: null });
    try {
      const prefs = await UserService.getUserPrefs();
      set({ ...prefs, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));