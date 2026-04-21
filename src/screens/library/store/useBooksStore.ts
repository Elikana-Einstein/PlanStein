import { create }       from 'zustand';
import { Book, BookPage, BookLesson, BookRecommendation } from '@/shared/types';
import { BookService }  from '../service/BookService';
import { PDFService }   from '../service/PDFService';
import { distillBook, extractBookMeta, getRecommendations } from '@/services/BookAiService';

type ProcessingStep =
  | 'idle'
  | 'reading'
  | 'extracting'
  | 'distilling'
  | 'saving'
  | 'done'
  | 'error';

interface BooksState {
  books:            Book[];
  recommendations:  BookRecommendation[];
  isLoading:        boolean;
  processingStep:   ProcessingStep;
  processingBookId: string | null;
  error:            string | null;

  // Actions
  loadBooks:        () => Promise<void>;
  uploadBook:       (source: 'device' | 'url', url?: string) => Promise<void>;
  loadRecommendations: () => Promise<void>;
  deleteBook:       (id: string) => Promise<void>;
  updateProgress:   (bookId: string, page: number, total: number) => Promise<void>;
}

export const useBooksStore = create<BooksState>((set, get) => ({
  books:            [],
  recommendations:  [],
  isLoading:        false,
  processingStep:   'idle',
  processingBookId: null,
  error:            null,

  loadBooks: async () => {
    set({ isLoading: true });
    try {
      const books = await BookService.getAllBooks();
      set({ books, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  uploadBook: async (source, url) => {
    set({ error: null });

    try {
      // ── Step 1: Pick file ──────────────────────────────────────────────────
      set({ processingStep: 'reading' });

      let pdfUri   = '';
      let pdfName  = 'book.pdf';

      if (source === 'device') {
        const picked = await PDFService.pickPDF();
        if (!picked) { set({ processingStep: 'idle' }); return; }
        pdfUri  = picked.uri;
        pdfName = picked.name;
      } else if (source === 'url' && url) {
        pdfUri = url;
      }

      // ── Step 2: Extract text via AI ────────────────────────────────────────
      set({ processingStep: 'extracting' });
      const base64  = await PDFService.readPDFAsBase64(pdfUri);
      const rawText = await PDFService.extractTextViaAI(base64);

      // ── Step 3: Get metadata ───────────────────────────────────────────────
      const meta = await extractBookMeta(rawText);

      // Create DB record
      const COVER_COLORS = ['#1a2a1a', '#1a1030', '#2a1a08', '#081520', '#2a0a0a'];
      const coverColor   = COVER_COLORS[Math.floor(Math.random() * COVER_COLORS.length)];
      const book = await BookService.createBook({
        title:        meta.title,
        author:       meta.author,
        coverColor,
        originalPages: meta.originalPages,
      });

      set({ processingBookId: book.id });

      // Update books list to show processing state
      set(s => ({ books: [book, ...s.books] }));

      // ── Step 4: Distill ────────────────────────────────────────────────────
      set({ processingStep: 'distilling' });
      const { pages, lessons } = await distillBook(
        book.id, rawText, meta.title, meta.author,
      );

      // ── Step 5: Save to DB ─────────────────────────────────────────────────
      set({ processingStep: 'saving' });
      await BookService.savePages(book.id, pages);
      await BookService.saveLessons(lessons);
      await BookService.updateBookStatus(book.id, 'ready', {
        distilledPages:  pages.length,
        readTimeMinutes: Math.ceil(pages.length * 1.5),
      });

      // ── Done ───────────────────────────────────────────────────────────────
      set({ processingStep: 'done', processingBookId: null });

      // Reload books list
      const updated = await BookService.getAllBooks();
      set({ books: updated });

    } catch (err: any) {
      set({ processingStep: 'error', error: err.message });
    }
  },

  loadRecommendations: async () => {
    try {
      const { books } = get();
      const readBooks = books
        .filter(b => b.status === 'reading' || b.status === 'finished')
        .map(b => ({ title: b.title, author: b.author }));
      const recs = await getRecommendations(readBooks);
      set({ recommendations: recs });
    } catch {
      // silently fail — recommendations are non-critical
    }
  },

  deleteBook: async (id) => {
    await BookService.deleteBook(id);
    set(s => ({ books: s.books.filter(b => b.id !== id) }));
  },

  updateProgress: async (bookId, page, total) => {
    await BookService.updateProgress(bookId, page, total);
    set(s => ({
      books: s.books.map(b =>
        b.id === bookId
          ? { ...b, currentPage: page, progress: Math.round((page / total) * 100) }
          : b
      ),
    }));
  },
}));