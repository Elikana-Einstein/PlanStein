import React from 'react';
import { EventRow } from './EventRow';
import { GroupedList } from '@/shared/components/GroupedList';
import { Event } from '@/shared/types';

type Props = {
  groupedEvents: Array<{ title: string; data: Event[] }>;
  onToggleEvent: (id: string) => void;
};

export const EventsList: React.FC<Props> = ({ groupedEvents, onToggleEvent }) => {
  const renderItem = (event: Event, index: number) => (
    <EventRow key={event.id} event={event} onToggle={onToggleEvent} />
  );

  const sections = groupedEvents.map((group) => ({
    ...group,
    section: 'event',
  }));

  return (
    <GroupedList
      sections={sections}
      renderItem={renderItem}
      keyExtractor={(event) => event.id}
      section='event'
    />
  );
};