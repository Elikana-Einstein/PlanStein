import { generateId } from '@/shared/utils';
import { BookPage, BookLesson, BookRecommendation, Book } from '@/shared/types';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL   = 'claude-sonnet-4-20250514';

async function callClaude(
  system:    string,
  user:      string,
  maxTokens: number = 4000,
): Promise<string> {
  const res = await fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:      MODEL,
      max_tokens: maxTokens,
      system,
      messages:   [{ role: 'user', content: user }],
    }),
  });
  if (!res.ok) throw new Error(`AI error ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

// ─── Extract book metadata ────────────────────────────────────────────────────

export async function extractBookMeta(
  rawText: string,
): Promise<{ title: string; author: string; originalPages: number }> {
  const system = `You are a book analyst. Extract metadata from the first portion of a book.
Respond ONLY with JSON. No markdown.
Format: {"title":"...","author":"...","originalPages":0}`;

  const snippet = rawText.slice(0, 3000);
  const raw     = await callClaude(system, snippet, 200);
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return { title: 'Unknown Book', author: 'Unknown', originalPages: 0 };
  }
}

// ─── Distill book into pages ──────────────────────────────────────────────────

export interface DistilledResult {
  lessons: BookLesson[];
  pages:   Omit<BookPage, 'id' | 'createdAt'>[];
}

export async function distillBook(
  bookId:  string,
  rawText: string,
  title:   string,
  author:  string,
): Promise<DistilledResult> {
  const system = `You are an expert book summariser.
Your job is to distill a full book into 8–12 focused pages, each covering one key lesson.
Each page must have:
- A short chapter title (5–7 words)
- A lesson title (the core insight in one sentence)
- Content (3–4 paragraphs, 80–120 words total, plain text no markdown)
- A highlight quote (the most powerful sentence from that lesson, in quotes)

Respond ONLY with valid JSON array. No markdown, no explanation outside JSON.
Format:
[
  {
    "pageNumber": 1,
    "chapterTitle": "...",
    "lessonTitle": "...",
    "content": "...",
    "highlight": "..."
  }
]`;

  const prompt = `Distill this book into key lessons and pages.
Title: ${title}
Author: ${author}
Content:
${rawText.slice(0, 50000)}`;

  const raw   = await callClaude(system, prompt, 4000);
  const clean = raw.replace(/```json|```/g, '').trim();

  let pagesData: any[] = [];
  try {
    pagesData = JSON.parse(clean);
  } catch {
    pagesData = [];
  }

  const pages: Omit<BookPage, 'id' | 'createdAt'>[] = pagesData.map((p: any) => ({
    bookId,
    pageNumber:   p.pageNumber   ?? 1,
    chapterTitle: p.chapterTitle ?? '',
    lessonTitle:  p.lessonTitle  ?? '',
    content:      p.content      ?? '',
    highlight:    p.highlight    ?? '',
  }));

  const lessons: BookLesson[] = pagesData.map((p: any, i: number) => ({
    id:      generateId(),
    bookId,
    order:   i + 1,
    title:   p.lessonTitle ?? `Lesson ${i + 1}`,
  }));

  return { pages, lessons };
}

// ─── Recommendations ──────────────────────────────────────────────────────────

export async function getRecommendations(
  readBooks: Pick<Book, 'title' | 'author'>[],
): Promise<BookRecommendation[]> {
  if (!readBooks.length) return getDefaultRecommendations();

  const system = `You are a book recommendation engine.
Based on the user's reading history, recommend 4 books they would love.
Respond ONLY with valid JSON array. No markdown.
Format:
[
  {
    "title": "...",
    "author": "...",
    "coverColor": "#hex",
    "matchScore": 95,
    "reason": "one sentence why"
  }
]`;

  const bookList = readBooks.map(b => `${b.title} by ${b.author}`).join(', ');
  const raw   = await callClaude(system, `Books read: ${bookList}. Recommend 4 similar books.`, 600);
  const clean = raw.replace(/```json|```/g, '').trim();

  try {
    const data = JSON.parse(clean) as any[];
    return data.map(r => ({
      id:         generateId(),
      title:      r.title      ?? '',
      author:     r.author     ?? '',
      coverColor: r.coverColor ?? '#1a1030',
      matchScore: r.matchScore ?? 80,
      reason:     r.reason     ?? '',
    }));
  } catch {
    return getDefaultRecommendations();
  }
}

function getDefaultRecommendations(): BookRecommendation[] {
  return [
    { id: generateId(), title: 'Atomic Habits',       author: 'James Clear',   coverColor: '#1a1030', matchScore: 96, reason: 'Most recommended for productivity readers' },
    { id: generateId(), title: 'Mindset',              author: 'Carol Dweck',   coverColor: '#0a1f12', matchScore: 91, reason: 'Core growth mindset principles' },
    { id: generateId(), title: "Man's Search for Meaning", author: 'V. Frankl', coverColor: '#2a0a0a', matchScore: 88, reason: 'Profound life philosophy' },
    { id: generateId(), title: '48 Laws of Power',    author: 'R. Greene',     coverColor: '#081520', matchScore: 85, reason: 'Strategic thinking and influence' },
  ];
}