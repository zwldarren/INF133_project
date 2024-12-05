<template>
  <v-sheet class="d-flex" height="54" tile>
    <v-select v-model="type" :items="types" class="ma-2" label="View Mode" variant="outlined" dense
      hide-details></v-select>
    <v-select v-model="weekday" :items="weekdays" class="ma-2" label="Weekdays" variant="outlined" dense hide-details
      item-title="title" item-value="value"></v-select>
    <v-btn class="ma-2" @click="openAddEventDialog" color="primary">Add New Event</v-btn>
  </v-sheet>

  <v-sheet>
    <v-calendar ref="calendar" v-model="value" :events="eventsStore.events" :view-mode="type" :weekdays="weekday">
      <template #event="{ event }">
        <v-sheet @click="openEventDialog(event)" :color="event.color" class="event-block white--text" elevation="1" width="100%">
          {{ event.title }}
        </v-sheet>
      </template>
    </v-calendar>
  </v-sheet>

  <!-- Event Details Dialog -->
  <v-dialog v-model="eventDialog" max-width="500px">
    <v-card>
      <v-card-title>{{ selectedEvent.title }}</v-card-title>
      <v-card-text>
        <div><strong>Time:</strong> {{ formatDate(selectedEvent.start) }} - {{ formatDate(selectedEvent.end) }}</div>
        <div v-if="selectedEvent.description"><strong>Description:</strong> {{ selectedEvent.description }}</div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red" text @click="deleteEvent(selectedEvent)">Delete</v-btn>
        <v-btn color="blue darken-1" text @click="editEvent(selectedEvent)">Edit</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="eventDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Add/Edit Event Dialog -->
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>{{ isEditMode ? 'Edit Event' : 'Add New Event' }}</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field v-model="newEvent.title" label="Event Name"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="newEvent.description" label="Description"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-date-input prepend-icon="" label="Start Time" v-model="newEvent.start" type="datetime">
              </v-date-input>
            </v-col>
            <v-col>
              <v-date-input prepend-icon="" label="End Time" v-model="newEvent.end" type="datetime">
              </v-date-input>
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
        <v-btn color="blue darken-1" text @click="cancelEvent">Cancel</v-btn>
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
  const options = {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  };
  return new Date(date).toLocaleString(undefined, options);
};

const value = ref([]);
const colors = ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'];

const eventsStore = useEventsStore();
const dialog = ref(false);
const eventDialog = ref(false);
const isEditMode = ref(false);
const selectedEvent = ref({});
const newEvent = ref({
  id: null,
  title: '',
  description: '',
  start: null,
  end: null,
  color: '',
});

const openAddEventDialog = () => {
  isEditMode.value = false;
  resetNewEventForm();
  dialog.value = true;
};

const openEventDialog = (event) => {
  selectedEvent.value = { ...event };
  eventDialog.value = true;
};

const cancelEvent = () => {
  resetNewEventForm();
};

const resetNewEventForm = () => {
  newEvent.value = {
    id: null,
    title: '',
    description: '',
    start: null,
    end: null,
    color: '',
  };
  dialog.value = false;
  isEditMode.value = false;
};

const saveEvent = () => {
  if (!newEvent.value.title || !newEvent.value.color || !newEvent.value.start || !newEvent.value.end) {
    alert('Please fill out all fields');
    return;
  }

  if (newEvent.value.start > newEvent.value.end) {
    alert('End date must be after the start date');
    return;
  }

  if (isEditMode.value) {
    eventsStore.updateEvent({ ...newEvent.value });
  } else {
    // Generate a unique ID
    newEvent.value.id = uuidv4();
    eventsStore.addEvent({ ...newEvent.value });
  }


  // Reset form
  newEvent.value = {
    title: '',
    description: '',
    start: null,
    end: null,
    color: '',
  };
  dialog.value = false;
  isEditMode.value = false;
};

const editEvent = (event) => {
  isEditMode.value = true;
  newEvent.value = { ...event };
  dialog.value = true;
  eventDialog.value = false;
};

const deleteEvent = (eventToDelete) => {
  eventsStore.deleteEvent(eventToDelete);
  eventDialog.value = false;
};

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Load events when the component is mounted
onMounted(() => {
  eventsStore.loadFromLocalStorage();
});
</script>

<style scoped>
.event-block {
  padding: 4px 8px;
  cursor: pointer;
  display: inline-block;
  margin-bottom: 4px;
  font-size: 14px;
  line-height: 1.2;
}
</style>
