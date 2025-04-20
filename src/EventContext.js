import React, { createContext, useState, useEffect } from 'react';
import { vendors } from './vendors';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(() => {
    try {
      const savedEvents = localStorage.getItem('events');
      if (!savedEvents) {
        console.log('No events in localStorage, initializing empty array');
        return [];
      }
      const parsedEvents = JSON.parse(savedEvents);
      if (!Array.isArray(parsedEvents)) {
        console.error('localStorage events is not an array, resetting');
        localStorage.removeItem('events');
        return [];
      }
      console.log('Loaded events from localStorage:', parsedEvents);
      return parsedEvents;
    } catch (error) {
      console.error('Error parsing events from localStorage:', error);
      localStorage.removeItem('events');
      return [];
    }
  });

  useEffect(() => {
    try {
      console.log('Saving events to localStorage:', events);
      localStorage.setItem('events', JSON.stringify(events));
    } catch (error) {
      console.error('Error saving events to localStorage:', error);
    }
  }, [events]);

  const addEvent = (event) => {
    // Use the event's ID if provided, otherwise generate a new one
    const newId = event.id || crypto.randomUUID();
    const newEvent = {
      ...event,
      id: newId,
      vendors: event.vendors || [],
    };
    console.log('Adding event with ID:', newId, 'Event:', newEvent);
    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, newEvent];
      console.log('Updated events after add:', updatedEvents);
      return updatedEvents;
    });
    return true;
  };

  const updateEvent = (updatedEvent) => {
    console.log('Updating event with ID:', updatedEvent.id, 'Event:', updatedEvent);
    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.map((event) =>
        event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
      );
      console.log('Updated events after update:', updatedEvents);
      return updatedEvents;
    });
    return true;
  };

  const deleteEvent = (eventId) => {
    console.log('Deleting event with ID:', eventId);
    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.filter((event) => event.id !== eventId);
      console.log('Updated events after delete:', updatedEvents);
      return updatedEvents;
    });
    return true;
  };

  return (
    <EventContext.Provider value={{ events, vendors, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
};