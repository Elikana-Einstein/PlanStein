import { Task } from '@/shared/types';
import { db, mapRowToTask } from '@/db/database';

export const TasksService = {

  getAllTasks: async (): Promise<Task[]> => {
    const rows = await db.getAllAsync(`
      SELECT * FROM tasks ORDER BY
        CASE priority
          WHEN 'urgent' THEN 1
          WHEN 'high'   THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low'    THEN 4
          ELSE 5
        END
    `);
    return (rows as Record<string, unknown>[]).map(mapRowToTask);
  },

  updateCompletion: async (id: string, completed: boolean): Promise<void> => {
    await db.runAsync(
      `UPDATE tasks SET completed = ? WHERE id = ?`,
      [completed ? 1 : 0, id]
    );
  },

  seedMockTasks: async (): Promise<void> => {
    const mockTasks: Task[] = [
      { id: '1', title: 'Submit project proposal', tag: 'Work',     dueDate: 'Today',     completed: false, priority: 'urgent' },
      { id: '2', title: 'Review Expo Router docs',  tag: 'Dev',      dueDate: 'Tomorrow',  completed: false, priority: 'high'   },
      { id: '3', title: 'Set up Drizzle schema',    tag: 'Dev',      dueDate: 'This week', completed: false, priority: 'high'   },
      { id: '4', title: 'Grocery run — Nakumatt',   tag: 'Personal', dueDate: 'Today',     completed: false, priority: 'medium' },
      { id: '5', title: 'Morning standup notes',    tag: 'Work',     dueDate: 'Today',     completed: true,  priority: 'medium' },
    ];
    for (const task of mockTasks) {
      await db.runAsync(
        `INSERT OR REPLACE INTO tasks
           (id, title, tag, due_date, completed, priority)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [task.id, task.title, task.tag, task.dueDate ?? null,
         task.completed ? 1 : 0, task.priority]
      );
    }
  },
};