import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/shared/constants/Colors';

interface SourceProps {
  title: string;
  icon: string;
  subtitle: string;
  onSourceTap: (title: string) => void; 
}
const C = Colors.dark
export default function SourceItem({ title, icon, subtitle, onSourceTap }: SourceProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        pressed && { opacity: 0.7, backgroundColor: '#11173A' } // Feedback logic
      ]}
      onPress={() => onSourceTap(title)}
    >
      <View style={styles.sourceIconWrap}>
        <MaterialCommunityIcons name={icon as any} size={35} color="#7A70FF" />
      </View>
      <Text style={styles.sourceTitle}>{title}</Text>
      <Text style={styles.sourceSubtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
 
  sourceIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    marginBlock: 8,
    padding:2,
    marginHorizontal:'auto'
  },
  sourceTitle: {
    color: C.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    marginHorizontal:'auto'

  },
  
 
  sourceSubtitle: {
    color: C.textDim,
    fontSize: 10,
    marginHorizontal:'auto'

  },
 
})