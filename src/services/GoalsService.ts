import { generateUUID } from '@/shared/utils';
import { db } from '../db/database';


export const GoalsService = {

  async addGoal(newGoal: { title: string, episodes: { title: string, subgoals: string[] }[] }) {
  console.log(newGoal);
  
  const { title, episodes } = newGoal;
  
  try {
    // Insert goal; id is autoincrement integer
    const goalResult = await db.runAsync(
      `INSERT INTO goals (title) VALUES (?)`,
      [title]
    );
    const goalId = goalResult.lastInsertRowId;
    
    // Insert episodes
    for (let i = 0; i < episodes.length; i++) {
      const episode = episodes[i];
      const episodeResult = await db.runAsync(
        `INSERT INTO episodes (goal_id, title) VALUES (?, ?)`,
        [goalId, episode.title]
      );
      
      // Insert subgoals for this episode
      for (let j = 0; j < episode.subgoals.length; j++) {
        const subgoal = episode.subgoals[j];
        await db.runAsync(
          `INSERT INTO subgoals (episode_id, description) VALUES (?, ?)`,
          [episodeResult.lastInsertRowId, subgoal]
        );
      }
    }
    
    
  } catch (error) {
    console.error('Error in addGoal:', error);
    throw error;
  }
},
  async getAllGoals() {

    //fetch all goals
    const goals = await db.getAllAsync(`SELECT * FROM goals`);

    //for each goal fetch its episodes and subgoals
    const result  = Promise.all(goals.map(async (goal: any)=>{
      const episodes = await db.getAllAsync(`SELECT * FROM episodes WHERE goal_id = ?`, [goal.id]);
      const episodesWithSubgoals = await Promise.all(episodes.map(async (episode: any)=>{
        const subgoals = await db.getAllAsync(`SELECT * FROM subgoals WHERE episode_id = ?`, [episode.id]);
        return {title: episode.title,subgoals: subgoals.map((sg: any)=>({id: sg.id, description: sg.description, is_completed: sg.is_completed}))};
      }))
      return {id: goal.id, title: goal.title,episodes: episodesWithSubgoals};
    }))
    
    return result;
  }
   ,
   async deleteGoal(goalId: number) {
    try {
      await db.runAsync(`DELETE FROM goals WHERE id = ?`, [goalId]);
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  },
  async markSubgoalCompleted(subgoalId: number) {
    try {
      await db.runAsync(`UPDATE subgoals SET is_completed = 1 WHERE id = ?`, [subgoalId]);
    } catch (error) {
      console.error('Error marking subgoal completed:', error);
      throw error;
    }
  }



}