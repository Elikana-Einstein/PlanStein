import { View, TextInput, TouchableOpacity } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import { Ionicons } from "@expo/vector-icons";
import { generateUUID } from '@/shared/utils';
import { db } from '@/db/database';
import AiService from '@/services/AiService';
import { useAIStore } from '@/stores/useAiStore';
import SendLoading from '@/shared/components/sendLoading';

export default function MessageInput() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const {set_chat_id} = useAIStore()
  const chatId = useAIStore().chat_id

  const handleSend = async () => {
    if (!text.trim() || loading) return;
    let chat_id;
    if (!chatId) {
      chat_id = generateUUID();
      set_chat_id(chat_id);

      await AiService.createNewChat(chat_id);
    }else{
      chat_id = chatId;
    }


    const userMessage = {
      id: generateUUID(),
      chat_id,
      sender: 'user',
      text: text, // Make sure this is a string
      timestamp: Date.now(),
    };
    try {
      await AiService.addMessageToDb(userMessage,'user')

      // Update store
      useAIStore.getState().addMessage(userMessage);
      
      // 2. Call AI
      const aiResponse = await AiService.sendMessageToGroq(text);
      
      // Clear input immediately
      setText('');

      const aiMessage = {
        id: generateUUID(),
        chat_id: chat_id,
        sender: 'ai',
        text: aiResponse,
        timestamp: Date.now(),
      };
      
      // Update store with AI response
      useAIStore.getState().addMessage(aiMessage);

      await AiService.addMessageToDb(aiMessage,'ai')
      // 4. Update chat timestamp
     await AiService.updateTimeStamp(chat_id);

    } catch (error) {
      console.error('Send message error:', error);
      // Optional: Show error to user
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{
      backgroundColor: '#363738',
      borderWidth: 2,
      borderColor: '#3a3c5d',
      padding: 8,
      margin: 4,
      borderRadius: 10
    }}>
      <TextInput
        placeholder='Message AI'
        placeholderTextColor="#888"
        multiline
        value={text}
        onChangeText={setText}
        textAlignVertical='top'
        style={{ color: 'white', minHeight: 40, maxHeight: 120 }}
        editable={!loading}
      />

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        marginTop: 6
      }}>
        <Ionicons name='add-circle-outline' size={20} color={'white'} />
        
        <TouchableOpacity onPress={handleSend} disabled={loading || !text.trim()}>
          {!loading ? (
            <Ionicons name='send' size={20} color={text.trim() ? 'white' : '#666'} />
          ) : (
            <SendLoading />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}