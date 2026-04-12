import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from "@expo/vector-icons";
import { generateUUID } from '@/shared/utils';
import AiService from '@/services/AiService';
import { useAIStore } from '@/stores/useAiStore';
import SendLoading from '@/shared/components/sendLoading';
import { MODELS } from '@/shared/constants/models';



export default function MessageInput() {

  const model = useAIStore().model
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(model);

  useEffect(()=>{
    setSelectedModel(model)
  },[model])

  const { set_chat_id,set_model } = useAIStore();
  const chatId = useAIStore().chat_id;

  const handleSend = async () => {
  if (!text.trim() || loading) return;
  setLoading(true);

  const isFirstMessage = !chatId; // new chat = no chat_id yet
  let chat_id;

  if (!chatId) {
    chat_id = generateUUID();
    set_chat_id(chat_id);
    await AiService.createNewChat(chat_id);
  } else {
    chat_id = chatId;
  }

  const userMessage = {
    id: generateUUID(),
    chat_id,
    sender: 'user',
    text,
    timestamp: Date.now(),
  };

  try {
    await AiService.addMessageToDb(userMessage, 'user');
    useAIStore.getState().addMessage(userMessage);

    const aiResponse = await AiService.sendMessageToGroq(text, chat_id);
    setText('');

    const aiMessage = {
      id: generateUUID(),
      chat_id,
      sender: 'ai',
      text: aiResponse,
      timestamp: Date.now(),
    };

    useAIStore.getState().addMessage(aiMessage);
    await AiService.addMessageToDb(aiMessage, 'ai');
    await AiService.updateTimeStamp(chat_id);

    // generate title only on the first message of a new chat
    if (isFirstMessage) {
      const title = await AiService.generateChatTitle(text);
      await AiService.updateChatTitle(chat_id, title);
      await useAIStore.getState().fetchChatHistroy(); // refresh sidebar
    }

  } catch (error) {
    console.error('Send message error:', error);
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      {/* Model picker modal */}
      <Modal
        visible={modelMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setModelMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModelMenuOpen(false)}
        >
          <View style={styles.modelMenu}>
            <Text style={styles.modelMenuTitle}>SELECT MODEL</Text>
           <FlatList
              data={MODELS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modelRow,
                    selectedModel.id === item.id && styles.modelRowActive,
                  ]}
                  onPress={() => {
                    //setSelectedModel(item);
                    set_model(item)
                    setModelMenuOpen(false);
                  }}
                >
                  <View>
                    <Text style={[
                      styles.modelLabel,
                      selectedModel.id === item.id && { color: '#fff' },
                    ]}>
                      {item.label}
                    </Text>
                    <Text style={styles.modelDesc}>{item.description}</Text>
                  </View>
                  {selectedModel.id === item.id && <View style={styles.activeDot} />}
                </TouchableOpacity>
              )}
          />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Input box */}
      <View style={styles.container}>
        <TextInput
          placeholder="Message AI..."
          placeholderTextColor="#888"
          multiline
          value={text}
          onChangeText={setText}
          textAlignVertical="top"
          style={styles.input}
          editable={!loading}
        />

        <View style={styles.toolbar}>
          {/* Left — model pill + attach */}
          <View style={styles.toolbarLeft}>
            <TouchableOpacity
              style={styles.modelPill}
              onPress={() => setModelMenuOpen(true)}
            >
              <View style={styles.activeDot} />
              <Text style={styles.modelPillText}>{selectedModel.label}</Text>
              <Ionicons name="chevron-up" size={10} color="#888" />
            </TouchableOpacity>

            <TouchableOpacity>
              <Ionicons name="add-circle-outline" size={20} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Right — send */}
          <TouchableOpacity
            onPress={handleSend}
            disabled={loading || !text.trim()}
            style={[
              styles.sendBtn,
              text.trim() && !loading && styles.sendBtnActive,
            ]}
          >
            {loading
              ? <SendLoading />
              : <Ionicons name="send" size={14} color="#fff" />
            }
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2b2f',
    borderWidth: 1.5,
    borderColor: '#3a3c5d',
    borderRadius: 14,
    margin: 8,
    overflow: 'hidden',
  },
  input: {
    color: '#fff',
    fontSize: 14,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 8,
    paddingTop: 4,
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1e1f23',
    borderWidth: 1,
    borderColor: '#3a3c5d',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  modelPillText: {
    color: '#ccc',
    fontSize: 11,
    fontWeight: '500',
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#5dcaa5',
  },
  sendBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#3a3c5d',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  sendBtnActive: {
    backgroundColor: '#5b5de8',
    opacity: 1,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingBottom: 100,
    paddingHorizontal: 12,
  },
  modelMenu: {
    backgroundColor: '#2a2b2f',
    borderWidth: 1,
    borderColor: '#3a3c5d',
    borderRadius: 14,
    padding: 6,
  },
  modelMenuTitle: {
    color: '#555',
    fontSize: 11,
    letterSpacing: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  modelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
  },
  modelRowActive: {
    backgroundColor: '#3a3c5d',
  },
  modelLabel: {
    color: '#ccc',
    fontSize: 13,
    fontWeight: '500',
  },
  modelDesc: {
    color: '#666',
    fontSize: 11,
    marginTop: 2,
  },
});