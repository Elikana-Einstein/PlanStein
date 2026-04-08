import { generateUUID } from '@/shared/utils';
import { db } from '../db/database';



export const GoalsService = {

  async addGoal(newGoal: { title: string, episodes: { title: string, subgoals: string[] }[] }) {
  
  
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
    const goals = await db.getAllAsync(`SELECT id, title, progress FROM goals`);
    

    //for each goal fetch its episodes and subgoals
    const result  = Promise.all(goals.map(async (goal: any)=>{
      const episodes = await db.getAllAsync(`SELECT * FROM episodes WHERE goal_id = ?`, [goal.id]);
      const episodesWithSubgoals = await Promise.all(episodes.map(async (episode: any)=>{
        const subgoals = await db.getAllAsync(`SELECT * FROM subgoals WHERE episode_id = ?`, [episode.id]);
        return {title: episode.title,subgoals: subgoals.map((sg: any)=>({id: sg.id, description: sg.description, is_completed: sg.is_completed}))};
      }))
      return {id: goal.id, title: goal.title,progress:goal.progress,episodes: episodesWithSubgoals};
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
 
  async updateGoalProgress(goalId: number) {
  try {
    // Get total subgoals and completed subgoals for all episodes under this goal
    const result = await db.getFirstAsync<{
      total: number;
      completed: number;
    }>(
      `SELECT 
        COUNT(s.id) as total,
        SUM(CASE WHEN s.is_completed = 1 THEN 1 ELSE 0 END) as completed
      FROM goals g
      JOIN episodes e ON g.id = e.goal_id
      JOIN subgoals s ON e.id = s.episode_id
      WHERE g.id = ?`,
      [goalId]
    );
    
    const total = result?.total || 0;
    const completed = result?.completed || 0;
    
    // Calculate percentage (avoid division by zero)
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Update the goal's progress
    await db.runAsync(
      `UPDATE goals SET progress = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [progress, goalId]
    );
    
    console.log(`Goal ${goalId} progress updated to ${progress}% (${completed}/${total})`);
    return progress;
  } catch (error) {
    console.error('Error updating goal progress:', error);
    throw error;
  }
},
async toggleSubgoalCompletion(subgoalId: number) {
  try {
    // Get the goal_id before updating
    const subgoalInfo = await db.getFirstAsync<{
      goal_id: number;
      current_status: number;
    }>(
      `SELECT g.id as goal_id, s.is_completed as current_status
      FROM subgoals s
      JOIN episodes e ON s.episode_id = e.id
      JOIN goals g ON e.goal_id = g.id
      WHERE s.id = ?`,
      [subgoalId]
    );
    
    if (!subgoalInfo) {
      throw new Error('Subgoal not found');
    }
    
    // Toggle the subgoal
    const newStatus = subgoalInfo.current_status === 1 ? 0 : 1;
    await db.runAsync(
      `UPDATE subgoals SET is_completed = ? WHERE id = ?`,
      [newStatus, subgoalId]
    );
    
    // Update the goal progress
    const progress = await this.updateGoalProgress(subgoalInfo.goal_id);
    
  } catch (error) {
    console.error('Error toggling subgoal:', error);
    throw error;
  }
},
 async markSubgoalCompleted(subgoalId: number) {

    try {
      
    
    this.toggleSubgoalCompletion(subgoalId);
    } catch (error) {
      console.error('Error marking subgoal completed:', error);
      throw error;
    }
  },





}