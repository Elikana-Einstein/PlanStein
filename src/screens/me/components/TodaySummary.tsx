import { Colors } from '@/shared/constants/Colors';
import { MeStats } from '@/shared/types';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

type Props = { stats: MeStats };

export const TodaySummary: React.FC<Props> = ({ stats }) => {
  const cells = [
    {
      value: `${stats.todayTasks.done}/${stats.todayTasks.total}`,
      label: 'Tasks',
      color: C.primary,
    },
    {
      value: `${stats.todayHabits}/${stats.todayHabitsTotal}`,
      label: 'Habits',
      color: C.secondary,
    },
    {
      value: `${stats.todayFocusMins}m`,
      label: 'Focus',
      color: C.accent,
    },
  ];

  return (
    <View style={styles.row}>
      {cells.map((cell, i) => (
        <View key={i} style={styles.cell}>
          <View style={[styles.dot, { backgroundColor: cell.color }]} />
          <Text style={styles.value}>{cell.value}</Text>
          <Text style={styles.label}>{cell.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap:           S.sm,
    marginBottom:  S.sm,
  },
  cell: {
    flex:            1,
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.md,
    paddingVertical: S.md,
    paddingHorizontal: S.sm,
    alignItems:      'center',
  },
  dot: {
    width:         6,
    height:        6,
    borderRadius:  3,
    marginBottom:  S.sm,
  },
  value: {
    fontSize:      18,
    fontWeight:    '600',
    color:         C.textPrimary,
    letterSpacing: -0.5,
    lineHeight:    22,
  },
  label: {
    fontSize:      9,
    color:         C.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop:     3,
  },
});