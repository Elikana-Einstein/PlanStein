import React, { useState } from 'react';
import {View, Text, TouchableOpacity,StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasksData }  from '@/hooks/useTasksData';
import { useEventsData } from '@/hooks/useEventsData';
import { Colors } from '@/shared/constants/Colors';
import { SegmentTabs } from '@/shared/components/SegementedTabs';
import { TasksList } from './components/TaskList';
import { EventsList } from './components/EventList';
import GoalsScreeen from '../goals/GoalsScreeen';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

type ViewMode = 'tasks' | 'events' | 'goals';

export const TasksScreen = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('tasks');

  const tasksData  = useTasksData();
  const eventsData = useEventsData();

  const taskTabs = [
    { id: 'all',    label: 'All'    },
    { id: 'today',  label: 'Today'  },
    { id: 'urgent', label: 'Urgent' },
    { id: 'done',   label: 'Done'   },
  ];

  const eventTabs = [
    { id: 'all',      label: 'All'      },
    { id: 'today',    label: 'Today'    },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'done',     label: 'Done'     },
  ];



  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>
          {viewMode === 'tasks' ? 'Tasks' : viewMode === 'events' ? 'Events' : 'Goals'}
        </Text>

        {/* Mode toggle — pill switcher */}
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'tasks' && styles.toggleActive]}
            onPress={() => setViewMode('tasks')}
            activeOpacity={0.7}
          >
            <Text style={[styles.toggleText, viewMode === 'tasks' && styles.toggleTextActive]}>
              Tasks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'events' && styles.toggleActive]}
            onPress={() => setViewMode('events')}
            activeOpacity={0.7}
          >
            <Text style={[styles.toggleText, viewMode === 'events' && styles.toggleTextActive]}>
              Events
            </Text>
          </TouchableOpacity>

            <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'goals' && styles.toggleActive]}
            onPress={() => setViewMode('goals')}
            activeOpacity={0.7}
          >
            <Text style={[styles.toggleText, viewMode === 'goals' && styles.toggleTextActive]}>
              Goals
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter tabs */}
      {viewMode === 'tasks' ? (
        <>
          <SegmentTabs
            tabs={taskTabs}
            activeTab={tasksData.filter}
            onTabPress={(id) => tasksData.setFilter(id as typeof tasksData.filter)}
          />
          <TasksList
            groupedTasks={tasksData.groupedTasks}
            onToggleTask={tasksData.toggleTask}
          />
        </>
      ) : viewMode === 'events' ? (
        <>
          <SegmentTabs
            tabs={eventTabs}
            activeTab={eventsData.filter}
            onTabPress={(id) => eventsData.setFilter(id as typeof eventsData.filter)}  // ← bug fixed
          />
          <EventsList
            groupedEvents={eventsData.groupedEvents}
            onToggleEvent={eventsData.toggleEvent}
          />
        </>
      ):(
       <GoalsScreeen/>
      )}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: C.background,
  },
  header: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    paddingHorizontal: S.md,
    paddingTop:       S.md,
    paddingBottom:    S.sm,
  },
  heading: {
    fontSize:      24,
    fontWeight:    '600',
    color:         C.textPrimary,
    letterSpacing: -0.5,
  },

  // Mode toggle
  toggle: {
    flexDirection:   'row',
    backgroundColor: C.surfaceLight,
    borderRadius:    R.full,
    borderWidth:     0.5,
    borderColor:     C.border,
    padding:         3,
  },
  toggleBtn: {
    paddingVertical:   6,
    paddingHorizontal: S.md,
    borderRadius:      R.full,
  },
  toggleActive: {
    backgroundColor: C.primary,
  },
  toggleText: {
    fontSize:   13,
    fontWeight: '500',
    color:      C.textDim,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
});