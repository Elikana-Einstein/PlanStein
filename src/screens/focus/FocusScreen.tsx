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

  const renderTab = () => {
    switch (activeTab) {
      case 'explore': return <ExploreTab />;
      case 'library': return <LibraryTab />;
      default:        return <FocusTab />;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.content}>
          {renderTab()}
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
});