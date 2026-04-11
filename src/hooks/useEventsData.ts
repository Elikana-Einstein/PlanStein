import { Event } from '@/shared/types';
import { useEventsStore } from '@/stores/eventStore';
import { useState, useMemo, useEffect } from 'react';

type Filter = 'all' | 'today' | 'upcoming' | 'recurrent';   

export const useEventsData = () => {
  const { events, loadAllEvents, toggleEvent } = useEventsStore();
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    loadAllEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    switch (filter) {
      case 'today':
        return events.filter(e => e.date === 'Today' && !e.completed);
      case 'upcoming':
        return events.filter(e => e.date !== 'Today' && !e.completed);
      case 'recurrent':
        return events.filter(e => e.recurrent);
      default:
        return events;
    }
  }, [events, filter]);

  const groupedEvents = useMemo(() => {
    if (filter === 'recurrent') {
      return [{ title: 'Recurrent events', data: filteredEvents }];
    }

    // Group by date
    const groups: Record<string, Event[]> = {};
    filteredEvents.forEach(event => {
      const groupKey = event.date; // "Today", "Tomorrow", etc.
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(event);
    });
    // Order: Today, Tomorrow, This week...
    const order = ['Today', 'Tomorrow', 'This week'];
    return order.map(key => ({ title: key, data: groups[key] || [] }));
  }, [filteredEvents, filter]);

  return {
    groupedEvents,
    filter,
    setFilter,
    toggleEvent,
  };
};