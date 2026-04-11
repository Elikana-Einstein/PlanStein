import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  name: any;
};

export const GreetingHeader: React.FC<Props> = ({ name }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 18 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.greeting}>{greeting}</Text>
      <Text  style={styles.name}>{name}</Text>
      <Text style={styles.date}>
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 8 },
  greeting: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  name: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 4 ,fontFamily:'Inter-Bold'},
  date: { fontSize: 14, color: colors.textSecondary },
});