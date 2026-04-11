import React from 'react';
import { View, FlatList, RefreshControl, StyleSheet, Text } from 'react-native';
import { useHomeData } from '../../hooks/useHomeData';
import { GreetingHeader }  from './components/GreetingHeader';
import { DayScoreCard }    from './components/DayScoreCard';
import { QuickStatsRow }   from './components/QuickstatsRow';
import { FocusPrompt }     from './components/FocusPrompt';
import { TodayTasksList }  from './components/TodaytasksList';
import { HabitsMiniGrid }  from './components/HabitsMiniGrid';
import { GoalsMiniGrid }   from './components/GoalsProgress';
import { SkeletonLoader }  from '../../shared/components/SkeletonLoader';
import { SectionHeader }   from '@/shared/components/SectionHeader';
import { Colors } from '@/shared/constants/Colors';
import { useMeData } from '../me/hooks/useMeData';
import { useHabitStore } from '@/stores/habitsStore';

const C = Colors.dark;
const S = Colors.spacing;

export const HomeScreen = () => {

  const habits = useHabitStore().habits
  const {
    isLoading,
    error,
    tasks,
    goals,
    name,
    streak,
    score,
    delta,
    tasksDue,
    habitsDone,
    focusMinutes,
    toggleTask,
    toggleHabit,
  } = useHomeData();

const {profile} = useMeData();
  if (isLoading) return <SkeletonLoader />;
  if (error){
    console.log(error);
    
    return (
    <View style={styles.error}>
      <Text style={styles.errorText}>Something went wrong. Pull to retry.</Text>
    </View>
  );
  } 

  // ← built right here from values you already have
  const breakdown = {
    tasksCompleted:  tasksDue,
    habitsCompleted: habitsDone,
    focusMinutes:    focusMinutes,
  };

  const sections = [
    {
      key:    'today',
      title:  'Today',
      render: () => <TodayTasksList tasks={tasks} onToggle={toggleTask} />,
    },
    {
      key:    'habits',
      title:  'Habits',
      render: () => <HabitsMiniGrid habits={habits} onToggle={toggleHabit} />,
    },
    {
      key:    'goals',
      title:  'Goals',
      render: () => <GoalsMiniGrid goals={goals} />,
    },
  ];

  return (
    <FlatList
      data={sections}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => (
        <View>
          <SectionHeader title={item.title} onSeeAll={item.title} />
          {item.render()}
        </View>
      )}
      ListHeaderComponent={
        <>
          <GreetingHeader name={profile?.name} />
          <FocusPrompt focusMinutes={focusMinutes} />
          <DayScoreCard
            score={score}
            delta={delta}
            breakdown={breakdown}        
          />
          <QuickStatsRow
            tasksDue={tasksDue}
            habitsDone={habitsDone}
            habitsTotal={habits.length}
            streak={streak}
          />
        </>
      }
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: C.background,
    paddingBottom:   S.xl,
  },
  error: {
    flex:            1,
    backgroundColor: C.background,
    justifyContent:  'center',
    alignItems:      'center',
    padding:         S.lg,
  },
  errorText: {
    color:    C.textMuted,
    fontSize: 14,
  },
});