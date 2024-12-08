<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>
              <span class="headline">Schedule</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-text-field
              v-model="searchQuery"
              label="Search Events/Description/Dates"
              variant="outlined"
              dense
              class="mb-4"
              />
              <v-list two-line>
                <v-list-item
                  v-for="(item, index) in filteredScheduleItems"
                  :key="index"
                  class="my-2"
                >
                  <v-list-item-content>
                    <v-list-item-title class="headline">{{ item.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ formatDate(item.date) }}</v-list-item-subtitle>
                    <v-list-item-subtitle v-if="item.description">{{ item.description }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider v-if="index < filteredScheduleItems.length - 1"></v-divider>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useEventsStore } from '@/stores/events';

const eventsStore = useEventsStore();
const searchQuery = ref('');

const scheduleItems = computed(() => {
    return eventsStore.events.map(event => ({
        title: event.title,
        date: event.start,
        description: event.description,
        color: event.color,
    }));
});

const filteredScheduleItems = computed(() => {
  return scheduleItems.value.filter((item) => {
    const query = searchQuery.value.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      formatDate(item.date).toLowerCase().includes(query)
    );
  });
});

const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
};

onMounted(() => {
  eventsStore.loadFromLocalStorage();
});
</script>
