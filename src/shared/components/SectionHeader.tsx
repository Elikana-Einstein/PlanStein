import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { router } from 'expo-router';

type Props = {
  title: string;
  onSeeAll?: string;
};

export const SectionHeader: React.FC<Props> = ({ title, onSeeAll }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {onSeeAll && (
      <TouchableOpacity onPress={()=>{
        switch (title) {
          case "Habits":
            router.push('/habits/HabitsScreen')
            break;
          case "Today":
            router.push('/(tabs)/tasks')
          
          default:
            break;
        }
      }}>
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