import { db }           from '@/db/database';
import { UserProfile, WeeklyReview, MeStats } from '../shared/types';
import { formatDateForSql, getFormattedDate, startOfDayMs, todayInString, todayString } from '@/shared/utils';
//import { startOfDayMs, todayString }           from '@shared/utils';

export const MeService = {



  // ─── Profile ──────────────────────────────────────────────────────────────

  getProfile: async (): Promise<UserProfile> => {

    const rows = await db.getAllAsync(
      `SELECT key, value FROM user_profile WHERE key IN ('name','member_since')`
    );
    const map: Record<string, string> = {};
    for (const row of rows as { key: string; value: string }[]) {
      map[row.key] = row.value;
    }
    return {
      name:        map['name']        ?? 'You',
      memberSince: parseInt(map['member_since'] ?? String(Date.now()), 10),
    };
  },

  saveProfile: async (profile: Partial<UserProfile>): Promise<void> => {
    if (profile.name !== undefined) {
      await db.runAsync(
        `INSERT OR REPLACE INTO user_profile (key, value) VALUES ('name', ?)`,
        [profile.name]
      );
    }
    if (profile.memberSince !== undefined) {
      await db.runAsync(
        `INSERT OR REPLACE INTO user_profile (key, value) VALUES ('member_since', ?)`,
        [String(profile.memberSince)]
      );
    }
  },

  initProfile: async (name: string): Promise<void> => {
    // Only sets memberSince once — on first launch
    const existing = await db.getAllAsync(
      `SELECT value FROM user_profile WHERE key = 'member_since'`
    );
    if (!(existing as unknown[]).length) {
      await MeService.saveProfile({ name, memberSince: Date.now() });
    } else {
      await MeService.saveProfile({ name });
    }
  },

  // ─── Stats ────────────────────────────────────────────────────────────────

  getStats: async (): Promise<MeStats> => {
    const today          = startOfDayMs();
    const weekStart      = today - 6 * 86_400_000;
    const monthStart     = today - 27 * 86_400_000;

    //
    const taskRows = await db.getAllAsync(
      `SELECT COUNT(*) as total,
              COALESCE(SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END), 0) as done
       FROM tasks
       WHERE due_date = ? AND is_deleted = 0`,
      [todayInString()]
    ) as { total: number; done: number }[];

    const row = taskRows[0] ?? { total: 0, done: 0 };

    const todayTasks = {
      total: row.total,
      done: row.done
    };
    

    // Today habits
    const habitRows = await db.getAllAsync(
      `SELECT COUNT(*) as total FROM habits WHERE is_deleted = 0`
    ) as { total: number }[];
 
 

    // completed habits today
    const habitLogRows = await db.getAllAsync(
      `SELECT COUNT(*) as done
       FROM habit_logs
       WHERE date = ?`,
      [formatDateForSql(new Date())]
    ) as { done: number }[];
    
    const todayHabitsTotal = habitRows[0]?.total ?? 0;
    const todayHabits      = habitLogRows[0]?.done ?? 0;

    // Today focus
    const focusTodayRows = await db.getAllAsync(
      `SELECT COALESCE(SUM(duration_mins), 0) as mins
       FROM focus_sessions
       WHERE started_at >= ? AND was_completed = 1`,
      [today]
    ) as { mins: number }[];
    const todayFocusMins = focusTodayRows[0]?.mins ?? 0;

    // Week focus
    const focusWeekRows = await db.getAllAsync(
      `SELECT COALESCE(SUM(duration_mins), 0) as mins,
              COUNT(*) as sessions
       FROM focus_sessions
       WHERE started_at >= ? AND was_completed = 1`,
      [weekStart]
    ) as { mins: number; sessions: number }[];
    const weekFocusMins = focusWeekRows[0]?.mins     ?? 0;
    const weekSessions  = focusWeekRows[0]?.sessions ?? 0;
    const avgSessionMins = weekSessions > 0
      ? Math.round(weekFocusMins / weekSessions)
      : 0;

    // Streak — count consecutive days with at least one completed task or habit
    const streakRows = await db.getAllAsync(
      `SELECT DISTINCT date FROM habit_logs ORDER BY date DESC LIMIT 60`
    ) as { date: string }[];
    let currentStreak = 0;
    let bestStreak    = 0;
    let temp          = 0;
    const today2      = new Date();
    for (let i = 0; i < streakRows.length; i++) {
      const expected = new Date(today2);
      expected.setDate(expected.getDate() - i);
      const expectedStr = expected.toISOString().split('T')[0];
      if (streakRows[i]?.date === expectedStr) {
        temp++;
        if (i === 0 || currentStreak === i) currentStreak = temp;
        bestStreak = Math.max(bestStreak, temp);
      } else {
        temp = 0;
      }
    }

    // Month consistency — what % of last 28 days had activity
    const activeDaysRows = await db.getAllAsync(
      `SELECT COUNT(DISTINCT date) as active FROM habit_logs
       WHERE date >= ?`,
      [new Date(monthStart).toISOString().split('T')[0]]
    ) as { active: number }[];
    const activeDays       = activeDaysRows[0]?.active ?? 0;
    const monthConsistency = Math.round((activeDays / 28) * 100);

    // Heatmap — 28 days, intensity 0–3
    const heatmapRows = await db.getAllAsync(
      `SELECT date, COUNT(*) as count FROM habit_logs
       WHERE date >= ?
       GROUP BY date`,
      [new Date(monthStart).toISOString().split('T')[0]]
    ) as { date: string; count: number }[];

    const heatmapMap: Record<string, number> = {};
    for (const row of heatmapRows) {
      heatmapMap[row.date] = row.count;
    }

    const heatmap: number[] = [];
    for (let i = 27; i >= 0; i--) {
      const d   = new Date(today - i * 86_400_000);
      const key = d.toISOString().split('T')[0];
      const count = heatmapMap[key] ?? 0;
      heatmap.push(count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : 3);
    }

    return {
      todayTasks,
      todayHabits,
      todayHabitsTotal,
      todayFocusMins,
      currentStreak,
      bestStreak,
      monthConsistency,
      weekFocusMins,
      weekSessions,
      avgSessionMins,
      heatmap,
    };
  },

  // ─── Weekly review ────────────────────────────────────────────────────────

  getCurrentWeekReview: async (): Promise<WeeklyReview | null> => {
    const now        = new Date();
    const weekNumber = getWeekNumber(now);
    const year       = now.getFullYear();

    const rows = await db.getAllAsync(
      `SELECT * FROM weekly_reviews WHERE week_number = ? AND year = ?`,
      [weekNumber, year]
    ) as Record<string, unknown>[];

    if (!rows.length) return null;
    const row = rows[0];
    return {
      id:         row.id         as string,
      weekNumber: row.week_number as number,
      year:       row.year       as number,
      note:       row.note       as string,
      createdAt:  row.created_at as number,
    };
  },

  saveWeeklyReview: async (note: string): Promise<WeeklyReview> => {
    const { generateId } = await import('@/shared/utils');
    const now        = new Date();
    const weekNumber = getWeekNumber(now);
    const year       = now.getFullYear();
    const id         = generateId();
    const createdAt  = Date.now();

    await db.runAsync(
      `INSERT OR REPLACE INTO weekly_reviews
         (id, week_number, year, note, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [id, weekNumber, year, note, createdAt]
    );

    return { id, weekNumber, year, note, createdAt };
  },

  // ─── Data management ──────────────────────────────────────────────────────

  clearAllData: async (): Promise<void> => {
    await db.execAsync(`
      DELETE FROM tasks;
      DELETE FROM events;
      DELETE FROM habits;
      DELETE FROM habit_logs;
      DELETE FROM goals;
      DELETE FROM milestones;
      DELETE FROM focus_sessions;
      DELETE FROM tracks;
      DELETE FROM playlists;
      DELETE FROM playlist_tracks;
      DELETE FROM weekly_reviews;
      DELETE FROM achievements;
    `);
  },

  exportData: async (): Promise<Record<string, unknown>> => {
    const [tasks, habits, habitLogs, focusSessions, goals] = await Promise.all([
      db.getAllAsync(`SELECT * FROM tasks`),
      db.getAllAsync(`SELECT * FROM habits`),
      db.getAllAsync(`SELECT * FROM habit_logs`),
      db.getAllAsync(`SELECT * FROM focus_sessions`),
      db.getAllAsync(`SELECT * FROM goals`),
    ]);

    return {
      exportedAt:    new Date().toISOString(),
      version:       '1.0.0',
      tasks,
      habits,
      habitLogs,
      focusSessions,
      goals,
    };
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getWeekNumber(date: Date): number {
  const d   = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}