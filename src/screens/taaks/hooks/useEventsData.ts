import { useState, useMemo, useEffect } from 'react';
import { Event } from '@/shared/types';
import { useEventsStore } from '@/stores/eventStore';

type Filter = 'all' | 'today' | 'upcoming' | 'done';

export const useEventsData = () => {
  const { events, loadAllEvents, toggleEvent, isLoading, error } = useEventsStore();
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => { loadAllEvents(); }, []);

  const filteredEvents = useMemo(() => {
    switch (filter) {
      case 'today':    return events.filter(e => e.date === 'Today'    && !e.completed);
      case 'upcoming': return events.filter(e => e.date !== 'Today'    && !e.completed);
      case 'done':     return events.filter(e => e.completed);
      default:         return events.filter(e => !e.completed);
    }
  }, [events, filter]);

  const groupedEvents = useMemo(() => {
    if (filter === 'done') {
      return filteredEvents.length > 0
        ? [{ title: 'Completed', data: filteredEvents }]
        : [];
    }

    const groups: Record<string, Event[]> = {};
    filteredEvents.forEach(event => {
      if (!groups[event.date]) groups[event.date] = [];
      groups[event.date].push(event);
    });

    const order = ['Today', 'Tomorrow', 'This week'];
    return order
      .map(key => ({ title: key, data: groups[key] ?? [] }))
      .filter(group => group.data.length > 0);
  }, [filteredEvents, filter]);

  return { groupedEvents, filter, setFilter, toggleEvent, isLoading, error };
};