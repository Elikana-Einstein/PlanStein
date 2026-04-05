import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '@/shared/types';
import { Colors } from '@/shared/constants/Colors';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

const PRIORITY_COLOR: Record<string, string> = {
  urgent: C.error,
  high:   C.accent,
  medium: C.primary,
  low:    C.textDim,
};

const TAG_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  Work:     { bg: '#1A1030', border: '#2A1E5A', text: '#9B8EF0' },
  Dev:      { bg: '#0A2420', border: '#0F3830', text: C.secondary },
  Personal: { bg: '#2A1A08', border: '#3A2510', text: C.accent   },
  Health:   { bg: '#0A1F12', border: '#0F3020', text: C.success  },
  default:  { bg: C.surfaceLight, border: C.border, text: C.textMuted },
};

type Props = {
  task:     Task;
  onToggle: (id: string) => void;
};

export const TaskRow: React.FC<Props> = ({ task, onToggle }) => {
  const priorityColor = PRIORITY_COLOR[task.priority] ?? C.primary;
  const tagStyle      = TAG_STYLE[task.tag] ?? TAG_STYLE.default;

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onToggle(task.id)}
      activeOpacity={0.7}
    >
      {/* Priority accent */}
      <View style={[styles.accent, { backgroundColor: priorityColor }]} />

      {/* Checkbox */}
      <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </View>

      {/* Text */}
      <View style={styles.textBlock}>
        <Text
          style={[styles.title, task.completed && styles.titleDone]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        {task.dueDate && (
          <Text style={styles.due}>{task.dueDate}</Text>
        )}
      </View>

      {/* Tag */}
      <View style={[styles.tag, { backgroundColor: tagStyle.bg, borderColor: tagStyle.border }]}>
        <Text style={[styles.tagText, { color: tagStyle.text }]}>{task.tag}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.md,
    marginHorizontal: S.md,
    marginBottom:    S.sm,
    paddingVertical:  12,
    paddingRight:    S.md,
    gap:             12,
    overflow:        'hidden',
  },
  accent: {
    width:      2.5,
    alignSelf:  'stretch',
  },
  checkbox: {
    width:          20,
    height:         20,
    borderRadius:   10,
    borderWidth:    1.5,
    borderColor:    C.border,
    alignItems:     'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: C.primary,
    borderColor:     C.primary,
  },
  checkmark: {
    color:      '#fff',
    fontSize:   10,
    lineHeight: 12,
  },
  textBlock: { flex: 1 },
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