import { create } from 'zustand';
import { TasksService } from '@/services/TasksService';
import { Task } from '@/shared/types';

interface TasksState {
  tasks:        Task[];
  isLoading:    boolean;
  error:        string | null;
  loadAllTasks: () => Promise<void>;
  toggleTask:   (id: string) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks:     [],
  isLoading: false,
  error:     null,

  loadAllTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await TasksService.getAllTasks();
      set({ tasks, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  toggleTask: async (id: string) => {
    const current   = get().tasks;
    const target    = current.find(t => t.id === id);
    if (!target) return;

    const newValue  = !target.completed;

    // 1. Optimistic update — UI responds instantly
    set({
      tasks: current.map(t =>
        t.id === id ? { ...t, completed: newValue } : t
      ),
    });

    // 2. Persist — if it fails, roll back
    try {
      await TasksService.updateCompletion(id, newValue);
    } catch (err: any) {
      set({
        tasks: current,   // revert to original
        error: err.message,
      });
    }
  },
}));