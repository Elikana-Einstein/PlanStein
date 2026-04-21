import { Colors } from '@/shared/constants/Colors';
import { Book } from '@/shared/types';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const C = Colors.dark;

type Props = {
  book:       Book;
  onPress:    () => void;
  showBadge?: boolean;
};

export const BookCover: React.FC<Props> = ({ book, onPress, showBadge = true }) => {
  const badge = book.status === 'reading'
    ? { label: 'Reading', bg: '#0a2420', color: '#00D2D3', border: '#0f3830' }
    : book.status === 'processing'
    ? { label: 'Processing', bg: '#1a1030', color: '#6c63ff', border: '#2a1e5a' }
    : book.createdAt > Date.now() - 86_400_000 * 2
    ? { label: 'New', bg: '#1a1030', color: '#6c63ff', border: '#2a1e5a' }
    : null;

  return (
    <TouchableOpacity style={styles.wrap} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.cover, { backgroundColor: book.coverColor }]}>
        {/* Spine shine */}
        <View style={styles.shine} />

        {/* Badge */}
        {showBadge && badge && (
          <View style={[styles.badge, {
            backgroundColor: badge.bg,
            borderColor:     badge.border,
          }]}>
            <Text style={[styles.badgeText, { color: badge.color }]}>
              {badge.label}
            </Text>
          </View>
        )}

        {/* Progress bar at bottom */}
        {book.status === 'reading' && book.progress > 0 && (
          <View style={styles.progressWrap}>
            <View style={[styles.progressFill, { width: `${book.progress}%` }]} />
          </View>
        )}

        {/* Book icon */}
        <View style={styles.bookIcon}>
          <View style={[styles.line, styles.line1]} />
          <View style={[styles.line, styles.line2]} />
          <View style={[styles.line, styles.line3]} />
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
      <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrap: { width: 72, alignItems: 'center', gap: 5 },
  cover: {
    width:        66,
    height:       88,
    borderRadius: 8,
    position:     'relative',
    overflow:     'hidden',
    justifyContent: 'flex-end',
    alignItems:   'flex-start',
    padding:      6,
  },
  shine: {
    position:        'absolute',
    top:             0,
    left:            0,
    width:           8,
    height:          '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius:    8,
  },
  badge: {
    position:         'absolute',
    top:              5,
    right:            5,
    paddingVertical:   1,
    paddingHorizontal: 5,
    borderRadius:     10,
    borderWidth:      0.5,
  },
  badgeText: { fontSize: 8, fontWeight: '600' },
  progressWrap: {
    position:        'absolute',
    bottom:          0,
    left:            0,
    right:           0,
    height:          3,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressFill: {
    height:          3,
    backgroundColor: '#00D2D3',
  },
  bookIcon: { gap: 3 },
  line: {
    height:          1.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius:    1,
  },
  line1: { width: 30 },
  line2: { width: 22 },
  line3: { width: 26 },
  title: {
    fontSize:  9,
    color:     C.textMuted,
    textAlign: 'center',
    lineHeight: 13,
  },
  author: {
    fontSize:  8,
    color:     C.textDim,
    textAlign: 'center',
  },
});