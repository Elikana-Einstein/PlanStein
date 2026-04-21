import { db }          from '@/db/database';
import { Book, BookPage, BookLesson } from '@/shared/types';
import { generateId, now } from '@/shared/utils';

export const BookService = {

  // ─── Books ────────────────────────────────────────────────────────────────

  getAllBooks: async (): Promise<Book[]> => {
    const rows = await db.getAllAsync(
      `SELECT * FROM books ORDER BY updated_at DESC`
    );
    return (rows as Record<string, unknown>[]).map(mapRowToBook);
  },

  getBook: async (id: string): Promise<Book | null> => {
    const rows = await db.getAllAsync(
      `SELECT * FROM books WHERE id = ?`, [id]
    );
    if (!(rows as unknown[]).length) return null;
    return mapRowToBook((rows as Record<string, unknown>[])[0]);
  },

  createBook: async (input: {
    title:        string;
    author:       string;
    coverColor:   string;
    originalPages: number;
  }): Promise<Book> => {
    const id = generateId();
    const ts = now();
    await db.runAsync(
      `INSERT INTO books
         (id, title, author, cover_color, original_pages,
          distilled_pages, read_time_mins, status, progress,
          current_page, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 0, 0, 'processing', 0, 1, ?, ?)`,
      [id, input.title, input.author, input.coverColor,
       input.originalPages, ts, ts]
    );
    return (await BookService.getBook(id))!;
  },

  updateBookStatus: async (
    id:     string,
    status: Book['status'],
    extras?: Partial<Pick<Book, 'distilledPages' | 'readTimeMinutes'>>,
  ): Promise<void> => {
    await db.runAsync(
      `UPDATE books
       SET status         = ?,
           distilled_pages = COALESCE(?, distilled_pages),
           read_time_mins  = COALESCE(?, read_time_mins),
           updated_at      = ?
       WHERE id = ?`,
      [status, extras?.distilledPages ?? null,
       extras?.readTimeMinutes ?? null, now(), id]
    );
  },

  updateProgress: async (
    id:          string,
    currentPage: number,
    totalPages:  number,
  ): Promise<void> => {
    const progress = Math.round((currentPage / totalPages) * 100);
    const status   = progress >= 100 ? 'finished' : 'reading';
    await db.runAsync(
      `UPDATE books
       SET current_page = ?, progress = ?, status = ?, updated_at = ?
       WHERE id = ?`,
      [currentPage, progress, status, now(), id]
    );
  },

  deleteBook: async (id: string): Promise<void> => {
    await db.runAsync(`DELETE FROM books WHERE id = ?`, [id]);
  },

  // ─── Pages ────────────────────────────────────────────────────────────────

  savePages: async (
    bookId: string,
    pages:  Omit<BookPage, 'id' | 'createdAt'>[],
  ): Promise<void> => {
    const ts = now();
    for (const page of pages) {
      await db.runAsync(
        `INSERT INTO book_pages
           (id, book_id, page_number, chapter_title,
            lesson_title, content, highlight, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [generateId(), bookId, page.pageNumber, page.chapterTitle,
         page.lessonTitle, page.content, page.highlight, ts]
      );
    }
  },

  getPages: async (bookId: string): Promise<BookPage[]> => {
    const rows = await db.getAllAsync(
      `SELECT * FROM book_pages
       WHERE book_id = ? ORDER BY page_number ASC`,
      [bookId]
    );
    return (rows as Record<string, unknown>[]).map(mapRowToPage);
  },

  getPage: async (bookId: string, pageNumber: number): Promise<BookPage | null> => {
    const rows = await db.getAllAsync(
      `SELECT * FROM book_pages
       WHERE book_id = ? AND page_number = ?`,
      [bookId, pageNumber]
    );
    if (!(rows as unknown[]).length) return null;
    return mapRowToPage((rows as Record<string, unknown>[])[0]);
  },

  // ─── Lessons ──────────────────────────────────────────────────────────────

  saveLessons: async (lessons: BookLesson[]): Promise<void> => {
    for (const l of lessons) {
      await db.runAsync(
        `INSERT INTO book_lessons (id, book_id, ord, title)
         VALUES (?, ?, ?, ?)`,
        [l.id, l.bookId, l.order, l.title]
      );
    }
  },

  getLessons: async (bookId: string): Promise<BookLesson[]> => {
    const rows = await db.getAllAsync(
      `SELECT * FROM book_lessons
       WHERE book_id = ? ORDER BY ord ASC`,
      [bookId]
    );
    return (rows as Record<string, unknown>[]).map(r => ({
      id:     r.id     as string,
      bookId: r.book_id as string,
      order:  r.ord    as number,
      title:  r.title  as string,
    }));
  },
};

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapRowToBook(r: Record<string, unknown>): Book {
  return {
    id:              r.id              as string,
    title:           r.title           as string,
    author:          r.author          as string,
    coverColor:      r.cover_color     as string,
    originalPages:   r.original_pages  as number,
    distilledPages:  r.distilled_pages as number,
    readTimeMinutes: r.read_time_mins  as number,
    status:          r.status          as Book['status'],
    progress:        r.progress        as number,
    currentPage:     r.current_page    as number,
    createdAt:       r.created_at      as number,
    updatedAt:       r.updated_at      as number,
  };
}

function mapRowToPage(r: Record<string, unknown>): BookPage {
  return {
    id:           r.id            as string,
    bookId:       r.book_id       as string,
    pageNumber:   r.page_number   as number,
    chapterTitle: r.chapter_title as string,
    lessonTitle:  r.lesson_title  as string,
    content:      r.content       as string,
    highlight:    r.highlight     as string,
    createdAt:    r.created_at    as number,
  };
}