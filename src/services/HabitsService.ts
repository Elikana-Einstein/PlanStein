import { db } from '../db/database';
import { Habit } from '../shared/types';


export const HabitsService = {
  getTodayHabits: async (): Promise<Habit[]> => {
    const rows = await db.getAllAsync(`SELECT * FROM habits`);
    return rows as Habit[];
  },

  addHabits: async (habit:{id:string,name:string,occurence:string}) => {
      await db.runAsync(
        `INSERT  INTO habits (id, name, frequency) VALUES (?, ?, ?)`,
        [habit.id, habit.name, habit.occurence]
      );
    }
  
};