<template>
  <v-sheet class="d-flex" height="54" tile>
    <v-select v-model="type" :items="types" class="ma-2" label="View Mode" variant="outlined" dense
      hide-details></v-select>
    <v-select v-model="weekday" :items="weekdays" class="ma-2" label="Weekdays" variant="outlined" dense hide-details
      item-title="title" item-value="value"></v-select>
    <v-btn class="ma-2" @click="dialog = true" color="primary">Add New Event</v-btn>
  </v-sheet>

  <v-sheet>
    <v-calendar ref="calendar" v-model="value" :events="eventsStore.events" :view-mode="type" :weekdays="weekday">
      <template #event="{ event }">
        <div class="d-flex align-center" :style="{ color: event.color, fontSize: '16px' }">
          <span>{{ event.title }} ({{ formatDate(event.start) }} - {{ formatDate(event.end) }})</span>
          <v-btn icon x-small @click="deleteEvent(event)">
            <v-icon :style="{ color: event.color, fontSize: '12px' }">mdi-delete</v-icon>
          </v-btn>
        </div>
      </template>
    </v-calendar>
  </v-sheet>

  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>Add New Event</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field v-model="newEvent.title" label="Event Name"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-date-input prepend-icon="" label="Date" v-model="newEvent.start"></v-date-input>
            </v-col>
            <v-col>
              <v-date-input prepend-icon="" label="End Date" v-model="newEvent.end"></v-date-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select v-model="newEvent.color" :items="colors" label="Event Color"></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="saveEvent">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useEventsStore } from '@/stores/events';

const type = ref('month');
const types = ['month', 'week', 'day'];
const weekday = ref([0, 1, 2, 3, 4, 5, 6]);
const weekdays = [
  { title: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
  { title: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
  { title: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
];

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

const value = ref([]);
const colors = ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'];

const eventsStore = useEventsStore();
const dialog = ref(false);
const newEvent = ref({
  title: '',
  start: null,
  end: null,
  color: '',
});

const saveEvent = () => {
  if (!newEvent.value.title || !newEvent.value.color || !newEvent.value.start || !newEvent.value.end) {
    alert('Please fill out all fields');
    return;
  }

  if (newEvent.value.start > newEvent.value.end) {
    alert('End date must be after the start date');
    return;
  }

  eventsStore.addEvent({
    title: newEvent.value.title,
    start: newEvent.value.start,
    end: newEvent.value.end,
    color: newEvent.value.color,
  });

  // Reset form
  newEvent.value = {
    title: '',
    start: null,
    end: null,
    color: '',
  };
  dialog.value = false;
};

// Delete an event
const deleteEvent = (eventToDelete) => {
  eventsStore.deleteEvent(eventToDelete);
};

// Load events when the component is mounted
onMounted(() => {
  eventsStore.loadFromLocalStorage();
});
</script>
