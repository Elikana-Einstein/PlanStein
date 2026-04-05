import {
  View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/shared/constants/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import ChatHeader from '../../src/screens/ai chat/components/ChatHeader'
import FreshChatContainer from '../../src/screens/ai chat/components/FreshChatContainer'
import MessageInput from '../../src/screens/ai chat/components/MessageInput'
import { useAIStore } from '@/stores/useAiStore'
import ChatContainer from '@/screens/ai chat/components/ChatContainer'

export default function ChatScreenLayout() {
  const backgroundColor = Colors.dark.background
  const [chatLoaded, setChatLoaded] = useState(false);
  const chats = useAIStore((state) => state.chats);

  useEffect(() => {
    setChatLoaded(chats.length > 0);
  }, [chats]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ flex: 1 }}>
          <ChatHeader />

          <View style={{ flex: 1 }}>
            {!chatLoaded ? (
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <FreshChatContainer />
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <ChatContainer />  // FlatList handles keyboard dismiss itself
            )}
          </View>

          <MessageInput />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}