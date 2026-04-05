import React, { useRef, useEffect, useCallback } from 'react';
import { FlatList } from 'react-native';
import MessageBubble from './MessageBubble';
import { useAIStore } from '@/stores/useAiStore';

export default function ChatContainer() {
  const flatListRef = useRef(null);
  const chats = useAIStore((state) => state.chats);
  const isUserScrolling = useRef(false);
  const lastChatsLength = useRef(0);

  useEffect(() => {
    // Only scroll when a genuinely new message is appended
    const hasNewMessage = chats.length > lastChatsLength.current;
    lastChatsLength.current = chats.length;

    if (flatListRef.current && hasNewMessage && !isUserScrolling.current) {
      // Defer to let the layout settle before scrolling
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
  ), []); // stable — MessageBubble receives all data via props

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
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingVertical: 10 }}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="on-drag"
      maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
      onScrollBeginDrag={handleScrollBeginDrag}
      onScrollEndDrag={handleScrollEnd}
      onMomentumScrollEnd={handleScrollEnd}
    />
  );
}