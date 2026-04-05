import { Colors } from '@/shared/constants/Colors';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const C = Colors.dark;
const S = Colors.spacing;

export type FocusTab = 'focus' | 'explore' | 'library';

type Props = {
  activeTab:  FocusTab;
  onTabPress: (tab: FocusTab) => void;
};

const TABS: Array<{ id: FocusTab; label: string }> = [
  { id: 'focus',   label: 'Focus'   },
  { id: 'explore', label: 'Explore' },
  { id: 'library', label: 'Library' },
];

export const PlayerNav: React.FC<Props> = ({ activeTab, onTabPress }) => (
  <View style={styles.nav}>
    {TABS.map(tab => {
      const isActive = tab.id === activeTab;
      return (
        <TouchableOpacity
          key={tab.id}
          style={styles.item}
          onPress={() => onTabPress(tab.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
            <NavIcon id={tab.id} active={isActive} />
          </View>
          <Text style={[styles.label, isActive && styles.labelActive]}>
            {tab.label}
          </Text>
          {isActive && <View style={styles.dot} />}
        </TouchableOpacity>
      );
    })}
  </View>
);

// Inline SVG-style icons using View shapes
const NavIcon: React.FC<{ id: FocusTab; active: boolean }> = ({ id, active }) => {
  const color = active ? C.primary : C.textDim;
  if (id === 'focus') {
    return (
      <View style={[styles.iconOuter, { borderColor: color }]}>
        <View style={[styles.iconInner, { backgroundColor: color }]} />
      </View>
    );
  }
  if (id === 'explore') {
    return (
      <View style={[styles.iconCircle, { borderColor: color }]}>
        <View style={[styles.iconPlay, {
          borderLeftColor: color,
          borderLeftWidth: 9,
        }]} />
      </View>
    );
  }
  // library — three lines
  return (
    <View style={styles.iconLines}>
      <View style={[styles.line, { backgroundColor: color, width: 16 }]} />
      <View style={[styles.line, { backgroundColor: color, width: 12 }]} />
      <View style={[styles.line, { backgroundColor: color, width: 14 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    flexDirection:    'row',
    justifyContent:   'space-around',
    borderTopWidth:   0.5,
    borderTopColor:   C.borderFaint,
    paddingTop:       S.sm,
    paddingBottom:    S.sm,
    paddingHorizontal: S.md,
    marginTop:        S.sm,
  },
  item: {
    alignItems: 'center',
    gap:        4,
    flex:       1,
  },
  iconWrap: {
    width:          36,
    height:         36,
    borderRadius:   10,
    alignItems:     'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: C.primaryFaint,
    borderWidth:     0.5,
    borderColor:     C.primaryDim,
  },
  label: {
    fontSize:      9,
    color:         C.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  labelActive: { color: C.primary },
  dot: {
    width:           3,
    height:          3,
    borderRadius:    2,
    backgroundColor: C.primary,
  },
  // Icons
  iconOuter: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  iconInner: { width: 6, height: 6, borderRadius: 3 },
  iconCircle: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  iconPlay: {
    width: 0, height: 0,
    borderTopWidth: 6, borderBottomWidth: 6,
    borderTopColor: 'transparent', borderBottomColor: 'transparent',
    marginLeft: 2,
  },
  iconLines: { gap: 3, alignItems: 'flex-start' },
  line: { height: 2, borderRadius: 1 },
});