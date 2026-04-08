import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FocusTab }   from './FocusTab';
import { ExploreTab } from './ExploreTab';
import { LibraryTab } from './LibraryTab';
import { PlayerNav, FocusTab as FocusTabId } from './components/PlayerNav';
import { Colors } from '@/shared/constants/Colors';

const C = Colors.dark;

export const FocusScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FocusTabId>('focus');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.content}>

          {/* All three tabs stay mounted — only visibility changes */}
          <View style={[styles.tab, activeTab !== 'focus'   && styles.hidden]}>
            <FocusTab />
          </View>
          <View style={[styles.tab, activeTab !== 'explore' && styles.hidden]}>
            <ExploreTab />
          </View>
          <View style={[styles.tab, activeTab !== 'library' && styles.hidden]}>
            <LibraryTab />
          </View>

        </View>
        <PlayerNav activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: C.background,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tab: {
    flex:     1,
    position: 'absolute',
    top:      0,
    left:     0,
    right:    0,
    bottom:   0,
  },
  hidden: {
    display: 'none',
  },
});