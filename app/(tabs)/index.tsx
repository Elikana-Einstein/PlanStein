import { HomeScreen } from "@/screens/home/HomeScreen";
import { useHabitStore } from "@/stores/habitsStore";
import { useTasksStore } from "@/stores/tasksStore";
import { useEffect } from "react";

export default function TabHome() {
  const {loadAllTasks} = useTasksStore();
  const {getHabits}=useHabitStore()
  useEffect(()=>{
    loadAllTasks();
    getHabits();
  },[])
  return <HomeScreen />;
}