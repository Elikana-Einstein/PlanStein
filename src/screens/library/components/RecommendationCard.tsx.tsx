import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BookRecommendation } from '@/shared/types';
import { Colors } from '@/shared/constants/Colors';

const C = Colors.dark;
const R = Colors.radius;
const S = Colors.spacing;

type Props = {
  rec:     BookRecommendation;
  onPress: () => void;
};

export const RecommendationCard: React.FC<Props> = ({ rec, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
    {/* Mini cover */}
    <View style={[styles.cover, { backgroundColor: rec.coverColor }]}>
      <View style={styles.shine} />
      <View style={styles.lines}>
        <View style={styles.line} />
        <View style={[styles.line, { width: 16 }]} />
        <View style={[styles.line, { width: 20 }]} />
      </View>
    </View>

    {/* Info */}
    <Text style={styles.title} numberOfLines={2}>{rec.title}</Text>
    <Text style={styles.author} numberOfLines={1}>{rec.author}</Text>

    {/* Match score */}
    <View style={styles.match}>
      <Text style={styles.matchText}>{rec.matchScore}% match</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flex:            1,
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.md,
    padding:         S.sm,
    gap:             4,
  },
  cover: {
    width:        '100%',
    height:       56,
    borderRadius: 6,
    overflow:     'hidden',
    justifyContent: 'center',
    alignItems:   'center',
    marginBottom:  2,
  },
  shine: {
    position:        'absolute',
    top:             0,
    left:            0,
    width:           6,
    height:          '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  lines: { gap: 3 },
  line: {
    width:           24,
    height:          1.5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius:    1,
  },
  title:  { fontSize: 10, fontWeight: '500', color: C.textMuted, lineHeight: 13 },
  author: { fontSize: 9,  color: C.textDim },
  match: {
    backgroundColor: C.primaryFaint,
    borderWidth:     0.5,
    borderColor:     C.primaryDim,
    borderRadius:    R.full,
    paddingVertical:   2,
    paddingHorizontal: 6,
    alignSelf:       'flex-start',
    marginTop:       2,
  },
  matchText: { fontSize: 8, color: C.primary, fontWeight: '500' },
});