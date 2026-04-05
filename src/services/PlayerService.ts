import { db } from '@/db/database';
import { Track, Playlist } from '../shared/types/index';
import { generateId } from '@/shared/utils';

export const PlayerService = {

 

  // ─── Tracks ───────────────────────────────────────────────────────────────

  saveTrack: async (track: Omit<Track, 'id'>): Promise<Track> => {
    const id = generateId();
    await db.runAsync(
      `INSERT OR REPLACE INTO tracks
         (id, title, artist, uri, duration, source, artwork)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, track.title, track.artist ?? null, track.uri,
       track.duration, track.source, track.artwork ?? null]
    );
    return { id, ...track };
  },

  getAllTracks: async (): Promise<Track[]> => {
    const rows = await db.getAllAsync(`SELECT * FROM tracks ORDER BY title`);
    return (rows as Record<string, unknown>[]).map(mapRowToTrack);
  },

  deleteTrack: async (id: string): Promise<void> => {
    await db.runAsync(`DELETE FROM tracks WHERE id = ?`, [id]);
    await db.runAsync(
      `DELETE FROM playlist_tracks WHERE track_id = ?`, [id]
    );
  },

  // ─── Playlists ────────────────────────────────────────────────────────────

  getPlaylists: async (): Promise<Playlist[]> => {
    const playlists = await db.getAllAsync(
      `SELECT * FROM playlists ORDER BY created_at DESC`
    );
    const result: Playlist[] = [];

    for (const row of playlists as Record<string, unknown>[]) {
      const trackRows = await db.getAllAsync(
        `SELECT track_id FROM playlist_tracks
         WHERE playlist_id = ? ORDER BY position`,
        [row.id as string]
      );
      result.push({
        id:        row.id        as string,
        name:      row.name      as string,
        color:     row.color     as string | undefined,
        trackIds:  (trackRows as Record<string, unknown>[]).map(t => t.track_id as string),
        createdAt: row.created_at as number,
      });
    }
    return result;
  },

  createPlaylist: async (name: string, color?: string): Promise<Playlist> => {
    const id  = generateId();
    const now = Date.now();
    await db.runAsync(
      `INSERT INTO playlists (id, name, color, created_at) VALUES (?, ?, ?, ?)`,
      [id, name, color ?? null, now]
    );
    return { id, name, color, trackIds: [], createdAt: now };
  },

  addTrackToPlaylist: async (
    playlistId: string,
    trackId:    string,
    position:   number
  ): Promise<void> => {
    await db.runAsync(
      `INSERT OR REPLACE INTO playlist_tracks
         (playlist_id, track_id, position)
       VALUES (?, ?, ?)`,
      [playlistId, trackId, position]
    );
  },

  getPlaylistTracks: async (playlistId: string): Promise<Track[]> => {
    const rows = await db.getAllAsync(
      `SELECT t.* FROM tracks t
       JOIN playlist_tracks pt ON pt.track_id = t.id
       WHERE pt.playlist_id = ?
       ORDER BY pt.position`,
      [playlistId]
    );
    return (rows as Record<string, unknown>[]).map(mapRowToTrack);
  },
  deletePlaylist: async (id: string): Promise<void> => {
  await db.runAsync(`DELETE FROM playlists WHERE id = ?`, [id]);
  await db.runAsync(`DELETE FROM playlist_tracks WHERE playlist_id = ?`, [id]);
},

  seedBuiltinTracks: async (): Promise<void> => {
    const builtins: Omit<Track, 'id'>[] = [
      { title: 'Lo-fi Chill Beats',          artist: 'Chillhop Music',   uri: '', duration: 3600, source: 'builtin' },
      { title: 'Deep Focus Instrumentals',    artist: 'Study Music',      uri: '', duration: 7440, source: 'builtin' },
      { title: 'Rain + Thunder Ambience',     artist: 'Nature Sounds',    uri: '', duration: 9600, source: 'builtin' },
      { title: 'Piano Focus',                 artist: 'Instrumental Mix', uri: '', duration: 4200, source: 'builtin' },
    ];
    for (const track of builtins) {
      const id = generateId();
      await db.runAsync(
        `INSERT OR IGNORE INTO tracks
           (id, title, artist, uri, duration, source)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, track.title, track.artist ?? null, track.uri, track.duration, track.source]
      );
    }
  },
};

function mapRowToTrack(row: Record<string, unknown>): Track {
  return {
    id:       row.id       as string,
    title:    row.title    as string,
    artist:   row.artist   as string | undefined,
    uri:      row.uri      as string,
    duration: row.duration as number,
    source:   row.source   as Track['source'],
    artwork:  row.artwork  as string | undefined,
  };
}