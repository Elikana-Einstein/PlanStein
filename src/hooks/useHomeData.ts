import { useEffect } from 'react';
import { useTasksStore } from '../stores/tasksStore';
import { useHabitsStore } from '../stores/useHabitsStore';
import { useGoalsStore } from '../stores/goalsStore';
import { useUserStore } from '../stores/userStore';
import { ScoreService } from '../services/ScoreService';

export const useHomeData = () => {
  const { tasks, isLoading: tasksLoading, error: tasksError, loadAllTasks, toggleTask } = useTasksStore();
  const { habits, isLoading: habitsLoading, error: habitsError, loadTodayHabits, toggleHabit } = useHabitsStore();
  const { goals, isLoading: goalsLoading, error: goalsError, loadActiveGoals } = useGoalsStore();
  const { name, streak, isLoading: userLoading, error: userError, loadUserData } = useUserStore();

  useEffect(() => {
    loadAllTasks();
    loadTodayHabits();
    loadActiveGoals();
    loadUserData();
  }, []);

  const scoreData = ScoreService.computeDayScore(tasks, habits);
  const tasksDue = tasks.filter(t => !t.completed).length;
  const tasksCompleted = tasks.filter(t => t.completed).length;
  const habitsDone = habits.filter(h => h.completedToday).length;
  const habitsTotal = habits.length;

  const isLoading = tasksLoading || habitsLoading || goalsLoading || userLoading;
  const error = tasksError || habitsError || goalsError || userError;

  return {
    isLoading,
    error,
    tasks,
    habits,
    goals,
    name,
    streak,
    score: scoreData.total,
    delta: scoreData.delta,
    tasksDue,
    tasksCompleted,
    habitsDone,
    habitsTotal,
    focusMinutes: scoreData.focusMinutes,
    toggleTask,
    toggleHabit,
  };
};