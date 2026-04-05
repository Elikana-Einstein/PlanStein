
import { Achievement } from '../types';

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id:          'first_focus',
    title:       'First focus',
    description: 'Complete your first focus session',
    earned:      false,
  },
  {
    id:          'streak_7',
    title:       '7 day streak',
    description: 'Stay consistent for 7 days',
    earned:      false,
  },
  {
    id:          'tasks_10',
    title:       '10 tasks done',
    description: 'Complete 10 tasks',
    earned:      false,
  },
  {
    id:          'streak_30',
    title:       '30 day streak',
    description: 'Stay consistent for 30 days',
    earned:      false,
  },
  {
    id:          'focus_10h',
    title:       '10 hours focused',
    description: 'Log 10 hours of total focus time',
    earned:      false,
  },
  {
    id:          'habits_perfect',
    title:       'Perfect week',
    description: 'Complete all habits for 7 days straight',
    earned:      false,
  },
];