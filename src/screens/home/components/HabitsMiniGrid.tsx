import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Habit } from '@/shared/types/index';
import { Colors } from '@/shared/constants/Colors';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

// Cycle through these if a habit has no color set
const HABIT_COLORS = [C.primary, C.secondary, C.accent, C.success];

type Props = {
  habits:   Habit[];
  onToggle: (id: string) => void;
};

export const HabitsMiniGrid: React.FC<Props> = ({ habits, onToggle }) => {
  if (habits.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No habits yet — add one to get started</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {habits.slice(0, 4).map((habit, index) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          accentColor={habit.color ?? HABIT_COLORS[index % HABIT_COLORS.length]}
          onToggle={onToggle}
        />
      ))}
    </View>
  );
};

// ─── HabitCard ────────────────────────────────────────────────────────────────

type HabitCardProps = {
  habit:       Habit;
  accentColor: string;
  onToggle:    (id: string) => void;
};

const HabitCard: React.FC<HabitCardProps> = ({ habit, accentColor, onToggle }) => {
  // Badge style changes based on completion
  const badgeStyle = habit.completedToday
    ? { bg: `${accentColor}18`, border: `${accentColor}40`, text: accentColor }
    : { bg: C.surfaceLight,     border: C.border,           text: C.textDim   };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onToggle(habit.id)}
      activeOpacity={0.7}
    >
      {/* Name row with color dot */}
      <View style={styles.nameRow}>
        <View style={[styles.colorDot, { backgroundColor: accentColor }]} />
        <Text style={styles.name} numberOfLines={1}>{habit.name}</Text>
      </View>

      {/* Streak number */}
      <Text style={styles.streakValue}>{habit.streak}</Text>
      <Text style={styles.streakLabel}>day streak</Text>

      {/* Last 7 days dots */}
      <View style={styles.dots}>
        {habit.lastSevenDays.map((done, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              done
                ? { backgroundColor: accentColor }
                : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* Done / Pending badge */}
      <View style={[
        styles.badge,
        { backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border },
      ]}>
        <Text style={[styles.badgeText, { color: badgeStyle.text }]}>
          {habit.completedToday ? 'Done today' : 'Pending'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  grid: {
    flexDirection:    'row',
    flexWrap:         'wrap',
    paddingHorizontal: S.md,
    gap:              S.sm,
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

  // Card
  card: {
    width:           '48%',
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.md,
    padding:         S.md,
  },

  // Name row
  nameRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           S.sm,
    marginBottom:  S.sm,
  },
  colorDot: {
    width:        8,
    height:       8,
    borderRadius: 9999,
  },
  name: {
    flex:       1,
    fontSize:   13,
    fontWeight: '500',
    color:      C.textPrimary,
  },

  // Streak
  streakValue: {
    fontSize:      22,
    fontWeight:    '600',
    color:         C.textPrimary,
    letterSpacing: -0.8,
    lineHeight:    26,
  },
  streakLabel: {
    fontSize:  10,
    color:     C.textDim,
    marginTop: 2,
  },

  // Dots
  dots: {
    flexDirection: 'row',
    gap:           3,
    marginTop:     S.sm,
  },
  dot: {
    width:        6,
    height:       6,
    borderRadius: 9999,
  },
  dotInactive: {
    backgroundColor: C.surfaceLight,
  },

  // Badge
  badge: {
    alignSelf:        'flex-start',
    marginTop:        S.sm,
    paddingVertical:  3,
    paddingHorizontal: 8,
    borderRadius:     R.full,
    borderWidth:      0.5,
  },
  badgeText: {
    fontSize:   9,
    fontWeight: '500',
  },
});