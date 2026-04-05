import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const SkeletonLoader = () => (
  <View style={styles.container}>
    {[...Array(6)].map((_, i) => (
      <View key={i} style={styles.skeletonItem} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  skeletonItem: {
    height: 60,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: 12,
  },
});