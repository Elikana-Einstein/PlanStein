// Priority Card Component (existing)

import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/Colors";


const C = Colors.dark;
const S = Colors.spacing
const R = Colors.radius
export const PriorityCard = ({ title, count }: { title: string; count: number }) => {
  const getBarColor = () => {
    switch(title) {
      case 'Urgent': return '#FF4444';
      case 'Normal': return '#FFFFFF';
      case 'Low': return '#4CAF50';
      default: return C.border;
    }
  };

  return (
    <View style={{ 
      backgroundColor: C.surface, 
      padding: S.md, 
      margin: S.sm, 
      borderRadius: R.md,
      width: 110,
      borderWidth: 0.5,
      borderColor: C.border,
      gap: 8
    }}>
      <Text style={styles.priorityCount}>{count}</Text>
      <View style={{
        height: 4,
        backgroundColor: getBarColor(),
        borderRadius: 999,
        width: '100%'
      }} />
      <Text style={{ textAlign: 'center', color: C.text }}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
     priorityCount: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    borderWidth: 2,
      borderColor: Colors.dark.primary,
      borderRadius: 999,
      alignSelf: 'center',
      marginBottom: 4,
      width: 35,
      height: 35,
      lineHeight: 40,
      

  }
})