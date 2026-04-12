import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect } from 'react'
import AiService from '@/services/AiService';
import { useAIStore } from '@/stores/useAiStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/constants/Colors';

export default function PreviousChatsScreen() {
  const chat_history = useAIStore((state) => state.chat_history);
  const fetchChatHistory = useAIStore((state) => state.fetchChatHistroy);
  const {set_chat_id}= useAIStore()
  // load on mount
  useEffect(() => {
    fetchChatHistory();
  }, []);

  const handleChatSelect = async(chatId: string) => {
    set_chat_id(chatId); // ← this triggers ChatContainer to reload
    const messages = await AiService.getChatMessages(chatId);
    useAIStore.getState().setChatHistory(messages);
  };

  const handleDeleteChat = (chatId: string) => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this chat?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await AiService.deleteChatHistory(chatId);
            fetchChatHistory(); // refresh from store
            // if deleted chat was active, clear it
            if (useAIStore.getState().chat_id === chatId) {
              useAIStore.getState().set_chat_id('');
              useAIStore.getState().setChatHistory([]);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAll = () => {
    Alert.alert(
      'Delete All Chats',
      'Are you sure you want to delete all chat history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            await AiService.deleteAllChatHistory();
            useAIStore.getState().set_chat_id('');
            useAIStore.getState().setChatHistory([]);
            fetchChatHistory();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View style={{ marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderColor: '#333', alignItems: 'center' }}>
        <TouchableOpacity onPress={handleDeleteAll}>
          <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 16 }}>Delete All Chats</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={chat_history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ paddingVertical: 12, borderBottomWidth: 0.5, borderColor: '#222' }}
            onPress={() => handleChatSelect(item.id)}
            onLongPress={() => handleDeleteChat(item.id)}
          >
            <Text style={{ fontSize: 15, color: Colors.dark.textDim }}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ color: '#555', textAlign: 'center', marginTop: 40 }}>No chats yet</Text>
        }
      />
    </SafeAreaView>
  );
}