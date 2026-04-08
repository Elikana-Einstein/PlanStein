// ─── IDs ──────────────────────────────────────────────────────────────────────
import * as Crypto from 'expo-crypto';

// If you were using it for IDs:
const id = Crypto.randomUUID();
/**
 * Client-side UUID v4 — works without crypto.randomUUID()
 * on older Android versions.
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── TIME ─────────────────────────────────────────────────────────────────────

export function now(): number {
  return Date.now();
}

export function formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function formatDuration(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function todayString(): string {
  return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
}

export function startOfDayMs(date: Date = new Date()): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function friendlyDate(dateStr: string): string {
  const today    = todayString();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  if (dateStr === today)        return 'Today';
  if (dateStr === tomorrowStr)  return 'Tomorrow';

  const date = new Date(dateStr);
  return date.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });
}

export function relativeTime(ms: number): string {
  const diff    = Date.now() - ms;
  const minutes = Math.floor(diff / 60_000);
  const hours   = Math.floor(diff / 3_600_000);
  const days    = Math.floor(diff / 86_400_000);

  if (minutes < 1)  return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours   < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ─── NUMBERS ──────────────────────────────────────────────────────────────────

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function formatCurrency(
  amount:   number,
  currency: string = 'KES'
): string {
  return new Intl.NumberFormat('en-KE', {
    style:                 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ─── STRINGS ──────────────────────────────────────────────────────────────────

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + '…';
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function stripExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}

// ─── ARRAYS ───────────────────────────────────────────────────────────────────

export function parseJsonArray<T>(json: string | null | undefined): T[] {
  if (!json) return [];
  try   { return JSON.parse(json) as T[]; }
  catch { return []; }
}

export function toJsonArray<T>(arr: T[]): string {
  return JSON.stringify(arr);
}

export function groupBy<T>(
  arr:    T[],
  keyFn:  (item: T) => string
): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function uniqueBy<T>(arr: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>();
  return arr.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const generateUUID = () => Crypto.randomUUID();
export const getCurrentTimestamp = () => Date.now();

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const time = date.toLocaleString().slice(-5);
  const isAM = time.includes('am');
  return `${time} ${isAM ? 'am' : 'pm'}`;
}
const date = new Date();
// Helper function
export const isToday = (date: any) => {
  
 
  
  const today = new Date();
  const formattedToday = today.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

   return String(date) === String(formattedToday);
};
