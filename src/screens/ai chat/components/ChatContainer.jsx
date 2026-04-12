import React, { useRef, useEffect, useCallback } from 'react';
import { FlatList } from 'react-native';
import MessageBubble from './MessageBubble';
import { useAIStore } from '@/stores/useAiStore';
import AiService from '@/services/AiService';

const keyExtractor = (item) => item.id.toString();
const contentStyle = { paddingVertical: 10 };

export default function ChatContainer() {
  const flatListRef = useRef(null);
  const chats = useAIStore((state) => state.chats);
  const {chat_id}= useAIStore()

  const isUserScrolling = useRef(false);
  const lastChatsLength = useRef(0);

  // ✅ reload messages whenever chat_id changes
  useEffect(() => {
    if (!chat_id) {
      useAIStore.getState().setChatHistory([]); // clear if no chat selected
      return;
    }

    const loadMessages = async () => {
      const messages = await AiService.getChatMessages(chat_id);
      useAIStore.getState().setChatHistory(messages);
    };

    loadMessages();
  }, [chat_id]); // ← runs every time chat_id changes

  // scroll to bottom on new message
  useEffect(() => {
    const hasNewMessage = chats.length > lastChatsLength.current;
    lastChatsLength.current = chats.length;

    if (flatListRef.current && hasNewMessage && !isUserScrolling.current) {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [chats]);

  const renderItem = useCallback(({ item }) => (
    <MessageBubble
      message={item.text}
      role={item.sender}
      timestamp={item.timestamp}
    />
  ), []);

  const handleScrollBeginDrag = useCallback(() => {
    isUserScrolling.current = true;
  }, []);

  const handleScrollEnd = useCallback(() => {
    isUserScrolling.current = false;
  }, []);

  return (
    <FlatList
      ref={flatListRef}
      data={chats}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={contentStyle}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="on-drag"
      maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
      onScrollBeginDrag={handleScrollBeginDrag}
      onScrollEndDrag={handleScrollEnd}
      onMomentumScrollEnd={handleScrollEnd}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={5}
    />
  );
}