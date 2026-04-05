import { Colors } from '@/shared/constants/Colors';
import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

export type FeatureCardConfig = {
  id:          string;
  title:       string;
  description: string;
  icon:        React.ReactNode;
  accentColor: string;
  badge?:      string;
  wide?:       boolean;
};

type Props = {
  config:  FeatureCardConfig;
  onPress: () => void;
};

export const FeatureCard: React.FC<Props> = ({ config, onPress }) => {
  const { title, description, icon, accentColor, badge, wide } = config;

  if (wide) {
    return (
      <TouchableOpacity
        style={styles.wide}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.wideIcon, {
          backgroundColor: `${accentColor}18`,
          borderColor:     `${accentColor}44`,
        }]}>
          {icon}
        </View>
        <View style={styles.wideBody}>
          <Text style={styles.wideTitle}>{title}</Text>
          <Text style={styles.wideSub}>{description}</Text>
          {badge && (
            <View style={[styles.badge, {
              backgroundColor: `${accentColor}18`,
              borderColor:     `${accentColor}44`,
            }]}>
              <Text style={[styles.badgeText, { color: accentColor }]}>{badge}</Text>
            </View>
          )}
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.icon, {
        backgroundColor: `${accentColor}18`,
        borderColor:     `${accentColor}44`,
      }]}>
        {icon}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>{description}</Text>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Grid card
  card: {
    flex:            1,
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.lg,
    padding:         S.md,
  },
  icon: {
    width:           36,
    height:          36,
    borderRadius:    10,
    borderWidth:     0.5,
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    S.sm,
  },
  title: {
    fontSize:     13,
    fontWeight:   '500',
    color:        C.textPrimary,
    marginBottom: 3,
  },
  sub: {
    fontSize:   10,
    color:      C.textDim,
    lineHeight: 14,
  },
  arrow: {
    position: 'absolute',
    bottom:   12,
    right:    12,
    fontSize: 16,
    color:    C.textDim,
  },

  // Wide card
  wide: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.lg,
    padding:         S.md,
    gap:             S.md,
    marginBottom:    S.sm,
  },
  wideIcon: {
    width:           42,
    height:          42,
    borderRadius:    12,
    borderWidth:     0.5,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  wideBody:  { flex: 1 },
  wideTitle: { fontSize: 13, fontWeight: '500', color: C.textPrimary },
  wideSub:   { fontSize: 10, color: C.textDim, marginTop: 2, lineHeight: 14 },
  badge: {
    alignSelf:        'flex-start',
    marginTop:        5,
    paddingVertical:   2,
    paddingHorizontal: 8,
    borderRadius:      R.full,
    borderWidth:       0.5,
  },
  badgeText: { fontSize: 9, fontWeight: '500' },
  chevron:   { fontSize: 20, color: C.textDim },
});