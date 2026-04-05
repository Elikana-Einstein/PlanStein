import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Habit }  from '@/shared/types';
import { Colors } from '@/shared/constants/Colors';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

const HABIT_COLORS = [C.primary, C.secondary, C.accent, C.success];

type Props = { habits: Habit[] };

export const HabitsPreview: React.FC<Props> = ({ habits }) => {
  const visible = habits.slice(0, 4);

  if (!visible.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No habits yet</Text>
      </View>
    );
  }

  const getPillStyle = (streak: number) => {
    if (streak === 0)  return { container: styles.pillRed,   text: styles.pillRedText   };
    if (streak < 5)    return { container: styles.pillAmber, text: styles.pillAmberText };
    return               { container: styles.pillGreen, text: styles.pillGreenText };
  };

  const getPillLabel = (habit: Habit) => {
    if (habit.streak === 0) return 'Broken';
    return `${habit.streak}d streak`;
  };

  return (
    <View style={styles.card}>
      {visible.map((habit, i) => {
        const pill  = getPillStyle(habit.streak);
        const color = habit.color ?? HABIT_COLORS[i % HABIT_COLORS.length];
        return (
          <View
            key={habit.id}
            style={[styles.row, i < visible.length - 1 && styles.rowBorder]}
          >
            <View style={[styles.dot, { backgroundColor: color }]} />
            <Text style={styles.name} numberOfLines={1}>{habit.name}</Text>
            <View style={[styles.pill, pill.container]}>
              <Text style={[styles.pillText, pill.text]}>{getPillLabel(habit)}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.lg,
    overflow:        'hidden',
    marginBottom:    S.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    paddingVertical:   11,
    paddingHorizontal: S.md,
    gap:           S.sm,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: C.borderFaint,
  },
  dot: {
    width:        8,
    height:       8,
    borderRadius: 4,
    flexShrink:   0,
  },
  name: { flex: 1, fontSize: 12, color: C.textMuted },
  pill: {
    paddingVertical:   2,
    paddingHorizontal: 8,
    borderRadius:      R.full,
    borderWidth:       0.5,
  },
  pillText:      { fontSize: 10, fontWeight: '500' },
  pillGreen:     { backgroundColor: '#0a1f12', borderColor: '#0f3020' },
  pillGreenText: { color: C.success },
  pillAmber:     { backgroundColor: '#2a1e08', borderColor: '#3a2a10' },
  pillAmberText: { color: C.accent },
  pillRed:       { backgroundColor: '#2a0a0a', borderColor: '#3a1010' },
  pillRedText:   { color: C.error },
  empty: { paddingVertical: S.lg, alignItems: 'center' },
  emptyText: { fontSize: 13, color: C.textDim },
});