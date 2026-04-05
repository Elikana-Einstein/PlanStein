import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Event } from '@/shared/types';
import { Colors } from '@/shared/constants/Colors';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

const CATEGORY_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  Work:     { bg: '#1A1030', border: '#2A1E5A', text: '#9B8EF0' },
  Dev:      { bg: '#0A2420', border: '#0F3830', text: C.secondary },
  Personal: { bg: '#2A1A08', border: '#3A2510', text: C.accent   },
  Health:   { bg: '#0A1F12', border: '#0F3020', text: C.success  },
  default:  { bg: C.surfaceLight, border: C.border, text: C.textMuted },
};

// Events group by date so accent color encodes date not priority
const DATE_ACCENT: Record<string, string> = {
  Today:     C.primary,
  Tomorrow:  C.secondary,
  'This week': C.accent,
};

type Props = {
  event:    Event;
  onToggle: (id: string) => void;
};

export const EventRow: React.FC<Props> = ({ event, onToggle }) => {
  const accentColor  = DATE_ACCENT[event.date]          ?? C.textDim;
  const categoryStyle = CATEGORY_STYLE[event.category]  ?? CATEGORY_STYLE.default;

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onToggle(event.id)}
      activeOpacity={0.7}
    >
      {/* Date accent */}
      <View style={[styles.accent, { backgroundColor: accentColor }]} />

      {/* Checkbox */}
      <View style={[styles.checkbox, event.completed && styles.checkboxDone]}>
        {event.completed && <Text style={styles.checkmark}>✓</Text>}
      </View>

      {/* Text */}
      <View style={styles.textBlock}>
        <Text
          style={[styles.title, event.completed && styles.titleDone]}
          numberOfLines={1}
        >
          {event.title}
        </Text>
        <Text style={styles.meta}>
          {event.time ? `${event.time}` : event.date}
        </Text>
      </View>

      {/* Category pill */}
      <View style={[styles.tag, { backgroundColor: categoryStyle.bg, borderColor: categoryStyle.border }]}>
        <Text style={[styles.tagText, { color: categoryStyle.text }]}>
          {event.category}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection:    'row',
    alignItems:       'center',
    backgroundColor:  C.surface,
    borderWidth:      0.5,
    borderColor:      C.border,
    borderRadius:     R.md,
    marginHorizontal: S.md,
    marginBottom:     S.sm,
    paddingVertical:  12,
    paddingRight:     S.md,
    gap:              12,
    overflow:         'hidden',
  },
  accent: {
    width:     2.5,
    alignSelf: 'stretch',
  },
  checkbox: {
    width:          20,
    height:         20,
    borderRadius:   10,
    borderWidth:    1.5,
    borderColor:    C.border,
    alignItems:     'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: C.primary,
    borderColor:     C.primary,
  },
  checkmark: {
    color:      '#fff',
    fontSize:   10,
    lineHeight: 12,
  },
  textBlock: { flex: 1 },
  title: {
    fontSize:   14,
    fontWeight: '500',
    color:      C.textPrimary,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color:              C.textDim,
  },
  meta: {
    fontSize:  11,
    color:     C.textDim,
    marginTop: 3,
  },
  tag: {
    paddingVertical:   3,
    paddingHorizontal: 9,
    borderRadius:      R.full,
    borderWidth:       0.5,
  },
  tagText: {
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 0.2,
  },
});