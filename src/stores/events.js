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
        deleteEvent(eventToDelete) {
            this.events = this.events.filter(event => event !== eventToDelete);
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
