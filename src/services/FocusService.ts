import { db } from '@/db/database';
import { FocusSession } from '../shared/types/index';
import { generateId } from '@/shared/utils';

export const FocusService = {



  saveSession: async (session: Omit<FocusSession, 'id'>): Promise<void> => {
    await db.runAsync(
      `INSERT INTO focus_sessions
         (id, started_at, ended_at, duration_mins, phase, mode, was_completed, track_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        generateId(),
        session.startedAt,
        session.endedAt,
        session.durationMins,
        session.phase,
        session.mode,
        session.wasCompleted ? 1 : 0,
        session.trackId ?? null,
      ]
    );
  },

  getTodaySessions: async (): Promise<FocusSession[]> => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const rows = await db.getAllAsync(
      `SELECT * FROM focus_sessions WHERE started_at >= ? ORDER BY started_at DESC`,
      [startOfDay.getTime()]
    );

    return (rows as Record<string, unknown>[]).map(row => ({
      id:           row.id           as string,
      startedAt:    row.started_at   as number,
      endedAt:      row.ended_at     as number,
      durationMins: row.duration_mins as number,
      phase:        row.phase        as FocusSession['phase'],
      mode:         row.mode         as FocusSession['mode'],
      wasCompleted: row.was_completed === 1,
      trackId:      row.track_id     as string | undefined,
    }));
  },

  getTotalFocusMinutesToday: async (): Promise<number> => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const rows = await db.getAllAsync(
      `SELECT SUM(duration_mins) as total
       FROM focus_sessions
       WHERE started_at >= ? AND was_completed = 1`,
      [startOfDay.getTime()]
    );

    const row = (rows as Record<string, unknown>[])[0];
    return (row?.total as number) ?? 0;
  },
};