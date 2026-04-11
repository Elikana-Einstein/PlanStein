import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import AiService from '@/services/AiService';
import { useAIStore } from '@/stores/useAiStore';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function PreviousChatsScreen() { 

  const    chatsHis = useAIStore().chat_history
  const    chati = useAIStore().chat_id
    const [chats, setChats] = React.useState<{ id: string; title: string }[]>(chatsHis);
    React.useEffect(() => {
        const fetchChatHistory = async () => {
            try {           
                   
              const history = await AiService.getChatHistory();
                setChats(history as { id: string; title: string }[]);
            } catch (error) {
                console.error('Failed to fetch chat history:', error);
            }
        };
        fetchChatHistory();
    }, [chati]);
    const  handleChatSelect = async (chatId: string) => {
           await AiService.getChatMessages(chatId);
        }
    
        const handleDeleteChat = async (chatId: string) => {
          try {
            Alert.alert(
              'Delete Chat',
              'Are you sure you want to delete this chat history?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: async () => {  

            await AiService.deleteChatHistory(chatId);
            setChats((prev) => prev.filter((chat) => chat.id !== chatId));
                } },
              ]
            );
          } catch (error) {
            console.error('Failed to delete chat history:', error);
          }
        };
  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View className='p-2 mb-4 border-b border-gray-300 rounded-lg bg-primary mt-4  items-center'>
        <TouchableOpacity  onPress={() => Alert.alert('Delete All Chats', 'Are you sure you want to delete all chat history?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete All', style: 'destructive', onPress: async () => {  
            await AiService.deleteAllChatHistory();
            setChats([]);
          } },
        ])}>
          <Text style={{ color: 'red', fontWeight: 'bold',fontSize: 16 }}>Delete All Chats</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ paddingVertical: 10 }} onPress={() => handleChatSelect(item.id)} onLongPress={() => handleDeleteChat(item.id)}>
            <Text style={{ fontSize: 16 }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}
