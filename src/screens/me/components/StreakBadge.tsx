import { Colors } from '@/shared/constants/Colors';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const C = Colors.dark;
const R = Colors.radius;
const S = Colors.spacing;

type Props = {
  currentStreak: number;
};

export const StreakBadge: React.FC<Props> = ({ currentStreak }) => (
  <View style={styles.badge}>
    <Text style={styles.fire}>🔥</Text>
    <Text style={styles.value}>{currentStreak}</Text>
    <Text style={styles.label}>day streak</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    flexDirection:    'row',
    alignItems:       'center',
    gap:              6,
    backgroundColor:  Colors.dark.primaryFaint,
    borderWidth:      0.5,
    borderColor:      Colors.dark.primaryDim,
    borderRadius:     R.full,
    paddingVertical:  5,
    paddingHorizontal: 14,
    marginTop:        S.sm,
    alignSelf:        'center',
  },
  fire:  { fontSize: 14 },
  value: { fontSize: 13, fontWeight: '600', color: C.textPrimary },
  label: { fontSize: 11, color: C.primary },
});