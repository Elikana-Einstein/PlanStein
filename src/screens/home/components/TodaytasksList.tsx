import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task, TaskPriority, TaskTag } from '@/shared/types/index';
import { Colors } from '@/shared/constants/Colors';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

type Props = {
  tasks:    Task[];
  onToggle: (id: string) => void;
};

export const TodayTasksList: React.FC<Props> = ({ tasks, onToggle }) => {
  if (tasks.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No tasks for today</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tasks.slice(0, 4).map((task) => (
        <TaskRow key={task.id} task={task} onToggle={onToggle} />
      ))}
    </View>
  );
};

// ─── TaskRow ──────────────────────────────────────────────────────────────────

type TaskRowProps = {
  task:     Task;
  onToggle: (id: string) => void;
};

const TaskRow: React.FC<TaskRowProps> = ({ task, onToggle }) => {
  const priorityColor = PRIORITY_COLOR[task.priority] ?? C.primary;
  const tagStyle      = TAG_STYLE[task.tag]           ?? TAG_STYLE.default;
  const dueLabel      = task.dueDate
    ? formatDueDate(task.dueDate)
    : 'No due date';

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onToggle(task.id)}
      activeOpacity={0.7}
    >
      {/* Priority accent bar */}
      <View style={[styles.accent, { backgroundColor: priorityColor }]} />

      {/* Checkbox */}
      <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
        {task.completed && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </View>

      {/* Text */}
      <View style={styles.textBlock}>
        <Text
          style={[styles.title, task.completed && styles.titleDone]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        <Text style={styles.due}>{dueLabel}</Text>
      </View>

      {/* Tag pill */}
      <View style={[styles.tag, { backgroundColor: tagStyle.bg, borderColor: tagStyle.border }]}>
        <Text style={[styles.tagText, { color: tagStyle.text }]}>
          {task.tag}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PRIORITY_COLOR: Record<string, string> = {
  urgent: C.error,
  high:   C.accent,
  medium: C.primary,
  low:    C.textDim,
};

const TAG_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  Work: {
    bg:     '#1A1030',
    border: '#2A1E5A',
    text:   '#9B8EF0',
  },
  Dev: {
    bg:     '#0A2420',
    border: '#0F3830',
    text:   C.secondary,
  },
  Personal: {
    bg:     '#2A1A08',
    border: '#3A2510',
    text:   C.accent,
  },
  Health: {
    bg:     '#0A1F12',
    border: '#0F3020',
    text:   C.success,
  },
  default: {
    bg:     C.surfaceLight,
    border: C.border,
    text:   C.textMuted,
  },
};

function formatDueDate(iso: string): string {
  const date  = new Date(iso);
  const today = new Date();
  const diff  = Math.floor(
    (date.setHours(0,0,0,0) - today.setHours(0,0,0,0)) / 86_400_000
  );
  if (diff === 0)  return 'Due today';
  if (diff === 1)  return 'Due tomorrow';
  if (diff === -1) return 'Due yesterday';
  if (diff < 0)   return `${Math.abs(diff)}d overdue`;
  return `In ${diff}d`;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: S.md,
    gap:               S.sm,
  },
  empty: {
    paddingHorizontal: S.md,
    paddingVertical:   S.lg,
    alignItems:        'center',
  },
  emptyText: {
    fontSize: 13,
    color:    C.textDim,
  },

  // Row
  row: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.md,
    paddingVertical:  12,
    paddingRight:    S.md,
    gap:             12,
    overflow:        'hidden',
  },

  // Accent bar
  accent: {
    width:      2.5,
    alignSelf:  'stretch',
  },

  // Checkbox
  checkbox: {
    width:        20,
    height:       20,
    borderRadius: 10,
    borderWidth:  1.5,
    borderColor:  C.border,
    alignItems:   'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: C.primary,
    borderColor:     C.primary,
  },
  checkmark: {
    alignItems:     'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color:      '#fff',
    fontSize:   10,
    lineHeight: 12,
  },

  // Text
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize:   14,
    fontWeight: '500',
    color:      C.textPrimary,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color:              C.textDim,
  },
  due: {
    fontSize:  11,
    color:     C.textDim,
    marginTop: 3,
  },

  // Tag
  tag: {
    paddingVertical:   3,
    paddingHorizontal: 9,
    borderRadius:      R.full,
    borderWidth:       0.5,
  },
  tagText: {
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 0.2,
  },
});