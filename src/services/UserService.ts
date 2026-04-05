import { db } from '../db/database';
import { UserPrefs } from '../shared/types';
type UserRow = {
  key: string;
  value: string;
};
export const UserService = {
  getUserPrefs: async (): Promise<UserPrefs> => {
    const rows = await db.getAllAsync<UserRow>(`SELECT key, value FROM user`);
    const prefs: any = {};
    for (const row of rows) {
      prefs[row.key] = row.value;
    }
    return {
      name: prefs.name || 'Elikana',
      streak: parseInt(prefs.streak, 10) || 12,
      lastSessionDate: prefs.lastSessionDate || null,
    };
  },

  setUserPref: async (key: string, value: string) => {
    await db.runAsync(
      `INSERT OR REPLACE INTO user (key, value) VALUES (?, ?)`,
      [key, value]
    );
  },

  seedMockUser: async () => {
    await db.runAsync(`INSERT OR REPLACE INTO user (key, value) VALUES (?, ?)`, ['name', 'Elikana']);
    await db.runAsync(`INSERT OR REPLACE INTO user (key, value) VALUES (?, ?)`, ['streak', '12']);
  },
};