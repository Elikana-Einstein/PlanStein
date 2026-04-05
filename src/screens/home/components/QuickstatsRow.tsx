import { Colors } from '@/shared/constants/Colors';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

type Props = {
  tasksDue:   number;
  habitsDone: number;
  habitsTotal?: number;  // optional — shows "4/6" format if provided
  streak:     number;
};

export const QuickStatsRow: React.FC<Props> = ({
  tasksDue,
  habitsDone,
  habitsTotal,
  streak,
}) => {
  const habitsLabel = habitsTotal
    ? `${habitsDone}/${habitsTotal}`
    : `${habitsDone}`;

  return (
    <View style={styles.row}>
      <StatCell
        value={`${tasksDue}`}
        label="Tasks due"
        accentColor={C.primary}
      />
      <View style={styles.divider} />
      <StatCell
        value={habitsLabel}
        label="Habits"
        accentColor={C.secondary}
      />
      <View style={styles.divider} />
      <StatCell
        value={`${streak}d`}
        label="Streak"
        accentColor={C.accent}
      />
    </View>
  );
};

// ─── Internal sub-component ───────────────────────────────────────────────────

type StatCellProps = {
  value:       string;
  label:       string;
  accentColor: string;
};

const StatCell: React.FC<StatCellProps> = ({ value, label, accentColor }) => (
  <View style={styles.cell}>
    <View style={[styles.dot, { backgroundColor: accentColor }]} />
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.lg,
    marginHorizontal: S.md,
    marginVertical:  S.sm,
    overflow:        'hidden',
  },
  cell: {
    flex:           1,
    alignItems:     'center',
    paddingVertical: S.md,
    paddingHorizontal: S.sm,
  },
  divider: {
    width:           0.5,
    alignSelf:       'stretch',
    backgroundColor: C.border,
  },
  dot: {
    width:         6,
    height:        6,
    borderRadius:  9999,
    marginBottom:  S.sm,
  },
  value: {
    fontSize:      22,
    fontWeight:    '600',
    color:         C.textPrimary,
    letterSpacing: -0.8,
    lineHeight:    26,
  },
  label: {
    fontSize:      10,
    color:         C.textDim,
    marginTop:     5,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});