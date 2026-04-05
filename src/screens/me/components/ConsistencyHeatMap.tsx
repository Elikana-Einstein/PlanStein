import { Colors } from '@/shared/constants/Colors';
import { MeStats } from '@/shared/types';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

const INTENSITY_COLORS = ['#1a1a2e', '#2a1e5a', '#4a36a0', C.primary];
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

type Props = { stats: MeStats };

export const ConsistencyHeatmap: React.FC<Props> = ({ stats }) => (
  <View style={styles.card}>
    {/* Stats row */}
    <View style={styles.statsRow}>
      <StatItem value={`${stats.currentStreak}`}  label="Current streak" />
      <StatItem value={`${stats.bestStreak}`}     label="Best streak"    />
      <StatItem value={`${stats.monthConsistency}%`} label="This month"  />
    </View>

    {/* Grid — 4 rows × 7 cols = 28 days */}
    <View style={styles.grid}>
      {stats.heatmap.map((intensity, i) => (
        <View
          key={i}
          style={[
            styles.cell,
            { backgroundColor: INTENSITY_COLORS[intensity] ?? INTENSITY_COLORS[0] },
          ]}
        />
      ))}
    </View>

    {/* Day labels */}
    <View style={styles.dayRow}>
      {DAY_LABELS.map((d, i) => (
        <Text key={i} style={styles.dayLabel}>{d}</Text>
      ))}
    </View>
  </View>
);

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <View>
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
    flexDirection:  'row',
    gap:            S.lg,
    marginBottom:   S.md,
  },
  statValue: {
    fontSize:      18,
    fontWeight:    '600',
    color:         C.textPrimary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize:      9,
    color:         C.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop:     2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           3,
  },
  cell: {
    width:        `${(100 - 6 * 3) / 7}%` as any,
    aspectRatio:  1,
    borderRadius: 3,
  },
  dayRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginTop:      6,
  },
  dayLabel: {
    fontSize:   8,
    color:      C.textDim,
    textAlign:  'center',
    flex:       1,
  },
});