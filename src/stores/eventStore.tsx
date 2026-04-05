import { create } from 'zustand';
import { EventsService } from '@/services/EventsService';
import { Event } from '@/shared/types';

interface EventsState {
  events:        Event[];
  isLoading:     boolean;
  error:         string | null;
  loadAllEvents: () => Promise<void>;
  toggleEvent:   (id: string) => Promise<void>;
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events:    [],
  isLoading: false,
  error:     null,

  loadAllEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const events = await EventsService.getAllEvents();
      set({ events, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  toggleEvent: async (id: string) => {
    const current = get().events;
    const target  = current.find(e => e.id === id);
    if (!target) return;

    const newValue = !target.completed;

    set({
      events: current.map(e =>
        e.id === id ? { ...e, completed: newValue } : e
      ),
    });

    try {
      await EventsService.updateCompletion(id, newValue);
    } catch (err: any) {
      set({ events: current, error: err.message });
    }
  },
}));