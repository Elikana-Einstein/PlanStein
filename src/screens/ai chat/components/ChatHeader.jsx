import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/shared/constants/Colors'
import { Ionicons } from "@expo/vector-icons";

export default function ChatHeader({online = false}) {
    const text = Colors.dark.textPrimary
  return (
    <View style={{ backgroundColor: Colors.dark.background, padding: 16 }}>
        <View className='flex flex-row justify-between items-center px-2'> 
            <View className='flex flex-row items-center gap-3'>
                <View className='p-4 border border-blue-500 rounded-full bg-[#2d3051]'>
                    <Ionicons name="sparkles-outline" size={12} color={text} />
                </View>
                <View>
                    <Text style={{ color: text }}>AI Assistant</Text>
                    <View className='flex flex-row gap-2 items-center'>
                        <Text className='bg-blue-600 w-2 h-2 rounded-full'></Text>
                        
                       { online ? <Text style={{ color: Colors.dark.secondary }}>Ready to help</Text> : <Text style={{ color: Colors.dark.secondary }}>Online</Text> }
                    </View>
                </View>
            </View>
            <View className='border border-[#3a3c3d] w-7 h-7 items-center rounded-lg py-1' >
                <Ionicons name="ellipsis-vertical" size={16} color={text} />
            </View>
        </View>
    </View>
  )
}