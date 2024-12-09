/**
 * stores/events.js
 * 
 * Store for events; 
 * It manages the state of the events and provides actions to add, update, and delete events.
 */

import { defineStore } from 'pinia';

export const useEventsStore = defineStore('events', {
    state: () => ({
        events: [],
    }),
    actions: {
        setEvents(events) {
            this.events = events;
            this.saveToLocalStorage();
        },
        addEvent(event) {
            this.events.push(event);
            this.saveToLocalStorage();
        },
        updateEvent(updatedEvent) {
            const index = this.events.findIndex(event => event.id === updatedEvent.id);
            if (index !== -1) {
                this.events.splice(index, 1, updatedEvent);
                this.saveToLocalStorage();
            }
        },
        deleteEvent(eventToDelete) {
            this.events = this.events.filter(event => event.id !== eventToDelete.id);
            this.saveToLocalStorage();
        },

        loadFromLocalStorage() {
            const storedEvents = localStorage.getItem('calendarEvents');
            if (storedEvents) {
                this.events = JSON.parse(storedEvents).map(event => ({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end),
                }));
            }
        },
        saveToLocalStorage() {
            localStorage.setItem('calendarEvents', JSON.stringify(this.events));
        },
    },
});
