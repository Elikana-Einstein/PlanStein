import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";
import { Colors } from '@/shared/constants/Colors';
import Quickchat from './Quickchat';

export default function FreshChatContainer() {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    }}>

      {/* Icon */}
      <View style={{
        paddingVertical: 12,
        width: 80,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3b82f6',
        borderRadius: 999,
        backgroundColor: '#2d3051',
      }}>
        <Ionicons
          name="sparkles-outline"
          size={24}
          color={Colors.dark.textPrimary}
        />
      </View>

      {/* Title */}
      <Text
        style={{
          textAlign: 'center',
          marginTop: 16,
          fontSize: 28,
          fontWeight: '600',
          color: Colors.dark.textPrimary,
        }}
      >
        How can I help you?
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          textAlign: 'center',
          marginTop: 8,
          fontSize: 16,
          color: '#9ca3af',
          lineHeight: 22,
        }}
      >
        Ask me anything about your tasks{"\n"}
        goals, or anything else in mind.
      </Text>

      {/* Quick Chat */}
      <View style={{
        marginTop: 40,
        width: '100%',
        alignItems: 'center',
      }}>
        <Quickchat />
      </View>

    </View>
  )
}