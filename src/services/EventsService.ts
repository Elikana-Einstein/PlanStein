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

  seedMockEvents: async (): Promise<void> => {
    const mockEvents: Event[] = [
      { id: '1', title: 'Team meeting',       date: 'Today',    time: '09:00 AM', category: 'Work',     completed: false },
      { id: '2', title: 'Doctor appointment', date: 'Tomorrow', time: '02:30 PM', category: 'Personal', completed: false },
      { id: '3', title: 'Code review',        date: 'Today',    time: '11:00 AM', category: 'Dev',      completed: false },
    ];
    for (const event of mockEvents) {
      await db.runAsync(
        `INSERT OR REPLACE INTO events
           (id, title, date, time, category, completed)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [event.id, event.title, event.date, event.time ?? null,
         event.category, event.completed ? 1 : 0]
      );
    }
  },
};