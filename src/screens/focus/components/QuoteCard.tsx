import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useQuoteRotator } from '../hooks/useQuoteRotator';
import { Colors } from '@/shared/constants/Colors';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

export const QuoteCard: React.FC = () => {
  const { quote, fadeAnim, index, total } = useQuoteRotator();

  return (
    <View style={styles.card}>
      {/* Large decorative quote mark */}
      <Text style={styles.quoteMark}>"</Text>

      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.quoteText}>{quote.text}</Text>
        <Text style={styles.author}>— {quote.author}</Text>
      </Animated.View>

      {/* Dot indicators */}
      <View style={styles.dots}>
        {Array.from({ length: Math.min(total, 5) }).map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === index % 5 && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width:           '100%',
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.lg,
    padding:         S.md,
    marginBottom:    S.sm,
    overflow:        'hidden',
  },
  quoteMark: {
    fontSize:    36,
    color:       C.borderFaint,
    lineHeight:  36,
    fontFamily:  'serif',
    position:    'absolute',
    top:         8,
    left:        12,
  },
  quoteText: {
    fontSize:    13,
    color:       C.textMuted,
    lineHeight:  20,
    fontStyle:   'italic',
    paddingLeft: S.sm,
    marginTop:   S.sm,
  },
  author: {
    fontSize:    11,
    color:       C.textDim,
    marginTop:   S.sm,
    paddingLeft: S.sm,
  },
  dots: {
    flexDirection:  'row',
    justifyContent: 'center',
    gap:            5,
    marginTop:      S.sm,
  },
  dot: {
    width:           4,
    height:          4,
    borderRadius:    2,
    backgroundColor: C.borderFaint,
  },
  dotActive: {
    width:           12,
    borderRadius:    2,
    backgroundColor: C.primary,
  },
});