import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Goal } from '@/shared/types/index';
import { Colors } from '@/shared/constants/Colors';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

// Fallback colors
const GOAL_COLORS = [C.primary, C.secondary, C.accent, C.success];

type Props = {
  goals:   Goal[];
  onToggle?: (id: string) => void;
};

export const GoalsMiniGrid: React.FC<Props> = ({ goals, onToggle }) => {
  if (goals.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No goals yet — set one to get started</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {goals.slice(0, 4).map((goal, index) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          accentColor={goal.color ?? GOAL_COLORS[index % GOAL_COLORS.length]}
          onToggle={onToggle}
        />
      ))}
    </View>
  );
};

// ─── GoalCard ────────────────────────────────────────────────────────────────

type GoalCardProps = {
  goal:        Goal;
  accentColor: string;
  onToggle?:   (id: string) => void;
};

const GoalCard: React.FC<GoalCardProps> = ({ goal, accentColor, onToggle }) => {
  const progress = goal.progress ?? 0;

  const badgeStyle =
    progress >= 100
      ? { bg: `${accentColor}18`, border: `${accentColor}40`, text: accentColor }
      : { bg: C.surfaceLight,     border: C.border,           text: C.textDim   };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onToggle?.(goal.id)}
      activeOpacity={0.7}
    >
      {/* Title row with color dot */}
      <View style={styles.nameRow}>
        <View style={[styles.colorDot, { backgroundColor: accentColor }]} />
        <Text style={styles.name} numberOfLines={1}>{goal.title}</Text>
      </View>

      {/* Progress value */}
      <Text style={styles.progressValue}>{progress}%</Text>
      <Text style={styles.progressLabel}>completed</Text>

      {/* Progress bar */}
      <View style={styles.barContainer}>
        <View
          style={[
            styles.bar,
            {
              width: `${progress}%`,
              backgroundColor: accentColor,
            },
          ]}
        />
      </View>

      {/* Badge */}
      <View
        style={[
          styles.badge,
          { backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border },
        ]}
      >
        <Text style={[styles.badgeText, { color: badgeStyle.text }]}>
          {progress >= 100 ? 'Completed' : 'In progress'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── Styles (mirrors HabitsMiniGrid) ─────────────────────────────────────────

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: S.md,
    gap: S.sm,
  },

  empty: {
    paddingHorizontal: S.md,
    paddingVertical: S.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: C.textDim,
  },

  // Card
  card: {
    width: '48%',
    backgroundColor: C.surface,
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: R.md,
    padding: S.md,
  },

  // Name row
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    marginBottom: S.sm,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 9999,
  },
  name: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: C.textPrimary,
  },

  // Progress text
  progressValue: {
    fontSize: 22,
    fontWeight: '600',
    color: C.textPrimary,
    letterSpacing: -0.8,
    lineHeight: 26,
  },
  progressLabel: {
    fontSize: 10,
    color: C.textDim,
    marginTop: 2,
  },

  // Progress bar
  barContainer: {
    height: 6,
    backgroundColor: C.surfaceLight,
    borderRadius: 9999,
    overflow: 'hidden',
    marginTop: S.sm,
  },
  bar: {
    height: '100%',
    borderRadius: 9999,
  },

  // Badge
  badge: {
    alignSelf: 'flex-start',
    marginTop: S.sm,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: R.full,
    borderWidth: 0.5,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '500',
  },
});