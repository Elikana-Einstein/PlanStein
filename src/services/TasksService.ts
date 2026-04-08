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

 addTask: async (id:string,title:string,tag:string,due_date:string):Promise<void> =>{
  
  await db.runAsync(
    `INSERT INTO tasks (id,title,tag,due_date) VALUES (?,?,?,?)`,
    [id,title,tag,due_date]
  )
 }
};