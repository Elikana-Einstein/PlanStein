import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

type Props = {
  title: string;
  onSeeAll?: () => void;
};

export const SectionHeader: React.FC<Props> = ({ title, onSeeAll }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {onSeeAll && (
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.seeAll}>See all</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
  },
});