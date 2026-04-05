import { useState, useMemo, useEffect } from 'react';
import { useTasksStore } from '@/stores/tasksStore';
import { Task } from '@/shared/types';

type Filter = 'all' | 'today' | 'urgent' | 'done';

export const useTasksData = () => {
  const { tasks, loadAllTasks, toggleTask, isLoading, error } = useTasksStore();
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => { loadAllTasks(); }, []);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'today':  return tasks.filter(t => t.dueDate === 'Today' && !t.completed);
      case 'urgent': return tasks.filter(t => t.priority === 'urgent' && !t.completed);
      case 'done':   return tasks.filter(t => t.completed);
      default:       return tasks.filter(t => !t.completed);  // 'all' hides done
    }
  }, [tasks, filter]);

  const groupedTasks = useMemo(() => {
    if (filter === 'done') {
      return filteredTasks.length > 0
        ? [{ title: 'Completed', data: filteredTasks }]
        : [];
    }

    const groups: Record<string, Task[]> = {};
    filteredTasks.forEach(task => {
      const key = (task.priority ?? 'medium').toUpperCase();
      if (!groups[key]) groups[key] = [];
      groups[key].push(task);
    });

    const order = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];
    // Filter out empty groups — no ghost headers
    return order
      .map(key => ({ title: key, data: groups[key] ?? [] }))
      .filter(group => group.data.length > 0);
  }, [filteredTasks, filter]);

  return { groupedTasks, filter, setFilter, toggleTask, isLoading, error };
};