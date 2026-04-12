import { formatDateForSql, getFormattedDate } from '@/shared/utils';
import { db } from '../db/database';
import { Habit } from '../shared/types';



export const HabitsService = {
  getTodayHabits: async (): Promise<Habit[]> => {
    const rows = await db.getAllAsync(`SELECT * FROM habits`) as Habit[];
    
  const habitsWithDots = await Promise.all(
    rows.map(async (habit) => ({
      ...habit,
      lastSevenDays: await HabitsService.getLastSevenDays(habit.id, habit.start_date),
    }))
  );
  
    
    return habitsWithDots;
  },

  addHabits: async (habit: { id: string; name: string; occurence: string; start_date: Date | string }) => {
    await db.runAsync(
      `INSERT INTO habits (id, name, start_date, frequency) VALUES (?, ?, ?,?)`,
      [habit.id, habit.name, formatDateForSql(habit.start_date), habit.occurence]
    );
  },
  markHabitAsAchieved: async (id: string, ha_id: string, date: Date) => {
    await db.runAsync(
      `INSERT INTO habit_logs (id, habit_id, date) VALUES (?, ?, ?)`,
      [id, ha_id, formatDateForSql(date)]
    );
  },

checkTodaysHabitAsAchieved: async (habit_id: string): Promise<boolean> => {
  const today = formatDateForSql(new Date());

  const result = await db.getFirstAsync(
    `SELECT id FROM habit_logs WHERE habit_id = ? AND date = ?`,
    [habit_id, today]
  );

  return result !== null;
},

getLastSevenDays: async (habit_id: string, start_date: string): Promise<(boolean | null)[]> => {
  const today = new Date();
  const startDate = new Date(start_date);

  const diff = today.getTime() - startDate.getTime();
  const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  const days: (boolean | null)[] = [];

  if(diffInDays >6){
     for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);

    const dateStr = formatDateForSql(day);
    const result = await db.getFirstAsync(
      `SELECT id FROM habit_logs WHERE habit_id = ? AND date = ?`,
      [habit_id, dateStr]
    );
    days.push(result !== null);
  }
  }else{
     for (let i = diffInDays; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);

    const dateStr = formatDateForSql(day);
    const result = await db.getFirstAsync(
      `SELECT id FROM habit_logs WHERE habit_id = ? AND date = ?`,
      [habit_id, dateStr]
    );
    days.push(result !== null);

  }
  }
  if(7 - days.length > 0){
    for (let i = 7-days.length;i>0;i--){
      days.push(null)
    }
  }
  return days; 
},

  dropHabitTables: async (): Promise<void> => {
    await db.execAsync(`
      DROP TABLE IF EXISTS habit_logs;
      DROP TABLE IF EXISTS habits;
    `);
  },
};