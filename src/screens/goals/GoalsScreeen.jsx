import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { GoalsService } from '@/services/GoalsService';
import { useGoalsStore } from '@/stores/goalsStore';
import { Colors } from '@/shared/constants/Colors';


//progress bar component
const ProgressBar = ({ progress }) => (
  <View style={{backgroundColor: 'lightgray',borderRadius:10}} className="w-full h-4 bg-gray-300 rounded-full overflow-hidden flex-row mt-2  items-center">
    <View  className="h-full" style={{ width: `${progress}%`,backgroundColor: 'green',borderRadius: 10 }} />
    <Text style={{ fontFamily: 'Inter-Regular', fontSize: 8,color: 'red' }} className="text-red-800 text-sm ">
      {progress} % completed
    </Text>
  </View>
);

// Helper: render each subgoal bullet
const SubgoalItem = ({ subgoal }) =>{
  const {loadActiveGoals} = useGoalsStore()

    const handlemarkAsComplete = async (subgoalId) => {
        try {
            await GoalsService.markSubgoalCompleted(subgoalId);
        } catch (error) {
            console.error('Error marking subgoal as complete:', error);
        }
        loadActiveGoals()
    }
    return(
  <View className="flex-row items-start mb-2 ml-2">
    <TouchableOpacity onLongPress={()=>handlemarkAsComplete(subgoal.id)} className='flex flex-row gap-2 items-center'>
        <Ionicons name="checkmark-circle" size={14} color={subgoal.is_completed ? 'blue' : 'lightgray'} />
    <Text style={{  color: 'white' }} className={subgoal.is_completed ? 'line-through text-gray-500' : 'text-white'}>
      {subgoal.description}
    </Text>

    </TouchableOpacity>
   
  </View>
);
}


// Helper: render a single episode (week range + its subgoals)
const EpisodeCard = ({ episode }) => (
  <View style={{backgroundColor:Colors.dark.background,borderWidth:0.5,borderColor:Colors.dark.border}} className=" rounded-xl p-4 mb-3 shadow-sm border border-border">
    <View className="flex-row justify-between items-center mb-3">
      <Text style={{ fontFamily: 'Inter-Bold', color: 'gray' }} className="text-black font-bold text-base uppercase tracking-wide">
        {episode.title}
      </Text>
      <View className="bg-indigo-100 px-2 py-1 rounded-full">
        <Text className="text-indigo-600 text-xs font-semibold">
          {episode.subgoals.length} tasks
        </Text>
      </View>
    </View>
    {episode.subgoals.map((sub, idx) => (
      <SubgoalItem key={idx} subgoal={sub} />
    ))}
  </View>
);

//no goal component
const NoGoals = () => (
  <View className="flex-1 justify-center items-center">
    <Text style={{ fontFamily: 'Inter-Regular', color: 'gray' }} className="text-gray-500 text-lg">
        No goals yet. Start by adding a new learning goal!
    </Text>
    </View>
);
// Main component: renders each goal as a section



const GoalCard = ({ goal }) =>{
    const handleGoalDelete = async (goalId) => {
        try {
           Alert.alert(
              "Delete Goal",
              "Are you sure you want to delete this goal? This action cannot be undone.",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", style: "destructive", onPress: async () => {
                    await GoalsService.deleteGoal(goalId);
                  }}
                ]
              );

        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    }
 return(
  <View className="mb-6 rounded-2xl bg-white shadow-lg overflow-hidden">
    {/* Header with gradient-like effect */}
    <View className="bg-indigo-600 px-5 py-4">
        <View className='flex flex-row justify-between'>
              <Text style={{ fontFamily: 'Inter-Bold',color:'white' }} >
        {goal.title}
      </Text>
      <TouchableOpacity onPress={()=>handleGoalDelete(goal.id)} className="flex-row items-center bg-red-500 px-2 py-1 rounded-full">
        <Ionicons name="trash" size={16} color="white" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
        </View>
      <ProgressBar progress={goal.progress} />
      <Text style={{ fontFamily: 'Inter-Regular', fontSize: 10 }} className="text-primary text-sm mt-1">
        {goal.episodes.length} episodes • total {goal.episodes.reduce((sum, ep) => sum + ep.subgoals.length, 0)} tasks
      </Text>
    </View>

    {/* Episodes list */}
    <View style={{backgroundColor:Colors.dark.surface}} className="p-4 ">
      {goal.episodes.map((episode, idx) => (
        <EpisodeCard key={idx} episode={episode} />
      ))}
    </View>
  </View>
);
}
export default function GoalsScreeen() {
    
    const {loadActiveGoals} = useGoalsStore()
    useEffect(() => {
        const fetchGoals = async () => {
            try {
               loadActiveGoals();
            }
            catch (error) {
                console.error('Error fetching goals:', error);
            }
        }
        fetchGoals();
    },[])
    const goals = useGoalsStore().goals;
    
  return (
    <GestureHandlerRootView className="flex-1 bg-red-100">
      <FlatList
        data={goals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <GoalCard goal={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="mb-4 px-2">
            <Text className="text-3xl font-extrabold text-primary">🎯 Your Learning Goals</Text>
            <Text className="text-primary text-base mt-1">Stay focused, track your progress</Text>
          </View>
        }
      />
      {goals.length === 0 && <View className='h-full'><NoGoals /></View>}
      <TouchableOpacity onPress={() => router.push('general/AddGoalScreen')} style={{ position: 'absolute', bottom: -20, right: 30 ,width: 48, height: 48,backgroundColor: 'purple', borderRadius: 24, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 }}>
        <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>+</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  )
}