import * as SQLite from 'expo-sqlite';
import { Task, Event } from '@/shared/types';

export const db = SQLite.openDatabaseSync('app.db');

export const initDatabase = async (): Promise<void> => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    -- ─── Books ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS books (
  id               TEXT PRIMARY KEY,
  title            TEXT NOT NULL,
  author           TEXT NOT NULL DEFAULT 'Unknown',
  cover_color      TEXT NOT NULL DEFAULT '#1a1030',
  original_pages   INTEGER DEFAULT 0,
  distilled_pages  INTEGER DEFAULT 0,
  read_time_mins   INTEGER DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'processing'
                   CHECK(status IN ('processing','ready','reading','finished')),
  progress         INTEGER DEFAULT 0,
  current_page     INTEGER DEFAULT 1,
  created_at       INTEGER NOT NULL,
  updated_at       INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS book_pages (
  id            TEXT PRIMARY KEY,
  book_id       TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  page_number   INTEGER NOT NULL,
  chapter_title TEXT NOT NULL DEFAULT '',
  lesson_title  TEXT NOT NULL DEFAULT '',
  content       TEXT NOT NULL DEFAULT '',
  highlight     TEXT NOT NULL DEFAULT '',
  created_at    INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_book_pages
  ON book_pages(book_id, page_number);

CREATE TABLE IF NOT EXISTS book_lessons (
  id      TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  ord     INTEGER NOT NULL,
  title   TEXT NOT NULL
);

    -- ─── Tasks ────────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS tasks (
      id         TEXT PRIMARY KEY,
      title      TEXT NOT NULL,
      tag        TEXT NOT NULL DEFAULT 'Personal',
      due_date   TEXT,
      completed  INTEGER DEFAULT 0,
      priority   TEXT DEFAULT 'medium',
      is_deleted INTEGER DEFAULT 0
    );

    -- ─── Events ───────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS events (
      id        TEXT PRIMARY KEY,
      title     TEXT NOT NULL,
      date      TEXT NOT NULL,
      time      TEXT,
      recurrent  INTEGER DEFAULT 0,
      reminder_time TEXT,
      category  TEXT NOT NULL DEFAULT 'Personal',
      completed INTEGER DEFAULT 0
    );

    -- ─── Habits ───────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS habits (
      id              TEXT PRIMARY KEY,
      name            TEXT NOT NULL,
      streak          INTEGER DEFAULT 0,
      color           TEXT,
      completed_today INTEGER DEFAULT 0,
      start_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      frequency       TEXT DEFAULT 'daily',
      frequency_config TEXT, 
      target_count    INTEGER DEFAULT 1,
      reminder_time   TEXT,
      is_archived     INTEGER DEFAULT 0,
      is_deleted      INTEGER DEFAULT 0
    );

    -- ─── Habit logs ───────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS habit_logs (
      id         TEXT PRIMARY KEY,
      habit_id   TEXT NOT NULL REFERENCES habits(id),
      date       TEXT NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_habit_log_date
      ON habit_logs(habit_id, date);

  



    -- ─── Focus sessions ───────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS focus_sessions (
      id            TEXT PRIMARY KEY,
      started_at    INTEGER NOT NULL,
      ended_at      INTEGER NOT NULL,
      duration_mins INTEGER NOT NULL,
      phase         TEXT NOT NULL,
      mode          TEXT NOT NULL,
      was_completed INTEGER DEFAULT 0,
      track_id      TEXT
    );


    -- Create goals table
CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create episodes table
CREATE TABLE IF NOT EXISTS episodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
);

-- Create subgoals table
CREATE TABLE IF NOT EXISTS subgoals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    episode_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE
);

-- Optional: indexes for performance
CREATE INDEX IF NOT EXISTS idx_episodes_goal_id ON episodes(goal_id);
CREATE INDEX IF NOT EXISTS idx_subgoals_episode_id ON subgoals(episode_id);

    CREATE INDEX IF NOT EXISTS idx_focus_started
      ON focus_sessions(started_at);

    -- ─── Music / Player ───────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS tracks (
      id       TEXT PRIMARY KEY,
      title    TEXT NOT NULL,
      artist   TEXT,
      uri      TEXT NOT NULL,
      duration INTEGER DEFAULT 0,
      source   TEXT NOT NULL DEFAULT 'local',
      artwork  TEXT
    );

    CREATE TABLE IF NOT EXISTS playlists (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      color      TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS playlist_tracks (
      playlist_id TEXT NOT NULL,
      track_id    TEXT NOT NULL,
      position    INTEGER DEFAULT 0,
      PRIMARY KEY (playlist_id, track_id)
    );

    -- ─── Me / Profile ─────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS user_profile (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS weekly_reviews (
      id          TEXT PRIMARY KEY,
      week_number INTEGER NOT NULL,
      year        INTEGER NOT NULL,
      note        TEXT NOT NULL DEFAULT '',
      created_at  INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id        TEXT PRIMARY KEY,
      earned    INTEGER DEFAULT 0,
      earned_at INTEGER
    );

    -- ─── AI Chats ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chats (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL DEFAULT 'New Chat',
  created_at  INTEGER NOT NULL,                -- Unix timestamp (ms)
  updated_at  INTEGER NOT NULL,                -- Last activity timestamp
  is_deleted  INTEGER DEFAULT 0                -- Soft delete
);

-- ─── Chat Messages ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id            TEXT PRIMARY KEY,
  chat_id       TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender        TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
  text          TEXT,
  timestamp     INTEGER NOT NULL,
  has_attachment INTEGER DEFAULT 0,
  is_deleted    INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS chat_summaries (
  id        TEXT PRIMARY KEY,
  chat_id   TEXT NOT NULL UNIQUE,
  summary   TEXT NOT NULL,
  up_to_message_id TEXT,        -- last message that was summarised
  created_at INTEGER,
  updated_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_messages_chat_id
  ON messages(chat_id);

CREATE INDEX IF NOT EXISTS idx_messages_timestamp
  ON messages(timestamp);

-- ─── Message Attachments (Files) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attachments (
  id          TEXT PRIMARY KEY,
  message_id  TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_uri    TEXT NOT NULL,                  -- local file path or remote URL
  file_type   TEXT,                           -- MIME type
  file_size   INTEGER,
  created_at  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_attachments_message_id
  ON attachments(message_id);

    -- ─── Legacy (keep for now) ─────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS user (
      key   TEXT PRIMARY KEY,
      value TEXT
    );
  `);
};

export const dropAllTables = async (): Promise<void> => {
  await db.execAsync(`
    DROP TABLE IF EXISTS tasks;
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS habits;
    DROP TABLE IF EXISTS habit_logs;
    DROP TABLE IF EXISTS goals;
    DROP TABLE IF EXISTS milestones;
    DROP TABLE IF EXISTS focus_sessions;
    DROP TABLE IF EXISTS tracks;
    DROP TABLE IF EXISTS playlists;
    DROP TABLE IF EXISTS playlist_tracks;
    DROP TABLE IF EXISTS user_profile;
    DROP TABLE IF EXISTS weekly_reviews;
    DROP TABLE IF EXISTS achievements;
    DROP TABLE IF EXISTS user;
    DROP TABLE IF EXISTS book_lessons;
    DROP TABLE IF EXISTS book_pages;
    DROP TABLE IF EXISTS books;
  `);
};

// ─── Row mappers ──────────────────────────────────────────────────────────────

export function mapRowToTask(row: Record<string, unknown>): Task {
  return {
    id:        row.id       as string,
    title:     row.title    as string,
    tag:       row.tag      as string,
    dueDate:   row.due_date as string | undefined,
    completed: row.completed === 1,
    priority:  (row.priority as string ?? 'medium') as Task['priority'],
  };
}

export function mapRowToEvent(row: Record<string, unknown>): Event {
  return {
    id:        row.id       as string,
    title:     row.title    as string,
    date:      row.date     as string,
    time:      row.time     as string | undefined,
    category:  row.category as string,
    completed: row.completed === 1,
  };
}

export const dropATable = async (tableName: string): Promise<void> => {
  await db.execAsync(`DROP TABLE IF EXISTS ${tableName}`);
};