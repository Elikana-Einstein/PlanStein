import { db } from '../db/database';
import { Habit } from '../shared/types';


export const HabitsService = {
  getTodayHabits: async (): Promise<Habit[]> => {
    const rows = await db.getAllAsync(`SELECT * FROM habits`);
    return rows as Habit[];
  },

  seedMockHabits: async () => {
    const mockHabits: Habit[] = [
      { id: '1', name: 'Morning run', streak: 12, completedToday: false },
      { id: '2', name: 'Read 30 min', streak: 7, completedToday: false },
    ];
    for (const habit of mockHabits) {
      await db.runAsync(
        `INSERT OR REPLACE INTO habits (id, name, streak, completed_today) VALUES (?, ?, ?, ?)`,
        [habit.id, habit.name, habit.streak, habit.completedToday ? 1 : 0]
      );
    }
  },
};