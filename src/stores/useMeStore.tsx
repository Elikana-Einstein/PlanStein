import { create }      from 'zustand';
import { UserProfile, MeStats, WeeklyReview } from '../shared/types';
import { DEFAULT_ACHIEVEMENTS } from '@/shared/constants/achievements';
import { MeService } from '@/services/MeService';

interface MeState {
  profile:       UserProfile | null;
  stats:         MeStats     | null;
  weeklyReview:  WeeklyReview | null;
  achievements:  typeof DEFAULT_ACHIEVEMENTS;
  isLoading:     boolean;
  error:         string | null;

  loadAll:           () => Promise<void>;
  updateName:        (name: string) => Promise<void>;
  saveWeeklyReview:  (note: string) => Promise<void>;
  clearAllData:      () => Promise<void>;
}

export const useMeStore = create<MeState>((set, get) => ({
  profile:      null,
  stats:        null,
  weeklyReview: null,
  achievements: DEFAULT_ACHIEVEMENTS,
  isLoading:    false,
  error:        null,

  loadAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const [profile, stats, weeklyReview] = await Promise.all([
        MeService.getProfile(),
        MeService.getStats(),
        MeService.getCurrentWeekReview(),
      ]);
      set({ profile, stats, weeklyReview, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateName: async (name: string) => {
    await MeService.saveProfile({ name });
    set(s => ({
      profile: s.profile ? { ...s.profile, name } : null,
    }));
  },

  saveWeeklyReview: async (note: string) => {
    const review = await MeService.saveWeeklyReview(note);
    set({ weeklyReview: review });
  },

  clearAllData: async () => {
    await MeService.clearAllData();
    set({ stats: null });
  },
}));