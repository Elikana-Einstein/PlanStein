import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const C = Colors.dark;
const R = Colors.radius;
const S = Colors.spacing;

type TabOption = { id: string; label: string };

type Props = {
  tabs:       TabOption[];
  activeTab:  string;
  onTabPress: (tabId: string) => void;
};

export const SegmentTabs: React.FC<Props> = ({ tabs, activeTab, onTabPress }) => (
  <View style={styles.container}>
    {tabs.map((tab) => {
      const isActive = tab.id === activeTab;
      return (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, isActive && styles.tabActive]}
          onPress={() => onTabPress(tab.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.label, isActive && styles.labelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection:   'row',
    backgroundColor: C.surfaceLight,
    borderRadius:    R.full,
    borderWidth:     0.5,
    borderColor:     C.border,
    marginHorizontal: S.md,
    marginVertical:  S.sm,
    padding:         3,
  },
  tab: {
    flex:           1,
    paddingVertical: 8,
    borderRadius:   R.full,
    alignItems:     'center',
  },
  tabActive: {
    backgroundColor: C.primary,
  },
  label: {
    fontSize:   13,
    fontWeight: '500',
    color:      C.textDim,
  },
  labelActive: {
    color: '#FFFFFF',
  },
});