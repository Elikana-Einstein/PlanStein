import { useEffect } from 'react';
import '../global.css'
import { Stack } from 'expo-router';
import { dropAllTables, dropATable, initDatabase } from '@/db/database';
import { TasksService } from '@/services/TasksService';
import { EventsService } from '@/services/EventsService';
import 'react-native-gesture-handler';
export default function RootLayout() {

  useEffect(()=>{
    async function prepare() {
      try {
       // dropAllTables()
       //dropATable('goals');
      // dropATable('milestones');
         initDatabase()
        //TasksService.seedMockTasks();
        //EventsService.seedMockEvents();
      } catch (error) {
        console.log("Database int error",error);
        
      }
    }
    prepare();
  },[])
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false,presentation: 'card' }} />
       <Stack.Screen name="(drawer)"       options={{ headerShown: false }} />
        <Stack.Screen name="ai/coach"      options={{ headerShown: false }} />
        <Stack.Screen name="ai/breakdown"  options={{ headerShown: false }} />
        <Stack.Screen name="ai/email"      options={{ headerShown: false }} />
        <Stack.Screen name="ai/bookSummarizer"    options={{ headerShown: false }} />
        <Stack.Screen name="ai/focusmix"   options={{ headerShown: false }} />
        <Stack.Screen name="general/AddGoalScreen"     options={{ headerShown: false }} />
        <Stack.Screen name="general/GoogleSignInScreen"     options={{ headerShown: false }} />
        <Stack.Screen name="habits/HabitsScreen"     options={{ headerShown: false }} />
         <Stack.Screen name="books/booksScreen"      options={{ headerShown: false }} />
  <Stack.Screen name="books/upload"     options={{ headerShown: false }} />
  <Stack.Screen name="books/processing" options={{ headerShown: false }} />
  <Stack.Screen name="books/[id]"       options={{ headerShown: false }} />
  <Stack.Screen name="books/[id]/read"  options={{ headerShown: false }} />
        </Stack>
  );
}