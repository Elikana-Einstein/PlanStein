import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Goal }   from '@/shared/types';
import { useRouter } from 'expo-router';
import { Colors } from '@/shared/constants/Colors';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

const GOAL_COLORS = [C.primary, C.secondary, C.accent, C.success];

type Props = { goals: Goal[] };

export const GoalsOverview: React.FC<Props> = ({ goals }) => {
  const router  = useRouter();
  const visible = goals.slice(0, 3);

  if (!visible.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No active goals yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {visible.map((goal, i) => {
        const color    = goal.color ?? GOAL_COLORS[i % GOAL_COLORS.length];
        const progress = Math.min(goal.progress / goal.target, 1);
        const pct      = Math.round(progress * 100);

        return (
          <View
            key={goal.id}
            style={[styles.row, i < visible.length - 1 && styles.rowBorder]}
          >
            <View style={styles.rowTop}>
              <Text style={styles.goalTitle} numberOfLines={1}>
                {goal.title}
              </Text>
              <Text style={[styles.goalPct, { color }]}>{pct}%</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
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
    paddingHorizontal: S.md,
    paddingVertical:   S.md,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: C.borderFaint,
  },
  rowTop: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   6,
  },
  goalTitle: {
    flex:       1,
    fontSize:   12,
    color:      C.textMuted,
    fontWeight: '500',
    marginRight: S.sm,
  },
  goalPct: {
    fontSize:   11,
    fontWeight: '500',
  },
  track: {
    height:          3,
    backgroundColor: C.borderFaint,
    borderRadius:    2,
  },
  fill: {
    height:       3,
    borderRadius: 2,
  },
  empty: {
    paddingVertical: S.lg,
    alignItems:      'center',
  },
  emptyText: { fontSize: 13, color: C.textDim },
});