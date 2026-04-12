import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from "@expo/vector-icons";
import { Colors } from '../constants/Colors';
import { HabitsService } from '@/services/HabitsService';
import { generateUUID, getFormattedDate } from '../utils';

const C = Colors.dark

export default function HabitsCard({ item }) {
  const [achieved, setAchieved] = useState(false)

  useEffect(() => {
    const check = async () => {
      const done = await HabitsService.checkTodaysHabitAsAchieved(item.id);
      setAchieved(done);
    };
    check();
  }, [item.id]);

 const handleMarkAsAchieved = async () => {
    if (achieved) return; // already logged today, don't double-insert

    const id = generateUUID();
    try {
      await HabitsService.markHabitAsAchieved(id, item.id, new Date()); // ← call the function
      setAchieved(true); // ← update UI after success
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[
      styles.container,
      { borderColor: achieved ? C.success : C.border }
    ]}>
      <Text style={[
        styles.text,
        {
          color: achieved ? C.textDim : C.success,
          textDecorationLine: achieved ? 'line-through' : 'none',
        }
      ]}>
        {item.name}
      </Text>

      <TouchableOpacity
        onPress={() => handleMarkAsAchieved()}
        style={styles.button}
      >
        <Text style={[
          styles.status,
          {
            backgroundColor: achieved ? C.success + '22' : C.surfaceLight,
            borderColor: achieved ? C.success : C.textPrimary,
            color: achieved ? C.success : C.textDim,
          }
        ]}>
          {achieved ? 'Achieved' : 'Pending'}
        </Text>

        <Ionicons
          name={achieved ? 'checkbox' : 'square-outline'}
          color={achieved ? C.success : C.textDim}
          size={18}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: C.surface,
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  text: {
    fontSize: 14,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  status: {
    padding: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
    borderWidth: 0.1,
    fontSize: 12,
  }
});