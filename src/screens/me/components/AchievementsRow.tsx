import { Colors } from '@/shared/constants/Colors';
import { Achievement } from '@/shared/types';
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

const ICONS: Record<string, string> = {
  first_focus:    '⏱',
  streak_7:       '⭐',
  tasks_10:       '✅',
  streak_30:      '🏆',
  focus_10h:      '🔥',
  habits_perfect: '💎',
};

type Props = { achievements: Achievement[] };

export const AchievementsRow: React.FC<Props> = ({ achievements }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.row}
  >
    {achievements.map(achievement => (
      <View
        key={achievement.id}
        style={[styles.badge, !achievement.earned && styles.badgeLocked]}
      >
        <View style={[styles.icon, achievement.earned && styles.iconEarned]}>
          <Text style={styles.iconText}>
            {ICONS[achievement.id] ?? '🎯'}
          </Text>
        </View>
        <Text style={[styles.label, achievement.earned && styles.labelEarned]}>
          {achievement.title}
        </Text>
      </View>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  row: {
    gap:           S.sm,
    paddingRight:  S.md,
    paddingBottom: S.sm,
  },
  badge: {
    width:      72,
    alignItems: 'center',
    gap:        4,
    opacity:    0.35,
  },
  badgeLocked: {
    opacity: 0.35,
  },
  icon: {
    width:           48,
    height:          48,
    borderRadius:    14,
    backgroundColor: C.surfaceLight,
    borderWidth:     0.5,
    borderColor:     C.border,
    alignItems:      'center',
    justifyContent:  'center',
  },
  iconEarned: {
    backgroundColor: C.primaryFaint,
    borderColor:     C.primaryDim,
    opacity:         1,
  },
  iconText: { fontSize: 22 },
  label: {
    fontSize:   8,
    color:      C.textDim,
    textAlign:  'center',
    lineHeight: 11,
  },
  labelEarned: { color: C.textMuted },
});