import React, { useState } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons as IonIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useTasksStore } from '@/stores/tasksStore';
import ModalComponent from './ModalComponent';
import EventModalComponent from './EventModal';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

type Section<T> = { title: string; data: T[],section:String };

type Props<T> = {
  sections:      Section<T>[];
  renderItem:    (item: T, index: number) => React.ReactElement;
  keyExtractor?: (item: T, index: number) => string;
  emptyMessage?: string;
  section?: string;
};
const ButtonComponent = ()=>{
  const openModal = useTasksStore((state) => state.openModal);
  const toggleModal = useTasksStore((state) => state.toggleModal);

  const handlePress = () => {
    if (!openModal) {
      toggleModal();
    }
  }
  return(
     <View style={{ position: 'absolute', bottom: 90, right: S.lg ,backgroundColor: C.surface, padding: S.sm, borderRadius: 999,borderBlockColor:C.border, borderWidth:1}}>
      <TouchableOpacity onPress={handlePress}>
        <IonIcons name="add" size={24} color={C.primary} />
      </TouchableOpacity>
    </View>
  )
}


export function GroupedList<T>({
  sections,
  renderItem,
  keyExtractor,
  emptyMessage = 'Nothing here yet',
  section
}: Props<T>) {
  const visibleSections = sections.filter(s => s.data.length > 0);
  const isEmpty = visibleSections.length === 0;
  const openModal = useTasksStore((state) => state.openModal);

  if (isEmpty) {
    return (
      <View style={styles.empty}>
        <View>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
        {openModal && <ModalComponent />}
        <ButtonComponent />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={visibleSections}
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
      {openModal && section === 'task' ? <ModalComponent /> : <EventModalComponent />}
      <ButtonComponent />
    </View>
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