import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Markdown from 'react-native-markdown-display'
import { formatTimestamp } from '@/shared/utils'

export default function MessageBubble({ message, role, timestamp }) {
  const isUser = role === 'user'

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>

      {!isUser && (
        <View style={styles.aiHeader}>
          <View style={styles.aiAvatar}>
            <View style={styles.aiAvatarDot} />
          </View>
          <Text style={styles.aiLabel}>AI</Text>
        </View>
      )}

      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {/* top accent line on AI bubble */}
        {!isUser && <View style={styles.accentLine} />}

        {isUser ? (
          <Text style={styles.userText}>{message}</Text>
        ) : (
          <Markdown style={markdownStyles}>{message}</Markdown>
        )}
      </View>

      <Text style={[styles.timestamp, isUser ? styles.timestampUser : styles.timestampAi]}>
        {formatTimestamp(timestamp)}
      </Text>

    </View>
  )
}

const markdownStyles = {
  body: {
    color: '#e2e2e8',
    fontSize: 14,
    lineHeight: 22,
  },
  heading1: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  heading2: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  heading3: { color: '#c4c4d4', fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  bullet_list: { marginVertical: 4 },
  ordered_list: { marginVertical: 4 },
  list_item: { marginVertical: 2, color: '#e2e2e8' },
  code_inline: {
    backgroundColor: '#2a2a4a',
    color: '#a5b4fc',
    borderRadius: 4,
    paddingHorizontal: 6,
    fontFamily: 'monospace',
    fontSize: 13,
  },
  fence: {
    backgroundColor: '#0d0d1a',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#a5b4fc',
    borderWidth: 1,
    borderColor: '#2a2a4a',
    marginVertical: 6,
  },
  strong: { fontWeight: 'bold', color: '#fff' },
  em: { fontStyle: 'italic', color: '#c4c4d4' },
  blockquote: {
    backgroundColor: '#12122a',
    borderLeftColor: '#6366f1',
    borderLeftWidth: 3,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginVertical: 4,
  },
  hr: { backgroundColor: '#2a2a4a', height: 1, marginVertical: 8 },
  link: { color: '#818cf8' },
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 6,
    paddingHorizontal: 12,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
  },

  // AI avatar row
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    marginLeft: 2,
  },
  aiAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  aiLabel: {
    fontSize: 11,
    color: '#555',
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  // bubbles
  bubble: {
    maxWidth: '82%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  userBubble: {
    backgroundColor: '#5b5de8',
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  aiBubble: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#2a2a4a',
    borderTopLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  // thin purple line at top of AI bubble
  accentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#6366f1',
    opacity: 0.5,
  },

  userText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },

  timestamp: {
    fontSize: 11,
    color: '#444',
    marginTop: 3,
  },
  timestampUser: {
    marginRight: 4,
  },
  timestampAi: {
    marginLeft: 4,
  },
})