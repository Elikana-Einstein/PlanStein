import { Colors } from '@/shared/constants/Colors';
import { MeStats } from '@/shared/types';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

const WEEKLY_GOAL_MINS = 7 * 60; // 7 hours

type Props = { stats: MeStats };

export const FocusStatsCard: React.FC<Props> = ({ stats }) => {
  const progress = Math.min(stats.weekFocusMins / WEEKLY_GOAL_MINS, 1);

  const formatMins = (mins: number): string => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.statsRow}>
        <StatItem value={formatMins(stats.weekFocusMins)} label="Total focused"  />
        <StatItem value={`${stats.avgSessionMins}m`}      label="Avg session"    />
        <StatItem value={`${stats.weekSessions}`}          label="Sessions"       />
      </View>

      {/* Weekly goal bar */}
      <View style={styles.barWrap}>
        <View style={styles.barLabels}>
          <Text style={styles.barLabel}>Weekly goal: 7h</Text>
          <Text style={styles.barLabel}>
            {formatMins(stats.weekFocusMins)} / {formatMins(WEEKLY_GOAL_MINS)}
          </Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
      </View>
    </View>
  );
};

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <View style={{ flex: 1 }}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.lg,
    padding:         S.md,
    marginBottom:    S.sm,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom:  S.md,
  },
  statValue: {
    fontSize:      16,
    fontWeight:    '600',
    color:         C.textPrimary,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize:      9,
    color:         C.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop:     2,
  },
  barWrap:   { gap: 4 },
  barLabels: {
    flexDirection:  'row',
    justifyContent: 'space-between',
  },
  barLabel: { fontSize: 9, color: C.textDim },
  track: {
    height:          3,
    backgroundColor: C.borderFaint,
    borderRadius:    2,
  },
  fill: {
    height:          3,
    backgroundColor: C.primary,
    borderRadius:    2,
  },
});