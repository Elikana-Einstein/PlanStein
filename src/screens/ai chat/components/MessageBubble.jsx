
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Markdown from 'react-native-markdown-display'
import { formatTimestamp } from '@/shared/utils'

export default function MessageBubble({ message, role, timestamp }) {
  const isUser = role === 'user'

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {isUser ? (
          <Text style={styles.text}>{message}</Text>
        ) : (
          <Markdown style={markdownStyles}>{message}</Markdown>
        )}
      </View>
      <Text style={styles.timestamp}>{formatTimestamp(timestamp)}</Text>
    </View>
  )
}

const markdownStyles = {
  body: {
    color: '#000',
    fontSize: 16,
  },
  heading1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  heading2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  heading3: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  bullet_list: {
    marginVertical: 4,
  },
  ordered_list: {
    marginVertical: 4,
  },
  list_item: {
    marginVertical: 2,
  },
  code_inline: {
    backgroundColor: '#d1d1d1',
    borderRadius: 4,
    paddingHorizontal: 4,
    fontFamily: 'monospace',
    fontSize: 14,
  },
  fence: {
    backgroundColor: '#d1d1d1',
    borderRadius: 8,
    padding: 10,
    fontFamily: 'monospace',
    fontSize: 14,
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
}


const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 4,
    paddingHorizontal: 10,
  },

  userContainer: {
    alignItems: 'flex-end',
  },

  aiContainer: {
    alignItems: 'flex-start',
  },

  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },

  userBubble: {
    backgroundColor: '#007AFF', // blue
    borderBottomRightRadius: 4,
  },

  aiBubble: {
    backgroundColor: '#E5E5EA', // light gray
    borderBottomLeftRadius: 4,
  },

  text: {
    color: '#000',
    fontSize: 16,
  },
    timestamp: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
})