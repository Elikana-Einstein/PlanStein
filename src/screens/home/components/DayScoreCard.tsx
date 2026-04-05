import { ProgressRing } from '@/shared/components/ProgressRing';
import { Colors } from '@/shared/constants/Colors';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

type ScoreBreakdown = {
  tasksCompleted:  number;
  habitsCompleted: number;
  focusMinutes:    number;
};

type Props = {
  score:     number;        // 0–100
  delta:     number;        // change from yesterday
  breakdown: ScoreBreakdown;
};

export const DayScoreCard: React.FC<Props> = ({ score, delta, breakdown }) => {
  const deltaPositive = delta >= 0;
  const deltaLabel    = deltaPositive ? `+${delta}` : `${delta}`;

  return (
    <View style={styles.card}>

      {/* Left: text info */}
      <View style={styles.left}>
        <Text style={styles.label}>Day score</Text>

        <Text style={styles.score}>{score}</Text>

        <Text style={[styles.delta, deltaPositive ? styles.deltaPos : styles.deltaNeg]}>
          {deltaLabel} from yesterday
        </Text>

        {/* Breakdown pills */}
        <View style={styles.breakdown}>
          <BreakdownPill
            color={C.primary}
            label={`${breakdown.tasksCompleted} tasks`}
          />
          <BreakdownPill
            color={C.secondary}
            label={`${breakdown.habitsCompleted} habits`}
          />
          <BreakdownPill
            color={C.accent}
            label={`${breakdown.focusMinutes} min`}
          />
        </View>
      </View>

      {/* Right: animated ring */}
      <ProgressRing
        progress={score / 100}
        size={80}
        strokeWidth={7}
        color={C.primary}
        trackColor={C.surfaceLight}
        showLabel={true}
      />

    </View>
  );
};

// ─── Internal sub-component ───────────────────────────────────────────────────
// Small enough to live here — not worth its own file

type PillProps = { color: string; label: string };

const BreakdownPill: React.FC<PillProps> = ({ color, label }) => (
  <View style={pillStyles.row}>
    <View style={[pillStyles.dot, { backgroundColor: color }]} />
    <Text style={pillStyles.text}>{label}</Text>
  </View>
);

const pillStyles = StyleSheet.create({
  row:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot:  { width: 5, height: 5, borderRadius: 9999 },
  text: { fontSize: 10, color: C.textDim },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    flexDirection:    'row',
    alignItems:       'center',
    backgroundColor:  C.surface,
    borderWidth:      0.5,
    borderColor:      C.border,
    borderRadius:     R.lg,
    paddingHorizontal: S.md,
    paddingVertical:  S.md,
    marginHorizontal: S.md,
    marginVertical:   S.sm,
    gap:              S.md,
  },
  left: {
    flex: 1,
  },
  label: {
    fontSize:      10,
    color:         C.textDim,
    letterSpacing: 0.1,
    textTransform: 'uppercase',
    marginBottom:  S.xs,
  },
  score: {
    fontSize:      40,
    fontWeight:    '600',
    color:         C.primary,
    letterSpacing: -1.5,
    lineHeight:    44,
  },
  delta: {
    fontSize:  11,
    marginTop: 4,
  },
  deltaPos: { color: C.success },
  deltaNeg: { color: C.error   },
  breakdown: {
    flexDirection: 'row',
    gap:           S.md,
    marginTop:     S.sm,
  },
});