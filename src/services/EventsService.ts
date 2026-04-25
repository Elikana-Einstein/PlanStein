import { Event } from '@/shared/types';
import { db, mapRowToEvent } from '@/db/database';

export const EventsService = {

  getAllEvents: async (): Promise<Event[]> => {
    const rows = await db.getAllAsync(`
      SELECT * FROM events ORDER BY
        CASE date
          WHEN 'Today'    THEN 1
          WHEN 'Tomorrow' THEN 2
          ELSE 3
        END
    `);
    return (rows as Record<string, unknown>[]).map(mapRowToEvent);
  },

  updateCompletion: async (id: string, completed: boolean): Promise<void> => {
    await db.runAsync(
      `UPDATE events SET completed = ? WHERE id = ?`,
      [completed ? 1 : 0, id]
    );
  },
addEvent: async (event: {
            id: string;
            title: string;
            date: string;
            time: string | null;
            recurrent: number;
            reminder_time: string | null;
            category: string;
            completed: number;
                        })          : Promise<void> => {
            await db.runAsync(
              `INSERT INTO events (id, title, date, time, recurrent, reminder_time, category, completed)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                event.id,
                event.title,
                event.date,
                event.time,
                event.recurrent,
                event.reminder_time,
                event.category,
                event.completed,
              ]
            );
          },          

 
};