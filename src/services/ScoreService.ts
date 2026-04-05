import { Task, Habit } from '../shared/types';

export const ScoreService = {
  computeDayScore: (tasks: Task[], habits: Habit[]): { total: number; delta: number; tasksDone: number; habitsDone: number; focusMinutes: number } => {
    const tasksDone = tasks.filter(t => t.completed).length;
    const habitsDone = habits.filter(h => h.completedToday).length;
    const total = tasksDone * 10 + habitsDone * 5; // example scoring
    return {
      total,
      delta: 8, // placeholder; could be computed from yesterday
      tasksDone,
      habitsDone,
      focusMinutes: 45, // placeholder
    };
  },
};