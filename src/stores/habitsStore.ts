import { HabitsService } from "@/services/HabitsService";
import { Habit } from "@/shared/types";
import { create } from "zustand";

interface habitstore{
    habits: Habit[],
    getHabits:()=>Promise<void>
}


export const useHabitStore = create<habitstore>((set,get)=>({
    habits:[],

    getHabits:async () => {
        const habits = await HabitsService.getTodayHabits()
        
        set({habits:habits})
    },

}))