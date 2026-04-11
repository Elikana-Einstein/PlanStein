import { mockHabits } from "@/shared/utils/dummy";
import { useHabitStore } from "@/stores/habitsStore";
import { useEffect, useMemo, useState } from "react";

type Filter = 'All' | 'Daily' | 'Weekly' | 'Monthly';

export const useHabitData = ()=>{
    const {habits,getHabits}=useHabitStore()
    const [filter, setFilter] = useState<Filter>('All');
    
    useEffect(()=>{
        getHabits();
    },[])

    const filteredHabits = useMemo(()=>{
      if (filter === 'All'){
            return habits
      }else{
        return  habits.filter(e=> e.frequency === filter)
      }
        
    },[habits,filter])
    
    return{
        filter,
        setFilter,
        filteredHabits,
    }
}