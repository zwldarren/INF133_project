<template>
    <v-layout>
        <v-card-title>Schedule</v-card-title>
        <v-card>
            <v-list-item v-for="(item, index) in scheduleItems" :key="index">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ formatDate(item.date) }}</v-list-item-subtitle>
            </v-list-item>
        </v-card>
    </v-layout>
</template>

<script setup>
import { computed } from 'vue';
import { useEventsStore } from '@/stores/events';

const eventsStore = useEventsStore();

const scheduleItems = computed(() => {
    return eventsStore.events.map(event => ({
        title: event.title,
        date: event.start,
    }));
});

const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
};
</script>
