import { HomeScreen } from "@/screens/home/HomeScreen";
import { useTasksStore } from "@/stores/tasksStore";
import { useEffect } from "react";

export default function TabHome() {
  const {loadAllTasks} = useTasksStore();
  useEffect(()=>{
    loadAllTasks();
  },[])
  return <HomeScreen />;
}