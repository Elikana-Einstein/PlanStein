import { Task } from '@/shared/types';
import { useTasksStore } from '@/stores/tasksStore';
import { useState, useMemo, useEffect } from 'react';

type Filter = 'all' | 'today' | 'urgent' | 'done';

export const useTasksData = () => {
  const { tasks, loadAllTasks, toggleTask } = useTasksStore();
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    loadAllTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'today':
        return tasks.filter(t => t.dueDate === 'Today' && !t.completed);
      case 'urgent':
        return tasks.filter(t => t.priority === 'urgent' && !t.completed);
      case 'done':
        return tasks.filter(t => t.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const groupedTasks = useMemo(() => {
    if (filter === 'done') {
      return [{ title: 'Completed', data: filteredTasks }];
    }

    const groups: Record<string, Task[]> = {};
    filteredTasks.forEach(task => {
      const priority = task.priority || 'medium';
      const groupKey = priority.toUpperCase();
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(task);
    });
    const order = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];
    return order.map(key => ({ title: key, data: groups[key] || [] }));
  }, [filteredTasks, filter]);

  return {
    groupedTasks,
    filter,
    setFilter,
    toggleTask,
  };
};