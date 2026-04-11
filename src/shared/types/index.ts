export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskTag      = 'Work' | 'Dev' | 'Personal' | 'Health' | string;
export type EventCategory = 'Work' | 'Dev' | 'Personal' | 'Health' | string;

export interface Task {
  id:          string;
  title:       string;
  completed:   boolean;
  priority:    TaskPriority;
  tag:         TaskTag;
  dueDate?:    string;
}

export interface Event {
  id:        string;
  title:     string;
  date:      string;
  category:  EventCategory;
  completed: boolean;
  time?:     string;         // "14:00" — optional, events have times, tasks don't
  recurrent?: boolean;    
}

export interface Habit {
  id:             string;
  name:           string;
  streak:         number;
  color?:         string;
  completedToday: boolean;
  lastSevenDays?: boolean[];
  frequency: string
}

export interface Goal {
  id:       number;
  title:    string;
  episodes: {
    title: string;
    subgoals: {
      id: number;
      description: string;
      is_completed: boolean;
    }[];
  }[];
}

export interface UserPrefs {
  name:            string;
  streak:          number;
  lastSessionDate: string | null;
}

export interface DayScore {
  total:        number;
  delta:        number;
  tasksDone:    number;
  habitsDone:   number;
  focusMinutes: number;
}

export type SessionPhase = 'focus' | 'break' | 'longBreak' | 'idle';

export type SessionMode = 'pomodoro' | 'deepWork' | 'custom';

export interface FocusSession {
  id:           string;
  startedAt:    number;       // unix ms
  endedAt:      number;
  durationMins: number;
  phase:        SessionPhase;
  mode:         SessionMode;
  wasCompleted: boolean;
  trackId?:     string;       // what was playing
}

export interface Track {
  id:       string;
  title:    string;
  artist?:  string;
  uri:      string;           // local file URI or stream URL
  duration: number;           // seconds
  source:   'local' | 'builtin' | 'web';
  artwork?: string;           // local URI or remote URL
}

export interface Playlist {
  id:        string;
  name:      string;
  color?:    string;
  trackIds:  string[];
  createdAt: number;
}

export interface TimerState {
  timeLeft:     number;       // seconds remaining
  isRunning:    boolean;
  phase:        SessionPhase;
  sessionNum:   number;       // current pomodoro number
  totalSessions: number;      // how many pomodoros planned
}

export interface PlayerState {
  currentTrack: Track | null;
  queue:        Track[];
  playlist:     Playlist | null;
  isPlaying:    boolean;
  position:     number;       // seconds into track
  duration:     number;       // total track seconds
  isShuffled:   boolean;
  isRepeating:  boolean;
}

export interface UserProfile {
  name:        string;
  memberSince: number;  // unix ms
}

export interface Achievement {
  id:          string;
  title:       string;
  description: string;
  earned:      boolean;
  earnedAt?:   number;
}

export interface WeeklyReview {
  id:          string;
  weekNumber:  number;
  year:        number;
  note:        string;
  createdAt:   number;
}

export interface MeStats {
  todayTasks:    number;
  todayHabits:   number;
  todayHabitsTotal: number;
  todayFocusMins: number;
  currentStreak:  number;
  bestStreak:     number;
  monthConsistency: number;        // 0–100 percentage
  weekFocusMins:  number;
  weekSessions:   number;
  avgSessionMins: number;
  heatmap:        number[];        // 28 values 0–3 intensity
}
export type AIFeature =
  | 'chat'
  | 'coach'
  | 'breakdown'
  | 'email'
  | 'bedtime'
  | 'focusmix';

export interface ChatMessage {
  id:        string;
  role:      'user' | 'assistant';
  content:   string;
  createdAt: number;
}

export interface DailyBrief {
  message:     string;
  tasksDue:    number;
  habitsCount: number;
  streak:      number;
  generatedAt: number;
}

export interface EmailSummary {
  id:         string;
  subject:    string;
  from:       string;
  summary:    string;
  priority:   'urgent' | 'normal' | 'low';
  receivedAt: number;
}

export interface CoachReport {
  weekSummary:   string;
  strengths:     string[];
  improvements:  string[];
  nextWeekFocus: string;
  generatedAt:   number;
}

export interface BedtimeStory {
  title:       string;
  content:     string;
  readTimeMins: number;
  generatedAt: number;
}

export interface Chat {
  id: string;
  title: string;
  createdAt: number;      // Unix timestamp ms
  updatedAt: number;
  isDeleted?: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  sender: 'user' | 'ai';
  text: string | null;
  timestamp: number;
  hasAttachment: boolean;
  isDeleted?: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  messageId: string;
  fileName: string;
  fileUri: string;
  fileType?: string;
  fileSize?: number;
  createdAt: number;
}

export interface MessageInput {
  chatId: string;
  content:string;
  attachment?:Attachment[];
}