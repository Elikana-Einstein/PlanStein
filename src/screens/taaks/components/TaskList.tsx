import React from 'react';
import { TaskRow } from './TaskRow';
import { GroupedList } from '@/shared/components/GroupedList';
import { Task } from '@/shared/types';

type Props = {
  groupedTasks: Array<{ title: string; data: Task[] }>;
  onToggleTask: (id: string) => void;
};

export const TasksList: React.FC<Props> = ({ groupedTasks, onToggleTask }) => {
  const renderItem = (task: Task, index: number) => (
    <TaskRow key={task.id} task={task} onToggle={onToggleTask} />
  );

  return (
    <GroupedList
      sections={groupedTasks}
      renderItem={renderItem}
      keyExtractor={(task) => task.id}
    />
  );
};