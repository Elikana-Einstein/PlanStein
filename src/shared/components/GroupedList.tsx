import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const C = Colors.dark;
const S = Colors.spacing;

type Section<T> = { title: string; data: T[] };

type Props<T> = {
  sections:      Section<T>[];
  renderItem:    (item: T, index: number) => React.ReactElement;
  keyExtractor?: (item: T, index: number) => string;
  emptyMessage?: string;
};

export function GroupedList<T>({
  sections,
  renderItem,
  keyExtractor,
  emptyMessage = 'Nothing here yet',
}: Props<T>) {
  // All sections empty
  const isEmpty = sections.every(s => s.data.length === 0);

  if (isEmpty) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={sections}
      keyExtractor={(item, index) => item.title + index}
      renderItem={({ item: section }) => (
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          {section.data.map((item, idx) => (
            <React.Fragment key={keyExtractor ? keyExtractor(item, idx) : String(idx)}>
              {renderItem(item, idx)}
            </React.Fragment>
          ))}
        </View>
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: S.xl,
  },
  sectionHeader: {
    paddingHorizontal: S.md,
    paddingTop:        S.md,
    paddingBottom:     S.sm,
  },
  sectionTitle: {
    fontSize:      11,
    fontWeight:    '600',
    color:         C.textDim,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  empty: {
    flex:           1,
    alignItems:     'center',
    paddingTop:     60,
    paddingHorizontal: S.lg,
  },
  emptyText: {
    fontSize:  14,
    color:     C.textDim,
    textAlign: 'center',
  },
});